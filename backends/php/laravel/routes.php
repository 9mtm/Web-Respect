<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

// Include from routes/web.php: the web middleware retains session and CSRF protection.
// This account example requires authentication. Anonymous sites need a signed-session gateway.
Route::middleware(['auth','throttle:60,1'])->group(function(){
 Route::match(['get','post'],'/web-respect/consent',function(Request $request){
  $base=config('services.web_respect.url');$token=config('services.web_respect.token');
  abort_unless(is_string($base)&&str_starts_with($base,'http://127.0.0.1:')&&is_string($token)&&strlen($token)>=24,503);
  abort_if(strlen($request->getContent())>8192,413);
  $subject=hash_hmac('sha256',(string)$request->user()->getAuthIdentifier(),config('app.key'));
  $http=Http::withToken($token)->withHeaders(['X-WR-Subject'=>$subject])->timeout(5)->acceptJson();
  $response=$request->isMethod('post')?$http->post($base.'/v1/consents',$request->json()->all()):$http->get($base.'/v1/consents/current');
  return response($response->body(),$response->status())->header('Content-Type','application/json')->header('Cache-Control','no-store');
 });
});
