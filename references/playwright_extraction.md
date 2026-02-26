# CDP Web Extraction (URL Input)

Use Chrome DevTools Protocol (CDP) for URL content extraction. Do not rely on plain HTTP fetch.

Recommended wrapper script:
```bash
node scripts/extract_via_cdp.js --url "<URL>" --out /tmp/extracted.json
```

## Standard Flow
- Launch or connect to a Chrome instance with remote debugging enabled.
- Connect using Playwright `chromium.connectOverCDP`.
- Open target URL and wait for `networkidle`.
- Prefer `article, main, [role="main"]`; fallback to `body`.
- Extract title, headings, and main text.
- Strip nav/footer/ads/comments when possible.

## Minimal Node Example (CDP)
```js
import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const context = browser.contexts()[0] ?? (await browser.newContext());
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });

const title = await page.title();
const text = await page.evaluate(() => {
  const root =
    document.querySelector("article, main, [role='main']") || document.body;
  return root?.innerText || "";
});

await page.close();
```

## CDP Troubleshooting (Guide User If Needed)
When CDP fails, guide the user through these steps:

1. Start Chrome with remote debugging:
```bash
open -na "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-cdp-profile
```

2. Verify endpoint is available:
```bash
curl http://127.0.0.1:9222/json/version
```

3. If port is occupied, switch port (e.g. `9333`) and reconnect with that port.
4. If startup fails, close old Chrome debug instances and relaunch with a fresh `--user-data-dir`.
5. If site blocks headless automation, keep visible Chrome + authenticated session and reconnect over CDP.

## Failure Handling
- If extraction still fails after CDP setup, ask user for pasted text or screenshot.
- Clearly report what failed: connect failure, timeout, selector missing, or anti-bot block.
