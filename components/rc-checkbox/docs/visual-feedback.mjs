import { expect } from "../../../test/visual/component-fixture.mjs";

// Compare demo feedback with native state, never with mirrored demo data attributes.
export async function assertCheckboxFeedback(frame, control, { locale = "zh-CN" } = {}) {
    const native = await control.evaluate(node => ({ checked: node.checked, indeterminate: node.indeterminate }));
    await expect(control).toHaveAttribute("aria-checked", native.indeterminate ? "mixed" : String(native.checked));
    const english = locale === "en-US";
    const booleanSelection = native.checked ? "on" : "off";
    const selection = native.indeterminate ? "mixed" : booleanSelection;
    const detail = native.indeterminate ? english ? ` (boolean: ${booleanSelection})` : `（半选，布尔值: ${booleanSelection}）` : "";
    await expect(frame.locator("output")).toHaveText(`${english ? "Selection" : "当前选择"}: ${selection}${detail}`);
    return native;
}
