import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ['@rc-cron-picker', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, previewOrigin, browserName }, info) => {
        await page.clock.setFixedTime(new Date('2026-06-16T04:00:00Z'));
        await openDemo(page, previewOrigin, 'rc-cron-picker', spec.demo, { ...config, size, density });
        const frame = page.getByRole('region', { name: 'CronPicker visual matrix' });
        const selector = page.getByLabel('验收状态', { exact: true });
        const input = frame.getByRole('textbox', { name: '执行计划', exact: true });
        const readOnlyState = state === 'read-only' || state.startsWith('read-only-');
        const readOnlyExpression = { 'read-only-step': '*/5 9 * * 1-5', 'read-only-range': '0-30 9 * * 1-5' };
        if (readOnlyExpression[state]) { await input.fill(readOnlyExpression[state]); await input.press('Enter'); }
        if (readOnlyState) await selector.selectOption('read-only');
        else if (['disabled', 'warning'].includes(state)) await selector.selectOption(state);
        if (state === 'hover' || state === 'pressed') { const box = await input.locator('..').boundingBox(); await input.locator('..').hover({ position: { x: box.width / 2, y: box.height * .85 } }); }
        if (state === 'pressed') await page.mouse.down();
        if (state === 'focus-visible') { await selector.focus(); await page.keyboard.press('Tab'); await expect(input).toBeFocused(); expect(await input.evaluate(node => node.matches(':focus-visible'))).toBe(true); await expect(input).toHaveAttribute('aria-expanded', 'false'); }
        if (state === 'disabled') await expect(input).toBeDisabled();
        if (state === 'error') { await input.fill('invalid cron draft'); await expect(input).toHaveAttribute('aria-invalid', 'true'); await expect(frame.getByRole('status')).toHaveText('30 9 * * 1-5'); }
        if (state === 'committed') { await input.fill('0 10 * * *'); await input.press('Enter'); await expect(frame.getByRole('status')).toHaveText('0 10 * * *'); }
        const popupState = readOnlyState || state.startsWith('editor-') || ['expanded', 'minute-step', 'field-hour', 'field-day', 'field-month', 'field-week'].includes(state);
        if (popupState) {
            await input.click();
            const dialog = page.getByRole('dialog', { name: 'Cron 表达式编辑面板' }); await expect(dialog).toBeVisible();
            const boundary = dialog.locator('xpath=ancestor-or-self::*[@data-crab-design][1]');
            await expect(boundary).toHaveAttribute('data-crab-design', config.designSystem);
            const fields = { 'field-hour': '小时', 'field-day': '日期', 'field-month': '月份', 'field-week': '星期' };
            if (fields[state]) await dialog.getByRole('tab', { name: fields[state], exact: true }).click();
            if (state === 'minute-step') { await dialog.getByRole('combobox', { name: '分钟设置方式' }).click(); await page.getByRole('option', { name: '固定间隔', exact: true }).click(); await expect(frame.getByRole('status')).toHaveText('*/5 9 * * 1-5'); }
            if (state.startsWith('editor-')) {
                const [, field, mode] = state.split('-');
                const names = { minute: '分钟', hour: '小时', day: '日期', month: '月份', week: '星期' };
                const everyLabels = { minute: '每分钟', hour: '每小时', day: '每日', month: '每月', week: '不限星期' };
                const name = names[field];
                await dialog.getByRole('tab', { name, exact: true }).click();
                const label = mode === 'every' ? everyLabels[field] : mode === 'step' ? '固定间隔' : mode === 'range' ? '连续范围' : `指定${name}`;
                await dialog.getByRole('combobox', { name: `${name}设置方式`, exact: true }).click();
                await page.getByRole('option', { name: label, exact: true }).click();
                if (mode === 'every') await expect(dialog.getByText(`${name}不设限制，使用全部${name}。`, { exact: true })).toBeVisible();
                if (mode === 'step' || mode === 'range') {
                    const numbers = dialog.getByRole('spinbutton');
                    await expect(numbers).toHaveCount(2);
                    const number = mode === 'step' ? numbers.nth(1) : numbers.first();
                    const before = Number(await number.inputValue());
                    await number.press('ArrowUp');
                    await expect(number).toHaveValue(String(before + 1));
                }
                if (mode === 'list') {
                    const options = dialog.getByRole('checkbox');
                    const counts = { minute: 60, hour: 24, day: 31, month: 12, week: 7 };
                    await expect(options).toHaveCount(counts[field]);
                    const choice = options.nth(1);
                    await expect(choice).toHaveAttribute('aria-checked', 'false');
                    const before = await frame.getByRole('status').textContent();
                    await choice.press('Space');
                    await expect(choice).toHaveAttribute('aria-checked', 'true');
                    await expect(frame.getByRole('status')).not.toHaveText(before);
                }
            }
            if (state === 'field-week' || state === 'read-only-week-range') {
                if (state === 'read-only-week-range') await dialog.getByRole('tab', { name: '星期', exact: true }).click();
                await expect(dialog.getByRole('combobox')).toHaveCount(3);
                await expect(dialog.getByRole('combobox', { name: '开始星期', exact: true })).toBeVisible();
                await expect(dialog.getByRole('combobox', { name: '结束星期', exact: true })).toBeVisible();
            }
            if (readOnlyState) {
                await expect(input).toHaveAttribute('readonly', '');
                for (const select of await dialog.getByRole('combobox').all()) await expect(select).toHaveAttribute('aria-disabled', 'true');
                for (const number of await dialog.getByRole('spinbutton').all()) await expect(number).toBeDisabled();
                for (const option of await dialog.getByRole('checkbox').all()) await expect(option).toHaveAttribute('aria-disabled', 'true');
            }
            const box = await dialog.boundingBox(); expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(1281);
        }
        await settleFiniteAnimations(page);
        const target = popupState ? page : frame;
        await captureVisual(target, `${config.designSystem}-${config.colorMode}-${size}-${density}-${state}.png`, info, browserName);
        if (state === 'pressed') await page.mouse.up();
    });
}
