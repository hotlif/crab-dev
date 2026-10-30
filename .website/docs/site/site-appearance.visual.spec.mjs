import { test, expect, configurations, environmentCases, applyEnvironment } from '../../../test/visual/component-fixture.mjs';
import { sitePages, designIds, openSite, chooseDesign, chooseMode, assertSiteConfiguration, assertDocumentWidth, recordNaturalSite } from './site-visual-support.mjs';

test.use({video:'on'});
const guide=sitePages.find(page=>page.id==='design');
const tutorial=sitePages.find(page=>page.id==='tutorial');
const viewports=environmentCases.filter(environment=>['narrow','tablet','desktop'].includes(environment.id));
for(const config of configurations) for(const environment of viewports) {
    test('Site appearance preserves drafts '+[config.designSystem,config.colorMode,environment.id].join(' '),{
        tag:['@website','@site-appearance',...(environment.id!=='desktop'?['@chromium-only']:[])],
        annotation:{type:'site',description:JSON.stringify({...config,viewport:environment.id,state:'appearance-draft-retention'})},
    },async({page,previewOrigin},info)=>{
        await applyEnvironment(page,environment);
        await openSite(page,previewOrigin,guide,config);
        const showcase=page.getByRole('group',{name:'三种风格交互对照',exact:true});
        const name=showcase.getByRole('textbox',{name:'项目名称',exact:true});
        const draft=showcase.getByRole('textbox',{name:'项目说明',exact:true});
        await name.fill('Quarterly Planning 工作区'); await draft.fill('保存真实项目草稿，不因站点配置切换而重建。');
        const choice=showcase.getByRole('checkbox',{name:'未选择',exact:true});
        const choiceInstance=await choice.elementHandle();
        // Checkbox's clipped native input is activated through its visible label.
        await choice.locator('..').click();
        await expect(choice).toBeChecked();
        const nameInstance=await name.elementHandle(),draftInstance=await draft.elementHandle();
        const next={designSystem:designIds[(designIds.indexOf(config.designSystem)+1)%designIds.length],colorMode:config.colorMode==='light'?'dark':'light'};
        await chooseDesign(page,next.designSystem); await chooseMode(page,next.colorMode);
        await assertSiteConfiguration(page,next);
        await expect(showcase).toHaveAttribute('data-crab-design',next.designSystem);
        await expect(showcase).toHaveAttribute('data-theme',next.colorMode);
        await expect(name).toHaveValue('Quarterly Planning 工作区');
        await expect(draft).toHaveValue('保存真实项目草稿，不因站点配置切换而重建。');
        await expect(choice).toBeChecked();
        expect(await name.evaluate((node,previous)=>node===previous,nameInstance)).toBe(true);
        expect(await draft.evaluate((node,previous)=>node===previous,draftInstance)).toBe(true);
        expect(await choice.evaluate((node,previous)=>node===previous,choiceInstance)).toBe(true);
        await draft.scrollIntoViewIfNeeded();
        await recordNaturalSite(page,showcase,info,'appearance-live-viewport');
        await assertDocumentWidth(page,info);

        const response=await page.goto(previewOrigin+tutorial.path);
        expect(response.status()).toBe(200);
        // The real choice persists across a normal navigation; the init script
        // only creates missing saved preferences and cannot overwrite it.
        await assertSiteConfiguration(page,next);
        const lesson=page.locator('[data-tutorial="practice-profile"]');
        await lesson.getByRole('button',{name:/^02 ·/}).click();
        const student=lesson.getByRole('textbox',{name:'姓名',exact:true});
        await student.fill('周宁 教学草稿');
        await expect(lesson.locator('output')).toContainText('周宁 教学草稿');
        const studentInstance=await student.elementHandle();
        await chooseDesign(page,config.designSystem); await chooseMode(page,config.colorMode);
        await assertSiteConfiguration(page,config);
        await expect(student).toHaveValue('周宁 教学草稿');
        expect(await student.evaluate((node,previous)=>node===previous,studentInstance)).toBe(true);
        await student.scrollIntoViewIfNeeded();
        await recordNaturalSite(page,lesson,info,'tutorial-live-viewport');
    });
}
