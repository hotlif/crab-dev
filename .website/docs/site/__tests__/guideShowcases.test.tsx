import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { fireEvent, render, screen, within } from "@crab-dev/wake/test/react";
import { createContext, use, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import type { CommonProps } from "@crab-dev/wake/docs";
import type { DesignSystem } from "@crab-dev/rc-token-semantic";
import { DocumentDesignContext, SiteContext } from "../siteContext.js";

type DropdownFixtureValue = import("@crab-dev/rc-dropdown-container").DropdownContextValue;
const DropdownFixtureContext = createContext<DropdownFixtureValue | null>(null);

// Floating geometry belongs to rc-dropdown-container; the demos own open state and focus return.
mock.module("@crab-dev/rc-dropdown-container", () => ({
    __esModule: true,
    default: ({ children, overlay }: { children: ReactNode; overlay: ReactNode }) => {
        const [open, setOpen] = useState(false);
        const value: DropdownFixtureValue = {
            state: { open },
            dispatch: (action) => setOpen(action.payload),
            refs: { setReference: () => {} },
        };
        return <DropdownFixtureContext value={value}>{children}{open && overlay}</DropdownFixtureContext>;
    },
    useDropdownContext: () => {
        const value = use(DropdownFixtureContext);
        if (!value) throw new Error("Dropdown fixture is missing its provider");
        return value;
    },
}));

// Select only needs the positioning seam; the fixture does not mount floating-ui.
mock.module("@crab-dev/rc-dropdown-container/internal", () => ({
    __esModule: true,
    useDropdownPositionReference: () => () => {},
}));

// The DOM environment has no layout engine; the size demo only needs measurable bounds.
mock.module("@crab-dev/rc-auto-sizer", () => ({
    __esModule: true,
    default: ({ children }: { children: (size: { width: number; height: number }) => ReactNode }) => children({ width: 640, height: 320 }),
}));

const site = {
    site: { title: "Crab UI", description: "组件文档", locale: "zh-CN", basePath: "/", homeHref: "/" },
    route: { path: "/guides/design-styles", page: null, href: (slug: string) => `/${slug}`, navigate: mock.fn(), focusContent: mock.fn() },
    theme: { theme: "system", resolved: "light", setTheme: mock.fn() },
} as unknown as CommonProps;

let DesignShowcase: ComponentType;
let SizeShowcase: ComponentType;

beforeAll(async () => {
    ({ default: DesignShowcase } = await mock.import<typeof import("../designShowcase.js")>("../designShowcase.js"));
    ({ default: SizeShowcase } = await mock.import<typeof import("../sizeShowcase.js")>("../sizeShowcase.js"));
    if (!window.matchMedia)
        Object.defineProperty(window, "matchMedia", {
            configurable: true,
            value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
        });
    // jsdom has no ResizeObserver; real floating-ui auto-update requires one.
    (globalThis as Record<string, unknown>).ResizeObserver ??= class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
    // rc-message upgrades its container with the native popover API.
    const popover = HTMLElement.prototype as unknown as Record<string, () => void>;
    popover.showPopover ??= () => {};
    popover.hidePopover ??= () => {};
    popover.togglePopover ??= () => {};
});

/** Keeps the demo on the same site-level axis the documentation site uses. */
function DesignHarness() {
    const [design, setDesign] = useState<DesignSystem>("md3");
    return <SiteContext value={site}>
        <DocumentDesignContext value={{ design, setDesign }}>
            <DesignShowcase />
        </DocumentDesignContext>
    </SiteContext>;
}

describe("设计体系演示", () => {
    it("切换体系保留选择，并给演示边界一个可访问名称", async () => {
        await render(<DesignHarness />);
        const option = screen.getByRole("checkbox", { name: "未选择" }) as HTMLInputElement;
        const text = screen.getByRole("textbox", { name: "项目名称" });
        await fireEvent.click(option.closest("label")!);
        expect(option.checked).toBe(true);
        await fireEvent.click(screen.getByRole("radio", { name: "Apple" }));
        expect(screen.getByRole("group", { name: "三种风格交互对照" }).getAttribute("data-crab-design")).toBe("apple");
        expect(screen.getByRole("checkbox", { name: "未选择" })).toBe(option);
        expect(option.checked).toBe(true);
        expect(screen.getByRole("textbox", { name: "项目名称" })).toBe(text);
    });

    it("更多操作以命名分组暴露，Escape 关闭并回到触发按钮", async () => {
        await render(<DesignHarness />);
        const trigger = screen.getByRole("button", { name: "更多操作" });
        expect(trigger.getAttribute("aria-haspopup")).toBeNull();
        await fireEvent.click(trigger);
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        const panel = screen.getByRole("group", { name: "项目更多操作" });
        expect(panel.contains(document.activeElement)).toBe(true);
        await fireEvent.keyDown(within(panel).getByRole("button", { name: "创建副本" }), { key: "Escape" });
        expect(screen.queryByRole("group", { name: "项目更多操作" })).toBeNull();
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(document.activeElement).toBe(trigger);
    });
});

describe("尺寸与密度演示", () => {
    it("尺寸和密度独立更新，固定尺寸区域保持标准档", async () => {
        await render(<SiteContext value={site}><SizeShowcase /></SiteContext>);
        const region = screen.getByRole("group", { name: "尺寸演示区域" });
        expect(region.getAttribute("data-crab-size")).toBe("medium");
        await fireEvent.click(screen.getByRole("radio", { name: "大" }));
        expect(region.getAttribute("data-crab-size")).toBe("large");
        await fireEvent.click(screen.getByRole("radio", { name: "紧凑" }));
        expect(region.getAttribute("data-crab-density")).toBe("compact");
        expect(screen.getByRole("group", { name: "固定标准尺寸区域" }).getAttribute("data-crab-size")).toBe("medium");
        expect(screen.getByLabelText("尺寸演示菜单")).toBeTruthy();
    });
});
