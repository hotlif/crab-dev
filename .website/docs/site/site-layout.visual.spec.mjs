import { test, expect, configurations, environmentCases, applyEnvironment, captureVisual, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sitePages, openSite, article, assertDocumentWidth } from './site-visual-support.mjs';

// Cold MDX, real component frames and tutorial screenshots share this budget.
test.describe.configure({ timeout: 60_000 });
const viewports=environmentCases.filter(environment => ['narrow','tablet','desktop'].includes(environment.id));
for(const config of configurations) for(const environment of viewports) for(const definition of sitePages) {
    const crossEngine=environment.id==='desktop';
    test('Site '+[definition.id,config.designSystem,config.colorMode,environment.id].join(' '),{
        tag:['@website','@site-layout',...(!crossEngine?['@chromium-only']:[])],
        annotation:{type:'site',description:JSON.stringify({...config,page:definition.id,viewport:environment.id,state:'default'})},
    },async({page,previewOrigin,browserName},info)=>{
        await applyEnvironment(page,environment);
        await openSite(page,previewOrigin,definition,config);
        await expect(page.getByRole('link',{name:'Crab UI',exact:true}).getByText('Crab UI',{exact:true})).toBeVisible();
        if(environment.id==='desktop') {
            const label=page.getByRole('button',{name:'搜索文档',exact:true}).getByText('搜索文档…',{exact:true});
            await expect(label).toBeVisible();
            await expect(label).toBeInViewport();
        }
        await expect(article(page)).toBeVisible();
        await assertDocumentWidth(page,info);
        if(definition.id==='home') {
            const labels=await page.getByRole('radiogroup',{name:'首页设计体系',exact:true}).getByRole('radio').evaluateAll(nodes=>nodes.map(node=>{
                const label=node.parentElement.lastElementChild;
                return {text:label.textContent,client:label.clientWidth,scroll:label.scrollWidth};
            }));
            for(const label of labels) expect(label.scroll,label.text+' stays readable').toBeLessThanOrEqual(label.client+1);
        }
        if(definition.id==='catalog') {
            const columns=await page.locator('.crab-catalog-grid').first().evaluate(node=>getComputedStyle(node).gridTemplateColumns.split(' ').length);
            expect(columns).toBe(environment.id==='desktop'?3:environment.id==='tablet'?2:1);
            await expect(page.locator('.crab-docs-sidebar')).not.toBeVisible();
        }
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
