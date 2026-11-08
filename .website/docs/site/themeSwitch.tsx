import { use, useEffect, useId, useRef } from "react";
import type { RefObject } from "react";
import type { HeaderProps } from "@crab-dev/wake/docs";
import Button from "@crab-dev/rc-button";
import DropdownContainer, { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import { DocumentDesignContext, SITE_DESIGNS, SITE_DESIGN_NAMES } from "./siteContext.js";
import { isSearchShortcut, SearchReturnFocusContext } from "./ui/search-return-focus.js";

const modes = ["light", "dark", "system"] as const;
type Mode = (typeof modes)[number];
type Theme = HeaderProps["theme"];
const names = { light: "浅色", dark: "深色", system: "跟随系统" };
type TriggerRef = RefObject<HTMLButtonElement | null>;

function ThemeIcon({ mode }: { mode: Mode }) {
    return <svg className="crab-docs-tool-icon" viewBox="0 0 20 20" aria-hidden="true">
        {mode === "light" ? <><circle cx="10" cy="10" r="3.5" /><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6 16 16M4 16l1.4-1.4M14.6 5.4 16 4" /></>
            : mode === "dark" ? <path d="M16.8 11.3A7 7 0 0 1 8.7 3.2a7 7 0 1 0 8.1 8.1Z" />
                : <><rect x="2.5" y="3" width="15" height="10.5" rx="1.5" /><path d="M10 13.5V17M6 17h8" /></>}
    </svg>;
}

function ThemeTrigger({ theme, menuId, trigger }: { theme: Theme; menuId: string; trigger: TriggerRef }) {
    const { design } = use(DocumentDesignContext);
    const searchReturnFocus = use(SearchReturnFocusContext);
    const { state, dispatch, refs } = useDropdownContext<HTMLSpanElement>();
    const setOpen = (open: boolean) => dispatch({ type: "setOpen", payload: open });
    // The same real control owns positioning and the dropdown's Escape return focus.
    return <span className="crab-docs-theme-control" ref={refs.setReference}>
        <Button ref={trigger} appearance="text" className="crab-docs-theme-trigger"
            aria-label={`文档外观：${SITE_DESIGN_NAMES[design].label} · ${names[theme.theme]}`} title={`外观：${SITE_DESIGN_NAMES[design].label} · ${names[theme.theme]}`}
            aria-haspopup="menu" aria-expanded={state.open} aria-controls={state.open ? menuId : undefined}
            icon={<ThemeIcon mode={theme.theme} />} onClick={() => setOpen(!state.open)}
            onKeyDown={event => {
                if (state.open && isSearchShortcut(event) && searchReturnFocus) searchReturnFocus.current = true;
                if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); }
                if (event.key === "Escape") setOpen(false);
            }}><span className="crab-docs-theme-name">{SITE_DESIGN_NAMES[design].label}</span></Button>
    </span>;
}

function ThemeOptions({ theme, menuId, trigger }: { theme: Theme; menuId: string; trigger: TriggerRef }) {
    const { design, setDesign } = use(DocumentDesignContext);
    const { state, dispatch } = useDropdownContext();
    const searchReturnFocus = use(SearchReturnFocusContext);
    const menu = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!state.open || !menu.current) return;
        const node = menu.current;
        const popup = node.closest(".crab-docs-theme-popup");
        // Positioning temporarily hides the popup, so native autoFocus may run
        // too early. Observe this site's surface only until it can take focus.
        const focusCurrent = () => {
            if (getComputedStyle(node).visibility === "hidden") return false;
            if (document.activeElement === trigger.current || node.contains(document.activeElement)) {
                node.querySelector<HTMLButtonElement>('[role="group"][aria-label="明暗模式"] [aria-checked="true"]')?.focus({ preventScroll: true });
            }
            return true;
        };
        if (focusCurrent() || !popup) return;
        const observer = new MutationObserver(() => { if (focusCurrent()) observer.disconnect(); });
        observer.observe(popup, { attributes: true });
        return () => observer.disconnect();
    }, [state.open, trigger]);
    const close = () => {
        dispatch({ type: "setOpen", payload: false });
        trigger.current?.focus({ preventScroll: true });
    };
    return <div ref={menu} id={menuId} role="menu" aria-label="文档外观" className="crab-docs-theme-options"
        onKeyDown={event => {
            if (isSearchShortcut(event)) {
                if (searchReturnFocus) searchReturnFocus.current = true;
                return;
            }
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
        <div role="group" aria-label="设计体系">
            <span className="crab-docs-theme-group-label" aria-hidden="true">设计体系</span>
            {SITE_DESIGNS.map(value => <Button key={value} appearance="text" className="crab-docs-theme-option" role="menuitemradio" aria-checked={design === value}
                tabIndex={-1}
                onClick={() => { setDesign(value); close(); }}>
                <span className="crab-docs-theme-option-content">
                    <span className="crab-docs-theme-option-label">{SITE_DESIGN_NAMES[value].label}</span>
                    <span className="crab-docs-theme-check" aria-hidden="true">{design === value ? "✓" : ""}</span>
                </span>
            </Button>)}
        </div>
        <div role="group" aria-label="明暗模式">
            <span className="crab-docs-theme-group-label" aria-hidden="true">明暗模式</span>
            {modes.map(mode => <Button key={mode} appearance="text" className="crab-docs-theme-option" role="menuitemradio" aria-checked={theme.theme === mode}
                tabIndex={-1}
                onClick={() => { theme.setTheme(mode); close(); }}>
                <span className="crab-docs-theme-option-content">
                    <ThemeIcon mode={mode} />
                    <span className="crab-docs-theme-option-label">{names[mode]}</span>
                    <span className="crab-docs-theme-check" aria-hidden="true">{theme.theme === mode ? "✓" : ""}</span>
                </span>
            </Button>)}
        </div>
    </div>;
}

export default function ThemeSwitch({ theme }: { theme: Theme }) {
    const { design } = use(DocumentDesignContext);
    const menuId = useId();
    // DOM reference for menu dismissal and focus restoration; never read during render.
    const trigger = useRef<HTMLButtonElement>(null);
    const popupProps = { className: "crab-docs-theme-popup", "data-crab-design": design, "data-theme": theme.resolved };
    return <DropdownContainer className="crab-docs-theme-switch" closeOnFocusOut
        floatingContainerProps={popupProps}
        overlay={<ThemeOptions theme={theme} menuId={menuId} trigger={trigger} />}>
        <ThemeTrigger theme={theme} menuId={menuId} trigger={trigger} />
    </DropdownContainer>;
}
