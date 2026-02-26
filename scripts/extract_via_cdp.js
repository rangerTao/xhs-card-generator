#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_CDP_ENDPOINT = "http://127.0.0.1:9222";
const DEFAULT_TIMEOUT = 45000;

const usage = () => {
  console.log(
    [
      "Usage:",
      "  node scripts/extract_via_cdp.js --url <URL> [--out <path>] [--cdp <endpoint>] [--timeout <ms>]",
      "",
      "Examples:",
      "  node scripts/extract_via_cdp.js --url https://example.com",
      "  node scripts/extract_via_cdp.js --url https://example.com --out /tmp/content.json",
      "  node scripts/extract_via_cdp.js --url https://example.com --cdp http://127.0.0.1:9333",
    ].join("\n"),
  );
};

const parseArgs = (argv) => {
  const args = {
    url: "",
    out: "",
    cdp: DEFAULT_CDP_ENDPOINT,
    timeout: DEFAULT_TIMEOUT,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === "--url" && value) {
      args.url = value;
      i += 1;
      continue;
    }
    if (key === "--out" && value) {
      args.out = value;
      i += 1;
      continue;
    }
    if (key === "--cdp" && value) {
      args.cdp = value;
      i += 1;
      continue;
    }
    if (key === "--timeout" && value) {
      args.timeout = Number(value);
      i += 1;
      continue;
    }
    if (key === "-h" || key === "--help") {
      usage();
      process.exit(0);
    }
    console.error(`Unknown argument: ${key}`);
    usage();
    process.exit(2);
  }

  if (!args.url) {
    console.error("Missing required argument: --url");
    usage();
    process.exit(2);
  }
  if (!Number.isFinite(args.timeout) || args.timeout <= 0) {
    console.error("--timeout must be a positive number.");
    process.exit(2);
  }
  return args;
};

const printCdpTroubleshooting = (endpoint) => {
  const endpointUrl = endpoint || DEFAULT_CDP_ENDPOINT;
  console.error("\nCDP troubleshooting:");
  console.error(
    '1) Start Chrome with remote debugging:\n   open -na "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-cdp-profile',
  );
  console.error(
    "2) Verify endpoint:\n   curl http://127.0.0.1:9222/json/version",
  );
  console.error(
    `3) If you changed port, pass it explicitly: --cdp ${endpointUrl}`,
  );
  console.error(
    "4) If port is busy or startup fails, relaunch with a fresh --user-data-dir.",
  );
};

const normalizeUrl = (rawUrl) => {
  try {
    return new URL(rawUrl).toString();
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }
};

async function main() {
  const args = parseArgs(process.argv);
  const url = normalizeUrl(args.url);

  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch (error) {
    console.error("Playwright is not installed. Install with: npm i playwright");
    process.exit(1);
  }

  let browser;
  let page;
  try {
    browser = await chromium.connectOverCDP(args.cdp);
    const context = browser.contexts()[0] || (await browser.newContext());
    page = await context.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: args.timeout });
    try {
      await page.waitForLoadState("networkidle", { timeout: args.timeout });
    } catch {
      // Keep going for pages with continuous network activity.
    }

    const extracted = await page.evaluate(() => {
      const killSelectors = [
        "nav",
        "header",
        "footer",
        "aside",
        ".comment",
        ".comments",
        ".sidebar",
        ".ad",
        ".ads",
        ".advertisement",
      ];
      killSelectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((node) => node.remove());
      });

      const clean = (text) =>
        (text || "")
          .replace(/\s+/g, " ")
          .trim();

      const root =
        document.querySelector("article, main, [role='main'], #content, .content") ||
        document.body;

      const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
        .map((n) => clean(n.textContent))
        .filter(Boolean)
        .slice(0, 40);

      const paragraphs = Array.from(root.querySelectorAll("p, li"))
        .map((n) => clean(n.textContent))
        .filter((s) => s.length >= 10)
        .slice(0, 200);

      return {
        title: clean(document.title),
        headings,
        text: clean(root.innerText),
        paragraphs,
        url: location.href,
      };
    });

    const result = {
      source: "cdp",
      cdpEndpoint: args.cdp,
      fetchedAt: new Date().toISOString(),
      ...extracted,
    };

    const output = JSON.stringify(result, null, 2);
    if (args.out) {
      const outPath = path.resolve(args.out);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, output, "utf8");
      console.log(`Saved: ${outPath}`);
    } else {
      console.log(output);
    }
  } catch (error) {
    console.error(`CDP extraction failed: ${error.message}`);
    printCdpTroubleshooting(args.cdp);
    process.exitCode = 1;
  } finally {
    try {
      if (page) {
        await page.close();
      }
      if (browser) {
        await browser.close();
      }
    } catch {
      // Ignore cleanup errors.
    }
  }
}

main();
