import { css } from "@crab-dev/css";
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
}

export interface ComponentDemoFrameRenderState {
    readonly src: string;
    readonly title: string;
    readonly sandbox: string;
    readonly demoId: string;
    readonly height: number;
    readonly ready: boolean;
}

interface WakeMessage {
    readonly type?: unknown;
    readonly height?: unknown;
    readonly error?: unknown;
    readonly message?: unknown;
}

const frameStyle = css`
    display: block;
    width: 100%;
    min-width: 0;
    min-height: 80px;
    border: 0;
    background-color: ${token.color.background.elevated};
`;

const loadingStyle = css`
    display: grid;
    min-height: 160px;
    place-items: center;
    color: ${token.color.text.secondary};
    font-size: ${token.font.size.caption};
`;

const errorStyle = css`
    padding: ${token.space['section-gap']};
    border: 1px solid ${token.color.border.error};
    border-radius: ${token.radius.md};
    background-color: ${token.color.feedback['error-background']};
    color: ${token.color.feedback.error};
    font-size: ${token.font.size.body};
`;

const emptyStyle = css`
    padding: ${token.space['group-gap']};
    border: 1px dashed ${token.color.border.default};
    border-radius: ${token.radius.lg};
    color: ${token.color.text.secondary};
    text-align: center;
`;

function readCodeTheme(): ComponentDemoCodeTheme {
    if (typeof document === "undefined") return "light";
    const theme = document.documentElement.dataset.theme;
    if (theme === "dark") return "dark";
    if (theme === "light") return "light";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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
}: ComponentDemoFrameProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [height, setHeight] = useState(() => initialHeight(demo.density));
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const frameAttributes = getComponentDemoFrameAttributes(demo);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || typeof IntersectionObserver === "undefined") {
            setShouldLoad(true);
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                setShouldLoad(true);
                observer.disconnect();
            }
        }, { rootMargin: "300px" });
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent<WakeMessage>) => {
            const frameWindow = getFrameWindow?.() ?? frameRef.current?.contentWindow;
            if (!frameWindow || event.source !== frameWindow || !event.data) return;
            if (event.data.type === "wake:resize" && typeof event.data.height === "number") {
                if (Number.isFinite(event.data.height)) {
                    setHeight(Math.max(80, Math.ceil(event.data.height)));
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
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [getFrameWindow, onThemeChange]);

    useEffect(() => {
        const syncTheme = () => {
            const theme = readCodeTheme();
            onThemeChange?.(theme);
            const frameWindow = getFrameWindow?.() ?? frameRef.current?.contentWindow;
            frameWindow?.postMessage({ type: "wake:theme", theme }, "*");
        };
        syncTheme();
        const observer = new MutationObserver(syncTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });
        const colorScheme = window.matchMedia?.("(prefers-color-scheme: dark)");
        colorScheme?.addEventListener("change", syncTheme);
        return () => {
            observer.disconnect();
            colorScheme?.removeEventListener("change", syncTheme);
        };
    }, [getFrameWindow, onThemeChange]);

    return (
        <div ref={containerRef}>
            {error && (
                <div className={errorStyle} role="alert">
                    {error}
                </div>
            )}
            {!error && !shouldLoad && (
                <div className={loadingStyle} role="status">
                    演示进入可视区域后加载
                </div>
            )}
            {!error && shouldLoad && (
                renderFrame
                    ? renderFrame({ ...frameAttributes, height, ready })
                    : (
                        <iframe
                            ref={frameRef}
                            className={frameStyle}
                            src={frameAttributes.src}
                            title={frameAttributes.title}
                            height={height}
                            loading="lazy"
                            sandbox={frameAttributes.sandbox}
                            data-wake-demo={frameAttributes.demoId}
                            aria-busy={!ready}
                        />
                    )
            )}
        </div>
    );
}
