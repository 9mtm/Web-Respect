import {build} from 'esbuild';
import {compile} from 'svelte/compiler';
import {readFileSync,writeFileSync} from 'node:fs';
for(const name of ['react','vue','angular','svelte']){
 const plugins=name==='svelte'?[{name:'svelte',setup(builder){builder.onLoad({filter:/\.svelte$/},args=>({contents:compile(readFileSync(args.path,'utf8'),{filename:args.path,generate:'client'}).js.code,loader:'js'}));}}]:[];
 await build({entryPoints:[`examples/${name}/main.${name==='react'?'tsx':'ts'}`],outfile:`examples/${name}/bundle.js`,bundle:true,format:'esm',platform:'browser',target:'es2022',plugins,tsconfigRaw:{compilerOptions:{experimentalDecorators:true,useDefineForClassFields:false,jsx:'react-jsx'}}});
 writeFileSync(`examples/${name}/index.html`,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} integration</title></head><body><div id="app"><wr-app></wr-app></div><script type="module" src="./bundle.js"></script></body></html>`);
 console.log(name+' browser fixture built');
}
