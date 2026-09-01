import { beforeAll, describe, expect, it, mock, render, act } from "@crab-dev/wake/test/react";
import type { ComponentPropsWithRef } from "react";
import useForm from "../hooks/useForm.js";
import { RuleType, type FormItemEditor } from "../types.js";
mock.module("motion/react", async () => {
    const mockReact = await mock.actual<typeof import("react")>("react");
    const MockDiv = ({ ref, ...props }: ComponentPropsWithRef<"div">) => mockReact.createElement("div", { ...props, ref });
    return {
        motion: { div: MockDiv },
        AnimatePresence: ({ children }: { children: unknown }) => children,
    };
});
let Form: (typeof import("../form.js"))["default"];
let Item: (typeof import("../item.js"))["default"];
beforeAll(async () => {
    const formModule = await mock.import<typeof import("../form.js")>("../form.js");
    const itemModule = await mock.import<typeof import("../item.js")>("../item.js");
    Form = formModule.default;
    Item = itemModule.default;
});
type TestRecord = Record<string, unknown>;
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
// 捕获透传给编辑器的 status，以断言 FormItem 是否正确打通编辑器的即时反馈契约
const StatusEditor = ({ value, onChange, status }: FormItemEditor<string>) => (<input data-testid="editor" data-status={status ?? ""} value={value ?? ""} onChange={(event) => onChange?.(event.target.value)}/>);
const flush = async () => {
    await act(async () => {
        await Promise.resolve();
    });
};
describe("FormItem 校验信息展示", () => {
    it("required 失败：展示可点击的错误图标、role=alert 消息，并向编辑器透传 status=error", async () => {
        let formApi!: ReturnType<typeof useForm<TestRecord>>[0];
        const Demo = () => {
            const [form] = useForm<TestRecord>();
            formApi = form;
            return (<Form form={form} defaultValue={{ name: "" }}>
                <Item name="name" label="姓名" required>
                    <StatusEditor />
                </Item>
            </Form>);
        };
        const { container } = await render(<Demo />);
        await flush();
        await act(async () => {
            try {
                await formApi.validateFields();
            }
            catch {
                // 校验失败由 Item 内部展示，这里只关心 UI 呈现
            }
        });
        await flush();
        const editor = container.querySelector('[data-testid="editor"]');
        expect(editor?.getAttribute("data-status")).toBe("error");
        const alert = container.querySelector('[role="alert"]');
        expect(alert?.textContent).toContain("请输入姓名");
        const trigger = container.querySelector('button[aria-label="查看校验提示"]');
        expect(trigger).not.toBeNull();
        // 触发器通过 aria-describedby 关联到承载文案的隐藏消息元素
        expect(trigger?.getAttribute("aria-describedby")).toBe(alert?.getAttribute("id"));
    });
    it("warning 规则：向编辑器透传 status=warning，并以 role=alert 承载警告文案", async () => {
        let formApi!: ReturnType<typeof useForm<TestRecord>>[0];
        const Demo = () => {
            const [form] = useForm<TestRecord>();
            formApi = form;
            return (<Form form={form} defaultValue={{ f: "x" }}>
                <Item name="f" label="字段" rules={[{
                    type: RuleType.WARNING,
                    validator: async () => {
                        throw new Error("请注意该项存在风险");
                    }
                }]}>
                    <StatusEditor />
                </Item>
            </Form>);
        };
        const { container } = await render(<Demo />);
        await flush();
        await act(async () => {
            try {
                await formApi.validateFields(["f"]);
            }
            catch {
                // 忽略
            }
        });
        await flush();
        const editor = container.querySelector('[data-testid="editor"]');
        expect(editor?.getAttribute("data-status")).toBe("warning");
        expect(container.querySelector('[role="alert"]')?.textContent).toContain("请注意该项存在风险");
    });
    it("校验通过：不展示错误触发器，无 alert，编辑器 status 为空", async () => {
        let formApi!: ReturnType<typeof useForm<TestRecord>>[0];
        const Demo = () => {
            const [form] = useForm<TestRecord>();
            formApi = form;
            return (<Form form={form} defaultValue={{ f: "ok" }}>
                <Item name="f" label="字段" required>
                    <StatusEditor />
                </Item>
            </Form>);
        };
        const { container } = await render(<Demo />);
        await flush();
        await act(async () => {
            await formApi.validateFields(["f"]);
        });
        await flush();
        const editor = container.querySelector('[data-testid="editor"]');
        expect(editor?.getAttribute("data-status")).toBe("");
        expect(container.querySelector('button[aria-label="查看校验提示"]')).toBeNull();
        expect(container.querySelector('[role="alert"]')).toBeNull();
    });
    it("重新编辑时清除上一轮校验结果：错误触发器消失、status 归零", async () => {
        let formApi!: ReturnType<typeof useForm<TestRecord>>[0];
        const Demo = () => {
            const [form] = useForm<TestRecord>();
            formApi = form;
            return (<Form form={form} defaultValue={{ name: "" }}>
                <Item name="name" label="姓名" required>
                    <StatusEditor />
                </Item>
            </Form>);
        };
        const { container } = await render(<Demo />);
        await flush();
        await act(async () => {
            try {
                await formApi.validateFields();
            }
            catch {
                // 忽略
            }
        });
        await flush();
        expect(container.querySelector('button[aria-label="查看校验提示"]')).not.toBeNull();
        // 用户在编辑器中输入 → 触发编辑器 onChange，清除校验态
        const editor = container.querySelector('[data-testid="editor"]') as HTMLInputElement;
        await act(async () => {
            const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
            setter?.call(editor, "Ada");
            editor.dispatchEvent(new Event("input", { bubbles: true }));
        });
        await flush();
        expect(editor.getAttribute("data-status")).toBe("");
        expect(container.querySelector('button[aria-label="查看校验提示"]')).toBeNull();
        expect(container.querySelector('[role="alert"]')).toBeNull();
    });
});
