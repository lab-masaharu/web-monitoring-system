import { pathToFileURL } from 'node:url';
import { checkUrl } from './monitor.js';

export const DEFAULT_TIMEOUT_MS = 5000;

// Use TIMEOUT_MS only when it is a positive finite number; otherwise fall back to the default.
export function resolveTimeoutMs(value) {
  const timeoutMs = Number(value);
  return Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS;
}

async function main() {
  const urls = process.argv.slice(2);
  if (urls.length === 0) {
    console.error('usage: node src/cli.js <url> [url ...]');
    process.exit(2);
  }

  const timeoutMs = resolveTimeoutMs(process.env.TIMEOUT_MS);
  const results = await Promise.all(urls.map((url) => checkUrl(url, { timeoutMs })));
  console.log(JSON.stringify(results, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
