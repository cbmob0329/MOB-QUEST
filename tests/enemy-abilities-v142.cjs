// Uses an isolated browser context; never attaches to a user's browser/save.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }

async function main() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const file of ['js/data.js', 'js/game.js', 'css/style.css']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8').trim();
    assert.ok(html.includes(source), `${file} must match inline source`);
    if (file.endsWith('.js')) new vm.Script(source, { filename: file });
  }
  for (const [i, m] of [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].entries()) new vm.Script(m[1], { filename: `inline-${i}` });
  const browser = await playwright.chromium.launch({ headless: true, channel: process.env.MOB_TEST_BROWSER || 'msedge' });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let instrument = false;
    await page.route('http://mob.test/**', async route => {
      const url = new URL(route.request().url());
      const file = path.resolve(root, '.' + (url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)));
      if (!file.startsWith(root + path.sep)) return route.fulfill({ status: 403, body: '' });
      try {
        if (file === path.join(root, 'index.html')) {
          const body = instrument ? html.replace('/* ===== END MOB STORY v142 ===== */', fs.readFileSync(path.join(__dirname, 'enemy-abilities-v142.browser.js'), 'utf8')) : html;
          return await route.fulfill({ contentType: 'text/html; charset=utf-8', body });
        }
        await route.fulfill({ path: file });
      } catch { await route.fulfill({ status: 404, body: '' }); }
    });
    await page.goto('http://mob.test/', { waitUntil: 'load' });
    await page.waitForFunction(() => window.__mobV142Runtime && window.__mobBootReady);
    assert.deepEqual(errors, [], 'Unmodified production HTML must boot without errors');
    assert.equal(await page.locator('#titleScreen').evaluate(el => el.classList.contains('active')), true);
    assert.equal(await page.locator('.title-version').textContent(), 'v142');
    // Exercise settings and return before any battle test instrumentation.
    await page.locator('#titleSettingsBtn').click();
    assert.deepEqual(errors, [], 'Title/settings UI must not throw');
    instrument = true;
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(() => typeof window.runEnemyAbilityTestsV142 === 'function');
    await page.evaluate(() => window.startEnemyAbilitySmokeV142());
    await page.waitForFunction(() => window.enemyAbilitySmokeStateV142().active && !window.enemyAbilitySmokeStateV142().busy);
    const beforeHp = await page.evaluate(() => window.enemyAbilitySmokeStateV142().hp);
    await page.locator('#attackBtn').click();
    await page.waitForFunction(hp => window.enemyAbilitySmokeStateV142().hp < hp, beforeHp);
    await page.waitForFunction(() => !window.enemyAbilitySmokeStateV142().busy);
    await page.screenshot({ path: path.join(process.env.TEMP || root, 'mob-story-v142-battle.png') });
    assert.deepEqual(errors, [], 'Real battle start and attack must not throw');
    console.log('PASS real mobile battle start, attack button and damage');
    const results = await page.evaluate(() => window.runEnemyAbilityTestsV142());
    for (const result of results) console.log(`${result.ok ? 'PASS' : 'FAIL'} ${result.name}${result.error ? ': ' + result.error : ''}`);
    assert.equal(results.filter(r => !r.ok).length, 0, 'Enemy ability regression failures');
    assert.deepEqual(errors, [], 'Browser runtime errors');
    console.log(`PASS ${results.length} combat checks, source/inline syntax and synchronization, production boot/settings`);
    await context.close();
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
