import { describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, render } from "@crab-dev/wake/test/react";
import { usePresence } from "../usePresence.js";

function Subject({ open, complete }: { open: boolean; complete: () => void }) {
    const presence = usePresence<HTMLDivElement>(open, complete);
    return presence.present ? <div ref={presence.ref} data-state={presence.state}>Content</div> : null;
}

describe("usePresence", () => {
    it("waits for all own CSS animations and ignores a stale exit after reopening", async () => {
        const complete = mock.fn();
        const view = await render(<Subject open complete={complete} />);
        const element = view.container.firstElementChild!;
        const first = Promise.withResolvers<void>();
        const second = Promise.withResolvers<void>();
        let finished = false;
        Object.defineProperty(element, "getAnimations", {
            value: () => finished ? [] : [{ playState: "running", finished: first.promise }, { playState: "running", finished: second.promise }],
        });
        await view.rerender(<Subject open={false} complete={complete} />);
        expect(element.getAttribute("data-state")).toBe("closed");
        await act(async () => first.resolve());
        expect(complete).not.toHaveBeenCalled();
        await view.rerender(<Subject open complete={complete} />);
        await act(async () => second.resolve());
        expect(complete).not.toHaveBeenCalled();
        expect(view.container.firstElementChild).toBe(element);
        finished = true;
        await view.rerender(<Subject open={false} complete={complete} />);
        expect(complete).toHaveBeenCalledTimes(1);
        expect(view.container.firstElementChild).toBeNull();
    });

    it("keeps content until the final transition finishes", async () => {
        const complete = mock.fn();
        const view = await render(<Subject open complete={complete} />);
        const opacity = Promise.withResolvers<void>();
        const translate = Promise.withResolvers<void>();
        Object.defineProperty(view.container.firstElementChild, "getAnimations", {
            value: () => [{ finished: opacity.promise }, { finished: translate.promise }],
        });
        await view.rerender(<Subject open={false} complete={complete} />);
        await act(async () => opacity.resolve());
        expect(complete).not.toHaveBeenCalled();
        await act(async () => translate.resolve());
        expect(complete).toHaveBeenCalledTimes(1);
        expect(view.container.firstElementChild).toBeNull();
    });

    it("settles cancelled CSS transitions and supports no-animation exits", async () => {
        const complete = mock.fn();
        const view = await render(<Subject open complete={complete} />);
        const exit = Promise.withResolvers<void>();
        Object.defineProperty(view.container.firstElementChild, "getAnimations", {
            value: () => [{ playState: "running", finished: exit.promise }],
        });
        await view.rerender(<Subject open={false} complete={complete} />);
        await act(async () => exit.reject(new Error("CSS transition cancelled")));
        expect(complete).toHaveBeenCalledTimes(1);
        await view.rerender(<Subject open complete={complete} />);
        await view.rerender(<Subject open={false} complete={complete} />);
        expect(complete).toHaveBeenCalledTimes(2);
    });

    it("does not complete after its owner unmounts", async () => {
        const complete = mock.fn();
        const view = await render(<Subject open complete={complete} />);
        const exit = Promise.withResolvers<void>();
        Object.defineProperty(view.container.firstElementChild, "getAnimations", {
            value: () => [{ playState: "running", finished: exit.promise }],
        });
        await view.rerender(<Subject open={false} complete={complete} />);
        await view.unmount();
        await act(async () => exit.resolve());
        expect(complete).not.toHaveBeenCalled();
    });
});
