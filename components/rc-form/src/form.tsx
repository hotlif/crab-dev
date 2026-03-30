import { css, cx } from "@linaria/core";
import {
    useCallback,
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
} from "./types.js";
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
        <FormContext.Provider
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
                        margin-block-end: unset;
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
        </FormContext.Provider>
    )
}

export default Form;