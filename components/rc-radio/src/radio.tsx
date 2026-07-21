import { css, cx } from '@linaria/core';
import { type FC, type ChangeEvent } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token from './token.js';
import type { RadioProps } from './types.js';
import { useRadioGroup } from './context.js';

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
    border-width: ${token.border.width};
    border-style: ${token.border.style};
    border-color: ${token.border.color};
    border-radius: 50%;
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

const boxDisabledStyle = css`
    background-color: ${token.disabled.background.color};
    border-color: ${token.disabled.border.color};

    &:hover {
        border-color: ${token.disabled.border.color};
    }
`;

const dotStyle = css`
    border-radius: 50%;
    background-color: ${token.checked.dot.color};
`;

const dotDisabledStyle = css`
    background-color: ${token.disabled.dot.color};
`;

const Radio: FC<RadioProps> = ({
    checked: checkedProp,
    defaultChecked = false,
    disabled: disabledProp,
    size: sizeProp,
    onChange,
    value,
    children,
    className,
    ...restProps
}) => {
    const group = useRadioGroup();
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
                `,
                dot: css`
                    width: ${token.size.large.dot.size};
                    height: ${token.size.large.dot.size};
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
                `,
                dot: css`
                    width: ${token.size.small.dot.size};
                    height: ${token.size.small.dot.size};
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
                `,
                dot: css`
                    width: ${token.size.middle.dot.size};
                    height: ${token.size.middle.dot.size};
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

    const checked = isInGroup ? group.value === value : standaloneChecked;
    const disabled = disabledProp ?? (group?.disabled ?? false);
    const name = restProps.name ?? group?.name;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (isInGroup) {
            group.selectValue(value);
            onChange?.(e.target.checked, e);
        } else {
            setStandaloneChecked(e.target.checked, e);
        }
    };

    const renderDot = () => {
        if (checked) {
            return (
                <span
                    className={cx(
                        dotStyle,
                        sizeStyle.dot,
                        disabled && dotDisabledStyle,
                    )}
                />
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
                name={name}
                type="radio"
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
                    checked && boxCheckedStyle,
                    disabled && boxDisabledStyle,
                )}
            >
                {renderDot()}
            </span>
            {children !== undefined && <span>{children}</span>}
        </label>
    );
};

export default Radio;
