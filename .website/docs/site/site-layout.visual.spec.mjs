import { test, expect, configurations, environmentCases, applyEnvironment, captureVisual, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sitePages, openSite, article, assertDocumentWidth } from './site-visual-support.mjs';

const viewports=environmentCases.filter(environment => ['narrow','tablet','desktop'].includes(environment.id));
for(const config of configurations) for(const environment of viewports) for(const definition of sitePages) {
    const crossEngine=environment.id==='desktop';
    test('Site '+[definition.id,config.designSystem,config.colorMode,environment.id].join(' '),{
        tag:['@website','@site-layout',...(!crossEngine?['@chromium-only']:[])],
        annotation:{type:'site',description:JSON.stringify({...config,page:definition.id,viewport:environment.id,state:'default'})},
    },async({page,previewOrigin,browserName},info)=>{
        await applyEnvironment(page,environment);
        await openSite(page,previewOrigin,definition,config);
        await expect(article(page)).toBeVisible();
        await assertDocumentWidth(page,info);
        // Page captures are the visible viewport. Component states have separate
        // owner matrices and are never inferred from this site-level screenshot.
        await captureVisual(page,[definition.id,config.designSystem,config.colorMode,environment.id,'viewport'].join('-')+'.png',info,browserName);
        if(definition.id==='tutorial') {
            const lesson=page.locator('[data-tutorial="practice-profile"]');
            const input=lesson.getByRole('textbox',{name:'姓名',exact:true});
            await input.scrollIntoViewIfNeeded();
            await input.fill('现场教学示例');
            await expect(input).toHaveValue('现场教学示例');
            await settleFiniteAnimations(page);
            await captureVisual(lesson.locator('[data-wake-demo]').first(),[definition.id,config.designSystem,config.colorMode,environment.id,'runtime-boundary'].join('-')+'.png',info,browserName);
        }
    });
}
