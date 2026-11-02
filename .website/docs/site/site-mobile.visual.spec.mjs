import { test, expect, configurations, applyEnvironment, captureVisual, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sitePages, openSite, article, appearanceTrigger, openAppearance, assertDocumentWidth } from './site-visual-support.mjs';

// Touch drawers, search, composition and appearance retain one live document.
test.describe.configure({ timeout: 120_000 });
const component=sitePages.find(page=>page.id==='component');
const environments=[
    {id:'portrait',viewport:{width:320,height:768}},
    {id:'landscape',viewport:{width:640,height:320}},
    {id:'keyboard-height',viewport:{width:390,height:360}},
    {id:'forced-colors',viewport:{width:320,height:768},media:{forcedColors:'active'}},
    {id:'reduced-motion',viewport:{width:640,height:320},media:{reducedMotion:'reduce'}},
];

test.use({hasTouch:true});
for(const config of configurations) for(const environment of environments) {
    test('Mobile controls '+[config.designSystem,config.colorMode,environment.id].join(' '),{
        tag:['@website','@site-mobile','@chromium-only'],
        annotation:{type:'site',description:JSON.stringify({...config,viewport:environment.id,state:'touch-navigation-search-appearance'})},
    },async({page,previewOrigin},info)=>{
        await applyEnvironment(page,environment);
        await openSite(page,previewOrigin,component,config);
        const documentInstance=await article(page).elementHandle();
        const initialScroll=await page.evaluate(()=>globalThis.scrollY);
        const searchTrigger=page.getByRole('button',{name:'搜索文档',exact:true});
        const navigationTrigger=page.getByRole('button',{name:'导航',exact:true});
        for(const control of [searchTrigger,appearanceTrigger(page),navigationTrigger]) {
            const bounds=await control.boundingBox();
            expect(bounds.width).toBeGreaterThanOrEqual(44);
            expect(bounds.height).toBeGreaterThanOrEqual(44);
        }
        await assertDocumentWidth(page,info);

        await navigationTrigger.tap();
        const drawer=page.getByRole('dialog',{name:'文档导航',exact:true});
        const current=drawer.getByRole('link',{name:component.heading,exact:true});
        await expect(current).toBeFocused();
        await expect(current).toBeInViewport();
        await current.press('ArrowDown');
        await page.keyboard.press('ArrowUp');
        await expect(current).toBeFocused();
        expect(await current.evaluate(node=>node.matches(':focus-visible'))).toBe(true);
        await settleFiniteAnimations(page);
        await assertSelectedContrast(current,info,'current-navigation-contrast');
        await captureVisual(page,[config.designSystem,config.colorMode,environment.id,'navigation-current'].join('-')+'.png',info);
        expect(await page.evaluate(()=>globalThis.scrollY)).toBe(initialScroll);

        // Search can be requested while navigation owns focus, including on a
        // phone with a physical keyboard. Only the destination remains modal.
        await page.keyboard.press('Control+k');
        const search=page.getByRole('dialog',{name:'搜索文档',exact:true});
        const query=search.getByRole('combobox',{name:'搜索组件、属性或教程',exact:true});
        await expect(search).toBeVisible();
        await expect(drawer).not.toBeVisible();
        await expect(page.locator('dialog[open]')).toHaveCount(1);
        await expect(query).toBeFocused();
        await query.fill('LineEdit');
        await expect.poll(()=>search.getByRole('option').count()).toBeGreaterThan(1);
        await expect(search.locator('.crab-docs-search')).toHaveAttribute('aria-busy','false');
        const resultHeight=await search.locator('.crab-docs-search-scroll').evaluate(node=>node.clientHeight);
        expect(resultHeight).toBeGreaterThanOrEqual(80);
        // The result list owns scrolling; the surrounding panel must keep its
        // title, input and close action in place without another scrollbar.
        const panel=await search.locator('.crab-docs-search').evaluate(node=>({client:node.parentElement.clientHeight,scroll:node.parentElement.scrollHeight}));
        expect(panel.scroll).toBeLessThanOrEqual(panel.client+1);
        const geometry=await search.boundingBox();
        expect(geometry.y).toBeGreaterThanOrEqual(0);
        expect(geometry.y+geometry.height).toBeLessThanOrEqual(environment.viewport.height+1);
        const beforeComposition=page.url();
        await query.dispatchEvent('keydown',{key:'Enter',isComposing:true,keyCode:229,bubbles:true});
        await expect(search).toBeVisible();
        expect(page.url()).toBe(beforeComposition);
        await query.press('ArrowDown');
        const selected=search.getByRole('option',{selected:true});
        await expect(selected).toHaveCount(1);
        await expect(query).toHaveAttribute('aria-activedescendant',await selected.getAttribute('id'));
        await settleFiniteAnimations(page);
        await captureVisual(page,[config.designSystem,config.colorMode,environment.id,'search-results'].join('-')+'.png',info);
        await search.getByRole('button',{name:'关闭',exact:true}).tap();
        await expect(search).not.toBeVisible();
        await expect(searchTrigger).toBeFocused().catch(async error=>{
            await info.attach('search-close-focus',{body:JSON.stringify(await page.evaluate(()=>({active:globalThis.document.activeElement?.outerHTML,dialogs:[...globalThis.document.querySelectorAll('dialog[open]')].map(node=>node.outerHTML.slice(0,300))}))),contentType:'application/json'});
            throw error;
        });
        await expect(page.locator('dialog[open]')).toHaveCount(0);
        expect(await page.evaluate(()=>globalThis.scrollY)).toBe(initialScroll);

        const menu=await openAppearance(page,{keyboard:true});
        const labels=await menu.locator('.crab-docs-theme-option-label').evaluateAll(nodes=>nodes.map(node=>({text:node.textContent,client:node.clientWidth,scroll:node.scrollWidth})));
        expect(labels).toHaveLength(6);
        for(const label of labels) expect(label.scroll,label.text+' must stay readable').toBeLessThanOrEqual(label.client+1);
        for(const option of await menu.getByRole('menuitemradio').all()) expect((await option.boundingBox()).height).toBeGreaterThanOrEqual(44);
        await settleFiniteAnimations(page);
        await assertSelectedContrast(menu.locator('.crab-docs-theme-option[aria-checked="true"]'),info,'selected-theme-contrast');
        const popup=await page.locator('.crab-docs-theme-popup').boundingBox();
        expect(popup.x).toBeGreaterThanOrEqual(0);
        expect(popup.x+popup.width).toBeLessThanOrEqual(environment.viewport.width+1);
        expect(popup.y).toBeGreaterThanOrEqual(0);
        expect(popup.y+popup.height).toBeLessThanOrEqual(environment.viewport.height+1);
        await settleFiniteAnimations(page);
        await captureVisual(page,[config.designSystem,config.colorMode,environment.id,'appearance-menu'].join('-')+'.png',info);
        await page.keyboard.press('Tab');
        await expect(menu).not.toBeVisible();
        await expect(navigationTrigger).toBeFocused();
        const nextMenu=await openAppearance(page,{keyboard:true});
        await page.keyboard.press('Shift+Tab');
        await expect(nextMenu).not.toBeVisible();
        await expect(searchTrigger).toBeFocused();

        const systemMenu=await openAppearance(page);
        await systemMenu.getByRole('menuitemradio',{name:'跟随系统',exact:true}).click();
        const nextMode=config.colorMode==='light'?'dark':'light';
        await page.emulateMedia({colorScheme:nextMode});
        await expect(page.locator('.crab-docs').first()).toHaveAttribute('data-theme',nextMode);
        await expect(appearanceTrigger(page)).toHaveAccessibleName(/跟随系统$/);
        expect(await article(page).evaluate((node,previous)=>node===previous,documentInstance)).toBe(true);

        const interruptedMenu=await openAppearance(page);
        await page.keyboard.press('Control+k');
        await expect(search).toBeVisible();
        await expect(interruptedMenu).not.toBeVisible();
        await expect(query).toBeFocused();
        await query.press('Escape');
        await expect(search).not.toBeVisible();
        await expect(searchTrigger).toBeFocused();

        // A live resize releases the drawer's modality and focuses its desktop
        // counterpart while retaining the same document instance.
        await navigationTrigger.tap();
        await expect(drawer).toBeVisible();
        await page.setViewportSize({width:1440,height:900});
        await expect(drawer).not.toBeVisible();
        await expect(page.getByRole('navigation',{name:'主导航',exact:true}).getByRole('button',{name:'组件',exact:true})).toBeFocused();
        await expect(page.locator('dialog[open]')).toHaveCount(0);
        expect(await article(page).evaluate((node,previous)=>node===previous,documentInstance)).toBe(true);
        const rail=page.getByRole('navigation',{name:'主导航',exact:true});
        await rail.getByRole('button',{name:'设计',exact:true}).click();
        await expect(rail.getByRole('button',{name:'设计',exact:true})).toHaveAttribute('data-active','true');
        await expect(rail.getByRole('button',{name:'组件',exact:true})).toHaveAttribute('data-active','false');
        await expect(rail.getByRole('button',{name:'组件',exact:true})).toHaveAttribute('aria-current','true');
        await assertDocumentWidth(page,info);
    });
}

async function assertSelectedContrast(target,info,name) {
        const colors=await target.evaluateAll(nodes=>{
            const context=new globalThis.OffscreenCanvas(1,1).getContext('2d');
            const rgba=color=>{
                context.clearRect(0,0,1,1); context.fillStyle=color; context.fillRect(0,0,1,1);
                return [...context.getImageData(0,0,1,1).data].map(channel=>channel/255);
            };
            const over=(foreground,background)=>foreground.slice(0,3).map((channel,index)=>channel*foreground[3]+background[index]*(1-foreground[3])).concat(1);
            const luminance=color=>color.slice(0,3).map(channel=>channel<=0.04045?channel/12.92:((channel+0.055)/1.055)**2.4).reduce((sum,channel,index)=>sum+channel*[0.2126,0.7152,0.0722][index],0);
            return nodes.map(node=>{
                const ancestors=[];
                for(let element=node;element;element=element.parentElement) ancestors.unshift(element);
                const background=ancestors.reduce((paint,element)=>over(rgba(globalThis.getComputedStyle(element).backgroundColor),paint),[1,1,1,1]);
                const label=node.querySelector('.crab-docs-theme-option-label, .crab-docs-nav-name');
                const foreground=over(rgba(globalThis.getComputedStyle(label).color),background);
                const style=globalThis.getComputedStyle(node);
                const outline=over(rgba(style.outlineColor),background);
                const ratio=paint=>(Math.max(luminance(paint),luminance(background))+0.05)/(Math.min(luminance(paint),luminance(background))+0.05);
                return {label:label.textContent,foreground,background,ratio:ratio(foreground),focus:node.matches(':focus-visible'),outlineWidth:parseFloat(style.outlineWidth),outlineRatio:ratio(outline)};
            });
        });
        await info.attach(name,{body:JSON.stringify(colors),contentType:'application/json'});
        for(const color of colors) {
            expect(color.ratio,color.label+' must remain readable when focused').toBeGreaterThanOrEqual(4.5);
            if(color.focus) {
                expect(color.outlineWidth).toBeGreaterThan(0);
                expect(color.outlineRatio,color.label+' must retain a visible keyboard outline').toBeGreaterThanOrEqual(3);
            }
        }
}
