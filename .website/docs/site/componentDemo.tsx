import { css } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import { EmptyFeedback, ErrorFeedback } from "./ui/feedback.js";
import { SpinIndicator } from "@crab-dev/rc-spin";
import { useConfig, type ConfigValue } from "@crab-dev/rc-config-provider";
import token from "@crab-dev/rc-token-semantic";
import { getFederationRuntime, type FederationRemoteLock } from "@crab-dev/wake/federation";
import { createFederatedIsolatedBridge, type IsolatedBridgeController } from "@crab-dev/wake/federation/react";
import { useEffect, useRef, useState } from "react";
import type { ComponentDemoRecord } from "./componentDemos.js";
import { useSiteHref } from "./siteContext.js";
import { isStandaloneDemo } from "./demoDelivery.mjs";

export type ComponentDemoCodeTheme = "light" | "dark";
export type ComponentDemoDescriptor = Pick<ComponentDemoRecord, "id" | "title" | "previewPath" | "density">
    & Partial<Pick<ComponentDemoRecord, "workbenchPath">>;

export type ComponentDemoPresentation = "interactive" | "artwork";

interface ComponentDemoProps {
    readonly demo: ComponentDemoDescriptor;
    readonly presentation?: ComponentDemoPresentation;
    readonly onThemeChange?: (theme: ComponentDemoCodeTheme) => void;
}

type RemoteProps = Omit<ConfigValue, "nonce"> & { id: string; nonce: string | null };
type DemoBridge = IsolatedBridgeController<RemoteProps>;

const remoteName = "crab_docs_demos";
let registration: Promise<ReturnType<typeof getFederationRuntime>> | undefined;

function getDemoRuntime(lockHref: string) {
    registration ??= (async () => {
        const lockUrl = new URL(lockHref, window.location.href);
        const response = await fetch(lockUrl, { cache: "no-cache", signal: AbortSignal.timeout(12_000) });
        if (!response.ok) throw new Error("无法读取演示发布信息");
        const lock: FederationRemoteLock = await response.json();
        const manifestUrl = new URL(encodeURIComponent(lock.buildId) + "/wake-federation.json", lockUrl);
        const local = ["localhost", "127.0.0.1", "[::1]"].includes(manifestUrl.hostname);
        const development = local && manifestUrl.protocol === "http:";
        const runtime = getFederationRuntime();
        runtime.registerRemote({
            name: remoteName,
            manifestUrl: manifestUrl.href,
            ...(development ? { mode: "development" } : { mode: "production", assetPreflight: "verified-get" }),
            lock,
        });
        return runtime;
    })().catch(error => {
        registration = undefined;
        throw error;
    });
    return registration;
}

const loadingStyle = css`
    display: grid;
    width: 100%;
    place-items: center;
    background-color: ${token.color.background.elevated};
    color: ${token.color.text.secondary};
    font-size: ${token.font.size.caption};
    text-align: center;
    min-height: 220px;
    &[data-density="compact"] { min-height: 120px; }
    &[data-density="spacious"] { min-height: 300px; }
`;

type VisibilityCallback = () => void;

const visibilityCallbacks = new Map<Element, VisibilityCallback>();
let visibilityObserver: IntersectionObserver | null = null;

function releaseVisibilityObserver() {
    if (visibilityCallbacks.size > 0) return;
    visibilityObserver?.disconnect();
    visibilityObserver = null;
}

function observeWhenNear(element: Element, callback: VisibilityCallback): () => void {
    if (typeof IntersectionObserver === "undefined") {
        callback();
        return () => {};
    }

    visibilityObserver ??= new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const nextCallback = visibilityCallbacks.get(entry.target);
            if (!nextCallback) continue;
            visibilityCallbacks.delete(entry.target);
            visibilityObserver?.unobserve(entry.target);
            nextCallback();
        }
        releaseVisibilityObserver();
    }, { rootMargin: "300px" });

    visibilityCallbacks.set(element, callback);
    visibilityObserver.observe(element);

    return () => {
        if (visibilityCallbacks.get(element) !== callback) return;
        visibilityCallbacks.delete(element);
        visibilityObserver?.unobserve(element);
        releaseVisibilityObserver();
    };
}


type ThemeCallback = (theme: ComponentDemoCodeTheme) => void;

const themeCallbacks = new Set<ThemeCallback>();
let themeObserver: MutationObserver | null = null;
let themeMediaQuery: MediaQueryList | null = null;

function readCodeTheme(): ComponentDemoCodeTheme {
    if (typeof document === "undefined") return "light";
    const theme = document.documentElement?.dataset.theme;
    if (theme === "dark") return "dark";
    if (theme === "light") return "light";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function notifyThemeChange() {
    const theme = readCodeTheme();
    for (const callback of themeCallbacks) callback(theme);
}

function startThemeMonitoring() {
    const root = document.documentElement;
    if (root && typeof MutationObserver !== "undefined") {
        try {
            themeObserver = new MutationObserver(notifyThemeChange);
            themeObserver.observe(root, {
                attributes: true,
                attributeFilter: ["data-theme"],
            });
        } catch {
            themeObserver?.disconnect();
            themeObserver = null;
        }
    }

    themeMediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)") ?? null;
    themeMediaQuery?.addEventListener?.("change", notifyThemeChange);
}

function stopThemeMonitoring() {
    themeObserver?.disconnect();
    themeObserver = null;
    themeMediaQuery?.removeEventListener?.("change", notifyThemeChange);
    themeMediaQuery = null;
}

export function subscribeTheme(callback: ThemeCallback): () => void {
    themeCallbacks.add(callback);
    if (themeCallbacks.size === 1) startThemeMonitoring();
    callback(readCodeTheme());
    return () => {
        themeCallbacks.delete(callback);
        if (themeCallbacks.size === 0) stopThemeMonitoring();
    };
}


export function EmptyComponentDemos() {
    return (
        <EmptyFeedback title="暂无可用的组件演示" description="可继续阅读组件用法、API 与源码。" />
    );
}


export default function ComponentDemo({ demo, presentation = "interactive", onThemeChange }: ComponentDemoProps) {
    const href = useSiteHref();
    const config = useConfig();
    const artwork = presentation === "artwork";
    const component = demo.previewPath.match(/^\/components\/([^/]+)\//)?.[1] ?? "";
    const id = component + "/" + demo.id;
    const standalone = isStandaloneDemo(id);
    const workbench = href(demo.workbenchPath ?? demo.previewPath);
    const lockHref = href("/federated-demos/lock.json");
    const container = useRef<HTMLDivElement>(null);
    const host = useRef<HTMLDivElement>(null);
    const currentBridge = useRef<DemoBridge | null>(null);
    const remoteProps = useRef<RemoteProps>({ ...config, id, nonce: config.nonce ?? null });
    const [visible, setVisible] = useState(artwork);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string>();
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (onThemeChange) return subscribeTheme(onThemeChange);
    }, [onThemeChange]);

    useEffect(() => {
        const element = container.current;
        if (visible || standalone || !element) return;
        return observeWhenNear(element, () => setVisible(true));
    }, [visible, standalone]);

    useEffect(() => {
        const props = { ...config, id, nonce: config.nonce ?? null };
        remoteProps.current = props;
        const bridge = currentBridge.current;
        void bridge?.update(props).catch((cause: unknown) => {
            if (currentBridge.current !== bridge) return;
            setError(cause instanceof Error ? cause.message : String(cause));
        });
    }, [config, id]);

    useEffect(() => {
        const element = host.current;
        if (!visible || standalone || !element) return;
        let cancelled = false;
        let bridge: DemoBridge | undefined;
        const reportError = (event: Event) => {
            const message = (event as CustomEvent<{ message: string }>).detail?.message;
            if (typeof message === "string") setError(message);
        };
        element.addEventListener("crab:demo-error", reportError);
        const mount = async () => {
            const runtime = await getDemoRuntime(lockHref);
            if (cancelled) return;
            bridge = await createFederatedIsolatedBridge<RemoteProps>(runtime, remoteName + "/demo", { dev: false });
            if (cancelled) return;
            const initial = remoteProps.current;
            await bridge.mount(element, initial);
            if (cancelled) return;
            currentBridge.current = bridge;
            if (remoteProps.current !== initial) await bridge.update(remoteProps.current);
            if (cancelled) return;
            setReady(true);
            if (document.activeElement === container.current) element.focus({ preventScroll: true });
        };
        void mount().catch((cause: unknown) => {
            if (!cancelled) setError(cause instanceof Error ? cause.message : String(cause));
        });
        return () => {
            cancelled = true;
            element.removeEventListener("crab:demo-error", reportError);
            currentBridge.current = null;
            if (bridge) void bridge.unmount().catch(console.error);
        };
    }, [attempt, id, lockHref, standalone, visible]);

    function retry() {
        container.current?.focus({ preventScroll: true });
        setError(undefined);
        setReady(false);
        setAttempt(value => value + 1);
    }

    if (standalone && artwork) return null;

    return (
        <div ref={container} data-presentation={presentation} data-demo-id={demo.id} data-wake-demo
            inert={artwork || undefined} aria-hidden={artwork || undefined}
            role={artwork ? undefined : "group"} tabIndex={artwork ? undefined : -1}
            aria-label={artwork ? undefined : demo.title + " 交互演示"}>
            {standalone ? (
                <Button appearance="outlined" href={workbench} target="_blank" rel="noreferrer">
                    在工作台中打开（新窗口）
                </Button>
            ) : (
                <>
                    <div key={attempt} ref={host} data-federated-demo tabIndex={-1} aria-busy={!ready} hidden={!!error} />
                    {error && (artwork ? (
                        <div className={loadingStyle} data-density={demo.density}>预览暂时无法显示。</div>
                    ) : (
                        <ErrorFeedback title="演示加载失败" detail={error} actions={
                            <>
                                <Button appearance="primary" onClick={retry}>重新加载演示</Button>
                                <Button appearance="outlined" href={workbench} target="_blank" rel="noreferrer">
                                    在工作台中打开（新窗口）
                                </Button>
                            </>
                        }>可以重新加载，或在独立工作台中继续查看。</ErrorFeedback>
                    ))}
                    {!ready && !error && (
                        <div className={loadingStyle} data-density={demo.density} role="status">
                            {visible && <SpinIndicator size="medium" />}
                            {visible ? "正在加载交互演示…" : "演示进入可视区域后加载"}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
