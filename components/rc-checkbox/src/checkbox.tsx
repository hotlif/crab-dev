import { useComponentSize } from '@crab-dev/rc-config-provider';
import { css, cx } from '@crab-dev/css';
import { useRef, useEffect, type FC, type ChangeEvent } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token from './token.js';
import type { CheckboxProps } from './types.js';
import { useCheckboxGroup } from './context.js';
import { wrapperStyle, hiddenInputStyle, controlStyle, boxStyle, iconStyle, checkIconStyle, indeterminateIconStyle, labelStyle } from "./checkbox.styles.js";
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
    medium: {
        wrapper: css`font-size: ${token.size.medium.label['font-size']};`,
        box: css`
            width: ${token.size.medium.box.width};
            height: ${token.size.medium.box.width};
            border-radius: ${token.size.medium.box['border-radius']};
        `,
        icon: css`width: ${token.size.medium.icon.width}; height: ${token.size.medium.icon.width};`,
        indeterminate: css`width: ${token.size.medium.indeterminate.width}; height: ${token.size.medium.indeterminate.height};`,
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
    onCheckedChange,
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
        onValueChange: (next, event) => onCheckedChange?.(next, { reason: 'toggle', event }),
    });

    const checked = isInGroup ? group.value.includes(value) : standaloneChecked;
    const disabled = disabledProp ?? (group?.disabled ?? false);
    const state = indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked';

    useEffect(() => {
        if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate, checked]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        if (isInGroup) {
            group.toggleValue(value, event);
            onCheckedChange?.(event.target.checked, { reason: 'toggle', event: event });
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
