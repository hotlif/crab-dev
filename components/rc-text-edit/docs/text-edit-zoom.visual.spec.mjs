import {
    zoomTest as test,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
    settleFiniteAnimations,
    captureZoom,
} from "../../../test/visual/component-fixture.mjs";
import { assertTextEditGeometry } from "./visual-geometry.mjs";

const spec = await readVisualSpec(import.meta.url);
const draft = "项目放大后仍保留的草稿\nKeep this draft at 200%.";
for (const config of configurations)
    test(
        `TextEdit ${config.designSystem} ${config.colorMode} real 200% zoom`,
        {
            tag: ["@rc-text-edit", "@environment", "@chromium-only"],
            annotation: {
                type: "environment",
                description: JSON.stringify({ id: "zoom-200", ...config }),
            },
        },
        async ({ page, previewOrigin, realZoom }, info) => {
            await openDemo(
                page,
                previewOrigin,
                "rc-text-edit",
                spec.demo,
                config,
            );
            const frame = page.locator("[data-visual-frame]");
            const input = frame.getByRole("textbox", {
                name: "TextEdit outlined",
                exact: true,
            });
            await input.fill(draft);
            const original = await input.elementHandle();
            await realZoom.set200(page);
            expect(await original.evaluate((node) => node.isConnected)).toBe(
                true,
            );
            await expect(input).toHaveValue(draft);
            for (const appearance of ["outlined", "filled"]) {
                const fieldInput = frame.getByRole("textbox", {
                    name: `TextEdit ${appearance}`,
                    exact: true,
                });
                const field = fieldInput.locator("..").locator("..");
                if (appearance === "filled") await fieldInput.fill(draft);
                await page.keyboard.press("Tab");
                await expect(
                    field.getByRole("button", { name: "清除", exact: true }),
                ).toBeFocused();
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
                await expect(fieldInput).toHaveValue(draft);
                expect(
                    await fieldInput.evaluate(
                        (node) => node.scrollWidth <= node.clientWidth + 1,
                    ),
                ).toBe(true);
                await info.attach(`zoom-${appearance}-content`, {
                    body: JSON.stringify(
                        await assertTextEditGeometry(fieldInput, frame),
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
