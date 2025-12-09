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
} from "react";

import { FormContext } from "./form";

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


export interface ItemInstance<T> {
    getId: () => string,
    getName: () => string,
    getValue: () => T | undefined,
    setValue: (value: T | undefined) => void
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

    const context = useContext(FormContext)
    useEffect(() => {
        if (context?.items) {
            const item: ItemInstance<T> = {
                getId: () => id,
                getName: () => name,
                getValue: () => value,
                setValue: (value) => { setValue(value) }
            }
            context.items.current.add(item);
            return () => {
                context.items.current.delete(item);
            }
        }
    }, [id, name, value]);

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
                context?.itemClassName,
                className
            )}
            {...restProps}
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
    )
}

export default Item;