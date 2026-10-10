import test from 'node:test';
import assert from 'node:assert/strict';
import {scanCookies} from '../dist/scanner.js';
import {dispatchDeletion} from '../dist/privacy.js';

test('scanner strips values and URL queries, detects subdomains without lookalike matches',()=>{
  const store={length:1,key:()=> 'session-key'};
  const doc={cookie:'_ga=SECRET; auth=PRIVATE',baseURI:'https://example.test/',defaultView:{localStorage:store,sessionStorage:store,performance:{getEntriesByType:()=>[{name:'https://x.google-analytics.com/event?token=SECRET'},{name:'https://google-analytics.com.attacker.test/event'}]}},querySelectorAll:()=>[]};
  const report=scanCookies(doc);
  assert.deepEqual(report.cookieNames,['_ga','auth']);assert.equal(report.services.length,1);
  assert.ok(!JSON.stringify(report).includes('SECRET'));assert.ok(!JSON.stringify(report).includes('PRIVATE'));
  assert.ok(!report.services[0].evidence.some(e=>e.includes('attacker')));
});
test('scanner handles unavailable storage without claiming full coverage',()=>{
  const doc={get cookie(){throw Error();},baseURI:'https://example.test/',defaultView:{get localStorage(){throw Error();},get sessionStorage(){throw Error();},performance:{getEntriesByType:()=>[]}},querySelectorAll:()=>[]};
  const report=scanCookies(doc);assert.deepEqual(report.unavailable,['cookies','localStorage','sessionStorage']);assert.equal(report.services.length,0);assert.ok(report.limitations.length);
});
test('unauthorized deletion invokes neither provider nor recorder',async()=>{
  let calls=0;
  await assert.rejects(dispatchDeletion({requestId:'r',subjectId:'s'},{authorize:async()=>false,record:async()=>calls++,providers:[{id:'ai',requestDeletion:async()=>{calls++;return 'completed';}}]}),/not authorized/);
  assert.equal(calls,0);
});
test('deletion records intent and distinguishes provider acknowledgement, failure and restrictions',async()=>{
  const records=[];const context={requestId:'r',subjectId:'s'};
  const results=await dispatchDeletion(context,{authorize:async()=>true,record:async(ctx,result)=>records.push({...result}),providers:[{id:'ai',requestDeletion:async(ctx)=>{assert.deepEqual(ctx,context);assert.deepEqual(records.at(-1),{providerId:'ai',status:'pending'});return 'pending';}},{id:'crm',requestDeletion:async()=>{throw Error('secret');}},{id:'billing',requestDeletion:async()=> 'restricted'}]});
  assert.deepEqual(results.map(r=>r.status),['pending','failed','restricted']);assert.equal(records.length,6);assert.ok(!JSON.stringify(records).includes('secret'));
});
test('failed persistence prevents provider dispatch; duplicate providers are rejected',async()=>{
  let calls=0;const provider={id:'ai',requestDeletion:async()=>{calls++;return 'completed';}};
  await assert.rejects(dispatchDeletion({requestId:'r',subjectId:'s'},{authorize:async()=>true,record:async()=>{throw Error('database unavailable');},providers:[provider]}));assert.equal(calls,0);
  await assert.rejects(dispatchDeletion({requestId:'r',subjectId:'s'},{authorize:async()=>true,record:async()=>{},providers:[provider,provider]}),/Unique/);
});
