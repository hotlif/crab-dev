import { css, cx } from '@linaria/core';
import { useRef, type FC } from 'react';
import token from './token.js';
import type { ButtonProps } from './types.js';

const opacityLoading = token.opacity.loading;

const baseStyle = css`
    display: inline-flex;
    justify-content: center;
    position: relative;
    align-items: center;
    cursor: pointer;
    transition: ${token.transition};
    border: unset;
    user-select: none;
    background-color: unset;
    font-family: inherit;
    line-height: 1;
    vertical-align: middle;
    &[data-is-loading] {
        opacity: ${opacityLoading};
        cursor: default;
        pointer-events: none;
    }
`;

const Button: FC<ButtonProps> = ({
    icon,
    loading = false,
    appearance = 'subtle',
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
        if (appearance === 'primary') {
            return css`
                &:not(:disabled) {
                    box-shadow: ${token.primary['box-shadow']};
                    background-color: ${token.primary.background.color};
                    color: ${token.primary.color};
                    &:hover {
                        background-color: ${token.primary.background['color-hover']};
                    }
                    &:active {
                        background-color: ${token.primary.background['color-active']};
                        transform: scale(0.97);
                    }
                }

                &:disabled {
                    cursor: default;
                    pointer-events: none;
                    background-color: ${token.primary.background['color-disabled']};
                }
            `;
        } else if (appearance === 'link') {
            return css`
                &:not(:disabled) {
                    background-color: ${token.link.background.color};
                    color: ${token.link.color};
                    > span {
                        position: relative;
                        &::after {
                            content: '';
                            position: absolute;
                            bottom: ${token.link.text['underline-offset']};
                            left: 0;
                            width: 100%;
                            height: ${token.link.text.decoration.width};
                            background-color: ${token.link.text.decoration.color};
                            transform: scaleX(0);
                            transform-origin: right;
                            transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                        }
                        &:hover {
                            &::after {
                                transform: scaleX(1);
                                transform-origin: left;
                            }
                        }
                    }

                    &:hover {
                        color: ${token.link['color-hover']};
                    }
                    &:active {
                        transform: scale(0.97);
                        color: ${token.link['color-active']};
                    }
                }

                &:disabled {
                    cursor: default;
                    background-color: ${token.link.background['color-disabled']};
                    pointer-events: none;
                }
            `;
        } else if (appearance === 'dashed') {
            return css`
                border-width: ${token.dashed['border-width']};
                border-style: ${token.dashed['border-style']};
                box-shadow: ${token.dashed['box-shadow']};
                &:not(:disabled) {
                    color: ${token.dashed.color};
                    background-color: ${token.dashed.background.color};
                    border-color: ${token.dashed['border-color']};
                    &:hover {
                        color: ${token.dashed['color-hover']};
                        border-color: ${token.dashed['border-color-hover']};
                    }
                    &:active {
                        transform: scale(0.97);
                        color: ${token.dashed['color-active']};
                        border-color: ${token.dashed['border-color-active']};
                    }
                }
                &:disabled {
                    cursor: default;
                    pointer-events: none;
                    background-color: ${token.dashed.background['color-disabled']};
                    border-style: unset;
                    border-width: unset;
                }
            `;
        } else if (appearance === 'text') {
            return css`
                &:not(:disabled) {
                    &:hover {
                        background-color: ${token.text.background['color-hover']};
                    }
                    &:active {
                        transform: scale(0.97);
                        background-color: ${token.text.background['color-active']};
                    }
                }

                &:disabled {
                    cursor: default;
                    background-color: transparent;
                    pointer-events: none;
                }
            `;
        } else {
            return css`
                &:not(:disabled) {
                    color: ${token.subtle.color};
                    border-style: ${token.subtle['border-style']};
                    border-width: ${token.subtle['border-width']};
                    background-color: ${token.subtle.background['color']};
                    border-color: ${token.subtle['border-color']};
                    box-shadow: ${token.subtle['box-shadow']};
                    &:hover {
                        border-color: ${token.subtle['border-color-hover']};
                        color: ${token.subtle['color-hover']};
                    }
                    &:active {
                        transform: scale(0.97);
                        color: ${token.subtle['color-active']};
                        border-color: ${token.subtle['border-color-active']};
                    }
                }
                &:disabled {
                    cursor: default;
                    pointer-events: none;
                    background-color: ${token.subtle.background['color-disabled']};
                }
            `;
        }
    };

    const getSizeStyle = () => {
        if (size === 'large') {
            return css`
                font-size: ${token.size.large.font.size};
                padding: ${token.size.large.padding};
                height: ${token.size.large.height};
                border-radius: ${token.size.large.border.radius};
                gap: ${token.size.large.gap};
            `;
        } else if (size === 'small') {
            return css`
                font-size: ${token.size.small.font.size};
                height: ${token.size.small.height};
                padding: ${token.size.small.padding};
                border-radius: ${token.size.small.border.radius};
                gap: ${token.size.small.gap};
            `;
        } else {
            return css`
                font-size: ${token.size.middle.font.size};
                height: ${token.size.middle.height};
                padding: ${token.size.middle.padding};
                border-radius: ${token.size.middle.border.radius};
                gap: ${token.size.middle.gap};
            `;
        }
    };

    const getShouldFitContainerStyle = () => {
        if (shouldFitContainer) {
            return css`
                width: 100%;
            `;
        }
        return null;
    };

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
            );
        }
        return null;
    };

    const renderIcon = () => {
        if (loading) {
            return renderLoadingDom();
        } else if (icon) {
            return (
                <div
                    className={css`
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        > svg {
                            width: 1rem;
                            height: 1rem;
                        }
                    `}
                >
                    {icon}
                </div>
            );
        } else {
            return null;
        }
    };

    return (
        <button
            {...restProps}
            aria-busy={loading}
            aria-disabled={disabled || loading}
            data-is-loading={loading ? `${loading}` : null}
            className={cx(
                baseStyle,
                getAppearanceStyle(),
                getSizeStyle(),
                getShouldFitContainerStyle(),
                className,
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
            {renderIcon()}
            <span>{children}</span>
        </button>
    );
};

export default Button;
