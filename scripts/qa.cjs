// Run against the built artifact: python3 -m http.server 4174 --directory dist
// QA_URL can point to a different preview. WebKit is optional via WEBKIT_EXECUTABLE.
const { chromium, webkit } = require('playwright');
const { default: AxeBuilder } = require('@axe-core/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const base = process.env.QA_URL || 'http://localhost:4174';
const output = path.resolve('qa-results');
const failures = [];
async function check(name, fn) {
 try { await fn(); console.log('PASS', name); }
 catch (error) { failures.push(name); console.error('FAIL', name, error.message); }
}
async function pageFor(browser, viewport = {width:1440,height:900}, options = {}) {
 const ctx = await browser.newContext({viewport, reducedMotion:'reduce', ...options});
 const page = await ctx.newPage();
 page.on('pageerror', e => failures.push('Browser error: ' + e.message));
 await page.goto(base); await page.evaluate(() => document.fonts.ready);
 return {ctx, page};
}
async function accessible(page) {
 const result = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 assert.deepEqual(result.violations.map(v => ({id:v.id,targets:v.nodes.map(n=>n.target)})), []);
}
(async () => {
 await fs.mkdir(output, {recursive:true});
 const browser = await chromium.launch({headless:true});
 for (const [width,height] of [[320,740],[390,844],[568,320],[768,1024],[820,1180],[1024,768],[1440,900],[1920,1080]]) {
  await check(`Layout ${width} × ${height}`, async () => {
   const {ctx,page} = await pageFor(browser,{width,height});
   const geometry = await page.evaluate(() => {
    const r = selector => document.querySelector(selector).getBoundingClientRect();
    const hero=r('.hero'), head=r('#hero-face-button'), caption=r('.hero-caption');
    return {overflow:document.documentElement.scrollWidth-innerWidth,headInHero:head.bottom<hero.bottom&&head.right<innerWidth&&head.left>=0,copyInHero:caption.bottom<hero.bottom,fonts:document.fonts.check('700 20px "Barlow Condensed"')};
   });
   assert.equal(geometry.overflow,0); assert.equal(geometry.headInHero,true); assert.equal(geometry.copyInHero,true); assert.equal(geometry.fonts,true);
   if ([390,1440].includes(width)) {
    await accessible(page);
    await page.screenshot({path:path.join(output,`hero-${width}.png`)});
    await page.locator('#multiverse').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(output,`forms-${width}.png`)});
    await page.locator('#interview').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(output,`quiz-${width}.png`)});
   }
   await ctx.close();
  });
 }
 await check('All eight forms, keyboard, hero and PNG downloads', async () => {
  const {ctx,page} = await pageFor(browser);
  for (let i=0;i<8;i++) {
   await page.locator(`[data-select="${i}"]`).click();
   assert.equal(await page.locator('#preview-face').getAttribute('data-face'),String(i));
   assert.equal(await page.locator('#hero-face').getAttribute('data-face'),String(i));
   assert.equal(await page.locator('[data-select][aria-pressed="true"]').count(),1);
   const downloadPromise=page.waitForEvent('download');
   await page.locator('#download-card').click(); const download=await downloadPromise;
   assert.equal(download.suggestedFilename(),`zumbino-forma-${i+1}.png`);
   const file=path.join(output,download.suggestedFilename());await download.saveAs(file);
   const bytes=await fs.readFile(file);assert.equal(bytes.readUInt32BE(16),800);assert.equal(bytes.readUInt32BE(20),1050);
  }
  await page.locator('[data-select="7"]').focus();await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#preview-face').getAttribute('data-face'),'0');
  await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#preview-face').getAttribute('data-face'),'7');
  await page.locator('#hero-face-button').click();assert.equal(await page.locator('#preview-face').getAttribute('data-face'),'0');
  await ctx.close();
 });
 await check('Roast filters, repetition, clipboard success and manual fallback', async () => {
  const {ctx,page}=await pageFor(browser);
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copied=text;}}}));
  for(const category of ['hr','linkedin','brainrot','all']) {
   await page.locator(`[data-category="${category}"]`).click();
   assert.equal(await page.locator('[data-category][aria-pressed="true"]').count(),1);
   let previous=await page.locator('#roast-text').textContent();
   for(let i=0;i<15;i++){await page.locator('#generate-roast').click();const next=await page.locator('#roast-text').textContent();assert.notEqual(next,previous);previous=next;}
  }
  await page.locator('#copy-roast').click();assert.equal(await page.evaluate(()=>window.copied),await page.locator('#roast-text').textContent());
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('blocked');}}}));
  await page.locator('#copy-roast').click();assert.equal(await page.locator('#copy-dialog').isVisible(),true);
  assert.equal(await page.locator('#copy-field').inputValue(),await page.locator('#roast-text').textContent());
  await accessible(page);await page.keyboard.press('Escape');assert.equal(await page.locator('#copy-dialog').isVisible(),false);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'copy-roast');
  await ctx.close();
 });
 await check('Speech interruption cannot reset a newer utterance', async () => {
  const {ctx,page}=await pageFor(browser);
  await page.evaluate(()=>Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return[];},speak(u){window.lastUtterance=u;}},configurable:true}));
  await page.locator('#speak-roast').click();await page.evaluate(()=>{window.oldEnd=window.lastUtterance.onend;window.oldError=window.lastUtterance.onerror;});
  await page.locator('#speak-roast').click();assert.equal(await page.locator('#speak-roast').getAttribute('aria-pressed'),'false');
  await page.locator('#speak-roast').click();await page.evaluate(()=>{window.oldEnd();window.oldError({error:'interrupted'});});
  assert.equal(await page.locator('#speak-roast').getAttribute('aria-pressed'),'true');
  await page.locator('#generate-roast').click();assert.equal(await page.locator('#speak-roast').getAttribute('aria-pressed'),'false');
  await page.locator('#speak-roast').click();await page.evaluate(()=>window.lastUtterance.onerror({error:'voice-unavailable'}));
  assert.equal(await page.locator('#speak-roast').getAttribute('aria-pressed'),'false');
  await ctx.close();
 });
 await check('Quiz: all outcomes, double clicks and replay on mobile', async () => {
  const {ctx,page}=await pageFor(browser,{width:390,height:844});
  const routes=[{answers:[1,1,0,1,0,0],score:300,title:'Assunto.'},{answers:[2,0,1,2,2,1],score:215,title:'Promosso'},{answers:[0,2,2,0,1,1],score:125,title:'Tirocinante'}];
  for(const route of routes) {
   for(let i=0;i<6;i++) {
    await page.locator(`[data-answer="${route.answers[i]}"]`).click();
    await page.evaluate(index=>document.querySelector(`[data-answer="${index}"]`).dispatchEvent(new Event('click')),route.answers[i]);
    assert.equal(await page.locator('#quiz-feedback').isVisible(),true);
    await page.locator('#quiz-next').click();
   }
   assert.equal(await page.locator('#aura-score').textContent(),String(route.score));
   assert.ok((await page.locator('#quiz-question').textContent()).startsWith(route.title));
   assert.equal(await page.locator('#quiz-result').isVisible(),true);await accessible(page);
   await page.locator('#quiz-again').click();assert.equal(await page.locator('#aura-score').textContent(),'000');
   assert.equal(await page.locator('[data-answer]:enabled').count(),3);
  }
  await ctx.close();
 });
 await check('Motion toggle stops active effects, parallax and star rendering', async () => {
  const {ctx,page}=await pageFor(browser,undefined,{reducedMotion:'no-preference'});
  await page.locator('#warp-button').click();assert.equal(await page.locator('#warp-button').getAttribute('aria-pressed'),'true');
  await page.locator('#motion').click();assert.equal(await page.locator('#warp-button').getAttribute('aria-pressed'),'false');
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
  await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>document.getAnimations().length),0);
  await page.locator('#clone').click();await page.locator('#motion').click();await page.locator('#motion').click();
  assert.equal(await page.locator('#particles > *').count(),0);
  await page.locator('#motion').click();await page.locator('#lore').scrollIntoViewIfNeeded();await page.waitForTimeout(100);
  assert.equal(await page.evaluate(()=>starFrame),0);
  await page.locator('.hero').scrollIntoViewIfNeeded();await page.waitForTimeout(100);assert.notEqual(await page.evaluate(()=>starFrame),0);
  await ctx.close();
 });
 await check('Asset failure keeps a usable cursor and explains download failure', async () => {
  const ctx=await browser.newContext();await ctx.route('**/gabriele-multiverse.png',route=>route.abort());const page=await ctx.newPage();await page.goto(base);
  await page.waitForFunction(()=>document.body.classList.contains('faces-unavailable'));
  assert.equal(await page.evaluate(()=>document.body.classList.contains('custom-cursor')),false);
  await page.locator('#download-card').click();assert.match(await page.locator('#toast').textContent(),/non caricata/);await ctx.close();
 });
 await check('No external runtime dependencies or broken local requests',async()=>{
  const ctx=await browser.newContext(),page=await ctx.newPage();const external=[],broken=[];
  page.on('request',r=>{if(!r.url().startsWith(base)&&/^https?:/.test(r.url()))external.push(r.url());});
  page.on('response',r=>{if(r.status()>=400)broken.push(r.url());});
  await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.locator('#lore').scrollIntoViewIfNeeded();await page.waitForTimeout(100);
  assert.deepEqual(external,[]);assert.deepEqual(broken,[]);await ctx.close();
 });
 await browser.close();
 if(process.env.WEBKIT_EXECUTABLE)await check('WebKit: forms and quiz',async()=>{
  const b=await webkit.launch({headless:true,executablePath:process.env.WEBKIT_EXECUTABLE});const {ctx,page}=await pageFor(b,{width:390,height:844});
  await page.locator('[data-select="5"]').click();assert.equal(await page.locator('#preview-name').textContent(),'MAGO DEI KPI');
  await page.locator('[data-answer="1"]').click();await page.locator('#quiz-next').click();assert.match(await page.locator('#quiz-step').textContent(),/02/);
  await accessible(page);await page.screenshot({path:path.join(output,'webkit.png')});await ctx.close();await b.close();
 });
 console.log(`${failures.length ? 'FAILED' : 'PASSED'}: ${failures.length} failures.`);
 if(failures.length){console.error(failures);process.exitCode=1;}
})().catch(error=>{console.error(error);process.exitCode=1;});
