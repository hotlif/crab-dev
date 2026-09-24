
import { useRef, useState } from "react";
import { type FormInstance, type WrapperInstance } from "../types.js";


/**
 * 获取一个 Form 对象， 用在操作 Form 表单对象
 */
function useForm<T extends object = Record<string, unknown>> (): [FormInstance<T>] {
    // 可变实例状态：挂载后的委托目标；稳定外壳不依赖 React Compiler。
    const instance = useRef<FormInstance<T>>(null);
    const [wrapperInstance] = useState<WrapperInstance<T>>(() => {
        const current = () => {
            if (!instance.current) throw new Error('Form instance is not mounted');
            return instance.current;
        };
        return {
            submit: () => current().submit(),
            getFieldValue: (name) => current().getFieldValue(name),
            getFieldsValue: () => current().getFieldsValue(),
            setFieldValue: (name, value) => current().setFieldValue(name, value),
            setFieldsValue: (values) => current().setFieldsValue(values),
            reinitialize: (values) => current().reinitialize(values),
            resetFields: (names) => current().resetFields(names),
            validateFields: (names) => current().validateFields(names),
            __INTERNAL__: {
                setInstance(newInstance) { instance.current = newInstance; },
            },
        };
    });
    return [wrapperInstance]
}

export default useForm;
