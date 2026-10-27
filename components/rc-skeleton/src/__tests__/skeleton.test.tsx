import { describe, expect, it, render, screen } from "@crab-dev/wake/test/react";
import Skeleton from "../skeleton.js";
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe("Skeleton", () => {
    it("renders a single row by default", async () => {
        const { container } = await render(<Skeleton />);
        const group = container.firstChild as HTMLElement;
        expect(group).toBeTruthy();
        expect(group.getAttribute("aria-busy")).toBe("true");
        expect(group.querySelectorAll("span")).toHaveLength(1);
    });
    it("renders multiple text rows when rows prop is provided", async () => {
        const { container } = await render(<Skeleton rows={4}/>);
        const rowNodes = container.querySelectorAll("span");
        expect(rowNodes).toHaveLength(4);
    });
    it("renders a rect block for variant=rect", async () => {
        const { container } = await render(<Skeleton variant="rect" width={200} height={80}/>);
        const node = container.firstChild as HTMLElement;
        expect(node.tagName.toLowerCase()).toBe("span");
        expect(node.getAttribute("style")).toContain("--rc-skeleton-w: 200px");
        expect(node.getAttribute("style")).toContain("--rc-skeleton-h: 80px");
    });
    it("renders children when loading is false", async () => {
        const { container } = await render(<Skeleton loading={false}>
            <div>loaded</div>
        </Skeleton>);
        expect(screen.getByText("loaded")).toBeTruthy();
        expect(container.querySelector("[aria-busy]")).toBeNull();
    });
    it("passes through width as a string value", async () => {
        const { container } = await render(<Skeleton variant="rect" width="50%"/>);
        const node = container.firstChild as HTMLElement;
        expect(node.getAttribute("style")).toContain("--rc-skeleton-w: 50%");
    });
    for (const variant of ['circle', 'avatar'] as const) {
        it(`leaves only the omitted ${variant} axis automatic`, async () => {
            const view = await render(<Skeleton variant={variant} width={56} />);
            const node = () => view.container.firstChild as HTMLElement;
            expect(node().style.getPropertyValue('--rc-skeleton-w')).toBe('56px');
            expect(node().style.getPropertyValue('--rc-skeleton-h')).toBe('auto');
            await view.rerender(<Skeleton variant={variant} height={56} />);
            expect(node().style.getPropertyValue('--rc-skeleton-w')).toBe('auto');
            expect(node().style.getPropertyValue('--rc-skeleton-h')).toBe('56px');
            await view.rerender(<Skeleton variant={variant} width={56} height={32} />);
            expect(node().style.getPropertyValue('--rc-skeleton-w')).toBe('56px');
            expect(node().style.getPropertyValue('--rc-skeleton-h')).toBe('32px');
        });
    }
    it("forwards custom className to the root element", async () => {
        const { container } = await render(<Skeleton variant="rect" className="my-skeleton"/>);
        const node = container.firstChild as HTMLElement;
        expect(node.className).toContain("my-skeleton");
    });
    it("clamps rows to at least 1", async () => {
        const { container } = await render(<Skeleton rows={0}/>);
        expect(container.querySelectorAll("span")).toHaveLength(1);
    });
});
