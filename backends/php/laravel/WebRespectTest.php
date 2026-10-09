<?php
namespace Tests\Feature;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;
class WebRespectTest extends TestCase {
 public function test_gateway_requires_account_and_derives_subject():void {
  config(['services.web_respect.url'=>'http://127.0.0.1:4332','services.web_respect.token'=>str_repeat('t',32)]);
  Http::fake(['*'=>Http::response(['id'=>'receipt'],201)]);
  $this->getJson('/web-respect/consent')->assertUnauthorized();
  $user=new User();$user->id=42;
  $this->actingAs($user)->postJson('/web-respect/consent',['choices'=>['essential'=>true],'subject'=>'forged'])->assertCreated();
  Http::assertSent(fn($request)=>$request->hasHeader('X-WR-Subject',hash_hmac('sha256','42',config('app.key'))) && !$request->hasHeader('X-WR-Subject','forged'));
 }
 public function test_gateway_limits_body():void {
  config(['services.web_respect.url'=>'http://127.0.0.1:4332','services.web_respect.token'=>str_repeat('t',32)]);
  $user=new User();$user->id=42;Http::fake();
  $this->actingAs($user)->postJson('/web-respect/consent',['padding'=>str_repeat('x',9000)])->assertStatus(413);Http::assertNothingSent();
 }
}
