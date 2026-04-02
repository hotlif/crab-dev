import { css, cx } from '@linaria/core';
import { useRef, useEffect, type FC, type ChangeEvent } from 'react';
import token from './token.js';
import type { CheckboxProps } from './types.js';
import { useCheckboxGroup } from './context.js';

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

const hiddenInputStyle = css`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;

const boxStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.box.size};
    height: ${token.box.size};
    border-radius: ${token.box.border.radius};
    border-width: ${token.border.width};
    border-style: ${token.border.style};
    border-color: ${token.border.color};
    background-color: ${token.background.color};
    transition: ${token.transition};
    flex-shrink: 0;

    &:hover {
        border-color: ${token.border['color-hover']};
    }
`;

const boxCheckedStyle = css`
    background-color: ${token.checked.background.color};
    border-color: ${token.checked.border.color};

    &:hover {
        background-color: ${token.checked.background['color-hover']};
    }
`;

const boxIndeterminateStyle = css`
    background-color: ${token.indeterminate.background.color};
    border-color: ${token.indeterminate.border.color};
`;

const boxDisabledStyle = css`
    background-color: ${token.disabled.background.color};
    border-color: ${token.disabled.border.color};

    &:hover {
        border-color: ${token.disabled.border.color};
    }
`;

const checkIconStyle = css`
    width: 12px;
    height: 12px;
    color: ${token.checked.icon.color};
`;

const indeterminateIconStyle = css`
    width: 8px;
    height: 2px;
    background-color: ${token.indeterminate.icon.color};
    border-radius: 1px;
`;

const disabledIconStyle = css`
    color: ${token.disabled.icon.color};
`;

const Checkbox: FC<CheckboxProps> = ({
    checked: checkedProp,
    defaultChecked = false,
    indeterminate = false,
    disabled: disabledProp,
    onChange,
    value,
    children,
    className,
    ...restProps
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const group = useCheckboxGroup();

    const isInGroup = group !== null && value !== undefined;
    const isControlled = checkedProp !== undefined || isInGroup;

    const getChecked = () => {
        if (isInGroup) {
            return group.value.includes(value);
        }
        return checkedProp;
    };

    const internalCheckedRef = useRef(defaultChecked);

    const checked = isControlled ? getChecked()! : internalCheckedRef.current;
    const disabled = disabledProp ?? (group?.disabled ?? false);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nextChecked = e.target.checked;

        if (!isControlled) {
            internalCheckedRef.current = nextChecked;
        }

        if (isInGroup) {
            group.toggleValue(value);
        }

        onChange?.(nextChecked, e);
    };

    const renderCheckIcon = () => {
        if (indeterminate) {
            return <span className={cx(indeterminateIconStyle, disabled && disabledIconStyle)} />;
        }
        if (checked) {
            return (
                <svg
                    className={cx(checkIconStyle, disabled && disabledIconStyle)}
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="2 6 5 9 10 3" />
                </svg>
            );
        }
        return null;
    };

    return (
        <label
            className={cx(wrapperStyle, className)}
            data-disabled={disabled ? '' : undefined}
        >
            <input
                {...restProps}
                ref={inputRef}
                type="checkbox"
                className={hiddenInputStyle}
                checked={checked}
                disabled={disabled}
                onChange={handleChange}
                value={value}
            />
            <span
                className={cx(
                    boxStyle,
                    checked && !indeterminate && boxCheckedStyle,
                    indeterminate && boxIndeterminateStyle,
                    disabled && boxDisabledStyle,
                )}
            >
                {renderCheckIcon()}
            </span>
            {children !== undefined && <span>{children}</span>}
        </label>
    );
};

export default Checkbox;
