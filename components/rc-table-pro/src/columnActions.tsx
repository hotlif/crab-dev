import { useId, useLayoutEffect, useRef } from 'react';
import { css } from '@crab-dev/css';
import Button, { TokenVars as buttonVars } from '@crab-dev/rc-button';
import DropdownContainer, { useDropdownContext } from '@crab-dev/rc-dropdown-container';
import token from './token.js';
import { useLocale } from '@crab-dev/rc-config-provider';

interface ColumnActionsProps {
    name: string | number;
    label: string;
    fixed?: 'left' | 'right';
    sortable: boolean;
    onPinChange?: (name: string | number, fixed: 'left' | 'right' | undefined) => void;
    onSortableChange?: (name: string | number, sortable: boolean) => void;
}

function isElementRoot(node: Node): node is Document | ShadowRoot {
    return node.nodeType === 9 || (node.nodeType === 11 && 'host' in node);
}

const triggerStyle = css`
    ${buttonVars['text.color']}: ${token.icon.color};
    ${buttonVars['text.background-color-hover']}: ${token.icon['background-color-hover']};
    ${buttonVars['text.background-color-focus']}: ${token.icon['background-color-focus']};
    ${buttonVars['text.background-color-active']}: ${token.icon['background-color-pressed']};
    && { width: ${token.column.actions.width}; height: ${token.column.actions.width}; }
    @media (pointer: coarse) { && { width: ${token.control.target.width}; height: ${token.control.target.width}; } }
`;
const containerStyle = css`flex-shrink: 0;`;
const panelStyle = css`
    display: flex; flex-direction: column;
    width: ${token.column.actions.panel.width}; max-width: 100%;
    padding: ${token.toolbar.padding}; gap: ${token.toolbar.gap};
    & > button { justify-content: flex-start; min-height: ${token.control.target.width}; }
`;

function Trigger({ id, panelId, label }: { id: string; panelId: string; label: string }) {
    const { messages } = useLocale();
    const { state, dispatch, refs } = useDropdownContext<HTMLButtonElement>();
    return <Button ref={refs.setReference} id={id} type="button" aria-label={messages.tablePro.columnActions(label)} title={messages.tablePro.columnActions(label)}
        aria-expanded={state.open} aria-controls={state.open ? panelId : undefined}
        appearance="text" shape="circle" size="xs" className={triggerStyle}
        icon={<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>}
        onPointerDown={event => event.stopPropagation()}
        onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') event.stopPropagation(); }}
        onClick={event => { event.stopPropagation(); dispatch({ type: 'setOpen', payload: !state.open }); }} />;
}

function Actions({ id, triggerId, name, label, fixed, sortable, onPinChange, onSortableChange }: ColumnActionsProps & { id: string; triggerId: string }) {
    const { messages } = useLocale();
    const { state, dispatch } = useDropdownContext();
    // 可变实例状态：命令面板的 DOM 引用仅用于打开后的焦点管理。
    const panelRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => { if (state.open) panelRef.current?.querySelector('button')?.focus(); }, [state.open]);
    function close() {
        dispatch({ type: 'setOpen', payload: false });
        const panel = panelRef.current;
        const root = panel?.getRootNode();
        const trigger = root && isElementRoot(root) ? root.getElementById(triggerId) : panel?.ownerDocument.getElementById(triggerId);
        if (trigger && 'focus' in trigger && typeof trigger.focus === 'function') trigger.focus();
    }
    return <div ref={panelRef} id={id} role="group" aria-label={messages.tablePro.columnActions(label)} className={panelStyle}
        onClick={event => event.stopPropagation()}
        onKeyDown={event => {
            event.stopPropagation();
            if (event.key === 'Escape') { event.preventDefault(); close(); return; }
            const buttons = [...event.currentTarget.querySelectorAll('button')];
            const root = event.currentTarget.getRootNode();
            const active = isElementRoot(root) ? root.activeElement : event.currentTarget.ownerDocument.activeElement;
            const index = buttons.findIndex(button => button === active);
            const next = event.key === 'ArrowDown' ? (index + 1) % buttons.length : event.key === 'ArrowUp' ? (index - 1 + buttons.length) % buttons.length : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : undefined;
            if (next !== undefined) { event.preventDefault(); buttons[next]?.focus(); }
        }}>
        {onSortableChange && <Button appearance="text" shouldFitContainer onClick={() => { onSortableChange(name, !sortable); close(); }}>{sortable ? messages.tablePro.disableSorting : messages.tablePro.enableSorting}</Button>}
        {onPinChange && <>
            <Button appearance="text" shouldFitContainer onClick={() => { onPinChange(name, fixed === 'left' ? undefined : 'left'); close(); }}>{fixed === 'left' ? messages.tablePro.unpinLeft : messages.tablePro.pinLeft}</Button>
            <Button appearance="text" shouldFitContainer onClick={() => { onPinChange(name, fixed === 'right' ? undefined : 'right'); close(); }}>{fixed === 'right' ? messages.tablePro.unpinRight : messages.tablePro.pinRight}</Button>
        </>}
    </div>;
}

export default function ColumnActions(props: ColumnActionsProps) {
    const triggerId = useId(), panelId = useId();
    return <DropdownContainer className={containerStyle} overlay={<Actions {...props} id={panelId} triggerId={triggerId} />}>
        <Trigger id={triggerId} panelId={panelId} label={props.label} />
    </DropdownContainer>;
}
