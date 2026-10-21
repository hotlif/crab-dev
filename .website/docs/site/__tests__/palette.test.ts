import { describe, expect, it } from "@crab-dev/wake/test";
import { designColorContract, shadcnColorContract, themeColorContract } from "@crab-dev/rc-token-semantic";
import { colors } from "../palette.js";
import { contrast, rgb } from "./colorAssertions.js";

describe("文档站与组件的双风格色彩契约", () => {
    it("站点直接消费公共 Material 和 shadcn 契约", () => {
        expect(colors).toBe(designColorContract);
        expect(colors.material).toBe(themeColorContract);
        expect(colors.shadcn).toBe(shadcnColorContract);
    });

    it("shadcn 保持中性表面和主操作，Material 保留彩色品牌", () => {
        for (const mode of ["light", "dark"] as const) {
            const neutral = colors.shadcn[mode];
            for (const value of [neutral.brand.primary, neutral.surface.canvas, neutral.surface.content, neutral.text.primary, neutral.border.default, neutral.selection.background]) {
                const channels = rgb(value);
                expect(Math.max(...channels) - Math.min(...channels)).toBeLessThan(0.001);
            }
            const material = rgb(colors.material[mode].brand.primary);
            expect(Math.max(...material) - Math.min(...material)).toBeGreaterThan(0.05);
        }
    });

    for (const [design, modes] of Object.entries(colors)) for (const [mode, color] of Object.entries(modes)) {
        it(`${design} / ${mode} 前景、边框与焦点在表面和状态层保持对比度`, () => {
            for (const surface of [color.surface.canvas, color.surface.content, color.surface.raised, color.background.hoverSubtle, color.background.activeSubtle]) {
                expect(contrast(color.text.primary, surface)).toBeGreaterThanOrEqual(4.5);
                expect(contrast(color.text.secondary, surface)).toBeGreaterThanOrEqual(4.5);
                expect(contrast(color.brand.primary, surface)).toBeGreaterThanOrEqual(4.5);
                expect(contrast(color.focusRing, surface)).toBeGreaterThanOrEqual(3);
                expect(contrast(design === "material" ? color.border.default : color.border.strong, surface)).toBeGreaterThanOrEqual(3);
            }
            expect(contrast(color.selection.foreground, color.selection.background)).toBeGreaterThanOrEqual(4.5);
        });

        for (const kind of ["error", "success", "warning", "info"] as const) {
            const feedback = color.feedback[kind];
            it(`${design} / ${mode} / ${kind} 反馈保留可读状态`, () => {
                expect(contrast(feedback.text, feedback.background)).toBeGreaterThanOrEqual(4.5);
                expect(contrast(feedback.icon, feedback.background)).toBeGreaterThanOrEqual(3);
                expect(contrast(feedback.border, feedback.background)).toBeGreaterThanOrEqual(3);
                for (const surface of [color.surface.canvas, color.surface.content, color.surface.raised]) {
                    expect(contrast(feedback.text, surface)).toBeGreaterThanOrEqual(4.5);
                    expect(contrast(feedback.icon, surface)).toBeGreaterThanOrEqual(3);
                }
                for (const state of [feedback.solid, feedback.solidHover, feedback.solidActive])
                    expect(contrast(feedback.onSolid, state)).toBeGreaterThanOrEqual(4.5);
            });
        }
    }
});
