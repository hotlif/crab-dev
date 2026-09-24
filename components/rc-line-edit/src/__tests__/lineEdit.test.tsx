import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { fireEvent, render, screen } from "@crab-dev/wake/test/react";
import { useState, type SVGProps } from "react";

mock.module("lucide-react", async () => {
    const mockReact = await mock.actual<typeof import("react")>("react");
    const Icon = (props: SVGProps<SVGSVGElement>) => mockReact.createElement("svg", props);
    return {
        Eye: Icon,
        EyeOff: Icon,
        X: Icon,
    };
});
let LineEdit: (typeof import("../lineEdit.js"))["default"];
beforeAll(async () => {
    const lineEditModule = await mock.import<typeof import("../lineEdit.js")>("../lineEdit.js");
    LineEdit = lineEditModule.default;
});

(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const queryActionButton = (label: string) => document.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement | null;
const getActionButton = (label: string) => {
    const button = queryActionButton(label);
    if (!button) {
        throw new Error(`Unable to find action button: ${label}`);
    }
    return button;
};
const handleInputChange = () => undefined;
function inputByLabel(text: string): HTMLInputElement {
    const label = [...document.querySelectorAll('label')].find(node => node.textContent === text);
    const input = label ? document.getElementById(label.htmlFor) : null;
    if (!(input instanceof HTMLInputElement)) throw new Error(`Missing input label: ${text}`);
    return input;
}
describe("LineEdit", () => {
    it('clears an uncontrolled value through onChange and updates its count', async () => {
        const changes: string[] = [];
        await render(<LineEdit aria-label='field' defaultValue='hello' showCount allowClear onChange={e => changes.push(e.target.value)} />);
        await fireEvent.click(getActionButton('清除'));
        expect((screen.getByLabelText('field') as HTMLInputElement).value).toBe('');
        expect(changes).toEqual(['']);
        expect(screen.getByText('0')).toBeTruthy();
        expect(queryActionButton('清除')).toBeNull();
    });
    it('restores the controlled value when a parent rejects clear', async () => {
        const changes: string[] = [];
        await render(<LineEdit aria-label='field' value='keep' allowClear onChange={e => changes.push(e.target.value)} />);
        await fireEvent.click(getActionButton('清除'));
        expect(changes).toEqual(['']);
        expect((screen.getByLabelText('field') as HTMLInputElement).value).toBe('keep');
    });
    it("浮动标签和说明使用唯一 ID，错误替换辅助说明并保留外部关联", async () => {
        const { rerender } = await render(<><p id="external">外部说明</p><LineEdit label="项目名称" supportingText="最多十字" aria-describedby="external" value="Crab" onChange={handleInputChange} maxLength={10} showCount /><LineEdit label="团队名称" /></>);
        const input = inputByLabel("项目名称") as HTMLInputElement;
        const other = inputByLabel("团队名称") as HTMLInputElement;
        expect(input.id === other.id).toBe(false);
        const descriptions = input.getAttribute("aria-describedby")!.split(" ").map(id => document.getElementById(id)?.textContent);
        expect(descriptions).toEqual(["外部说明", "最多十字", "4/10"]);
        await rerender(<LineEdit label="项目名称" supportingText="最多十字" errorText="名称已被使用，请换一个" />);
        const invalid = inputByLabel("项目名称");
        expect(invalid.getAttribute("aria-invalid")).toBe("true");
        expect(document.getElementById(invalid.getAttribute("aria-describedby")!)?.textContent).toBe("名称已被使用，请换一个");
        expect(screen.queryByText("最多十字")).toBeNull();
    });
    it("外观切换保留原生输入值，borderless 仍提供关联标签", async () => {
        const { rerender } = await render(<LineEdit appearance="filled" label="名称" defaultValue="Crab" />);
        const input = inputByLabel("名称") as HTMLInputElement;
        await fireEvent.change(input, { target: { value: "新项目" } });
        await rerender(<LineEdit appearance="outlined" label="名称" defaultValue="Crab" />);
        expect((inputByLabel("名称") as HTMLInputElement).value).toBe("新项目");
        expect(inputByLabel("名称")).toBe(input);
        await rerender(<LineEdit bordered={false} appearance="filled" label="名称" defaultValue="Crab" />);
        expect(inputByLabel("名称").parentElement?.getAttribute("data-appearance")).toBeNull();
    });
    it("禁用密码框不能通过按钮显示内容，只读框仍可查看", async () => {
        await render(<><LineEdit type="password" disabled aria-label="禁用密码" /><LineEdit type="password" readOnly aria-label="只读密码" /></>);
        const buttons = document.querySelectorAll<HTMLButtonElement>('button[aria-label="显示密码"]');
        expect(buttons[0].disabled).toBe(true);
        await fireEvent.click(buttons[0]);
        expect(screen.getByLabelText("禁用密码").getAttribute("type")).toBe("password");
        await fireEvent.click(buttons[1]);
        expect(screen.getByLabelText("只读密码").getAttribute("type")).toBe("text");
    });
    it("受控清除后焦点回到输入框，允许立即继续编辑", async () => {
        function Editor() {
            const [value, setValue] = useState("项目名称");
            return <LineEdit aria-label="项目" value={value} allowClear onChange={e => setValue(e.target.value)} />;
        }
        await render(<Editor />);
        const clear = getActionButton("清除");
        clear.focus();
        await fireEvent.click(clear);
        const input = screen.getByLabelText("项目") as HTMLInputElement;
        expect(input.value).toBe("");
        expect(document.activeElement).toBe(input);
        expect(queryActionButton("清除")).toBeNull();
    });
    it("错误状态提供无效语义，并尊重显式校验语义", async () => {
        await render(<><LineEdit status="error" aria-label="错误" /><LineEdit status="warning" aria-label="提醒" /><LineEdit status="error" aria-invalid="grammar" aria-label="显式" /></>);
        expect(screen.getByLabelText("错误").getAttribute("aria-invalid")).toBe("true");
        expect(screen.getByLabelText("提醒").hasAttribute("aria-invalid")).toBe(false);
        expect(screen.getByLabelText("显式").getAttribute("aria-invalid")).toBe("grammar");
    });
    describe("基础渲染", () => {
        it("应渲染 input 元素", async () => {
            await render(<LineEdit />);
            expect(document.querySelector("input")).toBeTruthy();
        });
        it("prefix 应渲染到 input 左侧", async () => {
            await render(<LineEdit prefix={<span data-testid="prefix-icon"/>}/>);
            expect(screen.getByTestId("prefix-icon")).toBeTruthy();
        });
        it("suffix 应渲染到 input 右侧", async () => {
            await render(<LineEdit suffix={<span data-testid="suffix-icon"/>}/>);
            expect(screen.getByTestId("suffix-icon")).toBeTruthy();
        });
    });
    describe("bordered", () => {
        it("bordered={false} 时应仍渲染 input 且不报错", async () => {
            await render(<LineEdit bordered={false} value="x" onChange={handleInputChange}/>);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.value).toBe("x");
        });
    });
    describe("disabled 状态", () => {
        it("disabled 时 input 应被禁用", async () => {
            await render(<LineEdit disabled/>);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.disabled).toBe(true);
        });
        it("disabled 时容器应有 aria-disabled 属性", async () => {
            const { container } = await render(<LineEdit disabled/>);
            expect((container.firstChild as HTMLElement).getAttribute("aria-disabled")).toBe("true");
        });
        it("非 disabled 时容器不应有 aria-disabled 属性", async () => {
            const { container } = await render(<LineEdit />);
            expect((container.firstChild as HTMLElement).hasAttribute("aria-disabled")).toBe(false);
        });
    });
    describe("allowClear", () => {
        it("有值且 allowClear 时应显示清除按钮", async () => {
            await render(<LineEdit value="hello" allowClear onChange={handleInputChange} onClear={mock.fn()}/>);
            expect(getActionButton("清除")).toBeTruthy();
        });
        it("值为空时不应显示清除按钮", async () => {
            await render(<LineEdit value="" allowClear onChange={handleInputChange} onClear={mock.fn()}/>);
            expect(queryActionButton("清除")).toBeNull();
        });
        it("未传 allowClear 时不应显示清除按钮", async () => {
            await render(<LineEdit value="hello" onChange={handleInputChange}/>);
            expect(queryActionButton("清除")).toBeNull();
        });
        it("disabled 时不应显示清除按钮", async () => {
            await render(<LineEdit value="hello" allowClear disabled onChange={handleInputChange} onClear={mock.fn()}/>);
            expect(queryActionButton("清除")).toBeNull();
        });
        it("readOnly 时不应显示清除按钮", async () => {
            await render(<LineEdit value="hello" allowClear readOnly onChange={handleInputChange} onClear={mock.fn()}/>);
            expect(queryActionButton("清除")).toBeNull();
        });
        it("点击清除按钮应触发 onClear 回调", async () => {
            const handleClear = mock.fn();
            await render(<LineEdit value="hello" allowClear onChange={handleInputChange} onClear={handleClear}/>);
            await fireEvent.click(getActionButton("清除"));
            expect(handleClear).toHaveBeenCalledTimes(1);
        });
    });
    describe("密码可见性切换", () => {
        it("type=password 时应显示密码切换按钮", async () => {
            await render(<LineEdit type="password"/>);
            expect(getActionButton("显示密码")).toBeTruthy();
        });
        it("非 password 类型时不应显示切换按钮", async () => {
            await render(<LineEdit type="text"/>);
            expect(queryActionButton("显示密码")).toBeNull();
            expect(queryActionButton("隐藏密码")).toBeNull();
        });
        it("点击切换按钮后 input type 应变为 text", async () => {
            await render(<LineEdit type="password"/>);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.type).toBe("password");
            await fireEvent.click(getActionButton("显示密码"));
            expect(input.type).toBe("text");
        });
        it("再次点击应切换回 password", async () => {
            await render(<LineEdit type="password"/>);
            const input = document.querySelector("input") as HTMLInputElement;
            await fireEvent.click(getActionButton("显示密码"));
            await fireEvent.click(getActionButton("隐藏密码"));
            expect(input.type).toBe("password");
        });
    });
    describe("showCount 字符计数", () => {
        it("showCount 有值时应显示字符数", async () => {
            await render(<LineEdit value="hello" showCount onChange={handleInputChange}/>);
            expect(screen.getByText("5")).toBeTruthy();
        });
        it("showCount + maxLength 应显示 count/max 格式", async () => {
            await render(<LineEdit value="hello" showCount maxLength={10} onChange={handleInputChange}/>);
            expect(screen.getByText("5/10")).toBeTruthy();
        });
        it("showCount 时 maxLength 应传给 input", async () => {
            await render(<LineEdit value="hi" showCount maxLength={20} onChange={handleInputChange}/>);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.maxLength).toBe(20);
        });
        it("非受控空输入显示零字符计数", async () => {
            await render(<LineEdit showCount/>);
            // 受控与非受控使用一致的计数语义
            expect(screen.getByText("0")).toBeTruthy();
        });
    });
    describe("maxLength 传递", () => {
        it("maxLength 应正确传递给 input 元素", async () => {
            await render(<LineEdit maxLength={50}/>);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.maxLength).toBe(50);
        });
    });
});
