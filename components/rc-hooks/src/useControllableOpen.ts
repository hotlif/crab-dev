import type { ChangeDetails } from './controlled.js';
import { useControllableValue } from './useControllableValue.js';

export interface ControllableOpenOptions<D = ChangeDetails<'trigger'>> {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, details: D) => void;
}

/** Default state initializes once; only an explicit request with metadata notifies. */
export function useControllableOpen<D = ChangeDetails<'trigger'>>(
    options: ControllableOpenOptions<D>,
): readonly [boolean, (open: boolean, details: D) => void] {
    const { open, defaultOpen = false, onOpenChange } = options;
    return useControllableValue<boolean, [details: D]>({
        value: open,
        defaultValue: defaultOpen,
        onValueChange: onOpenChange,
    });
}
