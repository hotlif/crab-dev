import {test,expect,configurations,openDemo,readVisualSpec,settleFiniteAnimations} from '../../../test/visual/component-fixture.mjs';
const spec=await readVisualSpec(import.meta.url);
const naturalStates=["loading"];
test.use({video:'on'});
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of naturalStates) {
    const crossEngine=spec.crossEngine.sizes.includes(size)&&spec.crossEngine.densities.includes(density)&&spec.crossEngine.states.includes(state);
    test('Message natural '+[config.designSystem,config.colorMode,size,density,state].join(' '),{tag:['@rc-message','@matrix',...(!crossEngine?['@chromium-only']:[])],annotation:{type:'matrix',description:JSON.stringify({...config,size,density,state})}},async({page,previewOrigin},info)=>{
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

for (const config of configurations) test('Message reduced motion '+config.designSystem+' '+config.colorMode,{
    tag:['@rc-message','@environment'],
    annotation:{type:'environment',description:JSON.stringify({id:'reduced-motion',...config})},
},async({page,previewOrigin},info)=>{
    await page.emulateMedia({reducedMotion:'reduce'});
    await openDemo(page,previewOrigin,'rc-message',spec.demo,config);
    await page.getByLabel('验收状态',{exact:true}).selectOption('loading');
    const frame=page.getByRole('region',{name:'Message visual matrix'});
    await settleFiniteAnimations(page);
    const geometry=await frame.evaluate(node=>({client:node.clientWidth,scroll:node.scrollWidth}));
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.client+1);
    const samples=[];
    for(let sample=0;sample<4;sample++) {
        if(sample) {
            const duration=samples[0].animations[0]?.duration;
            // Observe a natural cycle with four phase samples. Invalid timing
            // still gets captured and fails below instead of extending a wait.
            const interval=Number.isFinite(duration)&&duration>0&&duration<=5000?Math.ceil(duration/3)+20:180;
            await page.waitForTimeout(interval);
        }
        samples.push(await frame.locator('svg').evaluate(node=>{
            const style=getComputedStyle(node);
            return {
                reducedMotion:globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches,
                opacity:Number(style.opacity),transform:style.transform,
                animations:node.getAnimations().map(animation=>{
                    const timing=animation.effect.getTiming();
                    return {name:animation.animationName,time:animation.currentTime,state:animation.playState,
                        duration:timing.duration,iterations:timing.iterations===Infinity?'infinite':timing.iterations,
                        keyframes:animation.effect.getKeyframes().map(({offset,opacity,transform})=>({offset,opacity,transform}))};
                }),
            };
        }));
        await info.attach('reduced-motion-'+sample,{body:await frame.screenshot({animations:'allow',caret:'hide'}),contentType:'image/png'});
    }
    await info.attach('time-series',{body:JSON.stringify({
        scope:'actual reduce media and naturally advancing opacity-only loading feedback; generated names are diagnostic, no static golden',samples,
    }),contentType:'application/json'});
    // Crab CSS scopes keyframe names. Assert the real effect instead of its
    // source spelling, keeping the media, running state and motion contract.
    for(const sample of samples) {
        expect(sample.reducedMotion).toBe(true);
        expect(sample.transform).toBe('none');
        expect(Number.isFinite(sample.opacity)).toBe(true);
        expect(sample.opacity).toBeGreaterThan(0);
        expect(sample.opacity).toBeLessThanOrEqual(1);
        expect(sample.animations).toHaveLength(1);
        const animation=sample.animations[0];
        expect(animation.state).toBe('running');
        expect(animation.iterations).toBe('infinite');
        expect(Number.isFinite(animation.time)).toBe(true);
        expect(Number.isFinite(animation.duration)).toBe(true);
        expect(animation.duration).toBeGreaterThanOrEqual(1000);
        expect(animation.duration).toBeLessThanOrEqual(5000);
        expect(animation.keyframes.length).toBeGreaterThan(0);
        expect(new Set(animation.keyframes.map(keyframe=>keyframe.opacity).filter(opacity=>opacity!==undefined)).size).toBeGreaterThan(1);
        expect(animation.keyframes.every(keyframe=>!keyframe.transform||keyframe.transform==='none')).toBe(true);
    }
    const first=samples[0].animations[0];
    for(let index=1;index<samples.length;index++) {
        const sample=samples[index],previous=samples[index-1].animations[0];
        expect(sample.animations[0].name).toBe(first.name);
        expect(sample.animations[0].duration).toBe(first.duration);
        expect(sample.animations[0].time).toBeGreaterThan(previous.time);
    }
    expect(samples[3].animations[0].time-first.time).toBeGreaterThanOrEqual(first.duration);
    expect(new Set(samples.map(sample=>sample.opacity)).size).toBeGreaterThan(1);
});
