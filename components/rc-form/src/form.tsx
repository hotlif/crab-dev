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
import { Editor, type ItemInstance, type Result } from "./item";
import { Entity } from "./entity";
import useEntityCreateItems from "./hooks/useEntityCreateItems";
import { type Validation } from "./validations";
import { findItemByName } from "./util";

interface FormContextValue {
    items: RefObject<Set<ItemInstance<any>>>
    entity: Entity
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
     * 生成的实体信息
     */
    entity: Entity,

    /**
     * 所有的编辑器, 都可以在此地方进行加载， 用于快速初始化实体信息
     */
    editors: Record<string, ReactElement<Editor<any>>>

    /**
     * 表单校验器
     */
    validations?: Record<string, Validation>
    
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
    entity,
    editors,
    children,
    labelClassName,
    editorClassName,
    itemClassName,
    onSubmit,
    validations = {},
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


    const [itemsElement] = useEntityCreateItems(entity, editors);

    return (
        <FormContext.Provider
            value={{
                items: itemsRef,
                entity,
                labelClassName,
                editorClassName,
                itemClassName,
                validations
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

                    let isFailure = false; 

                    const results: ValidationResult = [];
                    const record: any = {}
                    const entries = itemsRef.current.values();
                    while (true) {
                        const result = entries.next();
                        if (result.done) break;
                        const validationResult = await result.value.validation();
                        if (validationResult.failureResults?.length > 0) {
                            isFailure = true;
                        }
                        const name = result.value.getName();
                        const value = result.value.getValue();

                        record[name] = value;
                        results.push({
                            name,
                            ...validationResult
                        })
                    }
                    await onSubmit?.({
                        isFailure,
                        record,
                        validationResult: results
                    })
                }}
                {...restProps}
            >
                {itemsElement}
                {children}
            </form>
        </FormContext.Provider>
    )
}

export default Form;