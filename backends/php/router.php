<?php
declare(strict_types=1);
// Server-to-server adapter; run with PDO SQLite enabled. Never expose gateway tokens in JS.
header('Content-Type: application/json'); header('Cache-Control: no-store');
function reply(array $data,int $status=200):never {http_response_code($status);echo json_encode($data,JSON_THROW_ON_ERROR);exit;}
$token=getenv('WR_TOKEN');$admin=getenv('WR_ADMIN_TOKEN');
if(!$token||!$admin||hash_equals($token,$admin))reply(['error'=>'configuration_required'],503);
$path=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);$method=$_SERVER['REQUEST_METHOD'];
if(isset($_SERVER['HTTP_ORIGIN'])&&$_SERVER['HTTP_ORIGIN']!==getenv('WR_ORIGIN'))reply(['error'=>'origin_rejected'],403);
$expected=str_starts_with($path,'/v1/admin/')?$admin:$token;
if(!hash_equals('Bearer '.$expected,$_SERVER['HTTP_AUTHORIZATION']??''))reply(['error'=>'unauthorized'],401);
$subject=$_SERVER['HTTP_X_WR_SUBJECT']??'';if(!preg_match('/^[A-Za-z0-9_-]{1,128}$/D',$subject))reply(['error'=>'subject_required'],400);
$body=file_get_contents('php://input',false,null,0,8193);if(strlen($body)>8192)reply(['error'=>'payload_too_large'],413);
$policy=getenv('WR_POLICY_VERSION')?:'1';$retention=(float)(getenv('WR_RETENTION_DAYS')?:180);
if($retention<=0||$retention>3650)reply(['error'=>'configuration_required'],503);
try {
 $db=new PDO('sqlite:'.(getenv('WR_DATABASE')?:__DIR__.'/consent.sqlite'));$db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
 $db->exec('PRAGMA journal_mode=WAL;CREATE TABLE IF NOT EXISTS receipts(id TEXT PRIMARY KEY,subject TEXT NOT NULL,received INTEGER NOT NULL,record TEXT NOT NULL);CREATE INDEX IF NOT EXISTS receipts_subject ON receipts(subject,received);CREATE TABLE IF NOT EXISTS limits(subject TEXT PRIMARY KEY,count INTEGER NOT NULL,until INTEGER NOT NULL);');
 $now=(int)round(microtime(true)*1000);
 $db->exec('BEGIN IMMEDIATE');$q=$db->prepare('DELETE FROM limits WHERE until<=?');$q->execute([$now]);$q=$db->prepare('INSERT INTO limits VALUES(?,1,?) ON CONFLICT(subject) DO UPDATE SET count=count+1');$q->execute([$subject,$now+60000]);$q=$db->prepare('SELECT count FROM limits WHERE subject=?');$q->execute([$subject]);$count=$q->fetchColumn();$db->exec('COMMIT');if($count>60)reply(['error'=>'rate_limited'],429);
 if($method==='POST'&&$path==='/v1/consents') {
  try {
   $r=json_decode($body,true,32,JSON_THROW_ON_ERROR);if(!is_array($r))throw new Exception();$keys=array_keys($r);sort($keys);if($keys!==['choices','clientTime','contractVersion','expiresAt','method','policyVersion'])throw new Exception();
   if($r['contractVersion']!=='1'||$r['policyVersion']!==$policy||!in_array($r['method'],['banner','preferences','withdrawal'],true))throw new Exception();
   $c=$r['choices'];if(!is_array($c))throw new Exception();$keys=array_keys($c);sort($keys);if($keys!==['analytics','essential','functional','marketing']||$c['essential']!==true)throw new Exception();foreach($c as $value)if(!is_bool($value))throw new Exception();
   if($r['method']==='withdrawal'&&($c['functional']||$c['analytics']||$c['marketing']))throw new Exception();
   foreach(['clientTime','expiresAt'] as $key)if(!is_string($r[$key])||!preg_match('/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/D',$r[$key]))throw new Exception();
   $client=strtotime($r['clientTime']);$expiry=strtotime($r['expiresAt']);if($client===false||$expiry===false||$client*1000>$now+300000||$expiry*1000<=$now||$expiry<=$client||$expiry-$client>365*86400)throw new Exception();
  } catch(Throwable) {reply(['error'=>'invalid_record'],422);}
  $id=bin2hex(random_bytes(16));$q=$db->prepare('INSERT INTO receipts VALUES(?,?,?,?)');$q->execute([$id,$subject,$now,json_encode($r,JSON_THROW_ON_ERROR)]);reply(['id'=>$id,'receivedAt'=>gmdate('Y-m-d\TH:i:s\Z',(int)floor($now/1000)),'record'=>$r],201);
 }
 if($method==='GET'&&$path==='/v1/consents/current') {$q=$db->prepare('SELECT * FROM receipts WHERE subject=? ORDER BY received DESC,rowid DESC LIMIT 1');$q->execute([$subject]);$row=$q->fetch(PDO::FETCH_ASSOC);if(!$row)reply(['error'=>'not_found'],404);$r=json_decode($row['record'],true);reply(['id'=>$row['id'],'receivedAt'=>gmdate('Y-m-d\TH:i:s\Z',(int)floor($row['received']/1000)),'record'=>$r,'valid'=>$r['policyVersion']===$policy&&strtotime($r['expiresAt'])*1000>$now]);}
 if($method==='DELETE'&&$path==='/v1/admin/consents') {$q=$db->prepare('DELETE FROM receipts WHERE subject=?');$q->execute([$subject]);reply(['deleted'=>$q->rowCount()]);}
 if($method==='POST'&&$path==='/v1/admin/retention') {$q=$db->prepare('DELETE FROM receipts WHERE received<?');$q->execute([$now-$retention*86400000]);reply(['deleted'=>$q->rowCount()]);}
 reply(['error'=>'not_found'],404);
} catch(Throwable) {reply(['error'=>'storage_unavailable'],503);}
