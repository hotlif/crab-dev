import { describe, expect, it, afterEach } from "@jest/globals";
import { cleanup, render } from "@testing-library/react";
import { Loading, ChevronRight } from "../icon.js";

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("Icon components", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders Loading icon", () => {
        const { container } = render(<Loading />);
        const svg = container.querySelector("svg");
        expect(svg).toBeTruthy();
        expect(svg?.querySelector("path")).toBeTruthy();
    });

    it("renders Loading icon with extra props", () => {
        const { container } = render(<Loading data-testid="loading" className="custom" />);
        const svg = container.querySelector("svg");
        expect(svg?.getAttribute("data-testid")).toBe("loading");
        expect(svg?.getAttribute("class")).toBe("custom");
    });

    it("renders ChevronRight icon", () => {
        const { container } = render(<ChevronRight />);
        const svg = container.querySelector("svg");
        expect(svg).toBeTruthy();
        expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
    });

    it("renders ChevronRight icon with extra props", () => {
        const { container } = render(<ChevronRight data-testid="chevron" />);
        const svg = container.querySelector("svg");
        expect(svg?.getAttribute("data-testid")).toBe("chevron");
    });

    it("renders ChevronRight as a line-style icon (fill=none)", () => {
        const { container } = render(<ChevronRight />);
        const svg = container.querySelector("svg");
        expect(svg?.getAttribute("fill")).toBe("none");
        expect(svg?.getAttribute("stroke")).toBe("currentColor");
    });
});
