import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
import {copyFileSync,rmSync} from 'node:fs';
rmSync(new URL('../dist/',import.meta.url),{recursive:true,force:true});
execFileSync(process.execPath,['node_modules/typescript/bin/tsc'],{stdio:'inherit'});
await build({entryPoints:['src/index.ts','src/accessibility.ts','src/consent.ts','src/browser.ts','src/scanner.ts','src/privacy.ts','src/feed.ts','src/react.tsx'],outdir:'dist',bundle:true,splitting:true,format:'esm',platform:'browser',target:'es2022',external:['react'],loader:{'.css':'text'},sourcemap:true});
await build({entryPoints:['src/browser.ts'],outfile:'dist/web-respect.js',bundle:true,format:'iife',globalName:'WebRespect',target:'es2022',loader:{'.css':'text'},sourcemap:true});
copyFileSync('src/ui.css','dist/ui.css');
copyFileSync('dist/web-respect.js','examples/wordpress/web-respect/web-respect.js');
