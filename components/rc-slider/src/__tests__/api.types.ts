import type { SliderProps } from '../slider.js';

export function verifyStateContract(): { readOnly: SliderProps; conflicting: SliderProps } {
    const readOnly: SliderProps = { value: 10 };
    // @ts-expect-error Controlled state and its initial default are mutually exclusive.
    const conflicting: SliderProps = { value: 10, defaultValue: 0 };
    return { readOnly, conflicting };
}
