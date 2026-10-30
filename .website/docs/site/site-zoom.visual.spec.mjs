import { zoomTest as test, expect, configurations, captureZoom, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sitePages, openSite, readySitePage, article, navigateFromSite, assertDocumentWidth, recordNaturalSite } from './site-visual-support.mjs';

const home=sitePages.find(page=>page.id==='home');
const catalog=sitePages.find(page=>page.id==='catalog');
const guide=sitePages.find(page=>page.id==='design');
const tutorial=sitePages.find(page=>page.id==='tutorial');
for(const config of configurations) {
    test('Site real 200% '+config.designSystem+' '+config.colorMode,{
        tag:['@website','@site-zoom','@environment','@chromium-only'],
        annotation:{type:'environment',description:JSON.stringify({id:'zoom-200',...config,scope:'production-site'})},
    },async({page,previewOrigin,realZoom},info)=>{
        test.setTimeout(120_000);
        await openSite(page,previewOrigin,home,config);
        await realZoom.set200(page);
        await assertDocumentWidth(page,info);
        await captureZoom(page,realZoom,config.designSystem+'-'+config.colorMode+'-site-zoom-home-viewport.png',info);
        await article(page).getByRole('link',{name:'组件目录',exact:true}).click();
        await readySitePage(page,catalog,config);
        await assertDocumentWidth(page,info);
        await captureZoom(page,realZoom,config.designSystem+'-'+config.colorMode+'-site-zoom-catalog-viewport.png',info);

        await navigateFromSite(page,'设计','三套设计体系');
        await readySitePage(page,guide,config);
        const showcase=page.getByRole('group',{name:'三种风格交互对照',exact:true});
        const input=showcase.getByRole('textbox',{name:'项目名称',exact:true});
        await input.scrollIntoViewIfNeeded(); await input.fill('200% 真实站点长内容验收');
        await expect(input).toHaveValue('200% 真实站点长内容验收');
        await recordNaturalSite(page,showcase,info,'site-zoom-guide-live',{realZoom});
        await assertDocumentWidth(page,info);

        await navigateFromSite(page,'实战','实战：资料编辑表单');
        await readySitePage(page,tutorial,config);
        const lesson=page.locator('[data-tutorial="practice-profile"]');
        const name=lesson.getByRole('textbox',{name:'姓名',exact:true});
        await name.scrollIntoViewIfNeeded(); await name.fill('真实缩放中的教学输入');
        await name.press('Tab');
        await expect(lesson.getByRole('textbox',{name:'邮箱',exact:true})).toBeFocused();
        await settleFiniteAnimations(page);
        await assertDocumentWidth(page,info);
        await captureZoom(page,realZoom,config.designSystem+'-'+config.colorMode+'-site-zoom-tutorial-viewport.png',info);
        await info.attach('site-zoom-scope',{body:JSON.stringify({scope:'visible native viewport at real tab zoom 2 across real route changes; no full-page claim',pages:['home','catalog','design','tutorial']}),contentType:'application/json'});
    });
}
