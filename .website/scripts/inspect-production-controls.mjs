import { connectReviewBrowser } from "./production-browser.mjs";

// Read the rendered examples before choosing interaction checks; never infer selectors.
const route = process.argv[2] ?? "/components/rc-button";
if (!/^\/(?:components|design|learn)\/[a-z0-9-]+$/.test(route)) throw new Error("Expected a local documentation route");
const browser = await connectReviewBrowser();
try {
    await browser.call("Page.enable");
    await browser.call("Runtime.enable");
    await browser.call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false });
    await browser.call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "light" }] });
    await browser.call("Page.navigate", { url: `http://127.0.0.1:4173${route}` });
    let ready = false;
    for (let attempt = 0; attempt < 50; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        ready = await browser.evaluate(`location.pathname === ${JSON.stringify(route)} && document.readyState === 'complete' && Boolean(document.querySelector('.crab-docs-prose h1'))`);
        if (ready) break;
    }
    if (!ready) throw new Error(`Document unavailable: ${route}`);
    await new Promise(resolve => setTimeout(resolve, 1200));
    console.log(JSON.stringify(await browser.evaluate(`({
        title: document.title,
        frames: Array.from(document.querySelectorAll('iframe')).map(el => ({src:el.src,title:el.title})),
        controls: Array.from(document.querySelectorAll('main button,main input,main textarea,main [role="switch"],main select')).map((el,index) => {
            const r = el.getBoundingClientRect(); const c = getComputedStyle(el);
            return {index,tag:el.tagName,type:el.type,text:el.textContent.trim().slice(0,70),name:el.getAttribute('aria-label'),id:el.id,disabled:el.disabled,ariaDisabled:el.getAttribute('aria-disabled'),busy:el.getAttribute('aria-busy'),checked:el.checked,role:el.getAttribute('role'),width:r.width,height:r.height,outline:c.outline,html:el.outerHTML.slice(0,650)};
        }).slice(0,180),
        examples: Array.from(document.querySelectorAll('main [id]')).filter(el => el.id.includes('demo')).map(el => ({id:el.id,tag:el.tagName,class:el.className})).slice(0,30)
    })`), null, 2));
} finally { browser.close(); }
