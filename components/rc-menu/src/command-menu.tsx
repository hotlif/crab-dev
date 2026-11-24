import { useEffect, useEffectEvent, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type RefObject } from 'react';
import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import { useConfig, useLocale } from '@crab-dev/rc-config-provider';
import DropdownContainer, { useDropdownContext } from '@crab-dev/rc-dropdown-container';
import { registerOverlayLayer } from '@crab-dev/rc-hooks/internal';
import token from './token.js';

interface CommandEntryBase {
    id: string;
    label: string;
    disabled?: boolean;
}

export interface CommandMenuAction extends CommandEntryBase {
    onSelect: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface CommandMenuBranch extends CommandEntryBase {
    items: readonly CommandMenuAction[];
}

export interface CommandMenuGroup {
    label?: string;
    items: readonly (CommandMenuAction | CommandMenuBranch)[];
}

export interface CommandMenuProps {
    label: string;
    groups: readonly CommandMenuGroup[];
}

const layerStyle = css`inline-size: min(16rem, calc(100vw - 1rem));`;
const menuStyle = css`
    padding: 0.25rem;
    min-inline-size: 0;
    [role="group"] + [role="group"] { margin-block-start: 0.25rem; }
`;
const groupLabelStyle = css`display: block; padding: 0.25rem 0.5rem; font-size: 0.8em; color: ${token.vertical.item.title.color};`;
const rowStyle = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    inline-size: 100%;
    min-block-size: ${token.vertical.item.title.height};
    padding-inline: ${token.vertical.item.title["padding-inline-start"]} ${token.vertical.item.title["padding-inline-end"]};
    border: none;
    border-radius: ${token.vertical.item.title["border-radius"]};
    color: ${token.vertical.item.title.color};
    background: transparent;
    font: inherit;
    text-align: start;
    overflow-wrap: anywhere;
    cursor: pointer;
    &:hover { background: ${token.vertical.item.title["background-color-hover"]}; }
    &:active { background: ${token.vertical.item.title["background-color-active"]}; }
    &:focus-visible { outline: 2px solid currentColor; outline-offset: -2px; }
    &[aria-disabled="true"] { opacity: 0.55; cursor: default; }
    @media (forced-colors: active) {
        &:focus-visible { outline-color: Highlight; }
        &[aria-disabled="true"] { color: GrayText; opacity: 1; }
    }
`;

type FocusTarget = { edge: 'first' | 'last' } | { id: string };

function Trigger({ label, menuId, onOpen, ref }: {
    label: string;
    menuId: string;
    onOpen: (target: FocusTarget) => void;
    ref: RefObject<HTMLButtonElement | null>;
}) {
    const { refs, state, dispatch } = useDropdownContext<HTMLSpanElement>();
    return <span ref={refs.setReference}><Button type="button" appearance="outlined"
        ref={ref}
        aria-haspopup="menu" aria-expanded={state.open} aria-controls={state.open ? menuId : undefined}
        onClick={() => {
            if (state.open) dispatch({ type: 'setOpen', payload: false });
            else onOpen({ edge: 'first' });
        }}
        onKeyDown={event => {
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
            event.preventDefault();
            if (!state.open) onOpen({ edge: event.key === 'ArrowUp' ? 'last' : 'first' });
        }}>{label}</Button></span>;
}

function CommandMenuPopup({ menuId, label, groups, branch, target, onBranch, onBack, onExit, onExecute }: {
    menuId: string;
    label: string;
    groups: readonly CommandMenuGroup[];
    branch: CommandMenuBranch | null;
    target: FocusTarget;
    onBranch: (entry: CommandMenuBranch) => void;
    onBack: () => void;
    onExit: () => void;
    onExecute: (action: CommandMenuAction, event: MouseEvent<HTMLButtonElement>) => void;
}) {
    const node = useRef<HTMLDivElement>(null);
    const { direction } = useConfig();
    const { locale } = useLocale();
    const toward = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const away = direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    const { state } = useDropdownContext();
    const back = () => {
        node.current?.focus({ preventScroll: true });
        onBack();
    };
    const backFromEscape = useEffectEvent(back);

    useLayoutEffect(() => {
        const menu = node.current;
        if (!menu || !state.open) return;
        let frame = 0;
        const focus = () => {
            if (getComputedStyle(menu).visibility === 'hidden') {
                frame = requestAnimationFrame(focus);
                return;
            }
            const rows = [...menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')];
            const item = 'id' in target ? rows.find(row => row.dataset.commandId === target.id)
                : target.edge === 'last' ? rows.at(-1) : rows[0];
            (item ?? menu).focus();
        };
        focus();
        return () => cancelAnimationFrame(frame);
    }, [state.open, target]);

    useEffect(() => {
        const menu = node.current;
        if (!menu || !state.open || !branch) return;
        const layer = registerOverlayLayer(menu, backFromEscape);
        return () => layer.release({ restoreFocus: false });
    }, [state.open, branch]);

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.defaultPrevented) return;
        if (event.key === 'Tab') {
            onExit();
            return;
        }
        const rows = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')];
        const current = rows.findIndex(row => row === event.target);
        const index = event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1
            : event.key === 'ArrowDown' ? (current + 1) % rows.length
            : event.key === 'ArrowUp' ? (current <= 0 ? rows.length - 1 : current - 1)
            : -1;
        if (index >= 0) {
            event.preventDefault();
            rows[index]?.focus();
        } else if (event.key === toward && rows[current]?.getAttribute('aria-haspopup') === 'menu') {
            event.preventDefault();
            rows[current].click();
        } else if (event.key === away && branch) {
            event.preventDefault();
            back();
        }
    };
    const renderRow = (entry: CommandMenuAction | CommandMenuBranch) => {
        const expandable = 'items' in entry;
        return <button key={entry.id} type="button" tabIndex={-1} role="menuitem"
            data-command-id={entry.id} aria-disabled={entry.disabled || undefined}
            aria-haspopup={expandable ? 'menu' : undefined} className={rowStyle}
            onClick={event => {
                if (entry.disabled) return;
                if (expandable) {
                    node.current?.focus({ preventScroll: true });
                    onBranch(entry);
                } else onExecute(entry, event);
            }}>
            {entry.label}{expandable && <span aria-hidden="true">{direction === 'rtl' ? '‹' : '›'}</span>}
        </button>;
    };
    return <div id={menuId} className={menuStyle} role="menu" aria-label={branch?.label ?? label}
        tabIndex={-1} ref={node} onKeyDown={onKeyDown}>
        {branch ? <>
            <button type="button" tabIndex={-1} role="menuitem" className={rowStyle} onClick={back}>
                {locale === 'en-US' ? 'Back' : '返回上一级'}
            </button>
            {branch.items.map(renderRow)}
        </> : groups.map((group, index) => <div key={group.label ?? index} role="group" aria-label={group.label}>
            {group.label && <span className={groupLabelStyle} aria-hidden="true">{group.label}</span>}
            {group.items.map(renderRow)}
        </div>)}
    </div>;
}

/** 设备、文件和操作命令的同锚点菜单。 */
export function CommandMenu({ label, groups }: CommandMenuProps) {
    const menuId = useId();
    const trigger = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const [branch, setBranch] = useState<CommandMenuBranch | null>(null);
    const [target, setTarget] = useState<FocusTarget>({ edge: 'first' });
    const handleOpen = (next: boolean) => {
        setOpen(next);
        if (!next) setBranch(null);
    };
    const returnToTrigger = () => {
        handleOpen(false);
        trigger.current?.focus({ preventScroll: true });
    };
    return <DropdownContainer open={open} onOpenChange={handleOpen} closeOnFocusOut
        floatingContainerProps={{ className: layerStyle }}
        overlay={<CommandMenuPopup menuId={menuId} label={label} groups={groups} branch={branch} target={target}
            onBranch={entry => {
                setBranch(entry);
                setTarget(entry.items.length ? { id: entry.items[0].id } : { edge: 'first' });
            }}
            onBack={() => {
                if (branch) setTarget({ id: branch.id });
                setBranch(null);
            }}
            onExit={returnToTrigger}
            onExecute={(action, event) => {
                action.onSelect(event);
                if (!event.defaultPrevented) returnToTrigger();
            }}/>}>
        <Trigger label={label} menuId={menuId} ref={trigger}
            onOpen={next => { setTarget(next); setOpen(true); }}/>
    </DropdownContainer>;
}
