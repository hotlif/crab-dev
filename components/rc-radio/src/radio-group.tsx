import { css, cx } from '@crab-dev/css';
import { useId, type FC, type ChangeEvent } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token from './token.js';
import type { RadioGroupProps, RadioGroupChangeDetails } from './types.js';
import { RadioGroupContext } from './context.js';

const groupStyle = css`
    display: inline-flex;
    flex-wrap: wrap;
    gap: ${token.group.gap};
`;

const RadioGroup: FC<RadioGroupProps> = ({
    value: valueProp,
    defaultValue,
    onValueChange,
    disabled = false,
    size,
    name,
    children,
    className,
    ...restProps
}) => {
    // Native arrow navigation must stay within this group, including unnamed groups.
    const generatedName = useId();
    const groupName = name || generatedName;
    const [value, setValue] = useControllableValue<string | number, [RadioGroupChangeDetails]>({
        value: valueProp,
        defaultValue,
        onValueChange,
    });

    const selectValue = (val: string | number, event: ChangeEvent<HTMLInputElement>) => setValue(val, { reason: 'select', event });

    return (
        <RadioGroupContext value={{ value, disabled, size, name: groupName, selectValue }}>
            <div {...restProps} className={cx(groupStyle, className)} role="radiogroup">
                {children}
            </div>
        </RadioGroupContext>
    );
};

export default RadioGroup;
