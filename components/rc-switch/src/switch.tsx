import { css, cx } from '@crab-dev/css';
import { type FC, type KeyboardEvent, type MouseEvent } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token from './token.js';
import type { SwitchProps } from './types.js';

const wrapperStyle = css`
    display: inline-flex;
    align-items: center;
    gap: ${token.label.gap};
    cursor: pointer;
    font-size: ${token.label['font-size']};
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
    background-color: ${token.track['background-color']};
    transition: ${token.root.transition};
    border: none;
    padding: 0;
    cursor: inherit;
    outline: none;
    flex-shrink: 0;

    &:hover {
        background-color: ${token.track['background-color-hover']};
    }

    &:focus-visible {
        box-shadow: 0 0 0 2px ${token.track['background-color-checked']};
    }
`;

const trackCheckedStyle = css`
    background-color: ${token.track['background-color-checked']};

    &:hover {
        background-color: ${token.track.checked['background-color-hover']};
    }
`;

const trackDisabledStyle = css`
    background-color: ${token.track['background-color-disabled']};
    cursor: default;
    pointer-events: none;
`;

const trackDisabledCheckedStyle = css`
    background-color: ${token.track.checked['background-color-disabled']};
`;

const handleStyle = css`
    position: absolute;
    border-radius: 50%;
    background-color: ${token.handle['background-color']};
    box-shadow: ${token.handle['box-shadow']};
    transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(0);
`;

const handleDisabledStyle = css`
    background-color: ${token.handle['background-color-disabled']};
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
    const [checked, setChecked] = useControllableValue<
        boolean,
        [MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>]
    >({
        value: checkedProp,
        defaultValue: defaultChecked,
        onChange,
    });

    const getSizeStyles = () => {
        if (size === 'large') {
            return {
                track: css`
                    width: ${token.size.large.track.width};
                    height: ${token.size.large.track.height};
                    border-radius: ${token.size.large.track['border-radius']};
                `,
                handle: css`
                    width: ${token.size.large.handle.width};
                    height: ${token.size.large.handle.width};
                    left: ${token.size.large.handle.left};
                `,
                handleChecked: css`
                    transform: translateX(calc(${token.size.large.track.width} - ${token.size.large.handle.width} - ${token.size.large.handle.left} - ${token.size.large.handle.left}));
                `,
            };
        } else if (size === 'small') {
            return {
                track: css`
                    width: ${token.size.small.track.width};
                    height: ${token.size.small.track.height};
                    border-radius: ${token.size.small.track['border-radius']};
                `,
                handle: css`
                    width: ${token.size.small.handle.width};
                    height: ${token.size.small.handle.width};
                    left: ${token.size.small.handle.left};
                `,
                handleChecked: css`
                    transform: translateX(calc(${token.size.small.track.width} - ${token.size.small.handle.width} - ${token.size.small.handle.left} - ${token.size.small.handle.left}));
                `,
            };
        } else {
            return {
                track: css`
                    width: ${token.size.middle.track.width};
                    height: ${token.size.middle.track.height};
                    border-radius: ${token.size.middle.track['border-radius']};
                `,
                handle: css`
                    width: ${token.size.middle.handle.width};
                    height: ${token.size.middle.handle.width};
                    left: ${token.size.middle.handle.left};
                `,
                handleChecked: css`
                    transform: translateX(calc(${token.size.middle.track.width} - ${token.size.middle.handle.width} - ${token.size.middle.handle.left} - ${token.size.middle.handle.left}));
                `,
            };
        }
    };

    const sizeStyles = getSizeStyles();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        setChecked(!checked, e);
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
