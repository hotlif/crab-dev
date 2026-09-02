import globalToken from '@crab-dev/rc-token-global';
import { describe, expect, it } from '@crab-dev/wake/test';
import token from '../token.js';

type Color = readonly [red: number, green: number, blue: number];

function parseOklch(value: string): Color {
    const matches = [
        ...value.matchAll(
            /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/gi,
        ),
    ];
    const match = matches.at(-1);
    if (!match) throw new Error(`Missing OKLCh fallback in ${value}`);

    const lightness = Number(match[1]);
    const chroma = Number(match[2]);
    const hue = (Number(match[3]) * Math.PI) / 180;
    const a = chroma * Math.cos(hue);
    const b = chroma * Math.sin(hue);
    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const clamp = (channel: number) => Math.max(0, Math.min(1, channel));
    const encode = (channel: number) =>
        channel <= 0.0031308
            ? 12.92 * channel
            : 1.055 * channel ** (1 / 2.4) - 0.055;

    return [
        encode(clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)),
        encode(clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)),
        encode(clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)),
    ];
}

function relativeLuminance(color: Color): number {
    const [red, green, blue] = color.map((channel) =>
        channel <= 0.04045
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4,
    );
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function composite(foreground: Color, background: Color, alpha: number): Color {
    return [
        foreground[0] * alpha + background[0] * (1 - alpha),
        foreground[1] * alpha + background[1] * (1 - alpha),
        foreground[2] * alpha + background[2] * (1 - alpha),
    ];
}

function contrast(first: Color, second: Color): number {
    const firstLuminance = relativeLuminance(first);
    const secondLuminance = relativeLuminance(second);
    return (
        (Math.max(firstLuminance, secondLuminance) + 0.05) /
        (Math.min(firstLuminance, secondLuminance) + 0.05)
    );
}

function colorMixAlpha(value: string): number {
    const match = /\s([\d.]+)%,\s*transparent\)/.exec(value);
    if (!match) throw new Error(`Missing transparent color-mix in ${value}`);
    return Number(match[1]) / 100;
}

describe('Prose inverse token contrast', () => {
    const zinc50 = parseOklch(globalToken.zinc['50']);
    const zinc950 = parseOklch(globalToken.zinc['950']);
    const themes = [
        { name: 'light', foreground: zinc50, background: zinc950 },
        { name: 'dark', foreground: zinc950, background: zinc50 },
    ];

    it('keeps inverse text composites above their WCAG thresholds', () => {
        const roles = [
            {
                name: 'link hover',
                value: token.inverse.link['color-hover'],
                minimum: 4.5,
            },
            {
                name: 'list counter',
                value: token.inverse.list.counter.color,
                minimum: 4.5,
            },
            {
                name: 'list bullet',
                value: token.inverse.list.bullet.color,
                minimum: 3,
            },
            {
                name: 'caption',
                value: token.inverse.caption.color,
                minimum: 4.5,
            },
            {
                name: 'kbd outline',
                value: token.inverse.kbd['box-shadow'],
                minimum: 3,
            },
        ];

        expect(token.inverse.link.color).toContain(
            '--token-semantic-color-text-inverse',
        );
        for (const role of roles) {
            const alpha = colorMixAlpha(role.value);
            for (const theme of themes) {
                const finalColor = composite(
                    theme.foreground,
                    theme.background,
                    alpha,
                );
                expect(contrast(finalColor, theme.background)).toBeGreaterThanOrEqual(
                    role.minimum,
                );
            }
        }

        expect(token.inverse.pre['background-color']).toContain(
            '--token-semantic-color-text-inverse',
        );
        const preAlpha = colorMixAlpha(token.inverse.pre['background-color']);
        for (const theme of themes) {
            const finalColor = composite(
                theme.foreground,
                theme.background,
                preAlpha,
            );
            expect(contrast(finalColor, theme.background)).toBeGreaterThan(1);
        }
    });
});
