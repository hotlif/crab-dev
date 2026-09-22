import { createContext, use, type ComponentProps } from 'react';
import { BUILTIN_ACTIONS, type PdfEditorActionId } from './actions.js';
import type { PdfEditorActionVisibility } from './types.js';
import ToolbarButton from './toolbar-button.js';

export const ActionVisibilityContext = createContext<PdfEditorActionVisibility>({});

export default function ActionButton({ action, ...props }: Omit<ComponentProps<typeof ToolbarButton>, 'label' | 'icon'> & { action: PdfEditorActionId }) {
    const visibility = use(ActionVisibilityContext);
    if (visibility[action] === false) return null;
    const definition = BUILTIN_ACTIONS[action];
    return <ToolbarButton {...props} label={definition.label} icon={definition.icon} />;
}
