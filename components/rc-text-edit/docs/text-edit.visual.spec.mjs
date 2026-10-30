import {
    test,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
    settleFiniteAnimations,
    captureVisual,
} from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);

async function focusByTab(page, stateControl, input) {
    await stateControl.focus();
    for (let index = 0; index < 8; index += 1) {
        await page.keyboard.press("Tab");
        if (
            await input.evaluate(
                (node) => globalThis.document.activeElement === node,
            )
        )
            break;
    }
    await expect(input).toBeFocused();
}

for (const config of configurations)
    for (const size of spec.sizes)
        for (const state of spec.states) {
            const crossEngine =
                spec.crossEngine.sizes.includes(size) &&
                spec.crossEngine.states.includes(state);
            test(
                `TextEdit ${config.designSystem} ${config.colorMode} ${size} ${state}`,
                {
                    tag: [
                        "@rc-text-edit",
                        "@matrix",
                        ...(!crossEngine ? ["@chromium-only"] : []),
                    ],
                    annotation: {
                        type: "matrix",
                        description: JSON.stringify({
                            ...config,
                            size,
                            density: "standard",
                            state,
                        }),
                    },
                },
                async ({ page, browserName, previewOrigin }, info) => {
                    await openDemo(
                        page,
                        previewOrigin,
                        "rc-text-edit",
                        spec.demo,
                        { ...config, size },
                    );
                    const stateControl = page.getByLabel("验收状态", {
                        exact: true,
                    });
                    expect(await stateControl.locator("option").evaluateAll(options => options.map(option => option.value))).toEqual(spec.states);
                    const valueValidation = state === "filled-error" || state === "filled-warning";
                    const retainedValue = valueValidation
                        ? "校验后仍保留的草稿\nKeep validation notes."
                        : "保留的多行草稿\nSelected project notes.";
                    if (valueValidation) {
                        await page.getByRole("textbox", { name: "TextEdit outlined", exact: true }).fill(retainedValue);
                        await stateControl.focus();
                    }
                    await stateControl.selectOption(state);
                    const frame = page.locator("[data-visual-frame]");
                    await expect(frame.getByRole("textbox")).toHaveCount(2);
                    for (const appearance of ["outlined", "filled"]) {
                        const input = frame.getByRole("textbox", {
                            name: `TextEdit ${appearance}`,
                            exact: true,
                        });
                        const field = input.locator("..").locator("..");
                        if (state === "auto-size") {
                            await input.fill("");
                            await settleFiniteAnimations(page);
                        }
                        const initialGeometry = await input.boundingBox();
                        if (state === "hover") {
                            const control = input.locator(".."),
                                bounds = await control.boundingBox();
                            await control.hover({
                                position: {
                                    x: bounds.width / 2,
                                    y: bounds.height * 0.85,
                                },
                            });
                        }
                        if (state === "focus-visible") {
                            await focusByTab(page, stateControl, input);
                            expect(
                                await input.evaluate((node) =>
                                    node.matches(":focus-visible"),
                                ),
                            ).toBe(true);
                            const focus = await input
                                .locator("..")
                                .evaluate((node) => {
                                    const style =
                                            globalThis.getComputedStyle(node),
                                        outline =
                                            node.querySelector("fieldset");
                                    return {
                                        outline:
                                            style.outlineStyle !== "none" &&
                                            Number.parseFloat(
                                                style.outlineWidth,
                                            ) > 0,
                                        shadow: style.boxShadow !== "none",
                                        border: Math.max(
                                            Number.parseFloat(
                                                style.borderTopWidth,
                                            ),
                                            Number.parseFloat(
                                                style.borderBottomWidth,
                                            ),
                                        ),
                                        notch: outline
                                            ? Number.parseFloat(
                                                  globalThis.getComputedStyle(
                                                      outline,
                                                  ).borderTopWidth,
                                              )
                                            : 0,
                                    };
                                });
                            expect(
                                focus.outline ||
                                    focus.shadow ||
                                    focus.border >= 2 ||
                                    focus.notch >= 2,
                            ).toBe(true);
                        }
                        if (state === "disabled")
                            await expect(input).toBeDisabled();
                        if (state === "read-only")
                            await expect(input).toHaveAttribute("readonly", "");
                        if (state === "disabled" || state === "read-only" || valueValidation) await expect(input).toHaveValue(retainedValue);
                        if (state === "disabled" || state === "read-only") await expect(field.getByRole("button", { name: "清除", exact: true })).toHaveCount(0);
                        if (state === "error" || state === "filled-error")
                            await expect(input).toHaveAttribute(
                                "aria-invalid",
                                "true",
                            );
                        if (state === "warning" || state === "filled-warning") {
                            await expect(field).toHaveAttribute(
                                "data-status",
                                "warning",
                            );
                            await expect(input).not.toHaveAttribute("aria-invalid", "true");
                        }
                        if (valueValidation) {
                            await expect(field.getByRole("button", { name: "清除", exact: true })).toBeVisible();
                            if (state === "filled-error") await expect(field.getByRole("alert")).toHaveText("请核对内容并修正后重试。");
                        }
                        if (
                            state === "filled" ||
                            state === "clear" ||
                            state === "auto-size"
                        ) {
                            await input.fill(
                                state === "auto-size"
                                    ? "项目交接记录\n第一行：中文和 English。\n第二行：检查长内容和清除按钮。\n第三行：保留滚动位置。\n第四行：更多备注。\n第五行：完成。"
                                    : "保留多行草稿\nLong project notes for the shared workspace.",
                            );
                        }
                        if (state === "auto-size") {
                            await settleFiniteAnimations(page);
                            const geometry = await input.boundingBox();
                            const supported = await page.evaluate(() =>
                                CSS.supports("field-sizing", "content"),
                            );
                            if (supported)
                                expect(geometry.height).toBeGreaterThan(
                                    initialGeometry.height,
                                );
                            await info.attach(
                                `${appearance}-auto-size-support`,
                                {
                                    body: JSON.stringify({
                                        supported,
                                        initialGeometry,
                                        geometry,
                                    }),
                                    contentType: "application/json",
                                },
                            );
                        }
                        if (state === "clear") {
                            await field
                                .getByRole("button", {
                                    name: "清除",
                                    exact: true,
                                })
                                .click();
                            await expect(input).toHaveValue("");
                            await expect(input).toBeFocused();
                        }
                        const associations = await input.evaluate((node) =>
                            (node.getAttribute("aria-describedby") ?? "")
                                .split(/\s+/)
                                .filter(Boolean)
                                .map(
                                    (id) =>
                                        globalThis.document.getElementById(id)
                                            ?.textContent,
                                ),
                        );
                        expect(associations.length).toBeGreaterThan(0);
                        expect(
                            associations.every(
                                (text) =>
                                    typeof text === "string" &&
                                    text.trim().length > 0,
                            ),
                        ).toBe(true);
                        if (state === "disabled" || state === "read-only" || valueValidation) expect(associations).toContain(`${retainedValue.length}/240`);
                        await settleFiniteAnimations(page);
                        const geometry = await input.boundingBox();
                        expect(geometry.width).toBeGreaterThan(0);
                        await info.attach(`${appearance}-geometry`, {
                            body: JSON.stringify(geometry),
                            contentType: "application/json",
                        });
                        await captureVisual(
                            frame,
                            `${config.designSystem}-${config.colorMode}-${size}-${appearance}-${state}.png`,
                            info,
                            browserName,
                        );
                    }
                },
            );
        }
