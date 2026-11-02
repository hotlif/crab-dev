import { Buffer } from 'node:buffer';
import { test, expect, configurations, openDemo, captureVisual } from '../../../test/visual/component-fixture.mjs';

for (const config of configurations) for (const forcedColors of [false, true]) test(`${config.designSystem} ${config.colorMode} ${forcedColors ? 'forced colors ' : ''}multiline draft geometry and retained selection`, {
    tag: ['@rc-canvas', '@boundary', '@inline-edit', ...(forcedColors ? ['@chromium-only'] : [])],
    annotation: { type: 'boundary', description: JSON.stringify({ ...config, id: forcedColors ? 'multiline-forced-colors' : 'multiline-draft' }) },
}, async ({ page, previewOrigin, browserName }, info) => {
    test.setTimeout(90_000);
    await openDemo(page, previewOrigin, 'rc-canvas', 'visual-matrix.demo.tsx', config);
    if (forcedColors) {
        await page.emulateMedia({ forcedColors: 'active' });
        expect(await page.evaluate(() => globalThis.matchMedia('(forced-colors: active)').matches)).toBe(true);
    }
    const scene = page.getByRole('region', { name: 'Canvas visual matrix', exact: true });
    const canvas = scene.locator('canvas');
    await expect.poll(async () => Number(await scene.getByRole('region', { name: '画布局部滚动区' }).getAttribute('data-render-count'))).toBeGreaterThan(0);
    const bounds = await canvas.boundingBox();
    await page.mouse.dblclick(bounds.x + 90, bounds.y + 40);
    const editor = scene.getByRole('textbox', { name: 'Canvas draft', exact: true });
    await expect(editor).toBeFocused();
    const draft = '跨主题的编辑草稿 Canvas draft\n第二行保留完整文字\nThird line stays readable';
    await editor.fill(draft);
    await expect.poll(() => editor.evaluate(node => node.scrollHeight <= node.clientHeight + 1 && node.scrollTop === 0)).toBe(true);
    await editor.press('ControlOrMeta+Home'); await editor.press('ArrowRight'); await editor.press('Shift+ArrowRight');
    const handle = await editor.elementHandle();
    const selection = await editor.evaluate(node => [node.selectionStart, node.selectionEnd]);
    expect(selection[1]).toBeGreaterThan(selection[0]);
    for (const next of [...configurations, config]) {
        await page.evaluate(value => globalThis.postMessage({ type: 'crab:preview-config', ...value }, location.origin), next);
        await expect(page.locator('.demo-default-preview').first()).toHaveAttribute('data-crab-design', next.designSystem);
        await expect(page.locator('.demo-default-preview').first()).toHaveAttribute('data-theme', next.colorMode);
        expect(await handle.evaluate(node => node.isConnected)).toBe(true);
        await expect(editor).toBeFocused(); await expect(editor).toHaveValue(draft);
        expect(await editor.evaluate(node => [node.selectionStart, node.selectionEnd])).toEqual(selection);
        expect(await editor.evaluate(node => node.scrollHeight <= node.clientHeight + 1)).toBe(true);
    }
    const drawing = await canvas.evaluate(node => {
        const gl = node.getContext('webgl2'), ratio = globalThis.devicePixelRatio;
        const pixel = new Uint8Array(4);
        gl.readPixels(Math.round(64 * ratio), node.height - Math.round(160 * ratio), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        const editor = node.parentElement.querySelector('textarea');
        return { pixel: Array.from(pixel), error: gl.getError(), bitmap: [node.width, node.height], editor: editor.getBoundingClientRect().toJSON(), canvas: node.getBoundingClientRect().toJSON(), editorHeight: editor.style.height, scroll: [node.parentElement.scrollLeft, node.parentElement.scrollTop], png: node.toDataURL('image/png') };
    });
    await info.attach('inline-drawing-geometry', { body: JSON.stringify({ ...drawing, png: undefined }), contentType: 'application/json' });
    await info.attach('inline-gpu-scene', { body: Buffer.from(drawing.png.split(',')[1], 'base64'), contentType: 'image/png' });
    expect(drawing.error).toBe(0); expect(drawing.pixel[3]).toBeGreaterThan(0);
    let composited, visibleDrawing;
    await expect.poll(async () => {
        composited = await canvas.screenshot({ animations: 'allow', caret: 'hide' });
        visibleDrawing = await canvas.evaluate(async (node, data) => {
            const image = await globalThis.createImageBitmap(await (await fetch('data:image/png;base64,' + data)).blob());
            const reference = node.ownerDocument.createElement('canvas');
            reference.width = image.width; reference.height = image.height;
            const context = reference.getContext('2d');
            context.drawImage(image, 0, 0); image.close();
            const visible = [...context.getImageData(64, 160, 1, 1).data];
            const background = [...context.getImageData(442, 128, 1, 1).data];
            const editor = node.parentElement.querySelector('textarea');
            context.fillStyle = editor.ownerDocument.defaultView.getComputedStyle(editor).color;
            context.fillRect(0, 0, 1, 1);
            const foreground = [...context.getImageData(0, 0, 1, 1).data];
            const luminance = rgb => rgb.slice(0, 3).map(channel => {
                const value = channel / 255; return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
            }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
            const a = luminance(foreground), b = luminance(background);
            const gl = node.getContext('webgl2'), gpu = new Uint8Array(4);
            gl.readPixels(64, node.height - 160, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, gpu);
            return { visible, gpu: [...gpu], error: gl.getError(), foreground, background, contrast: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) };
        }, composited.toString('base64'));
        return visibleDrawing.error === 0 && visibleDrawing.gpu[3] === 255 &&
            visibleDrawing.visible.every((channel, index) => Math.abs(channel - visibleDrawing.gpu[index]) <= 2);
    }, { message: 'The uncovered shape must remain visible in the browser compositor during native text editing' }).toBe(true).finally(async () => {
        if (composited) await info.attach('inline-composited-canvas', { body: composited, contentType: 'image/png' });
        if (visibleDrawing) await info.attach('inline-composited-pixels', { body: JSON.stringify(visibleDrawing), contentType: 'application/json' });
    });
    expect(visibleDrawing.contrast).toBeGreaterThanOrEqual(4.5);
    await captureVisual(scene, `${config.designSystem}-${config.colorMode}-${forcedColors ? 'forced-colors-' : ''}multiline-inline-draft.png`, info, browserName);
    await editor.fill(Array.from({ length: 20 }, (_, index) => `第 ${index + 1} 行 / long document`).join('\n'));
    const geometry = await editor.evaluate(node => ({
        client: node.clientHeight, scroll: node.scrollHeight,
        bottom: node.getBoundingClientRect().bottom,
    }));
    const canvasBounds = await canvas.boundingBox();
    geometry.canvasBottom = canvasBounds.y + canvasBounds.height;
    expect(geometry.scroll).toBeGreaterThan(geometry.client);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.canvasBottom + 1);
    await editor.press('ControlOrMeta+Home');
    await expect.poll(() => editor.evaluate(node => [node.selectionStart, node.selectionEnd])).toEqual([0, 0]);
    const firstLine = await editor.evaluate(node => {
        const style = node.ownerDocument.defaultView.getComputedStyle(node);
        const context = node.ownerDocument.createElement('canvas').getContext('2d');
        context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const metrics = context.measureText(node.value.split('\n')[0]);
        const ascent = metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent;
        const descent = metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent;
        const baseline = parseFloat(style.paddingTop) + (parseFloat(style.lineHeight) - ascent - descent) / 2 + ascent - node.scrollTop;
        return { scrollTop: node.scrollTop, height: node.clientHeight, glyphTop: baseline - metrics.actualBoundingBoxAscent, glyphBottom: baseline + metrics.actualBoundingBoxDescent };
    });
    // Native caret scrolling may retain a small padding offset; the actual
    // first-line ink must remain visible, rather than requiring scrollTop=0.
    expect(firstLine.glyphTop).toBeGreaterThanOrEqual(0); expect(firstLine.glyphBottom).toBeLessThanOrEqual(firstLine.height);
    await editor.press('ControlOrMeta+End'); await expect.poll(() => editor.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
    await editor.press('Escape'); await expect(editor).toHaveCount(0);
    await expect(scene.getByLabel('画布模型')).toContainText('双击编辑 Edit text');
    expect(await canvas.evaluate(node => node.ownerDocument.activeElement === node.parentElement)).toBe(true);
    await info.attach('native-editor-geometry', { body: JSON.stringify({ selection, capped: geometry, firstLine, configurations: configurations.length }), contentType: 'application/json' });
});
