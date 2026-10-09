import {State, type StateOptions} from './state.js';
export const categories = ['essential','functional','analytics','marketing'] as const;
export type Category = typeof categories[number];
export type Choices = Record<Category, boolean>;
export const requiredOnly = (): Choices => ({essential:true,functional:false,analytics:false,marketing:false});
export interface ConsentRecord { contractVersion: '1'; policyVersion: string; choices: Choices; method: 'banner'|'preferences'|'withdrawal'; clientTime: string; expiresAt: string }
export interface Service { id: string; category: Exclude<Category,'essential'>; start: (signal: AbortSignal) => void|Promise<void>; stop: () => void|Promise<void> }
export interface ConsentOptions extends StateOptions { policyVersion: string; ttlMs?: number; services?: Service[]; now?: () => number; record?: (record: ConsentRecord) => void|Promise<void> }
export function validateChoices(input: unknown): Choices {
  if (!input || typeof input !== 'object') throw new Error('Invalid choices');
  const data = input as Record<string, unknown>;
  if (Object.keys(data).some(key => !(categories as readonly string[]).includes(key)) || categories.some(key => typeof data[key] !== 'boolean') || data.essential !== true) throw new Error('Invalid choices');
  return {...data} as Choices;
}
export function validConsent(input: unknown, policy: string, now: number): input is ConsentRecord {
  try { const r = input as ConsentRecord; validateChoices(r.choices); return r.contractVersion === '1' && r.policyVersion === policy && ['banner','preferences','withdrawal'].includes(r.method) && !(r.method==='withdrawal' && (r.choices.functional||r.choices.analytics||r.choices.marketing)) && Number.isFinite(Date.parse(r.clientTime)) && Date.parse(r.clientTime) <= now && Date.parse(r.expiresAt) > now && Date.parse(r.expiresAt) > Date.parse(r.clientTime) && Date.parse(r.expiresAt)-Date.parse(r.clientTime)<=365*86400000; } catch { return false; }
}
export class ConsentController extends State<ConsentRecord|null> {
  private active = new Map<string, {controller:AbortController; startup:Promise<void>; started:boolean; failed:boolean; immediate?:Promise<void>; finishing?:Promise<void>}>();
  private receipts:Promise<void> = Promise.resolve();
  private queue: Promise<void> = Promise.resolve();
  private timer?: ReturnType<typeof setTimeout>;
  constructor(private config: ConsentOptions) {
    super(config,'consent',null);
    if (!config.policyVersion || config.policyVersion.length > 100) throw new Error('policyVersion required');
    if (config.ttlMs !== undefined && (!Number.isFinite(config.ttlMs) || config.ttlMs <= 0 || config.ttlMs > 365*86400000)) throw new Error('ttlMs must be between zero and one year');
    const ids = new Set<string>();
    for (const service of config.services ?? []) { if (ids.has(service.id) || !categories.includes(service.category) || service.category as string === 'essential') throw new Error('Invalid service'); ids.add(service.id); }
    this.refresh();
  }
  private now() { return (this.config.now ?? Date.now)(); }
  override get() { if (this.value && !validConsent(this.value,this.config.policyVersion,this.now())) { this.value = null; this.reconcile(); } return super.get(); }
  allowed(category: Category) { return category === 'essential' || this.get()?.choices[category] === true; }
  refresh() { this.assertLive(); const raw = this.read(); this.value = validConsent(raw,this.config.policyVersion,this.now()) ? raw : null; this.reconcile(); this.emit(); }
  protected override refreshShared(){this.refresh();}
  update(choices: Choices, method: ConsentRecord['method'] = 'preferences') {
    this.assertLive(); validateChoices(choices);
    if (!['banner','preferences','withdrawal'].includes(method)) throw new Error('Invalid method');
    const now = this.now();
    this.value = {contractVersion:'1',policyVersion:this.config.policyVersion,choices:structuredClone(choices),method,clientTime:new Date(now).toISOString(),expiresAt:new Date(now+(this.config.ttlMs ?? 180*86400000)).toISOString()};
    this.persist(); this.reconcile(); this.emit();
    if (this.config.record) { const record = this.get()!; this.receipts=this.receipts.then(()=>this.config.record!(record)).catch(error=>this.config.onError?.(error)); }
    return this.settled();
  }
  acceptAll() { return this.update({essential:true,functional:true,analytics:true,marketing:true},'banner'); }
  rejectAll() { return this.update(requiredOnly(),'banner'); }
  withdraw() { return this.update(requiredOnly(),'withdrawal'); }
  reset() { return this.withdraw(); }
  private syncService(service:Service):Promise<void> {
    const allow=!this.disposed && this.value?.choices[service.category]===true;
    const entry=this.active.get(service.id);
    if(entry) {
      if(!allow || entry.controller.signal.aborted) {
        entry.controller.abort();
        if(!entry.immediate) {
          const pendingStart=!entry.started;
          entry.immediate=Promise.resolve().then(()=>service.stop()).catch(error=>{this.config.onError?.(error);throw error;});
          // Keep ownership until late initialization ends; no new generation can be stopped by old cleanup.
          entry.finishing=Promise.all([entry.startup,entry.immediate]).then(async()=>{
            if(pendingStart)await service.stop();
            if(this.active.get(service.id)===entry)this.active.delete(service.id);
            if(!entry.failed && !this.disposed && this.value?.choices[service.category])await this.syncService(service);
          }).catch(error=>{this.config.onError?.(error);entry.immediate=undefined;entry.finishing=undefined;});
        }
        // Refusal waits for immediate stop, never an uncooperative pending initializer.
        return (allow?entry.finishing:entry.immediate)!.catch(()=>{});
      }
      return entry.startup;
    }
    if(!allow)return Promise.resolve();
    const created={controller:new AbortController(),startup:Promise.resolve(),started:false,failed:false};
    this.active.set(service.id,created);
    created.startup=Promise.resolve().then(()=>service.start(created.controller.signal)).catch(error=>{created.failed=true;created.controller.abort();this.config.onError?.(error);}).then(()=>{created.started=true;if(created.controller.signal.aborted)void this.syncService(service);});
    return created.startup;
  }
  private reconcile() {
    clearTimeout(this.timer);
    if(this.value && !this.disposed)this.timer=setTimeout(()=>{if(this.value && Date.parse(this.value.expiresAt)<=this.now())this.value=null;this.reconcile();this.emit();},Math.min(2147483647,Date.parse(this.value.expiresAt)-this.now()));
    this.timer?.unref?.();
    this.queue=Promise.all((this.config.services??[]).map(service=>this.syncService(service))).then(()=>{});
  }
  async receiptsSettled(){await this.receipts;}
  async settled() { let pending; do { pending = this.queue; await pending; } while (pending !== this.queue); }
  override async dispose() { super.dispose(); clearTimeout(this.timer); this.reconcile(); clearTimeout(this.timer); await this.settled(); await Promise.all([...this.active.values()].map(entry=>entry.finishing ?? entry.startup)); }
}
