import { afterEach, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import ColorInput from "../panels/colorInput.js";
import type { EyeDropperOpenOptions, EyeDropperResult, OKLCHValue } from "../types.js";

const originalEyeDropper = Object.getOwnPropertyDescriptor(window, "EyeDropper");
afterEach(() => {
    if (originalEyeDropper) Object.defineProperty(window, "EyeDropper", originalEyeDropper);
    else delete window.EyeDropper;
});
const current: OKLCHValue = { lightness: 0.6, chroma: 0.1, hue: 240, alpha: 0.4 };
function installEyeDropper(open: (options?: EyeDropperOpenOptions) => Promise<EyeDropperResult>) {
    Object.defineProperty(window, "EyeDropper", { configurable: true, writable: true, value: class { open = open; } });
}
async function renderInput(showEyeDropper = true) {
    const changed = mock.fn<(value: OKLCHValue) => void>();
    const view = await render(<ColorInput value={current} format="hex" showEyeDropper={showEyeDropper} onFormatChange={() => {}} onValueChange={changed} />);
    return { ...view, changed };
}

describe("native screen color session", () => {
    it("uses real owner capability and keeps unsupported or hidden entry absent", async () => {
        delete window.EyeDropper;
        const unsupported = await renderInput();
        expect(screen.queryByRole("button", { name: "屏幕取色" })).toBeNull();
        await unsupported.unmount();
        installEyeDropper(async () => ({ sRGBHex: "#123456" }));
        await renderInput(false);
        expect(screen.queryByRole("button", { name: "屏幕取色" })).toBeNull();
    });

    it("commits accepted screen color while retaining alpha", async () => {
        const open = mock.fn<(options?: EyeDropperOpenOptions) => Promise<EyeDropperResult>>().resolve({ sRGBHex: "#123456" });
        installEyeDropper(open);
        const { changed } = await renderInput();
        await fireEvent.click(screen.getByRole("button", { name: "屏幕取色" }));
        expect(open).toHaveBeenCalledTimes(1);
        expect(changed).toHaveBeenCalledTimes(1);
        expect(changed.calls.calls[0][0].alpha).toBe(0.4);
        expect(changed.calls.calls[0][0].lightness).toBeGreaterThan(0);
    });

    it("keeps draft and value when the native session is rejected", async () => {
        installEyeDropper(async () => { throw new window.DOMException("Selection cancelled", "AbortError"); });
        const { changed } = await renderInput();
        const input = screen.getByRole("textbox");
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        if (!setter) throw new Error("Native input value setter unavailable");
        setter.call(input, "unfinished color");
        await fireEvent.input(input);
        expect((input as HTMLInputElement).value).toBe("unfinished color");
        const picker = screen.getByRole("button", { name: "屏幕取色" });
        await act(() => { input.dispatchEvent(new window.FocusEvent("focusout", { bubbles: true, relatedTarget: picker })); });
        await fireEvent.click(picker);
        expect(changed).toHaveBeenCalledTimes(0);
        expect((input as HTMLInputElement).value).toBe("unfinished color");
        expect(screen.getByRole("button", { name: "屏幕取色" }).getAttribute("aria-busy")).toBe("false");
    });

    it("aborts on unmount and never commits a late native result", async () => {
        let signal: AbortSignal | undefined;
        let finish: ((result: EyeDropperResult) => void) | undefined;
        let sessions = 0;
        installEyeDropper(options => {
            sessions += 1;
            signal = options?.signal;
            return new Promise(resolve => { finish = resolve; });
        });
        const { changed, unmount } = await renderInput();
        await fireEvent.click(screen.getByRole("button", { name: "屏幕取色" }));
        await fireEvent.click(screen.getByRole("button", { name: "屏幕取色" }));
        expect(sessions).toBe(1);
        expect(signal?.aborted).toBe(false);
        await unmount();
        expect(signal?.aborted).toBe(true);
        await act(async () => { finish?.({ sRGBHex: "#abcdef" }); });
        expect(changed).toHaveBeenCalledTimes(0);
    });

    it("delivers a late accepted selection to the current callback and alpha", async () => {
        let finish: ((result: EyeDropperResult) => void) | undefined;
        installEyeDropper(() => new Promise(resolve => { finish = resolve; }));
        const { changed, rerender } = await renderInput();
        await fireEvent.click(screen.getByRole("button", { name: "屏幕取色" }));
        const next = mock.fn<(value: OKLCHValue) => void>();
        await rerender(<ColorInput value={{ ...current, alpha: 0.7 }} format="hex" onFormatChange={() => {}} onValueChange={next} />);
        await act(async () => { finish?.({ sRGBHex: "#abcdef" }); });
        expect(changed).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next.calls.calls[0][0].alpha).toBe(0.7);
    });
});
