import {
    test,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
    captureVisual,
    settleFiniteAnimations,
    environmentCases,
    applyEnvironment,
} from "../../../test/visual/component-fixture.mjs";
import { matrixInput, focusByKeyboard, assertCompleteDraft, assertLineEditGeometry } from "./visual-assertions.mjs";
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations)
    for (const environment of environmentCases) {
        test.describe(`line-edit ${config.designSystem} ${config.colorMode} ${environment.id}`, () => {
            test.use({ hasTouch: environment.hasTouch ?? false });
            test(
                "field environment and long draft",
                {
                    tag: ["@rc-line-edit", "@environment", "@chromium-only"],
                    annotation: { type: "environment", description: JSON.stringify({ ...config, id: environment.id }) },
                },
                async ({ page, previewOrigin, browserName }, info) => {
                    await applyEnvironment(page, environment);
                    const root = await openDemo(page, previewOrigin, "rc-line-edit", spec.demo, { ...config, ...environment.config });
                    const scene = root.getByRole("region", { name: "LineEdit visual matrix" });
                    const frame = scene.locator("[data-visual-frame]");
                    const stateControl = scene.getByLabel("验收状态", { exact: true });
                    const draft = "保持长草稿 · A long retained draft with text that scrolls inside its own input";
                    for (const appearance of ["outlined", "filled"]) {
                        const input = matrixInput(scene, appearance);
                        const field = input.locator("..").locator("..");
                        if (environment.hasTouch) {
                            await field.locator(":scope > label").tap();
                            await expect(input).toBeFocused();
                        }
                        await input.fill(draft);
                        await expect(scene.getByRole("textbox").last()).toHaveValue(draft);
                        if (environment.config?.locale === "en-US") {
                            await expect(field.locator("[data-field-label-text]")).toContainText("Project name");
                            await expect(field.locator("[data-field-support]")).toContainText("shared project list");
                        }
                        await focusByKeyboard(page, stateControl, input);
                        const selection = await assertCompleteDraft(input, draft);
                        await input.press("Tab");
                        const clear = field.getByRole("button");
                        await expect(clear).toBeFocused();
                        if (environment.hasTouch) await clear.tap();
                        else await page.keyboard.press("Enter");
                        await expect(input).toHaveValue("");
                        await expect(input).toBeFocused();
                        await input.fill(draft);
                        await input.press("Tab");
                        await expect(clear).toBeFocused();
                        await settleFiniteAnimations(page);
                        expect(await scene.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
                        expect(
                            await page.evaluate(
                                () =>
                                    globalThis.document.documentElement.scrollWidth <= globalThis.document.documentElement.clientWidth + 1,
                            ),
                        ).toBe(true);
                        if (environment.hasTouch) {
                            const bounds = await input.locator("..").boundingBox();
                            expect(bounds.height).toBeGreaterThanOrEqual(48);
                            const action = await clear.boundingBox();
                            expect(action.width).toBeGreaterThanOrEqual(48);
                            expect(action.height).toBeGreaterThanOrEqual(48);
                            expect(await page.evaluate(() => globalThis.matchMedia("(pointer: coarse)").matches)).toBe(true);
                        }
                        await info.attach(`${appearance}-environment`, {
                            body: JSON.stringify({ environment, selection, content: await assertLineEditGeometry(input, frame) }),
                            contentType: "application/json",
                        });
                        await captureVisual(
                            scene,
                            `${config.designSystem}-${config.colorMode}-${appearance}-${environment.id}.png`,
                            info,
                            browserName,
                        );
                    }
                },
            );
        });
    }
