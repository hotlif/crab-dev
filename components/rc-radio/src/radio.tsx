import { css, cx } from '@crab-dev/css';
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
    line-height: ${token.root['line-height']};
    user-select: none;

    > input:focus-visible + span {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }
    @media (pointer: coarse) {
        min-width: ${token.root.touch['min-width']};
        min-height: ${token.root.touch['min-height']};
    }
    @media (forced-colors: active) {
        > input + span {
            forced-color-adjust: none;
            background: Canvas;
            border-color: CanvasText;
            color: CanvasText;
            > svg { color: inherit; }
            > span { background: currentColor; }
        }
        > input:checked + span {
            background: Highlight;
            border-color: Highlight;
            color: HighlightText;
        }
        > input:disabled + span {
            background: Canvas;
            border-color: GrayText;
            color: GrayText;
        }
        > input:focus-visible + span { outline-color: Highlight; }
    }

    &[data-disabled] {
        cursor: not-allowed;
        pointer-events: none;
        color: ${token.label['color-disabled']};
        opacity: ${token.root['opacity-disabled']};
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
    border-radius: 50%;
    background-color: ${token.control['background-color']};
    transition: ${token.control.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
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

const boxDisabledStyle = css`
    background-color: ${token.control['background-color-disabled']};
    border-color: ${token.control['border-color-disabled']};

    &:hover {
        border-color: ${token.control['border-color-disabled']};
    }
`;

const dotStyle = css`
    border-radius: 50%;
    background-color: ${token.dot.checked.color};
`;

const dotDisabledStyle = css`
    background-color: ${token.dot['color-disabled']};
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
                    font-size: ${token.size.large.label['font-size']};
                `,
                box: css`
                    width: ${token.size.large.box.width};
                    height: ${token.size.large.box.width};
                `,
                dot: css`
                    width: ${token.size.large.dot.width};
                    height: ${token.size.large.dot.width};
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
                `,
                dot: css`
                    width: ${token.size.small.dot.width};
                    height: ${token.size.small.dot.width};
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
                `,
                dot: css`
                    width: ${token.size.middle.dot.width};
                    height: ${token.size.middle.dot.width};
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
