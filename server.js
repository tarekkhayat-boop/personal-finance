const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };
http.createServer((req, res) => {
  if (req.url === '/health') { res.writeHead(200, { 'content-type': 'text/plain' }); return res.end('ok'); }
  const requested = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '');
  const fullPath = path.resolve(ROOT, file);
  if (!fullPath.startsWith(ROOT + path.sep) && fullPath !== path.join(ROOT, 'index.html')) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(fullPath, (error, data) => {
    if (error) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, { 'content-type': types[path.extname(fullPath)] || 'application/octet-stream', 'x-content-type-options': 'nosniff' });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => console.log('Personal Finance listening on ' + PORT));
