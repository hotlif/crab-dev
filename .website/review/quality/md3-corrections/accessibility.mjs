import {writeFile} from 'node:fs/promises';
import {connectReviewBrowser} from '../../../scripts/production-browser.mjs';
const b=await connectReviewBrowser();const results=[];const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function page(path,selector){await b.call('Page.navigate',{url:`http://127.0.0.1:4175${path}`});for(let i=0;i<80;i++){await pause(100);if(await b.evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)){await b.evaluate('document.fonts.ready');await pause(400);return;}}throw new Error(path);}
function record(name,passed,evidence){results.push({name,passed,evidence});console.log(name,passed,evidence);}
try{
 await b.call('Emulation.setDeviceMetricsOverride',{width:320,height:960,deviceScaleFactor:1,mobile:true});
 await b.call('Emulation.setTouchEmulationEnabled',{enabled:true});
 await b.call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await page('/','.crab-home');
 const tools=await b.evaluate(`Array.from(document.querySelectorAll('.crab-docs-header-tools button')).map(e=>({label:e.getAttribute('aria-label'),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))`);
 record('mobile toolbar targets',tools.every(e=>e.width>=48&&e.height>=48),tools);
 await page('/components/rc-tabs/workbench/?__wake_demo=docs%2Fdemos%2Fclosable.demo.tsx','.demo-default-preview [role=tab]');
 const close=await b.evaluate(`Array.from(document.querySelectorAll('.demo-default-preview [role=tab] [role=button]')).map(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))`);
 record('touch close targets',close.length>0&&close.every(e=>e.width>=48&&e.height>=48),close);
 await b.call('Emulation.setTouchEmulationEnabled',{enabled:false});
 for(const type of ['card','pill']){
  await page(`/components/rc-tabs/workbench/?__wake_demo=docs%2Fdemos%2F${type}.demo.tsx`,'.demo-default-preview [role=tab]');
  await b.evaluate(`{const e=document.querySelectorAll('.demo-default-preview [role=tab]')[1];e.disabled=true;e.setAttribute('aria-disabled','true');}`);
  const p=await b.evaluate(`{const e=document.querySelectorAll('.demo-default-preview [role=tab]')[1];e.scrollIntoView();const r=e.getBoundingClientRect();({x:r.x+r.width/2,y:r.y+r.height/2})}`);
  await b.call('Input.dispatchMouseEvent',{type:'mouseMoved',...p});await pause(100);
  const disabled=await b.evaluate(`{const e=document.querySelectorAll('.demo-default-preview [role=tab]')[1],s=getComputedStyle(e);({opacity:s.opacity,cursor:s.cursor,layer:getComputedStyle(e,'::before').opacity})}`);
  record(`${type} native disabled excludes state layer`,disabled.layer==='0',disabled);
 }
 await b.call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await page('/components/rc-tabs/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx','.demo-default-preview [role=tab]');
 const textZoom=await b.evaluate(`{const e=document.querySelector('.demo-default-preview [role=tab]'),label=e.lastElementChild;label.textContent='较长的标签文字';({labelWidth:label.getBoundingClientRect().width,indicatorWidth:parseFloat(getComputedStyle(label,'::after').width)})}`);
 record('indicator follows changed label width',textZoom.labelWidth===textZoom.indicatorWidth&&textZoom.labelWidth>=56,textZoom);
}finally{await writeFile(new URL('./accessibility.json',import.meta.url),JSON.stringify({capturedAt:new Date().toISOString(),results},null,2)+'\n');await b.call('Emulation.setTouchEmulationEnabled',{enabled:false});await b.call('Emulation.setEmulatedMedia',{features:[]});b.close();}
if(results.some(r=>!r.passed))process.exitCode=1;
