import { css, cx } from '@linaria/core';
import { useRef, useCallback, type FC } from 'react';
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
    const isControlled = valueProp !== undefined;
    const internalValueRef = useRef(defaultValue);

    const value = isControlled ? valueProp : internalValueRef.current;

    const selectValue = useCallback(
        (val: string | number) => {
            if (!isControlled) {
                internalValueRef.current = val;
            }

            onChange?.(val);
        },
        [isControlled, onChange],
    );

    return (
        <RadioGroupContext.Provider value={{ value, disabled, size, name, selectValue }}>
            <div className={cx(groupStyle, className)} role="radiogroup">
                {children}
            </div>
        </RadioGroupContext.Provider>
    );
};

export default RadioGroup;
