import { css, cx } from '@crab-dev/css';
import { useRef, useEffect, type FC, type ChangeEvent } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token from './token.js';
import type { CheckboxProps } from './types.js';
import { useCheckboxGroup } from './context.js';

const wrapperStyle = css`
    position: relative;
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
    border-width: ${token.control['border-width']};
    border-style: ${token.control['border-style']};
    border-color: ${token.control['border-color']};
    background-color: ${token.control['background-color']};
    transition: ${token.control.transition};
    flex-shrink: 0;

    &:hover {
        border-color: ${token.control['border-color-hover']};
    }
`;

const boxCheckedStyle = css`
    background-color: ${token.control.checked['background-color']};
    border-color: ${token.control.checked['border-color']};

    &:hover {
        background-color: ${token.control.checked['background-color-hover']};
    }
`;

const boxIndeterminateStyle = css`
    background-color: ${token.control.indeterminate['background-color']};
    border-color: ${token.control.indeterminate['border-color']};
`;

const boxDisabledStyle = css`
    background-color: ${token.control['background-color-disabled']};
    border-color: ${token.control['border-color-disabled']};

    &:hover {
        border-color: ${token.control['border-color-disabled']};
    }
`;

const checkIconStyle = css`
    color: ${token.icon.checked.color};
`;

const indeterminateIconStyle = css`
    background-color: ${token.icon.indeterminate.color};
    border-radius: 1px;
`;

const disabledIconStyle = css`
    color: ${token.icon['color-disabled']};
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
                    font-size: ${token.size.large.label['font-size']};
                `,
                box: css`
                    width: ${token.size.large.box.width};
                    height: ${token.size.large.box.width};
                    border-radius: ${token.size.large.box['border-radius']};
                `,
                icon: css`
                    width: ${token.size.large.icon.width};
                    height: ${token.size.large.icon.width};
                `,
                indeterminate: css`
                    width: ${token.size.large.indeterminate.width};
                    height: ${token.size.large.indeterminate.height};
                `,
            };
        } else if (size === 'small') {
            return {
                wrapper: css`
                    font-size: ${token.size.small.label['font-size']};
                `,
                box: css`
                    width: ${token.size.small.box.width};
                    height: ${token.size.small.box.width};
                    border-radius: ${token.size.small.box['border-radius']};
                `,
                icon: css`
                    width: ${token.size.small.icon.width};
                    height: ${token.size.small.icon.width};
                `,
                indeterminate: css`
                    width: ${token.size.small.indeterminate.width};
                    height: ${token.size.small.indeterminate.height};
                `,
            };
        } else {
            return {
                wrapper: css`
                    font-size: ${token.size.middle.label['font-size']};
                `,
                box: css`
                    width: ${token.size.middle.box.width};
                    height: ${token.size.middle.box.width};
                    border-radius: ${token.size.middle.box['border-radius']};
                `,
                icon: css`
                    width: ${token.size.middle.icon.width};
                    height: ${token.size.middle.icon.width};
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

    // 独立模式的受控 / 非受控选中态；group 模式下选中态由 group.value 决定，此值不参与
    const [standaloneChecked, setStandaloneChecked] = useControllableValue<
        boolean,
        [ChangeEvent<HTMLInputElement>]
    >({
        value: checkedProp,
        defaultValue: defaultChecked,
        onChange,
    });

    const checked = isInGroup ? group.value.includes(value) : standaloneChecked;
    const disabled = disabledProp ?? (group?.disabled ?? false);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (isInGroup) {
            group.toggleValue(value);
            onChange?.(e.target.checked, e);
        } else {
            setStandaloneChecked(e.target.checked, e);
        }
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
