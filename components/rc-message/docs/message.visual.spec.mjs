import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, environmentCases, applyEnvironment, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
const naturalStates = ["loading"];
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states.filter(state => !naturalStates.includes(state))) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test('Message ' + [config.designSystem,config.colorMode,size,density,state].join(' '), {
        tag: ['@rc-message','@matrix',...(!crossEngine ? ['@chromium-only'] : [])],
        annotation: {type:'matrix',description:JSON.stringify({...config,size,density,state})},
    }, async ({page,browserName,previewOrigin}, info) => {
        await openDemo(page, previewOrigin, 'rc-message', spec.demo, {...config, density});
        await page.getByLabel('验收尺寸', {exact:true}).selectOption(size);
        await page.getByLabel('验收密度', {exact:true}).selectOption(density);
        await page.getByLabel('验收状态', {exact:true}).selectOption(state);
        const frame = page.getByRole('region', {name:'Message visual matrix'});
        const scene = frame.locator('[data-visual-scene]');
        const target = frame.locator('[data-visual-target]').first();
        await expect(scene).toHaveAttribute('data-state',state);
        await expect(scene).toHaveAttribute('data-size',size);
        await expect(scene).toHaveAttribute('data-density',density);

        if (state === 'closed') {
            await page.getByRole('button',{name:'关闭展示',exact:true}).click();
            await expect(target).toHaveCount(0);
        } else {
            await expect(target).toHaveAttribute('role','status');
        await expect(target).toHaveAttribute('aria-live','polite');
        if (state === 'updated') await expect(target).toContainText('草稿仍然保留');
            if (state !== 'group') {
                const rect = await target.boundingBox();
                expect(rect.width).toBeGreaterThan(0);
                expect(rect.height).toBeGreaterThan(0);
                await info.attach('geometry',{body:JSON.stringify(rect),contentType:'application/json'});
            }
        }
        await settleFiniteAnimations(page);

        await captureVisual(frame,[config.designSystem,config.colorMode,size,density,state].join('-')+'.png',info,browserName);
        if (state === 'pressed') await page.mouse.up();
    });
}

// The package's motion spec owns reduced-motion acceptance, including geometry.
const environments = [...environmentCases.filter(environment => environment.id !== 'reduced-motion'),{id:'long-text'},{id:'theme-retention'}];
for (const environment of environments) test.describe('Message '+environment.id,()=>{
    test.use({hasTouch:environment.hasTouch ?? false});
    for (const config of configurations) test('Message environment '+config.designSystem+' '+config.colorMode+' '+environment.id,{
        tag:['@rc-message','@environment'],annotation:{type:'environment',description:JSON.stringify({id:environment.id,...config})},
    },async({page,browserName,previewOrigin},info)=>{
        await applyEnvironment(page,environment);
        await openDemo(page,previewOrigin,'rc-message',spec.demo,{...config,...environment.config});
        const frame=page.getByRole('region',{name:'Message visual matrix'});

        if (environment.id === 'long-text') {
            await page.getByLabel('长文本',{exact:true}).check();

        }
        if (environment.id === 'rtl') expect(await frame.evaluate(node=>getComputedStyle(node).direction)).toBe('rtl');
        if (environment.id === 'theme-retention') {
            const draft=page.getByLabel('配置切换草稿',{exact:true});
            await draft.fill('Draft retained through theme changes');
            const instance=await draft.elementHandle();
            await page.evaluate(next=>globalThis.postMessage({type:'crab:preview-config',...next},globalThis.location.origin),{designSystem:config.designSystem==='md3'?'apple':'md3',colorMode:config.colorMode==='light'?'dark':'light'});
            const boundary=page.locator('.demo-default-preview').first();
            await expect(boundary).toHaveAttribute('data-crab-design',config.designSystem==='md3'?'apple':'md3');
            await expect(boundary).toHaveAttribute('data-theme',config.colorMode==='light'?'dark':'light');
            await expect(draft).toHaveValue('Draft retained through theme changes');
            expect(await draft.evaluate((node,previous)=>node===previous,instance)).toBe(true);
        }

        await settleFiniteAnimations(page);
        const geometry=await frame.evaluate(node=>({client:node.clientWidth,scroll:node.scrollWidth}));
        expect(geometry.scroll).toBeLessThanOrEqual(geometry.client+1);
        await captureVisual(frame,[config.designSystem,config.colorMode,environment.id].join('-')+'.png',info,browserName);
    });
});

for (const config of configurations) test('Message public portal queue '+config.designSystem+' '+config.colorMode,{tag:['@rc-message','@environment']},async ({page,previewOrigin},info)=>{
    await openDemo(page,previewOrigin,'rc-message',spec.demo,config);
    await page.getByRole('button',{name:'打开浮层',exact:true}).click();
    const portal = page.getByRole('status').filter({hasText:'浮层消息'});
    await expect(portal).toBeVisible();
    await expect(portal).toHaveAttribute('data-state','open');
    await page.getByRole('button',{name:'更新浮层',exact:true}).click();
    await expect(page.getByRole('status').filter({hasText:'浮层已更新'})).toBeVisible();
    await page.getByRole('button',{name:'打开浮层',exact:true}).click();
    await page.getByRole('button',{name:'打开浮层',exact:true}).click();
    await settleFiniteAnimations(page);
    await info.attach('portal-stack',{body:await page.screenshot({animations:'allow',caret:'hide'}),contentType:'image/png'});
    await page.getByRole('button',{name:'关闭浮层',exact:true}).click();
    await settleFiniteAnimations(page);
    await expect(page.getByRole('status').filter({hasText:'浮层已更新'})).toBeVisible();
});
