import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import { checkUrl } from '../src/monitor.js';
import { createTargetServer } from '../src/targetServer.js';

let server;
let base;

before(async () => {
  server = createTargetServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.closeAllConnections();
  return new Promise((resolve) => server.close(resolve));
});

test('HTTP 200 is judged UP', async () => {
  const result = await checkUrl(`${base}/ok`);
  assert.equal(result.status, 'UP');
  assert.equal(result.httpStatus, 200);
  assert.equal(result.errorType, null);
  assert.equal(result.error, null);
});

test('HTTP 404 is judged DOWN', async () => {
  const result = await checkUrl(`${base}/missing`);
  assert.equal(result.status, 'DOWN');
  assert.equal(result.httpStatus, 404);
  assert.equal(result.errorType, 'http_error');
});

test('HTTP 500 is judged DOWN', async () => {
  const result = await checkUrl(`${base}/error`);
  assert.equal(result.status, 'DOWN');
  assert.equal(result.httpStatus, 500);
  assert.equal(result.errorType, 'http_error');
});

test('response without reply within timeout is judged DOWN as timeout', async () => {
  const result = await checkUrl(`${base}/slow?ms=2000`, { timeoutMs: 200 });
  assert.equal(result.status, 'DOWN');
  assert.equal(result.httpStatus, null);
  assert.equal(result.errorType, 'timeout');
});

test('refused connection is judged DOWN as connection_error', async () => {
  const probe = net.createServer();
  await new Promise((resolve) => probe.listen(0, '127.0.0.1', resolve));
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));

  const result = await checkUrl(`http://127.0.0.1:${port}/`);
  assert.equal(result.status, 'DOWN');
  assert.equal(result.httpStatus, null);
  assert.equal(result.errorType, 'connection_error');
  assert.equal(result.error, 'ECONNREFUSED');
});

test('malformed URL is judged DOWN as invalid_url', async () => {
  const result = await checkUrl('not a url');
  assert.equal(result.status, 'DOWN');
  assert.equal(result.errorType, 'invalid_url');
});

test('result contains url, checkedAt and responseTimeMs', async () => {
  const url = `${base}/ok`;
  const result = await checkUrl(url);
  assert.equal(result.url, url);
  assert.ok(!Number.isNaN(Date.parse(result.checkedAt)));
  assert.equal(typeof result.responseTimeMs, 'number');
});
