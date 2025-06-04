const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

function serveStatic(filePath, res) {
  const absPath = path.join(publicDir, filePath);
  fs.readFile(absPath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    let type = 'text/plain';
    if (filePath.endsWith('.html')) type = 'text/html';
    else if (filePath.endsWith('.css')) type = 'text/css';
    else if (filePath.endsWith('.js')) type = 'application/javascript';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

http
  .createServer((req, res) => {
    const urlPath = req.url === '/' ? '/index.html' : req.url;
    serveStatic(urlPath, res);
  })
  .listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
