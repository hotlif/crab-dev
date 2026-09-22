import {readdir,readFile,writeFile} from 'node:fs/promises';
import {connectReviewBrowser} from '../../../scripts/production-browser.mjs';
const browser=await connectReviewBrowser();const results=[];const root=new URL('../../../../components/',import.meta.url);const components=[];
for(const name of await readdir(root)){const pkg=JSON.parse(await readFile(new URL(`${name}/package.json`,root),'utf8'));if(pkg.websiteConfig)components.push(name);}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
try{
 await browser.call('Runtime.enable');
 for(const [theme,width] of [['light',1440],['dark',1440],['light',320]]){
  await browser.call('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]});
  await browser.call('Emulation.setDeviceMetricsOverride',{width,height:960,deviceScaleFactor:1,mobile:false});
  for(const name of components){
   await browser.call('Page.navigate',{url:`http://127.0.0.1:4175/components/${name}/`});
   let ready=false;
   for(let i=0;i<70;i++){await pause(100);if(await browser.evaluate("Boolean(document.querySelector('.crab-docs-page-heading h1'))")){ready=true;break;}}
   await pause(250);
   const evidence=await browser.evaluate(`({title:document.querySelector('.crab-docs-page-heading h1')?.textContent,scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,error:document.body.innerText.includes('页面发生错误')})`);
   const passed=ready&&evidence.scrollWidth<=width&&!evidence.error;results.push({name,theme,width,passed,evidence});
   console.log(`${passed?'PASS':'FAIL'} ${name} ${theme} ${width}`);
  }
 }
}finally{await writeFile(new URL('./page-sweep.json',import.meta.url),JSON.stringify({capturedAt:new Date().toISOString(),scope:'Document shells and initial viewport only; not every demo or interaction.',results,exceptions:browser.exceptions},null,2)+'\n');await browser.call('Emulation.setEmulatedMedia',{features:[]});browser.close();}
if(results.some(r=>!r.passed)||browser.exceptions.length)process.exitCode=1;
