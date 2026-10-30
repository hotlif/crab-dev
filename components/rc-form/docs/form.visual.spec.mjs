import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states.filter(state => state !== 'validating')) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ['@rc-form', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-form', spec.demo, { ...config, size, density });
        const frame = page.getByRole('region', { name: 'Form visual matrix' });
        const selector = page.getByLabel('验收状态', { exact: true });
        await selector.selectOption(['disabled', 'read-only', 'error', 'warning', 'success'].includes(state) ? state : 'default');
        const field = frame.getByRole('textbox', { name: '项目名称', exact: true });
        if (state === 'hover') { const box = await field.locator('..').boundingBox(); await field.locator('..').hover({ position: { x: box.width / 2, y: box.height * .85 } }); }
        if (state === 'focus-visible') { await selector.focus(); await page.keyboard.press('Tab'); await expect(field).toBeFocused(); expect(await field.evaluate(node => node.matches(':focus-visible'))).toBe(true); }
        if (state === 'disabled') await expect(field).toBeDisabled();
        if (state === 'read-only') await expect(field).toHaveAttribute('readonly', '');
        if (['error', 'warning', 'success'].includes(state)) {
            await frame.getByRole('button', { name: '校验字段', exact: true }).click();
            await expect(field).not.toHaveAttribute('aria-busy', 'true');
            if (state === 'error') { await expect(field).toHaveAttribute('aria-invalid', 'true'); await expect(frame.getByText('此项目名称不可用。')).toBeVisible(); }
            else if (state === 'warning') await expect(frame.getByText('请确认团队共享项目名称。')).toBeVisible();
            else await expect(frame.getByRole('status')).toContainText('校验完成');
            if (state !== 'success') {
                const descriptionIds = (await field.getAttribute('aria-describedby') ?? '').trim().split(/\s+/).filter(Boolean);
                expect(descriptionIds.length).toBeGreaterThan(0);
                const descriptions = [];
                for (const id of descriptionIds) {
                    const description = page.locator(`[id="${id}"]`);
                    await expect(description).toHaveCount(1);
                    await expect(description).toBeVisible();
                    descriptions.push(await description.textContent());
                }
                expect(descriptions.join(' ')).toContain(state === 'error' ? '此项目名称不可用。' : '请确认团队共享项目名称。');
                await expect(frame.getByText('此名称会向工作区成员展示。', { exact: true })).toHaveCount(0);
                if (state === 'warning') await expect(field).not.toHaveAttribute('aria-invalid', 'true');
            }
        }
        await settleFiniteAnimations(page);
        await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${size}-${density}-${state}.png`, info, browserName);
        if (state === 'error') {
            await field.fill('Recovered project draft');
            await expect(field).not.toHaveAttribute('aria-invalid', 'true');
            await expect(frame.getByText('此项目名称不可用。', { exact: true })).toHaveCount(0);
            await expect(frame.getByText('此名称会向工作区成员展示。', { exact: true })).toBeVisible();
            await expect(field).toHaveValue('Recovered project draft');
        }
    });
}
