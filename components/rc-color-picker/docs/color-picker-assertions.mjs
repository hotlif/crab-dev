import { expect } from "../../../test/visual/component-fixture.mjs";

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
