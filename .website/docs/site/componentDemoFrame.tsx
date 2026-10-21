import { css } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import Alert from "@crab-dev/rc-alert";
import Empty from "@crab-dev/rc-empty";
import { SpinIndicator } from "@crab-dev/rc-spin";
import { useConfig } from "@crab-dev/rc-config-provider";
import type { ConfigDesign } from "@crab-dev/rc-config-provider";
import token from "@crab-dev/rc-token-semantic";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { ComponentDemoRecord } from "./componentDemos.js";
import { useSiteHref } from "./siteContext.js";

export type ComponentDemoCodeTheme = "light" | "dark";
export type ComponentDemoDescriptor = Pick<ComponentDemoRecord, "id" | "title" | "previewPath" | "density">
    & Partial<Pick<ComponentDemoRecord, "workbenchPath">>;
export type ComponentDemoFramePresentation = "interactive" | "artwork";

export interface ComponentDemoFrameWindow {
    readonly document?: Document;
    postMessage(message: unknown, targetOrigin: string): void;
}

interface ComponentDemoFrameOptions {
    readonly onThemeChange?: (theme: ComponentDemoCodeTheme) => void;
    readonly getFrameWindow?: () => ComponentDemoFrameWindow | null;
    readonly renderFrame?: (state: ComponentDemoFrameRenderState) => ReactNode;
    readonly readyTimeoutMs?: number;
}

type ComponentDemoFrameProps = ComponentDemoFrameOptions & (
    | { readonly presentation?: "interactive"; readonly demo: ComponentDemoRecord }
    | { readonly presentation: "artwork"; readonly demo: ComponentDemoDescriptor }
);

export interface ComponentDemoFrameRenderState {
    readonly src: string;
    readonly title: string;
    readonly sandbox: string;
    readonly demoId: string;
    readonly height: number;
    readonly ready: boolean;
    readonly attempt: number;
    readonly tabIndex: -1 | undefined;
}

interface WakeMessage {
    readonly type?: unknown;
    readonly height?: unknown;
    readonly error?: unknown;
    readonly message?: unknown;
}

const MIN_FRAME_HEIGHT = 80;
const MAX_FRAME_HEIGHT = 1_200;
const DEFAULT_READY_TIMEOUT_MS = 12_000;

const frameContainerStyle = css`
    position: relative;
    min-width: 0;
`;

const presentationStyle = css`
    min-width: 0;
    &[data-presentation="artwork"] {
        pointer-events: none;
        user-select: none;
    }
`;

const frameStyle = css`
    display: block;
    width: 100%;
    min-width: 0;
    min-height: ${MIN_FRAME_HEIGHT}px;
    border: 0;
    background-color: ${token.color.background.elevated};
`;

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
    &[data-overlay="true"] {
        position: absolute;
        inset: 0;
        z-index: ${token['z-index'].base};
        min-height: ${MIN_FRAME_HEIGHT}px;
    }
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

type WakeMessageCallback = (event: MessageEvent<unknown>) => void;

const wakeMessageCallbacks = new Set<WakeMessageCallback>();

function dispatchWakeMessage(event: MessageEvent<unknown>) {
    for (const callback of wakeMessageCallbacks) callback(event);
}

function subscribeWakeMessages(callback: WakeMessageCallback): () => void {
    wakeMessageCallbacks.add(callback);
    if (wakeMessageCallbacks.size === 1) {
        window.addEventListener("message", dispatchWakeMessage);
    }
    return () => {
        wakeMessageCallbacks.delete(callback);
        if (wakeMessageCallbacks.size === 0) {
            window.removeEventListener("message", dispatchWakeMessage);
        }
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

function initialHeight(density: ComponentDemoRecord["density"]): number {
    if (density === "compact") return 120;
    if (density === "spacious") return 300;
    return 220;
}

function messageError(data: WakeMessage): string {
    if (typeof data.error === "string" && data.error.length > 0) return data.error;
    if (typeof data.message === "string" && data.message.length > 0) return data.message;
    return "演示运行失败，请在工作台中查看详细信息。";
}

function isWakeMessage(data: unknown): data is WakeMessage {
    return typeof data === "object" && data !== null;
}

function synchronizeFrameConfiguration(
    frameWindow: ComponentDemoFrameWindow,
    design: ConfigDesign,
    theme: ComponentDemoCodeTheme,
    presentation: ComponentDemoFramePresentation,
) {
    try {
        const frameDocument = frameWindow.document;
        if (frameDocument) {
            // Public rc-theme rules provide the L2 colors and shapes at each boundary.
            for (const root of [frameDocument.documentElement, frameDocument.querySelector<HTMLElement>(".demo-frame-root")]) {
                if (!root) continue;
                root.dataset.crabDesign = design;
                root.dataset.theme = theme;
                // The decorative frame must not acquire focus, including through portals or autofocus.
                root.inert = presentation === "artwork";
            }
        }
    } catch {
        // The preview's validated message bridge also works without DOM access.
    }
    frameWindow.postMessage({ type: "wake:theme", theme }, "*");
    frameWindow.postMessage({ type: "crab:preview-config", design, theme }, window.location.origin);
}

export function getComponentDemoFrameAttributes(
    demo: ComponentDemoDescriptor,
    presentation: ComponentDemoFramePresentation = "interactive",
) {
    return {
        src: demo.previewPath,
        title: `${demo.title} ${presentation === "artwork" ? "外观预览" : "交互演示"}`,
        sandbox: "allow-scripts allow-same-origin",
        demoId: demo.id,
    } as const;
}

export function EmptyComponentDemos() {
    return (
        <Empty title="暂无可用的组件演示" />
    );
}

export default function ComponentDemoFrame({
    demo,
    presentation = "interactive",
    onThemeChange,
    getFrameWindow,
    renderFrame,
    readyTimeoutMs = DEFAULT_READY_TIMEOUT_MS,
}: ComponentDemoFrameProps) {
    const href = useSiteHref();
    const { design } = useConfig();
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLIFrameElement>(null);
    // Mutable observer ownership is read by messages without triggering rendering.
    const measuresContentRef = useRef(false);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [height, setHeight] = useState(() => initialHeight(demo.density));
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);
    const artwork = presentation === "artwork";
    const workbenchPath = demo.workbenchPath ?? demo.previewPath;
    const frameAttributes = { ...getComponentDemoFrameAttributes(demo, presentation), src: href(demo.previewPath) };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            setShouldLoad(true);
            return;
        }
        return observeWhenNear(container, () => setShouldLoad(true));
    }, []);

    useEffect(() => {
        return subscribeWakeMessages((event) => {
            const frameWindow = getFrameWindow?.() ?? frameRef.current?.contentWindow;
            if (!frameWindow || event.source !== frameWindow || !isWakeMessage(event.data)) return;
            if (event.data.type === "crab:preview-ready") {
                if (event.origin === window.location.origin) {
                    synchronizeFrameConfiguration(frameWindow, design, readCodeTheme(), presentation);
                }
                return;
            }
            if (event.data.type === "wake:resize" && typeof event.data.height === "number") {
                if (measuresContentRef.current) return;
                if (Number.isFinite(event.data.height)) {
                    const nextHeight = Math.min(
                        MAX_FRAME_HEIGHT,
                        Math.max(MIN_FRAME_HEIGHT, Math.ceil(event.data.height)),
                    );
                    setHeight((currentHeight) => (
                        currentHeight === nextHeight ? currentHeight : nextHeight
                    ));
                }
                return;
            }
            if (event.data.type === "wake:ready") {
                const theme = readCodeTheme();
                setReady(true);
                setError(null);
                onThemeChange?.(theme);
                synchronizeFrameConfiguration(frameWindow, design, theme, presentation);
                return;
            }
            if (event.data.type === "wake:error") {
                setReady(false);
                setError(messageError(event.data));
            }
        });
    }, [design, getFrameWindow, onThemeChange, presentation]);

    useEffect(() => {
        if (!ready || typeof ResizeObserver === "undefined") return;
        const frameWindow = getFrameWindow?.() ?? frameRef.current?.contentWindow;
        let contentRoot: HTMLElement | null;
        try {
            contentRoot = frameWindow?.document?.querySelector<HTMLElement>(".demo-frame-root") ?? null;
        } catch {
            // Keep Wake's message protocol for frames without same-origin access.
            return;
        }
        if (!contentRoot) return;
        const updateHeight = () => {
            // document.scrollHeight includes the iframe viewport, so it cannot
            // shrink after a fixed overlay closes. Measure the content root instead.
            const nextHeight = Math.min(
                MAX_FRAME_HEIGHT,
                Math.max(MIN_FRAME_HEIGHT, Math.ceil(contentRoot.getBoundingClientRect().height)),
            );
            setHeight(currentHeight => currentHeight === nextHeight ? currentHeight : nextHeight);
        };
        const observer = new ResizeObserver(updateHeight);
        measuresContentRef.current = true;
        observer.observe(contentRoot);
        updateHeight();
        return () => {
            observer.disconnect();
            measuresContentRef.current = false;
        };
    }, [attempt, getFrameWindow, ready]);

    useEffect(() => {
        if (!shouldLoad || error) return;
        return subscribeTheme((theme) => {
            onThemeChange?.(theme);
            const frameWindow = getFrameWindow?.() ?? frameRef.current?.contentWindow;
            if (frameWindow) synchronizeFrameConfiguration(frameWindow, design, theme, presentation);
        });
    }, [design, error, getFrameWindow, onThemeChange, presentation, shouldLoad]);

    useEffect(() => {
        if (!shouldLoad || ready || error) return;
        const timeoutId = window.setTimeout(() => {
            setError("演示加载超时，请重新加载或在工作台中打开。");
        }, Math.max(0, readyTimeoutMs));
        return () => window.clearTimeout(timeoutId);
    }, [attempt, error, ready, readyTimeoutMs, shouldLoad]);

    const handleRetry = () => {
        setReady(false);
        setError(null);
        setHeight(initialHeight(demo.density));
        setAttempt((currentAttempt) => currentAttempt + 1);
    };

    const renderState = {
        ...frameAttributes,
        height,
        ready,
        attempt,
        tabIndex: artwork || !ready ? -1 : undefined,
    } satisfies ComponentDemoFrameRenderState;

    return (
        <div ref={containerRef} className={presentationStyle} data-presentation={presentation}
            inert={artwork || undefined} aria-hidden={artwork || undefined}>
            {error && (artwork ? (
                <div className={loadingStyle} data-density={demo.density}>
                    预览暂时无法显示，请查看下方组件示例。
                </div>
            ) : (
                <Alert type="error" title="演示加载失败" action={
                    <>
                        <Button onClick={handleRetry}>重新加载演示</Button>
                        <Button href={href(workbenchPath)} target="_blank" rel="noreferrer">在工作台中打开</Button>
                    </>
                }>{error}</Alert>
            ))}
            {!error && !shouldLoad && (
                <div
                    className={loadingStyle}
                    data-density={demo.density}
                    role="status"
                >
                    演示进入可视区域后加载
                </div>
            )}
            {!error && shouldLoad && (
                <div className={frameContainerStyle} data-demo-load-attempt={attempt}>
                    {renderFrame
                        ? renderFrame(renderState)
                        : (
                            <iframe
                                key={attempt}
                                ref={frameRef}
                                className={frameStyle}
                                src={frameAttributes.src}
                                title={frameAttributes.title}
                                height={height}
                                loading="lazy"
                                sandbox={frameAttributes.sandbox}
                                data-wake-demo={frameAttributes.demoId}
                                aria-busy={!ready}
                                tabIndex={renderState.tabIndex}
                                inert={artwork || undefined}
                            />
                        )}
                    {!ready && (
                        <div
                            className={loadingStyle}
                            data-overlay="true"
                            role="status"
                            aria-live="polite"
                        >
                            <SpinIndicator size="middle" />
                            <span>{artwork ? "正在加载组件预览…" : "正在加载交互演示…"}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
