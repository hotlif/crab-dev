import { expect } from "../../../test/visual/component-fixture.mjs";

export async function assertRadioFeedback(frame, control, { locale = "zh-CN" } = {}) {
    const checked = await control.evaluate(node => node.checked);
    expect(typeof checked).toBe("boolean");
    await expect(frame.locator("output")).toHaveText(`${locale === "en-US" ? "Selection" : "当前选择"}: ${checked ? "on" : "off"}`);
    return checked;
}
