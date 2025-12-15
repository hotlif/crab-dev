import { css, cx } from "@linaria/core";
import { z } from "zod";
import {
    type FC,
    type FormHTMLAttributes,
    type ReactNode,
    useEffect,
    useId,
    useMemo,
    useRef,
} from "react";
import {
    type FormInstance,
    type WrapperInstance
} from "./types";
import FormContext from "./context";
import EventBus, { MessageEnum } from "./bus";

interface FormProps<T extends Record<string, any>> extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
    
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
    onFinishSuccess?: () => Promise<void>

    /**
     * 提交表单并且数据校验失败后的回调事件
     */
    onFinishFailed?: () => Promise<void>

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
    onFinishSuccess,
    onFinishFailed,
    onFieldValueChange,
    children,
    ...restProps
}: FormProps<T>) {
    const id = useId();

    const formRef = useRef<HTMLFormElement>(null)
    const eventBus = useMemo(() => {
       return new EventBus();
    }, [])

    /**
     * 触发校验
     */
    const triggerVerification = async (fields: string[]) => {
        const subscribers = eventBus.getSubscribers();
        for (const value of subscribers.values()) {
            if (value.type === MessageEnum.TRIGGER_ITEM_VERIFICATION) {
                await value.ring(fields);
            }
        }
    }

    useEffect(() => {
        let formRecord = {} as T;

        const onItemValueChange = (changed:  { [K in keyof T]: { name: K; value: T[K] } }[keyof T]) => {
            formRecord[changed.name] = changed.value;
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
                    formRef?.current?.submit();
                },
                getFieldValue: (name) => formRecord?.[name],
                getFieldsValue: () => formRecord,
                setFieldValue: (name, value) => {
                    formRecord[name] = value;
                    eventBus.dispatch({
                        type: MessageEnum.SEND_TO_CHAGE_ITEM_VALUE,
                        payload: [{
                            name,
                            value
                        }]
                    })
                },
                setFieldsValue: (values) => {
                    formRecord = values;
                    const keys = Object.keys(formRecord);
                    keys.forEach(element => {
                        eventBus.dispatch({
                            type: MessageEnum.SEND_TO_CHAGE_ITEM_VALUE,
                            payload: [{
                                name: element,
                                value: formRecord[element]
                            }]
                        })
                    })
                },
                validateFields: async (fields) => {
                    if (fields) {
                        await triggerVerification(fields)
                    } else {
                        // Object.keys()
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
                    e.preventDefault()
                }}
            >
                {children}
            </form>
        </FormContext.Provider>
    )
}

export default Form;