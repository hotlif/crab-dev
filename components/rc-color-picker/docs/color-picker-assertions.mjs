import { expect } from "../../../test/visual/component-fixture.mjs";

/** The complete HEX/alpha value must be readable without horizontal editing. */
export async function assertHexReadable(dialog, info) {
    const geometry = await dialog.getByRole('textbox').evaluate(node => {
        const style = globalThis.getComputedStyle(node);
        const canvas = node.ownerDocument.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = style.font;
        const tracking = Number.parseFloat(style.letterSpacing) || 0;
        const measure = text => context.measureText(text).width + tracking * Math.max(0, text.length - 1);
        const touch = node.ownerDocument.defaultView.matchMedia('(pointer: coarse)').matches;
        const eye = node.closest('[role="dialog"]').querySelector('[data-color-eye-dropper] [data-button-part="touch-target"]');
        let touchOverlap = null;
        if (touch && eye) {
            const field = node.closest('[data-field-control]').getBoundingClientRect(), target = eye.getBoundingClientRect();
            touchOverlap = Math.max(0, Math.min(field.right, target.right) - Math.max(field.left, target.left)) * Math.max(0, Math.min(field.bottom, target.bottom) - Math.max(field.top, target.top));
        }
        return { value: node.value, available: node.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight),
            needed: measure(node.value), wideHex: measure('#DDDDDDDD'), touchOverlap };
    });
    await info.attach('color-input-geometry', { body: JSON.stringify(geometry), contentType: 'application/json' });
    expect(geometry.available, 'Complete HEX with alpha fits the value field').toBeGreaterThanOrEqual(Math.max(geometry.needed, geometry.wideHex) - 1);
    if (geometry.touchOverlap !== null) expect(geometry.touchOverlap, 'EyeDropper hit area stays outside the editable field').toBe(0);
}

/** A six-digit HEX edit preserves the controlled demo value's existing alpha. */
export async function commitHexPreservingAlpha(page, dialog, raw) {
    expect(raw).toMatch(/^#[\da-f]{6}$/i);
    const committed = JSON.parse(await page.getByLabel("已确认颜色", { exact: true }).textContent());
    const alpha = committed.alpha ?? 1;
    const suffix = alpha < 1 ? Math.round(alpha * 255).toString(16).padStart(2, "0").toUpperCase() : "";
    const alphaSlider = dialog.getByRole("slider").last(), previousAlpha = await alphaSlider.getAttribute("aria-valuenow");
    const input = dialog.getByRole("textbox"), previousText = await input.inputValue();
    expect(previousText.slice(0, 7).toUpperCase()).not.toBe(raw.toUpperCase());
    await input.fill(raw); await input.press("Enter");
    await expect(input).toHaveValue(`${raw.toUpperCase()}${suffix}`);
    await expect(alphaSlider).toHaveAttribute("aria-valuenow", previousAlpha);
    return input;
}
