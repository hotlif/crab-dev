/** Browser-side diagnostic; complex painted backgrounds require separate review. */
export function measureTextContrast(root) {
    const document = root.ownerDocument;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const colors = new Map();
    const rgba = color => {
        if (colors.has(color)) return colors.get(color);
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        const result = [...context.getImageData(0, 0, 1, 1).data].map((value, index) => index === 3 ? value / 255 : value);
        colors.set(color, result);
        return result;
    };
    const blend = (color, background, alpha = color[3] ?? 1) => color.slice(0, 3).map((value, index) => value * alpha + background[index] * (1 - alpha));
    const luminance = rgb => rgb.map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((total, value, index) => total + value * [.2126, .7152, .0722][index], 0);
    const samples = new Map(), exclusions = new Map();
    const exclude = (reason, text) => {
        const entry = exclusions.get(reason) ?? { reason, count: 0, examples: [] };
        entry.count++;
        if (entry.examples.length < 5) entry.examples.push(text.slice(0, 100));
        exclusions.set(reason, entry);
    };
    const inspect = (element, text, textStyle, pseudoOpacity = 1) => {
        if (!text.trim()) return;
        if (element.closest('[inert], [aria-hidden="true"]')) return;
        if (element.closest(':disabled, [aria-disabled="true"]')) { exclude('inactive control', text); return; }
        const ancestors = []; let current = element;
        while (current) { ancestors.unshift(current); current = current.parentElement; }
        const styles = ancestors.map(node => globalThis.getComputedStyle(node));
        if (!element.getClientRects().length || styles.some(style => style.display === 'none' || style.visibility !== 'visible' || Number(style.opacity) === 0)) return;
        if (styles.some(style => style.clip !== 'auto' || style.clipPath !== 'none')) { exclude('clipped or visually hidden', text); return; }
        if (rgba(textStyle.color)[3] * pseudoOpacity === 0) {
            // Floating-label controls also suppress ordinary span text. Like a
            // transparent native placeholder, this does not paint a text pair.
            exclude('transparent text is not painted', text);
            return;
        }
        const fontSize = parseFloat(textStyle.fontSize), fontWeight = parseFloat(textStyle.fontWeight);
        const required = fontSize >= 24 || fontSize >= 18.666666 && fontWeight >= 700 ? 3 : 4.5;
        let complex = false;
        const paint = (index, behind) => {
            const style = styles[index], background = rgba(style.backgroundColor);
            if (background[3] === 1) complex = false;
            if (style.backgroundImage !== 'none' || style.filter !== 'none' || style.mixBlendMode !== 'normal' || style.backdropFilter && style.backdropFilter !== 'none') complex = true;
            const surface = blend(background, behind);
            let result;
            if (index < styles.length - 1) result = paint(index + 1, surface);
            else {
                const color = rgba(textStyle.color);
                result = { background: surface, foreground: blend(color, surface, color[3] * pseudoOpacity) };
            }
            const opacity = Number(style.opacity);
            return { background: blend(result.background, behind, opacity), foreground: blend(result.foreground, behind, opacity) };
        };
        const { background, foreground } = paint(0, [255, 255, 255]);
        if (complex) { exclude('image, filter or blend needs pixel review', text); return; }
        const values = [luminance(background), luminance(foreground)];
        const ratio = (Math.max(...values) + .05) / (Math.min(...values) + .05);
        const key = JSON.stringify([background, foreground, required]);
        const sample = samples.get(key) ?? { foreground, background, ratio, required, fontSize, fontWeight, count: 0, examples: [] };
        sample.count++;
        if (sample.examples.length < 6) sample.examples.push(text.trim().slice(0, 100));
        samples.set(key, sample);
    };
    const walker = document.createTreeWalker(root, globalThis.NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        const element = walker.currentNode.parentElement;
        if (!element || ['STYLE', 'SCRIPT', 'OPTION', 'TEXTAREA'].includes(element.tagName)) continue;
        const style = globalThis.getComputedStyle(element);
        // SVG text paints with fill, not the inherited CSS color property.
        inspect(element, walker.currentNode.textContent, element.namespaceURI === 'http://www.w3.org/2000/svg' ? { fontSize: style.fontSize, fontWeight: style.fontWeight, color: style.fill === 'none' ? style.color : style.fill } : style);
    }
    for (const input of root.querySelectorAll('input, textarea')) {
        if (input.tagName === 'INPUT' && !['text', 'email', 'url', 'search', 'tel', 'number', 'password'].includes(input.type)) continue;
        if (input.value) inspect(input, input.type === 'password' ? 'Password value' : input.value, globalThis.getComputedStyle(input));
        else if (input.placeholder) {
            const style = globalThis.getComputedStyle(input, '::placeholder');
            if (rgba(style.color)[3] * Number(style.opacity) === 0) {
                // Floating-label fields can intentionally suppress this paint.
                // Accessible naming and visible prompts are separate contracts.
                exclude('transparent placeholder is not painted', input.placeholder);
                continue;
            }
            inspect(input, input.placeholder, style, Number(style.opacity));
        }
    }
    const result = [...samples.values()].sort((a, b) => a.ratio - b.ratio);
    return { samples: result, failures: result.filter(sample => sample.ratio + .001 < sample.required), exclusions: [...exclusions.values()] };
}
