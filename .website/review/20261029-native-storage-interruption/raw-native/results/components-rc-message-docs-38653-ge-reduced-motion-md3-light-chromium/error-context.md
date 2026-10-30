# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: components\rc-message\docs\message.motion.visual.spec.mjs >> Message reduced motion md3 light
- Location: components\rc-message\docs\message.motion.visual.spec.mjs:33:38

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [ref=e5]:
  - generic [ref=e6]:
    - generic [ref=e7]:
      - text: 验收尺寸
      - combobox "验收尺寸" [ref=e8]:
        - option "medium" [selected]
    - generic [ref=e9]:
      - text: 验收密度
      - combobox "验收密度" [ref=e10]:
        - option "standard" [selected]
    - generic [ref=e11]:
      - text: 验收状态
      - combobox "验收状态" [ref=e12]:
        - option "default"
        - option "success"
        - option "warning"
        - option "error"
        - option "long-content"
        - option "updated"
        - option "closed"
        - option "loading" [selected]
    - button "关闭展示" [ref=e13] [cursor=pointer]
    - button "打开浮层" [ref=e16] [cursor=pointer]
    - button "更新浮层" [ref=e19] [cursor=pointer]
    - button "关闭浮层" [ref=e22] [cursor=pointer]
  - generic [ref=e25]:
    - checkbox "长文本" [ref=e26]
    - text: 长文本
  - generic [ref=e27]:
    - text: 配置切换草稿
    - textbox "配置切换草稿" [ref=e28]: 保留这份草稿
  - region "Message visual matrix" [ref=e30]:
    - status [ref=e32]:
      - generic [ref=e37]: 操作结果：工作区已保存
```

# Test source

```ts
  1  | import {test,expect,configurations,openDemo,readVisualSpec} from '../../../test/visual/component-fixture.mjs';
  2  | const spec=await readVisualSpec(import.meta.url);
  3  | const naturalStates=["loading"];
  4  | test.use({video:'on'});
  5  | for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of naturalStates) {
  6  |     const crossEngine=spec.crossEngine.sizes.includes(size)&&spec.crossEngine.densities.includes(density)&&spec.crossEngine.states.includes(state);
  7  |     test('Message natural '+[config.designSystem,config.colorMode,size,density,state].join(' '),{tag:['@rc-message','@matrix',...(!crossEngine?['@chromium-only']:[])],annotation:{type:'matrix',description:JSON.stringify({...config,size,density,state})}},async({page,previewOrigin},info)=>{
  8  |         await openDemo(page, previewOrigin, 'rc-message', spec.demo, {...config, density});
  9  |         await page.getByLabel('验收尺寸', {exact:true}).selectOption(size);
  10 |         await page.getByLabel('验收密度', {exact:true}).selectOption(density);
  11 |         await page.getByLabel('验收状态', {exact:true}).selectOption(state);
  12 |         const frame = page.getByRole('region', {name:'Message visual matrix'});
  13 |         const scene = frame.locator('[data-visual-scene]');
  14 |         const target = frame.locator('[data-visual-target]').first();
  15 |         await expect(scene).toHaveAttribute('data-state',state);
  16 |         await expect(scene).toHaveAttribute('data-size',size);
  17 |         await expect(scene).toHaveAttribute('data-density',density);
  18 |         const frames=[];
  19 |         for (let sample=0;sample<3;sample++) {
  20 |             if(sample) await page.waitForTimeout(180);
  21 |             const timings=await frame.evaluate(node=>node.getAnimations({subtree:true}).filter(animation=>animation.effect?.getComputedTiming().iterations===Infinity).map(animation=>({time:animation.currentTime,state:animation.playState,duration:animation.effect.getComputedTiming().duration})));
  22 |             expect(timings.length).toBeGreaterThan(0);
  23 |             expect(timings.every(animation=>animation.state==='running')).toBe(true);
  24 |             frames.push(timings);
  25 |             await info.attach('natural-'+sample,{body:await frame.screenshot({animations:'allow',caret:'hide'}),contentType:'image/png'});
  26 |         }
  27 |         expect(frames[2][0].time).toBeGreaterThan(frames[0][0].time);
  28 |         await info.attach('time-series',{body:JSON.stringify(frames),contentType:'application/json'});
  29 |         await expect(target).toBeVisible();
  30 |     });
  31 | }
  32 | 
  33 | for (const config of configurations) test('Message reduced motion '+config.designSystem+' '+config.colorMode,{tag:['@rc-message','@environment']},async({page,previewOrigin},info)=>{
  34 |     await page.emulateMedia({reducedMotion:'reduce'});
  35 |     await openDemo(page,previewOrigin,'rc-message',spec.demo,config);
  36 |     await page.getByLabel('验收状态',{exact:true}).selectOption('loading');
  37 |     const frame=page.getByRole('region',{name:'Message visual matrix'});
  38 |     const samples=[];
  39 |     for(let sample=0;sample<3;sample++) {
  40 |         if(sample) await page.waitForTimeout(180);
  41 |         const timing=await frame.locator('svg').evaluate(node=>node.getAnimations().map(animation=>({name:animation.animationName,time:animation.currentTime,state:animation.playState})));
> 42 |         expect(timing.some(animation=>animation.name==='rc-spin-breathe'&&animation.state==='running')).toBe(true);
     |                                                                                                         ^ Error: expect(received).toBe(expected) // Object.is equality
  43 |         expect(timing.some(animation=>animation.name==='rc-spin-rotate')).toBe(false);
  44 |         samples.push(timing);
  45 |         await info.attach('reduced-motion-'+sample,{body:await frame.screenshot({animations:'allow',caret:'hide'}),contentType:'image/png'});
  46 |     }
  47 |     await info.attach('time-series',{body:JSON.stringify(samples),contentType:'application/json'});
  48 | });
  49 | 
```