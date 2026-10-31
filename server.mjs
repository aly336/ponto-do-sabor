import http from 'node:http';
import { open, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./dist/', import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf','.mp4':'video/mp4','.webm':'video/webm'};
const port = Number(process.env.PORT || 5173);
export const server = http.createServer(async(req,res)=>{
  let handle;
  try {
    const requested = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const target = path.resolve(root, '.' + (requested==='/'?'/index.html':requested));
    const relative = path.relative(root,target);
    if(relative.startsWith('..') || path.isAbsolute(relative)){res.writeHead(403);return res.end();}
    const info = await stat(target);
    if(!info.isFile()){res.writeHead(404);return res.end();}
    const headers={'Content-Type':types[path.extname(target)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'};
    let start=0,end=info.size-1,status=200;
    if(req.headers.range){
      const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if(!match || (!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}
      if(!match[1]){start=Math.max(0,info.size-Number(match[2]));}
      else {start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),end):end;}
      if(start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}
      status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
    }
    headers['Content-Length']=end-start+1;
    res.writeHead(status,headers);
    if(req.method==='HEAD')return res.end();
    handle=await open(target,'r');
    const stream=handle.createReadStream({start,end,autoClose:true});
    stream.on('error',()=>res.destroy());
    res.once('close',()=>stream.destroy());
    stream.once('close',()=>handle.close().catch(()=>{}));
    stream.pipe(res);
  }catch{if(!res.headersSent)res.writeHead(404);res.end('Página não encontrada.');if(handle)await handle.close().catch(()=>{});}
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://localhost:${port}`));
