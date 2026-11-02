import {
    test,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
    settleFiniteAnimations,
    captureVisual,
    environmentCases,
    applyEnvironment,
} from "../../../test/visual/component-fixture.mjs";
import { assertNumberEditGeometry } from "./visual-geometry.mjs";

const spec = await readVisualSpec(import.meta.url);
const scenarios = environmentCases;
for (const config of configurations)
    for (const scenario of scenarios) {
        test.describe(`number-edit ${config.designSystem} ${config.colorMode} ${scenario.id}`, () => {
            test.use({ hasTouch: scenario.hasTouch ?? false });
            test(
                "environment and real input",
                {
                    tag: ["@rc-number-edit", "@environment", "@chromium-only"],
                    annotation: {
                        type: "environment",
                        description: JSON.stringify({
                            id: scenario.id,
                            ...config,
                        }),
                    },
                },
                async ({ page, browserName, previewOrigin }, info) => {
                    await openDemo(
                        page,
                        previewOrigin,
                        "rc-number-edit",
                        spec.demo,
                        { ...config, ...scenario.config },
                    );
                    await applyEnvironment(page, scenario);
                    const frame = page.locator("[data-visual-frame]");
                    for (const appearance of ["outlined", "filled"]) {
                        const control = frame.getByRole("spinbutton", {
                            name: `NumberEdit ${appearance}`,
                            exact: true,
                        });
                        const field = control.locator("..").locator("..");
                        if (scenario.config?.locale === "en-US") {
                            await expect(field.locator('[data-field-label-text]')).toContainText("Alert threshold");
                            await expect(field.locator('[data-field-support]')).toContainText("arrow keys step by 0.5");
                        }
                        if (scenario.hasTouch) {
                            // The visible label can overlap an empty M3 input.
                            // Tapping its real associated label must focus the field.
                            await field.locator(':scope > label').tap();
                            await expect(control).toBeFocused();
                        }
                        await control.fill("12.");
                        await expect(control).toHaveValue("12.");
                        await settleFiniteAnimations(page);
                        expect(
                            await frame.evaluate(
                                (node) =>
                                    node.scrollWidth <= node.clientWidth + 1,
                            ),
                        ).toBe(true);
                        if (scenario.hasTouch) {
                            expect(
                                await page.evaluate(
                                    () =>
                                        globalThis.matchMedia(
                                            "(pointer: coarse)",
                                        ).matches,
                                ),
                            ).toBe(true);
                            for (const button of await field
                                .getByRole("button", {
                                    name: "增加",
                                    exact: true,
                                })
                                .all()) {
                                const target = await button.boundingBox();
                                expect(target.width).toBeGreaterThanOrEqual(48);
                                expect(target.height).toBeGreaterThanOrEqual(
                                    48,
                                );
                                await button.tap();
                                await expect(control).toHaveAttribute(
                                    "aria-valuenow",
                                    "12.5",
                                );
                            }
                            await control.tap();
                            await control.fill("12.");
                            await expect(control).toHaveValue("12.");
                        }
                        await settleFiniteAnimations(page);
                        const geometry = await control.boundingBox();
                        const content = await assertNumberEditGeometry(
                            control,
                            frame,
                        );
                        await info.attach(`${appearance}-environment`, {
                            body: JSON.stringify({
                                ...scenario,
                                geometry,
                                content,
                            }),
                            contentType: "application/json",
                        });
                        await captureVisual(
                            frame,
                            `${config.designSystem}-${config.colorMode}-${appearance}-${scenario.id}.png`,
                            info,
                            browserName,
                        );
                    }
                },
            );
        });
    }
test(
    "configuration changes keep the actual control and its value",
    { tag: ["@rc-number-edit", "@boundary", "@chromium-only"] },
    async ({ page, previewOrigin }, info) => {
        await openDemo(
            page,
            previewOrigin,
            "rc-number-edit",
            spec.demo,
            configurations[0],
        );
        const frame = page.locator("[data-visual-frame]");
        const control = frame.getByRole("spinbutton", {
            name: "NumberEdit outlined",
            exact: true,
        });
        await control.fill("12.");
        await expect(control).toHaveValue("12.");
        const original = await control.elementHandle();
        const wheelObservations = [];
        for (const [index, config] of configurations.entries()) {
            await page.evaluate(
                (configuration) =>
                    globalThis.postMessage(
                        { type: "crab:preview-config", ...configuration },
                        globalThis.location.origin,
                    ),
                {
                    ...config,
                    size: index % 2 ? "large" : "small",
                    density: ["compact", "standard", "comfortable"][index % 3],
                    locale: "en-US",
                    direction: "rtl",
                },
            );
            await expect(
                page.locator(".demo-default-preview").first(),
            ).toHaveAttribute("data-crab-design", config.designSystem);
            expect(await original.evaluate((node) => node.isConnected)).toBe(
                true,
            );
            await expect(control).toHaveValue("12.");
            await expect(control).toBeFocused();
            const bounds = await control.boundingBox();
            await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
            await control.evaluate(node => {
                globalThis.numberWheelObservations = [];
                node.addEventListener('wheel', event => globalThis.numberWheelObservations.push({
                    trusted: event.isTrusted, deltaX: event.deltaX, deltaY: event.deltaY, ctrlKey: event.ctrlKey, prevented: event.defaultPrevented,
                }), { once: true });
            });
            await page.mouse.wheel(80, 0);
            await expect.poll(() => page.evaluate(() => globalThis.numberWheelObservations.length)).toBe(1);
            const [wheel] = await page.evaluate(() => globalThis.numberWheelObservations);
            expect(wheel).toMatchObject({ trusted: true, deltaX: 80, deltaY: 0, prevented: false });
            wheelObservations.push({ config, wheel });
            await expect(control).toHaveValue('12.');
        }
        await control.evaluate(node => {
            globalThis.numberWheelObservations = [];
            node.addEventListener('wheel', event => globalThis.numberWheelObservations.push({
                trusted: event.isTrusted, ctrlKey: event.ctrlKey, prevented: event.defaultPrevented,
            }), { once: true });
        });
        await page.keyboard.down('Control');
        try { await page.mouse.wheel(0, -80); }
        finally { await page.keyboard.up('Control'); }
        await expect.poll(() => page.evaluate(() => globalThis.numberWheelObservations.length)).toBe(1);
        expect((await page.evaluate(() => globalThis.numberWheelObservations))[0]).toMatchObject({ trusted: true, ctrlKey: true, prevented: false });
        await expect(control).toHaveValue('12.');
        await info.attach('native-wheel-preservation', { body: JSON.stringify(wheelObservations), contentType: 'application/json' });
    },
);
