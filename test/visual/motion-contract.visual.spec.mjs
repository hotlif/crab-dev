import fs from 'node:fs/promises';
import path from 'node:path';
import { loadLibraryManifest } from '../../scripts/library-manifest.mjs';
import { test, expect, configurations, openDemo } from './component-fixture.mjs';

async function motionSource(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (entry.name !== '__tests__' && await motionSource(path.join(directory, entry.name))) return true;
        } else if (/\.tsx?$/.test(entry.name) && entry.name !== 'token.ts') {
            const source = await fs.readFile(path.join(directory, entry.name), 'utf8');
            if (/transition\s*:|animation\s*:|\.animate\(|useAnimatedRows|useBarTransition|flowSpeed/.test(source)) return true;
        }
    }
    return false;
}

const manifest = await loadLibraryManifest();
for (const product of manifest.packages) {
    if (process.env.CRAB_VISUAL_PACKAGE && product.slug !== process.env.CRAB_VISUAL_PACKAGE) continue;
    let spec;
    try { spec = JSON.parse(await fs.readFile(path.join(product.directory, 'docs/visual.json'), 'utf8')); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    if (!await motionSource(path.join(product.directory, 'src'))) continue;
    for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) {
        const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density);
        test(`${product.slug} ${config.designSystem} ${config.colorMode} ${size} ${density} live motion preference`, {
            tag: ['@motion-contract', `@${product.slug}`, ...(!crossEngine ? ['@chromium-only'] : [])],
        }, async ({ page, previewOrigin }, info) => {
            // Product sizes such as Button's xs/s/m/l/xl and Prose's sm/base/lg/xl
            // belong to the component, while the Provider only accepts three
            // common sizes. Drive each demo's public size control separately.
            const commonSize = ['small', 'medium', 'large'].includes(size) ? size : 'medium';
            const root = await openDemo(page, previewOrigin, product.slug, spec.demo, { ...config, size: commonSize, density });
            const sizeControl = root.getByRole('combobox', { name: /^(验收尺寸|文章尺寸)$/ });
            if (await sizeControl.count()) await sizeControl.selectOption(size);
            else expect(['small', 'medium', 'large'].includes(size), 'Dedicated sizes require an actual demo control').toBe(true);
            const densityControl = root.getByRole('combobox', { name: '验收密度', exact: true });
            if (await densityControl.count()) await densityControl.selectOption(density);
            const sizedScene = root.locator('[data-visual-scene][data-size]').first();
            if (await sizedScene.count()) await expect(sizedScene).toHaveAttribute('data-size', size);
            const scene = await root.elementHandle();
            const frame = root.locator('[data-visual-frame]').first();
            const scope = await frame.count() ? frame : root;
            const control = scope.locator('button:not(:disabled):visible,input:not(:disabled):visible,textarea:not(:disabled):visible,select:not(:disabled):visible,a[href]:visible,[tabindex="0"]:visible').first();
            if (await control.count()) {
                // Native selection inputs use their label; floating labels and
                // input text share a field's visible hit area. Hover that real
                // area rather than asking the driver to pierce a sibling label.
                const target = await control.evaluateHandle(node => node.closest('label, [data-field-root]') ?? node);
                await target.asElement().hover();
                await control.focus();
                await target.dispose();
            }
            const focus = await page.evaluateHandle(() => globalThis.document.activeElement);
            await page.emulateMedia({ reducedMotion: 'reduce' });
            // Finite CSS resets may take a frame; persistent decorative motion is a failure.
            await expect.poll(() => root.evaluate(node => node.getAnimations({ subtree: true })
                .filter(animation => animation.playState === 'running' && !String(animation.animationName ?? '').includes('breathe'))
                .map(animation => animation.animationName ?? animation.transitionProperty ?? 'web-animation')),
            { message: 'Reduced motion stops decorative animation and transitions' }).toEqual([]);
            expect(await root.evaluate((node, original) => node === original, scene)).toBe(true);
            expect(await page.evaluate(original => globalThis.document.activeElement === original, focus)).toBe(true);
            await info.attach('reduced-motion-actual', { body: await root.screenshot({ animations: 'allow', caret: 'hide' }), contentType: 'image/png' });
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            expect(await page.evaluate(original => globalThis.document.activeElement === original, focus)).toBe(true);
            await focus.dispose();
            await scene.dispose();
        });
    }
}
