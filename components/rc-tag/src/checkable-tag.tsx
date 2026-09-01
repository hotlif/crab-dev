import { css, cx } from '@crab-dev/css';
import type { FC, KeyboardEvent } from 'react';
import token from './token.js';
import type { CheckableTagProps } from './types.js';

const baseStyle = css`
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    white-space: nowrap;
    line-height: 1;
    vertical-align: middle;
    height: ${token.size.middle.height};
    padding: ${token.size.middle.padding};
    border-radius: ${token.size.middle.border.radius};
    gap: ${token.size.middle.gap};
    border: 1px solid ${token.default['border-color']};
    font-size: ${token.size.middle.font.size};
    cursor: pointer;
    user-select: none;
    transition: ${token.transition};
`;

const checkedStyle = css`
    color: ${token.primary.color};
    background-color: ${token.primary.background.color};
    border-color: ${token.primary['border-color']};
`;

const uncheckedStyle = css`
    color: ${token.default.color};
    background-color: ${token.default.background.color};
    border-color: ${token.default['border-color']};
`;

const iconStyle = css`
    display: inline-flex;
    align-items: center;
    > svg { width: 1em; height: 1em; }
`;

const CheckableTag: FC<CheckableTagProps> = ({
    checked,
    onChange,
    icon,
    className,
    children,
    onClick,
    ...restProps
}) => {
    const handleToggle = () => {
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
            tabIndex={0}
            className={cx(baseStyle, checked ? checkedStyle : uncheckedStyle, className)}
            onClick={(e) => {
                onClick?.(e);
                handleToggle();
            }}
            onKeyDown={handleKeyDown}
        >
            {icon ? <span className={iconStyle}>{icon}</span> : null}
            <span>{children}</span>
        </span>
    );
};

export default CheckableTag;
