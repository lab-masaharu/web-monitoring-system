import http from 'node:http';
import https from 'node:https';

const CLIENTS = { 'http:': http, 'https:': https };

export function checkUrl(target, { timeoutMs = 5000 } = {}) {
  const checkedAt = new Date().toISOString();
  const started = performance.now();
  const finish = (fields) => ({
    url: target,
    checkedAt,
    responseTimeMs: Math.round(performance.now() - started),
    ...fields,
  });

  let url;
  try {
    url = new URL(target);
  } catch {
    return Promise.resolve(finish({ status: 'DOWN', httpStatus: null, errorType: 'invalid_url', error: 'invalid URL' }));
  }

  const client = CLIENTS[url.protocol];
  if (!client) {
    return Promise.resolve(finish({ status: 'DOWN', httpStatus: null, errorType: 'invalid_url', error: `unsupported protocol ${url.protocol}` }));
  }

  return new Promise((resolve) => {
    let settled = false;
    const settle = (fields) => {
      if (settled) return;
      settled = true;
      resolve(finish(fields));
    };

    const req = client.get(url, { agent: false }, (res) => {
      res.resume();
      const httpStatus = res.statusCode;
      settle(httpStatus === 200
        ? { status: 'UP', httpStatus, errorType: null, error: null }
        : { status: 'DOWN', httpStatus, errorType: 'http_error', error: `HTTP ${httpStatus}` });
    });

    req.setTimeout(timeoutMs, () => {
      settle({ status: 'DOWN', httpStatus: null, errorType: 'timeout', error: `no response within ${timeoutMs}ms` });
      req.destroy();
    });

    req.on('error', (err) => {
      settle({ status: 'DOWN', httpStatus: null, errorType: 'connection_error', error: err.code ?? err.message });
    });
  });
}
