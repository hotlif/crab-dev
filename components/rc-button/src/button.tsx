import { css, cx } from "@linaria/core";
import { useRef, type ButtonHTMLAttributes, type FC } from "react";

import token from "./token";


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
     * 按钮的大小, 默认为 middle
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


const coreTransition = token.core.transition;

const primaryColorNormal = token.primary.color.normal;

const primaryBgColorNormal = token.primary.backgroundColor.normal;
const primaryBgColorHover = token.primary.backgroundColor.hover;
const primaryBgColorActive = token.primary.backgroundColor.active;
const primaryBoxShadow = token.primary.boxShadow.normal;

const linkBgColorNormal = token.link.backgroundColor.normal;
const linkBgColorDisabled = token.link.backgroundColor.disabled;
const linkColorNormal = token.link.color.normal;
const linkColorHover = token.link.color.hover;
const linkColorActive = token.link.color.active;

const dashedBorderWidth = token.dashed.border.width;
const dashedBorderStyle = token.dashed.border.style;
const dashedBoxShadow = token.dashed.boxShadow;
const dashedBorderColorNormal = token.dashed.border.color.normal;
const dashedBorderColorHover = token.dashed.border.color.hover;
const dashedBorderColorActive = token.dashed.border.color.active;
const dashedBgColor = token.dashed.backgroundColor;
const dashedColorNormal = token.dashed.color.normal;
const dashedColorHover = token.dashed.color.hover;
const dashedColorActive = token.dashed.color.active;

const textBgColorHover = token.text.backgroundColor.hover;
const textBgColorActive = token.text.backgroundColor.active;

const subtleBoxShadow = token.subtle.boxShadow;
const subtleBorderStyle = token.subtle.border.style;
const subtleBorderWidth = token.subtle.border.width;
const subtleBorderColorNormal = token.subtle.border.color.normal;
const subtleBorderColorHover = token.subtle.border.color.hover;
const subtleBorderColorActive = token.subtle.border.color.active;
const subtleBorderBgColorNormal = token.subtle.backgroundColor.normal;
const subtleColorHover = token.subtle.color.hover;
const subtleColorActive = token.subtle.color.active;
const subtleColor = token.subtle.color.normal;

const largeFontSize = token.size.large.fontSize;
const largeHeight = token.size.large.height;
const largePadding = token.size.large.padding;
const largeBorderRadius = token.size.large.borderRadius;
const largeGap = token.size.large.gap;


const middleFontSize = token.size.middle.fontSize;
const middleHeight = token.size.middle.height;
const middlePadding = token.size.middle.padding;
const middleBorderRadius = token.size.middle.borderRadius;
const middleGap = token.size.middle.gap;

const smallFontSize = token.size.small.fontSize;
const smallHeight = token.size.small.height;
const smallPadding = token.size.small.padding;
const smallBorderRadius = token.size.small.borderRadius;
const smallGap = token.size.small.gap;
const loadingOpacity = token.loading.opacity;


const baseStyle = css`
    display: inline-flex;
    justify-content: center;
    position: relative;
    align-items: center;
    cursor: pointer;
    transition: ${coreTransition};
    border: unset;
    user-select: none;
    background-color: unset;
    &[data-loading] {
        opacity: ${loadingOpacity};
        cursor: default;
        pointer-events: none;
    }
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
                    box-shadow: ${primaryBoxShadow};
                    background-color: ${primaryBgColorNormal};
                    color: ${primaryColorNormal};
                    &:hover {
                        background-color: ${primaryBgColorHover};
                    }
                    &:active {
                        background-color: ${primaryBgColorActive};
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
                    background-color: ${linkBgColorNormal};
                    color: ${linkColorNormal};
                    &:hover {
                        color: ${linkColorHover};
                    }
                    &:active {
                        color: ${linkColorActive};
                    }
                }

                &:disabled {
                    cursor: default;
                    background-color: ${linkBgColorDisabled};
                    pointer-events: none;
                }
            `
        } else if (appearance === "dashed") {
            return css`
                border-width: ${dashedBorderWidth};
                border-style: ${dashedBorderStyle};
                box-shadow: ${dashedBoxShadow};
                &:not(:disabled) {
                    color: ${dashedColorNormal};
                    background-color: ${dashedBgColor};
                    border-color: ${dashedBorderColorNormal};
                    &:hover {
                        color: ${dashedColorHover};
                        border-color: ${dashedBorderColorHover};
                    }
                    &:active {
                        color: ${dashedColorActive};
                        border-color: ${dashedBorderColorActive};
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
                        background-color: ${textBgColorHover};
                    }
                    &:active {
                        background-color: ${textBgColorActive};
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
                &:not(:disabled) {
                    color: ${subtleColor};
                    border-style: ${subtleBorderStyle};
                    border-width: ${subtleBorderWidth};
                    background-color: ${subtleBorderBgColorNormal};
                    border-color: ${subtleBorderColorNormal};
                    box-shadow: ${subtleBoxShadow};
                    &:hover {
                        border-color: ${subtleBorderColorHover};
                        color: ${subtleColorHover};
                    }
                    &:active {
                        color: ${subtleColorActive};
                        border-color: ${subtleBorderColorActive};
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
                font-size: ${largeFontSize};
                padding: ${largePadding};
                height: ${largeHeight};
                border-radius: ${largeBorderRadius};
                gap: ${largeGap};
            `
        } else if (size === "small") {
            return css`
                font-size: ${smallFontSize};
                height: ${smallHeight};
                padding: ${smallPadding};
                border-radius: ${smallBorderRadius};
                gap: ${smallGap};
            `
        } else {
            return css`
                font-size: ${middleFontSize};
                height: ${middleHeight};
                padding: ${middlePadding};
                border-radius: ${middleBorderRadius};
                gap: ${middleGap};
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

    const renderLoadingDom = () => {
        if (loading) {
            return (
                <span
                    className={css`
                        animation: rotate 1s linear infinite;
                        @keyframes rotate {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                                transform: rotate(360deg);
                            }
                        }

                    `}
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
                </span>
            )
        }
        return null;
    }


    return (
        <button
            data-loading={loading ? `${loading}` : null}
            className={cx(
                baseStyle,
                getAppearanceStyle(),
                getSizeStyle(),
                getShouldFitContainerStyle(),
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
            <span>
                {children}
            </span>
        </button>
    )
}

export default Button;
