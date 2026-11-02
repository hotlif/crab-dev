import { use, useId } from "react";
import type { ReactNode } from "react";
import type { NotFoundProps, PageErrorProps } from "@crab-dev/wake/docs";
import Button from "@crab-dev/rc-button";
import { ErrorDetails } from "./feedback.js";
import { DocumentRecoveryContext } from "./document-recovery.js";

function DocumentState({ label, title, description, actions, detail, error = false }: {
    readonly label: string;
    readonly title: string;
    readonly description: string;
    readonly actions: ReactNode;
    readonly detail?: string;
    readonly error?: boolean;
}) {
    const titleId = useId();
    return <section className="crab-docs-document-state" aria-labelledby={titleId}>
        <div className="crab-docs-document-state-panel">
            <div className="crab-docs-document-state-message" role={error ? "alert" : undefined}>
                <span className="crab-docs-document-state-label">{label}</span>
                <h1 id={titleId}>{title}</h1>
                <p>{description}</p>
            </div>
            <div className="crab-docs-feedback-actions">{actions}</div>
            <ErrorDetails detail={detail} />
        </div>
    </section>;
}

export function PageError({ error, retry, route }: PageErrorProps) {
    const recovery = use(DocumentRecoveryContext);
    return <DocumentState error label="暂时无法打开" title="文档加载失败"
        description={`${route.page ? `“${route.page.title}”的内容` : "文档内容"}暂时无法显示。可以重试，或先从组件目录继续浏览。`}
        detail={error} actions={<>
            <Button appearance="primary" onClick={() => { recovery?.request(); retry(); }}>重试加载</Button>
            <Button appearance="outlined" href={route.href("learn/components")}>查看组件目录</Button>
        </>} />;
}

export function NotFound({ site, route }: NotFoundProps) {
    return <DocumentState label="404" title="找不到这篇文档"
        description="页面可能已移动，或地址有误。可以从组件目录重新查找，也可以使用上方搜索。"
        actions={<>
            <Button appearance="primary" href={route.href("learn/components")}>查看组件目录</Button>
            <Button appearance="outlined" href={site.homeHref}>返回首页</Button>
        </>} />;
}
