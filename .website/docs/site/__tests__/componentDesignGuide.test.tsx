import { describe, expect, it } from "@crab-dev/wake/test";
import { render } from "@crab-dev/wake/test/react";
import ConfigProvider from "@crab-dev/rc-config-provider";
import ComponentDesignGuide, { DesignIntroduction, DesignExampleIntroduction } from "../componentDesignGuide.js";
import ComponentDemos from "../componentDemos.js";
import { documents, guide } from "../../_generated/rc-button.js";
import type { ComponentDemoRecord } from "../componentDemos.js";

describe("组件主题文档", () => {
    it("切换后只呈现当前主题的正文、操作指引和设计参考", async () => {
        const content = <><DesignIntroduction documents={documents} /><DesignExampleIntroduction documents={documents} />
            <ComponentDesignGuide documents={documents} guide={guide} /></>;
        const view = await render(<ConfigProvider designSystem="md3">{content}</ConfigProvider>);
        for (const designSystem of ["md3", "macos", "shadcn"] as const) {
            await view.rerender(<ConfigProvider designSystem={designSystem}>{content}</ConfigProvider>);
            expect(view.container.textContent).toContain(documents[designSystem].summary);
            expect(view.container.textContent).toContain(documents[designSystem].exampleDescription);
            for (const other of ["md3", "macos", "shadcn"] as const) if (other !== designSystem) {
                expect(view.container.textContent).not.toContain(documents[other].summary);
                expect(view.container.textContent).not.toContain(documents[other].exampleDescription);
            }
            expect([...view.container.querySelectorAll("a")].map(link => link.getAttribute("href"))).toEqual([...documents[designSystem].references]);
        }
    });

    it("主题专属示例隔离，切换首推示例仍保留共用预览实例", async () => {
        const records: ComponentDemoRecord[] = ["basic", "macos", "expressive"].map(name => ({
            id: `docs/demos/${name}.demo.tsx`, title: name, description: "测试交互示例", sourceCode: "",
            previewPath: `/components/rc-button/workbench/?__wake_demo=${name}`, workbenchPath: "/preview",
            learning: { components: [], props: [], events: [], hasState: true }, density: "compact", layout: "wide", group: null,
        }));
        const content = <ComponentDemos documents={documents} demos={records} />;
        const view = await render(<ConfigProvider designSystem="md3">{content}</ConfigProvider>);
        const basic = view.container.querySelector('[data-component-demo-id="docs/demos/basic.demo.tsx"]');
        expect(basic).toBeTruthy();
        expect(view.container.querySelector('[data-component-demo-id="docs/demos/expressive.demo.tsx"]')).toBeTruthy();
        expect(view.container.querySelector('[data-component-demo-id="docs/demos/macos.demo.tsx"]')).toBeNull();
        await view.rerender(<ConfigProvider designSystem="macos">{content}</ConfigProvider>);
        expect(view.container.querySelector('[data-component-demo-id="docs/demos/basic.demo.tsx"]')).toBe(basic);
        expect(view.container.querySelector('[data-component-demo-id="docs/demos/expressive.demo.tsx"]')).toBeNull();
        expect(view.container.querySelector('[data-component-demo-id="docs/demos/macos.demo.tsx"]')).toBeTruthy();
        await view.rerender(<ConfigProvider designSystem="shadcn">{content}</ConfigProvider>);
        expect(view.container.querySelector('[data-component-demo-id="docs/demos/basic.demo.tsx"]')).toBe(basic);
        expect(view.container.querySelector('[data-component-demo-id="docs/demos/macos.demo.tsx"]')).toBeNull();
    });
});
