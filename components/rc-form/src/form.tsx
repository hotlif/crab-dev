import { css, cx } from "@linaria/core";
import {
    type FormHTMLAttributes,
    type ReactNode,
    useEffect,
    useId,
    useMemo,
    useRef,
} from "react";
import {
    NamePath,
    type FormInstance,
    type WrapperInstance
} from "./types";
import FormContext from "./context";
import EventBus, { MessageEnum } from "./bus";
import {
    setRecordValue,
    getRecordValue
} from "./util";

interface FormProps<T extends Record<string, any>> extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onSubmitCapture"> {
    
    /**
     * 设置 Form 实例, 以便后面调用 Form 的方法
     */
    form?: FormInstance<T>

    /**
     * 自定义渲染必填样式
     */
    requiredIndicatorRenderer?: (param: {
        label: ReactNode,
        required: boolean
    }) => ReactNode

    /**
     * 提交表单且数据验证成功后回调事件
     */
    onSubmitSuccess?: (record: T) => Promise<void>

    /**
     * 提交表单并且数据校验失败后的回调事件
     */
    onSubmitFailed?: (record: T) => Promise<void>

    /**
     * 字段值更新的时候触发的回调事件
     */
    onFieldValueChange?: (
        changed: { [K in keyof T]: { name: K; value: T[K] } }[keyof T],
        allValues: T
    ) => Promise<void>
}




function Form<T extends Record<string, any>>({
    className,
    form,
    requiredIndicatorRenderer,
    onSubmitSuccess,
    onSubmitFailed,
    onFieldValueChange,
    children,
    ...restProps
}: FormProps<T>) {
    const id = useId();

    const formRef = useRef<HTMLFormElement>(null)
    const formRecordRef = useRef<T>({} as T);


    const eventBus = useMemo(() => {
       return new EventBus();
    }, [])

    /**
     * 触发校验
     */
    const triggerVerification = async (fields?: string[]) => {
        let result = true;
        const subscribers = eventBus.getSubscribers();
        for (const value of subscribers.values()) {
            if (value.type === MessageEnum.TRIGGER_ITEM_VERIFICATION) {
                try {
                    await value.ring(fields);
                } catch (error) {
                    result = false;
                }
               
            }
        }
        return result;
    }

    useEffect(() => {
        const formRecord = formRecordRef.current;


        const onItemValueChange = (changed:  { [K in keyof T]: { name: K; value: T[K] } }[keyof T]) => {
            setRecordValue(formRecord, changed.name as NamePath, changed.value);
            onFieldValueChange?.(changed, formRecord)
        }

        const subscriber = {
            id,
            type: MessageEnum.ON_ITEM_VALUE_CHANGE,
            ring: onItemValueChange
        }
        eventBus.subscribe(subscriber)

        eventBus.dispatch({
            type: MessageEnum.ON_PARENT_READY,
        });

        const formWrapper: WrapperInstance<T> = form as any;
        if (formWrapper) {
            formWrapper.__INTERNAL__.setInstance({
                submit: () => {
                    formRef?.current?.requestSubmit();
                },
                getFieldValue: (name) => getRecordValue(formRecord, name),
                getFieldsValue: () => formRecord,
                setFieldValue: (name, value) => {
                    setRecordValue(formRecord, name, value)
                    eventBus.dispatch({
                        type: MessageEnum.SEND_TO_CHAGE_ITEM_VALUE,
                        payload: [{
                            name,
                            value
                        }]
                    })
                },
                setFieldsValue: (values) => {
                    formRecordRef.current = values;
                    eventBus.dispatch({
                        type: MessageEnum.SEND_TO_CHAGE_VALUES,
                        payload: [values]
                    })
                },
                validateFields: async (fields) => {
                    const result = await triggerVerification(fields);
                    if (result) {
                        return formRecord;
                    } else {
                        throw formRecord;
                    }
                },
                resetFields: () => {
                }
            })
        }

        return () => {
            eventBus.unSubscribe(subscriber);
        }
    }, [])


    return (
        <FormContext.Provider
            value={{
                eventBus: eventBus
            }}
        >
            <form
                ref={formRef}
                {...restProps}
                className={cx(
                    css`
                        display: grid;
                    `,
                    className
                )}
                onSubmit={(e) => {
                    e.preventDefault();
                    triggerVerification().then((result) => {
                        if (result === true) {
                            onSubmitSuccess?.(formRecordRef.current)
                        } else {
                            onSubmitFailed?.(formRecordRef.current)
                        }
                    })
                }}
            >
                {children}
            </form>
        </FormContext.Provider>
    )
}

export default Form;