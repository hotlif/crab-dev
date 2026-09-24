import { useControllableValue } from '../useControllableValue.js';

export function useTypedValue() {
    const [missing] = useControllableValue<string>({});
    // @ts-expect-error 未提供初值时，返回值可能是 undefined。
    const invalid: string = missing;
    const [present] = useControllableValue({ defaultValue: 'initial' });
    const valid: string = present;
    return { missing, invalid, valid };
}
