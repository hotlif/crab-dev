import { css, cx } from '@crab-dev/css';
import { type FC, type ChangeEvent } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token from './token.js';
import type { CheckboxGroupProps, CheckboxGroupChangeDetails } from './types.js';
import { CheckboxGroupContext } from './context.js';

const groupStyle = css`
    display: inline-flex;
    flex-wrap: wrap;
    gap: ${token.group.gap};
`;

const CheckboxGroup: FC<CheckboxGroupProps> = ({
    value: valueProp,
    defaultValue = [],
    onValueChange,
    disabled = false,
    size,
    children,
    className,
    ...restProps
}) => {
    const [value, setValue] = useControllableValue<Array<string | number>, [CheckboxGroupChangeDetails]>({
        value: valueProp,
        defaultValue,
        onValueChange,
    });

    const toggleValue = (val: string | number, event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = value.includes(val)
            ? value.filter((v) => v !== val)
            : [...value, val];
        setValue(nextValue, { reason: value.includes(val) ? 'deselect' : 'select', event });
    };

    return (
        <CheckboxGroupContext value={{ value, disabled, size, toggleValue }}>
            <div {...restProps} className={cx(groupStyle, className)} role="group">
                {children}
            </div>
        </CheckboxGroupContext>
    );
};

export default CheckboxGroup;
