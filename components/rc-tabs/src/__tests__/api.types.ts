import type { TabsProps } from '../types.js';

export function verifyStateContract(): { readOnly: TabsProps; conflicting: TabsProps } {
    const readOnly: TabsProps = { value: 'one', items: [] };
    // @ts-expect-error Controlled state and its initial default are mutually exclusive.
    const conflicting: TabsProps = { value: 'one', defaultValue: 'two', items: [] };
    return { readOnly, conflicting };
}
