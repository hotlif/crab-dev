import { connectReviewBrowser } from "../../scripts/production-browser.mjs";
const browser = await connectReviewBrowser();
try {
    console.log(JSON.stringify(await browser.evaluate(`({
        main: document.querySelector('main')?.outerHTML.slice(0, 1800),
        scroll: Array.from(document.querySelectorAll('*')).filter(el => el.scrollHeight > el.clientHeight + 1 && getComputedStyle(el).overflowY !== 'visible').map(el => ({tag:el.tagName, cls:el.className, height:el.clientHeight, scroll:el.scrollHeight, width:el.clientWidth, scrollWidth:el.scrollWidth})).slice(0, 15),
        shadows: Array.from(document.querySelectorAll('*')).filter(el => el.shadowRoot).map(el => ({tag:el.tagName, cls:el.className, content:el.shadowRoot.innerHTML.slice(0, 300)})),
        headings: Array.from(document.querySelectorAll('h1,h2')).map(el => el.textContent),
        roots: ['html','body','main','.crab-docs','.crab-docs-content','article'].map(s => {const e=document.querySelector(s);return {s,html:e?.outerHTML.slice(0,180),scroll:e?.scrollHeight,height:e?.clientHeight,mainHeadings:e?.querySelectorAll('h1,h2').length}}),
    })`), null, 2));
} finally { browser.close(); }
