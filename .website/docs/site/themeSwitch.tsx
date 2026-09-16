import { useId, useRef } from "react";
import type { RefObject } from "react";
import type { HeaderProps } from "@crab-dev/wake/docs";
import Button from "@crab-dev/rc-button";
import DropdownContainer, { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import "@crab-dev/rc-dropdown-container/css/index.css";

const modes = ["light", "dark", "system"] as const;
type Mode = (typeof modes)[number];
type Theme = HeaderProps["theme"];
const names = { light: "浅色", dark: "深色", system: "跟随系统" };
type TriggerRef = RefObject<HTMLSpanElement | null>;

function ThemeIcon({ mode }: { mode: Mode }) {
    return <svg className="crab-docs-tool-icon" viewBox="0 0 20 20" aria-hidden="true">
        {mode === "light" ? <><circle cx="10" cy="10" r="3.5" /><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6 16 16M4 16l1.4-1.4M14.6 5.4 16 4" /></>
            : mode === "dark" ? <path d="M16.8 11.3A7 7 0 0 1 8.7 3.2a7 7 0 1 0 8.1 8.1Z" />
                : <><rect x="2.5" y="3" width="15" height="10.5" rx="1.5" /><path d="M10 13.5V17M6 17h8" /></>}
    </svg>;
}

function ThemeTrigger({ theme, menuId, trigger }: { theme: Theme; menuId: string; trigger: TriggerRef }) {
    const { state, dispatch, refs } = useDropdownContext<HTMLSpanElement>();
    const setOpen = (open: boolean) => dispatch({ type: "setOpen", payload: open });
    return <>
        {/* This layout anchor aligns the popup's right edge with the compact trigger. */}
        <span className="crab-docs-theme-anchor" aria-hidden="true" ref={refs.setReference} />
        <span className="crab-docs-theme-control" ref={trigger}><Button appearance="text" className="crab-docs-theme-trigger"
            aria-label={`文档主题：${names[theme.theme]}`} title={`主题：${names[theme.theme]}`}
            aria-haspopup="menu" aria-expanded={state.open} aria-controls={state.open ? menuId : undefined}
            icon={<ThemeIcon mode={theme.theme} />} onClick={() => setOpen(!state.open)}
            onKeyDown={event => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); }
                if (event.key === "Escape") setOpen(false);
            }} /></span>
    </>;
}

function ThemeOptions({ theme, menuId, trigger }: { theme: Theme; menuId: string; trigger: TriggerRef }) {
    const { dispatch } = useDropdownContext();
    const close = () => {
        dispatch({ type: "setOpen", payload: false });
        trigger.current?.querySelector<HTMLButtonElement>("button")?.focus();
    };
    return <div id={menuId} role="menu" aria-label="文档主题" className="crab-docs-theme-options"
        onKeyDown={event => {
            if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); return; }
            // Refocus the trigger before the browser applies normal Tab navigation.
            if (event.key === "Tab") { close(); return; }
            const options = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')];
            const current = options.findIndex(option => option === event.target);
            const next = event.key === "ArrowDown" ? (current + 1) % options.length
                : event.key === "ArrowUp" ? (current + options.length - 1) % options.length
                    : event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : undefined;
            if (next !== undefined) { event.preventDefault(); options[next]?.focus(); }
        }}>
        {modes.map(mode => <Button key={mode} appearance="text" role="menuitemradio" aria-checked={theme.theme === mode} autoFocus={theme.theme === mode}
            tabIndex={-1} icon={<ThemeIcon mode={mode} />}
            iconAfter={<span className="crab-docs-theme-check" aria-hidden="true">{theme.theme === mode ? "✓" : ""}</span>}
            onClick={() => { theme.setTheme(mode); close(); }}>{names[mode]}</Button>)}
    </div>;
}

export default function ThemeSwitch({ theme }: { theme: Theme }) {
    const menuId = useId();
    // DOM reference for menu dismissal and focus restoration; never read during render.
    const trigger = useRef<HTMLSpanElement>(null);
    return <DropdownContainer className="crab-docs-theme-switch"
        floatingContainerProps={{ className: "crab-docs-theme-popup" }}
        overlay={<ThemeOptions theme={theme} menuId={menuId} trigger={trigger} />}>
        <ThemeTrigger theme={theme} menuId={menuId} trigger={trigger} />
    </DropdownContainer>;
}
