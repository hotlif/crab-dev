import { css, cx } from "@linaria/core";
import { useRef, type ButtonHTMLAttributes, type FC } from "react";
import { fontSize, padding, margin } from "@crab/styleify";
import { motion } from "motion/react";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "onClickCapture"> {

    /**
     * 加载中
     */
    loading?: boolean

	/**
	 * 按钮类型
	 * @default 'subtle'
	 */
	appearance?: "primary" | "subtle" | "dashed" | "text" | "link"
    
    /**
     * 设置当行文本输入框的大小, 默认为 middle
     */
    size?: "large" | "middle" | "small"

    /**
	 * 宽度设置为父容器宽度
	 */
	shouldFitContainer?: boolean

    /**
     * see ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
     */
    onClick?: (param: Parameters<NonNullable<ButtonHTMLAttributes<HTMLButtonElement>["onClick"]>>[0]) => Promise<void> | void

    /**
     * see ButtonHTMLAttributes<HTMLButtonElement>["onClickCapture"]
     */
    onClickCapture?: (param: Parameters<NonNullable<ButtonHTMLAttributes<HTMLButtonElement>["onClickCapture"]>>[0]) => Promise<void> | void
}


const baseStyle = css`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 6px;
    transition: all 200ms;
    border: unset;
    user-select: none;

`

const Button: FC<ButtonProps> = ({
    loading,
    appearance = "subtle",
    shouldFitContainer = false,
    className,
    children,
    size,
    onClick,
    onClickCapture,
    ...restProps
}) => {

    // 点击状态, 默认情况下是 false, 点击后就是 true
    const clickState = useRef<boolean>(false);

    const getAppearanceStyle = () => {
        if (appearance === "primary") {
            return css`
                &:not(:disabled) {
                    background-color: rgb(22, 119, 255);
                    color: rgb(255, 255, 255);
                    &:hover {
                        background-color: #4096ff;
                    }
                    &:active {
                        background-color: #0958d0;
                    }
                }

                &:disabled {
                    cursor: default;
                    pointer-events: none;
                }

            `
        } else if (appearance === "link") {
            return css`
                &:not(:disabled) {
                    background-color: transparent;
                    color: rgb(22, 119, 255);
                    &:hover {
                        color: #4096ff;
                    }
                    &:active {
                        color: #0958d9;
                    }
                }

                &:disabled {
                    cursor: default;
                    background-color: transparent;
                    pointer-events: none;
                }
                
            `
        } else if (appearance === "dashed") {
            return css`
                border-width: 1px;
                border-style: dashed;
                box-shadow: rgba(0, 0, 0, 0.02) 0px 2px 0px 0px;
                &:not(:disabled) {
                    background-color: #fff;
                    border-color: rgb(217, 217, 217);
                    &:hover {
                        border-color: rgb(64, 150, 255);
                        color: rgb(64, 150, 255);
                    }
                    &:active {
                        color: #0958d9;
                        border-color: #0958d9;
                        background-color: #fff;
                    }
                }
                &:disabled {
                    cursor: default;
                    pointer-events: none;
                }

            `
        } else if (appearance === "text") {
            return css`
                &:not(:disabled) {
                    &:hover {
                        background-color: rgba(0,0,0,0.04);
                    }
                    &:active {
                        background-color: rgba(0,0,0,0.15);
                    }
                }

                &:disabled {
                    cursor: default;
                    background-color: transparent;
                    pointer-events: none;
                }
            `
        } else {
            return css`
                box-shadow: rgba(0, 0, 0, 0.02) 0px 2px 0px 0px;
                &:not(:disabled) {
                    border-style: solid;
                    border-width: 1px;
                    background-color: #fff;
                    border-color: rgb(217, 217, 217);
                    &:hover {
                        border-color: rgb(64, 150, 255);
                        color: rgb(64, 150, 255);
                    }
                    &:active {
                        color: #0958d9;
                        border-color: #0958d9;
                        background-color: #fff;
                    }
                }

                &:disabled {
                    cursor: default;
                    pointer-events: none;
                }
            `
        }
    }

    const getSizeStyle = () => {
        if (size === "large") {
            return css`
                ${fontSize("lg")}
                ${padding(4, "x")}
                height: 2.5rem;
            `
        } else if (size === "small") {
            return css`
                ${fontSize("sm")}
                ${padding(4, "x")}
            `
        } else {
            return css`
                ${fontSize("base")}
                ${padding(4, "x")}
                height: 2rem;
            `
        }
    }

    const getShouldFitContainerStyle = () => {
        if (shouldFitContainer) {
            return css`
                width: 100%;
            `
        }
        return null;
    }

    const getLoadingStyle = () => {
        if (loading) {
            return css`
                opacity: 0.65;
            `
        }
        return null;
    }

    const renderLoadingDom = () => {
        if (loading) {
            return (
                <motion.span
                    className={css`
                        ${margin(3, "right")}
                        color: inherit;
                    `}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <svg
                        className={css`
                            color: inherit;   
                        `}
                        viewBox="0 0 1024 1024"
                        focusable="false"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            className={css`
                                color: inherit;
                            `}
                            d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"
                        />
                    </svg>
                </motion.span>
            )
        }
        return null;
    }

    return (
        <button
            button-data-loading={loading ? `${loading}` : null}
            className={cx(
                baseStyle,
                getAppearanceStyle(),
                getSizeStyle(),
                getShouldFitContainerStyle(),
                getLoadingStyle(),
                className
            )}
            onClick={(e) => {
                if (clickState.current === false) {
                    clickState.current = true;
                    try {
                        const result = onClick?.(e);
                        if (result?.then) {
                            result
                                .then(() => {
                                    clickState.current = false;
                                })
                                .catch(() => {
                                    clickState.current = false;
                                })
                                .finally(() => {
                                    clickState.current = false;
                                });
                        } else {
                            clickState.current = false;
                        }
                    } catch (error) {
                        clickState.current = false;
                        throw error;
                    }
                }
            }}
            onClickCapture={(e) => {
                if (clickState.current === false) {
                    clickState.current = true;
                    try {
                        const result = onClickCapture?.(e);
                        if (result?.then) {
                            result
                                .then(() => {
                                    clickState.current = false;
                                })
                                .catch(() => {
                                    clickState.current = false;
                                })
                                .finally(() => {
                                    clickState.current = false;
                                });
                        } else {
                            clickState.current = false;
                        }
                    } catch (error) {
                        clickState.current = false;
                        throw error;
                    }
                }
            }}
            {...restProps}
        >
            {renderLoadingDom()}
            <span
                className={css`
                    color: inherit;
                `}
            >
                {children}
            </span>
        </button>
    )
}

export default Button;
