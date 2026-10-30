import {
    test,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
} from "../../../test/visual/component-fixture.mjs";

// Long press intentionally changes values over time; preserve the real sequence.
test.use({ video: "on" });
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations)
    for (const size of spec.sizes) {
        test(
            `NumberEdit ${config.designSystem} ${config.colorMode} ${size} long-press`,
            {
                tag: [
                    "@rc-number-edit",
                    "@matrix",
                    "@motion",
                    "@chromium-only",
                ],
                annotation: {
                    type: "matrix",
                    description: JSON.stringify({
                        ...config,
                        size,
                        density: "standard",
                        state: "long-press",
                    }),
                },
            },
            async ({ page, previewOrigin }, info) => {
                await openDemo(
                    page,
                    previewOrigin,
                    "rc-number-edit",
                    spec.demo,
                    { ...config, size },
                );
                const stateControl = page.getByLabel("验收状态", {
                    exact: true,
                });
                const frame = page.locator("[data-visual-frame]");
                for (const appearance of ["outlined", "filled"]) {
                    await stateControl.selectOption("default");
                    await stateControl.selectOption("long-press");
                    const input = frame.getByRole("spinbutton", {
                        name: `NumberEdit ${appearance}`,
                        exact: true,
                    });
                    const field = input.locator("..").locator("..");
                    await field
                        .getByRole("button", { name: "增加", exact: true })
                        .hover();
                    const sequence = [];
                    const started = await page.evaluate(() => globalThis.performance.now());
                    await page.mouse.down();
                    try {
                        for (let index = 0; index < 4; index += 1) {
                            const sample = await input.evaluate(node => ({
                                time: globalThis.performance.now(), value: node.getAttribute("aria-valuenow"),
                            }));
                            sequence.push({ elapsed: sample.time - started, value: sample.value });
                            await info.attach(
                                `${appearance}-long-press-${index}`,
                                {
                                    body: await frame.screenshot({
                                        animations: "allow",
                                        caret: "hide",
                                    }),
                                    contentType: "image/png",
                                },
                            );
                            await page.waitForTimeout(200);
                        }
                    } finally {
                        await page.mouse.up();
                    }
                    const value = Number(
                        await input.getAttribute("aria-valuenow"),
                    );
                    expect(value).toBeGreaterThan(10.5);
                    await page.waitForTimeout(250);
                    await expect(input).toHaveAttribute(
                        "aria-valuenow",
                        String(value),
                    );
                    await info.attach(`${appearance}-long-press-sequence`, {
                        body: JSON.stringify(sequence),
                        contentType: "application/json",
                    });
                }
            },
        );
    }
