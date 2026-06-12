const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const HOST = '0.0.0.0';

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const landingPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Scrapify – Chrome Extension</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f0f11;
      color: #e0e0e6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px 24px;
    }
    .card {
      background: #18181d;
      border: 1px solid #2a2a35;
      border-radius: 16px;
      padding: 40px;
      max-width: 640px;
      width: 100%;
    }
    .logo-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
    }
    .logo-row img { width: 56px; height: 56px; }
    h1 { font-size: 28px; font-weight: 700; color: #fff; }
    .tagline { font-size: 13px; color: #888; margin-top: 2px; letter-spacing: 0.08em; text-transform: uppercase; }
    h2 { font-size: 16px; font-weight: 600; color: #c0c0cc; margin: 28px 0 12px; }
    ol, ul { padding-left: 20px; }
    li { margin-bottom: 8px; line-height: 1.6; color: #b0b0bc; font-size: 14px; }
    code {
      background: #23232e;
      border: 1px solid #33333f;
      border-radius: 5px;
      padding: 2px 7px;
      font-size: 13px;
      color: #a5d6ff;
      font-family: 'SF Mono', 'Fira Code', monospace;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #1e2a1e;
      border: 1px solid #2d4a2d;
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 13px;
      color: #6bcb77;
      margin-top: 4px;
    }
    .badge::before { content: '✓'; font-weight: 700; }
    .divider { border: none; border-top: 1px solid #2a2a35; margin: 28px 0; }
    .dir-box {
      background: #23232e;
      border: 1px solid #33333f;
      border-radius: 8px;
      padding: 12px 16px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 13px;
      color: #a5d6ff;
      margin-top: 8px;
      word-break: break-all;
    }
    .note { font-size: 13px; color: #666; margin-top: 16px; line-height: 1.6; }
    a { color: #a5d6ff; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo-row">
      <img src="/extension/assets/brand/scrapify-mark.svg" alt="Scrapify" />
      <div>
        <h1>Scrapify</h1>
        <div class="tagline">Scrape · Enrich · Export</div>
      </div>
    </div>

    <div class="badge">Chrome Extension – No build step required</div>

    <hr class="divider" />

    <h2>How to install in Chrome</h2>
    <ol>
      <li>Open Chrome and go to <code>chrome://extensions/</code></li>
      <li>Enable <strong>Developer mode</strong> (toggle, top-right corner)</li>
      <li>Click <strong>Load unpacked</strong></li>
      <li>Select the <code>scrapify-extension-main</code> folder from this project</li>
      <li>The Scrapify icon will appear in your Chrome toolbar</li>
    </ol>

    <h2>Extension folder path</h2>
    <div class="dir-box">scrapify-extension-main/</div>

    <hr class="divider" />

    <h2>Quick start</h2>
    <ol>
      <li>Open <a href="https://www.google.com/maps" target="_blank">Google Maps</a> and search for businesses (e.g. <em>dentists in chicago</em>)</li>
      <li>Click the <strong>Scrapify</strong> extension icon in your toolbar</li>
      <li>Configure your filters (max rows, rating range, etc.)</li>
      <li>Click <strong>Start Scrape</strong></li>
      <li>Open <strong>Viewer</strong> to review and export CSV</li>
    </ol>

    <h2>Extension files (served for reference)</h2>
    <ul>
      <li><a href="/extension/manifest.json" target="_blank">manifest.json</a></li>
      <li><a href="/extension/popup.html" target="_blank">popup.html</a></li>
      <li><a href="/extension/results.html" target="_blank">results.html</a></li>
    </ul>

    <p class="note">
      This page is a developer reference server. Scrapify runs entirely inside Chrome as a Manifest V3 extension — it does not need a web server to operate.
    </p>
  </div>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/' : req.url;

  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(landingPage);
    return;
  }

  if (url.startsWith('/extension/')) {
    const filePath = path.join(__dirname, 'scrapify-extension-main', url.slice('/extension/'.length));
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, HOST, () => {
  console.log(`Scrapify dev server running at http://${HOST}:${PORT}`);
});
