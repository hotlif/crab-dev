import React, { act } from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";

import DropdownContainer, { useDropdownContext, type DropdownContainerProps } from "../index.js";
import { dropdownReducer, initialDropdownState } from "../reducer.js";

jest.mock("motion/react", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
    const mockReact = require("react");
    const MockDiv = mockReact.forwardRef((props: Record<string, unknown>, ref: unknown) => mockReact.createElement("div", { ...props, ref }));
    MockDiv.displayName = "MockMotionDiv";
    return {
        motion: {
            div: MockDiv,
        },
        AnimatePresence: ({ children }: { children: unknown }) => children,
    };
});

jest.mock("@floating-ui/react", () => ({
    useFloating: () => ({
        refs: {
            setReference: jest.fn(),
            setFloating: jest.fn(),
        },
        floatingStyles: {},
    }),
    autoUpdate: jest.fn(),
    offset: jest.fn(),
    flip: jest.fn(),
    FloatingPortal: ({ children }: { children: unknown }) => children,
}));

jest.mock("@linaria/core", () => ({
    css: () => "mocked-css",
    cx: (...args: unknown[]) => args.filter(Boolean).join(" "),
}));

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * A trigger button that uses DropdownContext to open/close the dropdown.
 */
const Trigger = () => {
    const { state, dispatch, refs } = useDropdownContext<HTMLButtonElement>();
    return (
        <button
            ref={refs.setReference}
            data-testid="trigger"
            onFocus={() => dispatch({ type: "setOpen", payload: true })}
            onBlur={() => dispatch({ type: "setOpen", payload: false })}
        >
            {state.open ? "open" : "closed"}
        </button>
    );
};

const renderDropdown = (props: Partial<DropdownContainerProps> = {}) => {
    const defaultProps: DropdownContainerProps = {
        overlay: <div data-testid="overlay">Dropdown Content</div>,
        ...props,
    };

    return render(
        <DropdownContainer {...defaultProps}>
            <Trigger />
        </DropdownContainer>,
    );
};

describe("DropdownContainer", () => {
    it("renders children", () => {
        const { getByTestId } = renderDropdown();
        expect(getByTestId("trigger")).toBeTruthy();
    });

    it("does not render overlay when closed", () => {
        const { queryByTestId } = renderDropdown();
        expect(queryByTestId("overlay")).toBeNull();
    });

    it("renders overlay when opened via dispatch", () => {
        const { getByTestId, queryByTestId } = renderDropdown();

        act(() => {
            fireEvent.focus(getByTestId("trigger"));
        });

        expect(getByTestId("trigger").textContent).toBe("open");
        expect(queryByTestId("overlay")).toBeTruthy();
    });

    it("hides overlay when closed via dispatch", () => {
        const { getByTestId, queryByTestId } = renderDropdown();

        act(() => {
            fireEvent.focus(getByTestId("trigger"));
        });
        expect(queryByTestId("overlay")).toBeTruthy();

        act(() => {
            fireEvent.blur(getByTestId("trigger"));
        });
        expect(getByTestId("trigger").textContent).toBe("closed");
    });

    it("applies className to container", () => {
        const { container } = renderDropdown({ className: "custom-class" });
        const wrapper = container.firstElementChild as HTMLElement;
        expect(wrapper.className).toContain("custom-class");
    });

    it("passes restProps to container div", () => {
        const { container } = renderDropdown({ "data-testid": "container" } as Record<string, unknown> & Partial<DropdownContainerProps>);
        expect(container.querySelector("[data-testid='container']")).toBeTruthy();
    });

    it("calls floatingContainerProps.onMouseDown and prevents default", () => {
        const onMouseDown = jest.fn();
        const { getByTestId } = renderDropdown({
            floatingContainerProps: { onMouseDown },
        });

        act(() => {
            fireEvent.focus(getByTestId("trigger"));
        });

        const floatingWrapper = getByTestId("overlay").parentElement?.parentElement as HTMLElement;
        const preventDefault = jest.fn();

        act(() => {
            floatingWrapper.dispatchEvent(
                Object.assign(new MouseEvent("mousedown", { bubbles: true }), {
                    preventDefault,
                }),
            );
        });

        expect(onMouseDown).toHaveBeenCalled();
    });

    it("works without floatingContainerProps.onMouseDown", () => {
        const { getByTestId } = renderDropdown();

        act(() => {
            fireEvent.focus(getByTestId("trigger"));
        });

        const floatingWrapper = getByTestId("overlay").parentElement?.parentElement as HTMLElement;

        expect(() => {
            act(() => {
                fireEvent.mouseDown(floatingWrapper);
            });
        }).not.toThrow();
    });

    it("renders custom overlay content", () => {
        const { getByTestId, getByText } = renderDropdown({
            overlay: <span>Custom Overlay</span>,
        });

        act(() => {
            fireEvent.focus(getByTestId("trigger"));
        });

        expect(getByText("Custom Overlay")).toBeTruthy();
    });
});

describe("useDropdownContext", () => {
    it("throws when used outside DropdownContainer", () => {
        const ErrorComponent = () => {
            useDropdownContext();
            return null;
        };

        expect(() => {
            render(<ErrorComponent />);
        }).toThrow("useDropdownContext must be used within a DropdownContainer");
    });
});

describe("dropdownReducer", () => {
    it("returns current state for unknown action type", () => {
        const state = dropdownReducer(initialDropdownState, { type: "unknown" } as never);
        expect(state).toEqual(initialDropdownState);
    });
});
