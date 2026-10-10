/** A local snapshot, never a remote crawl or a complete inventory. */
export interface ScannerRule {id:string; name:string; domains?:string[]; cookiePrefixes?:string[]; storagePrefixes?:string[]}
export interface ScanReport {
  cookieNames:string[]; localStorageKeys:string[]; sessionStorageKeys:string[]; resourceHosts:string[];
  services:{id:string; name:string; evidence:string[]}[]; unavailable:string[]; limitations:string[];
}
export const scannerRules:ScannerRule[] = [
  {id:'google-analytics',name:'Google Analytics (possible)',domains:['google-analytics.com'],cookiePrefixes:['_ga','_gid','_gat']},
  {id:'google-tag-manager',name:'Google Tag Manager (possible)',domains:['googletagmanager.com']},
  {id:'meta-pixel',name:'Meta Pixel (possible)',domains:['connect.facebook.net'],cookiePrefixes:['_fbp','_fbc']},
];
export function scanCookies(doc:Document, rules:readonly ScannerRule[]=scannerRules):ScanReport {
  const unavailable:string[]=[];
  let cookieNames:string[]=[];
  try {cookieNames=doc.cookie.split(';').map(pair=>pair.trim().split('=')[0]).filter(Boolean);} catch {unavailable.push('cookies');}
  const keys=(name:'localStorage'|'sessionStorage')=>{
    const result:string[]=[];
    try {const storage=doc.defaultView?.[name]; if(!storage)throw new Error(); for(let i=0;i<storage.length;i++){const key=storage.key(i);if(key!==null)result.push(key);}} catch {unavailable.push(name);}
    return result;
  };
  const localStorageKeys=keys('localStorage'),sessionStorageKeys=keys('sessionStorage');
  const resourceHosts=new Set<string>();
  const add=(value:string)=>{try{const url=new URL(value,doc.baseURI);if(['https:','http:'].includes(url.protocol))resourceHosts.add(url.hostname);}catch{/* Ignore malformed URLs. */}};
  for(const element of doc.querySelectorAll('[src],link[rel="stylesheet"][href],link[rel="preload"][href],link[rel="modulepreload"][href]'))add(element.getAttribute('src')??element.getAttribute('href')??'');
  try {for(const resource of doc.defaultView?.performance.getEntriesByType('resource')??[])add(resource.name);} catch {unavailable.push('resource timing');}
  const services=rules.flatMap(rule=>{
    const evidence:string[]=[];
    for(const name of cookieNames)if(rule.cookiePrefixes?.some(prefix=>name.startsWith(prefix)))evidence.push('cookie:'+name);
    for(const name of [...localStorageKeys,...sessionStorageKeys])if(rule.storagePrefixes?.some(prefix=>name.startsWith(prefix)))evidence.push('storage:'+name);
    for(const host of resourceHosts)if(rule.domains?.some(domain=>host===domain||host.endsWith('.'+domain)))evidence.push('host:'+host);
    return evidence.length?[{id:rule.id,name:rule.name,evidence:[...new Set(evidence)]}]:[];
  });
  return {cookieNames,localStorageKeys,sessionStorageKeys,resourceHosts:[...resourceHosts],services,unavailable,
    limitations:['Current-page snapshot only; cookie values are discarded and storage values are never accessed. Nothing is transmitted.', 'HttpOnly cookies, other origins, server-side services and AI providers may be invisible.', 'Matches are clues for review, not proof of processing, classification or compliance.']};
}
