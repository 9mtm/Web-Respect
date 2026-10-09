(function(){
 const config=window.webRespectConfig||{};
 // Map real SDK callbacks through this host filter before any provider initializes.
 window.dispatchEvent(new CustomEvent('web-respect:configure',{detail:config}));
 const target=document.querySelector('#web-respect-mount');if(!target)return;
 const content=document.querySelector(config.contentSelector||'main');
 if(content && !content.contains(target))config.content=content;
 const toolkit=WebRespect.mount(target,config);
 const controls=document.querySelectorAll('[data-web-respect-footer]');
 const fallback=document.querySelector('#web-respect-footer');
 const remove=Array.from(controls.length?controls:[fallback]).filter(Boolean).map(el=>WebRespect.mountFooter(el,toolkit,{locale:config.locale,discoverLinks:true,mcp:config.mcp,feed:config.feed}));
 window.addEventListener('pagehide',event=>{if(!event.persisted){remove.forEach(fn=>fn());void toolkit.dispose();}});
})();
