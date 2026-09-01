import { css, cx } from "@crab-dev/css";
import token from "./token.js";
import { useCallback, useEffect, useId, useMemo, useRef } from "react";
import type { FormHTMLAttributes, ReactNode } from "react";
import type { NamePath, FormInstance, WrapperInstance } from "./types.js";
import FormContext from "./context.js";
import EventBus, { MessageEnum } from "./bus.js";
import {
    setRecordValue,
    getRecordValue,
} from "./util.js";

export interface FormProps<T extends Record<string, unknown>> extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onSubmitCapture" | "defaultValue"> {
    
    /**
     * 设置 Form 实例, 以便后面调用 Form 的方法
     */
    form?: FormInstance<T>

    /**
     * 设置默认值
     */
    defaultValue?: T

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

function Form<T extends Record<string, unknown>>({
    className,
    form,
    defaultValue = {} as T,
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

    const cloneRecord = (value: T) => {
        if (typeof structuredClone === "function") {
            return structuredClone(value);
        }
        return JSON.parse(JSON.stringify(value)) as T;
    }

    /**
     * 触发校验
     */
    const triggerVerification = useCallback(async (fields?: NamePath[]) => {
        let result = true;
        const subscribers = eventBus.getSubscribers();
        for (const value of subscribers.values()) {
            if (value.type === MessageEnum.TRIGGER_ITEM_VERIFICATION) {
                try {
                    await value.ring(fields);
                } catch {
                    result = false;
                }
            }
        }
        return result;
    }, [eventBus])

    useEffect(() => {
        const onItemValueChange = (changed:  { [K in keyof T]: { name: K; value: T[K] } }[keyof T]) => {
            setRecordValue(formRecordRef.current, changed.name as NamePath, changed.value);
            void onFieldValueChange?.(changed, formRecordRef.current)
        }

        const subscriber = {
            id,
            type: MessageEnum.ON_ITEM_VALUE_CHANGE,
            ring: onItemValueChange
        }
        eventBus.subscribe(subscriber)

        return () => {
            eventBus.unSubscribe(subscriber);
        }
    }, [eventBus, id, onFieldValueChange])

    useEffect(() => {
        eventBus.dispatch({
            type: MessageEnum.ON_PARENT_READY,
        });

        const formWrapper = form as WrapperInstance<T> | undefined;

        const setFieldValue = (name: NamePath, value: unknown) => {
            setRecordValue(formRecordRef.current, name, value)
            eventBus.dispatch({
                type: MessageEnum.SEND_TO_CHAGE_ITEM_VALUE,
                payload: [{
                    name,
                    value
                }]
            })
        }

        const setFieldsValue = (values: T) => {
            formRecordRef.current = cloneRecord(values);
            eventBus.dispatch({
                type: MessageEnum.SEND_TO_CHAGE_VALUES,
                payload: [formRecordRef.current]
            })
        }


        const resetFields = async (names?: NamePath[]) => {
            if (names == null) {
                setFieldsValue(defaultValue);
            } else {
                names.forEach(name => {
                    const value = getRecordValue(defaultValue, name);
                    setFieldValue(name, value)
                })
            }
        }

        const validateFields = async (fields?: NamePath[]) => {
            const result = await triggerVerification(fields);
            if (result) {
                return formRecordRef.current;
            } else {
                throw formRecordRef.current;
            }
        }


        if (formWrapper) {
            formWrapper.__INTERNAL__.setInstance({
                submit: () => {
                    formRef?.current?.requestSubmit();
                },
                getFieldValue: (name) => getRecordValue(formRecordRef.current, name),
                getFieldsValue: () => formRecordRef.current,
                setFieldValue,
                setFieldsValue,
                validateFields,
                resetFields,
            })
        }
        resetFields();
    }, [defaultValue, eventBus, form, triggerVerification])


    return (
        <FormContext
            value={{
                eventBus: eventBus,
                requiredIndicatorRenderer
            }}
        >
            <form
                ref={formRef}
                {...restProps}
                className={cx(
                    css`
                        display: grid;
                        /* 标签列 auto（自动撑到最长标签）/ 编辑器列 1fr / 状态图标列 auto */
                        grid-template-columns: auto minmax(0, 1fr) auto;
                        align-items: center;
                        /* 行轨道恒为内容高度：align-content 默认 normal 在 grid 中等同 stretch，
                           当表单被放入更高的容器（如全屏 flex 布局）时会把富余高度摊到各行、
                           撑大行距，故显式 start 锁定，行距只由 row-gap 决定。 */
                        align-content: start;
                        column-gap: ${token.item.gap};
                        row-gap: ${token.row.gap};
                        margin-block-end: unset;

                        /* 非字段子节点（按钮组等）跨整行，不参与标签列对齐 */
                        & > :not([data-form-item]) {
                            grid-column: 1 / -1;
                        }
                    `,
                    className
                )}
                onSubmit={(e) => {
                    e.preventDefault();
                    triggerVerification().then((result) => {
                        if (result === true) {
                            void onSubmitSuccess?.(formRecordRef.current)
                        } else {
                            void onSubmitFailed?.(formRecordRef.current)
                        }
                    })
                }}
            >
                {children}
            </form>
        </FormContext>
    )
}

export default Form;
