import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, environmentCases, applyEnvironment, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
const naturalStates = [];
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states.filter(state => !naturalStates.includes(state))) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test('Notification ' + [config.designSystem,config.colorMode,size,density,state].join(' '), {
        tag: ['@rc-notification','@matrix',...(!crossEngine ? ['@chromium-only'] : [])],
        annotation: {type:'matrix',description:JSON.stringify({...config,size,density,state})},
    }, async ({page,browserName,previewOrigin}, info) => {
        await openDemo(page, previewOrigin, 'rc-notification', spec.demo, {...config, density});
        await page.getByLabel('验收尺寸', {exact:true}).selectOption(size);
        await page.getByLabel('验收密度', {exact:true}).selectOption(density);
        await page.getByLabel('验收状态', {exact:true}).selectOption(state);
        const frame = page.getByRole('region', {name:'Notification visual matrix'});
        const scene = frame.locator('[data-visual-scene]');
        const target = frame.locator('[data-visual-target]').first();
        await expect(scene).toHaveAttribute('data-state',state);
        await expect(scene).toHaveAttribute('data-size',size);
        await expect(scene).toHaveAttribute('data-density',density);
        const action = target.getByRole("button").first();
        if (state === 'hover') await action.hover();
        if (state === 'focus-visible') {
            await page.getByLabel('配置切换草稿',{exact:true}).focus();
            await page.keyboard.press('Tab');
            await expect(action).toBeFocused();
            expect(await action.evaluate(node => node.matches(':focus-visible'))).toBe(true);
        }
        if (state === 'pressed') { await action.hover(); await page.mouse.down(); }
        if (state === 'closed') {
            await target.getByRole('button').first().click();
            await expect(target).toHaveCount(0);
        } else {
            await expect(target).toHaveAttribute('role','status');
        if (state === 'updated') await expect(target).toContainText('草稿仍然保留');
        if (['top','topLeft','bottom','bottomLeft','bottomRight'].includes(state)) await expect(target).toHaveAttribute('data-direction',state);
            if (state !== 'group') {
                const rect = await target.boundingBox();
                expect(rect.width).toBeGreaterThan(0);
                expect(rect.height).toBeGreaterThan(0);
                await info.attach('geometry',{body:JSON.stringify(rect),contentType:'application/json'});
            }
        }
        await settleFiniteAnimations(page);
        if (state === 'focus-visible') {
            const metrics = await action.evaluate(node => { const style = getComputedStyle(node); const rect = node.getBoundingClientRect(); return {x:rect.x,y:rect.y,width:rect.width,height:rect.height,outline:parseFloat(style.outlineWidth),offset:parseFloat(style.outlineOffset),kind:style.outlineStyle}; });
            expect(metrics.kind).not.toBe('none'); expect(metrics.outline).toBeGreaterThan(0);
            const bounds = await frame.boundingBox(), reach = Math.max(0,metrics.outline + metrics.offset);
            expect(metrics.x-reach).toBeGreaterThanOrEqual(bounds.x); expect(metrics.y-reach).toBeGreaterThanOrEqual(bounds.y);
            expect(metrics.x+metrics.width+reach).toBeLessThanOrEqual(bounds.x+bounds.width); expect(metrics.y+metrics.height+reach).toBeLessThanOrEqual(bounds.y+bounds.height);
        }
        await captureVisual(frame,[config.designSystem,config.colorMode,size,density,state].join('-')+'.png',info,browserName);
        if (state === 'pressed') await page.mouse.up();
    });
}

const environments = [...environmentCases,{id:'long-text'},{id:'theme-retention'}];
for (const environment of environments) test.describe('Notification '+environment.id,()=>{
    test.use({hasTouch:environment.hasTouch ?? false});
    for (const config of configurations) test('Notification environment '+config.designSystem+' '+config.colorMode+' '+environment.id,{
        tag:['@rc-notification','@environment'],annotation:{type:'environment',description:JSON.stringify({id:environment.id,...config})},
    },async({page,browserName,previewOrigin},info)=>{
        await applyEnvironment(page,environment);
        await openDemo(page,previewOrigin,'rc-notification',spec.demo,{...config,...environment.config});
        const frame=page.getByRole('region',{name:'Notification visual matrix'});

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

        if(environment.id==='touch') {

            const target=frame.locator('[data-visual-target]').first();
            const action=target.getByRole('button').first();
            const bounds=await action.boundingBox();
            expect(bounds.width).toBeGreaterThanOrEqual(44); expect(bounds.height).toBeGreaterThanOrEqual(44);
            await captureVisual(frame,[config.designSystem,config.colorMode,'touch-target'].join('-')+'.png',info,browserName);
            await action.tap();
        }
        await settleFiniteAnimations(page);
        const geometry=await frame.evaluate(node=>({client:node.clientWidth,scroll:node.scrollWidth}));
        expect(geometry.scroll).toBeLessThanOrEqual(geometry.client+1);
        await captureVisual(frame,[config.designSystem,config.colorMode,environment.id].join('-')+'.png',info,browserName);
    });
});

for (const config of configurations) test('Notification public portal queue '+config.designSystem+' '+config.colorMode,{tag:['@rc-notification','@environment']},async ({page,previewOrigin},info)=>{
    await openDemo(page,previewOrigin,'rc-notification',spec.demo,config);
    await page.getByRole('button',{name:'打开浮层',exact:true}).click();
    const portal = page.getByRole('status').filter({hasText:'浮层通知'});
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
    const next = page.getByRole('status').filter({hasText:'浮层通知'});
    await expect(next).toBeVisible();
    await next.getByRole('button').click();
    await settleFiniteAnimations(page);
    await expect(page.getByRole('status').filter({hasText:'浮层已更新'})).toBeVisible();
});
