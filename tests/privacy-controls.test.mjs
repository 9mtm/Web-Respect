import test from 'node:test';
import assert from 'node:assert/strict';
import {mountPrivacyControls} from '../dist/privacy-controls.js';

function fixture(){
  const doc={createElement:tag=>new Element(tag),cookie:'',baseURI:'https://example.test/',defaultView:{localStorage:{length:0},sessionStorage:{length:0},performance:{getEntriesByType:()=>[]}},querySelectorAll:()=>[]};
  class Element {
    constructor(tag){this.tag=tag;this.ownerDocument=doc;this.children=[];this.style={};this.disabled=false;this.hidden=false;this.textContent='';}
    append(...children){this.children.push(...children);for(const child of children)child.parent=this;}
    setAttribute(){}
    focus(){doc.activeElement=this;}
    remove(){this.parent.children=this.parent.children.filter(child=>child!==this);}
  }
  return {target:new Element('div'),doc};
}
test('visitor controls mount nothing without a deletion workflow',()=>{
  const {target}=fixture();const remove=mountPrivacyControls(target);assert.equal(target.children.length,0);remove();assert.equal(target.children.length,0);
});
test('cancel submits nothing; confirm submits once and pending is not completed',async()=>{
  const {target,doc}=fixture();let calls=0;
  mountPrivacyControls(target,{requestDeletion:async()=>{calls++;return {requestId:'r',status:'pending'};}});
  const [request,confirmation,output]=target.children[0].children;
  const [,confirm,cancel]=confirmation.children;
  request.onclick();assert.equal(calls,0);assert.equal(doc.activeElement,confirm);
  cancel.onclick();assert.equal(calls,0);assert.ok(confirmation.hidden);
  request.onclick();await confirm.onclick();assert.equal(calls,1);assert.match(output.textContent,/processing is pending/);assert.ok(!output.textContent.includes('completed'));assert.equal(doc.activeElement,request);
});
test('invalid receipts and rejected callbacks do not claim success',async()=>{
  for(const callback of [async()=>({requestId:'r',status:'invalid'}),async()=>{throw Error('secret');}]){
    const {target}=fixture();mountPrivacyControls(target,{requestDeletion:callback});const [request,confirmation,output]=target.children[0].children;
    request.onclick();await confirmation.children[1].onclick();assert.match(output.textContent,/could not be confirmed/);assert.equal(request.disabled,false);assert.ok(!output.textContent.includes('secret'));
  }
});
test('unmount during submission does not update detached controls',async()=>{
  const {target}=fixture();let resolve;
  const remove=mountPrivacyControls(target,{requestDeletion:()=>new Promise(done=>resolve=done)});
  const [request,confirmation,output]=target.children[0].children;request.onclick();const pending=confirmation.children[1].onclick();assert.match(output.textContent,/Submitting/);
  remove();resolve({requestId:'r',status:'completed'});await pending;assert.equal(target.children.length,0);assert.match(output.textContent,/Submitting/);
});
