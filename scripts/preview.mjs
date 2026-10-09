import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.env.WR_PREVIEW_ROOT ?? process.cwd());
const port=Number(process.env.WR_PREVIEW_PORT ?? 4328);
http.createServer(async(req,res)=>{try{let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(file!==root&&!file.startsWith(root+path.sep))throw Error();if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');const data=await fs.readFile(file);res.setHeader('Content-Type',file.endsWith('.html')?'text/html':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'application/octet-stream');res.end(data)}catch{res.statusCode=404;res.end('Not found')}}).listen(port,'127.0.0.1',()=>console.log(`Preview http://127.0.0.1:${port}/`));
