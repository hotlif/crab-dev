import { test, expect } from './component-fixture.mjs';
import { measureTextContrast } from './text-contrast.mjs';

test('text contrast measures opacity, field values and visible labels', { tag: ['@text-contrast-contract'] }, async ({ page }) => {
    await page.setContent(`
        <style>input::placeholder { color: transparent; opacity: 1; } input.low::placeholder { color: rgba(0, 0, 0, .1); }</style>
        <main style="background: white; color: black">
            <p>Opaque text</p>
            <div style="opacity: .5">Half opacity</div>
            <div style="opacity: .5"><span style="opacity: .5">Quarter opacity</span></div>
            <h1 style="font-size: 24px">Large text</h1>
            <input value="Readable field value" style="color: black; background: white">
            <label for="labelled">Visible field label</label>
            <input id="labelled" placeholder="Suppressed duplicate prompt">
            <input class="low" placeholder="Low-contrast prompt">
            <span style="color: transparent">Suppressed span prompt</span>
            <span style="color: rgba(0, 0, 0, .1)">Low-contrast span</span>
            <button disabled>Inactive control</button>
            <div aria-hidden="true">Hidden text</div>
            <p style="background-image: linear-gradient(white, black)">Complex paint</p>
        </main>
    `);
    const report = await page.locator('main').evaluate(measureTextContrast);
    const sample = text => report.samples.find(entry => entry.examples.includes(text));
    expect(sample('Opaque text').ratio).toBeCloseTo(21, 3);
    expect(sample('Half opacity').ratio).toBeCloseTo(3.97665, 3);
    expect(sample('Quarter opacity').ratio).toBeGreaterThan(1.8);
    expect(sample('Quarter opacity').ratio).toBeLessThan(1.9);
    expect(sample('Large text').required).toBe(3);
    expect(sample('Readable field value').ratio).toBeCloseTo(21, 3);
    expect(report.exclusions.map(entry => entry.reason)).toEqual(expect.arrayContaining([
        'inactive control', 'transparent placeholder is not painted', 'transparent text is not painted', 'image, filter or blend needs pixel review',
    ]));
    expect(report.samples.some(entry => entry.examples.includes('Hidden text'))).toBe(false);
    expect(report.samples.some(entry => entry.examples.includes('Suppressed span prompt'))).toBe(false);
    expect(report.failures.some(entry => entry.examples.includes('Low-contrast prompt'))).toBe(true);
    expect(report.failures.some(entry => entry.examples.includes('Low-contrast span'))).toBe(true);
});
