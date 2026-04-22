import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "@jest/globals";

import Skeleton from "../skeleton.js";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

describe("Skeleton", () => {
    it("renders a single row by default", () => {
        const { container } = render(<Skeleton />);
        const group = container.firstChild as HTMLElement;
        expect(group).toBeTruthy();
        expect(group.getAttribute("aria-busy")).toBe("true");
        expect(group.querySelectorAll("span")).toHaveLength(1);
    });

    it("renders multiple text rows when rows prop is provided", () => {
        const { container } = render(<Skeleton rows={4} />);
        const rowNodes = container.querySelectorAll("span");
        expect(rowNodes).toHaveLength(4);
    });

    it("renders a rect block for variant=rect", () => {
        const { container } = render(<Skeleton variant="rect" width={200} height={80} />);
        const node = container.firstChild as HTMLElement;
        expect(node.tagName.toLowerCase()).toBe("span");
        expect(node.getAttribute("style")).toContain("--rc-skeleton-w: 200px");
        expect(node.getAttribute("style")).toContain("--rc-skeleton-h: 80px");
    });

    it("renders children when loading is false", () => {
        const { getByText, container } = render(
            <Skeleton loading={false}>
                <div>loaded</div>
            </Skeleton>,
        );
        expect(getByText("loaded")).toBeTruthy();
        expect(container.querySelector("[aria-busy]")).toBeNull();
    });

    it("passes through width as a string value", () => {
        const { container } = render(<Skeleton variant="rect" width="50%" />);
        const node = container.firstChild as HTMLElement;
        expect(node.getAttribute("style")).toContain("--rc-skeleton-w: 50%");
    });

    it("applies circle variant with aspect ratio enforcement", () => {
        const { container } = render(<Skeleton variant="circle" width={32} />);
        const node = container.firstChild as HTMLElement;
        expect(node.className).toBeTruthy();
        expect(node.getAttribute("style")).toContain("--rc-skeleton-w: 32px");
    });

    it("forwards custom className to the root element", () => {
        const { container } = render(<Skeleton variant="rect" className="my-skeleton" />);
        const node = container.firstChild as HTMLElement;
        expect(node.className).toContain("my-skeleton");
    });

    it("clamps rows to at least 1", () => {
        const { container } = render(<Skeleton rows={0} />);
        expect(container.querySelectorAll("span")).toHaveLength(1);
    });
});
