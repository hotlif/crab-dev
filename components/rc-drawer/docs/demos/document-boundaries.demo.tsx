import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { css } from "@crab-dev/css";
import token, { designSystemRegistry } from "@crab-dev/rc-token-semantic";
import ConfigProvider, { ConfigBoundary, useConfig } from "@crab-dev/rc-config-provider";
import Button from "@crab-dev/rc-button";
import Select from "@crab-dev/rc-select";
import DropdownContainer, { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import Drawer from "@crab-dev/rc-drawer";

export const meta = { title: "跨文档浮层与嵌套边界", description: "同一公开组合在真实 iframe 和 Shadow DOM 中检查选择、父子浮层、抽屉堆叠与返回焦点。" };
const layout = css`display: grid; gap: ${token.space['section-gap']}; padding: ${token.space['section-gap']}; min-width: 0; color: ${token.color.text.primary}; background: ${token.color.background.surface};`;
const embedded = css`box-sizing: border-box; width: 100%; height: 560px; border: 1px solid ${token.color.border.default};`;
const content = css`display: grid; gap: ${token.space['component-gap']}; padding: ${token.space['section-gap']}; overflow-wrap: anywhere; min-width: 0;`;
const editor = css`box-sizing: border-box; max-width: 100%; min-width: 0; padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; border: 1px solid ${token.color.border.default}; font: inherit; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }`;

// Context and actual CSS must both cross a Document/ShadowRoot boundary. These
// are copies of the application's real stylesheet resources, not state mocks.
function installStyles(source: Document, target: Document | ShadowRoot) {
    const container = target.nodeType === 9 ? (target as Document).head : target;
    const pending: Promise<void>[] = [];
    const copies = [...source.head.querySelectorAll("link[rel='stylesheet'], style")].map(sheet => {
        const copy = sheet.cloneNode(true) as HTMLElement;
        if (sheet.tagName === "LINK") {
            (copy as HTMLLinkElement).href = (sheet as HTMLLinkElement).href;
            pending.push(new Promise<void>((resolve, reject) => { copy.addEventListener("load", () => resolve(), { once: true }); copy.addEventListener("error", () => reject(new Error("Unable to load the application's stylesheet")), { once: true }); }));
        }
        container.append(copy); return copy;
    });
    return { ready: Promise.all(pending), dispose: () => { for (const copy of copies) copy.remove(); } };
}

function Trigger({ children }: { children: ReactNode }) {
    const { refs, state, dispatch } = useDropdownContext<HTMLButtonElement>();
    return <Button ref={refs.setReference} aria-haspopup="dialog" aria-expanded={state.open} onClick={event => dispatch({ type: "setOpen", payload: !state.open, details: { reason: "trigger", event: event.nativeEvent } })}>{children}</Button>;
}

function Interactions({ name }: { name: string }) {
    const config = useConfig();
    const [draft, setDraft] = useState("跨文档草稿 Draft");
    const [drawer, setDrawer] = useState(false);
    const [nested, setNested] = useState(false);
    return <ConfigBoundary role="region" aria-label={name} className={layout}>
        <output aria-label="最近完整配置">{JSON.stringify(config)}</output>
        <Select aria-label="跨文档团队" label="团队 Team" options={[{ label: "设计 Design", value: "design" }, { label: "工程 Engineering", value: "engineering" }]} defaultValue="design" />
        <DropdownContainer closeOnFocusOut overlay={<div role="dialog" aria-label="跨文档外层" className={content}>
            <label>外层草稿<input className={editor} aria-label="外层草稿" value={draft} onChange={event => setDraft(event.currentTarget.value)} /></label>
            <DropdownContainer closeOnFocusOut overlay={<div role="dialog" aria-label="跨文档内层" className={content}><Button>内部浮层操作</Button></div>}><Trigger>打开内部浮层</Trigger></DropdownContainer>
        </div>}><Trigger>打开跨文档浮层</Trigger></DropdownContainer>
        <Button onClick={() => setDrawer(true)}>打开跨文档抽屉</Button>
        <Drawer title="跨文档详情" open={drawer} onOpenChange={setDrawer} shouldResetContent={false} footer={<Button onClick={() => setDrawer(false)}>保存跨文档草稿</Button>}>
            <div className={content}><label>抽屉草稿<input className={editor} aria-label="抽屉草稿" value={draft} onChange={event => setDraft(event.currentTarget.value)} /></label><Button onClick={() => setNested(true)}>打开嵌套抽屉</Button></div>
            <Drawer title="嵌套详情" open={nested} onOpenChange={setNested} shouldResetContent={false}><Button>嵌套抽屉操作</Button></Drawer>
        </Drawer>
    </ConfigBoundary>;
}

export default function DocumentBoundariesDemo() {
    const config = useConfig();
    const [kind, setKind] = useState("iframe");
    const [shadow, setShadow] = useState<HTMLElement | null>(null);
    const [frameTarget, setFrameTarget] = useState<HTMLElement | null>(null);
    const [error, setError] = useState("");
    const shadowHost = useRef<HTMLDivElement>(null);
    const frameCleanup = useRef<(() => void) | null>(null);
    useEffect(() => {
        const host = shadowHost.current;
        if (!host) return;
        const root = host.shadowRoot ?? host.attachShadow({ mode: "open" });
        const styles = installStyles(host.ownerDocument, root), target = host.ownerDocument.createElement("div"); root.append(target);
        let active = true;
        styles.ready.then(() => { if (active) setShadow(target); }).catch(reason => { if (active) setError(String(reason)); });
        return () => { active = false; target.remove(); styles.dispose(); };
    }, []);
    useEffect(() => () => { frameCleanup.current?.(); }, []);
    const otherDesign = Object.keys(designSystemRegistry).find(value => value !== config.designSystem) as typeof config.designSystem;
    return <section aria-label="Overlay document boundaries" className={layout}>
        <label>承载边界<select aria-label="承载边界" value={kind} onChange={event => setKind(event.currentTarget.value)}><option>iframe</option><option>shadow</option></select></label>
        {error && <p role="alert">{error}</p>}
        <ConfigProvider designSystem={otherDesign} colorMode={config.colorMode === "light" ? "dark" : "light"}>
            <ConfigProvider {...config} size="small" density="compact" locale="en-US" direction="rtl" brandColor="#0e7490" nonce="overlay-documents">
                <iframe title="Overlay document iframe" className={embedded} hidden={kind !== "iframe"} srcDoc="<!doctype html><html><head><meta charset='utf-8'></head><body></body></html>" onLoad={event => {
                    const iframe = event.currentTarget, owner = iframe.contentDocument;
                    if (!owner || owner.body.dataset.initialized) return;
                    owner.body.dataset.initialized = "true"; frameCleanup.current?.();
                    const styles = installStyles(iframe.ownerDocument, owner), target = owner.createElement("div"); owner.body.append(target);
                    frameCleanup.current = () => { target.remove(); styles.dispose(); };
                    styles.ready.then(() => { if (iframe.isConnected) setFrameTarget(target); }).catch(reason => { if (iframe.isConnected) setError(String(reason)); });
                }} />
                <div ref={shadowHost} data-overlay-document="shadow" hidden={kind !== "shadow"} />
                {kind === "iframe" && frameTarget && createPortal(<Interactions name="iframe interactions" />, frameTarget)}
                {kind === "shadow" && shadow && createPortal(<Interactions name="shadow interactions" />, shadow)}
            </ConfigProvider>
        </ConfigProvider>
    </section>;
}
