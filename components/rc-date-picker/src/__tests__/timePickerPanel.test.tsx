import { describe, expect, it, mock } from "@crab-dev/wake/test";
import { fireEvent, render, screen } from "@crab-dev/wake/test/react";

import TimePickerPanel from "../panels/timePickerPanel.js";

describe("TimePickerPanel", () => {
    it("renders keyboard-editable Material time input fields", async () => {
        await render(<TimePickerPanel value={{ hour: 9, minute: 30, second: 5 }} />);
        const hour = screen.getByRole("spinbutton", { name: "小时" });
        const minute = screen.getByRole("spinbutton", { name: "分钟" });
        const second = screen.getByRole("spinbutton", { name: "秒" });
        expect(hour.getAttribute("aria-valuemin")).toBe("0");
        expect(hour.getAttribute("aria-valuemax")).toBe("23");
        expect(minute.getAttribute("aria-valuemax")).toBe("59");
        expect(second.getAttribute("aria-valuemax")).toBe("59");
        expect(screen.getByText("24 小时制；秒是企业场景扩展。")).toBeTruthy();
    });

    it("supports arrow-key time changes", async () => {
        const onValueChange = mock.fn();
        await render(
            <TimePickerPanel
                value={{ hour: 9, minute: 30, second: 5 }}
                onValueChange={onValueChange}
            />
        );
        await fireEvent.keyDown(screen.getByRole("spinbutton", { name: "分钟" }), { key: "ArrowUp" });
        expect(onValueChange).toHaveBeenCalledWith({ hour: 9, minute: 31, second: 5 });
    });
});
