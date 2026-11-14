import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { DEFAULT_TIMEOUT_MS, resolveTimeoutMs } from '../src/cli.js';
import { createTargetServer } from '../src/targetServer.js';

const cliPath = fileURLToPath(new URL('../src/cli.js', import.meta.url));

function runCli(url, timeoutMsEnv) {
  const env = { ...process.env };
  delete env.TIMEOUT_MS;
  if (timeoutMsEnv !== undefined) env.TIMEOUT_MS = timeoutMsEnv;
  return new Promise((resolve) => {
    execFile(process.execPath, [cliPath, url], { env, timeout: 10000 }, (error, stdout, stderr) => {
      resolve({ code: error ? (error.code ?? 1) : 0, stdout, stderr });
    });
  });
}

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

test('default timeout is 5000ms', () => {
  assert.equal(DEFAULT_TIMEOUT_MS, 5000);
});

test('invalid TIMEOUT_MS values fall back to 5000ms', () => {
  for (const value of [undefined, null, '', '   ', 'abc', '3000ms', 'NaN', 'Infinity', '-Infinity', '0', '-0', '-5']) {
    assert.equal(resolveTimeoutMs(value), 5000, `value: ${String(value)}`);
  }
});

test('valid positive finite TIMEOUT_MS values are used as is', () => {
  assert.equal(resolveTimeoutMs('1000'), 1000);
  assert.equal(resolveTimeoutMs(' 3000 '), 3000);
  assert.equal(resolveTimeoutMs('1.5'), 1.5);
  assert.equal(resolveTimeoutMs('1e4'), 10000);
});

test('CLI does not crash with a non-numeric TIMEOUT_MS and uses the default', async () => {
  const { code, stdout } = await runCli(`${base}/slow?ms=300`, 'abc');
  assert.equal(code, 0);
  const [result] = JSON.parse(stdout);
  assert.equal(result.status, 'UP');
});

test('CLI uses a valid TIMEOUT_MS value', async () => {
  const { code, stdout } = await runCli(`${base}/slow?ms=1000`, '100');
  assert.equal(code, 0);
  const [result] = JSON.parse(stdout);
  assert.equal(result.status, 'DOWN');
  assert.equal(result.errorType, 'timeout');
  assert.equal(result.error, 'no response within 100ms');
});
