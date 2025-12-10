import { css, cx } from "@linaria/core";
import {
    type HTMLAttributes,
    type ReactNode,
    type ReactElement,
    useState,
    cloneElement,
    useEffect,
    useId,
    useContext,
    useRef,
} from "react";

import { FormContext } from "./form";
import { getItemsToObject } from "./util";
import { type ValidationResult } from "./validations";

export enum EditorState {
    // 校验成功
    SUCCESS,
    // 失败
    FAILURE,
    // 警告
    WARNING,
    // 未校验
    NOT_VERIFIED,
    // 校验中
    VERIFYING
}

export interface Editor<T> {

    /**
     * 状态
     */
    state?: EditorState

    /**
     * 值
     */
    value?: T,

    /**
     * 改变值触发的事件
     */
    onChangeValue?: (value: T) => void,
}


export type Result = Array<{ validationName: string, validationResult: ValidationResult }>

export interface ItemInstance<T> {
    getId: () => string,
    getName: () => string,
    getValue: () => T | undefined,
    setValue: (value: T | undefined) => void
    // 触发校验
    validation: () => Promise<{
        failureResults: Result,
        warningResults: Result
    }>
}

interface ItemProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "item"> {
    // 显示的标签信息
    label?: ReactNode,
    // 字段名称
    name: string
    // 校验状态
    state?: EditorState,
    // 编辑器信息
    children: ReactElement<Editor<T>>
}

function Item<T>({
    className,
    label,
    name,
    children,
    ...restProps
}: ItemProps<T>) {
    const id = useId();
    const [value, setValue] = useState<T>();
    const [state, setState] = useState<EditorState>(EditorState.NOT_VERIFIED);
    const [verifDescription, setVerifDescription] = useState("");

    const context = useContext(FormContext)
    const validation = async () => {
        setState(EditorState.VERIFYING);
        const data = getItemsToObject(context!.items.current);
        const entity = context!.entity.fields.find(element => element.name === name);
        const failureResults: Result = [];
        const warningResults: Result = [];
        if (entity) {
            const evLength = entity.validation?.length ?? 0;
            for (let i = 0; i < evLength; i += 1) {
                const validationName = entity.validation![i];
                if (context!.validations?.[validationName]) {
                    const fr = await context!.validations[validationName].failure(data, name);
                    if (fr.result) {
                        failureResults.push({
                            validationName,
                            validationResult: fr
                        })
                    }
                }
            }

            for (let i = 0; i < evLength; i += 1) {
                const validationName = entity.validation![i];
                if (context!.validations?.[validationName]) {
                    const wr = await context!.validations[validationName].warning(data, name);
                    if (wr.result) {
                        warningResults.push({
                            validationName,
                            validationResult: wr
                        })
                    }
                }
            }
        }

        if (failureResults.length === 0 && warningResults.length === 0) {
            setState(EditorState.SUCCESS);
        } else if (failureResults.length > 0) {
            setState(EditorState.FAILURE);
            setVerifDescription(failureResults[0].validationResult.description ?? "")
        } else if (failureResults.length === 0 && warningResults.length > 0) {
            setState(EditorState.WARNING)
            setVerifDescription(warningResults[0].validationResult.description ?? "")
        }

        return {
            failureResults,
            warningResults
        }
    }


    useEffect(() => {
        if (context?.items) {
            const item: ItemInstance<T> = {
                getId: () => id,
                getName: () => name,
                getValue: () => value,
                setValue: (value) => { setValue(value) },
                validation,
            }
            context.items.current.add(item);
            return () => {
                context.items.current.delete(item);
            }
        }
    }, [id, name, value, context]);

    const getCloneElement = () => {
        return cloneElement<Editor<T>>(children, {
            state,
            value,
            onChangeValue: setValue
        });
    }

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
            <div
                className={cx(css`
                    display: flex;
                    flex: 1;
                `, context?.itemClassName)}
            >
                <div
                    className={context?.labelClassName}
                >
                    {label}
                </div>
                <div
                    className={cx(css`
                        flex: 1;
                    `, context?.editorClassName)}
                >
                    {getCloneElement()}
                </div>
            </div>
        </div>
    )
}

export default Item;