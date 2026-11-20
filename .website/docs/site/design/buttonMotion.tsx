import { useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import SiteIcon from "../siteIcon.js";
import { buttonExamples, type ButtonKind } from "./buttonKinds.js";
import "./buttonMotion.styles.js";

export type SavePhase = "idle" | "busy" | "success" | "failed";

export function MotionIndicator() {
    return <span aria-hidden="true" className="crab-design-motion-indicator"><i/><i/><i/></span>;
}

type SampleProps = {
    children: string; busy: boolean; disabled?: boolean;
    kind?: ButtonKind; selected?: boolean; type?: "submit" | "button";
    expanded?: boolean; controls?: string;
};

export function SampleButton({ children, kind = "primary", busy, disabled, selected, expanded, controls, type = "button", onClick }: SampleProps & {
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
    const { designSystem } = useConfig();
    const { appearance } = buttonExamples[kind];
    const iconOnly = kind === "icon";
    const round = !iconOnly && designSystem === "md3";
    return <Button type={type} appearance={appearance} danger={kind === "danger"}
        shape={iconOnly ? "circle" : round ? "round" : undefined} data-prototype-round={round || undefined}
        icon={iconOnly ? <SiteIcon name="refresh" /> : undefined} aria-label={iconOnly ? children : undefined}
        isSelected={kind === "toggle" ? selected : undefined} loading={busy} loadingIcon={<MotionIndicator />}
        aria-expanded={expanded} aria-controls={controls} disabled={disabled} onClick={onClick}>
        {iconOnly ? null : <span className="crab-design-button-label">{children}</span>}
    </Button>;
}

export function MotionButton({ onActivate, ...props }: SampleProps & { onActivate?: () => void }) {
    const [pulse, setPulse] = useState<{ sequence: number; x: number; y: number; color: string; radius: string } | null>(null);
    function activate(event: MouseEvent<HTMLButtonElement>) {
        if (!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.detail && rect.width ? (event.clientX - rect.left) * 100 / rect.width : 50;
            const y = event.detail && rect.height ? (event.clientY - rect.top) * 100 / rect.height : 50;
            const { color, borderRadius } = getComputedStyle(event.currentTarget);
            setPulse(previous => ({ sequence: (previous?.sequence ?? 0) + 1, x, y, color, radius: borderRadius }));
        }
        onActivate?.();
    }
    return <span className="crab-design-motion-action" data-kind={props.kind ?? "primary"}>
        <SampleButton {...props} onClick={activate} />
        {pulse && <span className="crab-design-motion-clip" aria-hidden="true" style={{ color: pulse.color, borderRadius: pulse.radius }}>
            <i key={pulse.sequence} className="crab-design-motion-pulse" onAnimationEnd={() => setPulse(current => current === pulse ? null : current)} style={{
                "--crab-press-x": pulse.x + "%", "--crab-press-y": pulse.y + "%",
            } as CSSProperties}/>
        </span>}
    </span>;
}

export function MotionFeedback({ phase, children }: { phase: SavePhase; children: ReactNode }) {
    const result = phase === "success" || phase === "failed";
    return <p className="crab-design-feedback" role="status" data-phase={phase} data-motion-result={result || undefined}>
        {result && <svg key={phase} className="crab-design-result-icon" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="10" cy="10" r="8" />
            <path pathLength="1" d={phase === "success" ? "m5.5 10 3 3 6-6" : "M10 5.8v5.1m0 2.6v.2"} />
        </svg>}
        {children}
    </p>;
}
