
import { useRef } from "react";
import { type FormInstance, type WrapperInstance } from "../types.js";


/**
 * 获取一个 Form 对象， 用在操作 Form 表单对象
 */
function useForm<T extends object = Record<string, unknown>> (): [FormInstance<T>] {
    const instance = useRef<FormInstance<T>>(null)
    const wrapperInstance: WrapperInstance<T> = {
        submit: () => instance.current?.submit(),
        getFieldValue: (...args) => instance.current!.getFieldValue(...args),
        getFieldsValue: (...args) => instance.current!.getFieldsValue(...args),
        setFieldValue: (...args) => instance.current!.setFieldValue(...args),
        setFieldsValue: (...args) => instance.current!.setFieldsValue(...args),
        resetFields: (...args) => instance.current!.resetFields(...args),
        validateFields: (...args) => instance.current!.validateFields(...args),
        __INTERNAL__: {
            setInstance(newInstance) {
                instance.current = newInstance;
            }
        }
    }
    return [wrapperInstance]
}

export default useForm;