import { useComponentSize } from '@crab-dev/rc-config-provider';
import { css, cx } from '@crab-dev/css';
import { useRef, useEffect, type FC, type ChangeEvent } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token from './token.js';
import type { CheckboxProps } from './types.js';
import { useCheckboxGroup } from './context.js';

const wrapperStyle = css`
    position: relative;
    display: inline-flex;
    /* Icon transitions must not change the component's inline alignment. */
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
    &:not([data-disabled]):hover [data-checkbox-part='box'] {
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

    &:is([data-state='checked'], [data-state='indeterminate']) {
        > input + span::before {
            background-color: ${token['state-layer']['color-selected']};
        }
        [data-checkbox-part='box'] {
            background-color: ${token.control.checked['background-color']};
            border-color: ${token.control.checked['border-color']};
        }
        &:not([data-disabled]):hover [data-checkbox-part='box'] {
            background-color: ${token.control.checked['background-color-hover']};
            border-color: ${token.control.checked['border-color']};
        }
    }
    &[data-state='checked'] [data-checkbox-part='checkmark'],
    &[data-state='indeterminate'] [data-checkbox-part='indeterminate'] {
        opacity: 1;
        scale: ${token.icon.scale};
    }
    &[data-state='indeterminate'] [data-checkbox-part='box'] {
        background-color: ${token.control.indeterminate['background-color']};
        border-color: ${token.control.indeterminate['border-color']};
    }

    &:not([data-disabled]):has(> input[aria-invalid='true']) {
        > input + span::before { background-color: ${token['state-layer']['color-error']}; }
        [data-checkbox-part='box'] { border-color: ${token.control['border-color-error']}; }
        > input:focus-visible + span { outline-color: ${token.control['border-color-error']}; }
        &:is([data-state='checked'], [data-state='indeterminate']) {
            [data-checkbox-part='box'] { background-color: ${token.control['background-color-error']}; }
            [data-checkbox-part='checkmark'] { color: ${token.icon['color-error']}; }
            [data-checkbox-part='indeterminate'] { background-color: ${token.icon['color-error']}; }
        }
    }

    &[data-disabled] {
        cursor: not-allowed;
        color: ${token.label['color-disabled']};
        opacity: ${token.root['opacity-disabled']};
        > input + span { pointer-events: none; }
        > input + span::before { opacity: 0; }
        [data-checkbox-part='box'] {
            background-color: ${token.control['background-color-disabled']};
            border-color: ${token.control['border-color-disabled']};
            transition: none;
        }
        &:is([data-state='checked'], [data-state='indeterminate']) [data-checkbox-part='box'] {
            background-color: ${token.control.selection['background-color-disabled']};
        }
        [data-checkbox-part='checkmark'] { color: ${token.icon['color-disabled']}; transition: none; }
        [data-checkbox-part='indeterminate'] { background-color: ${token.icon['color-disabled']}; transition: none; }
    }

    @media (prefers-reduced-motion: reduce) {
        [data-checkbox-part], > input + span::before { transition: none; }
    }
    @media (forced-colors: active) {
        color: CanvasText !important;
        > input + span::before { display: none; }
        > input:focus-visible + span { outline-color: Highlight !important; }
        &[data-state] [data-checkbox-part='box'] {
            forced-color-adjust: none;
            background-color: Canvas !important;
            border-color: CanvasText !important;
        }
        &:is([data-state='checked'], [data-state='indeterminate']) [data-checkbox-part='box'] {
            background-color: Highlight !important;
            border-color: Highlight !important;
        }
        &[data-state] [data-checkbox-part='checkmark'] { color: HighlightText !important; }
        &[data-state] [data-checkbox-part='indeterminate'] { background-color: HighlightText !important; }
        &[data-disabled] {
            opacity: 1;
            color: GrayText !important;
            &[data-state] [data-checkbox-part='box'] { border-color: GrayText !important; }
            &:is([data-state='checked'], [data-state='indeterminate']) [data-checkbox-part='box'] { background-color: GrayText !important; }
            [data-checkbox-part='checkmark'] { color: Canvas !important; }
            [data-checkbox-part='indeterminate'] { background-color: Canvas !important; }
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
    border: ${token.control['border-width']} ${token.control['border-style']} ${token.control['border-color']};
    background-color: ${token.control['background-color']};
    transition: ${token.control.transition};
`;

const iconStyle = css`
    position: absolute;
    opacity: 0;
    scale: ${token.icon['scale-hidden']};
    pointer-events: none;
    transition: ${token.icon.transition};
`;
const checkIconStyle = css`
    color: ${token.icon.checked.color};
    stroke-width: ${token.icon['stroke-width']};
`;
const indeterminateIconStyle = css`
    background-color: ${token.icon.indeterminate.color};
`;
const labelStyle = css`
    min-width: 0;
    overflow-wrap: anywhere;
`;

const sizeStyles = {
    large: {
        wrapper: css`font-size: ${token.size.large.label['font-size']};`,
        box: css`
            width: ${token.size.large.box.width};
            height: ${token.size.large.box.width};
            border-radius: ${token.size.large.box['border-radius']};
        `,
        icon: css`width: ${token.size.large.icon.width}; height: ${token.size.large.icon.width};`,
        indeterminate: css`width: ${token.size.large.indeterminate.width}; height: ${token.size.large.indeterminate.height};`,
    },
    middle: {
        wrapper: css`font-size: ${token.size.middle.label['font-size']};`,
        box: css`
            width: ${token.size.middle.box.width};
            height: ${token.size.middle.box.width};
            border-radius: ${token.size.middle.box['border-radius']};
        `,
        icon: css`width: ${token.size.middle.icon.width}; height: ${token.size.middle.icon.width};`,
        indeterminate: css`width: ${token.size.middle.indeterminate.width}; height: ${token.size.middle.indeterminate.height};`,
    },
    small: {
        wrapper: css`font-size: ${token.size.small.label['font-size']};`,
        box: css`
            width: ${token.size.small.box.width};
            height: ${token.size.small.box.width};
            border-radius: ${token.size.small.box['border-radius']};
        `,
        icon: css`width: ${token.size.small.icon.width}; height: ${token.size.small.icon.width};`,
        indeterminate: css`width: ${token.size.small.indeterminate.width}; height: ${token.size.small.indeterminate.height};`,
    },
};

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
    // DOM instance used to synchronize the native mixed state after commits.
    const inputRef = useRef<HTMLInputElement>(null);
    const group = useCheckboxGroup();
    const size = useComponentSize(sizeProp ?? group?.size);
    const sizeStyle = sizeStyles[size];
    const isInGroup = group !== null && value !== undefined;

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
    const state = indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked';

    useEffect(() => {
        if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate, checked]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (isInGroup) {
            group.toggleValue(value);
            onChange?.(event.target.checked, event);
        } else {
            setStandaloneChecked(event.target.checked, event);
        }
    };

    return (
        <label
            className={cx(wrapperStyle, sizeStyle.wrapper, className)}
            data-state={state}
            data-disabled={disabled ? '' : undefined}
        >
            <input
                {...restProps}
                ref={inputRef}
                type="checkbox"
                className={hiddenInputStyle}
                checked={checked}
                aria-checked={indeterminate ? 'mixed' : checked}
                disabled={disabled}
                onChange={handleChange}
                value={value}
            />
            <span className={controlStyle} aria-hidden="true" data-checkbox-part="control">
                <span className={cx(boxStyle, sizeStyle.box)} data-checkbox-part="box">
                    <svg
                        className={cx(iconStyle, checkIconStyle, sizeStyle.icon)}
                        data-checkbox-part="checkmark"
                        aria-hidden="true"
                        focusable="false"
                        viewBox="0 0 18 18"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="butt"
                        strokeLinejoin="miter"
                    >
                        <polyline points="3.5 9 7 12.5 14.5 5" />
                    </svg>
                    <span className={cx(iconStyle, indeterminateIconStyle, sizeStyle.indeterminate)} data-checkbox-part="indeterminate" />
                </span>
            </span>
            {children !== undefined && <span className={labelStyle}>{children}</span>}
        </label>
    );
};

export default Checkbox;
