import {} from "@crab-dev/wake/test";
import { describe, expect, it } from "@crab-dev/wake/test";
import { formatColor, hexToOklch, oklchToHex, oklchToRgb, parseColor, rgbToOklch, } from "../color.js";
import type { OKLCHValue } from "../../types.js";
const WHITE: OKLCHValue = { lightness: 1, chroma: 0, hue: 0 };
const BLACK: OKLCHValue = { lightness: 0, chroma: 0, hue: 0 };
describe("oklch <-> sRGB extremes", () => {
    it("maps white to #ffffff", () => {
        expect(oklchToHex(WHITE).toLowerCase()).toBe("#ffffff");
    });
    it("maps black to #000000", () => {
        expect(oklchToHex(BLACK).toLowerCase()).toBe("#000000");
    });
    it("clamps out-of-gamut without throwing", () => {
        const hex = oklchToHex({ lightness: 0.5, chroma: 0.37, hue: 145 });
        expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
    });
});
describe("hex parsing", () => {
    it("round-trips an in-gamut sRGB hex exactly", () => {
        const v = hexToOklch("#4f8cff");
        expect(v).not.toBeNull();
        expect(oklchToHex(v as OKLCHValue).toLowerCase()).toBe("#4f8cff");
    });
    it("expands 3-digit shorthand", () => {
        const v = hexToOklch("#0af");
        expect(oklchToHex(v as OKLCHValue).toLowerCase()).toBe("#00aaff");
    });
    it("parses 8-digit hex alpha", () => {
        const v = hexToOklch("#ffffff80");
        expect(v?.alpha).toBeCloseTo(128 / 255, 5);
    });
    it("leaves alpha undefined for 6-digit hex (caller decides the fallback)", () => {
        expect(hexToOklch("#ff0000")?.alpha).toBeUndefined();
    });
    it("rejects invalid input", () => {
        expect(hexToOklch("nope")).toBeNull();
        expect(hexToOklch("#12")).toBeNull();
    });
});
describe("rgb <-> oklch round trip", () => {
    it("returns integer channels back", () => {
        const v = rgbToOklch({ r: 200, g: 100, b: 50 });
        expect(oklchToRgb(v)).toMatchObject({ r: 200, g: 100, b: 50 });
    });
});
describe("formatColor", () => {
    const red = hexToOklch("#ff0000") as OKLCHValue;
    it("hex is upper-cased", () => {
        expect(formatColor(red, "hex")).toBe("#FF0000");
    });
    it("rgb without alpha", () => {
        expect(formatColor(red, "rgb")).toBe("rgb(255, 0, 0)");
    });
    it("rgba with alpha", () => {
        expect(formatColor({ ...red, alpha: 0.5 }, "rgb")).toBe("rgba(255, 0, 0, 0.5)");
    });
    it("hsl for pure red", () => {
        expect(formatColor(red, "hsl")).toBe("hsl(0, 100%, 50%)");
    });
    it("oklch keeps the channels", () => {
        expect(formatColor(WHITE, "oklch")).toBe("oklch(1 0 0)");
    });
});
describe("parseColor", () => {
    it("parses rgb() to the matching hex", () => {
        const v = parseColor("rgb(255, 0, 0)", "rgb");
        expect(oklchToHex(v as OKLCHValue).toLowerCase()).toBe("#ff0000");
    });
    it("parses hsl() back to pure red", () => {
        const v = parseColor("hsl(0, 100%, 50%)", "hsl");
        expect(oklchToHex(v as OKLCHValue).toLowerCase()).toBe("#ff0000");
    });
    it("parses oklch() with alpha", () => {
        const v = parseColor("oklch(0.7 0.1 200 / 0.4)", "oklch");
        expect(v).toMatchObject({ lightness: 0.7, chroma: 0.1, hue: 200, alpha: 0.4 });
    });
    it("returns null on garbage", () => {
        expect(parseColor("banana", "rgb")).toBeNull();
    });
    it("leaves alpha undefined when the input omits it", () => {
        expect(parseColor("rgb(255, 0, 0)", "rgb")?.alpha).toBeUndefined();
        expect(parseColor("oklch(0.7 0.1 200)", "oklch")?.alpha).toBeUndefined();
    });
    it("normalizes hsl hue outside 0-360", () => {
        const wrapped = parseColor("hsl(400, 100%, 50%)", "hsl");
        const plain = parseColor("hsl(40, 100%, 50%)", "hsl");
        expect(oklchToHex(wrapped as OKLCHValue)).toBe(oklchToHex(plain as OKLCHValue));
    });
});
