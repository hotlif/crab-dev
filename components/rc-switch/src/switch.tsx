import { useComponentSize } from '@crab-dev/rc-config-provider';
import { css, cx } from '@crab-dev/css';
import { type FC, type MouseEvent } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token, { vars } from './token.js';
import type { SwitchProps } from './types.js';

const wrapperStyle = css`
    display: inline-flex;
    vertical-align: middle;
    align-items: center;
    max-width: 100%;
    gap: ${token.label.gap};
    cursor: pointer;
    font-size: ${token.label['font-size']};
    color: ${token.label.color};
    line-height: ${token.root['line-height']};
    user-select: none;
    min-height: ${token.root['min-height']};
    @media (pointer: coarse) { min-height: ${token.root.touch['min-height']}; }

    &[data-disabled] {
        cursor: not-allowed;
        pointer-events: none;
        color: ${token.label['color-disabled']};
        > span { opacity: ${token.root['opacity-disabled']}; }
    }
    > span { min-width: 0; overflow-wrap: anywhere; }
    @media (forced-colors: active) {
        &[data-disabled] { color: GrayText; > span { opacity: 1; } }
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
    &::before { content: ""; position: absolute; inset: calc((100% - max(100%, ${token.root.touch['min-height']})) / 2) calc((100% - max(100%, ${token.root.touch['min-width']})) / 2); }
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
        inset-inline-start: ${token.track.halo.left};
        border-radius: inherit;
        transition: ${token.root.transition};
    }
    &[aria-checked='true']::after { translate: ${token.track.halo['translate-checked']} 0; }
    &:dir(rtl)[aria-checked='true']::after { translate: calc(-1 * ${token.track.halo['translate-checked']}) 0; }
    &:hover:not(:disabled)::after { background: ${token.track['state-layer']['background-color-hover']}; }
    &:active:not(:disabled)::after, &:focus-visible::after { background: ${token.track['state-layer']['background-color-active']}; }
    &[aria-checked='true']:hover:not(:disabled)::after { background: ${token.track.checked['state-layer']['background-color-hover']}; }
    &[aria-checked='true']:is(:active, :focus-visible):not(:disabled)::after { background: ${token.track.checked['state-layer']['background-color-active']}; }
    &:is(:hover, :active, :focus-visible):not(:disabled) > span { background-color: ${token.handle.interactive['background-color']}; }
    &[aria-checked='true']:is(:hover, :active, :focus-visible):not(:disabled) > span { background-color: ${token.handle.checked.interactive['background-color']}; }
    &:active:not(:disabled) > span { scale: ${token.handle.pressed.scale}; }
    &:disabled, &:disabled > span { transition: none; }
    @media (prefers-reduced-motion: reduce) { &::after { transition: none; } }

    &:hover {
        background-color: ${token.track['background-color-hover']};
    }

    &:focus-visible {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }
    &[aria-invalid='true']:not(:disabled) {
        box-shadow: inset 0 0 0 ${token.root['outline-width-focus']} ${token.track['border-color-error']};
        &:focus-visible { outline-color: ${token.track['border-color-error']}; }
        &[aria-checked='true'] {
            background-color: ${token.track['background-color-error']};
            > span { background-color: ${token.handle['background-color-error']}; }
        }
    }
    @media (forced-colors: active) {
        /* Match the checked interactive/error selector specificity. With only
           &&, its ordinary on-primary color wins and hides the thumb on Highlight. */
        &&& {
        forced-color-adjust: none;
        background: Canvas;
        box-shadow: none;
        outline: ${token.track['border-width']} solid CanvasText;
        outline-offset: -1px;
        &::after { content: none; }
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
    box-shadow: inset 0 0 0 ${token.track['border-width']} ${token.track['border-color-disabled']};
`;

const trackDisabledCheckedStyle = css`
    background-color: ${token.track.checked['background-color-disabled']};
    box-shadow: none;
`;

const handleStyle = css`
    position: absolute;
    border-radius: 50%;
    background-color: ${token.handle['background-color']};
    box-shadow: ${token.handle['box-shadow']};
    transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    scale: ${token.handle.unchecked.scale};
`;

const handleCheckedStyle = css`
    background-color: ${token.handle.checked['background-color']};
    scale: 1;
`;

const handleDisabledStyle = css`
    background-color: ${token.handle['background-color-disabled']};
`;

const handleDisabledCheckedStyle = css`
    background-color: ${token.handle.checked['background-color-disabled']};
`;

const Switch: FC<SwitchProps> = ({
    checked: checkedProp,
    defaultChecked = false,
    disabled = false,
    size: sizeProp,
    onCheckedChange,
    onClick,
    children,
    className,
    ...restProps
}) => {
    const size = useComponentSize(sizeProp);
    const [checked, setChecked] = useControllableValue<
        boolean,
        [MouseEvent<HTMLButtonElement>]
    >({
        value: checkedProp,
        defaultValue: defaultChecked,
        onValueChange: (next, event) => onCheckedChange?.(next, { reason: 'toggle', event }),
    });

    const getSizeStyles = () => {
        if (size === 'large') {
            return {
                track: css`
                    ${vars['track.halo.left']}: calc(${token.size.large.handle.left} + (${token.size.large.handle.width} - ${token.track.halo.width}) / 2);
                    ${vars['track.halo.translate-checked']}: calc(${token.size.large.track.width} - ${token.size.large.handle.width} - 2 * ${token.size.large.handle.left});
                    width: ${token.size.large.track.width};
                    margin-inline: max(0px, calc((${token.root.touch['min-width']} - ${token.size.large.track.width}) / 2));
                    height: ${token.size.large.track.height};
                    border-radius: ${token.size.large.track['border-radius']};
                `,
                handle: css`
                    width: ${token.size.large.handle.width};
                    height: ${token.size.large.handle.width};
                    inset-inline-start: ${token.size.large.handle.left};
                `,
                handleChecked: css`
                    translate: calc(${token.size.large.track.width} - ${token.size.large.handle.width} - ${token.size.large.handle.left} - ${token.size.large.handle.left}) 0;
                    &:dir(rtl) { translate: calc(-1 * (${token.size.large.track.width} - ${token.size.large.handle.width} - ${token.size.large.handle.left} - ${token.size.large.handle.left})) 0; }
                `,
            };
        } else if (size === 'small') {
            return {
                track: css`
                    ${vars['track.halo.left']}: calc(${token.size.small.handle.left} + (${token.size.small.handle.width} - ${token.track.halo.width}) / 2);
                    ${vars['track.halo.translate-checked']}: calc(${token.size.small.track.width} - ${token.size.small.handle.width} - 2 * ${token.size.small.handle.left});
                    width: ${token.size.small.track.width};
                    margin-inline: max(0px, calc((${token.root.touch['min-width']} - ${token.size.small.track.width}) / 2));
                    height: ${token.size.small.track.height};
                    border-radius: ${token.size.small.track['border-radius']};
                `,
                handle: css`
                    width: ${token.size.small.handle.width};
                    height: ${token.size.small.handle.width};
                    inset-inline-start: ${token.size.small.handle.left};
                `,
                handleChecked: css`
                    translate: calc(${token.size.small.track.width} - ${token.size.small.handle.width} - ${token.size.small.handle.left} - ${token.size.small.handle.left}) 0;
                    &:dir(rtl) { translate: calc(-1 * (${token.size.small.track.width} - ${token.size.small.handle.width} - ${token.size.small.handle.left} - ${token.size.small.handle.left})) 0; }
                `,
            };
        } else {
            return {
                track: css`
                    ${vars['track.halo.left']}: calc(${token.size.medium.handle.left} + (${token.size.medium.handle.width} - ${token.track.halo.width}) / 2);
                    ${vars['track.halo.translate-checked']}: calc(${token.size.medium.track.width} - ${token.size.medium.handle.width} - 2 * ${token.size.medium.handle.left});
                    width: ${token.size.medium.track.width};
                    margin-inline: max(0px, calc((${token.root.touch['min-width']} - ${token.size.medium.track.width}) / 2));
                    height: ${token.size.medium.track.height};
                    border-radius: ${token.size.medium.track['border-radius']};
                `,
                handle: css`
                    width: ${token.size.medium.handle.width};
                    height: ${token.size.medium.handle.width};
                    inset-inline-start: ${token.size.medium.handle.left};
                `,
                handleChecked: css`
                    translate: calc(${token.size.medium.track.width} - ${token.size.medium.handle.width} - ${token.size.medium.handle.left} - ${token.size.medium.handle.left}) 0;
                    &:dir(rtl) { translate: calc(-1 * (${token.size.medium.track.width} - ${token.size.medium.handle.width} - ${token.size.medium.handle.left} - ${token.size.medium.handle.left})) 0; }
                `,
            };
        }
    };

    const sizeStyles = getSizeStyles();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (!e.defaultPrevented && !disabled) setChecked(!checked, e);
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
                )}
                onClick={handleClick}
            >
                <span
                    className={cx(
                        handleStyle,
                        sizeStyles.handle,
                        checked && sizeStyles.handleChecked,
                        checked && handleCheckedStyle,
                        disabled && !checked && handleDisabledStyle,
                        disabled && checked && handleDisabledCheckedStyle,
                    )}
                />
            </button>
            {children !== undefined && <span>{children}</span>}
        </label>
    );
};

export default Switch;
