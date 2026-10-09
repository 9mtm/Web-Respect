'use client';
import {useCallback,useState} from 'react';
import {WebRespect} from '../../../dist/react.js';
const config={namespace:'wr-next',showLauncher:'always',consent:{policyVersion:'1'}};
export default function Client(){const [toolkit,setToolkit]=useState();const ready=useCallback(setToolkit,[]);return <><button onClick={()=>toolkit?.open('accessibility')}>Accessibility</button><button onClick={()=>toolkit?.open('consent')}>Consent preferences</button><WebRespect config={config} onReady={ready}/></>;}
