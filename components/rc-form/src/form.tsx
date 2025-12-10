import { css, cx } from "@linaria/core";
import {
    type FC,
    type Ref,
    useRef,
    useEffect,
    useCallback,
    createContext,
    type RefObject,
    type ReactElement,
    type FormHTMLAttributes
} from "react";
import { type ItemInstance, type Result } from "./item";
import { type Validation } from "./validations";
import { findItemByName } from "./util";

interface FormContextValue {
    items: RefObject<Set<ItemInstance<any>>>
    labelClassName?: string
    editorClassName?: string
    itemClassName?: string
    validations?: Record<string, Validation>
}


type ValidationResult = Array<{ name: string, failureResults: Result, warningResults: Result }>

interface OnSubmitParam {
    isFailure: boolean,
    record: any
    validationResult: ValidationResult
}

export const FormContext = createContext<FormContextValue | undefined>(undefined);

export interface FormInstance {
    setFieldValue: (fieldName: string, value: unknown) => void
    setFieldsValue: (data: any) => void
    submit: () => void
}

interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {

    /**
     * 表单信息
     */
    form?: Ref<FormInstance>,
    
    /**
     * 标签页的样式
     */
    labelClassName?: string

    /**
     * 编辑器的样式
     */
    editorClassName?: string

    /**
     * 表单元素容器的样式
     */
    itemClassName?: string

    /**
     * 提交表单的时候触发的事件
     */
    onSubmit?: (param: OnSubmitParam) => Promise<void>
}



const Form: FC<FormProps> = ({
    className,
    form,
    children,
    labelClassName,
    editorClassName,
    itemClassName,
    onSubmit,
    ...restProps
}) => {
    const formRef = useRef<HTMLFormElement>(null);
    const itemsRef = useRef<Set<ItemInstance<any>>>(new Set<ItemInstance<any>>());

    const getFormInstance = useCallback<() => FormInstance>(() => ({
        setFieldValue: (fieldName, value) => {
            const item = findItemByName(itemsRef.current, fieldName);
            item?.setValue(value);
        },
        setFieldsValue: (data) => {
            const keys = Object.keys(data);
            keys.forEach(element => {
                const item = findItemByName(itemsRef.current, element);
                item?.setValue(data?.[element])
            })
        },
        submit: () => {
            formRef.current?.submit();
        }
    }), [
        formRef.current
    ]);

    useEffect(() => {
        if (!form) return;
        const instance = getFormInstance();
        if (typeof form === "function" ) {
            form(instance);
            return () => { form(null) };
        }
        form.current = instance;
        return () => { form.current = null };
    }, [form, getFormInstance]);



    return (
        <FormContext.Provider
            value={{
                items: itemsRef,
                labelClassName,
                editorClassName,
                itemClassName,
            }}
        >
            <form
                className={cx(css`
                    display: grid;
                    grid-template-columns: 1fr;
                `, className)}
                ref={formRef}
                onSubmit={async (e) => {
                    e.preventDefault();
                }}
                {...restProps}
            >
                {children}
            </form>
        </FormContext.Provider>
    )
}

export default Form;