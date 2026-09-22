import { css, cx } from '@crab-dev/css';
import type { FC, KeyboardEvent } from 'react';
import token from './token.js';
import type { CheckableTagProps } from './types.js';

const baseStyle = css`
    &:focus-visible { outline: ${token.interaction['outline-width-focus']} solid ${token.interaction['outline-color-focus']}; outline-offset: ${token.interaction['outline-offset-focus']}; }
    @media (pointer: coarse) { min-width: ${token.interaction.touch['min-width']}; min-height: ${token.interaction.touch['min-height']}; }
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) { &:focus-visible { outline-color: Highlight; } }

    display: inline-flex;
    position: relative;
    isolation: isolate;
    overflow: hidden;
    align-items: center;
    box-sizing: border-box;
    white-space: nowrap;
    line-height: 1;
    vertical-align: middle;
    height: ${token.size.middle.height};
    padding: ${token.size.middle.padding};
    border-radius: ${token.size.middle['border-radius']};
    gap: ${token.size.middle.gap};
    border: 1px solid ${token.default['border-color']};
    font-size: ${token.size.middle['font-size']};
    cursor: pointer;
    user-select: none;
    transition: ${token.root.transition};
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        border-radius: inherit;
        background: currentColor;
        opacity: 0;
        transition: opacity ${token.checkable.state.transition};
    }
    &:hover:not([aria-disabled="true"])::after { opacity: ${token.checkable.state['opacity-hover']}; }
    &:focus-visible:not([aria-disabled="true"])::after { opacity: ${token.checkable.state['opacity-focus']}; }
    &:active:not([aria-disabled="true"])::after { opacity: ${token.checkable.state['opacity-active']}; }
    &[aria-disabled="true"] {
        cursor: not-allowed;
        opacity: ${token.checkable['opacity-disabled']};
    }
`;

const checkedStyle = css`
    color: ${token.checkable['color-selected']};
    background-color: ${token.checkable['background-color-selected']};
    border-color: ${token.checkable['border-color-selected']};
`;

const uncheckedStyle = css`
    color: ${token.default.color};
    background-color: ${token.default['background-color']};
    border-color: ${token.default['border-color']};
`;

const iconStyle = css`
    display: inline-flex;
    align-items: center;
    > svg { width: ${token.checkable.icon.width}; height: ${token.checkable.icon.width}; }
`;

const SelectedIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-role="selected-icon">
        <path d="m5 12 4 4L19 6" />
    </svg>
);

const CheckableTag: FC<CheckableTagProps> = ({
    checked,
    onChange,
    icon,
    disabled = false,
    className,
    children,
    onClick,
    ...restProps
}) => {
    const handleToggle = () => {
        if (disabled) {
            return;
        }
        onChange?.(!checked);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
        }
    };

    return (
        <span
            {...restProps}
            role="checkbox"
            aria-checked={checked}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : 0}
            className={cx(baseStyle, checked ? checkedStyle : uncheckedStyle, className)}
            onClick={(e) => {
                onClick?.(e);
                handleToggle();
            }}
            onKeyDown={handleKeyDown}
        >
            {checked || icon ? <span className={iconStyle}>{checked ? <SelectedIcon /> : icon}</span> : null}
            <span>{children}</span>
        </span>
    );
};

export default CheckableTag;
