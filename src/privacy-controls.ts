import {type ScannerRule} from './scanner.js';
export interface PrivacyControlsOptions {
  /** Kept for source compatibility; diagnostics use scanCookies directly. */
  rules?:readonly ScannerRule[];
  requestDeletion?:()=>Promise<{requestId:string; status:'pending'|'completed'|'restricted'}>;
  labels?:Partial<Record<'scan'|'delete'|'confirm'|'cancel'|'explanation'|'submitting'|'pending'|'completed'|'restricted'|'failed',string>>;
}
/** No network calls unless the visitor confirms and the host supplies requestDeletion. */
export function mountPrivacyControls(target:HTMLElement, options:PrivacyControlsOptions={}) {
  if(!options.requestDeletion)return ()=>{};
  const doc=target.ownerDocument, wrapper=doc.createElement('section');
  const labels={scan:'Cookie Checker / Cookie Scanner',delete:'Request deletion of my data',confirm:'Submit deletion request',cancel:'Cancel',explanation:'Request deletion from this website and its configured providers, including AI services. The website may need to verify your identity. Submission does not confirm deletion.',submitting:'Submitting your request…',pending:'Request received; provider processing is pending.',completed:'The host reports deletion completed.',restricted:'The host reports a retention restriction; contact the website for details.',failed:'Request could not be confirmed. Please retry or contact the website.',...options.labels};
  const output=doc.createElement('div');output.setAttribute('role','status');output.style.whiteSpace='pre-wrap';output.style.overflowWrap='anywhere';
  const button=(label:string)=>{const b=doc.createElement('button');b.type='button';b.textContent=label;wrapper.append(b);return b;};
  let disposed=false;
  if(options.requestDeletion){
    const request=button(labels.delete),confirmation=doc.createElement('div');confirmation.hidden=true;
    const explanation=doc.createElement('p');explanation.textContent=labels.explanation;confirmation.append(explanation);
    const confirm=doc.createElement('button'),cancel=doc.createElement('button');confirm.type=cancel.type='button';confirm.textContent=labels.confirm;cancel.textContent=labels.cancel;confirmation.append(confirm,cancel);wrapper.append(confirmation);
    request.onclick=()=>{confirmation.hidden=false;confirm.focus();};
    cancel.onclick=()=>{confirmation.hidden=true;request.focus();};
    confirm.onclick=async()=>{
      confirm.disabled=cancel.disabled=request.disabled=true;output.textContent=labels.submitting;
      try {const result=await options.requestDeletion!();if(!result.requestId||!['pending','completed','restricted'].includes(result.status))throw new Error('Invalid receipt');if(!disposed)output.textContent=labels[result.status];}
      catch {if(!disposed)output.textContent=labels.failed;}
      finally {if(!disposed){confirm.disabled=cancel.disabled=request.disabled=false;confirmation.hidden=true;request.focus();}}
    };
  }
  wrapper.append(output);target.append(wrapper);
  return ()=>{disposed=true;wrapper.remove();};
}
