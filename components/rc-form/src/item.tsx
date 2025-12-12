import {
    type ReactElement,
    type FC,
    type HTMLAttributes,
    type ReactNode,
    cloneElement,
    useState,
    useEffect,
    useId
} from "react";
import { css, cx } from "@linaria/core";

import { type FormItemEditor } from "./types";
import useFormContext from "./hooks/useFormContext";
import { MessageEnum } from "./bus";

interface FormItem extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /**
     * 是否隐藏字段 
     */
    hidden?: boolean

    /**
     * 文本的标签
     */
    label?: ReactNode

    /**
     * 字段名称
     */
    name: string

    /**
     * 是否必填
     */
    required?: boolean

    /**
     * 编辑器
     */
    children?: ReactElement<FormItemEditor>
}

const FormItem: FC<FormItem> = ({
    className,
    hidden,
    label,
    name,
    required,
    children,
    ...restProps
}) => {
    const id = useId();
    const {
        eventBus
    } = useFormContext();

    const [value, setValue] = useState<any>();

    // 渲染 label
    const renderLabelElement = () => {
        if (label == null) {
            return null;
        }
        return (
            <div
                className={css`
                `}
            >
                {label}
            </div>
        );
    }

    // 渲染编辑器
    const renderEditorElement = () => {
        if (children == null) {
            return null;
        }
        const props = children.props;
        return (
            <div
                className={css`
                    flex: 1;
                `}
            >
                {cloneElement(children, {
                    ...props,
                    value,
                    onFormItemValueChange: (newValue: any) => {
                        setValue(newValue)
                        eventBus?.dispatch({
                            type: MessageEnum.ON_ITEM_VALUE_CHANGE,
                            payload: [{
                                name,
                                value: newValue
                            }]
                        })
                    },
                })}
            </div>
        );
    }

    // 渲染校验状态
    const renderCheckStatusElement = () => {
        return (
            <div>
            </div>
        )
    }

    useEffect(() => {
        const onSendToChangeItemValue = (param: {
            name: string,
            value: any
        }) => {
            if (param.name === name) {
                setValue(param.value);
            }
        }
        const subscriber = {
            id,
            type: MessageEnum.SEND_TO_CHAGE_ITEM_VALUE,
            ring: onSendToChangeItemValue
        }
        eventBus?.subscribe(subscriber);
        return () => {
            eventBus?.subscribe(subscriber);
        }
    }, [])

    return (
        <div
            className={cx(
                css`
                    display: flex;
                `,
                className
            )}
            {...restProps}
        >
            {renderLabelElement()}
            {renderEditorElement()}
            {renderCheckStatusElement()}
        </div>
    )
}

export default FormItem;