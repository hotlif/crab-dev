import type { PdfBuiltinMessage } from './pdf-messages.js';

const defaultActionLabel = Symbol('crab.pdf.default-action-label');
interface LabelCarrier { readonly label: string }
interface MarkedLabel extends LabelCarrier {
    readonly [defaultActionLabel]?: { readonly message: PdfBuiltinMessage; readonly original: string };
}

/** Mark only a newly allocated library action whose caller omitted the label. */
export function markDefaultActionLabel<Action extends LabelCarrier>(action: Action, message: PdfBuiltinMessage): Action {
    return Object.assign(action, { [defaultActionLabel]: { message, original: action.label } });
}

export function defaultActionMessage(action: LabelCarrier): PdfBuiltinMessage | undefined {
    // Internal symbol provenance, never a lookup of arbitrary caller label text.
    const metadata = (action as MarkedLabel)[defaultActionLabel];
    return metadata?.original === action.label ? metadata.message : undefined;
}

export function copyDefaultActionLabel<Action extends LabelCarrier>(source: LabelCarrier, action: Action): Action {
    const message = defaultActionMessage(source);
    return message ? markDefaultActionLabel(action, message) : action;
}
