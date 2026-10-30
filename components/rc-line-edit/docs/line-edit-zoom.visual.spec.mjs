import {
    zoomTest as test,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
    captureZoom,
    settleFiniteAnimations,
} from "../../../test/visual/component-fixture.mjs";
import { matrixInput, focusByKeyboard, assertCompleteDraft, assertLineEditGeometry } from "./visual-assertions.mjs";
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) {
    test(
        `${config.designSystem} ${config.colorMode} real 200%`,
        {
            tag: ["@rc-line-edit", "@environment", "@chromium-only"],
            annotation: { type: "environment", description: JSON.stringify({ ...config, id: "zoom-200" }) },
        },
        async ({ page, previewOrigin, realZoom }, info) => {
            const root = await openDemo(page, previewOrigin, "rc-line-edit", spec.demo, config);
            const scene = root.getByRole("region", { name: "LineEdit visual matrix" });
            const frame = scene.locator("[data-visual-frame]");
            const stateControl = scene.getByLabel("验收状态", { exact: true });
            const draft = "200% 保留长草稿 Retained draft · A complete project name remains selectable beyond the visible input text area";
            await matrixInput(scene, "outlined").fill(draft);
            const originals = await Promise.all(["outlined", "filled"].map((appearance) => matrixInput(scene, appearance).elementHandle()));
            await realZoom.set200(page);
            for (const [index, appearance] of ["outlined", "filled"].entries()) {
                const input = matrixInput(scene, appearance);
                const field = input.locator("..").locator("..");
                await input.scrollIntoViewIfNeeded();
                expect(await originals[index].evaluate((node) => node.isConnected)).toBe(true);
                await expect(input).toHaveValue(draft);
                await focusByKeyboard(page, stateControl, input);
                const selection = await assertCompleteDraft(input, draft);
                await input.press("Tab");
                const clear = field.getByRole("button");
                await expect(clear).toBeFocused();
                await page.keyboard.press("Enter");
                await expect(input).toHaveValue("");
                await expect(input).toBeFocused();
                await input.fill(draft);
                await input.press("Tab");
                await expect(clear).toBeFocused();
                await settleFiniteAnimations(page);
                await field.scrollIntoViewIfNeeded();
                await expect(field).toBeInViewport({ ratio: 1 });
                await expect(input).toHaveValue(draft);
                expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth + 1)).toBe(true);
                expect(await frame.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
                await info.attach(`zoom-${appearance}-content`, {
                    body: JSON.stringify({ selection, content: await assertLineEditGeometry(input, frame) }),
                    contentType: "application/json",
                });
                await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-${appearance}-zoom200.png`, info);
            }
        },
    );
}
