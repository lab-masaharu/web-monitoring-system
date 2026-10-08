import { checkUrl } from './monitor.js';

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error('usage: node src/cli.js <url> [url ...]');
  process.exit(2);
}

const timeoutMs = Number(process.env.TIMEOUT_MS ?? 5000);
const results = await Promise.all(urls.map((url) => checkUrl(url, { timeoutMs })));
console.log(JSON.stringify(results, null, 2));
