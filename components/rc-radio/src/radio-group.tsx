import { css, cx } from '@crab-dev/css';
import { type FC } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token from './token.js';
import type { RadioGroupProps } from './types.js';
import { RadioGroupContext } from './context.js';

const groupStyle = css`
    display: inline-flex;
    flex-wrap: wrap;
    gap: ${token.group.gap};
`;

const RadioGroup: FC<RadioGroupProps> = ({
    value: valueProp,
    defaultValue,
    onChange,
    disabled = false,
    size,
    name,
    children,
    className,
}) => {
    const [value, setValue] = useControllableValue<string | number>({
        value: valueProp,
        defaultValue,
        onChange,
    });

    const selectValue = (val: string | number) => setValue(val);

    return (
        <RadioGroupContext value={{ value, disabled, size, name, selectValue }}>
            <div className={cx(groupStyle, className)} role="radiogroup">
                {children}
            </div>
        </RadioGroupContext>
    );
};

export default RadioGroup;
