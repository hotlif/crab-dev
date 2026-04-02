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
    color: ${token.checked.icon.color};
`;

const indeterminateIconStyle = css`
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
    size: sizeProp,
    onChange,
    value,
    children,
    className,
    ...restProps
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const group = useCheckboxGroup();
    const size = sizeProp ?? group?.size ?? 'middle';

    const getSizeStyle = () => {
        if (size === 'large') {
            return {
                wrapper: css`
                    font-size: ${token.size.large.label.font.size};
                `,
                box: css`
                    width: ${token.size.large.box.size};
                    height: ${token.size.large.box.size};
                    border-radius: ${token.size.large.box.border.radius};
                `,
                icon: css`
                    width: ${token.size.large.icon.size};
                    height: ${token.size.large.icon.size};
                `,
                indeterminate: css`
                    width: ${token.size.large.indeterminate.width};
                    height: ${token.size.large.indeterminate.height};
                `,
            };
        } else if (size === 'small') {
            return {
                wrapper: css`
                    font-size: ${token.size.small.label.font.size};
                `,
                box: css`
                    width: ${token.size.small.box.size};
                    height: ${token.size.small.box.size};
                    border-radius: ${token.size.small.box.border.radius};
                `,
                icon: css`
                    width: ${token.size.small.icon.size};
                    height: ${token.size.small.icon.size};
                `,
                indeterminate: css`
                    width: ${token.size.small.indeterminate.width};
                    height: ${token.size.small.indeterminate.height};
                `,
            };
        } else {
            return {
                wrapper: css`
                    font-size: ${token.size.middle.label.font.size};
                `,
                box: css`
                    width: ${token.size.middle.box.size};
                    height: ${token.size.middle.box.size};
                    border-radius: ${token.size.middle.box.border.radius};
                `,
                icon: css`
                    width: ${token.size.middle.icon.size};
                    height: ${token.size.middle.icon.size};
                `,
                indeterminate: css`
                    width: ${token.size.middle.indeterminate.width};
                    height: ${token.size.middle.indeterminate.height};
                `,
            };
        }
    };

    const sizeStyle = getSizeStyle();

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
            return <span className={cx(indeterminateIconStyle, sizeStyle.indeterminate, disabled && disabledIconStyle)} />;
        }
        if (checked) {
            return (
                <svg
                    className={cx(checkIconStyle, sizeStyle.icon, disabled && disabledIconStyle)}
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
            className={cx(wrapperStyle, sizeStyle.wrapper, className)}
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
                    sizeStyle.box,
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
