import {writeFile,mkdir} from 'node:fs/promises';
import {connectReviewBrowser} from '../../../scripts/production-browser.mjs';
const browser=await connectReviewBrowser();
const results=[];
const output='.website/review/quality/md3-corrections';
const base=process.env.MD3_REVIEW_URL??'http://127.0.0.1:4175';
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const record=(name,passed,evidence)=>{results.push({name,passed,evidence});console.log(`${passed?'PASS':'FAIL'} ${name}: ${JSON.stringify(evidence)}`);};
async function navigate(path,selector){
 await browser.call('Page.navigate',{url:base+path});
 for(let i=0;i<100;i++){await delay(100); if(await browser.evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)) {await browser.evaluate('document.fonts.ready');await delay(250);return;}}
 throw new Error(`Page not ready ${path}`);
}
async function capture(name){const shot=await browser.call('Page.captureScreenshot',{format:'png'});await writeFile(`${output}/${name}.png`,Buffer.from(shot.data,'base64'));}
async function point(selector,type='mouseMoved',extra={}) {const p=await browser.evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await browser.call('Input.dispatchMouseEvent',{type,...p,...extra});await delay(200);}
async function styles(selector,pseudo){return browser.evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)}),s=getComputedStyle(e,${JSON.stringify(pseudo??null)}),r=e.getBoundingClientRect();return {width:r.width,height:r.height,cssWidth:s.width,cssHeight:s.height,content:s.content,color:s.color,background:s.backgroundColor,shadow:s.boxShadow,opacity:s.opacity,radius:s.borderTopLeftRadius,transform:s.transform,outline:s.outlineWidth,offset:s.outlineOffset,transition:s.transitionDuration};})()`);}
try{
 await mkdir(output,{recursive:true});await browser.call('Page.enable');await browser.call('Runtime.enable');
 for(const theme of ['light','dark']) {
  await browser.call('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]});
  for(const width of [320,768,1440]) {
   await browser.call('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
   for(const [path,ready,name] of [['/','.crab-home','home'],['/learn/components/','.crab-catalog-grid','catalog'],['/components/rc-tabs/','.crab-docs-page-heading','tabs-doc']]){
    await navigate(path,ready);
    const layout=await browser.evaluate(`({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,header:document.querySelector('.crab-docs-header').getBoundingClientRect().height,theme:document.querySelector('.crab-docs').dataset.theme})`);
    record(`${name} ${theme} ${width}`,layout.scrollWidth<=width&&layout.header===64&&layout.theme===theme,layout);
    if(width!==768) await capture(`${name}-${theme}-${width}`);
    if(name==='home'&&width===1440){
     record(`search ${theme}`, (await styles('.crab-docs-search-trigger')).height===56,await styles('.crab-docs-search-trigger'));
     await point('.crab-docs-rail-links > a');
     const rail=await styles('.crab-docs-rail-icon','::before');
     record(`rail hover ${theme}`,rail.opacity==='0.08',rail);
     await point('.crab-home-feature');
     const feature=await styles('.crab-home-feature','::before');
     record(`feature hover ${theme}`,feature.opacity==='0.08',feature);
    }
   }
  }
  await browser.call('Emulation.setDeviceMetricsOverride',{width:1000,height:850,deviceScaleFactor:1,mobile:false});
  await navigate('/components/rc-tabs/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx','.demo-default-preview [role=tab]');
  const tab='.demo-default-preview [role=tab]';
  const label=tab+'[aria-selected=true] > span:last-child';
  const active=await styles(label,'::after');
  record(`tab indicator ${theme}`,active.transform==='matrix(1, 0, 0, 1, 0, 0)'&&active.cssHeight==='3px'&&parseFloat(active.cssWidth)>=24,active);
  await point(tab);
  record(`tab hover ${theme}`,(await styles(tab,'::before')).opacity==='0.08',await styles(tab,'::before'));
  await browser.evaluate(`document.querySelector(${JSON.stringify(tab)}).focus()`);
  await browser.call('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
  await browser.call('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
  const keyboard=await browser.evaluate(`({selected:document.querySelector('.demo-default-preview [role=tab][aria-selected=true]').textContent,focused:document.activeElement.textContent,outline:getComputedStyle(document.activeElement).outlineWidth,offset:getComputedStyle(document.activeElement).outlineOffset})`);
  record(`tab keyboard ${theme}`,keyboard.selected==='日志'&&keyboard.focused==='日志'&&keyboard.outline==='2px'&&keyboard.offset==='-2px',keyboard);
  await capture(`tabs-${theme}`);
  await navigate('/components/rc-card/workbench/?__wake_demo=docs%2Fdemos%2Fclickable.demo.tsx','.demo-default-preview [role=button]');
  const card='.demo-default-preview [role=button]';
  const rest=await styles(card);await point(card);
  const hover=await styles(card,'::after');
  record(`card hover ${theme}`,hover.opacity==='0.08',hover);
  await point(card,'mousePressed',{button:'left',clickCount:1});
  const press=await styles(card,'::after');record(`card press ${theme}`,press.opacity==='0.12',press);
  await point(card,'mouseReleased',{button:'left',clickCount:1});
  await capture(`card-${theme}`);
  await navigate('/components/rc-card/workbench/?__wake_demo=docs%2Fdemos%2Fstates.demo.tsx','.demo-default-preview [role=button]');
  for(let i=0;i<3;i++){
   const selector=`.demo-default-preview [role=button]:nth-child(${i+1})`;
   await browser.call('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});
   const rest=await styles(selector);await point(selector);const hover=await styles(selector);
   record(`card variant ${i} hover ${theme}`,rest.background===hover.background&&hover.shadow!==rest.shadow&&rest.height===hover.height,{rest,hover});
   await point(selector,'mousePressed',{button:'left',clickCount:1});const pressed=await styles(selector);
   record(`card variant ${i} pressed ${theme}`,pressed.shadow===rest.shadow,{rest:rest.shadow,pressed:pressed.shadow});
   await point(selector,'mouseReleased',{button:'left',clickCount:1});
   const disabled=`.demo-default-preview [role=button]:nth-child(${i+4})`;await point(disabled);
   const disabledStyle=await styles(disabled);const disabledLayer=await styles(disabled,'::after');
   record(`card variant ${i} disabled ${theme}`,disabledStyle.opacity==='0.38'&&disabledLayer.content==='none',{disabledStyle,disabledLayer});
  }
  await capture(`card-states-${theme}`);
 }
 await browser.call('Emulation.setEmulatedMedia',{features:[{name:'forced-colors',value:'active'},{name:'prefers-reduced-motion',value:'reduce'}]});
 await navigate('/components/rc-tabs/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx','.demo-default-preview [role=tab]');
 const forced=await styles('.demo-default-preview [role=tab][aria-selected=true]');record('tabs forced colors',forced.outline==='2px',forced);await capture('tabs-forced-colors');
 record('runtime exceptions',browser.exceptions.length===0,browser.exceptions);
} finally {
 await writeFile(`${output}/browser.json`,JSON.stringify({capturedAt:new Date().toISOString(),base,results},null,2)+'\n');
 await browser.call('Emulation.setEmulatedMedia',{features:[]});browser.close();
}
if(results.some(item=>!item.passed))process.exitCode=1;
