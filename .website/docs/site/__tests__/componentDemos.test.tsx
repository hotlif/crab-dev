import { describe, expect, it } from "@crab-dev/wake/test";
import { render, screen } from "@crab-dev/wake/test/react";
import ComponentDemo, { EmptyComponentDemos } from "../componentDemo.js";
import ComponentDemos, { type ComponentDemoRecord } from "../componentDemos.js";

const demo: ComponentDemoRecord = {
    id: "docs/demos/basic.demo.tsx",
    title: "基础用法",
    description: "基础组件演示",
    learning: {
        components: ["Button"],
        props: ["appearance", "onClick"],
        events: ["onClick"],
        hasState: true,
    },
    sourceCode: "export default function Demo() { return <button>演示</button>; }",
    previewPath: "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
    workbenchPath: "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
    density: "compact",
    layout: "grid",
    group: null,
};


describe("组件文档演示", () => {
    it("将需要独立页面的演示链接到工作台", async () => {
        const { container } = await render(<ComponentDemo demo={{
            ...demo,
            previewPath: "/components/rc-pdf-editor/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
            workbenchPath: "/components/rc-pdf-editor/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        }} />);
        const link = screen.getByRole("link", { name: "在工作台中打开（新窗口）" });
        expect(link.getAttribute("target")).toBe("_blank");
        expect(link.getAttribute("href")).toContain("/components/rc-pdf-editor/workbench/");
        expect(container.querySelector("iframe")).toBeNull();
        expect(container.querySelector("[data-federated-demo]")).toBeNull();
    });

    it("未知或无 Demo 的组件显示稳定回退", async () => {
        await render(<EmptyComponentDemos />);
        expect(screen.getByRole("status").textContent).toContain("暂无可用的组件演示");
    });

    it("按分组组织 Demo 并为宽预览输出明确布局标记", async () => {
        const groupedDemos = [
            {
                ...demo,
                group: "基础能力",
            },
            {
                ...demo,
                id: "docs/demos/wide.demo.tsx",
                title: "宽内容",
                group: "进阶能力",
                layout: "wide",
            },
        ] satisfies readonly ComponentDemoRecord[];

        await render(<ComponentDemos demos={groupedDemos} />);

        expect(screen.getByRole("heading", { name: "基础能力", level: 3 })).toBeTruthy();
        expect(screen.getByRole("heading", { name: "进阶能力", level: 3 })).toBeTruthy();
        const cards = document.querySelectorAll("[data-component-demo-id]");
        expect(cards).toHaveLength(2);
        expect(cards[0]?.getAttribute("data-demo-layout")).toBe("grid");
        expect(cards[1]?.getAttribute("data-demo-layout")).toBe("wide");
    });

    it("瀑布流保留示例顺序，宽幅示例在相邻瀑布流之间独占整行", async () => {
        const layouts = ["grid", "grid", "wide", "grid", "wide", "grid"] as const;
        const demos = layouts.map((layout, index) => ({
            ...demo,
            id: `demo-${index}`,
            title: `演示 ${index}`,
            layout,
        }));
        const { container } = await render(<ComponentDemos demos={demos} />);
        const cards = [...container.querySelectorAll("[data-component-demo-id]")];

        expect(cards.map(card => card.getAttribute("data-component-demo-id")))
            .toEqual(demos.map(item => item.id));
        for (const [index, card] of cards.entries()) {
            expect(card.closest("[data-demo-masonry]") !== null).toBe(layouts[index] === "grid");
        }
        const masonryRuns = [...container.querySelectorAll("[data-demo-masonry]")];
        expect(masonryRuns.map(run => run.querySelectorAll("[data-component-demo-id]").length))
            .toEqual([2, 1, 1]);
        expect(cards[2]?.parentElement).toBe(masonryRuns[0]?.parentElement);
        expect(cards[4]?.parentElement).toBe(masonryRuns[1]?.parentElement);
    });
});
