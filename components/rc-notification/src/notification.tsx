import { css, cx } from "@linaria/core";
import { 
    useEffect,
    useRef,
    type FC,
    type HTMLAttributes,
    type ReactNode
} from "react";


interface Notification extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /**
     * 消息的标题信息
     */
    title?: ReactNode
    
    /**
     * 消息通知显示的位置
     */
    direction?: "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight"

    /**
     * 是否开启
     */
    open: boolean;

    /**
     * 状态发生改变的时候触发的事件
     */
    onOpenChange: (open: boolean) => void;
}

const getDirectionStyle = (direction: Notification["direction"]) => {
    if (direction === "top") {
        return css`
            inset: 0 auto auto 50%;
            transform: translateX(-50%);
        `
    } else if (direction === "topLeft") {
        return css`
            inset: 0 auto auto 0%;
        `
    } else if (direction === "topRight") {
        return css`
            inset: 0 0 auto auto;
        `
    } else if (direction === "bottom") {
        return css`
            inset: auto auto 0 50%;
            transform: translateX(-50%);
        `
    } else if (direction === "bottomLeft") {
        return css`
            inset: auto auto 0 0;
        `
    } else if (direction === "bottomRight") {
        return css`
            inset: auto 0 0 auto;
        `
    } else {
        return null;
    }
}

const Notification: FC<Notification> = ({
    title,
    children,
    open,
    onOpenChange,
    direction = "topRight",
    ...restProps
}) => {

    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (open) {
            divRef.current?.showPopover();
        } else {
            divRef.current?.hidePopover();
        }
    }, [open])


    return (
        <div
            className={cx(css`
                position: fixed;
                margin: 0;
            `, getDirectionStyle(direction))}
            popover="manual"
            ref={divRef}
            {...restProps}
        >
            {title ? (
                <div
                    className={css`
                        color: rgba(0,0,0,0.88);
                        font-size: 16px;
                        line-height: 1.5;
                    `}
                >
                    {title}
                </div>
            ): null}
            <div
                className={css`
                `}
            >
                {children}
            </div>
        </div>
    )
}

export default Notification;