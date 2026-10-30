import { test, expect, configurations, environmentCases, applyEnvironment, captureVisual, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sitePages, openSite, readySitePage, article, navigateFromSite, appearanceTrigger, openAppearance, assertDocumentWidth } from './site-visual-support.mjs';

const home=sitePages.find(page=>page.id==='home');
const catalog=sitePages.find(page=>page.id==='catalog');
const component=sitePages.find(page=>page.id==='component');
const viewports=environmentCases.filter(environment=>['narrow','tablet','desktop'].includes(environment.id));
for(const config of configurations) for(const environment of viewports) {
    test('Site navigation '+[config.designSystem,config.colorMode,environment.id].join(' '),{
        tag:['@website','@site-navigation',...(environment.id!=='desktop'?['@chromium-only']:[])],
        annotation:{type:'site',description:JSON.stringify({...config,viewport:environment.id,state:'navigation-search-keyboard'})},
    },async({page,previewOrigin,browserName},info)=>{
        await applyEnvironment(page,environment);
        await openSite(page,previewOrigin,home,config);
        const menu=await openAppearance(page,{keyboard:true});
        const options=menu.getByRole('menuitemradio');
        await page.keyboard.press('Home'); await expect(options.first()).toBeFocused();
        await page.keyboard.press('ArrowDown'); await expect(options.nth(1)).toBeFocused();
        await page.keyboard.press('End'); await expect(options.last()).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(menu).not.toBeVisible(); await expect(appearanceTrigger(page)).toBeFocused();

        if(environment.id!=='desktop') {
            const trigger=page.getByRole('button',{name:'导航',exact:true});
            await trigger.click();
            const drawer=page.getByRole('dialog',{name:'文档导航',exact:true});
            await expect(drawer).toBeVisible();
            await expect(trigger).toHaveAttribute('aria-expanded','true');
            await settleFiniteAnimations(page);
            await captureVisual(page,['mobile-navigation',config.designSystem,config.colorMode,environment.id].join('-')+'.png',info,browserName);
            await page.keyboard.press('Escape');
            await expect(drawer).not.toBeVisible(); await expect(trigger).toBeFocused();
        }
        await navigateFromSite(page,'组件','组件目录');
        await readySitePage(page,catalog,config);
        await article(page).getByRole('link',{name:'LineEdit 单行输入框',exact:true}).click();
        await readySitePage(page,component,config);
        await expect(page.getByRole('navigation',{name:'组件快捷入口',exact:true})).toBeVisible();

        await page.getByRole('button',{name:'搜索文档',exact:true}).click();
        const search=page.getByRole('dialog',{name:'搜索文档',exact:true});
        await expect(search).toBeVisible();
        const query=search.getByRole('combobox',{name:'搜索组件、属性或教程',exact:true});
        await expect(query).toBeFocused(); await query.fill('LineEdit');
        await expect(search.locator('.crab-docs-search')).toHaveAttribute('aria-busy','false');
        const results=search.getByRole('option');
        await expect.poll(()=>results.count()).toBeGreaterThan(1);
        const firstResult=results.first(),secondResult=results.nth(1);
        await expect(firstResult).toHaveAccessibleName(component.heading);
        const firstId=await firstResult.getAttribute('id'),secondId=await secondResult.getAttribute('id');
        expect(firstId).toBeTruthy(); expect(secondId).toBeTruthy();
        // Search initially selects the first result. Exercise both directions
        // and return to the exact component before activating it with Enter.
        await expect(firstResult).toHaveAttribute('aria-selected','true');
        await expect(query).toHaveAttribute('aria-activedescendant',firstId);
        await query.press('ArrowDown');
        await expect(secondResult).toHaveAttribute('aria-selected','true');
        await expect(firstResult).toHaveAttribute('aria-selected','false');
        await expect(query).toHaveAttribute('aria-activedescendant',secondId);
        await query.press('ArrowUp');
        await expect(firstResult).toHaveAttribute('aria-selected','true');
        await expect(query).toHaveAttribute('aria-activedescendant',firstId);
        await expect(search.getByRole('option',{selected:true})).toHaveCount(1);
        await settleFiniteAnimations(page);
        await captureVisual(page,['search-results',config.designSystem,config.colorMode,environment.id].join('-')+'.png',info,browserName);
        await query.press('Enter'); await expect(search).not.toBeVisible();
        await readySitePage(page,component,config);
        expect(await page.evaluate(()=>!!globalThis.document.activeElement?.closest('.crab-docs-content'))).toBe(true);
        await assertDocumentWidth(page,info);
    });
}
