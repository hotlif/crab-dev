import { css, cx } from '@linaria/core';
import { useRef, useCallback, type FC } from 'react';
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
    children,
    className,
}) => {
    const isControlled = valueProp !== undefined;
    const internalValueRef = useRef(defaultValue);

    const value = isControlled ? valueProp : internalValueRef.current;

    const toggleValue = useCallback(
        (val: string | number) => {
            const nextValue = value.includes(val)
                ? value.filter((v) => v !== val)
                : [...value, val];

            if (!isControlled) {
                internalValueRef.current = nextValue;
            }

            onChange?.(nextValue);
        },
        [value, isControlled, onChange],
    );

    return (
        <CheckboxGroupContext.Provider value={{ value, disabled, toggleValue }}>
            <div className={cx(groupStyle, className)} role="group">
                {children}
            </div>
        </CheckboxGroupContext.Provider>
    );
};

export default CheckboxGroup;
