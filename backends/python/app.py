"""Host-owned, server-to-server consent reference adapter. No IP/UA collection."""
import os, json, sqlite3, time, uuid, secrets
from datetime import datetime, timezone
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

token, admin = os.getenv('WR_TOKEN'), os.getenv('WR_ADMIN_TOKEN')
if not token or not admin or token == admin:
    raise RuntimeError('Distinct WR_TOKEN and WR_ADMIN_TOKEN required')
policy = os.getenv('WR_POLICY_VERSION', '1')
retention = float(os.getenv('WR_RETENTION_DAYS', '180'))
if not 0 < retention <= 3650: raise RuntimeError('Invalid retention')
database = os.getenv('WR_DATABASE', 'consent.sqlite')
def connect():
    db = sqlite3.connect(database)
    db.execute('CREATE TABLE IF NOT EXISTS receipts (id TEXT PRIMARY KEY, subject TEXT NOT NULL, received INTEGER NOT NULL, record TEXT NOT NULL)')
    db.execute('CREATE INDEX IF NOT EXISTS receipts_subject ON receipts(subject,received)')
    return db
with connect(): pass
app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
buckets = {}
def response(data, status=200): return JSONResponse(data, status, headers={'Cache-Control':'no-store'})
@app.middleware('http')
async def protect(request: Request, call_next):
    origin = request.headers.get('origin')
    if origin and origin != os.getenv('WR_ORIGIN'): return response({'error':'origin_rejected'},403)
    expected = admin if request.url.path.startswith('/v1/admin/') else token
    if not secrets.compare_digest(request.headers.get('authorization',''), 'Bearer '+expected): return response({'error':'unauthorized'},401)
    subject = request.headers.get('x-wr-subject','')
    import re
    if not re.fullmatch(r'[A-Za-z0-9_-]{1,128}',subject): return response({'error':'subject_required'},400)
    now=time.time()
    for key in list(buckets):
        if buckets[key][1]<=now: del buckets[key]
    count, until=buckets.get(subject,(0,now+60));buckets[subject]=(count+1,until)
    if count>=60:return response({'error':'rate_limited'},429)
    # Consume bounded chunks before parsing, including requests without Content-Length.
    body=bytearray()
    async for chunk in request.stream():
        body.extend(chunk)
        if len(body)>8192:return response({'error':'payload_too_large'},413)
    request._body=bytes(body)
    result=await call_next(request);result.headers['Cache-Control']='no-store';return result
def stamp(ms):return datetime.fromtimestamp(ms/1000,timezone.utc).isoformat().replace('+00:00','Z')
def parse(value):
    if not isinstance(value,str):raise ValueError()
    dt=datetime.fromisoformat(value.replace('Z','+00:00'))
    if dt.tzinfo is None:raise ValueError()
    return dt.timestamp()*1000
def validate(r):
    if not isinstance(r,dict) or set(r)!={'contractVersion','policyVersion','choices','method','clientTime','expiresAt'}:raise ValueError()
    if r['contractVersion']!='1' or r['policyVersion']!=policy or r['method'] not in ['banner','preferences','withdrawal']:raise ValueError()
    c=r['choices']
    if not isinstance(c,dict) or set(c)!={'essential','functional','analytics','marketing'} or any(type(v)!=bool for v in c.values()) or c['essential'] is not True:raise ValueError()
    if r['method']=='withdrawal' and any(c[k] for k in ['functional','analytics','marketing']):raise ValueError()
    client, expiry, now=parse(r['clientTime']),parse(r['expiresAt']),time.time()*1000
    if client>now+300000 or expiry<=now or expiry<=client or expiry-client>365*86400000:raise ValueError()
@app.post('/v1/consents')
async def create(request:Request):
    try:r=await request.json();validate(r)
    except (ValueError,TypeError,KeyError):return response({'error':'invalid_record'},422)
    ident,now=str(uuid.uuid4()),int(time.time()*1000)
    with connect() as db:db.execute('INSERT INTO receipts VALUES(?,?,?,?)',(ident,request.headers['x-wr-subject'],now,json.dumps(r)))
    return response({'id':ident,'receivedAt':stamp(now),'record':r},201)
@app.get('/v1/consents/current')
async def current(request:Request):
    with connect() as db:row=db.execute('SELECT id,received,record FROM receipts WHERE subject=? ORDER BY received DESC,rowid DESC LIMIT 1',(request.headers['x-wr-subject'],)).fetchone()
    if not row:return response({'error':'not_found'},404)
    r=json.loads(row[2]);return response({'id':row[0],'receivedAt':stamp(row[1]),'record':r,'valid':r['policyVersion']==policy and parse(r['expiresAt'])>time.time()*1000})
@app.delete('/v1/admin/consents')
async def delete(request:Request):
    with connect() as db:count=db.execute('DELETE FROM receipts WHERE subject=?',(request.headers['x-wr-subject'],)).rowcount
    return response({'deleted':count})
@app.post('/v1/admin/retention')
async def expire():
    with connect() as db:count=db.execute('DELETE FROM receipts WHERE received<?',(time.time()*1000-retention*86400000,)).rowcount
    return response({'deleted':count})
