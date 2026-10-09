import {spawn} from 'node:child_process';
import {readFileSync,mkdirSync,existsSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
import assert from 'node:assert/strict';
import path from 'node:path';
const root=process.cwd();mkdirSync('work/backend-tests',{recursive:true});
const token=randomBytes(24).toString('hex'),admin=randomBytes(24).toString('hex');
const fixtures=JSON.parse(readFileSync('contract/fixtures.json','utf8'));
const localPython=path.join(root,process.platform==='win32'?'work/venv/Scripts/python.exe':'work/venv/bin/python');
const python=process.env.WR_TEST_PYTHON??(existsSync(localPython)?localPython:'python');
const adapters=[['node',process.execPath,['--experimental-strip-types','backends/node/server.ts'],4330],['python',python,['-m','uvicorn','backends.python.app:app','--host','127.0.0.1','--port','4331','--no-access-log'],4331],['php','php',['-S','127.0.0.1:4332','backends/php/router.php'],4332]];
for(const [name,command,args,port]of adapters){
 const child=spawn(command,args,{cwd:root,env:{...process.env,WR_TOKEN:token,WR_ADMIN_TOKEN:admin,WR_DATABASE:path.join(root,`work/backend-tests/${name}-${Date.now()}.sqlite`),PORT:String(port)},stdio:['ignore','pipe','pipe']});let errors='';child.stderr.on('data',chunk=>errors+=chunk);
 try{
  const base=`http://127.0.0.1:${port}`;
  for(let i=0;i<60;i++){try{await fetch(base+'/ready');break;}catch{await new Promise(r=>setTimeout(r,100));}}
  const headers={'Authorization':'Bearer '+token,'X-WR-Subject':'fixture-user','Content-Type':'application/json'};
  const call=(route,options={})=>fetch(base+route,{...options,headers:{...headers,...options.headers}});
  const record={...fixtures.valid,clientTime:new Date().toISOString(),expiresAt:new Date(Date.now()+86400000).toISOString()};
  assert.equal((await fetch(base+'/v1/consents/current')).status,401);
  assert.equal((await call('/v1/consents/current',{headers:{Origin:'https://evil.example'}})).status,403);
  assert.equal((await call('/v1/consents/current')).status,404);
  for(const fixture of fixtures.invalid)assert.equal((await call('/v1/consents',{method:'POST',body:JSON.stringify({...record,...fixture.patch})})).status,422,`${name}: ${fixture.name}`);
  let result=await call('/v1/consents',{method:'POST',body:JSON.stringify(record)});assert.equal(result.status,201);const receipt=await result.json();assert.ok(receipt.id);assert.ok(Date.parse(receipt.receivedAt));assert.deepEqual(receipt.record,record);
  result=await call('/v1/consents/current');assert.equal(result.status,200);assert.equal((await result.json()).valid,true);
  result=await call('/v1/consents/current',{headers:{'X-WR-Subject':'another-user'}});assert.equal(result.status,404);
  const withdrawal={...record,method:'withdrawal',choices:{essential:true,functional:false,analytics:false,marketing:false}};
  assert.equal((await call('/v1/consents',{method:'POST',body:JSON.stringify(withdrawal)})).status,201);
  assert.equal((await (await call('/v1/consents/current')).json()).record.method,'withdrawal');
  assert.equal((await call('/v1/admin/consents',{method:'DELETE'})).status,401);
  const privileged={Authorization:'Bearer '+admin};
  assert.equal((await call('/v1/admin/consents',{method:'DELETE',headers:privileged})).status,200);
  assert.equal((await call('/v1/consents/current')).status,404);
  assert.equal((await call('/v1/admin/retention',{method:'POST',headers:privileged,body:'{}'})).status,200);
  assert.equal((await call('/v1/consents',{method:'POST',body:JSON.stringify({padding:'x'.repeat(9000)})})).status,413);
  let limited=false;for(let i=0;i<65;i++){if((await call('/v1/consents/current',{headers:{'X-WR-Subject':'rate-test'}})).status===429){limited=true;break;}}assert.ok(limited);
  console.log(`${name}: shared schema, choices, withdrawal, origin, auth, isolation, size, rate and deletion PASS`);
 }catch(error){console.error(errors);throw error;}finally{child.kill();}
}
