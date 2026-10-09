export interface StorageAdapter { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }
export interface StateOptions { namespace?: string; storageVersion?: number; storage?: StorageAdapter; onError?: (error: unknown) => void }
const channels=new WeakMap<StorageAdapter,Map<string,Set<(sender:object)=>void>>>();
export class State<T> {
  protected value: T;
  protected listeners = new Set<(state: T) => void>();
  protected disposed = false;
  readonly key: string;
  private channel?:Set<(sender:object)=>void>;
  private sync=(sender:object)=>{if(sender!==this && !this.disposed)this.refreshShared();};
  constructor(protected options: StateOptions, feature: string, initial: T) {
    this.key = `${options.namespace ?? 'web-respect'}:${feature}`;
    this.value = initial;
    if(options.storage){let keys=channels.get(options.storage);if(!keys){keys=new Map();channels.set(options.storage,keys);}let channel=keys.get(this.key);if(!channel){channel=new Set();keys.set(this.key,channel);}this.channel=channel;channel.add(this.sync);}
  }
  get(): T { return structuredClone(this.value); }
  subscribe(listener: (state: T) => void): () => void { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  protected emit() { for (const listener of this.listeners) listener(this.get()); }
  protected assertLive() { if (this.disposed) throw new Error('Controller disposed'); }
  protected refreshShared() {}
  protected read(): unknown {
    try { const raw = this.options.storage?.getItem(this.key); if (!raw) return null; const data = JSON.parse(raw); return data.version === (this.options.storageVersion ?? 1) ? data.value : null; }
    catch (error) { this.options.onError?.(error); return null; }
  }
  protected persist() {
    try { this.options.storage?.setItem(this.key, JSON.stringify({version: this.options.storageVersion ?? 1, value: this.value})); }
    catch (error) { this.options.onError?.(error); }
    for(const listener of this.channel ?? [])listener(this);
  }
  dispose() { this.disposed = true; this.listeners.clear(); this.channel?.delete(this.sync); }
}
