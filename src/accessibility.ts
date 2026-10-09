import {State, type StateOptions} from './state.js';
export const accessibilityDefaults = Object.freeze({fontSize:1 as number, lineHeight:1.5 as number, textAlign:'left' as 'left'|'center'|'justify', readableFont:false, highlightLinks:false, largeCursor:false, readingMask:false, stopAnimations:false, highContrast:false, monochrome:false, hideImages:false, outlineFocus:false, pageStructure:false});
export type AccessibilitySettings = typeof accessibilityDefaults;
export function validateAccessibility(input: unknown): AccessibilitySettings {
  const result = {...accessibilityDefaults};
  if (!input || typeof input !== 'object') return result;
  const data = input as Record<string, unknown>;
  for (const key of Object.keys(result) as (keyof AccessibilitySettings)[]) {
    const value = data[key];
    if (typeof result[key] === 'boolean' && typeof value === 'boolean') (result as Record<string, unknown>)[key] = value;
  }
  if ([0.875,1,1.125,1.25,1.5,2].includes(data.fontSize as number)) result.fontSize = data.fontSize as number;
  if ([1.2,1.5,2,2.5].includes(data.lineHeight as number)) result.lineHeight = data.lineHeight as number;
  if (['left','center','justify'].includes(data.textAlign as string)) result.textAlign = data.textAlign as AccessibilitySettings['textAlign'];
  return result;
}
export class AccessibilityController extends State<AccessibilitySettings> {
  constructor(options: StateOptions = {}) { super(options,'accessibility',{...accessibilityDefaults}); this.refresh(); }
  refresh() { this.assertLive(); this.value = validateAccessibility(this.read()); this.emit(); }
  protected override refreshShared(){this.refresh();}
  update(patch: Partial<AccessibilitySettings>) { this.assertLive(); this.value = validateAccessibility({...this.value,...patch}); this.persist(); this.emit(); }
  reset() { this.update({...accessibilityDefaults}); }
}

