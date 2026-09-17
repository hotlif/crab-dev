import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import { useState } from "react";
import type { ReactNode } from "react";
import Button from "@crab-dev/rc-button";
import type { TutorialRecord } from "../tutorial.js";

// 源码高亮与复制由 Preview 自身负责；这里保留源码和预览的关联，避免高亮库干扰懒加载边界测试。
mock.module("@crab-dev/rc-component-preview", () => ({
    __esModule: true,
    default: ({
        children,
        sourceCode,
        codeTheme,
        title,
    }: {
        children: ReactNode;
        sourceCode: string;
        codeTheme: string;
        title: ReactNode;
    }) => (
        <article data-code-theme={codeTheme}>
            {title}
            {children}
            <pre>{sourceCode}</pre>
        </article>
    ),
}));

let Tutorial: (typeof import("../tutorial.js"))["default"];
beforeAll(async () => {
    Tutorial = (await mock.import<typeof import("../tutorial.js")>("../tutorial.js")).default;
});

function Counter() {
    const [count, setCount] = useState(0);
    return (
        <>
            <Button onClick={() => setCount((value) => value + 1)}>增加</Button>
            <output>计数 {count}</output>
        </>
    );
}

function makeTutorial(second = async () => ({ default: Counter })): TutorialRecord {
    return {
        id: "test-lesson",
        title: "测试教程",
        steps: [
            {
                id: "first",
                title: "最小用法",
                goal: "先显示",
                why: "先建立基线",
                instruction: "增加计数",
                expected: "计数变化",
                changes: ["连接事件"],
                sourceCode: "first-source",
                preview: { kind: "inline", load: async () => ({ default: Counter }) },
            },
            {
                id: "second",
                title: "增强用法",
                goal: "再连接状态",
                why: "观察数据流",
                instruction: "增加计数",
                expected: "独立状态",
                changes: ["增加受控属性"],
                sourceCode: "second-source",
                preview: { kind: "inline", load: second },
            },
        ],
    };
}

async function click(name: string) {
    await act(async () => {
        await fireEvent.click(screen.getByRole("button", { name }));
    });
}
async function show(tutorial: TutorialRecord) {
    await act(async () => {
        await render(<Tutorial tutorial={tutorial} />);
    });
}

describe("教学步骤", () => {
    it("只加载当前步骤，源码与预览同步切换，返回时恢复初值", async () => {
        const second = mock.fn(async () => ({ default: Counter }));
        await show(makeTutorial(second));
        expect(second).not.toHaveBeenCalled();
        expect(screen.getByText("first-source")).toBeTruthy();
        await click("增加");
        expect(screen.getByText("计数 1")).toBeTruthy();
        await click("下一步");
        expect(second).toHaveBeenCalledTimes(1);
        expect(screen.getByText("second-source")).toBeTruthy();
        expect(screen.getByText("计数 0")).toBeTruthy();
        await click("上一步");
        expect(screen.getByText("计数 0")).toBeTruthy();
        expect(
            screen.getByRole("button", { name: "01 · 最小用法" }).getAttribute("aria-current"),
        ).toBe("step");
    });

    it("重置只重新挂载当前示例，不跳回第一步", async () => {
        const second = mock.fn(async () => ({ default: Counter }));
        await show(makeTutorial(second));
        await click("下一步");
        await click("增加");
        await click("重置当前示例");
        expect(screen.getByText("计数 0")).toBeTruthy();
        expect(screen.getByText("second-source")).toBeTruthy();
        expect(second).toHaveBeenCalledTimes(1);
        expect(screen.getByRole("button", { name: "下一步" }).hasAttribute("disabled")).toBe(true);
    });

    it("模块失败后保留教学正文和源码，并可重新加载", async () => {
        let attempt = 0;
        const second = async () => {
            if (attempt++ === 0) throw new Error("expected chunk failure");
            return { default: Counter };
        };
        const originalError = console.error;
        const errors = mock.fn();
        console.error = errors;
        try {
            await show(makeTutorial(second));
            await click("下一步");
            expect(screen.getByText("示例暂时无法显示")).toBeTruthy();
            expect(screen.getByText("second-source")).toBeTruthy();
            await click("重新加载示例");
            expect(screen.getByText("计数 0")).toBeTruthy();
            expect(attempt).toBe(2);
        } finally {
            console.error = originalError;
        }
    });
});
