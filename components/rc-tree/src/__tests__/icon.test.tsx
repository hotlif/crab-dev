import { describe, expect, it, jest, beforeEach, afterEach } from "@jest/globals";
import { cleanup, render } from "@testing-library/react";
import { Loading, CaretRightFill, CaretDownFill } from "../icon.js";

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

    it("renders CaretRightFill icon", () => {
        const { container } = render(<CaretRightFill />);
        const svg = container.querySelector("svg");
        expect(svg).toBeTruthy();
        expect(svg?.getAttribute("viewBox")).toBe("0 0 16 16");
    });

    it("renders CaretRightFill icon with extra props", () => {
        const { container } = render(<CaretRightFill data-testid="right" />);
        const svg = container.querySelector("svg");
        expect(svg?.getAttribute("data-testid")).toBe("right");
    });

    it("renders CaretDownFill icon", () => {
        const { container } = render(<CaretDownFill />);
        const svg = container.querySelector("svg");
        expect(svg).toBeTruthy();
        expect(svg?.getAttribute("viewBox")).toBe("0 0 16 16");
    });

    it("renders CaretDownFill icon with extra props", () => {
        const { container } = render(<CaretDownFill data-testid="down" />);
        const svg = container.querySelector("svg");
        expect(svg?.getAttribute("data-testid")).toBe("down");
    });
});
