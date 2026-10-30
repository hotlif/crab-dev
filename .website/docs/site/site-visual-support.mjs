// Test support only. Production UI never imports this module.
import { designSystemRegistry } from '@crab-dev/rc-token-semantic';
import { expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';

export const sitePages = [
    {id:'home',path:'/',heading:'Crab UI'},
    {id:'catalog',path:'/learn/components',heading:'组件目录'},
    {id:'design',path:'/guides/design-styles',heading:'三套设计体系'},
    {id:'component',path:'/components/rc-line-edit',heading:'LineEdit 单行输入框'},
    {id:'tutorial',path:'/learn/practice-profile',heading:'实战：资料编辑表单'},
];
export const designIds = Object.keys(designSystemRegistry);
const modeNames = {light:'浅色',dark:'深色'};

export const siteRoot = page => page.locator('.crab-docs').first();
export const article = page => page.locator('.crab-docs-page').first();
export const appearanceTrigger = page => page.getByRole('button',{name:/^文档外观：/});

export async function assertSiteConfiguration(page,config) {
    await expect(siteRoot(page)).toHaveAttribute('data-crab-design',config.designSystem);
    await expect(siteRoot(page)).toHaveAttribute('data-theme',config.colorMode);
    await expect(page.locator('html')).toHaveAttribute('data-crab-design',config.designSystem);
    await expect(appearanceTrigger(page)).toHaveAccessibleName('文档外观：'+designSystemRegistry[config.designSystem].label+' · '+modeNames[config.colorMode]);
}

export async function readySitePage(page,definition,config) {
    // A cold production route loads its Page module after the shell. Wait for
    // the actual document before checking its exact content and configuration.
    await expect(article(page)).toBeVisible({timeout:30_000});
    await expect(article(page).getByRole('heading',{level:1}).first()).toHaveText(definition.heading);
    await assertSiteConfiguration(page,config);
    await page.evaluate(() => globalThis.document.fonts.ready);
    if(definition.id==='component') {
        await expect(page.locator('[data-component-hero="rc-line-edit"] iframe')).toHaveAttribute('aria-busy','false',{timeout:20_000});
    }
    if(definition.id==='tutorial') {
        await expect(page.locator('[data-tutorial="practice-profile"]').getByRole('textbox',{name:'姓名',exact:true})).toBeVisible();
    }
    await settleFiniteAnimations(page);
}

export async function openSite(page,origin,definition,config) {
    await page.emulateMedia({colorScheme:config.colorMode});
    // This models an existing preference before the real Root mounts. Subsequent
    // real UI choices must survive reload, so initialization never overwrites them.
    await page.addInitScript(initial => {
        if(globalThis.location.hostname!=='127.0.0.1') return;
        if(globalThis.localStorage.getItem('crab-docs-design')===null) globalThis.localStorage.setItem('crab-docs-design',initial.designSystem);
        if(globalThis.localStorage.getItem('wake-docs-theme')===null) globalThis.localStorage.setItem('wake-docs-theme',initial.colorMode);
    },config);
    const response=await page.goto(origin+definition.path);
    expect(response.status()).toBe(200);
    await readySitePage(page,definition,config);
}

export async function openAppearance(page,{keyboard=false}={}) {
    const trigger=appearanceTrigger(page);
    await trigger.scrollIntoViewIfNeeded();
    if(keyboard) { await trigger.focus(); await trigger.press('ArrowDown'); }
    else await trigger.click();
    const menu=page.getByRole('menu',{name:'文档外观',exact:true});
    await expect(menu).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded','true');
    return menu;
}

export async function chooseDesign(page,designSystem) {
    const menu=await openAppearance(page);
    await menu.getByRole('group',{name:'设计体系',exact:true}).getByRole('menuitemradio',{name:designSystemRegistry[designSystem].label,exact:true}).click();
    await expect(siteRoot(page)).toHaveAttribute('data-crab-design',designSystem);
    await expect(menu).not.toBeVisible();
    await expect(appearanceTrigger(page)).toBeFocused();
    expect(await page.evaluate(() => globalThis.localStorage.getItem('crab-docs-design'))).toBe(designSystem);
}

export async function chooseMode(page,colorMode) {
    const menu=await openAppearance(page);
    await menu.getByRole('group',{name:'明暗模式',exact:true}).getByRole('menuitemradio',{name:modeNames[colorMode],exact:true}).click();
    await expect(siteRoot(page)).toHaveAttribute('data-theme',colorMode);
    await expect(menu).not.toBeVisible();
    await expect(appearanceTrigger(page)).toBeFocused();
    expect(await page.evaluate(() => globalThis.localStorage.getItem('wake-docs-theme'))).toBe(colorMode);
}

export async function navigateFromSite(page,category,title) {
    const mobile=page.getByRole('button',{name:'导航',exact:true});
    if(await mobile.isVisible()) {
        await mobile.click();
        const dialog=page.getByRole('dialog',{name:'文档导航',exact:true});
        await expect(dialog).toBeVisible();
        const toggle=dialog.getByRole('button',{name:category,exact:true});
        if(await toggle.getAttribute('aria-expanded')!=='true') await toggle.click();
        await dialog.getByRole('link',{name:title,exact:true}).click();
        await expect(dialog).not.toBeVisible();
    } else {
        await page.getByRole('navigation',{name:'主导航',exact:true}).getByRole('button',{name:category,exact:true}).click();
        await page.locator('.crab-docs-sidebar').getByRole('link',{name:title,exact:true}).click();
    }
}

export async function assertDocumentWidth(page,info) {
    const geometry=await page.evaluate(() => ({
        client:globalThis.document.documentElement.clientWidth,
        scroll:globalThis.document.documentElement.scrollWidth,
        viewport:globalThis.innerWidth,
        active:globalThis.document.activeElement?.outerHTML.slice(0,500),
    }));
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.client+1);
    await info.attach('site-geometry',{body:JSON.stringify(geometry),contentType:'application/json'});
}

export async function recordNaturalSite(page,target,info,name,{realZoom}={}) {
    // The guide contains genuine loading controls. Preserve them and capture
    // visible viewport samples/video; do not pretend these are static goldens.
    const samples=[];
    for(let sample=0;sample<3;sample++) {
        if(sample) await page.waitForTimeout(180);
        const timings=await target.evaluate(node => node.getAnimations({subtree:true})
            .filter(animation => animation.effect?.getComputedTiming().iterations===Infinity)
            .map(animation => ({name:animation.animationName,time:animation.currentTime,state:animation.playState})));
        samples.push(timings);
        await info.attach(name+'-'+sample,{body:realZoom ? await realZoom.capture200(page) : await page.screenshot({animations:'allow',caret:'hide'}),contentType:'image/png'});
    }
    const running=samples[0].filter(animation => animation.state==='running');
    if(running.length) {
        expect(samples[2].some(animation => animation.name===running[0].name && animation.time>running[0].time)).toBe(true);
    }
    await info.attach(name+'-time-series',{body:JSON.stringify({scope:'visible viewport only; native video retained; no static golden for ongoing controls',samples}),contentType:'application/json'});
}
