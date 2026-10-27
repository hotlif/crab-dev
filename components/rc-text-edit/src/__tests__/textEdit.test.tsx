import { describe, expect, it, mock } from "@crab-dev/wake/test";
import { fireEvent, render, screen, act } from "@crab-dev/wake/test/react";
import TextEdit from "../textEdit.js";
import { useState } from "react";
import ConfigProvider from "@crab-dev/rc-config-provider";
describe("TextEdit", () => {
    it("必填标记独立隐藏于无障碍树，必填本身不触发错误状态", async () => {
        await render(<TextEdit label="项目说明" required />);
        // Wake's label-name query includes aria-hidden text; exact names are verified in the browser.
        const input = screen.getByRole('textbox') as HTMLTextAreaElement;
        expect(input.required).toBe(true);
        expect(input.labels?.length).toBe(1);
        expect(input.labels?.[0].querySelector('[data-field-label-text]')?.textContent).toBe('项目说明');
        expect(input.getAttribute('aria-invalid')).toBeNull();
        expect(input.labels?.[0].querySelector('[data-required-marker]')?.getAttribute('aria-hidden')).toBe('true');
    });
    it('clears an uncontrolled value through onValueChange and updates its count', async () => {
        const changes: string[] = [];
        await render(<TextEdit aria-label='field' defaultValue='hello' showCount allowClear onValueChange={value => changes.push(value)} />);
        await fireEvent.click(screen.getByLabelText('清除'));
        expect((screen.getByLabelText('field') as HTMLTextAreaElement).value).toBe('');
        expect(changes).toEqual(['']);
        expect(screen.getByText('0')).toBeTruthy();
        expect(screen.queryByLabelText('清除')).toBeNull();
    });
    it('restores the controlled value when a parent rejects clear', async () => {
        const changes: string[] = [];
        await render(<TextEdit aria-label='field' value='keep' allowClear onValueChange={value => changes.push(value)} />);
        await fireEvent.click(screen.getByLabelText('清除'));
        expect(changes).toEqual(['']);
        expect((screen.getByLabelText('field') as HTMLTextAreaElement).value).toBe('keep');
    });
    it("受控清除后仍可在文本域继续输入", async () => {
        function Editor() {
            const [value, setValue] = useState("第一行\n第二行");
            return <TextEdit aria-label="备注" value={value} allowClear onValueChange={setValue} />;
        }
        await render(<Editor />);
        const clear = screen.getByLabelText("清除");
        clear.focus();
        await fireEvent.click(clear);
        const textarea = screen.getByLabelText("备注") as HTMLTextAreaElement;
        expect(textarea.value).toBe("");
        expect(document.activeElement).toBe(textarea);
        expect(screen.queryByLabelText("清除")).toBeNull();
    });
    it("错误默认具有无效语义，显式语义优先", async () => {
        await render(<><TextEdit status="error" aria-label="错误" /><TextEdit status="warning" aria-label="提醒" /><TextEdit status="error" aria-invalid={false} aria-label="显式" /></>);
        expect(screen.getByLabelText("错误").getAttribute("aria-invalid")).toBe("true");
        expect(screen.getByLabelText("提醒").hasAttribute("aria-invalid")).toBe(false);
        expect(screen.getByLabelText("显式").getAttribute("aria-invalid")).toBe("false");
    });
    it("提供标签、辅助文本和计数时建立完整字段关联", async () => {
        const { container } = await render(
            <TextEdit
                label="项目说明"
                supportingText="请说明目标和范围"
                appearance="filled"
                value="背景"
                showCount
                maxLength={100}
                onValueChange={mock.fn()}
            />
        );
        const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
        expect(container.querySelector(`label[for="${textarea.id}"]`)?.textContent).toBe("项目说明");
        const describedBy = textarea.getAttribute("aria-describedby")?.split(" ") ?? [];
        expect(describedBy).toHaveLength(2);
        expect(describedBy.map(id => document.getElementById(id)?.textContent)).toEqual([
            "请说明目标和范围",
            "2/100",
        ]);
        expect(textarea.parentElement?.getAttribute("data-appearance")).toBe("filled");
    });
    it("errorText 替换辅助文本并启用错误语义", async () => {
        const { container } = await render(<TextEdit label="备注" supportingText="最多 20 字" errorText="内容不能为空" />);
        const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
        expect(textarea.getAttribute("aria-invalid")).toBe("true");
        expect(screen.getByText("内容不能为空")).toBeTruthy();
        expect(screen.queryByText("最多 20 字")).toBeNull();
        expect(screen.getByRole("alert").textContent).toBe("内容不能为空");
    });
    it("风格切换保留同一个文本域与关联标签", async () => {
        function Editor() {
            const [design, setDesign] = useState<"md3" | "shadcn">("md3");
            return <>
                <button onClick={() => setDesign("shadcn")}>切换风格</button>
                <ConfigProvider designSystem={design}>
                    <TextEdit label="项目说明" data-testid="design-field" defaultValue="保留内容" supportingText="支持多行输入" />
                </ConfigProvider>
            </>;
        }
        const { container } = await render(<Editor />);
        const textarea = screen.getByTestId("design-field") as HTMLTextAreaElement;
        expect(container.querySelectorAll("label")).toHaveLength(1);
        const label = container.querySelector("label");
        expect(label?.htmlFor).toBe(textarea.id);
        expect(label?.parentElement).toBe(textarea.parentElement?.parentElement);
        expect(container.querySelector("fieldset")?.getAttribute("aria-hidden")).toBe("true");
        textarea.focus();
        await fireEvent.click(screen.getByText("切换风格"));
        expect(screen.getByTestId("design-field")).toBe(textarea);
        expect(document.activeElement).toBe(textarea);
        expect(textarea.value).toBe("保留内容");
        expect(textarea.closest("[data-crab-design]")?.getAttribute("data-crab-design")).toBe("shadcn");
    });
    it("无边框模式仍关联标签、说明和外部描述", async () => {
        const { container } = await render(<>
            <span id="external-description">外部说明</span>
            <TextEdit id="project-notes" label="项目备注" bordered={false} supportingText="内部说明" aria-describedby="external-description" />
        </>);
        const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
        expect(container.querySelector("label")?.htmlFor).toBe(textarea.id);
        expect(textarea.id).toBe("project-notes");
        expect(container.querySelector("fieldset")).toBeNull();
        expect(textarea.getAttribute("aria-describedby")?.split(" ").map(id => document.getElementById(id)?.textContent)).toEqual(["外部说明", "内部说明"]);
    });
    it("每个字段独立生成标签与信息区标识", async () => {
        const { container } = await render(<><TextEdit label="第一项" supportingText="第一项说明" /><TextEdit label="第二项" supportingText="第二项说明" /></>);
        const [first, second] = Array.from(container.querySelectorAll("textarea"));
        expect(first.id).not.toBe(second.id);
        expect(first.getAttribute("aria-describedby")).not.toBe(second.getAttribute("aria-describedby"));
    });
    describe("基础渲染", () => {
        it("应渲染 textarea 元素", async () => {
            await act(async () => { await render(<TextEdit />); });
            expect(document.querySelector("textarea")).toBeTruthy();
        });
        it("rows 应透传给 textarea", async () => {
            await act(async () => { await render(<TextEdit rows={5}/>); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.getAttribute("rows")).toBe("5");
        });
        it("placeholder 应透传给 textarea", async () => {
            await act(async () => { await render(<TextEdit placeholder="请输入备注"/>); });
            expect(screen.getByPlaceholderText("请输入备注")).toBeTruthy();
        });
        it("受控多行 value 应完整显示在 textarea 中", async () => {
            const multiline = "第一行\n第二行";
            await act(async () => { await render(<TextEdit value={multiline} onValueChange={mock.fn()}/>); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.value).toBe(multiline);
        });
        it("输入应触发 onChange", async () => {
            const handleChange = mock.fn();
            await act(async () => { await render(<TextEdit value="" onChange={handleChange}/>); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
            setValue?.call(textarea, "abc");
            await act(async () => { await fireEvent.input(textarea); });
            expect(handleChange).toHaveBeenCalledTimes(1);
        });
    });
    describe("bordered", () => {
        it("bordered={false} 时应仍渲染 textarea 且不报错", async () => {
            await act(async () => { await render(<TextEdit bordered={false} value="x" onValueChange={mock.fn()}/>); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.value).toBe("x");
        });
    });
    describe("disabled 状态", () => {
        it("disabled 时 textarea 应被禁用", async () => {
            await act(async () => { await render(<TextEdit disabled/>); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.disabled).toBe(true);
        });
        it("disabled 时容器应有 aria-disabled 属性", async () => {
            let container!: HTMLElement;
            await act(async () => { ({ container } = await render(<TextEdit disabled/>)); });
            expect((container.firstChild as HTMLElement).getAttribute("aria-disabled")).toBe("true");
        });
        it("非 disabled 时容器不应有 aria-disabled 属性", async () => {
            let container!: HTMLElement;
            await act(async () => { ({ container } = await render(<TextEdit />)); });
            expect((container.firstChild as HTMLElement).hasAttribute("aria-disabled")).toBe(false);
        });
    });
    describe("allowClear", () => {
        it("有值且 allowClear 时应显示清除按钮", async () => {
            await act(async () => {
                await render(<TextEdit value="hello" allowClear onClear={mock.fn()} onValueChange={mock.fn()}/>);
            });
            expect(screen.getByLabelText("清除")).toBeTruthy();
        });
        it("值为空时不应显示清除按钮", async () => {
            await act(async () => {
                await render(<TextEdit value="" allowClear onClear={mock.fn()} onValueChange={mock.fn()}/>);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });
        it("未传 allowClear 时不应显示清除按钮", async () => {
            await act(async () => {
                await render(<TextEdit value="hello" onValueChange={mock.fn()}/>);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });
        it("disabled 时不应显示清除按钮", async () => {
            await act(async () => {
                await render(<TextEdit value="hello" allowClear disabled onClear={mock.fn()} onValueChange={mock.fn()}/>);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });
        it("readOnly 时不应显示清除按钮", async () => {
            await act(async () => {
                await render(<TextEdit value="hello" allowClear readOnly onClear={mock.fn()} onValueChange={mock.fn()}/>);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });
        it("点击清除按钮应触发 onClear 回调", async () => {
            const handleClear = mock.fn();
            await act(async () => {
                await render(<TextEdit value="hello" allowClear onClear={handleClear} onValueChange={mock.fn()}/>);
            });
            await act(async () => { await fireEvent.click(screen.getByLabelText("清除")); });
            expect(handleClear).toHaveBeenCalledTimes(1);
        });
    });
    describe("showCount 字符计数", () => {
        it("showCount 有值时应显示字符数", async () => {
            await act(async () => {
                await render(<TextEdit value="hello" showCount onValueChange={mock.fn()}/>);
            });
            expect(screen.getByText("5")).toBeTruthy();
        });
        it("showCount + maxLength 应显示 count/max 格式", async () => {
            await act(async () => {
                await render(<TextEdit value="hello" showCount maxLength={100} onValueChange={mock.fn()}/>);
            });
            expect(screen.getByText("5/100")).toBeTruthy();
        });
        it("showCount 时 maxLength 应传给 textarea", async () => {
            await act(async () => {
                await render(<TextEdit value="hi" showCount maxLength={200} onValueChange={mock.fn()}/>);
            });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.maxLength).toBe(200);
        });
        it("非受控空输入显示零字符计数", async () => {
            await act(async () => {
                await render(<TextEdit showCount/>);
            });
            // 受控与非受控使用一致的计数语义
            expect(screen.getByText("0")).toBeTruthy();
        });
    });
    describe("autoSize 与 resize", () => {
        it("autoSize 与默认 resize 应产生不同的 textarea 类名", async () => {
            await act(async () => { await render(<TextEdit data-testid="auto" autoSize/>); });
            await act(async () => { await render(<TextEdit data-testid="manual"/>); });
            const autoTextarea = screen.getByTestId("auto") as HTMLTextAreaElement;
            const manualTextarea = screen.getByTestId("manual") as HTMLTextAreaElement;
            expect(autoTextarea.className).not.toBe(manualTextarea.className);
        });
    });
    describe("ref 透传", () => {
        it("ref 应指向 textarea 元素", async () => {
            let node: HTMLTextAreaElement | null = null;
            await act(async () => {
                await render(<TextEdit ref={(el) => { node = el; }}/>);
            });
            expect(node).not.toBeNull();
            expect((node as unknown as HTMLTextAreaElement).tagName).toBe("TEXTAREA");
        });
    });
});
