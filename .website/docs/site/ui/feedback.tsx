import type { ReactNode } from "react";
import Alert from "@crab-dev/rc-alert";
import Empty from "@crab-dev/rc-empty";

export function ErrorDetails({ detail }: { readonly detail?: string | null }) {
    if (!detail) return null;
    return <details className="crab-docs-error-details">
        <summary><span className="crab-docs-error-details-marker" aria-hidden="true" />查看错误详情</summary>
        <pre>{detail}</pre>
    </details>;
}

export function ErrorFeedback({ title, children, detail, actions, tone = "error" }: {
    readonly title: string;
    readonly children: ReactNode;
    readonly detail?: string | null;
    readonly actions?: ReactNode;
    readonly tone?: "error" | "info";
}) {
    return <div className="crab-docs-feedback" data-tone={tone}>
        <Alert type={tone} role={tone === "error" ? "alert" : "status"} title={title}>{children}</Alert>
        {actions && <div className="crab-docs-feedback-actions">{actions}</div>}
        <ErrorDetails detail={detail} />
    </div>;
}

export function EmptyFeedback({ title, description, actions, search = false, announce = true }: {
    readonly title: string;
    readonly description: string;
    readonly actions?: ReactNode;
    readonly search?: boolean;
    readonly announce?: boolean;
}) {
    return <div className="crab-docs-empty-feedback">
        <Empty preset={search ? "search" : "default"} imageSize={40} title={title} description={description}
            role={announce ? "status" : "presentation"} aria-live={announce ? "polite" : "off"}
            action={actions && <div className="crab-docs-feedback-actions">{actions}</div>} />
    </div>;
}
