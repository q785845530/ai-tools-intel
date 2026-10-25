// lib/server.js —— 零依赖 HTTP 静态服务器（Node 24 built-in http）
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { OUT } = require('./site');
const audit = require('./audit');

const PORT = parseInt(process.env.OPS_PORT || '8765', 10);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // 运营看板：动态渲染（不经磁盘，实时反映 DB 与审计链状态）
  if (urlPath === '/dashboard' || urlPath === '/dashboard/') {
    try {
      const body = require('./dashboard').html();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(body);
    } catch (e) {
      audit.log('error', 'server', 'dashboard.fail', { error: e.message });
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('看板渲染失败: ' + e.message);
    }
    return;
  }

  if (urlPath === '/') urlPath = '/index.html';

  const safe = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(OUT, safe);

  if (!filePath.startsWith(OUT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const ct = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': ct,
      'Content-Length': stat.size,
      'Cache-Control': 'public, max-age=300',
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

function start() {
  return new Promise((resolve, reject) => {
    server.listen(PORT, '0.0.0.0', () => {
      audit.log('info', 'server', 'start', { port: PORT, root: OUT });
      console.log(`✅ ops-site running at http://0.0.0.0:${PORT}`);
      resolve(server);
    });
    server.on('error', reject);
  });
}

function stop() {
  return new Promise(r => server.close(r));
}

module.exports = { start, stop, PORT };

if (require.main === module) {
  start().catch(e => { console.error(e); process.exit(1); });
}
