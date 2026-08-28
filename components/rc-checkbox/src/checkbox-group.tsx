import { css, cx } from '@crab-dev/css';
import { type FC } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token from './token.js';
import type { CheckboxGroupProps } from './types.js';
import { CheckboxGroupContext } from './context.js';

const groupStyle = css`
    display: inline-flex;
    flex-wrap: wrap;
    gap: ${token.group.gap};
`;

const CheckboxGroup: FC<CheckboxGroupProps> = ({
    value: valueProp,
    defaultValue = [],
    onChange,
    disabled = false,
    size,
    children,
    className,
}) => {
    const [value, setValue] = useControllableValue<Array<string | number>>({
        value: valueProp,
        defaultValue,
        onChange,
    });

    const toggleValue = (val: string | number) => {
        const nextValue = value.includes(val)
            ? value.filter((v) => v !== val)
            : [...value, val];
        setValue(nextValue);
    };

    return (
        <CheckboxGroupContext value={{ value, disabled, size, toggleValue }}>
            <div className={cx(groupStyle, className)} role="group">
                {children}
            </div>
        </CheckboxGroupContext>
    );
};

export default CheckboxGroup;
