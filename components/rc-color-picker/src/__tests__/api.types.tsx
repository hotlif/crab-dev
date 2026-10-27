import ColorPicker from '../colorPicker/colorPicker.js';
import type { OKLCHValue } from '../types.js';

export function checkColorPickerTypes(value: OKLCHValue) {
    const controlled = <ColorPicker value={value} onValueChange={(_next, details) => { const reason: 'choose' | 'clear' | 'confirm' = details.reason; return reason; }} />;
    const uncontrolled = <ColorPicker defaultValue={value} />;
    const initialOpen = <ColorPicker defaultOpen />;
    // @ts-expect-error Controlled values and defaults are mutually exclusive.
    const conflicting = <ColorPicker value={value} defaultValue={value} />;
    // @ts-expect-error Controlled visibility and initial visibility are mutually exclusive.
    const conflictingOpen = <ColorPicker open defaultOpen />;
    return { controlled, uncontrolled, initialOpen, conflicting, conflictingOpen };
}
