# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: .website\docs\site\site-navigation.visual.spec.mjs >> Site navigation md3 light desktop
- Location: .website\docs\site\site-navigation.visual.spec.mjs:9:5

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator:  getByRole('button', { name: /^文档外观：/ })
Expected: focused
Received: inactive
Timeout:  10000ms

Call log:
  - Expect "toBeFocused" getByRole('button', { name: /^文档外观：/ }) with timeout 10000ms
  - waiting for getByRole('button', { name: /^文档外观：/ })
    23 × locator resolved to <button aria-busy="false" aria-haspopup="menu" aria-expanded="false" aria-disabled="false" title="外观：MD3 Expressive · 浅色" aria-label="文档外观：MD3 Expressive · 浅色" class="rc-button-23b6d8dff9fb rc-button-54238a99f7f1 rc-button-a18299f45118 rc-button-e332475f25aa rc-button-fad1d1617c91 crab-docs-theme-trigger">…</button>
       - unexpected value "inactive"

```

```yaml
- button "文档外观：MD3 Expressive · 浅色"
```

# Test source

```ts
  1  | import { test, expect, configurations, environmentCases, applyEnvironment, captureVisual, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
  2  | import { sitePages, openSite, readySitePage, article, navigateFromSite, appearanceTrigger, openAppearance, assertDocumentWidth } from './site-visual-support.mjs';
  3  | 
  4  | const home=sitePages.find(page=>page.id==='home');
  5  | const catalog=sitePages.find(page=>page.id==='catalog');
  6  | const component=sitePages.find(page=>page.id==='component');
  7  | const viewports=environmentCases.filter(environment=>['narrow','tablet','desktop'].includes(environment.id));
  8  | for(const config of configurations) for(const environment of viewports) {
  9  |     test('Site navigation '+[config.designSystem,config.colorMode,environment.id].join(' '),{
  10 |         tag:['@website','@site-navigation',...(environment.id!=='desktop'?['@chromium-only']:[])],
  11 |         annotation:{type:'site',description:JSON.stringify({...config,viewport:environment.id,state:'navigation-search-keyboard'})},
  12 |     },async({page,previewOrigin,browserName},info)=>{
  13 |         await applyEnvironment(page,environment);
  14 |         await openSite(page,previewOrigin,home,config);
  15 |         const menu=await openAppearance(page,{keyboard:true});
  16 |         const options=menu.getByRole('menuitemradio');
  17 |         await page.keyboard.press('Home'); await expect(options.first()).toBeFocused();
  18 |         await page.keyboard.press('ArrowDown'); await expect(options.nth(1)).toBeFocused();
  19 |         await page.keyboard.press('End'); await expect(options.last()).toBeFocused();
  20 |         await page.keyboard.press('Escape');
> 21 |         await expect(menu).not.toBeVisible(); await expect(appearanceTrigger(page)).toBeFocused();
     |                                                                                     ^ Error: expect(locator).toBeFocused() failed
  22 | 
  23 |         if(environment.id!=='desktop') {
  24 |             const trigger=page.getByRole('button',{name:'导航',exact:true});
  25 |             await trigger.click();
  26 |             const drawer=page.getByRole('dialog',{name:'文档导航',exact:true});
  27 |             await expect(drawer).toBeVisible();
  28 |             await expect(trigger).toHaveAttribute('aria-expanded','true');
  29 |             await settleFiniteAnimations(page);
  30 |             await captureVisual(page,['mobile-navigation',config.designSystem,config.colorMode,environment.id].join('-')+'.png',info,browserName);
  31 |             await page.keyboard.press('Escape');
  32 |             await expect(drawer).not.toBeVisible(); await expect(trigger).toBeFocused();
  33 |         }
  34 |         await navigateFromSite(page,'组件','组件目录');
  35 |         await readySitePage(page,catalog,config);
  36 |         await article(page).getByRole('link',{name:'LineEdit 单行输入框',exact:true}).click();
  37 |         await readySitePage(page,component,config);
  38 |         await expect(page.getByRole('navigation',{name:'组件快捷入口',exact:true})).toBeVisible();
  39 | 
  40 |         await page.getByRole('button',{name:'搜索文档',exact:true}).click();
  41 |         const search=page.getByRole('dialog',{name:'搜索文档',exact:true});
  42 |         await expect(search).toBeVisible();
  43 |         const query=search.getByRole('combobox',{name:'搜索组件、属性或教程',exact:true});
  44 |         await expect(query).toBeFocused(); await query.fill('LineEdit');
  45 |         await expect(search.locator('.crab-docs-search')).toHaveAttribute('aria-busy','false');
  46 |         await expect.poll(()=>search.getByRole('option').count()).toBeGreaterThan(0);
  47 |         await expect(search.getByRole('option').first()).toHaveAccessibleName(/LineEdit/i);
  48 |         await query.press('ArrowDown');
  49 |         await expect(query).toHaveAttribute('aria-activedescendant',/.+/);
  50 |         await expect(search.getByRole('option',{selected:true})).toHaveCount(1);
  51 |         await settleFiniteAnimations(page);
  52 |         await captureVisual(page,['search-results',config.designSystem,config.colorMode,environment.id].join('-')+'.png',info,browserName);
  53 |         await query.press('Enter'); await expect(search).not.toBeVisible();
  54 |         await readySitePage(page,component,config);
  55 |         expect(await page.evaluate(()=>!!globalThis.document.activeElement?.closest('.crab-docs-content'))).toBe(true);
  56 |         await assertDocumentWidth(page,info);
  57 |     });
  58 | }
  59 | 
```