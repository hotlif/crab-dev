import {test,expect,configurations,openDemo,readVisualSpec} from '../../../test/visual/component-fixture.mjs';
const spec=await readVisualSpec(import.meta.url);
const naturalStates=["loading"];
test.use({video:'on'});
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of naturalStates) {
    const crossEngine=spec.crossEngine.sizes.includes(size)&&spec.crossEngine.densities.includes(density)&&spec.crossEngine.states.includes(state);
    test('Card natural '+[config.designSystem,config.colorMode,size,density,state].join(' '),{tag:['@rc-card','@matrix',...(!crossEngine?['@chromium-only']:[])],annotation:{type:'matrix',description:JSON.stringify({...config,size,density,state})}},async({page,previewOrigin},info)=>{
        await openDemo(page, previewOrigin, 'rc-card', spec.demo, {...config, density});
        await page.getByLabel('验收尺寸', {exact:true}).selectOption(size);
        await page.getByLabel('验收密度', {exact:true}).selectOption(density);
        await page.getByLabel('验收状态', {exact:true}).selectOption(state);
        const frame = page.getByRole('region', {name:'Card visual matrix'});
        const scene = frame.locator('[data-visual-scene]');
        const target = frame.locator('[data-visual-target]').first();
        await expect(scene).toHaveAttribute('data-state',state);
        await expect(scene).toHaveAttribute('data-size',size);
        await expect(scene).toHaveAttribute('data-density',density);
        const frames=[];
        for (let sample=0;sample<3;sample++) {
            if(sample) await page.waitForTimeout(180);
            const timings=await frame.evaluate(node=>node.getAnimations({subtree:true}).filter(animation=>animation.effect?.getComputedTiming().iterations===Infinity).map(animation=>({time:animation.currentTime,state:animation.playState,duration:animation.effect.getComputedTiming().duration})));
            expect(timings.length).toBeGreaterThan(0);
            expect(timings.every(animation=>animation.state==='running')).toBe(true);
            frames.push(timings);
            await info.attach('natural-'+sample,{body:await frame.screenshot({animations:'allow',caret:'hide'}),contentType:'image/png'});
        }
        expect(frames[2][0].time).toBeGreaterThan(frames[0][0].time);
        await info.attach('time-series',{body:JSON.stringify(frames),contentType:'application/json'});
        await expect(target).toBeVisible();
    });
}
