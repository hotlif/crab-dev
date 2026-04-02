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
    width: ${token.track.width};
    height: ${token.track.height};
    border-radius: ${token.track.border.radius};
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
    width: ${token.handle.size};
    height: ${token.handle.size};
    border-radius: 50%;
    background-color: ${token.handle.background.color};
    box-shadow: ${token.handle['box-shadow']};
    transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
    left: ${token.handle.offset};
    transform: translateX(0);
`;

const handleCheckedStyle = css`
    transform: translateX(calc(${token.track.width} - ${token.handle.size} - ${token.handle.offset} - ${token.handle.offset}));
`;

const handleDisabledStyle = css`
    background-color: ${token.disabled.handle.background.color};
`;

const trackSmallStyle = css`
    width: ${token.small.track.width};
    height: ${token.small.track.height};
    border-radius: ${token.small.track.border.radius};
`;

const handleSmallStyle = css`
    width: ${token.small.handle.size};
    height: ${token.small.handle.size};
    left: ${token.small.handle.offset};
`;

const handleSmallCheckedStyle = css`
    transform: translateX(calc(${token.small.track.width} - ${token.small.handle.size} - ${token.small.handle.offset} - ${token.small.handle.offset}));
`;

const Switch: FC<SwitchProps> = ({
    checked: checkedProp,
    defaultChecked = false,
    disabled = false,
    size = 'default',
    onChange,
    children,
    className,
    ...restProps
}) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isControlled = checkedProp !== undefined;
    const checked = isControlled ? checkedProp : internalChecked;
    const isSmall = size === 'small';

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
                    checked && trackCheckedStyle,
                    disabled && !checked && trackDisabledStyle,
                    disabled && checked && trackDisabledCheckedStyle,
                    disabled && trackDisabledStyle,
                    isSmall && trackSmallStyle,
                )}
                onClick={handleClick}
            >
                <span
                    className={cx(
                        handleStyle,
                        checked && handleCheckedStyle,
                        disabled && handleDisabledStyle,
                        isSmall && handleSmallStyle,
                        isSmall && checked && handleSmallCheckedStyle,
                    )}
                />
            </button>
            {children !== undefined && <span>{children}</span>}
        </label>
    );
};

export default Switch;
