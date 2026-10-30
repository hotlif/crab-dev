import { useComponentSize } from '@crab-dev/rc-config-provider';
import { css, cx } from '@crab-dev/css';
import { type FC, type ChangeEvent } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token from './token.js';
import type { RadioProps } from './types.js';
import { useRadioGroup } from './context.js';
import { wrapperStyle, hiddenInputStyle, controlStyle, boxStyle, dotStyle, labelStyle } from "./radio.styles.js";
const Radio: FC<RadioProps> = ({
    checked: checkedProp,
    defaultChecked = false,
    disabled: disabledProp,
    size: sizeProp,
    onChange,
    onCheckedChange,
    value,
    children,
    className,
    ...restProps
}) => {
    const group = useRadioGroup();
    const size = useComponentSize(sizeProp ?? group?.size);

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
                    font-size: ${token.size.medium.label['font-size']};
                `,
                box: css`
                    width: ${token.size.medium.box.width};
                    height: ${token.size.medium.box.width};
                `,
                dot: css`
                    width: ${token.size.medium.dot.width};
                    height: ${token.size.medium.dot.width};
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
        onValueChange: (next, event) => onCheckedChange?.(next, { reason: 'toggle', event }),
    });

    const checked = isInGroup ? group.value === value : standaloneChecked;
    const disabled = disabledProp ?? (group?.disabled ?? false);
    const name = restProps.name ?? group?.name;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
        if (isInGroup) {
            group.selectValue(value, e);
            onCheckedChange?.(e.target.checked, { reason: 'toggle', event: e });
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
