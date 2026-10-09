import {createRoot} from 'react-dom/client';
import {useState,useCallback} from 'react';
import {WebRespect} from '../../dist/react.js';
import type {Toolkit} from '../../dist/browser.js';
const config={namespace:'wr-react',showLauncher:'always' as const,consent:{policyVersion:'1'}};
function App(){const [toolkit,setToolkit]=useState<Toolkit>();const ready=useCallback((value:Toolkit)=>setToolkit(value),[]);return <><h1>React integration</h1><button onClick={()=>toolkit?.open('accessibility')}>Accessibility</button><button onClick={()=>toolkit?.open('consent')}>Consent preferences</button><WebRespect config={config} onReady={ready}/></>;}
createRoot(document.querySelector('#app')!).render(<App/>);
