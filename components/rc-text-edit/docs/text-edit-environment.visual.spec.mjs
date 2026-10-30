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
import { assertTextEditGeometry } from "./visual-geometry.mjs";

const spec = await readVisualSpec(import.meta.url);
const scenarios = environmentCases;
for (const config of configurations)
    for (const scenario of scenarios) {
        test.describe(`text-edit ${config.designSystem} ${config.colorMode} ${scenario.id}`, () => {
            test.use({ hasTouch: scenario.hasTouch ?? false });
            test(
                "environment and real input",
                {
                    tag: ["@rc-text-edit", "@environment", "@chromium-only"],
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
                        "rc-text-edit",
                        spec.demo,
                        { ...config, ...scenario.config },
                    );
                    await applyEnvironment(page, scenario);
                    const frame = page.locator("[data-visual-frame]");
                    for (const appearance of ["outlined", "filled"]) {
                        const control = frame.getByRole("textbox", {
                            name: `TextEdit ${appearance}`,
                            exact: true,
                        });
                        const field = control.locator("..").locator("..");
                        if (scenario.config?.locale === "en-US") {
                            await expect(field.locator('[data-field-label-text]')).toContainText("Project notes");
                            await expect(field.locator('[data-support]')).toContainText("up to 240 characters");
                        }
                        const draft =
                            "保留草稿\nA long project note with 中文 and English.";
                        if (scenario.hasTouch) {
                            // The floating label shares the empty M3 control row.
                            // Its native label association is a real focus target.
                            await field.locator(':scope > label').tap();
                            await expect(control).toBeFocused();
                        }
                        await control.fill(draft);
                        await expect(control).toHaveValue(draft);
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
                            const clear = field.getByRole("button", {
                                name: "清除",
                                exact: true,
                            });
                            const target = await clear.boundingBox();
                            expect(target.width).toBeGreaterThanOrEqual(48);
                            expect(target.height).toBeGreaterThanOrEqual(48);
                            await clear.tap();
                            await expect(control).toHaveValue("");
                            await expect(control).toBeFocused();
                            await control.tap();
                            await control.fill(draft);
                            await expect(control).toHaveValue(draft);
                        }
                        if (scenario.id === "narrow") {
                            const scrollingDraft =
                                draft +
                                "\n" +
                                Array.from(
                                    { length: 6 },
                                    (_, index) =>
                                        `第 ${index + 1} 行 · project note`,
                                ).join("\n");
                            await control.fill(scrollingDraft);
                            await expect(control).toHaveValue(scrollingDraft);
                            await control.press("ControlOrMeta+Home");
                            await expect
                                .poll(() =>
                                    control.evaluate((node) => node.scrollTop),
                                )
                                .toBe(0);
                            await control.press("ControlOrMeta+End");
                            await expect.poll(() => control.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
                            const scrolling = await control.evaluate(
                                (node) => ({
                                    top: node.scrollTop,
                                    height: node.scrollHeight,
                                    clientHeight: node.clientHeight,
                                }),
                            );
                            expect(scrolling.height).toBeGreaterThan(
                                scrolling.clientHeight,
                            );
                            expect(scrolling.top).toBeGreaterThan(0);
                            await info.attach(`${appearance}-native-scroll`, {
                                body: JSON.stringify(scrolling),
                                contentType: "application/json",
                            });
                        }
                        await settleFiniteAnimations(page);
                        const geometry = await control.boundingBox();
                        const content = await assertTextEditGeometry(
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
    { tag: ["@rc-text-edit", "@boundary", "@chromium-only"] },
    async ({ page, previewOrigin }) => {
        await openDemo(
            page,
            previewOrigin,
            "rc-text-edit",
            spec.demo,
            configurations[0],
        );
        const frame = page.locator("[data-visual-frame]");
        const control = frame.getByRole("textbox", {
            name: "TextEdit outlined",
            exact: true,
        });
        await control.fill(
            "保留草稿\nA long project note with 中文 and English.",
        );
        await expect(control).toHaveValue(
            "保留草稿\nA long project note with 中文 and English.",
        );
        const original = await control.elementHandle();
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
            await expect(control).toHaveValue(
                "保留草稿\nA long project note with 中文 and English.",
            );
        }
    },
);
