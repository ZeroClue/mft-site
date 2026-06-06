import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '..', 'public', 'blog');

const ARTICLES = [
  { slug: 'file-transfer-server-compliance-liability',       title: 'File Transfer Server\nCompliance Liability',              tag: 'Compliance' },
  { slug: 'why-mft-projects-take-six-months',                title: 'Why MFT Projects\nTake 6 Months',                        tag: 'Implementation' },
  { slug: 'hidden-cost-of-free-file-transfer-tools',         title: 'The Hidden Cost of\nFree File Transfer Tools',            tag: 'Cost Analysis' },
  { slug: 'mft-orchestration-connecting-what-you-have',      title: 'MFT Orchestration:\nConnecting What You Already Have',   tag: 'Architecture' },
  { slug: 'file-transfer-audit-checklist',                   title: 'How to Audit Your File\nTransfer Infrastructure',        tag: 'Security Audit' },
  { slug: 'your-audit-trail-is-probably-unverifiable',       title: 'Your Audit Trail Is\nProbably Unverifiable',             tag: 'Compliance' },
  { slug: 'the-hub-never-sees-plaintext',                    title: 'The Hub Never\nSees Plaintext',                          tag: 'Security' },
  { slug: 'why-we-chose-hash-chains-over-merkle-trees',      title: 'Why We Chose a Hash Chain\nOver a Merkle Tree',          tag: 'Architecture' },
  { slug: 'why-the-audit-chain-starts-at-starter',           title: 'Why the Audit Chain\nStarts at Starter',                 tag: 'Audit Tiers' },
];

function buildHtml(title, tag) {
  const lines = title.split('\n');
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    background: #1F1A17;
    font-family: 'Source Serif 4', Georgia, serif;
    overflow: hidden;
    position: relative;
  }
  .weave {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(184,134,11,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(184,134,11,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .top-border {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #B8860B 0%, #D4A843 50%, #B8860B 100%);
  }
  .content {
    position: absolute;
    inset: 0;
    padding: 56px 72px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .wordmark {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #FAF8F5;
  }
  .tag {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #B8860B;
    border: 1px solid rgba(184,134,11,0.4);
    padding: 6px 14px;
    border-radius: 1px;
  }
  .title {
    font-size: 50px;
    font-weight: 600;
    line-height: 1.15;
    color: #FAF8F5;
    max-width: 820px;
  }
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .domain {
    font-size: 14px;
    font-weight: 400;
    color: #8B7355;
    letter-spacing: 0.04em;
  }
  .accent-line {
    width: 48px;
    height: 2px;
    background: #B8860B;
  }
</style>
</head>
<body>
  <div class="weave"></div>
  <div class="top-border"></div>
  <div class="content">
    <div class="top">
      <div class="wordmark">MFTPlus</div>
      <div class="tag">${tag}</div>
    </div>
    <div class="title">${lines.join('<br>')}</div>
    <div class="bottom">
      <div class="domain">mftplus.co.za</div>
      <div class="accent-line"></div>
    </div>
  </div>
</body>
</html>`;
}

const target = process.argv[2];
const list = target ? ARTICLES.filter(a => a.slug === target) : ARTICLES;

if (list.length === 0) {
  console.error(`No article found for slug: ${target}`);
  console.log('Available slugs:\n' + ARTICLES.map(a => '  ' + a.slug).join('\n'));
  process.exit(1);
}

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });

for (const article of list) {
  const html = buildHtml(article.title, article.tag);
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const outDir = resolve(PUBLIC);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, `${article.slug}-og.png`);
  await page.screenshot({ path: outPath, type: 'png' });
  console.log(`[ok] ${article.slug}`);
}

await browser.close();
console.log(`\nGenerated ${list.length} OG image(s).`);
