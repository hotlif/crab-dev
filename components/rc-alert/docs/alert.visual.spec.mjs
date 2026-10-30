import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, environmentCases, applyEnvironment, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
const naturalStates = [];
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states.filter(state => !naturalStates.includes(state))) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test('Alert ' + [config.designSystem,config.colorMode,size,density,state].join(' '), {
        tag: ['@rc-alert','@matrix',...(!crossEngine ? ['@chromium-only'] : [])],
        annotation: {type:'matrix',description:JSON.stringify({...config,size,density,state})},
    }, async ({page,browserName,previewOrigin}, info) => {
        await openDemo(page, previewOrigin, 'rc-alert', spec.demo, {...config, density});
        await page.getByLabel('验收尺寸', {exact:true}).selectOption(size);
        await page.getByLabel('验收密度', {exact:true}).selectOption(density);
        await page.getByLabel('验收状态', {exact:true}).selectOption(state);
        const frame = page.getByRole('region', {name:'Alert visual matrix'});
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
            await expect(target).toHaveAttribute('role', 'alert');
        if (state === 'error') await expect(target).toContainText('保存失败');
        if (state === 'action') { await target.getByRole('button', { name: '重试' }).click(); await expect(page.getByLabel('操作次数')).toHaveText('1'); }
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
for (const environment of environments) test.describe('Alert '+environment.id,()=>{
    test.use({hasTouch:environment.hasTouch ?? false});
    for (const config of configurations) test('Alert environment '+config.designSystem+' '+config.colorMode+' '+environment.id,{
        tag:['@rc-alert','@environment'],annotation:{type:'environment',description:JSON.stringify({id:environment.id,...config})},
    },async({page,browserName,previewOrigin},info)=>{
        await applyEnvironment(page,environment);
        await openDemo(page,previewOrigin,'rc-alert',spec.demo,{...config,...environment.config});
        const frame=page.getByRole('region',{name:'Alert visual matrix'});

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
            // L2 values may resolve through CSS fallbacks without an explicit
            // custom-property declaration. Measure Button's actual hit layer.
            const hitTarget=action.locator(':scope > [data-button-part="touch-target"]');
            await expect(hitTarget).toHaveCount(1);
            const visual=await action.boundingBox(),hit=await hitTarget.boundingBox();
            for(const rect of [visual,hit]) {
                expect(rect).not.toBeNull();
                for(const value of Object.values(rect)) expect(Number.isFinite(value)).toBe(true);
            }
            expect(hit.width).toBeGreaterThanOrEqual(48);
            expect(hit.height).toBeGreaterThanOrEqual(48);
            const center={x:hit.x+hit.width/2,y:hit.y+hit.height/2};
            const left=hit.x+0.5,right=hit.x+hit.width-0.5,top=hit.y+0.5,bottom=hit.y+hit.height-0.5;
            const points=[{x:left,y:center.y},{x:right,y:center.y},{x:center.x,y:top},{x:center.x,y:bottom},
                {x:left,y:top},{x:right,y:bottom},{x:left,y:bottom},{x:right,y:top}];
            for(const point of points) for(const value of Object.values(point)) expect(Number.isFinite(value)).toBe(true);
            const hits=await action.evaluate((node,points)=>points.map(point=>node.ownerDocument.elementFromPoint(point.x,point.y)?.closest('button')===node),points);
            expect(hits.every(Boolean)).toBe(true);
            const geometry={visual,hit,center,points,hits};
            const firstIcon=await target.locator('svg').first().boundingBox();
            const closeIcon=await action.locator('svg').first().boundingBox();
            await info.attach('close-visual-and-hit-geometry',{body:JSON.stringify({geometry,firstIcon,closeIcon,scope:'actual elementFromPoint at the public 48px hit-region edges; visual first-line alignment'}),contentType:'application/json'});
            expect(Math.abs(firstIcon.y+firstIcon.height/2-closeIcon.y-closeIcon.height/2)).toBeLessThanOrEqual(1);
            await captureVisual(frame,[config.designSystem,config.colorMode,'touch-target'].join('-')+'.png',info,browserName);
            // Activate outside the glyph's visual box to prove the real hit layer.
            expect(right).toBeGreaterThan(visual.x+visual.width);
            await page.touchscreen.tap(right,center.y);
            await expect(target).toHaveCount(0);
            await expect(page.getByLabel('操作次数',{exact:true})).toHaveText('1');
        }
        await settleFiniteAnimations(page);
        const geometry=await frame.evaluate(node=>({client:node.clientWidth,scroll:node.scrollWidth}));
        expect(geometry.scroll).toBeLessThanOrEqual(geometry.client+1);
        await captureVisual(frame,[config.designSystem,config.colorMode,environment.id].join('-')+'.png',info,browserName);
    });
});
