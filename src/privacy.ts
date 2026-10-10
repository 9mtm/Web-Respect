/** Server-only orchestration. The host owns authentication, persistence and vendor credentials. */
export interface DeletionContext {requestId:string; subjectId:string}
export interface DeletionProvider {id:string; requestDeletion:(context:DeletionContext)=>Promise<'pending'|'completed'|'restricted'>}
export interface DeletionResult {providerId:string; status:'pending'|'completed'|'restricted'|'failed'}
export interface DeletionOptions {
  authorize:(context:DeletionContext)=>Promise<boolean>;
  providers:readonly DeletionProvider[];
  record:(context:DeletionContext, result:DeletionResult)=>Promise<void>;
}
/** Call from a protected worker with server-resolved subject/provider mappings, never browser input. */
export async function dispatchDeletion(context:DeletionContext, options:DeletionOptions):Promise<DeletionResult[]> {
  if(!context.requestId?.trim()||!context.subjectId?.trim())throw new Error('Server request and subject identifiers required');
  const ids=options.providers.map(provider=>provider.id);
  if(ids.some(id=>!id.trim())||new Set(ids).size!==ids.length)throw new Error('Unique provider identifiers required');
  if(!await options.authorize(context))throw new Error('Deletion request not authorized');
  const results:DeletionResult[]=[];
  for(const provider of options.providers){
    // Persist intent before contacting a provider. Fail closed if the host cannot record it.
    await options.record(context,{providerId:provider.id,status:'pending'});
    let status:DeletionResult['status'];
    try {status=await provider.requestDeletion({...context});if(!['pending','completed','restricted'].includes(status))status='failed';} catch {status='failed';}
    const result={providerId:provider.id,status};await options.record(context,result);results.push(result);
  }
  return results;
}
