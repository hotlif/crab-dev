import { describe, expect, it, render } from "@crab-dev/wake/test/react";
import { ChevronRight } from "../icon.js";
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe("Icon components", () => {
    it("renders ChevronRight icon", async () => {
        const { container } = await render(<ChevronRight />);
        const svg = container.querySelector("svg");
        expect(svg).toBeTruthy();
        expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
    });
    it("renders ChevronRight icon with extra props", async () => {
        const { container } = await render(<ChevronRight data-testid="chevron"/>);
        const svg = container.querySelector("svg");
        expect(svg?.getAttribute("data-testid")).toBe("chevron");
    });
    it("renders ChevronRight as a line-style icon (fill=none)", async () => {
        const { container } = await render(<ChevronRight />);
        const svg = container.querySelector("svg");
        expect(svg?.getAttribute("fill")).toBe("none");
        expect(svg?.getAttribute("stroke")).toBe("currentColor");
    });
});
