import { describe, it, expect } from "@crab-dev/wake/test";
import { dimColor, CATEGORICAL_PALETTE, MAX_SERIES } from '../palette.js';
describe('dimColor', () => {
    it('keep=1 返回原色（不做任何转换）', () => {
        expect(dimColor('#3366ff', 1)).toBe('#3366ff');
    });
    it('向白背景混合为不透明色：keep=0.5 时通道折半靠白', () => {
        expect(dimColor('#0000ff', 0.5)).toBe('rgb(128, 128, 255)');
    });
    it('keep 越小越接近背景白', () => {
        expect(dimColor('#000000', 0.25)).toBe('rgb(191, 191, 191)');
    });
    it('oklch 系列色可解析混合（输出为合法 rgb() 字面量）', () => {
        const out = dimColor(CATEGORICAL_PALETTE[0], 0.45);
        expect(out).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    });
});
describe('CATEGORICAL_PALETTE', () => {
    it('MAX_SERIES 与色板长度一致', () => {
        expect(MAX_SERIES).toBe(CATEGORICAL_PALETTE.length);
    });
});
