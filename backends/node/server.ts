import express from 'express';
import {DatabaseSync} from 'node:sqlite';
import {randomUUID,timingSafeEqual} from 'node:crypto';
const token=process.env.WR_TOKEN, admin=process.env.WR_ADMIN_TOKEN;
if(!token || !admin || token===admin)throw Error('Distinct WR_TOKEN and WR_ADMIN_TOKEN required; server-to-server only');
const policy=process.env.WR_POLICY_VERSION ?? '1';
const retention=Number(process.env.WR_RETENTION_DAYS ?? 180);
if(!Number.isFinite(retention)||retention<=0||retention>3650)throw Error('Invalid retention');
const db=new DatabaseSync(process.env.WR_DATABASE ?? 'consent.sqlite');
db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS receipts (id TEXT PRIMARY KEY, subject TEXT NOT NULL, received INTEGER NOT NULL, record TEXT NOT NULL); CREATE INDEX IF NOT EXISTS receipts_subject ON receipts(subject,received);');
const app=express(); app.disable('x-powered-by');
app.use((req,res,next)=>{res.setHeader('Cache-Control','no-store');if(req.headers.origin && req.headers.origin !== process.env.WR_ORIGIN)return res.status(403).json({error:'origin_rejected'});next();});
app.use(express.json({limit:'8kb',strict:true}));
const buckets=new Map<string,{count:number;until:number}>();
function secureEqual(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);}
app.use((req,res,next)=>{
  const supplied=req.headers.authorization ?? '';const expected=req.path.startsWith('/v1/admin/')?admin!:token!;
  if(!secureEqual(supplied,'Bearer '+expected))return res.status(401).json({error:'unauthorized'});
  const subject=req.headers['x-wr-subject'];if(typeof subject!=='string'||! /^[A-Za-z0-9_-]{1,128}$/.test(subject))return res.status(400).json({error:'subject_required'});
  const now=Date.now();for(const [key,value]of buckets)if(value.until<=now)buckets.delete(key);
  let bucket=buckets.get(subject);if(!bucket){bucket={count:0,until:now+60000};buckets.set(subject,bucket);}if(++bucket.count>60)return res.status(429).json({error:'rate_limited'});next();
});
function validate(r:any){if(!r||Object.keys(r).sort().join(',')!=='choices,clientTime,contractVersion,expiresAt,method,policyVersion')throw Error();if(r.contractVersion!=='1'||r.policyVersion!==policy||!['banner','preferences','withdrawal'].includes(r.method))throw Error();if(!r.choices||Object.keys(r.choices).sort().join(',')!=='analytics,essential,functional,marketing'||Object.values(r.choices).some(v=>typeof v!=='boolean')||r.choices.essential!==true)throw Error();if(r.method==='withdrawal'&&(r.choices.analytics||r.choices.functional||r.choices.marketing))throw Error();const client=Date.parse(r.clientTime),expiry=Date.parse(r.expiresAt),now=Date.now();if(!Number.isFinite(client)||!Number.isFinite(expiry)||client>now+300000||expiry<=now||expiry<=client||expiry-client>365*86400000)throw Error();}
function receipt(row:any){return {id:row.id,receivedAt:new Date(row.received).toISOString(),record:JSON.parse(row.record)}}
app.post('/v1/consents',(req,res)=>{try{validate(req.body);}catch{return res.status(422).json({error:'invalid_record'});}const now=Date.now(),id=randomUUID();db.prepare('INSERT INTO receipts VALUES(?,?,?,?)').run(id,req.headers['x-wr-subject'] as string,now,JSON.stringify(req.body));res.status(201).json({id,receivedAt:new Date(now).toISOString(),record:req.body});});
app.get('/v1/consents/current',(req,res)=>{const row=db.prepare('SELECT * FROM receipts WHERE subject=? ORDER BY received DESC,rowid DESC LIMIT 1').get(req.headers['x-wr-subject'] as string) as any;if(!row)return res.status(404).json({error:'not_found'});const r=JSON.parse(row.record);res.json({...receipt(row),valid:r.policyVersion===policy&&Date.parse(r.expiresAt)>Date.now()});});
app.delete('/v1/admin/consents',(req,res)=>{const result=db.prepare('DELETE FROM receipts WHERE subject=?').run(req.headers['x-wr-subject'] as string);res.json({deleted:Number(result.changes)});});
app.post('/v1/admin/retention',(req,res)=>{const result=db.prepare('DELETE FROM receipts WHERE received<?').run(Date.now()-retention*86400000);res.json({deleted:Number(result.changes)});});
app.use((_req,res)=>res.status(404).json({error:'not_found'}));
app.use((error:any,_req:any,res:any,_next:any)=>res.status(error.status===413?413:400).json({error:error.status===413?'payload_too_large':'invalid_request'}));
app.listen(Number(process.env.PORT ?? 4330),'127.0.0.1',()=>console.log('Web Respect Node adapter ready'));
