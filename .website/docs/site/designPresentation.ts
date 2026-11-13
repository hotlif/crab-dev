import type { DesignSystem } from "@crab-dev/rc-token-semantic";

// Site-owned editorial choices. Public design names and component tokens remain
// in the registry; these sentences describe the documentation experience only.
export const designPresentation = {
    md3: {
        headline: ["清晰层次，", "让关键操作突出。"],
        introduction: "以色调表面、表达性形状和明确的操作层级组织界面。从组件用法到交互示例，学习当前设计的应用方式。",
        footer: "阅读当前设计的组件说明，体验色调表面、状态反馈和可访问交互。",
    },
    macos: {
        headline: ["专注内容，", "熟悉的桌面秩序。"],
        introduction: "紧凑的工具栏、清晰的内容面板与轻量导航层，为桌面工作建立秩序。逐个探索组件的桌面用法与操作细节。",
        footer: "围绕桌面任务阅读组件说明，在清晰内容层与轻量操作层中体验实际用法。",
    },
    shadcn: {
        headline: ["简洁结构，", "清楚表达每个任务。"],
        introduction: "以中性表面、细描边和克制的排版构建界面。从组件结构与组合示例开始，让内容和操作自然呈现。",
        footer: "通过简洁的组件说明与可运行示例，理解中性表面、边界和交互反馈。",
    },
} as const satisfies Record<DesignSystem, { headline: readonly [string, string]; introduction: string; footer: string }>;
