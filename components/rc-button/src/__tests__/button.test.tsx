import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { describe, expect, it, jest } from "@jest/globals";

import Button from "../button";
import type { ButtonProps } from "../types";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

interface RenderResult {
    container: HTMLDivElement;
    button: HTMLButtonElement;
    unmount: () => void;
}

const renderButton = (props: Partial<ButtonProps> = {}): RenderResult => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root: Root = createRoot(container);
    act(() => {
        root.render(<Button {...props}>Button Text</Button>);
    });

    const button = container.querySelector("button") as HTMLButtonElement;

    return {
        container,
        button,
        unmount: () => {
            act(() => {
                root.unmount();
            });
            container.remove();
        }
    };
};

const clickButton = (button: HTMLButtonElement) => {
    act(() => {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });
};

describe("Button", () => {
    it("renders all appearance variants without runtime error", () => {
        const appearanceList: NonNullable<ButtonProps["appearance"]>[] = ["primary", "subtle", "dashed", "text", "link"];

        appearanceList.forEach(appearance => {
            const { button, unmount } = renderButton({ appearance });
            expect(button.className.length).toBeGreaterThan(0);
            unmount();
        });
    });

    it("renders all size variants and fit-container option", () => {
        const sizeList: NonNullable<ButtonProps["size"]>[] = ["large", "middle", "small"];

        sizeList.forEach(size => {
            const { button, unmount } = renderButton({ size, shouldFitContainer: true });
            expect(button.className.length).toBeGreaterThan(0);
            unmount();
        });
    });

    it("renders children and default non-loading state", () => {
        const { button, unmount } = renderButton();

        expect(button.textContent).toContain("Button Text");
        expect(button.getAttribute("data-loading")).toBeNull();

        unmount();
    });

    it("renders loading icon when loading is true", () => {
        const { button, unmount } = renderButton({ loading: true });

        expect(button.getAttribute("data-loading")).toBe("true");
        expect(button.querySelector("svg")).toBeTruthy();

        unmount();
    });

    it("dedupes async onClick while pending", async () => {
        let resolveClick: (() => void) | undefined;
        const onClick = jest.fn(() => new Promise<void>(resolve => {
            resolveClick = resolve;
        }));

        const { button, unmount } = renderButton({ onClick: onClick as ButtonProps["onClick"] });

        clickButton(button);
        clickButton(button);

        expect(onClick).toHaveBeenCalledTimes(1);

        await act(async () => {
            resolveClick?.();
            await Promise.resolve();
        });

        clickButton(button);

        expect(onClick).toHaveBeenCalledTimes(2);

        unmount();
    });

    it("does not lock sync onClick between clicks", () => {
        const onClick = jest.fn() as ButtonProps["onClick"];

        const { button, unmount } = renderButton({ onClick });

        clickButton(button);
        clickButton(button);

        expect(onClick).toHaveBeenCalledTimes(2);

        unmount();
    });

    it("releases click lock after rejected onClick", async () => {
        const onClick = jest.fn(() => Promise.reject(new Error("failed")));

        const { button, unmount } = renderButton({ onClick });

        clickButton(button);

        await act(async () => {
            await Promise.resolve();
        });

        clickButton(button);

        expect(onClick).toHaveBeenCalledTimes(2);

        unmount();
    });

    it("dedupes async onClickCapture while pending", async () => {
        let resolveCapture: (() => void) | undefined;
        const onClickCapture = jest.fn(() => new Promise<void>(resolve => {
            resolveCapture = resolve;
        }));

        const { button, unmount } = renderButton({ onClickCapture });

        clickButton(button);
        clickButton(button);

        expect(onClickCapture).toHaveBeenCalledTimes(1);

        await act(async () => {
            resolveCapture?.();
            await Promise.resolve();
        });

        clickButton(button);

        expect(onClickCapture).toHaveBeenCalledTimes(2);

        unmount();
    });

    it("releases click lock after rejected onClickCapture", async () => {
        const onClickCapture = jest.fn(() => Promise.reject(new Error("capture failed")));

        const { button, unmount } = renderButton({ onClickCapture });

        clickButton(button);

        await act(async () => {
            await Promise.resolve();
        });

        clickButton(button);

        expect(onClickCapture).toHaveBeenCalledTimes(2);

        unmount();
    });

    it("runs sync onClickCapture and sync onClick in one click", () => {
        const onClickCapture = jest.fn();
        const onClick = jest.fn();

        const { button, unmount } = renderButton({
            onClickCapture: onClickCapture as ButtonProps["onClickCapture"],
            onClick: onClick as ButtonProps["onClick"]
        });

        clickButton(button);

        expect(onClickCapture).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledTimes(1);

        unmount();
    });

    it("forwards native button attributes", () => {
        const { button, unmount } = renderButton({
            type: "submit",
            disabled: true,
            className: "custom-btn",
            title: "submit-button"
        });

        expect(button.type).toBe("submit");
        expect(button.disabled).toBe(true);
        expect(button.className).toContain("custom-btn");
        expect(button.title).toBe("submit-button");

        unmount();
    });

    it("blocks bubble onClick while onClickCapture is pending", async () => {
        let resolveCapture: (() => void) | undefined;
        const onClickCapture = jest.fn(() => new Promise<void>(resolve => {
            resolveCapture = resolve;
        }));
        const onClick = jest.fn();

        const { button, unmount } = renderButton({
            onClickCapture: onClickCapture as ButtonProps["onClickCapture"],
            onClick: onClick as ButtonProps["onClick"]
        });

        clickButton(button);
        expect(onClickCapture).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledTimes(0);

        await act(async () => {
            resolveCapture?.();
            await Promise.resolve();
        });

        clickButton(button);
        expect(onClickCapture).toHaveBeenCalledTimes(2);
        expect(onClick).toHaveBeenCalledTimes(0);

        unmount();
    });

    it("resets lock after sync throw in onClick", () => {
        const suppressGlobalError = (event: ErrorEvent) => {
            event.preventDefault();
        };
        window.addEventListener("error", suppressGlobalError);

        const onClick = jest.fn(() => {
            throw new Error("sync click error");
        });

        const { button, unmount } = renderButton({ onClick: onClick as ButtonProps["onClick"] });

        clickButton(button);
        clickButton(button);

        expect(onClick).toHaveBeenCalledTimes(2);

        window.removeEventListener("error", suppressGlobalError);
        unmount();
    });

    it("resets lock after sync throw in onClickCapture", () => {
        const suppressGlobalError = (event: ErrorEvent) => {
            event.preventDefault();
        };
        window.addEventListener("error", suppressGlobalError);

        const onClickCapture = jest.fn(() => {
            throw new Error("sync capture error");
        });

        const { button, unmount } = renderButton({
            onClickCapture: onClickCapture as ButtonProps["onClickCapture"]
        });

        clickButton(button);
        clickButton(button);

        expect(onClickCapture).toHaveBeenCalledTimes(2);

        window.removeEventListener("error", suppressGlobalError);
        unmount();
    });
});
