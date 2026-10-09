import {type AccessibilityController} from './accessibility.js';
let sequence = 0;
const owners = new WeakSet<HTMLElement>();
/** The target must exclude the toolkit mount and must not be body/html. */
export function attachEffects(controller: AccessibilityController, target: HTMLElement) {
  const doc = target.ownerDocument;
  if (target === doc.body || target === doc.documentElement || owners.has(target)) throw new Error('Use a dedicated content element with one effects owner');
  owners.add(target);
  const token = `wr-${++sequence}`;
  const attr = 'data-web-respect-effects';
  const previous = target.getAttribute(attr);
  target.setAttribute(attr,token);
  const style = doc.createElement('style');
  const mask = doc.createElement('div');
  mask.setAttribute('aria-hidden','true');
  mask.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;display:none';
  doc.head.append(style); doc.body.append(mask);
  const prefix = `[${attr}="${token}"]`;
  const originalFont = parseFloat(doc.defaultView!.getComputedStyle(target).fontSize);
  function apply() {
    const s = controller.get(); const rules: string[] = [];
    const add = (selector:string,css:string) => rules.push(`${selector}{${css}}`);
    if (s.fontSize !== 1) add(prefix,`font-size:${originalFont*s.fontSize}px!important`);
    if (s.lineHeight !== 1.5) add(`${prefix},${prefix} *`,`line-height:${s.lineHeight}!important`);
    if (s.textAlign !== 'left') add(`${prefix},${prefix} :is(p,h1,h2,h3,h4,li)`,`text-align:${s.textAlign}!important`);
    if (s.readableFont) add(`${prefix},${prefix} *`,"font-family:'Comic Sans MS','Chalkboard SE',sans-serif!important;letter-spacing:.05em!important");
    if (s.highlightLinks) add(`${prefix} a`,'background:#ff0!important;color:#000!important;text-decoration:underline!important;padding:2px 4px;border-radius:2px');
    if (s.hideImages) { add(`${prefix} :is(img,picture,[role=img])`,'display:none!important'); add(`${prefix} [style*="background-image"]`,'background-image:none!important'); }
    if (s.stopAnimations) add(`${prefix},${prefix} *,${prefix} *::before,${prefix} *::after`,'animation-play-state:paused!important;transition:none!important;scroll-behavior:auto!important');
    if (s.outlineFocus) add(`${prefix} :focus`,'outline:3px solid #003f4d!important;outline-offset:2px!important');
    if (s.pageStructure) add(`${prefix} :is(header,nav,main,footer,section,article,aside)`,'outline:2px dashed #003f4d!important;outline-offset:-2px');
    if (s.monochrome || s.highContrast) add(prefix,`filter:${s.monochrome?'grayscale(1) ':''}${s.highContrast?'contrast(1.5) brightness(1.1)':''}!important`);
    if (s.largeCursor) add(`${prefix},${prefix} *`,'cursor:crosshair!important');
    style.textContent = rules.join('\n');
    mask.style.display = s.readingMask ? 'block' : 'none';
  }
  const move = (event: PointerEvent) => { mask.style.background = `radial-gradient(circle 100px at ${event.clientX}px ${event.clientY}px,transparent 0%,rgba(0,0,0,.7) 100%)`; };
  doc.addEventListener('pointermove',move); const unsubscribe = controller.subscribe(apply); apply();
  return () => { unsubscribe(); doc.removeEventListener('pointermove',move); style.remove(); mask.remove(); if(previous === null) target.removeAttribute(attr); else target.setAttribute(attr,previous); owners.delete(target); };
}
