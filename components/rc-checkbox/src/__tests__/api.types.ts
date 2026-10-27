import type { CheckboxProps } from '../types.js';

export function verifyStateContract(): { readOnly: CheckboxProps; conflicting: CheckboxProps } {
    const readOnly: CheckboxProps = { checked: true, children: 'Choice' };
    // @ts-expect-error Controlled state and its initial default are mutually exclusive.
    const conflicting: CheckboxProps = { checked: true, defaultChecked: false, children: 'Choice' };
    return { readOnly, conflicting };
}
