import { css, cx } from '@crab-dev/css';
import { type FC, type ChangeEvent } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token from './token.js';
import type { RadioProps } from './types.js';
import { useRadioGroup } from './context.js';

const wrapperStyle = css`
    position: relative;
    display: inline-flex;
    vertical-align: middle;
    align-items: center;
    max-width: 100%;
    gap: ${token.label.gap};
    cursor: pointer;
    color: ${token.label.color};
    line-height: ${token.root['line-height']};
    user-select: none;

    &:not([data-disabled]):hover > input + span::before {
        opacity: ${token['state-layer']['opacity-hover']};
    }
    &:not([data-disabled]):is(:hover, :active, :has(> input:focus-visible)) [data-radio-part='box'] {
        border-color: ${token.control['border-color-hover']};
    }

    > input:focus-visible + span {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }
    > input:focus-visible + span::before {
        opacity: ${token['state-layer']['opacity-focus']};
    }
    &:not([data-disabled]):active > input + span::before,
    > input:not(:disabled):active + span::before {
        opacity: ${token['state-layer']['opacity-active']};
    }

    &[data-state='checked'] {
        > input + span::before {
            background-color: ${token['state-layer']['color-selected']};
        }
        [data-radio-part='box'] {
            background-color: ${token.control.checked['background-color']};
            border-color: ${token.control.checked['border-color']};
        }
        &:not([data-disabled]):is(:hover, :active, :has(> input:focus-visible)) [data-radio-part='box'] {
            background-color: ${token.control.checked['background-color-hover']};
            border-color: ${token.control.checked['border-color']};
        }
        [data-radio-part='dot'] {
            opacity: 1;
            scale: ${token.dot.scale};
        }
    }

    &:not([data-disabled])[data-state]:has(> input[aria-invalid='true']) {
        > input + span::before { background-color: ${token['state-layer']['color-error']}; }
        [data-radio-part='box'] { border-color: ${token.control['border-color-error']}; }
        [data-radio-part='dot'] { background-color: ${token.dot['color-error']}; }
        > input:focus-visible + span { outline-color: ${token.control['border-color-error']}; }
    }

    &[data-disabled] {
        cursor: not-allowed;
        color: ${token.label['color-disabled']};
        opacity: ${token.root['opacity-disabled']};
        > input + span::before { opacity: 0; }
        [data-radio-part='box'] {
            background-color: ${token.control['background-color-disabled']};
            border-color: ${token.control['border-color-disabled']};
            transition: none;
        }
        [data-radio-part='dot'] {
            background-color: ${token.dot['color-disabled']};
            transition: none;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        [data-radio-part], > input + span::before { transition: none; }
    }
    @media (forced-colors: active) {
        color: CanvasText !important;
        > input + span::before { display: none; }
        > input:focus-visible + span { outline-color: Highlight !important; }
        &[data-state] [data-radio-part='box'] {
            forced-color-adjust: none;
            background-color: Canvas !important;
            border-color: CanvasText !important;
        }
        &[data-state='checked'] [data-radio-part='box'] { border-color: Highlight !important; }
        &[data-state] [data-radio-part='dot'] {
            forced-color-adjust: none;
            background-color: Highlight !important;
        }
        &[data-disabled] {
            opacity: 1;
            color: GrayText !important;
            &[data-state] [data-radio-part='box'] { border-color: GrayText !important; }
            [data-radio-part='dot'] { background-color: GrayText !important; }
        }
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

const controlStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: ${token.control.target.width};
    height: ${token.control.target.width};
    border-radius: ${token['state-layer']['border-radius']};

    &::before {
        content: '';
        position: absolute;
        width: ${token['state-layer'].width};
        height: ${token['state-layer'].width};
        border-radius: inherit;
        background-color: ${token['state-layer'].color};
        opacity: 0;
        pointer-events: none;
        transition: ${token['state-layer'].transition};
    }
    @media (pointer: coarse) {
        min-width: ${token.root.touch['min-width']};
        min-height: ${token.root.touch['min-height']};
    }
`;

const boxStyle = css`
    position: relative;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    border-width: ${token.control['border-width']};
    border-style: ${token.control['border-style']};
    border-color: ${token.control['border-color']};
    border-radius: ${token['state-layer']['border-radius']};
    background-color: ${token.control['background-color']};
    transition: ${token.control.transition};
`;

const dotStyle = css`
    /* The selection indicator must never contribute an inline-flex baseline. */
    position: absolute;
    border-radius: ${token['state-layer']['border-radius']};
    background-color: ${token.dot.checked.color};
    opacity: 0;
    scale: ${token.dot['scale-hidden']};
    pointer-events: none;
    transition: ${token.dot.transition};
`;

const labelStyle = css`
    min-width: 0;
    overflow-wrap: anywhere;
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

    return (
        <label
            className={cx(wrapperStyle, sizeStyle.wrapper, className)}
            data-disabled={disabled ? '' : undefined}
            data-state={checked ? 'checked' : 'unchecked'}
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
                aria-hidden="true"
                data-radio-part="control"
                className={controlStyle}
            >
                <span data-radio-part="box" className={cx(boxStyle, sizeStyle.box)}>
                    <span data-radio-part="dot" className={cx(dotStyle, sizeStyle.dot)} />
                </span>
            </span>
            {children !== undefined && <span className={labelStyle}>{children}</span>}
        </label>
    );
};

export default Radio;
