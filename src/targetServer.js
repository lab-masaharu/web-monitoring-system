import http from 'node:http';

function send(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(body);
}

export function createTargetServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    switch (url.pathname) {
      case '/ok':
        return send(res, 200, 'ok');
      case '/error':
        return send(res, 500, 'internal server error');
      case '/slow': {
        const timer = setTimeout(() => send(res, 200, 'slow'), Number(url.searchParams.get('ms') ?? 3000));
        req.on('close', () => clearTimeout(timer));
        return;
      }
      default:
        return send(res, 404, 'not found');
    }
  });
}
