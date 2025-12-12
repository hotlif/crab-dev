import { css, cx } from "@linaria/core";
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
    NamePath,
    type FormInstance,
    type WrapperInstance
} from "./types";
import FormContext from "./context";
import EventBus, { MessageEnum } from "./bus";

interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
    
    /**
     * 设置 Form 实例, 以便后面调用 Form 的方法
     */
    form?: FormInstance

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
    onFieldValueChange?: () => Promise<void>
}


const Form:FC<FormProps> = ({
    className,
    form,
    requiredIndicatorRenderer,
    onFinishSuccess,
    onFinishFailed,
    onFieldValueChange,
    children,
    ...restProps
}) => {
    const id = useId();

    const formRef = useRef<HTMLFormElement>(null)
    const eventBus = useMemo(() => {
       return new EventBus();
    }, [])


    useEffect(() => {
        let formRecord: Record<string, any> = {};

        const onItemValueChange = (param: {
            name: string,
            value: any
        }) => {
            console.log(param)
        }
        const subscriber = {
            id,
            type: MessageEnum.ON_ITEM_VALUE_CHANGE,
            ring: onItemValueChange
        }
        eventBus.subscribe(subscriber)

        const formWrapper: WrapperInstance = form as any;
        if (formWrapper) {
            formWrapper.__INTERNAL__.setInstance({
                submit: () => {
                    formRef?.current?.submit();
                },
                getFieldValue: (name) => formRecord[name],
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