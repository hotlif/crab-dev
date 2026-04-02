import { css, cx } from '@linaria/core';
import { useState, type FC, type MouseEvent } from 'react';
import token from './token.js';
import type { SwitchProps } from './types.js';

const wrapperStyle = css`
    display: inline-flex;
    align-items: center;
    gap: ${token.label.gap};
    cursor: pointer;
    font-size: ${token.label.font.size};
    color: ${token.label.color};
    line-height: 1;
    user-select: none;

    &[data-disabled] {
        cursor: default;
        pointer-events: none;
        color: ${token.label['color-disabled']};
    }
`;

const trackStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    background-color: ${token.track.background.color};
    transition: ${token.transition};
    border: none;
    padding: 0;
    cursor: inherit;
    outline: none;
    flex-shrink: 0;

    &:hover {
        background-color: ${token.track.background['color-hover']};
    }

    &:focus-visible {
        box-shadow: 0 0 0 2px ${token.checked.track.background.color};
    }
`;

const trackCheckedStyle = css`
    background-color: ${token.checked.track.background.color};

    &:hover {
        background-color: ${token.checked.track.background['color-hover']};
    }
`;

const trackDisabledStyle = css`
    background-color: ${token.disabled.track.background.color};
    cursor: default;
    pointer-events: none;
`;

const trackDisabledCheckedStyle = css`
    background-color: ${token.disabled.checked.track.background.color};
`;

const handleStyle = css`
    position: absolute;
    border-radius: 50%;
    background-color: ${token.handle.background.color};
    box-shadow: ${token.handle['box-shadow']};
    transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(0);
`;

const handleDisabledStyle = css`
    background-color: ${token.disabled.handle.background.color};
`;

const Switch: FC<SwitchProps> = ({
    checked: checkedProp,
    defaultChecked = false,
    disabled = false,
    size,
    onChange,
    children,
    className,
    ...restProps
}) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isControlled = checkedProp !== undefined;
    const checked = isControlled ? checkedProp : internalChecked;

    const getSizeStyles = () => {
        if (size === 'large') {
            return {
                track: css`
                    width: ${token.size.large.track.width};
                    height: ${token.size.large.track.height};
                    border-radius: ${token.size.large.track.border.radius};
                `,
                handle: css`
                    width: ${token.size.large.handle.size};
                    height: ${token.size.large.handle.size};
                    left: ${token.size.large.handle.offset};
                `,
                handleChecked: css`
                    transform: translateX(calc(${token.size.large.track.width} - ${token.size.large.handle.size} - ${token.size.large.handle.offset} - ${token.size.large.handle.offset}));
                `,
            };
        } else if (size === 'small') {
            return {
                track: css`
                    width: ${token.size.small.track.width};
                    height: ${token.size.small.track.height};
                    border-radius: ${token.size.small.track.border.radius};
                `,
                handle: css`
                    width: ${token.size.small.handle.size};
                    height: ${token.size.small.handle.size};
                    left: ${token.size.small.handle.offset};
                `,
                handleChecked: css`
                    transform: translateX(calc(${token.size.small.track.width} - ${token.size.small.handle.size} - ${token.size.small.handle.offset} - ${token.size.small.handle.offset}));
                `,
            };
        } else {
            return {
                track: css`
                    width: ${token.size.middle.track.width};
                    height: ${token.size.middle.track.height};
                    border-radius: ${token.size.middle.track.border.radius};
                `,
                handle: css`
                    width: ${token.size.middle.handle.size};
                    height: ${token.size.middle.handle.size};
                    left: ${token.size.middle.handle.offset};
                `,
                handleChecked: css`
                    transform: translateX(calc(${token.size.middle.track.width} - ${token.size.middle.handle.size} - ${token.size.middle.handle.offset} - ${token.size.middle.handle.offset}));
                `,
            };
        }
    };

    const sizeStyles = getSizeStyles();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        const nextChecked = !checked;

        if (!isControlled) {
            setInternalChecked(nextChecked);
        }

        onChange?.(nextChecked, e);
    };

    return (
        <label
            className={cx(wrapperStyle, className)}
            data-disabled={disabled ? '' : undefined}
        >
            <button
                {...restProps}
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                className={cx(
                    trackStyle,
                    sizeStyles.track,
                    checked && trackCheckedStyle,
                    disabled && !checked && trackDisabledStyle,
                    disabled && checked && trackDisabledCheckedStyle,
                    disabled && trackDisabledStyle,
                )}
                onClick={handleClick}
            >
                <span
                    className={cx(
                        handleStyle,
                        sizeStyles.handle,
                        checked && sizeStyles.handleChecked,
                        disabled && handleDisabledStyle,
                    )}
                />
            </button>
            {children !== undefined && <span>{children}</span>}
        </label>
    );
};

export default Switch;
