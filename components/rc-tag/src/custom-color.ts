/** Pick a foreground only when the complete sRGB background is known without a DOM. */
export function getOpaqueHexForeground(value: string): 'black' | 'white' | undefined {
    const match = /^#([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.exec(value.trim());
    if (!match) return undefined;

    const digits = match[1].toLowerCase();
    const short = digits.length <= 4;
    if ((digits.length === 4 && digits[3] !== 'f') ||
        (digits.length === 8 && !digits.endsWith('ff'))) return undefined;

    const rgb = short
        ? [...digits.slice(0, 3)].map(digit => digit + digit).join('')
        : digits.slice(0, 6);
    const [red, green, blue] = [0, 2, 4].map(offset => {
        const channel = Number.parseInt(rgb.slice(offset, offset + 2), 16) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    const blackContrast = (luminance + 0.05) / 0.05;
    const whiteContrast = 1.05 / (luminance + 0.05);
    // These are mathematical contrast endpoints for caller-provided colors,
    // not theme palette roles. No CSS variable, alpha backdrop or DOM is guessed.
    return blackContrast >= whiteContrast ? 'black' : 'white';
}
