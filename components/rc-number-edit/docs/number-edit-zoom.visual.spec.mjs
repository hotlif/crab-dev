import {
    zoomTest as test,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
    settleFiniteAnimations,
    captureZoom,
} from "../../../test/visual/component-fixture.mjs";

// Headed native zoom shares a display; retain independent, sequential cases.
test.describe.configure({ mode: 'default' });
import { assertNumberEditGeometry } from "./visual-geometry.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations)
    test(
        `NumberEdit ${config.designSystem} ${config.colorMode} real 200% zoom`,
        {
            tag: ["@rc-number-edit", "@environment", "@chromium-only"],
            annotation: {
                type: "environment",
                description: JSON.stringify({ id: "zoom-200", ...config }),
            },
        },
        async ({ page, previewOrigin, realZoom }, info) => {
            await openDemo(
                page,
                previewOrigin,
                "rc-number-edit",
                spec.demo,
                config,
            );
            const frame = page.locator("[data-visual-frame]");
            const input = frame.getByRole("spinbutton", {
                name: "NumberEdit outlined",
                exact: true,
            });
            await input.fill("12.");
            const original = await input.elementHandle();
            await realZoom.set200(page);
            expect(await original.evaluate((node) => node.isConnected)).toBe(
                true,
            );
            await expect(input).toHaveValue("12.");
            await page.evaluate(() => {
                globalThis.numberEditingTrace = [];
                for (const type of ['focusin', 'focusout', 'beforeinput', 'input', 'change', 'select', 'keydown']) {
                    globalThis.document.addEventListener(type, event => {
                        const node = event.target;
                        if (node?.matches?.('input[role="spinbutton"]')) globalThis.numberEditingTrace.push({
                            type, name: node.getAttribute('aria-label'), value: node.value,
                            start: node.selectionStart, end: node.selectionEnd, data: event.data ?? null, key: event.key ?? null,
                        });
                    }, true);
                }
            });
            // The unfinished draft survives zoom. Actual keyboard stepping and blur
            // then follow the existing numeric commit protocol.
            for (const appearance of ["outlined", "filled"]) {
                const fieldInput = frame.getByRole("spinbutton", {
                    name: `NumberEdit ${appearance}`,
                    exact: true,
                });
                const field = fieldInput.locator("..").locator("..");
                if (appearance === "filled") {
                    // Enter the editor before replacing its formatted display,
                    // matching a user's focus -> select -> type sequence.
                    await fieldInput.focus();
                    await fieldInput.fill("12.");
                }
                await info.attach(`zoom-${appearance}-editing-before-step`, { body: JSON.stringify({
                    input: await fieldInput.evaluate(node => ({ value: node.value, start: node.selectionStart, end: node.selectionEnd, focused: node === node.ownerDocument.activeElement })),
                    events: await page.evaluate(() => globalThis.numberEditingTrace),
                }), contentType: 'application/json' });
                await expect(fieldInput).toHaveValue('12.');
                await fieldInput.press("ArrowUp");
                await expect(fieldInput).toHaveAttribute(
                    "aria-valuenow",
                    "12.5",
                );
                await page.keyboard.press("Tab");
                await expect(
                    field.getByRole("button", { name: "清除", exact: true }),
                ).toBeFocused();
                await page.keyboard.press("Tab");
                const increase = field.getByRole("button", {
                    name: "增加",
                    exact: true,
                });
                await expect(increase).toBeFocused();
                await page.keyboard.press("Enter");
                await expect(fieldInput).toHaveAttribute("aria-valuenow", "13");
                await settleFiniteAnimations(page);
                expect(
                    await page.evaluate(
                        () =>
                            globalThis.document.documentElement.scrollWidth <=
                            globalThis.document.documentElement.clientWidth + 1,
                    ),
                ).toBe(true);
                expect(
                    await frame.evaluate(
                        (node) => node.scrollWidth <= node.clientWidth + 1,
                    ),
                ).toBe(true);
                await field.scrollIntoViewIfNeeded();
                await expect(field).toBeInViewport({ ratio: 1 });
                await expect(fieldInput).toHaveAttribute("aria-valuenow", "13");
                await info.attach(`zoom-${appearance}-content`, {
                    body: JSON.stringify(
                        await assertNumberEditGeometry(fieldInput, frame),
                    ),
                    contentType: "application/json",
                });
                await info.attach(`zoom-${appearance}-geometry`, {
                    body: JSON.stringify({
                        field: await field.boundingBox(),
                        input: await fieldInput.boundingBox(),
                        scroll: await page.evaluate(() => ({
                            x: globalThis.scrollX,
                            y: globalThis.scrollY,
                        })),
                    }),
                    contentType: "application/json",
                });
                await captureZoom(
                    page,
                    realZoom,
                    `${config.designSystem}-${config.colorMode}-${appearance}-zoom-200.png`,
                    info,
                );
            }
        },
    );
