import { expect } from "../../../test/visual/component-fixture.mjs";

export async function assertSwitchFeedback(frame, control, { locale = "zh-CN" } = {}) {
    const checked = await control.getAttribute("aria-checked");
    expect(["true", "false"]).toContain(checked);
    await expect(frame.locator("output")).toHaveText(`${locale === "en-US" ? "Selection" : "当前选择"}: ${checked === "true" ? "on" : "off"}`);
    return checked;
}
