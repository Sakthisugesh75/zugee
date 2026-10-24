// scripts/indexnow.mjs — run with `npm run indexnow` after each production deploy.
// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver, Yep; DuckDuckGo shows Bing's index)
// that every URL in the live sitemap is new or changed, so they crawl it within hours instead of
// waiting to discover the site. Google does not use IndexNow: submit the sitemap in Search Console.
//
// It reads the LIVE sitemap, so it only announces what is actually deployed, and first checks that
// the key file is live: IndexNow rejects the whole request (403) if it cannot fetch it.
//
//   npm run indexnow                 — submit every sitemap URL
//   npm run indexnow -- --dry-run    — print what would be sent, send nothing
import { CANONICAL_SITE_URL, INDEXNOW_KEY } from "../lib/site.js";

const dryRun = process.argv.includes("--dry-run");
const site = CANONICAL_SITE_URL;
const keyLocation = `${site}/${INDEXNOW_KEY}.txt`;

const keyRes = await fetch(keyLocation);
const keyText = keyRes.ok ? (await keyRes.text()).trim() : "";
if (keyText !== INDEXNOW_KEY) {
  console.error(`The key file is not live at ${keyLocation} (HTTP ${keyRes.status}). Deploy first, then run this again.`);
  process.exit(1);
}

const sitemap = await (await fetch(`${site}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (!urlList.length) {
  console.error(`No URLs found in ${site}/sitemap.xml`);
  process.exit(1);
}

const body = { host: new URL(site).host, key: INDEXNOW_KEY, keyLocation, urlList };
if (dryRun) {
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body)
});
// 200 = accepted; 202 = accepted, key validation pending. Anything else is an error.
const outcome = { 200: "accepted", 202: "accepted (key check pending)" }[res.status];
console.log(`IndexNow: HTTP ${res.status} ${outcome ?? "— failed: " + (await res.text())}`);
console.log(`${urlList.length} URLs submitted for ${body.host}`);
if (!outcome) process.exit(1);
