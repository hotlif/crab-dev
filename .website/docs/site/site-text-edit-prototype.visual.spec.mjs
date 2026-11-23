import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { chooseDesign, openSite } from './site-visual-support.mjs';

const definition = { path: '/design/text-edit', heading: 'TextEdit 多行输入框' };
const section = page => page.locator('#text-edit-note');
const editor = page => section(page).getByRole('textbox', { name: '交接备注' });
const receipt = page => section(page).locator('figure p');
const heightExamples = page => page.locator('#text-edit-height');

test('TextEdit is linked from the design overview and component documentation', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, { path: '/design', heading: '设计' }, { designSystem: 'md3', colorMode: 'light' });
    await page.getByRole('link', { name: '体验多行输入框原型' }).click();
    await expect(page.getByRole('heading', { name: definition.heading, level: 1 })).toBeVisible();
    await page.getByRole('link', { name: '查看 TextEdit 组件文档' }).click();
    await page.getByRole('link', { name: '查看设计原型' }).click();
    await expect(page).toHaveURL(/\/design\/text-edit\/?$/);
});

for (const designSystem of ['md3', 'macos', 'shadcn']) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`TextEdit saves and reviews handover notes in ${designSystem} ${colorMode}`, { tag: ['@website'] }, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 950 });
            await openSite(page, previewOrigin, definition, { designSystem, colorMode });
            const scope = section(page);
            const textarea = editor(page);
            const save = scope.getByRole('button', { name: '保存备注' });
            const status = scope.getByRole('status');
            const initial = await receipt(page).innerText();
            await scope.getByRole('button', { name: '载入空白' }).click();
            await expect(textarea).toHaveValue('');
            await expect(textarea).toHaveAttribute('placeholder', /滤网已清洁/);
            await expect(textarea).toBeFocused();
            if (designSystem === 'md3') {
                await settleFiniteAnimations(page);
                const label = scope.locator('label');
                const control = scope.locator('[data-control]');
                const labelBox = await label.boundingBox();
                const outline = await control.boundingBox();
                const input = await textarea.boundingBox();
                expect(labelBox.y).toBeLessThan(outline.y);
                expect(labelBox.y + labelBox.height).toBeLessThanOrEqual(input.y);
                await save.focus();
                await settleFiniteAnimations(page);
                expect(await label.boundingBox()).toEqual(labelBox);
                await expect(control).toHaveCSS('border-top-style', 'solid');
                await textarea.focus();
            }
            await save.click();
            await expect(textarea).toHaveAttribute('aria-invalid', 'true');
            await expect(textarea).toBeFocused();
            await expect(textarea).toHaveAccessibleDescription(/请输入交接备注.*0\/500/);
            await expect(scope.getByRole('alert')).toContainText('请输入交接备注');
            const invalidImage = info.outputPath(`text-edit-${designSystem}-${colorMode}-validation.png`);
            await scope.screenshot({ path: invalidImage, animations: 'disabled' });
            await info.attach('校验状态', { path: invalidImage, contentType: 'image/png' });

            await textarea.fill('检查滤网');
            await textarea.press('End');
            await textarea.press('Enter');
            await textarea.press('End');
            await page.keyboard.insertText('复测压差');
            await expect(textarea).toHaveValue('检查滤网\n复测压差');
            await expect(textarea).not.toHaveAttribute('aria-invalid', 'true');
            await expect(receipt(page)).toHaveText(initial);
            await textarea.press('Tab');
            await expect(scope.locator('button[aria-controls]')).toBeFocused();
            await page.keyboard.press('Enter');
            await expect(textarea).toBeFocused();
            await expect(textarea).toHaveValue('');

            await page.keyboard.insertText('巡'.repeat(501));
            await expect(textarea).toHaveValue('巡'.repeat(500));
            await expect(textarea).toHaveAccessibleDescription(/已达到输入上限.*500\/500/);
            await textarea.press('Backspace');
            await expect(textarea).toHaveAccessibleDescription(/记录已完成事项.*499\/500/);

            await scope.getByRole('button', { name: '模拟保存失败' }).click();
            const pending = await textarea.inputValue();
            await save.click();
            await expect(status).toContainText('保存失败');
            await expect(textarea).toHaveValue(pending);
            await expect(receipt(page)).toHaveText(initial);
            await save.click();
            await expect(status).toHaveText('备注已保存。');
            expect(await receipt(page).innerText()).toBe(pending);
            await scope.getByRole('button', { name: '载入空白' }).click();
            await scope.getByRole('button', { name: '恢复已保存版本' }).click();
            await expect(textarea).toHaveValue(pending);

            const examples = heightExamples(page);
            const fixed = examples.getByRole('textbox', { name: '固定四行' });
            const grow = examples.getByRole('textbox', { name: '随内容增长' });
            const archive = examples.getByRole('textbox', { name: '只读长记录' });
            const metrics = field => field.evaluate(node => ({
                height: node.clientHeight, scroll: node.scrollHeight, line: parseFloat(getComputedStyle(node).lineHeight),
            }));
            const fixedBefore = await metrics(fixed);
            const growBefore = await metrics(grow);
            await examples.getByRole('button', { name: '比较长文' }).click();
            await expect(fixed).toHaveValue(/北区运行交接记录/);
            await expect(grow).toHaveValue(await fixed.inputValue());
            const fixedAfter = await metrics(fixed);
            const growAfter = await metrics(grow);
            expect(fixedAfter.height).toBe(fixedBefore.height);
            expect(fixedAfter.scroll).toBeGreaterThan(fixedAfter.height);
            if (await grow.evaluate(() => CSS.supports('field-sizing', 'content'))) {
                expect(growAfter.height).toBeGreaterThan(growBefore.height);
                expect(growAfter.height).toBeLessThanOrEqual(growAfter.line * 8 + 1);
            } else {
                expect(growAfter.height).toBe(growBefore.height);
            }
            expect(growAfter.scroll).toBeGreaterThan(growAfter.height);

            await expect(archive).toHaveJSProperty('readOnly', true);
            await archive.scrollIntoViewIfNeeded();
            await archive.focus();
            await expect(archive).toBeFocused();
            const archiveValue = await archive.inputValue();
            await archive.press('PageDown');
            await expect.poll(() => archive.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
            await archive.click();
            await archive.press('ControlOrMeta+a');
            expect(await archive.evaluate(node => node.value.slice(node.selectionStart, node.selectionEnd))).toBe(archiveValue);
            await archive.press('Backspace');
            await expect(archive).toHaveValue(archiveValue);
            const disabled = page.getByRole('textbox', { name: '禁用的归档备注' });
            await expect(disabled).toBeDisabled();
            await archive.press('Tab');
            await expect(page.getByRole('link', { name: '查看 TextEdit 组件文档' })).toBeFocused();
            const compareImage = info.outputPath(`text-edit-${designSystem}-${colorMode}-heights.png`);
            await examples.screenshot({ path: compareImage, animations: 'disabled' });
            await info.attach('高度与滚动', { path: compareImage, contentType: 'image/png' });
            expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        });
    }
}

for (const designSystem of ['md3', 'macos', 'shadcn']) {
    test(`TextEdit can be resized by dragging and with keyboard buttons in ${designSystem}`, { tag: ['@website', '@chromium-only'] }, async ({ page, browserName, previewOrigin }, info) => {
        test.skip(browserName !== 'chromium');
        await page.setViewportSize({ width: 1440, height: 1000 });
        await openSite(page, previewOrigin, definition, { designSystem, colorMode: 'light' });
        const section = heightExamples(page);
        await section.getByRole('button', { name: '比较长文' }).click();
        const field = section.getByRole('textbox', { name: '手动调整高度' });
        const controls = section.getByRole('group', { name: '调整编辑区高度' });
        const expand = controls.getByRole('button', { name: '设为八行' });
        const reset = controls.getByRole('button', { name: '恢复四行' });
        const value = await field.inputValue();
        const line = await field.evaluate(node => parseFloat(getComputedStyle(node).lineHeight));
        const height = () => field.evaluate(node => node.clientHeight);
        const drag = async (deltaY) => {
            await field.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
            const box = await field.boundingBox();
            const x = box.x + box.width - 5;
            const y = box.y + box.height - 5;
            await page.mouse.move(x, y);
            await page.mouse.down();
            await page.mouse.move(x + 30, y + deltaY, { steps: 8 });
            await page.mouse.up();
        };
        await expect(field).toHaveCSS('resize', 'vertical');
        const initial = await field.boundingBox();
        await field.focus();
        await field.evaluate(node => node.setSelectionRange(0, 6));
        await drag(380);
        await expect.poll(height).toBe(line * 10);
        expect((await field.boundingBox()).width).toBe(initial.width);
        await expect(field).toHaveValue(value);
        await expect(field).toBeFocused();
        expect(await field.evaluate(node => [node.selectionStart, node.selectionEnd])).toEqual([0, 6]);
        const picture = info.outputPath(`text-edit-${designSystem}-resized.png`);
        await page.locator('.crab-text-edit-resize').screenshot({ path: picture, animations: 'disabled' });
        await info.attach('手动拖拽后', { path: picture, contentType: 'image/png' });

        await drag(-370);
        await expect.poll(height).toBe(line * 3);
        expect((await field.boundingBox()).width).toBe(initial.width);
        await expect(field).toHaveValue(value);
        await page.setViewportSize({ width: 320, height: 850 });
        await expand.press('Enter');
        await expect.poll(height).toBe(line * 8);
        await expect(expand).toBeFocused();
        await reset.press('Space');
        await expect.poll(height).toBe(line * 4);
        await expect(reset).toBeFocused();
        await expect(field).toHaveValue(value);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    });
}

test('TextEdit preserves the draft through theme changes and exposes keyboard focus in forced colors', { tag: ['@website', '@chromium-only'] }, async ({ page, browserName, previewOrigin }) => {
    test.skip(browserName !== 'chromium');
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
    const textarea = editor(page);
    await textarea.fill('交接事项\n准备复测。');
    for (const design of ['macos', 'shadcn', 'md3']) {
        await chooseDesign(page, design);
        await expect(textarea).toHaveValue('交接事项\n准备复测。');
        await page.getByRole('navigation', { name: '原型章节' }).getByRole('link', { name: '交互规则' }).focus();
        await page.keyboard.press('Tab');
        await expect(textarea).toBeFocused();
        const control = section(page).locator('[data-control]');
        await expect(control).toHaveCSS('outline-style', 'solid');
        await expect(control).toHaveCSS('transition-duration', '0s');
    }
});

test('TextEdit composes Chinese text and keeps Enter as a newline', { tag: ['@website', '@chromium-only'] }, async ({ page, context, browserName, previewOrigin }) => {
    test.skip(browserName !== 'chromium');
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
    const textarea = editor(page);
    const initial = await receipt(page).innerText();
    await section(page).getByRole('button', { name: '载入空白' }).click();
    const ime = await context.newCDPSession(page);
    try {
        await ime.send('Input.imeSetComposition', { text: 'beiqu', selectionStart: 5, selectionEnd: 5 });
        await ime.send('Input.imeSetComposition', { text: '北区', selectionStart: 2, selectionEnd: 2 });
        await ime.send('Input.insertText', { text: '北区' });
        await expect(textarea).toHaveValue('北区');
        await textarea.press('Enter');
        await page.keyboard.insertText('复测');
        await expect(textarea).toHaveValue('北区\n复测');
        expect(await receipt(page).innerText()).toBe(initial);
    } finally {
        await ime.detach();
    }
});
