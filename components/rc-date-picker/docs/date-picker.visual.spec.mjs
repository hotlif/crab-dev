import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ['@rc-date-picker', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, previewOrigin, browserName }, info) => {
        await page.setViewportSize({ width: 1280, height: 1000 });
        await page.clock.setFixedTime(new Date('2026-06-16T04:00:00Z'));
        await openDemo(page, previewOrigin, 'rc-date-picker', spec.demo, { ...config, size, density });
        await info.attach('temporal-runtime', { body: JSON.stringify(await page.evaluate(() => ({ nativeTemporalAvailable: typeof globalThis.Temporal !== 'undefined' }))), contentType: 'application/json' });
        const frame = page.getByRole('region', { name: 'DatePicker visual matrix' });
        const selector = page.getByLabel('验收状态', { exact: true });
        if (['disabled', 'error', 'warning'].includes(state)) await selector.selectOption(state);
        const date = frame.getByRole('textbox', { name: '计划日期', exact: true });
        const timePresets = {
            'time-12-dial-hour': '12-dial', 'time-12-dial-minute': '12-dial',
            'time-24-dial-minute': '24-dial', 'time-12-input': '12-input',
            'time-24-input': '24-input', 'time-24-seconds': '24-seconds',
            'datetime-12-open': '12-seconds', 'datetime-no-seconds': '24-input',
            'datetime-12-no-seconds': '12-input',
        };
        if (timePresets[state]) await page.getByLabel('时间配置', { exact: true }).selectOption(timePresets[state]);
        if (state === 'hover' || state === 'cleared') { const box = await date.locator('..').boundingBox(); await date.locator('..').hover({ position: { x: box.width / 2, y: box.height * .85 } }); }
        if (state === 'focus-visible') {
            await selector.focus();
            await page.keyboard.press('Tab');
            await expect(date).toBeFocused();
            expect(await date.evaluate(node => node.matches(':focus-visible'))).toBe(true);
            await expect(date).toHaveAttribute('aria-expanded', 'true');
            await expect(page.getByRole('dialog')).toBeVisible();
        }
        if (state === 'disabled') for (const input of await frame.getByRole('textbox').all()) await expect(input).toBeDisabled();
        if (state === 'error') for (const input of await frame.getByRole('textbox').all()) await expect(input).toHaveAttribute('aria-invalid', 'true');
        if (state === 'cleared') { await frame.locator('[data-role="picker-clear"]').first().click(); await expect(date).toHaveValue(''); await expect(frame.getByRole('status')).toContainText('未选择日期'); }
        const popupState = state.startsWith('date-') || state.startsWith('datetime-') || state.startsWith('time-');
        if (popupState) {
            const secondsState = ['time-input-open', 'time-error', 'time-minute-error', 'time-second-error', 'time-empty-error', 'time-period-pm', 'time-keyboard-steps'].includes(state);
            const name = state.startsWith('datetime-') ? '计划日期时间' : secondsState ? '秒精度时间' : state.startsWith('time-') ? '表盘时间' : '计划日期';
            const field = frame.getByRole('textbox', { name, exact: true });
            const committed = await field.inputValue();
            await field.click();
            const dialog = page.getByRole('dialog'); await expect(dialog).toBeVisible();
            await expect(dialog).toHaveAttribute('data-crab-design', config.designSystem);
            await expect(dialog).toHaveAttribute('data-theme', config.colorMode);
            if (state === 'date-open' || state === 'date-selected' || state === 'date-today') {
                await expect(dialog.getByRole('button', { name: '2026-06-15', exact: true })).toHaveAttribute('aria-pressed', 'true');
                await expect(dialog.getByRole('button', { name: '2026-06-01', exact: true })).toBeDisabled();
                const today = dialog.getByRole('button', { name: '2026-06-16', exact: true });
                await expect(today).toHaveAttribute('aria-current', 'date');
                await expect(today).toHaveAttribute('aria-pressed', 'false');
                if (state === 'date-selected') { await dialog.getByRole('button', { name: '2026-06-18', exact: true }).click(); await expect(dialog.getByRole('button', { name: '2026-06-18', exact: true })).toHaveAttribute('aria-pressed', 'true'); await expect(date).toHaveValue('2026-06-15'); }
                if (state === 'date-today') { await today.click(); await expect(today).toHaveAttribute('aria-pressed', 'true'); await expect(today).toHaveAttribute('aria-current', 'date'); }
            }
            if (state.includes('-dial-') || state === 'time-dial-open') {
                await expect(dialog.getByRole('group', { name: '小时表盘', exact: true })).toBeVisible();
                if (state.endsWith('-minute')) {
                    await dialog.getByRole('button', { name: '9 小时', exact: true }).press('Enter');
                    await expect(dialog.getByRole('group', { name: '分钟表盘', exact: true })).toBeVisible();
                    await expect(dialog.locator('[data-time-part="minute"] button')).toBeFocused();
                }
            }
            if (state === 'time-dial-keyboard') {
                await dialog.getByRole('button', { name: '9 小时', exact: true }).press('ArrowRight');
                const hour = dialog.getByRole('button', { name: '10 小时', exact: true });
                await expect(hour).toBeFocused();
                await expect(hour).toHaveAttribute('aria-pressed', 'true');
                await hour.press('Enter');
                await dialog.getByRole('button', { name: '30 分钟', exact: true }).press('ArrowRight');
                const minute = dialog.getByRole('button', { name: '35 分钟', exact: true });
                await expect(minute).toBeFocused();
                await expect(minute).toHaveAttribute('aria-pressed', 'true');
            }
            if (state === 'time-mode-switch') {
                await dialog.getByRole('button', { name: '切换到键盘输入', exact: true }).press('Enter');
                await expect(dialog.locator('[data-mode]')).toHaveAttribute('data-mode', 'input');
                await expect(dialog.getByRole('textbox', { name: '小时', exact: true })).toBeFocused();
            }
            if (['time-12-input', 'time-24-input', 'time-24-seconds', 'datetime-12-open', 'datetime-no-seconds', 'datetime-12-no-seconds'].includes(state)) {
                await expect(dialog.locator('[data-mode]')).toHaveAttribute('data-mode', 'input');
                await expect(dialog.getByRole('textbox', { name: '秒', exact: true })).toHaveCount(state.endsWith('-input') || state.endsWith('-no-seconds') ? 0 : 1);
            }
            if (['time-error', 'time-minute-error', 'time-second-error', 'time-empty-error', 'datetime-time-error'].includes(state)) {
                const part = state === 'time-minute-error' || state === 'datetime-time-error' ? '分钟' : state === 'time-second-error' ? '秒' : '小时';
                const input = dialog.getByRole('textbox', { name: part, exact: true });
                await input.fill(state === 'time-empty-error' ? '' : '99');
                await expect(input).toHaveAttribute('aria-invalid', 'true');
                const errorId = await input.getAttribute('aria-describedby');
                expect(errorId).toBeTruthy();
                await expect(dialog.locator(`[id="${errorId}"]`)).toBeVisible();
                await expect(dialog.getByRole('button', { name: '确定', exact: true })).toBeDisabled();
            }
            if (state === 'time-period-pm') {
                await dialog.getByRole('radio', { name: '上午', exact: true }).press('ArrowRight');
                await expect(dialog.getByRole('radio', { name: '下午', exact: true })).toHaveAttribute('aria-checked', 'true');
                await expect(dialog.getByRole('radio', { name: '下午', exact: true })).toBeFocused();
            }
            if (state === 'time-keyboard-steps') {
                const hour = dialog.getByRole('textbox', { name: '小时', exact: true });
                const minute = dialog.getByRole('textbox', { name: '分钟', exact: true });
                await hour.press('ArrowUp');
                await minute.press('ArrowDown');
                await expect(hour).toHaveValue('10');
                await expect(minute).toHaveValue('29');
            }
            if (state.startsWith('time-') || state.startsWith('datetime-')) await expect(field).toHaveValue(committed);
        }
        await settleFiniteAnimations(page);
        // Focusing the field also opens its Portal. Capture the actual visible
        // branch without replacing the genuine keyboard focus with a click.
        const dialog = page.getByRole('dialog');
        const visiblePopup = await dialog.isVisible();
        if (visiblePopup) {
            await expect(dialog).toHaveAttribute('data-crab-design', config.designSystem);
            await expect(dialog).toHaveAttribute('data-theme', config.colorMode);
            const box = await dialog.boundingBox();
            const viewport = page.viewportSize();
            expect(box.x).toBeGreaterThanOrEqual(0);
            expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
            expect(box.y).toBeGreaterThanOrEqual(0);
            expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
        }
        const target = visiblePopup ? page : frame;
        await captureVisual(target, `${config.designSystem}-${config.colorMode}-${size}-${density}-${state}.png`, info, browserName);
        if (state === 'time-keyboard-steps') {
            await dialog.getByRole('textbox', { name: '分钟', exact: true }).press('Enter');
            await expect(dialog).toHaveCount(0);
            await expect(frame.getByRole('textbox', { name: '秒精度时间', exact: true })).toHaveValue('10:29:15 上午');
        }
        if (state === 'time-dial-keyboard') {
            await dialog.getByRole('button', { name: '确定', exact: true }).press('Enter');
            await expect(dialog).toHaveCount(0);
            await expect(frame.getByRole('textbox', { name: '表盘时间', exact: true })).toHaveValue('10:35');
        }
    });
}
