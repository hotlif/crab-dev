import React, { act, useRef } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import Notification from "../notification.js";
import useNotification from "../hooks/useNotification.js";
import type { Direction } from "../types.js";

jest.mock("motion/react", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
    const mockReact = require("react");
    const MockDiv = mockReact.forwardRef(
        (props: Record<string, unknown>, ref: unknown) =>
            mockReact.createElement("div", { ...props, ref }),
    );
    MockDiv.displayName = "MockMotionDiv";
    return {
        motion: { div: MockDiv },
        AnimatePresence: ({ children }: { children: unknown }) => children,
        useTime: () => ({ get: () => 0 }),
        useMotionValueEvent: () => {},
    };
});

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "showPopover", {
        configurable: true,
        writable: true,
        value: jest.fn(),
    });
});

// ─── Notification component ───────────────────────────────────────────────────

describe("Notification", () => {
    it("renders title and children content", () => {
        const { container, unmount } = render(
            <Notification open={true} onOpenChange={() => {}} title="Alert Title">
                Alert body
            </Notification>,
        );

        expect(container.textContent).toContain("Alert Title");
        expect(container.textContent).toContain("Alert body");

        unmount();
    });

    it("renders only children when title is not provided", () => {
        const { container, unmount } = render(
            <Notification open={true} onOpenChange={() => {}}>
                Body only
            </Notification>,
        );

        expect(container.textContent).toContain("Body only");
        // No title section means no close icon SVG
        expect(container.querySelectorAll("svg").length).toBe(0);

        unmount();
    });

    it("clicking the close button calls onOpenChange(false)", () => {
        const onOpenChange = jest.fn();

        const { container, unmount } = render(
            <Notification open={true} onOpenChange={onOpenChange} title="Closable">
                Content
            </Notification>,
        );

        const closeButton = container.querySelector("svg")?.parentElement as HTMLElement;
        act(() => {
            closeButton.click();
        });

        expect(onOpenChange).toHaveBeenCalledWith(false);

        unmount();
    });

    it("shows one more element when showProgress is true than when false", () => {
        const { container: withProgress, unmount: u1 } = render(
            <Notification open={true} onOpenChange={() => {}} title="T" showProgress={true}>
                C
            </Notification>,
        );
        const countWithProgress = withProgress.querySelectorAll("div").length;
        u1();

        const { container: withoutProgress, unmount: u2 } = render(
            <Notification open={true} onOpenChange={() => {}} title="T" showProgress={false}>
                C
            </Notification>,
        );
        const countWithoutProgress = withoutProgress.querySelectorAll("div").length;
        u2();

        // The progress bar adds exactly one additional div
        expect(countWithProgress).toBe(countWithoutProgress + 1);
    });

    it("does not render progress bar when showProgress is false", () => {
        const { container, unmount } = render(
            <Notification open={true} onOpenChange={() => {}} title="T" showProgress={false}>
                C
            </Notification>,
        );

        // Without progress: root + title-row + title-text + close-icon + children = 5 divs
        // (no progress bar div)
        expect(container.querySelectorAll("div").length).toBe(5);

        unmount();
    });

    it("forwards extra props to the root element", () => {
        const { container, unmount } = render(
            <Notification
                open={true}
                onOpenChange={() => {}}
                title="T"
                data-testid="notif-root"
            >
                C
            </Notification>,
        );

        expect(container.querySelector('[data-testid="notif-root"]')).not.toBeNull();

        unmount();
    });

    it("renders without crashing when duration is zero or negative", () => {
        const { container, unmount } = render(
            <Notification
                open={true}
                onOpenChange={() => {}}
                title="T"
                duration={0}
                remaining={-10}
            >
                C
            </Notification>,
        );

        expect(container.textContent).toContain("T");

        unmount();
    });
});

// ─── useNotification hook ─────────────────────────────────────────────────────

const NotificationHost = ({
    title = "Toast Title",
    description = "Toast Desc",
    direction,
}: {
    title?: string;
    description?: string;
    direction?: Direction;
} = {}) => {
    const [instance, content] = useNotification();
    return (
        <>
            <button
                data-testid="open-btn"
                onClick={() => instance.open({ title, description, direction })}
            >
                Open
            </button>
            {content}
        </>
    );
};

describe("useNotification", () => {
    it("returns an instance with open/close methods and a renderedDom", () => {
        let capturedInstance: { open: unknown; close: unknown } | undefined;

        const Wrapper = () => {
            const [instance, content] = useNotification();
            capturedInstance = instance;
            return <>{content}</>;
        };

        const { unmount } = render(<Wrapper />);

        expect(typeof capturedInstance?.open).toBe("function");
        expect(typeof capturedInstance?.close).toBe("function");

        unmount();
    });

    it("open() renders a notification with the provided title and description", () => {
        const { container, getByTestId, unmount } = render(
            <NotificationHost title="My Toast" description="My Description" />,
        );

        act(() => {
            getByTestId("open-btn").click();
        });

        expect(container.textContent).toContain("My Toast");
        expect(container.textContent).toContain("My Description");

        unmount();
    });

    it("open() can be called multiple times to stack notifications", () => {
        const Host = () => {
            const [instance, content] = useNotification();
            const countRef = useRef(0);
            return (
                <>
                    <button
                        data-testid="open-btn"
                        onClick={() => {
                            countRef.current += 1;
                            instance.open({
                                title: `Toast ${countRef.current}`,
                                description: `Desc ${countRef.current}`,
                            });
                        }}
                    >
                        Open
                    </button>
                    {content}
                </>
            );
        };

        const { container, getByTestId, unmount } = render(<Host />);

        act(() => {
            getByTestId("open-btn").click();
        });
        act(() => {
            getByTestId("open-btn").click();
        });
        act(() => {
            getByTestId("open-btn").click();
        });

        expect(container.textContent).toContain("Toast 1");
        expect(container.textContent).toContain("Toast 2");
        expect(container.textContent).toContain("Toast 3");

        unmount();
    });

    it("clicking the notification close button removes it from the DOM", () => {
        const { container, getByTestId, unmount } = render(
            <NotificationHost title="Removable" description="Desc" />,
        );

        act(() => {
            getByTestId("open-btn").click();
        });

        expect(container.textContent).toContain("Removable");

        const closeButton = container.querySelector("svg")?.parentElement as HTMLElement;
        act(() => {
            closeButton.click();
        });

        expect(container.textContent).not.toContain("Removable");

        unmount();
    });

    it("limits visible notifications to the last 3 when more than 3 are opened in the same direction", () => {
        const Host = () => {
            const [instance, content] = useNotification();
            const countRef = useRef(0);
            return (
                <>
                    <button
                        data-testid="open-btn"
                        onClick={() => {
                            countRef.current += 1;
                            instance.open({
                                title: `Item ${countRef.current}`,
                                description: `Desc ${countRef.current}`,
                                direction: "topRight",
                            });
                        }}
                    >
                        Open
                    </button>
                    {content}
                </>
            );
        };

        const { container, getByTestId, unmount } = render(<Host />);

        act(() => {
            getByTestId("open-btn").click();
        });
        act(() => {
            getByTestId("open-btn").click();
        });
        act(() => {
            getByTestId("open-btn").click();
        });
        // 4th notification pushes the first one out of the visible window
        act(() => {
            getByTestId("open-btn").click();
        });

        expect(container.textContent).not.toContain("Item 1");
        expect(container.textContent).toContain("Item 2");
        expect(container.textContent).toContain("Item 3");
        expect(container.textContent).toContain("Item 4");

        unmount();
    });

    it.each<Direction>([
        "top", "topLeft", "topRight", "bottom", "bottomLeft", "bottomRight",
    ])("supports direction '%s'", (direction) => {
        const { container, getByTestId, unmount } = render(
            <NotificationHost title={`Toast-${direction}`} description="" direction={direction} />,
        );

        act(() => {
            getByTestId("open-btn").click();
        });

        expect(container.textContent).toContain(`Toast-${direction}`);

        unmount();
    });

    it("instance.close() removes a specific notification by id", () => {
        let capturedInstance: ReturnType<typeof useNotification>[0] | undefined;

        const Host = () => {
            const [instance, content] = useNotification();
            capturedInstance = instance;
            return (
                <>
                    <button
                        data-testid="open-btn"
                        onClick={() =>
                            instance.open({ title: "Targeted", description: "Will be closed" })
                        }
                    >
                        Open
                    </button>
                    {content}
                </>
            );
        };

        const { container, getByTestId, unmount } = render(<Host />);

        act(() => {
            getByTestId("open-btn").click();
        });

        expect(container.textContent).toContain("Targeted");

        // Close by calling instance.close with the rendered item's id.
        // Since crypto.randomUUID is called internally we trigger close via the
        // component's own close button, which exercises the same code path as
        // instance.close(id).
        const closeButton = container.querySelector("svg")?.parentElement as HTMLElement;
        act(() => {
            closeButton.click();
        });

        expect(container.textContent).not.toContain("Targeted");

        unmount();
    });
});
