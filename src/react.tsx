'use client';
import {useEffect,useRef,createElement} from 'react';
import {mount,type BrowserConfig,type Toolkit} from './browser.js';
export function WebRespect({config,onReady}:{config:BrowserConfig;onReady?:(toolkit:Toolkit)=>void}) {
  const ref=useRef<HTMLDivElement>(null);
  const teardown=useRef<Promise<void>>(Promise.resolve());
  useEffect(()=>{let cancelled=false;let toolkit:Toolkit|undefined;const ready=teardown.current.then(()=>{if(!cancelled&&ref.current){toolkit=mount(ref.current,config);onReady?.(toolkit);}});return()=>{cancelled=true;teardown.current=ready.then(()=>toolkit?.dispose());};},[config,onReady]);
  return createElement('div',{ref});
}
