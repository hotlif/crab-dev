import type { LineEditProps } from '../lineEdit.js';

export function verifyStateContract(): { readOnly: LineEditProps; conflicting: LineEditProps } {
    const readOnly: LineEditProps = { value: 'snapshot' };
    // @ts-expect-error Controlled state and its initial default are mutually exclusive.
    const conflicting: LineEditProps = { value: 'live', defaultValue: 'initial' };
    return { readOnly, conflicting };
}
