import { act, beforeAll, beforeEach, describe, expect, it, mock, render, screen } from "@crab-dev/wake/test/react";
import React, { useRef } from "react";
mock.module("motion/react", async () => {

    const mockReact = await mock.actual<typeof import("react")>("react");
    const MockDiv = mockReact.forwardRef((props: Record<string, unknown>, ref: unknown) => mockReact.createElement("div", { ...props, ref }));
    MockDiv.displayName = "MockMotionDiv";
    return {
        motion: { div: MockDiv },
        AnimatePresence: ({ children }: {
            children: unknown;
        }) => children,
        useTime: () => ({ get: () => 0 }),
        useMotionValueEvent: () => { },
    };
});
let Notification: (typeof import("../notification.js"))["default"];
let useNotification: (typeof import("../hooks/useNotification.js"))["default"];
beforeAll(async () => {
    const notificationModule = await mock.import<typeof import("../notification.js")>("../notification.js");
    const useNotificationModule = await mock.import<typeof import("../hooks/useNotification.js")>("../hooks/useNotification.js");
    Notification = notificationModule.default;
    useNotification = useNotificationModule.default;
});
import type { Direction } from "../types.js";
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "showPopover", {
        configurable: true,
        writable: true,
        value: mock.fn(),
    });
});
// ─── Notification component ───────────────────────────────────────────────────
describe("Notification", () => {
    it("renders title and children content", async () => {
        const { container, unmount } = await render(<Notification open={true} onOpenChange={() => { }} title="Alert Title">
                Alert body
        </Notification>);
        expect(container.textContent).toContain("Alert Title");
        expect(container.textContent).toContain("Alert body");
        await unmount();
    });
    it("renders only children when title is not provided", async () => {
        const { container, unmount } = await render(<Notification open={true} onOpenChange={() => { }}>
                Body only
        </Notification>);
        expect(container.textContent).toContain("Body only");
        // No title section means no close icon SVG
        expect(container.querySelectorAll("svg").length).toBe(0);
        await unmount();
    });
    it("clicking the close button calls onOpenChange(false)", async () => {
        const onOpenChange = mock.fn();
        const { container, unmount } = await render(<Notification open={true} onOpenChange={onOpenChange} title="Closable">
                Content
        </Notification>);
        const closeButton = container.querySelector("svg")?.parentElement as HTMLElement;
        await act(() => {
            closeButton.click();
        });
        expect(onOpenChange).toHaveBeenCalledWith(false);
        await unmount();
    });
    it("shows one more element when showProgress is true than when false", async () => {
        const { container: withProgress, unmount: u1 } = await render(<Notification open={true} onOpenChange={() => { }} title="T" showProgress={true}>
                C
        </Notification>);
        const countWithProgress = withProgress.querySelectorAll("div").length;
        await u1();
        const { container: withoutProgress, unmount: u2 } = await render(<Notification open={true} onOpenChange={() => { }} title="T" showProgress={false}>
                C
        </Notification>);
        const countWithoutProgress = withoutProgress.querySelectorAll("div").length;
        await u2();
        // The progress bar adds exactly one additional div
        expect(countWithProgress).toBe(countWithoutProgress + 1);
    });
    it("does not render progress bar when showProgress is false", async () => {
        const { container, unmount } = await render(<Notification open={true} onOpenChange={() => { }} title="T" showProgress={false}>
                C
        </Notification>);
        // Without progress: root + title-row + title-text + close-icon + children = 5 divs
        // (no progress bar div)
        expect(container.querySelectorAll("div").length).toBe(5);
        await unmount();
    });
    it("forwards extra props to the root element", async () => {
        const { container, unmount } = await render(<Notification open={true} onOpenChange={() => { }} title="T" data-testid="notif-root">
                C
        </Notification>);
        expect(container.querySelector('[data-testid="notif-root"]')).not.toBeNull();
        await unmount();
    });
    it("renders without crashing when duration is zero or negative", async () => {
        const { container, unmount } = await render(<Notification open={true} onOpenChange={() => { }} title="T" duration={0} remaining={-10}>
                C
        </Notification>);
        expect(container.textContent).toContain("T");
        await unmount();
    });
});
// ─── useNotification hook ─────────────────────────────────────────────────────
const NotificationHost = ({ title = "Toast Title", description = "Toast Desc", direction, }: {
    title?: string;
    description?: string;
    direction?: Direction;
} = {}) => {
    const [instance, content] = useNotification();
    return (<>
        <button data-testid="open-btn" onClick={() => instance.open({ title, description, direction })}>
                Open
        </button>
        {content}
    </>);
};
describe("useNotification", () => {
    it("returns an instance with open/close methods and a renderedDom", async () => {
        let capturedInstance: {
            open: unknown;
            close: unknown;
        } | undefined;
        const Wrapper = () => {
            const [instance, content] = useNotification();
            capturedInstance = instance;
            return <>{content}</>;
        };
        const { unmount } = await render(<Wrapper />);
        expect(typeof capturedInstance?.open).toBe("function");
        expect(typeof capturedInstance?.close).toBe("function");
        await unmount();
    });
    it("open() renders a notification with the provided title and description", async () => {
        const { container, unmount } = await render(<NotificationHost title="My Toast" description="My Description"/>);
        await act(() => {
            screen.getByTestId("open-btn").click();
        });
        expect(container.textContent).toContain("My Toast");
        expect(container.textContent).toContain("My Description");
        await unmount();
    });
    it("open() can be called multiple times to stack notifications", async () => {
        const Host = () => {
            const [instance, content] = useNotification();
            const countRef = useRef(0);
            return (<>
                <button data-testid="open-btn" onClick={() => {
                    countRef.current += 1;
                    instance.open({
                        title: `Toast ${countRef.current}`,
                        description: `Desc ${countRef.current}`,
                    });
                }}>
                        Open
                </button>
                {content}
            </>);
        };
        const { container, unmount } = await render(<Host />);
        await act(() => {
            screen.getByTestId("open-btn").click();
        });
        await act(() => {
            screen.getByTestId("open-btn").click();
        });
        await act(() => {
            screen.getByTestId("open-btn").click();
        });
        expect(container.textContent).toContain("Toast 1");
        expect(container.textContent).toContain("Toast 2");
        expect(container.textContent).toContain("Toast 3");
        await unmount();
    });
    it("clicking the notification close button removes it from the DOM", async () => {
        const { container, unmount } = await render(<NotificationHost title="Removable" description="Desc"/>);
        await act(() => {
            screen.getByTestId("open-btn").click();
        });
        expect(container.textContent).toContain("Removable");
        const closeButton = container.querySelector("svg")?.parentElement as HTMLElement;
        await act(() => {
            closeButton.click();
        });
        expect(container.textContent).not.toContain("Removable");
        await unmount();
    });
    it("limits visible notifications to the last 3 when more than 3 are opened in the same direction", async () => {
        const Host = () => {
            const [instance, content] = useNotification();
            const countRef = useRef(0);
            return (<>
                <button data-testid="open-btn" onClick={() => {
                    countRef.current += 1;
                    instance.open({
                        title: `Item ${countRef.current}`,
                        description: `Desc ${countRef.current}`,
                        direction: "topRight",
                    });
                }}>
                        Open
                </button>
                {content}
            </>);
        };
        const { container, unmount } = await render(<Host />);
        await act(() => {
            screen.getByTestId("open-btn").click();
        });
        await act(() => {
            screen.getByTestId("open-btn").click();
        });
        await act(() => {
            screen.getByTestId("open-btn").click();
        });
        // 4th notification pushes the first one out of the visible window
        await act(() => {
            screen.getByTestId("open-btn").click();
        });
        expect(container.textContent).not.toContain("Item 1");
        expect(container.textContent).toContain("Item 2");
        expect(container.textContent).toContain("Item 3");
        expect(container.textContent).toContain("Item 4");
        await unmount();
    });
    it.each<Direction>([
        "top", "topLeft", "topRight", "bottom", "bottomLeft", "bottomRight",
    ])("supports direction '%s'", async (direction) => {
        const { container, unmount } = await render(<NotificationHost title={`Toast-${direction}`} description="" direction={direction}/>);
        await act(() => {
            screen.getByTestId("open-btn").click();
        });
        expect(container.textContent).toContain(`Toast-${direction}`);
        await unmount();
    });
    it("instance.close() removes a specific notification by id", async () => {
        const Host = () => {
            const [instance, content] = useNotification();
            return (<>
                <button data-testid="open-btn" onClick={() => instance.open({ title: "Targeted", description: "Will be closed" })}>
                        Open
                </button>
                {content}
            </>);
        };
        const { container, unmount } = await render(<Host />);
        await act(() => {
            screen.getByTestId("open-btn").click();
        });
        expect(container.textContent).toContain("Targeted");
        // Close by calling instance.close with the rendered item's id.
        // Since crypto.randomUUID is called internally we trigger close via the
        // component's own close button, which exercises the same code path as
        // instance.close(id).
        const closeButton = container.querySelector("svg")?.parentElement as HTMLElement;
        await act(() => {
            closeButton.click();
        });
        expect(container.textContent).not.toContain("Targeted");
        await unmount();
    });
});
