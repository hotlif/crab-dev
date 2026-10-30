import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, environmentCases, applyEnvironment, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
const naturalStates = [];
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states.filter(state => !naturalStates.includes(state))) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test('Empty ' + [config.designSystem,config.colorMode,size,density,state].join(' '), {
        tag: ['@rc-empty','@matrix',...(!crossEngine ? ['@chromium-only'] : [])],
        annotation: {type:'matrix',description:JSON.stringify({...config,size,density,state})},
    }, async ({page,browserName,previewOrigin}, info) => {
        await openDemo(page, previewOrigin, 'rc-empty', spec.demo, {...config, density});
        await page.getByLabel('验收尺寸', {exact:true}).selectOption(size);
        await page.getByLabel('验收密度', {exact:true}).selectOption(density);
        await page.getByLabel('验收状态', {exact:true}).selectOption(state);
        const frame = page.getByRole('region', {name:'Empty visual matrix'});
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

            await expect(target).toHaveAttribute('role','status');
        if (state === 'search') await expect(target).toContainText('未找到匹配内容');
        if (state === 'no-permission') await expect(target).toContainText('权限');
            if (state !== 'group') {
                const rect = await target.boundingBox();
                expect(rect.width).toBeGreaterThan(0);
                expect(rect.height).toBeGreaterThan(0);
                await info.attach('geometry',{body:JSON.stringify(rect),contentType:'application/json'});
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
for (const environment of environments) test.describe('Empty '+environment.id,()=>{
    test.use({hasTouch:environment.hasTouch ?? false});
    for (const config of configurations) test('Empty environment '+config.designSystem+' '+config.colorMode+' '+environment.id,{
        tag:['@rc-empty','@environment'],annotation:{type:'environment',description:JSON.stringify({id:environment.id,...config})},
    },async({page,browserName,previewOrigin},info)=>{
        await applyEnvironment(page,environment);
        await openDemo(page,previewOrigin,'rc-empty',spec.demo,{...config,...environment.config});
        const frame=page.getByRole('region',{name:'Empty visual matrix'});

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
            await page.getByLabel('验收状态',{exact:true}).selectOption('action');
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
