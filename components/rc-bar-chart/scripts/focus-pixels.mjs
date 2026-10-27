const contrast = (first, second) => {
    const luminance = rgb => rgb.slice(0, 3).reduce((sum, value, index) => {
        const channel = value / 255;
        return sum + (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4) * [0.2126, 0.7152, 0.0722][index];
    }, 0);
    const a = luminance(first), b = luminance(second);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

/** Shared by actual Chrome PNG assertions and historical-PNG rejection checks. */
export function inspectFocusBand(image, edge, expected, surface, subject) {
    const check = (condition, message) => { if (!condition) throw Error(message); };
    check(expected.length === 4 && expected[3] === 255, 'Expected opaque actual focus color');
    check(Math.abs(edge.dx) + Math.abs(edge.dy) === 2 && edge.width > 0 && edge.height > 0, 'Expected immediate outside-outline2px band');
    let measured = 0, readable = 0, total = 0;
    const ratios = [], distantSceneRatios = [], backgrounds = new Map();
    const at = (x, y) => {
        check(x >= 0 && y >= 0 && x < image.width && y < image.height, 'Focus or scene sample outside actual PNG');
        const offset = (y * image.width + x) * 4;
        return Array.from(image.data.slice(offset, offset + 4));
    };
    for (let y = Math.ceil(edge.y); y < Math.floor(edge.y + edge.height); y++) {
        for (let x = Math.ceil(edge.x); x < Math.floor(edge.x + edge.width); x++) {
            total += 1;
            const actual = at(x, y);
            if (!actual.slice(0, 3).every((value, index) => Math.abs(value - expected[index]) <= 2)) continue;
            const background = at(x + edge.dx, y + edge.dy);
            if (surface) check(background.every((value, index) => Math.abs(value - surface[index]) <= 2), `Actual ${subject}/${edge.side} surface separator missing`);
            const ratio = contrast(actual, background);
            ratios.push(ratio); measured += 1;
            if (ratio >= 3) readable += 1;
            const color = background.join(','); backgrounds.set(color, (backgrounds.get(color) ?? 0) + 1);
            distantSceneRatios.push(contrast(actual, at(x + edge.dx * 3, y + edge.dy * 3)));
        }
    }
    check(total > 0 && measured / total >= 0.65, `Actual ${subject}/${edge.side} outline missing or obscured: ${measured}/${total}`);
    check(measured > 0 && readable === measured, `Actual ${subject}/${edge.side} outline/background contrast below3: ${Math.min(...ratios)}`);
    return {
        actualContrast: { measured, readable, minimum: Math.min(...ratios), backgrounds: Object.fromEntries(backgrounds), scope: 'Immediate outside-outline2px band; all matching focus pixels must meet3:1. Bar band must be actual opaque surface separator.' },
        distantSceneDiagnostic: { offset: 6, minimumContrast: Math.min(...distantSceneRatios), scope: 'Retained original6px diagnostic. May hit another series beyond the separator; not the adjacent focus/background pair.' },
    };
}
