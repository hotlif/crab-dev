import {
    test,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
    settleFiniteAnimations,
    captureVisual,
} from "../../../test/visual/component-fixture.mjs";
import { matrixInput, focusByKeyboard, assertLineEditGeometry } from "./visual-assertions.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations)
    for (const size of spec.sizes)
        for (const state of spec.states) {
            const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.states.includes(state);
            test(
                `${config.designSystem} ${config.colorMode} ${size} ${state}`,
                {
                    tag: ["@rc-line-edit", "@matrix", ...(!crossEngine ? ["@chromium-only"] : [])],
                    annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density: "standard", state }) },
                },
                async ({ page, browserName, previewOrigin }, info) => {
                    await openDemo(page, previewOrigin, "rc-line-edit", spec.demo, { ...config, size });
                    const stateControl = page.getByLabel("验收状态", { exact: true });
                    expect(await stateControl.locator("option").evaluateAll(options => options.map(option => option.value))).toEqual(spec.states);
                    const scene = page.getByRole("region", { name: "LineEdit visual matrix" });
                    const frame = scene.locator("[data-visual-frame]");
                    const password = state === "password-hidden" || state === "password-visible";
                    const valueState = ["read-only-filled", "disabled-filled", "filled-error", "filled-warning", "borderless-focus"].includes(state) || password;
                    const retainedValue = password ? "Crab-visual-42" : "保留项目名称 · Retained project";
                    if (valueState) {
                        await matrixInput(scene, "outlined").fill(retainedValue);
                        await stateControl.focus();
                    }
                    await stateControl.selectOption(state);
                    // Native password inputs intentionally have no textbox role.
                    await expect(frame.locator("input")).toHaveCount(2);
                    for (const appearance of ["outlined", "filled"]) {
                        const input = matrixInput(scene, appearance);
                        const field = input.locator("..").locator("..");
                        // Empty M3 floating labels legitimately receive pointer events and focus
                        // their input on click. Hover the field container through that real hit.
                        if (state === "hover") {
                            const control = input.locator(".."),
                                bounds = await control.boundingBox();
                            await control.hover({ position: { x: bounds.width / 2, y: bounds.height * 0.85 } });
                            expect(await control.evaluate((node) => node.matches(":hover"))).toBe(true);
                        }
                        if (state === "focus-visible" || state === "borderless-focus") {
                            await focusByKeyboard(page, stateControl, input);
                            await settleFiniteAnimations(page);
                            const focus = await input.locator("..").evaluate((node) => {
                                const style = globalThis.getComputedStyle(node),
                                    outline = node.querySelector("fieldset");
                                return {
                                    outline: style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) > 0,
                                    shadow: style.boxShadow !== "none",
                                    border: Math.max(Number.parseFloat(style.borderTopWidth), Number.parseFloat(style.borderBottomWidth)),
                                    notch: outline ? Number.parseFloat(globalThis.getComputedStyle(outline).borderTopWidth) : 0,
                                };
                            });
                            expect(focus.outline || focus.shadow || focus.border >= 2 || focus.notch >= 2).toBe(true);
                        }
                        const disabled = state === "disabled" || state === "disabled-filled";
                        const readOnly = state === "read-only" || state === "read-only-filled";
                        if (disabled) await expect(input).toBeDisabled();
                        if (readOnly) await expect(input).toHaveAttribute("readonly", "");
                        if (disabled || readOnly) await expect(field.getByRole("button", { name: "清除", exact: true })).toHaveCount(0);
                        if (state === "error" || state === "filled-error") await expect(input).toHaveAttribute("aria-invalid", "true");
                        if (state === "warning" || state === "filled-warning") {
                            await expect(field).toHaveAttribute("data-status", "warning");
                            await expect(input).not.toHaveAttribute("aria-invalid", "true");
                        }
                        if (valueState) await expect(input).toHaveValue(retainedValue);
                        if (password) {
                            await expect(input).toHaveAttribute("type", "password");
                            const reveal = field.getByRole("button", { name: "显示密码", exact: true });
                            await expect(reveal).toHaveAttribute("aria-controls", await input.getAttribute("id"));
                            await focusByKeyboard(page, stateControl, input);
                            await input.press("Tab");
                            await expect(field.getByRole("button", { name: "清除", exact: true })).toBeFocused();
                            await page.keyboard.press("Tab");
                            await expect(reveal).toBeFocused();
                            await page.keyboard.press("Enter");
                            await expect(input).toHaveAttribute("type", "text");
                            await expect(input).toHaveValue(retainedValue);
                            const conceal = field.getByRole("button", { name: "隐藏密码", exact: true });
                            await expect(conceal).toBeFocused();
                            if (state === "password-hidden") {
                                // Exercise both native transitions before the masked capture.
                                await page.keyboard.press("Enter");
                                await expect(input).toHaveAttribute("type", "password");
                                await expect(reveal).toBeFocused();
                            }
                            await expect(input).toHaveValue(retainedValue);
                            await info.attach(`${appearance}-password-state`, {
                                body: JSON.stringify(await input.evaluate(node => ({ type: node.type, value: node.value }))),
                                contentType: "application/json",
                            });
                        }
                        if (state === "borderless-focus") {
                            await expect(frame).toHaveAttribute("data-visual-host", "true");
                            const control = input.locator("..");
                            await expect(control).toHaveCSS("border-top-width", "0px");
                            await expect(control).toHaveCSS("border-bottom-width", "0px");
                            await expect(control).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
                            await expect(control).toHaveCSS("box-shadow", "none");
                            await expect(input).toBeFocused();
                        }
                        if (state === "read-only-filled") {
                            await focusByKeyboard(page, stateControl, input);
                            // Readonly text is selectable; it need not expose the same
                            // collapsed-caret Home/End behavior as an editable input.
                            await input.press("ControlOrMeta+A");
                            await expect.poll(() => input.evaluate(node => ({ start: node.selectionStart, end: node.selectionEnd })))
                                .toEqual({ start: 0, end: retainedValue.length });
                            const selection = await input.evaluate(node => ({
                                start: node.selectionStart,
                                end: node.selectionEnd,
                                value: node.value,
                                readOnly: node.readOnly,
                                focused: globalThis.document.activeElement === node,
                            }));
                            expect(selection.readOnly).toBe(true);
                            expect(selection.focused).toBe(true);
                            await input.press("x");
                            await expect(input).toHaveValue(retainedValue);
                            await info.attach(`${appearance}-readonly-selection`, {
                                body: JSON.stringify({ ...selection, valueAfterTyping: await input.inputValue(), testedKeys: ["Tab", "ControlOrMeta+A", "x"] }),
                                contentType: "application/json",
                            });
                            await stateControl.focus();
                        }
                        if (state === "disabled-filled") {
                            await stateControl.focus();
                            await page.keyboard.press("Tab");
                            expect(await scene.getByRole("textbox").evaluateAll(nodes => nodes.every(node => node !== globalThis.document.activeElement))).toBe(true);
                            await stateControl.focus();
                        }
                        if (state === "filled-error" || state === "filled-warning") {
                            await expect(field.getByRole("button", { name: "清除", exact: true })).toBeVisible();
                            if (state === "filled-error") await expect(field.getByRole("alert")).toHaveText("请填写有效的项目名称。");
                        }
                        if (state === "filled") await expect(input).not.toHaveValue("");
                        if (state === "clear") {
                            await input.fill("清除后继续编辑 · Clear this draft");
                            await field.getByRole("button", { name: "清除", exact: true }).click();
                            await expect(input).toHaveValue("");
                            await expect(input).toBeFocused();
                        }
                        const descriptions = await input.evaluate((node) =>
                            (node.getAttribute("aria-describedby") ?? "")
                                .split(/\s+/)
                                .filter(Boolean)
                                .map((id) => globalThis.document.getElementById(id)?.textContent),
                        );
                        expect(descriptions.length).toBeGreaterThan(0);
                        expect(descriptions.every((text) => typeof text === "string" && text.trim().length > 0)).toBe(true);
                        await settleFiniteAnimations(page);
                        await info.attach(`${appearance}-content-geometry`, {
                            body: JSON.stringify(await assertLineEditGeometry(input, frame)),
                            contentType: "application/json",
                        });
                        await captureVisual(
                            scene,
                            `${config.designSystem}-${config.colorMode}-${size}-${appearance}-${state}.png`,
                            info,
                            browserName,
                        );
                    }
                },
            );
        }

test(
    "configuration switches preserve the actual input and draft",
    { tag: ["@rc-line-edit", "@boundary"] },
    async ({ page, previewOrigin }) => {
        await openDemo(page, previewOrigin, "rc-line-edit", spec.demo, configurations[0]);
        const scene = page.getByRole("region", { name: "LineEdit visual matrix" });
        const input = matrixInput(scene, "outlined");
        await input.fill("保留输入草稿");
        const originals = await Promise.all(["outlined", "filled"].map((appearance) => matrixInput(scene, appearance).elementHandle()));
        for (const config of configurations) {
            await page.evaluate(
                (config) =>
                    globalThis.postMessage(
                        {
                            type: "crab:preview-config",
                            ...config,
                            size: "large",
                            density: "comfortable",
                            locale: "en-US",
                            direction: "rtl",
                        },
                        globalThis.location.origin,
                    ),
                config,
            );
            await expect(page.locator(".demo-default-preview").first()).toHaveAttribute("data-crab-design", config.designSystem);
            for (const [index, appearance] of ["outlined", "filled"].entries()) {
                expect(await originals[index].evaluate((node) => node.isConnected)).toBe(true);
                await expect(matrixInput(scene, appearance)).toHaveValue("保留输入草稿");
            }
        }
    },
);
