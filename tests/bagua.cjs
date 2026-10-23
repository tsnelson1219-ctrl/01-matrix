let playwright;try{playwright=require('playwright');}catch{playwright=require(require('node:path').join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const {chromium}=playwright;
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const scope={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'bagua-data.js'),'utf8'),scope);
const data=scope.window.BAGUA_DATA;
// Independent lower-by-upper lookup, transcribed from the Zhouyi reference table.
const order=['乾','兌','離','震','巽','坎','艮','坤'];
const expected=[
 ['乾','夬','大有','大壯','小畜','需','大畜','泰'],
 ['履','兌','睽','歸妹','中孚','節','損','臨'],
 ['同人','革','離','豐','家人','既濟','賁','明夷'],
 ['無妄','隨','噬嗑','震','益','屯','頤','復'],
 ['姤','大過','鼎','恆','巽','井','蠱','升'],
 ['訟','困','未濟','解','渙','坎','蒙','師'],
 ['遯','咸','旅','小過','漸','蹇','艮','謙'],
 ['否','萃','晉','豫','觀','比','剝','坤']
];
assert.equal(data.hexagrams.length,64);assert.equal(new Set(data.hexagrams.map(h=>h[1]+h[2])).size,64);
order.forEach((lower,i)=>order.forEach((upper,j)=>assert.equal(data.hexagrams.find(h=>h[1]===upper&&h[2]===lower)[0],expected[i][j])));
assert.deepEqual(Array.from(data.arrangements.later),['坎','艮','震','巽','離','坤','兌','乾']);
assert.deepEqual(Array.from(data.arrangements.earlier),['坤','震','離','兌','乾','巽','坎','艮']);
const bits={乾:'111',兌:'110',離:'101',震:'100',巽:'011',坎:'010',艮:'001',坤:'000'};
Object.entries(bits).forEach(([n,v])=>assert.equal(data.trigrams[n].lines.join(''),v));
async function point(frame,name){return frame.evaluate(name=>{const i=D.arrangements[state.mode].indexOf(name),[x,y]=polar(194,i*45);const pt=new DOMPoint(x,y).matrixTransform(document.getElementById('rotating').getScreenCTM());return {x:pt.x,y:pt.y};},name);}
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const context=await browser.newContext({viewport:{width:390,height:900},hasTouch:true});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:18769/bagua.html');await page.locator('.gua').first().waitFor();
  assert.equal(await page.evaluate(()=>state.mode),'later');
  let pos=await point(page,'坎');await page.mouse.move(pos.x,pos.y);await page.mouse.down();await page.waitForTimeout(650);await page.mouse.up();
  assert.deepEqual(await page.evaluate(()=>[state.upper,state.lower,state.target]),['坎',null,'lower']);
  pos=await point(page,'離');await page.mouse.click(pos.x,pos.y);
  assert.equal(await page.locator('#hexTitle').textContent(),'水火既濟');assert.equal(await page.locator('#hexNumber').textContent(),'第 63 卦');
  await page.locator('[data-mode=earlier]').click();assert.deepEqual(await page.evaluate(()=>[state.upper,state.lower]),['坎','離']);
  // Touch long press then tap the same trigram must produce a pure hexagram.
  const cdp=await context.newCDPSession(page);pos=await point(page,'乾');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[pos]});await page.waitForTimeout(650);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.touchscreen.tap(pos.x,pos.y);assert.equal(await page.locator('#hexTitle').textContent(),'乾為天');
  await page.locator('#clear').click();pos=await point(page,'兌');
  await page.mouse.move(pos.x,pos.y);await page.mouse.down();await page.mouse.move(pos.x+70,pos.y+30,{steps:8});await page.waitForTimeout(650);await page.mouse.up();
  assert.equal(await page.evaluate(()=>state.upper),null);assert.ok(Math.abs(await page.evaluate(()=>state.rotation))>1);
  await page.locator('#resetNorth').click();assert.equal(await page.evaluate(()=>state.rotation),0);
  // A canceled touch and blur must never turn into delayed selections.
  pos=await point(page,'震');await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[pos]});await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await page.waitForTimeout(650);assert.equal(await page.evaluate(()=>state.upper),null);
  await page.locator('[data-gua=坤]').focus();await page.keyboard.press('Space');await page.locator('[data-gua=乾]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#hexTitle').textContent(),'地天泰');
  await page.keyboard.press('ArrowRight');assert.equal(await page.evaluate(()=>state.rotation),5);await page.keyboard.press('Home');assert.equal(await page.evaluate(()=>state.rotation),0);
  // For every combination, the six rendered line groups must agree with the bits.
  assert.equal(await page.evaluate(()=>{for(const h of D.hexagrams){state.upper=h[1];state.lower=h[2];renderResult();const actual=cls=>{const rects=[...document.querySelectorAll('#hexagram .'+cls)];const ys=[...new Set(rects.map(r=>r.getAttribute('y')))];return ys.map(y=>rects.filter(r=>r.getAttribute('y')===y).length===1?1:0).reverse().join('');};if(actual('upper-yao')!==D.trigrams[h[1]].lines.join('')||actual('lower-yao')!==D.trigrams[h[2]].lines.join(''))return false;}return true;}),true);
  for(const width of [320,390,844,1280]){await page.setViewportSize({width,height:1000});for(const mode of ['later','earlier']){await page.locator('[data-mode='+mode+']').click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.evaluate(()=>{for(let r=0;r<360;r+=5){state.rotation=r;paintRotation();const a=[...document.querySelectorAll('#compass text')].map(t=>t.getBoundingClientRect());for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(Math.min(a[i].right,a[j].right)-Math.max(a[i].left,a[j].left)>1&&Math.min(a[i].bottom,a[j].bottom)-Math.max(a[i].top,a[j].top)>1)return false;}return true;}),true);}}
  await page.setViewportSize({width:390,height:1000});await page.locator('#resetNorth').click();await page.locator('#theme').click();await page.locator('[data-mode=later]').click();await page.locator('#upperSlot').click();pos=await point(page,'乾');await page.mouse.click(pos.x,pos.y);pos=await point(page,'兌');await page.mouse.click(pos.x,pos.y);
  await page.screenshot({path:path.join(root,'tests','bagua-mobile.png'),fullPage:true});
  await page.goto('http://127.0.0.1:18769/index.html');await page.waitForFunction(()=>navigator.serviceWorker.controller);await page.locator('.nav-btn').filter({hasText:/^八卦$/}).click();const handle=await page.waitForSelector('#app-frame-6'),frame=await handle.contentFrame();await frame.locator('.gua').first().waitFor();
  await frame.locator('#upperSlot').click();await frame.locator('[data-gua=坎]').focus();await page.keyboard.press('Enter');await frame.locator('[data-gua=離]').focus();await page.keyboard.press('Enter');assert.equal(await frame.locator('#hexTitle').textContent(),'水火既濟');
  const before=await frame.locator('body').evaluate(e=>e.classList.contains('light'));await page.locator('.theme-btn').click();assert.notEqual(await frame.locator('body').evaluate(e=>e.classList.contains('light')),before);
  await page.locator('.nav-btn').filter({hasText:/^子午流注$/}).click();await page.locator('.nav-btn').filter({hasText:/^八卦$/}).click();assert.equal(await frame.locator('#hexTitle').textContent(),'水火既濟');
  await context.setOffline(true);await page.reload();await page.locator('.nav-btn').filter({hasText:/^八卦$/}).click();const offlineFrame=await (await page.waitForSelector('#app-frame-6')).contentFrame();await offlineFrame.locator('.gua').first().waitFor();assert.equal(await offlineFrame.locator('.gua').count(),8);
  assert.deepEqual(errors,[]);console.log('PASS: 64 mappings and six-line renders, mouse/touch/keyboard selection, pure hexagram, drag/cancel/reset, 4 widths × 2 modes × 72 angles, integrated theme/state, offline reload.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});