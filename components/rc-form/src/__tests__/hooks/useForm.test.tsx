import { act, describe, expect, it, mock } from "@crab-dev/wake/test/react";
import { useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import useForm from "../../hooks/useForm.js";
import type { FormInstance, WrapperInstance } from "../../types.js";
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe("useForm", () => {
    it("delegates to injected internal form instance", async () => {
        let exposedForm: ReturnType<typeof useForm<{
            name: string;
        }>>[0] | undefined;
        const HookHarness = () => {
            const [form] = useForm<{
                name: string;
            }>();
            useEffect(() => {
                exposedForm = form;
            }, [form]);
            return null;
        };
        const container = document.createElement("div");
        document.body.appendChild(container);
        const root: Root = createRoot(container);
        await act(() => {
            root.render(<HookHarness />);
        });
        const instance: FormInstance<{
            name: string;
        }> = {
            submit: mock.fn(),
            getFieldValue: mock.fn(() => "crab"),
            getFieldsValue: mock.fn(() => ({ name: "crab" })),
            setFieldValue: mock.fn(),
            setFieldsValue: mock.fn(),
            validateFields: mock.fn(async () => ({ name: "crab" })),
            resetFields: mock.fn(async () => { }),
        };
        (exposedForm as WrapperInstance<{
            name: string;
        }> | undefined)?.__INTERNAL__.setInstance(instance);
        exposedForm?.submit();
        const fieldValue = exposedForm?.getFieldValue("name");
        exposedForm?.setFieldValue("name", "new");
        exposedForm?.setFieldsValue({ name: "all" });
        await exposedForm?.resetFields(["name"]);
        const validateResult = await exposedForm?.validateFields(["name"]);
        expect(instance.submit).toHaveBeenCalledTimes(1);
        expect(fieldValue).toBe("crab");
        expect(instance.getFieldValue).toHaveBeenCalledWith("name");
        expect(exposedForm?.getFieldsValue()).toEqual({ name: "crab" });
        expect(instance.setFieldValue).toHaveBeenCalledWith("name", "new");
        expect(instance.setFieldsValue).toHaveBeenCalledWith({ name: "all" });
        expect(instance.resetFields).toHaveBeenCalledWith(["name"]);
        expect(instance.validateFields).toHaveBeenCalledWith(["name"]);
        expect(validateResult).toEqual({ name: "crab" });
        await act(async () => {
            await root.unmount();
        });
        container.remove();
    });
});
