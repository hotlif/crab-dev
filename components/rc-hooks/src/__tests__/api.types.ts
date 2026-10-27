import { useControllableValue } from '../useControllableValue.js';

export function useTypedValue() {
    const [missing] = useControllableValue<string>({});
    // @ts-expect-error 未提供初值时，返回值可能是 undefined。
    const invalid: string = missing;
    const [present] = useControllableValue({ defaultValue: 'initial' });
    const valid: string = present;
    return { missing, invalid, valid };
}

import type { ChangeDetails, ControlledCheckedProps, ControlledOpenProps, ControlledValueProps } from '../controlled.js';
import { useControllableOpen } from '../useControllableOpen.js';

type Details = ChangeDetails<'input' | 'clear'>;

export function controlledApiContracts(value: string | undefined) {
    const readOnly: ControlledValueProps<string, Details> = { value: 'snapshot' };
    const forwarding: ControlledValueProps<string, Details> = { value };
    const initial: ControlledValueProps<string, Details> = { defaultValue: 'initial' };
    // @ts-expect-error A real controlled value and default value are mutually exclusive.
    const conflict: ControlledValueProps<string, Details> = { value: 'live', defaultValue: 'initial' };
    const readOnlyChecked: ControlledCheckedProps<Details> = { checked: true };
    // @ts-expect-error Boolean control and initial state are mutually exclusive.
    const checkedConflict: ControlledCheckedProps<Details> = { checked: true, defaultChecked: false };
    const readOnlyOpen: ControlledOpenProps<Details> = { open: true };
    // @ts-expect-error Open control and initial state are mutually exclusive.
    const openConflict: ControlledOpenProps<Details> = { open: true, defaultOpen: false };
    const [, setValue] = useControllableValue<string, [Details]>({ defaultValue: '' });
    // @ts-expect-error The hook value protocol has no legacy onChange callback alias.
    useControllableValue<string>({ defaultValue: '', onChange: (_value: string) => {} });
    setValue('next', { reason: 'input' });
    // @ts-expect-error User requests must provide typed details.
    setValue('next');
    const [, setOpen] = useControllableOpen<Details>({});
    setOpen(true, { reason: 'input' });
    // @ts-expect-error Open requests must provide typed details.
    setOpen(false);
    return { readOnly, forwarding, initial, conflict, readOnlyChecked, checkedConflict, readOnlyOpen, openConflict };
}
