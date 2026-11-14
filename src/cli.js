import { pathToFileURL } from 'node:url';
import { checkUrl } from './monitor.js';

export const DEFAULT_TIMEOUT_MS = 5000;
// Largest delay Node.js timers accept (2^31 - 1 ms); larger values are not honored as a real timeout.
export const MAX_TIMEOUT_MS = 2147483647;

// Use TIMEOUT_MS only when it is a finite number in (0, MAX_TIMEOUT_MS]; otherwise fall back to the default.
export function resolveTimeoutMs(value) {
  const timeoutMs = Number(value);
  return Number.isFinite(timeoutMs) && timeoutMs > 0 && timeoutMs <= MAX_TIMEOUT_MS ? timeoutMs : DEFAULT_TIMEOUT_MS;
}

export function runChecks(urls, env = process.env, check = checkUrl) {
  const timeoutMs = resolveTimeoutMs(env.TIMEOUT_MS);
  return Promise.all(urls.map((url) => check(url, { timeoutMs })));
}

async function main() {
  const urls = process.argv.slice(2);
  if (urls.length === 0) {
    console.error('usage: node src/cli.js <url> [url ...]');
    process.exit(2);
  }

  const results = await runChecks(urls);
  console.log(JSON.stringify(results, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
