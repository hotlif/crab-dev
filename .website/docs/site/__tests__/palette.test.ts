import { describe, expect, it } from "@crab-dev/wake/test";
import { themeColorContract } from "@crab-dev/rc-token-semantic";
import { colors } from "../palette.js";
import { contrast, rgb } from "./colorAssertions.js";

describe("文档站与公共主题的色彩契约", () => {
    it("公共紫色保持既有站点品牌的 sRGB 等价值", () => {
        for (const [value, hex] of [
            [colors.light.brand, "#6750A4"], [colors.dark.brand, "#D0BCFF"],
        ]) {
            const channels = rgb(value);
            for (let index = 0; index < 3; index++)
                expect(Math.abs(channels[index] * 255 - parseInt(hex.slice(index * 2 + 1, index * 2 + 3), 16))).toBeLessThan(0.01);
        }
    });

    it("站点使用公共主题的前景、表面与选中配对", () => {
        for (const mode of ["light", "dark"] as const) {
            const site = colors[mode];
            const shared = themeColorContract[mode];
            for (const [actual, expected] of [
                [site.canvas, shared.surface.canvas],
                [site.surface, shared.surface.content],
                [site.elevated, shared.surface.raised],
                [site.selected, shared.selection.background],
                [site.onSelected, shared.selection.foreground],
                [site.text, shared.text.primary],
                [site.border, shared.border.default],
                [site.focus, shared.focusRing],
            ]) expect(actual).toBe(expected);
        }
    });

    for (const [theme, color] of Object.entries(colors)) {
        it(`${theme} 状态叠加后的链接、中性操作与容器配对满足 4.5:1`, () => {
            for (const surface of [color.canvas, color.surface, color.elevated, color.neutralHover, color.neutralActive]) {
                expect(contrast(color.text, surface)).toBeGreaterThanOrEqual(4.5);
                expect(contrast(color.secondary, surface)).toBeGreaterThanOrEqual(4.5);
                expect(contrast(color.brand, surface)).toBeGreaterThanOrEqual(4.5);
                expect(contrast(color.focus, surface)).toBeGreaterThanOrEqual(3);
                expect(contrast(color.border, surface)).toBeGreaterThanOrEqual(3);
            }
            expect(contrast(color.onPrimaryContainer, color.primaryContainer)).toBeGreaterThanOrEqual(4.5);
            expect(contrast(color.onTertiary, color.tertiary)).toBeGreaterThanOrEqual(4.5);
        });

        for (const [kind, feedback] of Object.entries(color.feedback)) {
            it(`${theme} / ${kind} 反馈文字、图标与实心按钮覆盖默认、悬停和按压`, () => {
                expect(contrast(feedback.text, feedback.background)).toBeGreaterThanOrEqual(4.5);
                expect(contrast(feedback.icon, feedback.background)).toBeGreaterThanOrEqual(3);
                expect(contrast(feedback.border, feedback.background)).toBeGreaterThanOrEqual(3);
                for (const surface of [color.canvas, color.surface, color.elevated]) {
                    expect(contrast(feedback.text, surface)).toBeGreaterThanOrEqual(4.5);
                    expect(contrast(feedback.icon, surface)).toBeGreaterThanOrEqual(3);
                }
                for (const state of [feedback.solid, feedback.hover, feedback.active])
                    expect(contrast(feedback.onSolid, state)).toBeGreaterThanOrEqual(4.5);
            });
        }
    }
});
