import { css, cx } from "@linaria/core";
import { 
    useEffect,
    useRef,
    type FC,
} from "react";

import Close from "./icons/close";
import type { NotificationProps } from "./types";

const getDirectionTranslate = (direction: NotificationProps["direction"]): any => {
    if (direction === "top") {
        return {
            "--rc-notification-translate-start": "translate(-50%, -1rem)",
            "--rc-notification-translate-end": "translate(-50%, 1rem)"
        }
    } else if (direction === "topLeft") {
        return {
            "--rc-notification-translate-start": "translate(-100%, 1rem)",
            "--rc-notification-translate-end": "translate(1rem, 1rem)"
        }
    } else if (direction === "topRight") {
        return {
            "--rc-notification-translate-start": "translate(100%, 1rem)",
            "--rc-notification-translate-end": "translate(-1rem, 1rem)"
        }
    } else if (direction === "bottom") {
        return {
            "--rc-notification-translate-start": "translate(-50%, 100%)",
            "--rc-notification-translate-end": "translate(-50%, -1rem)"
        }
    } else if (direction === "bottomLeft") {
        return {
            "--rc-notification-translate-start": "translate(-100%, -1rem)",
            "--rc-notification-translate-end": "translate(1rem, -1rem)"
        }
    } else if (direction === "bottomRight") {
        return {
            "--rc-notification-translate-start": "translate(100%, -1rem)",
            "--rc-notification-translate-end": "translate(-1rem, -1rem)"
        }
    }
}

const getDirectionStyle = (direction: NotificationProps["direction"]) => {
    if (direction === "top") {
        return css`
            top: 1rem;
            inset: 0 auto auto 50%;
        `
    } else if (direction === "topLeft") {
        return css`
            inset: 0 auto auto 0%;
            transform: translate(1rem, 1rem);
        `
    } else if (direction === "topRight") {
        return css`
            inset: 0 0 auto auto;
        `
    } else if (direction === "bottom") {
        return css`
            inset: auto auto 0 50%;
            transform: translate(-50%, -1rem);
        `
    } else if (direction === "bottomLeft") {
        return css`
            inset: auto auto 0 0;
            transform: translate(1rem, -1rem);
        `
    } else if (direction === "bottomRight") {
        return css`
            inset: auto 0 0 auto;
            transform: translate(-1rem, -1rem);
        `
    } else {
        return null;
    }
}

const Notification: FC<NotificationProps> = ({
    title,
    children,
    open,
    onOpenChange,
    direction = "topRight",
    className,
    style,
    ...restProps
}) => {

    const divRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (open) {
            divRef.current?.showPopover()
        } else {
            divRef.current?.hidePopover();
        }
    }, [open])



    return (
        <div
            style={{
                ...getDirectionTranslate(direction),
                ...style
            }}
            className={cx(
                css`
                    border: unset;
                    position: fixed;
                    padding: 20px 24px;
                    border-radius: 8px;
                    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);

                    &[popover] {
                        opacity: 0;
                        filter: blur(4px);
                        transition: 
                            transform 0.4s cubic-bezier(0.23, 1, 0.32, 1),
                            opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
                            filter 0.3s,
                            display 0.4s allow-discrete,
                            overlay 0.4s allow-discrete;
                        transform: var(--rc-notification-translate-start);
                    }

                    &[popover]:popover-open {
                        transform: var(--rc-notification-translate-end);
                        opacity: 1;
                        filter: blur(0px);
                    }
                
                    @starting-style {
                        &[popover]:popover-open {
                            transform: var(--rc-notification-translate-start);
                            opacity: 0;
                            filter: blur(4px);
                        }
                    }
                `,
                getDirectionStyle(direction),
                className
            )}
            popover="manual"
            ref={divRef}
            {...restProps}
        >
            {title ? (
                <div
                    className={css`
                        display: flex;
                        color: rgba(0,0,0,0.88);
                        font-size: 16px;
                        line-height: 1.5;
                        margin-bottom: 10px;
                    `}
                >
                    <div
                        className={css`
                            flex: 1;
                        `}
                    >
                        {title}
                    </div>
                    <div
                        className={css`
                            display: flex;
                            align-items: center;
                            opacity: 0.7;
                            cursor: pointer;
                        `}
                        onClick={() => {
                            onOpenChange?.(false)
                        }}
                    >
                        <Close />
                    </div>
                </div>
            ): null}
            <div
                className={css`
                    color: rgba(0,0,0,0.88);
                    font-size: 14px;
                `}
            >
                {children}
            </div>
        </div>
    )
}

export default Notification;