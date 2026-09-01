import { css, cx } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { ComponentDemoRecord } from "./componentDemos.js";

export type ComponentDemoCodeTheme = "light" | "dark";

export interface ComponentDemoFrameWindow {
    postMessage(message: unknown, targetOrigin: string): void;
}

interface ComponentDemoFrameProps {
    readonly demo: ComponentDemoRecord;
    readonly onThemeChange?: (theme: ComponentDemoCodeTheme) => void;
    readonly getFrameWindow?: () => ComponentDemoFrameWindow | null;
    readonly renderFrame?: (state: ComponentDemoFrameRenderState) => ReactNode;
    readonly readyTimeoutMs?: number;
}

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
`;

const loadingCompactStyle = css`
    min-height: 120px;
`;

const loadingRegularStyle = css`
    min-height: 220px;
`;

const loadingSpaciousStyle = css`
    min-height: 300px;
`;

const loadingOverlayStyle = css`
    position: absolute;
    inset: 0;
    z-index: ${token['z-index'].base};
    min-height: ${MIN_FRAME_HEIGHT}px;
`;

const errorStyle = css`
    display: grid;
    gap: ${token.space['component-gap']};
    min-height: ${MIN_FRAME_HEIGHT}px;
    padding: ${token.space['section-gap']};
    border: 1px solid ${token.color.border.error};
    border-radius: ${token.radius.md};
    place-content: center;
    background-color: ${token.color.feedback['error-background']};
    color: ${token.color.feedback.error};
    font-size: ${token.font.size.body};
`;

const errorMessageStyle = css`
    margin: 0;
`;

const errorActionsStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.space['component-gap']};
`;

const errorActionStyle = css`
    display: inline-flex;
    min-height: calc(${token.space['group-gap']} + ${token.space['card-padding']});
    align-items: center;
    justify-content: center;
    padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']};
    border: 1px solid currentColor;
    border-radius: ${token.radius.sm};
    background-color: ${token.color.background.elevated};
    color: ${token.color.feedback.error};
    font: inherit;
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition: ${token.motion.interaction};

    &:hover {
        text-decoration: underline;
    }

    &:focus-visible {
        outline: none;
        box-shadow: ${token.shadow['focus-ring']};
    }

    @media (forced-colors: active) {
        border-color: ButtonText;

        &:focus-visible {
            outline: 2px solid Highlight;
            outline-offset: 2px;
        }
    }
`;

const emptyStyle = css`
    padding: ${token.space['group-gap']};
    border: 1px dashed ${token.color.border.default};
    border-radius: ${token.radius.lg};
    color: ${token.color.text.secondary};
    text-align: center;
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

function subscribeTheme(callback: ThemeCallback): () => void {
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

function loadingDensityStyle(density: ComponentDemoRecord["density"]): string {
    if (density === "compact") return loadingCompactStyle;
    if (density === "spacious") return loadingSpaciousStyle;
    return loadingRegularStyle;
}

function messageError(data: WakeMessage): string {
    if (typeof data.error === "string" && data.error.length > 0) return data.error;
    if (typeof data.message === "string" && data.message.length > 0) return data.message;
    return "演示运行失败，请在工作台中查看详细信息。";
}

function isWakeMessage(data: unknown): data is WakeMessage {
    return typeof data === "object" && data !== null;
}

export function getComponentDemoFrameAttributes(demo: ComponentDemoRecord) {
    return {
        src: demo.previewPath,
        title: `${demo.title} 交互演示`,
        sandbox: "allow-scripts allow-same-origin",
        demoId: demo.id,
    } as const;
}

export function EmptyComponentDemos() {
    return (
        <p className={emptyStyle} role="status">
            暂无可用的组件演示。
        </p>
    );
}

export default function ComponentDemoFrame({
    demo,
    onThemeChange,
    getFrameWindow,
    renderFrame,
    readyTimeoutMs = DEFAULT_READY_TIMEOUT_MS,
}: ComponentDemoFrameProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [height, setHeight] = useState(() => initialHeight(demo.density));
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);
    const frameAttributes = getComponentDemoFrameAttributes(demo);

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
            if (event.data.type === "wake:resize" && typeof event.data.height === "number") {
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
                frameWindow.postMessage({ type: "wake:theme", theme }, "*");
                return;
            }
            if (event.data.type === "wake:error") {
                setReady(false);
                setError(messageError(event.data));
            }
        });
    }, [getFrameWindow, onThemeChange]);

    useEffect(() => {
        if (!shouldLoad || error) return;
        return subscribeTheme((theme) => {
            onThemeChange?.(theme);
            const frameWindow = getFrameWindow?.() ?? frameRef.current?.contentWindow;
            frameWindow?.postMessage({ type: "wake:theme", theme }, "*");
        });
    }, [error, getFrameWindow, onThemeChange, shouldLoad]);

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
        tabIndex: ready ? undefined : -1,
    } satisfies ComponentDemoFrameRenderState;

    return (
        <div ref={containerRef}>
            {error && (
                <div
                    className={cx(errorStyle, loadingDensityStyle(demo.density))}
                    role="alert"
                >
                    <p className={errorMessageStyle}>{error}</p>
                    <div className={errorActionsStyle}>
                        <button type="button" className={errorActionStyle} onClick={handleRetry}>
                            重新加载演示
                        </button>
                        <a
                            className={errorActionStyle}
                            href={demo.workbenchPath}
                            target="_blank"
                            rel="noreferrer"
                        >
                            在工作台中打开
                        </a>
                    </div>
                </div>
            )}
            {!error && !shouldLoad && (
                <div
                    className={cx(loadingStyle, loadingDensityStyle(demo.density))}
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
                            />
                        )}
                    {!ready && (
                        <div
                            className={cx(loadingStyle, loadingOverlayStyle)}
                            role="status"
                            aria-live="polite"
                        >
                            正在加载交互演示…
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
