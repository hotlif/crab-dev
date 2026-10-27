/** Semantic change metadata; each component narrows its reason union. */
export interface ChangeDetails<R extends string = string, E = Event> {
    readonly reason: R;
    readonly event?: E;
}

export type ControlledValueProps<T, D> =
    | { value?: T; defaultValue?: never; onValueChange?: (value: T, details: D) => void }
    | { value?: never; defaultValue?: T; onValueChange?: (value: T, details: D) => void };

export type ControlledCheckedProps<D> =
    | { checked?: boolean; defaultChecked?: never; onCheckedChange?: (checked: boolean, details: D) => void }
    | { checked?: never; defaultChecked?: boolean; onCheckedChange?: (checked: boolean, details: D) => void };

export type ControlledOpenProps<D> =
    | { open?: boolean; defaultOpen?: never; onOpenChange?: (open: boolean, details: D) => void }
    | { open?: never; defaultOpen?: boolean; onOpenChange?: (open: boolean, details: D) => void };
