import {AccessibilityController, accessibilityDefaults, type AccessibilitySettings} from './accessibility.js';
import {ConsentController, requiredOnly, categories, type ConsentOptions, type Choices, type Category} from './consent.js';
import {type StateOptions} from './state.js';
import {attachEffects} from './effects.js';
import {icons} from './icons.js';
import {locales} from './locales.js';
import {consentLocales} from './consent-locales.js';
import {consentIcon} from './footer-icons.js';
import css from './ui.css';
import {mountPrivacyControls, type PrivacyControlsOptions} from './privacy-controls.js';
export {scanCookies, scannerRules} from './scanner.js';
export {mountPrivacyControls} from './privacy-controls.js';
export interface InventoryItem {name:string; provider:string; storage:string; retention:string; privacyPolicy?:string; category:Category}
export interface BrowserConfig extends StateOptions {
  locale?:string; direction?:'ltr'|'rtl'; brand?:{name:string; url?:string; logo?:string};
  policies?:{cookies?:string; privacy?:string; accessibility?:string; sitemap?:string};
  theme?:Partial<Record<'primary'|'accent'|'surface'|'text'|'border'|'radius',string>>;
  themeVariables?:Partial<Record<'primary'|'accent'|'surface'|'text'|'border'|'radius',string>>;
  dark?:boolean; onThemeChange?:(dark:boolean)=>void; zIndex?:number; placement?:'left'|'right';
  content?:HTMLElement; features?:('accessibility'|'consent')[];
  consent?:Omit<ConsentOptions,'storage'|'namespace'|'storageVersion'>;
  inventory?:InventoryItem[];
  privacy?:PrivacyControlsOptions;
  messages?:Record<string,string>;
  showLauncher?:'always'|'active'|'never'; showBanner?:boolean;
}
export interface Toolkit {accessibility?:AccessibilityController; consent?:ConsentController; open(feature:'accessibility'|'consent'):void; close():void; setTheme(dark:boolean):void; dispose():Promise<void>}
const english:Record<string,string> = {'consent.title':'Cookie Preferences','consent.intro':'Choose which optional services may run. You can withdraw at any time.','consent.bannerTitle':'We use cookies','consent.bannerDescription':'Choose whether to allow optional services. Required site features remain available when you refuse.','consent.cookies':'Cookie Policy','consent.settings':'Cookie Settings','consent.about':'About Cookies','consent.aboutText':'Your choices control configured browser services. See the host privacy notice for purposes, providers, transfers, retention and privacy requests.','consent.essential':'Strictly Necessary','consent.functional':'Functionality','consent.analytics':'Performance','consent.marketing':'Targeting','consent.essentialDescription':'Required site services; these cannot be disabled here.','consent.functionalDescription':'Optional functionality and personalization.','consent.analyticsDescription':'Optional measurement of website use.','consent.marketingDescription':'Optional advertising and campaign measurement.','consent.reject':'Reject All','consent.accept':'Accept All','consent.preferences':'Preferences','consent.cancel':'Cancel','consent.necessary':'Accept Necessary Only','consent.save':'Save Preferences','consent.withdraw':'Withdraw optional consent','consent.empty':'No services declared by this host.','consent.table.name':'Name','consent.table.provider':'Provider','consent.table.storage':'Data Storage','consent.table.retention':'Retention','consent.table.policy':'Privacy Policy','close':'Close'};
const arabic:Record<string,string> = {'consent.title':'تفضيلات ملفات تعريف الارتباط','consent.intro':'اختر الخدمات الاختيارية التي تسمح بتشغيلها. يمكنك سحب موافقتك في أي وقت.','consent.bannerTitle':'نستخدم ملفات تعريف الارتباط','consent.bannerDescription':'اختر السماح بالخدمات الاختيارية. تبقى وظائف الموقع الضرورية متاحة عند الرفض.','consent.cookies':'سياسة ملفات تعريف الارتباط','consent.settings':'إعدادات ملفات تعريف الارتباط','consent.about':'حول ملفات تعريف الارتباط','consent.aboutText':'تتحكم اختياراتك في خدمات المتصفح المحددة. راجع إشعار خصوصية الموقع للأغراض ومقدمي الخدمات والاحتفاظ وطلبات الخصوصية.','consent.essential':'الضرورية فقط','consent.functional':'الوظائف','consent.analytics':'الأداء','consent.marketing':'الاستهداف','consent.essentialDescription':'خدمات الموقع الضرورية؛ لا يمكن تعطيلها هنا.','consent.functionalDescription':'وظائف وتخصيص اختياري.','consent.analyticsDescription':'قياس اختياري لاستخدام الموقع.','consent.marketingDescription':'إعلانات وقياس حملات اختياري.','consent.reject':'رفض الكل','consent.accept':'قبول الكل','consent.preferences':'التفضيلات','consent.cancel':'إلغاء','consent.necessary':'قبول الضرورية فقط','consent.save':'حفظ التفضيلات','consent.withdraw':'سحب الموافقة الاختيارية','consent.empty':'لم يحدد الموقع خدمات.','consent.table.name':'الاسم','consent.table.provider':'المزود','consent.table.storage':'تخزين البيانات','consent.table.retention':'مدة الاحتفاظ','consent.table.policy':'سياسة الخصوصية','close':'إغلاق'};
const escape = (value:unknown) => String(value ?? '').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
function safeUrl(value?:string) { if (!value) return ''; if (/^(https?:\/\/|\/(?!\/)|#)/i.test(value)) return escape(value); throw new Error('Only HTTP(S), root-relative and fragment URLs are supported'); }
const closeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" d="M6 18 18 6M6 6l12 12"/></svg>';
const resetIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" d="M4 4v5h5m-5 0a8 8 0 1 1 0 6"/></svg>';
export function mount(target:HTMLElement, config:BrowserConfig = {}):Toolkit {
  const doc = target.ownerDocument; const win = doc.defaultView!;
  if (config.content?.contains(target)) throw new Error('Mount must be outside the effects target');
  let storage = config.storage;
  if (!storage) { try { storage = win.localStorage; } catch(error) { config.onError?.(error); } }
  const base = {...config,storage}; const features = config.features ?? ['accessibility','consent'];
  const accessibility = features.includes('accessibility') ? new AccessibilityController(base) : undefined;
  const consent = features.includes('consent') ? new ConsentController({...base,policyVersion:'1',...config.consent}) : undefined;
  const host = doc.createElement('div'); target.append(host); const root = host.attachShadow({mode:'open'});
  const locale = config.locale ?? doc.documentElement.lang ?? 'en';
  const dictionary = locales[locale] ?? locales[locale.split('-')[0]] ?? locales.en;
  function t(key:string):string {
    if(config.messages?.[key]) return config.messages[key];
    if(key.startsWith('consent.') || key === 'close') return (locale.startsWith('ar') ? arabic[key] : undefined) ?? (consentLocales[locale] ?? consentLocales[locale.split('-')[0]])?.[key] ?? english[key] ?? key;
    return key.split('.').reduce((value:any,part)=>value?.[part],dictionary) ?? key;
  }
  host.dir = config.direction ?? (locale.startsWith('ar') ? 'rtl' : 'ltr'); host.lang = locale;
  const style = doc.createElement('style'); style.textContent = css; root.append(style);
  const container = doc.createElement('div'); root.append(container);
  host.style.setProperty('--wr-z-index',String(config.zIndex ?? 10000));
  for(const [name,value] of Object.entries(config.themeVariables ?? {})) host.style.setProperty('--wr-'+name,`var(${value})`);
  for(const [name,value] of Object.entries(config.theme ?? {})) host.style.setProperty('--wr-'+name,value!);
  let dark = config.dark ?? false;
  const overrides = new Set(Object.keys(config.theme ?? {}).concat(Object.keys(config.themeVariables ?? {})));
  function setTheme(value:boolean) { dark=value; for(const [name,color] of Object.entries(value ? {surface:'#111827',text:'#fff',border:'#374151',muted:'#d1d5db',tile:'#1f2937',primary:'#006980'} : {surface:'#fff',text:'#111827',border:'#e5e7eb',muted:'#4b5563',tile:'#f9fafb',primary:'#003f4d'})) if(!overrides.has(name)) host.style.setProperty('--wr-'+name,color); }
  setTheme(dark);
  let current:HTMLDialogElement|undefined; let returnFocus:HTMLElement|undefined; let disposed=false;
  const cleanup: (()=>void)[] = [];
  if(accessibility && config.content) cleanup.push(attachEffects(accessibility,config.content));
  function link(label:string,url?:string) { return url ? `<a href="${safeUrl(url)}">${escape(label)}</a>` : ''; }
  function credit() { const brand=config.brand ?? {name:'Web Respect'}; return `${brand.logo?`<img src="${safeUrl(brand.logo)}" alt="">`:''}${link(brand.name,brand.url) || escape(brand.name)}`; }
  const action = (name:string,label:string,primary=false) => `<button type="button" class="action${primary?' primary':''}" data-action="${name}">${escape(t(label))}</button>`;
  const controls: [keyof AccessibilitySettings|'theme',string,string][] = [['fontSize','content.biggerText','content'],['lineHeight','content.biggerLineHeight','content'],['textAlign','content.textAlign','content'],['readableFont','content.readableFont','content'],['pageStructure','orientation.pageStructure','orientation'],['readingMask','orientation.readingMask','orientation'],['hideImages','orientation.hideImages','orientation'],['stopAnimations','orientation.pauseAnimations','orientation'],['highlightLinks','orientation.highlightLinks','orientation'],['outlineFocus','orientation.outlineFocus','orientation'],['theme','color.lightMode','color'],['monochrome','color.greyscale','color'],['highContrast','color.contrast','color']];
  function render() {
    const active = accessibility && Object.entries(accessibility.get()).some(([key,value])=>value !== accessibilityDefaults[key as keyof AccessibilitySettings]);
    container.innerHTML = `${accessibility && (config.showLauncher === 'always' || (config.showLauncher !== 'never' && active)) ? `<button class="launcher" data-action="accessibility" aria-label="${escape(t('title'))}" style="${config.placement==='left'?'inset-inline-start:24px;inset-inline-end:auto':''}">${icons.accessibility}</button>`:''}${consent && config.showBanner !== false && !consent.get() ? `<aside class="banner" aria-label="${escape(t('consent.bannerTitle'))}"><div class="banner-inner"><div><h3>${escape(t('consent.bannerTitle'))}</h3><p>${escape(t('consent.bannerDescription'))} ${link(t('consent.cookies'),config.policies?.cookies)}</p></div><div class="actions">${action('reject','consent.reject')}${action('consent','consent.preferences')}${action('accept','consent.accept',true)}</div></div></aside>`:''}`;
  }
  let removePrivacy:(()=>void)|undefined;
  function close() { removePrivacy?.(); removePrivacy=undefined; if(!current) return; current.close(); current.remove(); current=undefined; returnFocus?.focus(); }
  function open(feature:'accessibility'|'consent') {
    if(disposed) throw new Error('Toolkit disposed');
    if ((feature==='accessibility' && !accessibility) || (feature==='consent' && !consent)) throw new Error('Feature not mounted');
    close(); returnFocus=(root.activeElement ?? doc.activeElement) as HTMLElement;
    const dialog=doc.createElement('dialog'); current=dialog; dialog.className=feature==='accessibility'?'drawer':'consent'; dialog.setAttribute('aria-labelledby','wr-title');
    if(feature==='accessibility') {
      dialog.innerHTML=`<header class="header"><div class="title">${icons.accessibility}<h2 id="wr-title">${escape(t('title'))}</h2></div><div><button class="icon-button" data-action="reset" aria-label="${escape(t('reset'))}">${resetIcon}</button><button class="icon-button" data-action="close" aria-label="${escape(t('close'))}">${closeIcon}</button></div></header><div class="content">${['content','orientation','color'].map(section=>`<section class="section ${section==='content'?'compact':''}"><h3>${escape(t('sections.'+({content:'contentAdjustments',orientation:'orientationAdjustments',color:'colorAdjustments'}[section])))}</h3><div class="grid">${controls.filter(control=>control[2]===section).map(([key,label])=>`<button class="tile" data-setting="${key}" aria-pressed="false" ${key==='theme'&&!config.onThemeChange?'disabled':''}>${key==='fontSize'?'<span class="symbol">T<small>r</small></span>':key==='readableFont'?'<span class="symbol">Aa</span>':key==='theme'?icons.moon:icons[key]}<span>${escape(t(label))}</span></button>`).join('')}</div></section>`).join('')}</div><footer class="footer"><div>${escape(t('footer.poweredBy'))} ${credit()}</div><div>${link(t('footer.statement'),config.policies?.accessibility)} ${link(t('footer.sitemap'),config.policies?.sitemap)}</div></footer>`;
      syncButtons();
    } else {
      const choices=consent!.get()?.choices ?? requiredOnly();
      dialog.innerHTML=`<div class="consent-head"><h2 id="wr-title">${escape(t('consent.title'))}</h2><button class="icon-button" data-action="close" aria-label="${escape(t('close'))}">${closeIcon}</button></div><p class="intro">${escape(t('consent.intro'))} ${link(t('consent.cookies'),config.policies?.cookies)}</p><div class="tabs" role="tablist"><button role="tab" class="tab" data-tab="settings" aria-selected="true" aria-controls="settings">${escape(t('consent.settings'))}</button><button role="tab" class="tab" data-tab="about" aria-selected="false" aria-controls="about" tabindex="-1">${escape(t('consent.about'))}</button></div><div id="settings" role="tabpanel">${categories.map(category=>`<div class="category"><div><button class="category-toggle" data-expand="${category}" aria-expanded="false">${escape(t('consent.'+category))}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" d="m6 9 6 6 6-6"/></svg></button><p>${escape(t('consent.'+category+'Description'))}</p><div class="table-scroll" data-services="${category}" hidden>${table(category)}</div></div><label class="switch"><input type="checkbox" data-category="${category}" aria-label="${escape(t('consent.'+category))}" ${choices[category]?'checked':''} ${category==='essential'?'disabled':''}></label></div>`).join('')}</div><div id="about" role="tabpanel" hidden><p>${escape(t('consent.aboutText'))} ${link('Privacy Policy',config.policies?.privacy)}</p></div><div class="actions">${action('close','consent.cancel')}${action('reject','consent.necessary')}${action('save','consent.save',true)}</div><button class="icon-button" data-action="withdraw">${escape(t('consent.withdraw'))}</button><div class="credit">${credit()}</div>`;
    }
    if(feature==='consent' && config.privacy)removePrivacy=mountPrivacyControls(dialog,config.privacy);
    root.append(dialog); dialog.showModal(); dialog.querySelector<HTMLElement>('[data-action=close]')?.focus();
    dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
    dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close();}});
    dialog.addEventListener('keydown',event=>{
      if(event.key==='Tab') { const focusable=Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),summary')).filter(el=>!el.closest('[hidden]') && el.getClientRects().length); const first=focusable[0],last=focusable.at(-1); if(event.shiftKey&&root.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&root.activeElement===last){event.preventDefault();first?.focus();} }
      if((event.key==='ArrowLeft'||event.key==='ArrowRight') && (event.target as HTMLElement).matches('[role=tab]')) {event.preventDefault();const other=dialog.querySelector<HTMLButtonElement>(`[data-tab="${(event.target as HTMLElement).dataset.tab==='about'?'settings':'about'}"]`)!;other.click();other.focus();}
    });
  }
  function table(category:Category) {
    const items=(config.inventory ?? []).filter(item=>item.category===category);
    if(!items.length) return `<p>${escape(t('consent.empty'))}</p>`;
    return `<table><thead><tr>${['name','provider','storage','retention','policy'].map(key=>`<th>${escape(t('consent.table.'+key))}</th>`).join('')}</tr></thead><tbody>${items.map(item=>`<tr><td>${escape(item.name)}</td><td>${escape(item.provider)}</td><td>${escape(item.storage)}</td><td>${escape(item.retention)}</td><td>${link(t('consent.table.policy'),item.privacyPolicy)}</td></tr>`).join('')}</tbody></table>`;
  }
  function syncButtons() { if(!accessibility) return; const settings=accessibility.get(); current?.querySelectorAll<HTMLButtonElement>('[data-setting]').forEach(button=>{const key=button.dataset.setting as keyof AccessibilitySettings|'theme';const active=key==='theme'?dark:settings[key]!==accessibilityDefaults[key];button.setAttribute('aria-pressed',String(active));if(key==='theme'){button.querySelector('svg')?.remove();button.insertAdjacentHTML('afterbegin',dark?icons.sun:icons.moon);button.querySelector('span')!.textContent=t(dark?'color.lightMode':'color.darkMode');}if(['fontSize','lineHeight','textAlign'].includes(key))button.setAttribute('aria-label',`${button.textContent} ${settings[key as keyof AccessibilitySettings]}`);}); }
  root.addEventListener('click',event=> {
    const button=(event.target as Element).closest<HTMLElement>('[data-action],[data-setting],[data-tab],[data-expand]'); if(!button)return;
    if(button.dataset.expand){const expanded=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!expanded));current!.querySelector('[data-services="'+button.dataset.expand+'"]')!.toggleAttribute('hidden',expanded);return;}
    if(button.dataset.setting && accessibility) {
      const key=button.dataset.setting as keyof AccessibilitySettings|'theme'; const s=accessibility.get();
      if(key==='theme'){config.onThemeChange?.(!dark);setTheme(!dark);syncButtons();return;}
      const cycles:Partial<Record<keyof AccessibilitySettings,unknown[]>>={fontSize:[.875,1,1.125,1.25,1.5,2],lineHeight:[1.2,1.5,2,2.5],textAlign:['left','center','justify']};
      const values=cycles[key];const value=values?values[(values.indexOf(s[key])+1)%values.length]:!s[key];accessibility.update({[key]:value});return;
    }
    if(button.dataset.tab){current?.querySelectorAll<HTMLElement>('[data-tab]').forEach(el=>{const selected=el===button;el.setAttribute('aria-selected',String(selected));el.tabIndex=selected?0:-1;});current!.querySelector<HTMLElement>('#settings')!.hidden=button.dataset.tab!=='settings';current!.querySelector<HTMLElement>('#about')!.hidden=button.dataset.tab!=='about';return;}
    switch(button.dataset.action){case 'accessibility':open('accessibility');break;case 'consent':open('consent');break;case 'close':close();break;case 'reset':accessibility?.reset();break;case 'accept':void consent?.acceptAll();close();break;case 'reject':void consent?.rejectAll();close();break;case 'withdraw':void consent?.withdraw();close();break;case 'save':{const choices=requiredOnly();current?.querySelectorAll<HTMLInputElement>('[data-category]').forEach(input=>choices[input.dataset.category as Category]=input.checked);void consent?.update(choices);close();break;}}
  });
  if(accessibility) cleanup.push(accessibility.subscribe(()=>{syncButtons();render();}));
  if(consent) cleanup.push(consent.subscribe(render));
  const onStorage=(event:StorageEvent)=>{if(event.key===null || event.key===accessibility?.key)accessibility?.refresh();if(event.key===null || event.key===consent?.key)consent?.refresh();};win.addEventListener('storage',onStorage);cleanup.push(()=>win.removeEventListener('storage',onStorage));
  render();
  return {accessibility,consent,open,close,setTheme,async dispose(){if(disposed)return;disposed=true;close();cleanup.forEach(fn=>fn());accessibility?.dispose();await consent?.dispose();host.remove();}};
}
/** Registration is explicitly client-only; imports remain SSR safe. */
export function register(win:Window & typeof globalThis=window) {
  if(win.customElements.get('web-respect'))return;
  class WebRespectElement extends win.HTMLElement {
    config:BrowserConfig={}; toolkit?:Toolkit;
    private teardown:Promise<void>=Promise.resolve();
    connectedCallback(){void this.teardown.then(()=>{if(this.isConnected&&!this.toolkit)this.toolkit=mount(this,this.config);});}
    disconnectedCallback(){const previous=this.toolkit;this.toolkit=undefined;this.teardown=this.teardown.then(()=>previous?.dispose());}
    open(feature:'accessibility'|'consent'){this.toolkit?.open(feature);}
  }
  win.customElements.define('web-respect',WebRespectElement);
}
export interface FooterOptions {locale?:string; accessibilityLabel?:string; consentLabel?:string; mcp?:string; feed?:string; discoverLinks?:boolean}
/** Adds removable footer controls. Discovery reads declared links; it makes no requests. */
export function mountFooter(target:HTMLElement, toolkit:Toolkit, options:FooterOptions={}) {
  const doc=target.ownerDocument; const locale=options.locale ?? doc.documentElement.lang;
  const a=locales[locale] ?? locales[locale.split('-')[0]] ?? locales.en;
  const c=consentLocales[locale] ?? consentLocales[locale.split('-')[0]] ?? consentLocales.en;
  const wrapper=doc.createElement('span'); wrapper.className='web-respect-footer';
  const create=(label:string,svg:string,feature:'accessibility'|'consent')=>{const button=doc.createElement('button');button.type='button';button.style.cssText='display:inline-flex;align-items:center;gap:6px;background:none;border:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer';button.innerHTML=svg;button.querySelector('svg')!.style.cssText='width:20px;height:20px';button.querySelector('svg')!.setAttribute('aria-hidden','true');button.append(doc.createTextNode(label));button.onclick=()=>toolkit.open(feature);wrapper.append(button);};
  if(toolkit.consent)create(options.consentLabel ?? c['consent.preferences'],consentIcon,'consent');
  if(toolkit.accessibility)create(options.accessibilityLabel ?? a.title,icons.accessibility,'accessibility');
  const feed=options.feed ?? (options.discoverLinks?doc.querySelector<HTMLLinkElement>('link[rel="alternate"][type="application/rss+xml"],link[rel="alternate"][type="application/atom+xml"],link[rel="alternate"][type="application/feed+json"]')?.getAttribute('href'):undefined);
  const mcp=options.mcp ?? (options.discoverLinks?doc.querySelector<HTMLLinkElement>('link[rel="mcp"]')?.getAttribute('href'):undefined);
  for(const [name,url] of ([['MCP',mcp],['Feed',feed]] as const))if(url){const anchor=doc.createElement('a');anchor.href=safeUrl(url).replace(/&amp;/g,'&');anchor.textContent=name;anchor.style.marginInlineStart='12px';wrapper.append(anchor);}
  target.append(wrapper);return()=>wrapper.remove();
}
/** Reads an explicit logo marker or the site's declared icon. Never guesses arbitrary images. */
export function discoverBrand(doc:Document) { const logo=doc.querySelector<HTMLImageElement>('img[data-web-respect-logo]')?.getAttribute('src') ?? doc.querySelector<HTMLLinkElement>('link[rel="icon"]')?.getAttribute('href');return {name:doc.title,logo:logo || undefined}; }


