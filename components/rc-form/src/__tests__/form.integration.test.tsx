import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { describe, expect, it, jest } from "@jest/globals";

import Form from "../form";
import Item from "../item";
import useForm from "../hooks/useForm";
import { RuleType, type FormItemEditor } from "../types";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const InputEditor = ({ value, onChange }: FormItemEditor<string>) => {
    return (
        <input
            data-testid="editor"
            value={value ?? ""}
            onChange={(event) => onChange?.(event.target.value)}
        />
    );
};

const flush = async () => {
    await act(async () => {
        await Promise.resolve();
    });
};

describe("Form integration", () => {
    it("supports form instance operations and name-path validation filtering", async () => {
        let formApi: any;

        const Demo = () => {
            const [form] = useForm<any>();
            formApi = form;

            return (
                <Form
                    form={form}
                    defaultValue={{ user: { name: "Alice" }, age: "" }}
                >
                    <Item name={["user", "name"]} label="姓名" required>
                        <InputEditor />
                    </Item>
                    <Item name="age" label="年龄" required>
                        <InputEditor />
                    </Item>
                </Form>
            );
        };

        const container = document.createElement("div");
        document.body.appendChild(container);
        const root: Root = createRoot(container);

        act(() => {
            root.render(<Demo />);
        });

        await flush();

        const inputs = container.querySelectorAll('input[data-testid="editor"]');
        const nameInput = inputs[0] as HTMLInputElement;
        const ageInput = inputs[1] as HTMLInputElement;

        expect(nameInput.value).toBe("Alice");

        let validateResult: any;
        await act(async () => {
            validateResult = await formApi.validateFields([["user", "name"]]);
        });

        expect(validateResult).toEqual({
            user: { name: "Alice" },
            age: "",
        });

        let validateError: any;
        await act(async () => {
            try {
                await formApi.validateFields();
            } catch (error) {
                validateError = error;
            }
        });

        expect(validateError).toEqual({
            user: { name: "Alice" },
            age: "",
        });

        act(() => {
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

        act(() => {
            formApi.submit();
        });
        await flush();

        act(() => {
            root.unmount();
        });
        container.remove();
    });

    it("supports hidden item and item without label/editor", async () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        const root: Root = createRoot(container);

        act(() => {
            root.render(
                <Form>
                    <Item name="hidden" hidden>
                        <InputEditor />
                    </Item>
                    <Item name="empty" />
                </Form>
            );
        });

        await flush();

        expect(container.querySelectorAll('input[data-testid="editor"]').length).toBe(0);

        act(() => {
            root.unmount();
        });
        container.remove();
    });

    it("covers warning/error rule branches and editor onChange path", async () => {
        let formApi: any;
        const warningValidator = jest.fn(async () => {
            throw new Error("warning message");
        });
        const errorValidator = jest.fn(async () => {
            throw new Error("error message");
        });

        const Demo = () => {
            const [form] = useForm<any>();
            formApi = form;

            return (
                <Form form={form}>
                    <Item
                        name="field"
                        label="字段"
                        rules={[
                            { type: RuleType.WARNING, validator: warningValidator },
                            { type: RuleType.ERROR, validator: errorValidator },
                            { type: 999 as any, validator: jest.fn(async () => {}) },
                        ]}
                    >
                        <InputEditor />
                    </Item>
                </Form>
            );
        };

        const container = document.createElement("div");
        document.body.appendChild(container);
        const root: Root = createRoot(container);

        act(() => {
            root.render(<Demo />);
        });

        await flush();

        act(() => {
            formApi.setFieldValue("field", "changed");
        });
        await flush();

        let error: any;
        await act(async () => {
            try {
                await formApi.validateFields(["field"]);
            } catch (e) {
                error = e;
            }
        });

        expect(error).toEqual({ field: "changed" });
        expect(warningValidator).toHaveBeenCalled();
        expect(errorValidator).not.toHaveBeenCalled();
        expect(container.textContent).toContain("warning message");

        act(() => {
            root.unmount();
        });
        container.remove();
    });

    it("skips rule validator when rule type is neither ERROR nor WARNING", async () => {
        let formApi: any;
        const skippedValidator = jest.fn(async () => {
            throw new Error("should not run");
        });

        const Demo = () => {
            const [form] = useForm<any>();
            formApi = form;

            return (
                <Form form={form}>
                    <Item
                        name="field"
                        label="字段"
                        rules={[{ type: 999 as any, validator: skippedValidator }]}
                    >
                        <InputEditor />
                    </Item>
                </Form>
            );
        };

        const container = document.createElement("div");
        document.body.appendChild(container);
        const root: Root = createRoot(container);

        act(() => {
            root.render(<Demo />);
        });
        await flush();

        act(() => {
            formApi.setFieldValue("field", "ok");
        });
        await flush();

        let validateResult: any;
        await act(async () => {
            validateResult = await formApi.validateFields(["field"]);
        });

        expect(validateResult).toEqual({ field: "ok" });
        expect(skippedValidator).not.toHaveBeenCalled();

        act(() => {
            root.unmount();
        });
        container.remove();
    });

    it("uses JSON fallback clone path when structuredClone is unavailable", async () => {
        const originalStructuredClone = globalThis.structuredClone;
        (globalThis as unknown as { structuredClone?: unknown }).structuredClone = undefined;

        let formApi: any;
        const Demo = () => {
            const [form] = useForm<any>();
            formApi = form;
            return (
                <Form form={form} defaultValue={{ profile: { nick: "n1" } }}>
                    <Item name={["profile", "nick"]}>
                        <InputEditor />
                    </Item>
                </Form>
            );
        };

        const container = document.createElement("div");
        document.body.appendChild(container);
        const root: Root = createRoot(container);

        act(() => {
            root.render(<Demo />);
        });

        await flush();

        act(() => {
            formApi.setFieldsValue({ profile: { nick: "n2" } });
        });
        await flush();

        expect(formApi.getFieldValue(["profile", "nick"])).toBe("n2");

        act(() => {
            root.unmount();
        });
        container.remove();
        (globalThis as typeof globalThis & { structuredClone?: typeof structuredClone }).structuredClone = originalStructuredClone;
    });

    const ButtonEditor = ({ onChange }: FormItemEditor<string>) => {
        return (
            <button
                type="button"
                data-testid="editor-trigger"
                onClick={() => onChange?.("editor-change")}
            >
                trigger
            </button>
        );
    };

    it("triggers submit success/failed and requiredIndicatorRenderer", async () => {
        const onSubmitSuccess = jest.fn(async () => {});
        const onSubmitFailed = jest.fn(async () => {});
        const onFieldValueChange = jest.fn(async () => {});
        let formApi: any;

        const Demo = () => {
            const [form] = useForm<any>();
            formApi = form;

            return (
                <Form
                    form={form}
                    onSubmitSuccess={onSubmitSuccess}
                    onSubmitFailed={onSubmitFailed}
                    onFieldValueChange={onFieldValueChange}
                    requiredIndicatorRenderer={({ label, required }) => (
                        <span data-testid="required-renderer">{required ? `REQ-${String(label)}` : String(label)}</span>
                    )}
                >
                    <Item name="name" label="姓名" required>
                        <InputEditor />
                    </Item>
                </Form>
            );
        };

        const container = document.createElement("div");
        document.body.appendChild(container);
        const root: Root = createRoot(container);

        act(() => {
            root.render(<Demo />);
        });

        await flush();

        const requiredRenderer = container.querySelector('[data-testid="required-renderer"]') as HTMLElement;
        const form = container.querySelector("form") as HTMLFormElement;

        expect(requiredRenderer.textContent).toBe("REQ-姓名");

        act(() => {
            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        });
        await flush();

        expect(onSubmitFailed).toHaveBeenCalledTimes(1);
        expect(onSubmitSuccess).not.toHaveBeenCalled();

        act(() => {
            formApi.setFieldValue("name", "Crab");
        });
        await flush();

        expect(onFieldValueChange).toHaveBeenCalled();

        act(() => {
            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        });
        await flush();

        expect(onSubmitSuccess).toHaveBeenCalledTimes(1);

        act(() => {
            root.unmount();
        });
        container.remove();
    });

    it("uses structuredClone branch when available", async () => {
        const originalStructuredClone = globalThis.structuredClone;
        const structuredCloneMock = jest.fn((value: any) => JSON.parse(JSON.stringify(value)));
        (globalThis as unknown as { structuredClone?: unknown }).structuredClone = structuredCloneMock;

        let formApi: any;
        const Demo = () => {
            const [form] = useForm<any>();
            formApi = form;
            return (
                <Form form={form} defaultValue={{ profile: { nick: "s1" } }}>
                    <Item name={["profile", "nick"]}>
                        <InputEditor />
                    </Item>
                </Form>
            );
        };

        const container = document.createElement("div");
        document.body.appendChild(container);
        const root: Root = createRoot(container);

        act(() => {
            root.render(<Demo />);
        });
        await flush();

        act(() => {
            formApi.setFieldsValue({ profile: { nick: "s2" } });
        });
        await flush();

        expect(structuredCloneMock).toHaveBeenCalled();
        expect(formApi.getFieldValue(["profile", "nick"])).toBe("s2");

        act(() => {
            root.unmount();
        });
        container.remove();
        (globalThis as unknown as { structuredClone?: unknown }).structuredClone = originalStructuredClone;
    });

    it("covers editor onChange path and ERROR rule state", async () => {
        let formApi: any;
        const errorValidator = jest.fn(async () => {
            throw new Error("error-level");
        });

        const Demo = () => {
            const [form] = useForm<any>();
            formApi = form;

            return (
                <Form form={form}>
                    <Item
                        name="field"
                        label="字段"
                        rules={[{ type: RuleType.ERROR, validator: errorValidator }]}
                    >
                        <ButtonEditor />
                    </Item>
                </Form>
            );
        };

        const container = document.createElement("div");
        document.body.appendChild(container);
        const root: Root = createRoot(container);

        act(() => {
            root.render(<Demo />);
        });
        await flush();

        const trigger = container.querySelector('[data-testid="editor-trigger"]') as HTMLButtonElement;
        act(() => {
            trigger.click();
        });
        await flush();

        expect(formApi.getFieldValue("field")).toBe("editor-change");

        let validateError: any;
        await act(async () => {
            try {
                await formApi.validateFields(["field"]);
            } catch (error) {
                validateError = error;
            }
        });

        expect(validateError).toEqual({ field: "editor-change" });
        expect(errorValidator).toHaveBeenCalled();
        expect(container.textContent).toContain("error-level");

        act(() => {
            root.unmount();
        });
        container.remove();
    });
});
