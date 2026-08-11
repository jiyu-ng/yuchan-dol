// 모바일 청첩장 미리보기 캡처 — 뷰포트를 전체 높이로 키워 2등분 clip
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport:{width:400,height:850}, deviceScaleFactor:2 });
  const url = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(url, { waitUntil:'networkidle' });
  // 캡처용: 표지 vh가 전체높이 뷰포트에서 왜곡되지 않게 고정
  await page.addStyleTag({ content:'.cover{min-height:780px !important}' });
  await page.evaluate(async()=>{await new Promise(res=>{let y=0;const h=document.body.scrollHeight;
    const t=setInterval(()=>{y+=300;window.scrollTo(0,y);if(y>=h){clearInterval(t);res();}},50);});});
  await page.waitForTimeout(500);

  const H = await page.evaluate(()=>document.body.scrollHeight);
  await page.setViewportSize({ width:400, height:H });
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(400);

  const W=400, half=Math.ceil(H/2);
  await page.screenshot({ path: path.resolve(__dirname,'preview-full.png') });
  await page.screenshot({ path: path.resolve(__dirname,'preview-1.png'), clip:{x:0,y:0,width:W,height:half} });
  await page.screenshot({ path: path.resolve(__dirname,'preview-2.png'), clip:{x:0,y:half,width:W,height:H-half} });
  console.log('saved preview-1.png, preview-2.png (H='+H+')');
  await browser.close();
})();
