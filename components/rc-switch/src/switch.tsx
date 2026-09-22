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
    line-height: ${token.root['line-height']};
    user-select: none;
    min-height: ${token.root.touch['min-height']};

    &[data-disabled] {
        cursor: not-allowed;
        pointer-events: none;
        color: ${token.label['color-disabled']};
        opacity: ${token.root['opacity-disabled']};
    }
`;

const trackStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    background-color: ${token.track['background-color']};
    transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    border: none;
    box-shadow: inset 0 0 0 ${token.track['border-width']} ${token.track['border-color']};
    &::before { content: ""; position: absolute; inset: calc((100% - ${token.root.touch['min-height']}) / 2) 0; }
    padding: 0;
    cursor: inherit;
    outline: none;
    flex-shrink: 0;
    &::after {
        content: "";
        position: absolute;
        pointer-events: none;
        width: ${token.track.halo.width};
        height: ${token.track.halo.width};
        left: ${token.track.halo.left};
        border-radius: inherit;
        transition: ${token.root.transition};
    }
    &[aria-checked='true']::after { translate: ${token.track.halo['translate-checked']} 0; }
    &:hover:not(:disabled)::after { background: ${token.track['state-layer']['background-color-hover']}; }
    &:active:not(:disabled)::after, &:focus-visible::after { background: ${token.track['state-layer']['background-color-active']}; }

    &:hover {
        background-color: ${token.track['background-color-hover']};
    }

    &:focus-visible {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }
    @media (forced-colors: active) {
        && {
        forced-color-adjust: none;
        background: Canvas;
        outline: ${token.track['border-width']} solid CanvasText;
        outline-offset: -1px;
        > span { background: CanvasText; box-shadow: none; }
        &[aria-checked='true'] {
            background: Highlight;
            > span { background: HighlightText; }
        }
        &:disabled {
            background: Canvas;
            outline-color: GrayText;
            > span { background: GrayText; }
        }
        &:focus-visible {
            outline: ${token.root['outline-width-focus']} solid Highlight;
            outline-offset: ${token.root['outline-offset-focus']};
        }
        }
    }
`;

const trackCheckedStyle = css`
    background-color: ${token.track['background-color-checked']};
    box-shadow: none;

    &:hover {
        background-color: ${token.track.checked['background-color-hover']};
    }
`;

const trackDisabledStyle = css`
    background-color: ${token.track['background-color-disabled']};
    cursor: not-allowed;
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
    transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    transform: translateX(0) scale(${token.handle.unchecked.scale});
`;

const handleCheckedStyle = css`
    background-color: ${token.handle.checked['background-color']};
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
                        checked && handleCheckedStyle,
                        disabled && handleDisabledStyle,
                    )}
                />
            </button>
            {children !== undefined && <span>{children}</span>}
        </label>
    );
};

export default Switch;
