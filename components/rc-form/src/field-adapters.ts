/** Explicit field protocol. Custom adapters keep their value and editor prop types. */
type ValueProp<TProps, TValue> = Extract<{
    [K in keyof TProps]-?: TValue extends TProps[K] ? K : never;
}[keyof TProps], string>;

type FieldCallback<TArgs extends unknown[]> = (...args: TArgs) => unknown;

type ChangeProp<TProps, TArgs extends unknown[]> = Extract<{
    [K in keyof TProps]-?: unknown extends TProps[K] ? K
        : NonNullable<TProps[K]> extends FieldCallback<TArgs> ? K : never;
}[keyof TProps], string>;

export interface FieldAdapter<TValue = unknown, TProps extends object = Record<string, unknown>, TArgs extends unknown[] = unknown[]> {
    readonly valueProp: ValueProp<TProps, TValue>;
    readonly changeProp: ChangeProp<TProps, TArgs>;
    readonly native?: boolean;
    getValue(...args: TArgs): TValue;
    /** Missing fields and reset values are represented by undefined. */
    getValueProps(value: TValue | undefined): Partial<TProps>;
}

export type FieldBinding = 'value' | 'checked' | 'native' | 'nativeChecked';

function nativeValue(value: unknown, checked: boolean): unknown {
    if (value === null || typeof value !== 'object' || !('target' in value)) {
        throw new TypeError('A native field adapter expects a DOM change event.');
    }
    const target = value.target;
    if (target === null || typeof target !== 'object') return undefined;
    return checked && 'checked' in target ? target.checked : 'value' in target ? target.value : undefined;
}

export const fieldAdapters: Readonly<Record<FieldBinding, FieldAdapter>> = {
    value: {
        valueProp: 'value', changeProp: 'onValueChange',
        getValue: value => value,
        getValueProps: value => ({ value }),
    },
    checked: {
        valueProp: 'checked', changeProp: 'onCheckedChange',
        getValue: value => Boolean(value),
        getValueProps: value => ({ checked: Boolean(value) }),
    },
    native: {
        valueProp: 'value', changeProp: 'onChange', native: true,
        getValue: event => nativeValue(event, false),
        getValueProps: value => ({ value: value ?? '' }),
    },
    nativeChecked: {
        valueProp: 'checked', changeProp: 'onChange', native: true,
        getValue: event => nativeValue(event, true),
        getValueProps: value => ({ checked: Boolean(value) }),
    },
};
