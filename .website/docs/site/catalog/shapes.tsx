import type { ReactNode } from "react";

// Decorative overview artwork. These shapes never act as interactive controls.
export function Box({ x = 40, y = 24, w = 160, h = 104, tone = "surface", r = 6 }: {
    x?: number; y?: number; w?: number; h?: number; tone?: string; r?: number;
}) {
    return <rect x={x} y={y} width={w} height={h} rx={r} className={`cc-${tone}`} />;
}

export function Line({ x = 56, y = 48, w = 80, tone = "muted" }: {
    x?: number; y?: number; w?: number; tone?: string;
}) {
    return <path d={`M${x} ${y}h${w}`} className={`cc-line cc-${tone}`} />;
}

export function Label({ x = 120, y = 80, children, tone = "text", anchor = "middle" }: {
    x?: number; y?: number; children: ReactNode; tone?: string; anchor?: "middle" | "start";
}) {
    return <text x={x} y={y} textAnchor={anchor} className={`cc-label cc-${tone}`}>{children}</text>;
}

export function Check({ x = 64, y = 68, tone = "on-brand" }: { x?: number; y?: number; tone?: string }) {
    return <path d={`M${x} ${y}l4 4 8-9`} className={`cc-stroke cc-${tone}`} />;
}

export function Chevron({ x = 172, y = 72 }: { x?: number; y?: number }) {
    return <path d={`M${x - 4} ${y - 2}l4 4 4-4`} className="cc-stroke cc-text" />;
}

export function Window({ children }: { children: ReactNode }) {
    return <><Box x={24} y={20} w={192} h={112} /><path d="M24 42h192" className="cc-stroke cc-border" /><circle cx={36} cy={31} r={2} className="cc-muted" /><circle cx={44} cy={31} r={2} className="cc-muted" /><circle cx={52} cy={31} r={2} className="cc-muted" />{children}</>;
}
