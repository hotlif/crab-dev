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

import { type FormItemEditor, NamePath, Rule, RuleType, ValidateState } from "./types";
import useFormContext from "./hooks/useFormContext";
import { MessageEnum } from "./bus";
import {
    setRecordValue,
    getRecordValue,
    equalsNamePath
} from "./util";

export interface FormItem extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {

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
    name: NamePath

    /**
     * 是否必填
     */
    required?: boolean

    /**
     * 校验规则
     */
    rules?: Rule[]

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
    rules = [],
    children,
    ...restProps
}) => {
    const id = useId();
    const {
        eventBus
    } = useFormContext();

    // 实际上存储的值
    const [value, setValue] = useState<any>();
    // 校验状态
    const [validateState, setValidateState] = useState<ValidateState>(ValidateState.DEFAULT);
    // 校验消息
    const [validateMessage, setValidateMessage] = useState<string>("");

    const renderRequiredElement = () => {
        if (required) {
            return (
                <div
                    className={css`
                        color: #f85149;
                        margin-right: 4px;
                        font-family: SimSun, sans-serif;
                    `}
                >
                    *
                </div>
            )
        }
        return null;
    }

    // 渲染 label
    const renderLabelElement = () => {
        if (label == null) {
            return null;
        }
        return (
            <div
                className={css`
                    display: flex;
                    font-size: 14px;
                    box-sizing: border-box;
                    align-items: center;
                    color: rgba(0,0,0, 0.88);
                `}
            >
                {renderRequiredElement()}
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
                    validateState,
                    onChange: (newValue: any) => {
                        setValue(newValue)
                        setValidateMessage("");
                        eventBus?.dispatch({
                            type: MessageEnum.ON_ITEM_VALUE_CHANGE,
                            payload: [{
                                name,
                                value: newValue
                            }]
                        })
                    },
                })}
                <div
                    className={css`
                        color: #f85149;
                        font-size: 14px;
                    `}
                >
                    {validateMessage}
                </div>
            </div>
        );
    }

    useEffect(() => {
        const onSendToChangeItemValue = (param: {
            name: NamePath,
            value: any
        }) => {
            if (equalsNamePath(param.name, name)) {
                setValue(param.value);
                eventBus?.dispatch({
                    type: MessageEnum.ON_ITEM_VALUE_CHANGE,
                    payload: [{
                        name,
                        value: param.value
                    }]
                })
            }
        }

        const subscriber = {
            id,
            type: MessageEnum.SEND_TO_CHAGE_ITEM_VALUE,
            ring: onSendToChangeItemValue
        }
        eventBus?.subscribe(subscriber);
        const onTriggerItemVerification = async (fields: NamePath[]) => {
            if (fields != null && !fields.includes(name)) {
                return;
            }
            setValidateState(ValidateState.VALIDATING);
            if (required === true && (value == null || value === "")) {
                const message = `请输入${label?.toString()}`;
                setValidateMessage(message);
                throw new Error(message);
            }
            for (let i = 0; i < rules.length; i += 1) {
                const rule = rules[i];
                if (rule.type == RuleType.ERROR || rule.type == RuleType.WARNING) {
                    try {
                        await rule.validator()
                    } catch (error: unknown) {
                        const err = error as Error;
                        if (rule.type == RuleType.ERROR) {
                            setValidateState(ValidateState.ERROR);
                        } else {
                            setValidateState(ValidateState.WARNING);
                        }
                        setValidateMessage(err.message);
                        throw error;
                    }
                }
            }
            setValidateMessage("");
            setValidateState(ValidateState.SUCCESS);
        }
        const verificationSubscriber = {
            id,
            type: MessageEnum.TRIGGER_ITEM_VERIFICATION,
            ring: onTriggerItemVerification
        }
        eventBus?.subscribe(verificationSubscriber);

        const onParentReady = () => {
            onSendToChangeItemValue({
                name,
                value
            })
        }
        const parentReadySubscriber = {
            id,
            type: MessageEnum.ON_PARENT_READY,
            ring: onParentReady
        }
        eventBus?.subscribe(parentReadySubscriber)

        const onChangeValues = (values: any) => {
            const newValue = getRecordValue(values, name);
            setValue(newValue);
            setRecordValue(values, name, newValue)
        }

        const changeValuesSubscriber = {
            id,
            type: MessageEnum.SEND_TO_CHAGE_VALUES,
            ring: onChangeValues
        }
        eventBus?.subscribe(changeValuesSubscriber)

        return () => {
            eventBus?.unSubscribe(subscriber);
            eventBus?.unSubscribe(verificationSubscriber);
            eventBus?.unSubscribe(parentReadySubscriber);
        }
    }, [rules, value])

    if (hidden) {
        return null;
    }
    return (
        <div
            className={cx(css`
                display: flex;
                height: 56px;
                align-items: baseline; 
            `,className)}
            {...restProps}
        >
            {renderLabelElement()}
            {renderEditorElement()}
        </div>
    )
}

export default FormItem;