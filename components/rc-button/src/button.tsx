import { css, cx } from "@linaria/core";
import { useRef, type FC } from "react";
import token from "./token";
import type { ButtonProps } from "./types";

const motionTransition = token.motion.transition;

const colorPrimary = token.color.primary;
const colorPrimaryBackground = token.color["primary-background"];
const colorPrimaryBackgroundHover = token.color["primary-background-hover"];
const colorPrimaryBackgroundActive = token.color["primary-background-active"];
const elevationPrimaryBoxShadow = token.elevation["primary-box-shadow"];

const colorLink = token.color.link;
const colorLinkHover = token.color["link-hover"];
const colorLinkActive = token.color["link-active"];
const colorLinkBackground = token.color["link-background"];
const colorLinkBackgroundDisabled = token.color["link-background-disabled"];

const colorDashed = token.color.dashed;
const colorDashedHover = token.color["dashed-hover"];
const colorDashedActive = token.color["dashed-active"];
const colorDashedBackground = token.color["dashed-background"];
const elevationDashedBoxShadow = token.elevation["dashed-box-shadow"];

const colorTextBackgroundActive = token.color["text-background-active"];
const colorTextBackgroundHover = token.color["text-background-hover"];

const colorSubtle = token.color.subtle;
const colorSubtleActive = token.color["subtle-active"];
const colorSubtleHover = token.color["subtle-hover"];
const colorSubtleBackground = token.color["subtle-background"];
const elevationSubtleBoxShadow = token.elevation["subtle-box-shadow"]

const borderDashedWidth = token.border["dashed-width"];
const borderDashedStyle = token.border["dashed-style"];
const borderDashedColor = token.border["dashed-color"];
const borderDashedColorHover = token.border["dashed-color-hover"];
const borderDashedColorActive = token.border["dashed-color-active"];

const borderSubtleWidth = token.border["subtle-width"]
const borderSubtleStyle = token.border["subtle-style"]
const borderSubtleColor = token.border["subtle-color"]
const borderSubtleColorHover = token.border["subtle-color-hover"]
const borderSubtleColorActive = token.border["subtle-color-hover"]

const dimensionLargeGap = token.dimension["large-gap"];
const dimensionLargeHeight = token.dimension["large-height"];
const dimensionLargePadding = token.dimension["large-padding"];
const dimensionLargeBorderRadius = token.dimension["large-border-radius"];
const typographyLargeFontSize = token.typography["large-font-size"];

const dimensionMiddleGap = token.dimension["middle-gap"];
const dimensionMiddleHeight = token.dimension["middle-height"];
const dimensionMiddlePadding = token.dimension["middle-padding"];
const dimensionMiddleBorderRadius = token.dimension["middle-border-radius"];
const typographyMiddleFontSize = token.typography["middle-font-size"];


const dimensionSmallGap = token.dimension["small-gap"];
const dimensionSmallHeight = token.dimension["small-height"];
const dimensionSmallPadding = token.dimension["small-padding"];
const dimensionSmallBorderRadius = token.dimension["small-border-radius"];
const typographySmallFontSize = token.typography["small-font-size"];

const typographyFontFamily = token.typography["font-family"];
const typographyLinkTextDecoration = token.typography["link-text-decoration"];
const typographyLinkTextUnderlineOffset = token.typography["link-text-underline-offset"];

const opacityLoading = token.opacity.loading;

const baseStyle = css`
    display: inline-flex;
    justify-content: center;
    position: relative;
    align-items: center;
    cursor: pointer;
    transition: ${motionTransition};
    border: unset;
    user-select: none;
    background-color: unset;
    font-family: ${typographyFontFamily};
    &[data-loading] {
        opacity: ${opacityLoading};
        cursor: default;
        pointer-events: none;
    }
`

const Button: FC<ButtonProps> = ({
    loading = false,
    appearance = "subtle",
    shouldFitContainer = false,
    className,
    children,
    size,
    disabled,
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
                    box-shadow: ${elevationPrimaryBoxShadow};
                    background-color: ${colorPrimaryBackground};
                    color: ${colorPrimary};

                    &:hover {
                        background-color: ${colorPrimaryBackgroundHover};
                    }

                    &:active {
                        background-color: ${colorPrimaryBackgroundActive};
                        transform: scale(0.97);
                    }
                }

                &[aria-disabled="true"] {
                    cursor: default;
                    pointer-events: none;
                }
            `
        } else if (appearance === "link") {
            return css`
                &:not(:disabled) {
                    background-color: ${colorLinkBackground};
                    color: ${colorLink};

                    &:hover {
                        color: ${colorLinkHover};
                        text-decoration: ${typographyLinkTextDecoration};
                        text-underline-offset: ${typographyLinkTextUnderlineOffset};
                    }
                    &:active {
                        transform: scale(0.97);
                        color: ${colorLinkActive};
                    }
                }

                &:disabled {
                    cursor: default;
                    background-color: ${colorLinkBackgroundDisabled};
                    pointer-events: none;
                }
            `
        } else if (appearance === "dashed") {
            return css`
                border-width: ${borderDashedWidth};
                border-style: ${borderDashedStyle};
                box-shadow: ${elevationDashedBoxShadow};
                &:not(:disabled) {
                    color: ${colorDashed};
                    background-color: ${colorDashedBackground};
                    border-color: ${borderDashedColor};
                    &:hover {
                        color: ${colorDashedHover};
                        border-color: ${borderDashedColorHover};
                    }
                    &:active {
                        transform: scale(0.97);
                        color: ${colorDashedActive};
                        border-color: ${borderDashedColorActive};
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
                        background-color: ${colorTextBackgroundHover};
                    }
                    &:active {
                        transform: scale(0.97);
                        background-color: ${colorTextBackgroundActive};
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
                    color: ${colorSubtle};
                    border-style: ${borderSubtleStyle};
                    border-width: ${borderSubtleWidth};
                    background-color: ${colorSubtleBackground};
                    border-color: ${borderSubtleColor};
                    box-shadow: ${elevationSubtleBoxShadow};
                    &:hover {
                        border-color: ${borderSubtleColorHover};
                        color: ${colorSubtleHover};
                    }
                    &:active {
                        transform: scale(0.97);
                        color: ${colorSubtleActive};
                        border-color: ${borderSubtleColorActive};
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
                font-size: ${typographyLargeFontSize};
                padding: ${dimensionLargePadding};
                height: ${dimensionLargeHeight};
                border-radius: ${dimensionLargeBorderRadius};
                gap: ${dimensionLargeGap};
            `
        } else if (size === "small") {
            return css`
                font-size: ${typographySmallFontSize};
                height: ${dimensionSmallHeight};
                padding: ${dimensionSmallPadding};
                border-radius: ${dimensionSmallBorderRadius};
                gap: ${dimensionSmallGap};
            `
        } else {
            return css`
                font-size: ${typographyMiddleFontSize};
                height: ${dimensionMiddleHeight};
                padding: ${dimensionMiddlePadding};
                border-radius: ${dimensionMiddleBorderRadius};
                gap: ${dimensionMiddleGap};
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
            {...restProps}
            aria-busy={loading}
            aria-disabled={disabled || loading}
            data-loading={loading ? `${loading}` : null}
            className={cx(
                baseStyle,
                getAppearanceStyle(),
                getSizeStyle(),
                getShouldFitContainerStyle(),
                className
            )}
            disabled={disabled}
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
        >
            {renderLoadingDom()}
            <span>
                {children}
            </span>
        </button>
    )
}

export default Button;
