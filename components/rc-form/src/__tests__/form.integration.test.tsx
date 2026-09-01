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
const InputEditor = ({ value, onChange }: FormItemEditor<string>) => {
    return (<input data-testid="editor" value={value ?? ""} onChange={(event) => onChange?.(event.target.value)}/>);
};
const flush = async () => {
    await act(async () => {
        await Promise.resolve();
    });
};
describe("Form integration", () => {
    it("supports form instance operations and name-path validation filtering", async () => {
        let formApi!: ReturnType<typeof useForm<TestRecord>>[0];
        const Demo = () => {
            const [form] = useForm<TestRecord>();
            formApi = form;
            return (<Form form={form} defaultValue={{ user: { name: "Alice" }, age: "" }}>
                <Item name={["user", "name"]} label="姓名" required>
                    <InputEditor />
                </Item>
                <Item name="age" label="年龄" required>
                    <InputEditor />
                </Item>
            </Form>);
        };
        const { container, unmount } = await render(<Demo />);
        await flush();
        const inputs = container.querySelectorAll('input[data-testid="editor"]');
        const nameInput = inputs[0] as HTMLInputElement;
        const ageInput = inputs[1] as HTMLInputElement;
        expect(nameInput.value).toBe("Alice");
        let validateResult: unknown;
        await act(async () => {
            validateResult = await formApi.validateFields([["user", "name"]]);
        });
        expect(validateResult).toEqual({
            user: { name: "Alice" },
            age: "",
        });
        let validateError: unknown;
        await act(async () => {
            try {
                await formApi.validateFields();
            }
            catch (error) {
                validateError = error;
            }
        });
        expect(validateError).toEqual({
            user: { name: "Alice" },
            age: "",
        });
        await act(() => {
            formApi.setFieldValue(["user", "name"], "Bob");
            formApi.setFieldValue("age", "18");
        });
        await flush();
        expect(nameInput.value).toBe("Bob");
        expect(ageInput.value).toBe("18");
        expect(formApi.getFieldValue(["user", "name"])).toBe("Bob");
        expect(formApi.getFieldsValue()).toEqual({
            user: { name: "Bob" },
            age: "18",
        });
        await act(async () => {
            validateResult = await formApi.validateFields();
        });
        expect(validateResult).toEqual({
            user: { name: "Bob" },
            age: "18",
        });
        await act(async () => {
            await formApi.resetFields([["user", "name"]]);
        });
        await flush();
        expect(nameInput.value).toBe("Alice");
        expect(ageInput.value).toBe("18");
        await act(() => {
            formApi.submit();
        });
        await flush();
        await unmount();
    });
    it("supports hidden item and item without label/editor", async () => {
        const { container, unmount } = await render(<Form>
            <Item name="hidden" hidden>
                <InputEditor />
            </Item>
            <Item name="empty"/>
        </Form>);
        await flush();
        expect(container.querySelectorAll('input[data-testid="editor"]').length).toBe(0);
        await unmount();
    });
    it("covers warning/error rule branches and editor onChange path", async () => {
        let formApi!: ReturnType<typeof useForm<TestRecord>>[0];
        const warningValidator = mock.fn(async () => {
            throw new Error("warning message");
        });
        const errorValidator = mock.fn(async () => {
            throw new Error("error message");
        });
        const Demo = () => {
            const [form] = useForm<TestRecord>();
            formApi = form;
            return (<Form form={form}>
                <Item name="field" label="字段" rules={[
                    { type: RuleType.WARNING, validator: warningValidator },
                    { type: RuleType.ERROR, validator: errorValidator },
                    { type: 999 as unknown as RuleType, validator: mock.fn(async () => { }) },
                ]}>
                    <InputEditor />
                </Item>
            </Form>);
        };
        const { container, unmount } = await render(<Demo />);
        await flush();
        await act(() => {
            formApi.setFieldValue("field", "changed");
        });
        await flush();
        let error: unknown;
        await act(async () => {
            try {
                await formApi.validateFields(["field"]);
            }
            catch (e) {
                error = e;
            }
        });
        expect(error).toEqual({ field: "changed" });
        expect(warningValidator).toHaveBeenCalled();
        expect(errorValidator).not.toHaveBeenCalled();
        expect(container.textContent).toContain("warning message");
        await unmount();
    });
    it("skips rule validator when rule type is neither ERROR nor WARNING", async () => {
        let formApi!: ReturnType<typeof useForm<TestRecord>>[0];
        const skippedValidator = mock.fn(async () => {
            throw new Error("should not run");
        });
        const Demo = () => {
            const [form] = useForm<TestRecord>();
            formApi = form;
            return (<Form form={form}>
                <Item name="field" label="字段" rules={[{ type: 999 as unknown as RuleType, validator: skippedValidator }]}>
                    <InputEditor />
                </Item>
            </Form>);
        };
        const { unmount } = await render(<Demo />);
        await flush();
        await act(() => {
            formApi.setFieldValue("field", "ok");
        });
        await flush();
        let validateResult: unknown;
        await act(async () => {
            validateResult = await formApi.validateFields(["field"]);
        });
        expect(validateResult).toEqual({ field: "ok" });
        expect(skippedValidator).not.toHaveBeenCalled();
        await unmount();
    });
    it("uses JSON fallback clone path when structuredClone is unavailable", async () => {
        const originalStructuredClone = globalThis.structuredClone;
        (globalThis as unknown as {
            structuredClone?: unknown;
        }).structuredClone = undefined;
        let formApi!: ReturnType<typeof useForm<TestRecord>>[0];
        const Demo = () => {
            const [form] = useForm<TestRecord>();
            formApi = form;
            return (<Form form={form} defaultValue={{ profile: { nick: "n1" } }}>
                <Item name={["profile", "nick"]}>
                    <InputEditor />
                </Item>
            </Form>);
        };
        const { unmount } = await render(<Demo />);
        await flush();
        await act(() => {
            formApi.setFieldsValue({ profile: { nick: "n2" } });
        });
        await flush();
        expect(formApi.getFieldValue(["profile", "nick"])).toBe("n2");
        await unmount();
        (globalThis as typeof globalThis & {
            structuredClone?: typeof structuredClone;
        }).structuredClone = originalStructuredClone;
    });
    const ButtonEditor = ({ onChange }: FormItemEditor<string>) => {
        return (<button type="button" data-testid="editor-trigger" onClick={() => onChange?.("editor-change")}>
                trigger
        </button>);
    };
    it("triggers submit success/failed and requiredIndicatorRenderer", async () => {
        const onSubmitSuccess = mock.fn(async () => { });
        const onSubmitFailed = mock.fn(async () => { });
        const onFieldValueChange = mock.fn<(changed: unknown, allValues: unknown) => Promise<void>>(async () => { });
        let formApi!: ReturnType<typeof useForm<TestRecord>>[0];
        const Demo = () => {
            const [form] = useForm<TestRecord>();
            formApi = form;
            return (<Form form={form} onSubmitSuccess={onSubmitSuccess} onSubmitFailed={onSubmitFailed} onFieldValueChange={onFieldValueChange} requiredIndicatorRenderer={({ label, required }) => (<span data-testid="required-renderer">{required ? `REQ-${String(label)}` : String(label)}</span>)}>
                <Item name="name" label="姓名" required>
                    <InputEditor />
                </Item>
            </Form>);
        };
        const { container, unmount } = await render(<Demo />);
        await flush();
        const requiredRenderer = container.querySelector('[data-testid="required-renderer"]') as HTMLElement;
        const form = container.querySelector("form") as HTMLFormElement;
        expect(requiredRenderer.textContent).toBe("REQ-姓名");
        await act(() => {
            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        });
        await flush();
        expect(onSubmitFailed).toHaveBeenCalledTimes(1);
        expect(onSubmitSuccess).not.toHaveBeenCalled();
        await act(() => {
            formApi.setFieldValue("name", "Crab");
        });
        await flush();
        expect(onFieldValueChange).toHaveBeenCalled();
        await act(() => {
            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        });
        await flush();
        expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
        await unmount();
    });
    it("uses structuredClone branch when available", async () => {
        const originalStructuredClone = globalThis.structuredClone;
        const structuredCloneMock = mock.fn((value: unknown) => JSON.parse(JSON.stringify(value)));
        (globalThis as unknown as {
            structuredClone?: unknown;
        }).structuredClone = structuredCloneMock;
        let formApi!: ReturnType<typeof useForm<TestRecord>>[0];
        const Demo = () => {
            const [form] = useForm<TestRecord>();
            formApi = form;
            return (<Form form={form} defaultValue={{ profile: { nick: "s1" } }}>
                <Item name={["profile", "nick"]}>
                    <InputEditor />
                </Item>
            </Form>);
        };
        const { unmount } = await render(<Demo />);
        await flush();
        await act(() => {
            formApi.setFieldsValue({ profile: { nick: "s2" } });
        });
        await flush();
        expect(structuredCloneMock).toHaveBeenCalled();
        expect(formApi.getFieldValue(["profile", "nick"])).toBe("s2");
        await unmount();
        (globalThis as unknown as {
            structuredClone?: unknown;
        }).structuredClone = originalStructuredClone;
    });
    it("covers editor onChange path and ERROR rule state", async () => {
        let formApi!: ReturnType<typeof useForm<TestRecord>>[0];
        const errorValidator = mock.fn(async () => {
            throw new Error("error-level");
        });
        const Demo = () => {
            const [form] = useForm<TestRecord>();
            formApi = form;
            return (<Form form={form}>
                <Item name="field" label="字段" rules={[{ type: RuleType.ERROR, validator: errorValidator }]}>
                    <ButtonEditor />
                </Item>
            </Form>);
        };
        const { container, unmount } = await render(<Demo />);
        await flush();
        const trigger = container.querySelector('[data-testid="editor-trigger"]') as HTMLButtonElement;
        await act(() => {
            trigger.click();
        });
        await flush();
        expect(formApi.getFieldValue("field")).toBe("editor-change");
        let validateError: unknown;
        await act(async () => {
            try {
                await formApi.validateFields(["field"]);
            }
            catch (error) {
                validateError = error;
            }
        });
        expect(validateError).toEqual({ field: "editor-change" });
        expect(errorValidator).toHaveBeenCalled();
        expect(container.textContent).toContain("error-level");
        await unmount();
    });
    it("passes accurate changed/allValues to onFieldValueChange", async () => {
        let formApi!: ReturnType<typeof useForm<TestRecord>>[0];
        const onFieldValueChange = mock.fn<(changed: unknown, allValues: unknown) => Promise<void>>(async () => { });
        const Demo = () => {
            const [form] = useForm<TestRecord>();
            formApi = form;
            return (<Form form={form} defaultValue={{ user: { name: "Alice" }, age: "18" }} onFieldValueChange={onFieldValueChange}>
                <Item name={["user", "name"]}>
                    <InputEditor />
                </Item>
                <Item name="age">
                    <InputEditor />
                </Item>
            </Form>);
        };
        const { unmount } = await render(<Demo />);
        await flush();
        onFieldValueChange.clear();
        await act(() => {
            formApi.setFieldValue(["user", "name"], "Bob");
        });
        await flush();
        expect(onFieldValueChange).toHaveBeenCalledTimes(1);
        expect(onFieldValueChange).toHaveBeenLastCalledWith({
            name: ["user", "name"],
            value: "Bob",
        }, {
            user: { name: "Bob" },
            age: "18",
        });
        await unmount();
    });
    it("clones input object in setFieldsValue to avoid external mutation leaking", async () => {
        let formApi!: ReturnType<typeof useForm<TestRecord>>[0];
        const Demo = () => {
            const [form] = useForm<TestRecord>();
            formApi = form;
            return (<Form form={form} defaultValue={{ profile: { nick: "init" } }}>
                <Item name={["profile", "nick"]}>
                    <InputEditor />
                </Item>
            </Form>);
        };
        const { unmount } = await render(<Demo />);
        await flush();
        const payload = { profile: { nick: "safe" } };
        await act(() => {
            formApi.setFieldsValue(payload);
        });
        await flush();
        payload.profile.nick = "mutated";
        expect(formApi.getFieldValue(["profile", "nick"])).toBe("safe");
        expect(formApi.getFieldsValue()).toEqual({ profile: { nick: "safe" } });
        await unmount();
    });
});
