import { useEffect, useId, useState } from "react";
import type { PageLoadingProps } from "@crab-dev/wake/docs";
import Skeleton from "@crab-dev/rc-skeleton";

function DocumentPlaceholder({ route, site }: PageLoadingProps) {
    const [stage, setStage] = useState<"waiting" | "loading" | "slow">("waiting");
    const titleId = useId();
    const title = route.page?.title ?? site.title;
    const component = route.page?.slug.startsWith("/components/") ?? false;
    const outlined = (route.page?.headings.length ?? 0) > 0;
    const message = stage === "slow"
        ? `“${title}”仍在加载，准备好后会自动显示。你可以继续使用导航或搜索。`
        : `正在准备“${title}”的内容…`;
    useEffect(() => {
        // A new document starts at the top; Wake restores its final heading or
        // fragment focus when the real page is ready. Keep focus on navigation.
        window.scrollTo({ top: 0, behavior: "instant" });
        const reveal = window.setTimeout(() => setStage("loading"), 180);
        const slow = window.setTimeout(() => setStage("slow"), 6000);
        return () => {
            window.clearTimeout(reveal);
            window.clearTimeout(slow);
        };
    }, []);
    return <>
        <article className="crab-docs-page-placeholder" aria-labelledby={titleId} aria-busy="true"
            data-stage={stage} data-component={component}>
            <div className="crab-docs-page-load-progress" aria-hidden="true"><span /></div>
            <div className="crab-docs-page-hero">
                <header className="crab-docs-page-heading">
                    <h1 id={titleId}>{title}</h1>
                    {route.page?.description && <p>{route.page.description}</p>}
                </header>
                {component && <div className="crab-docs-page-load-artwork" aria-hidden="true">
                    <Skeleton variant="rect" width="100%" height="100%" active={false} role="presentation" aria-live="off" />
                </div>}
            </div>
            <div className="crab-docs-page-load-body" data-outline={outlined} aria-hidden="true">
                <div className="crab-docs-page-load-copy">
                    <Skeleton variant="rect" width="38%" height="1.5rem" active={false} role="presentation" aria-live="off" />
                    <Skeleton rows={3} active={false} role="presentation" aria-live="off" />
                    <div className="crab-docs-page-load-example">
                        <Skeleton className="crab-docs-page-load-code-label" variant="rect" width="4rem" height=".75rem" active={false} role="presentation" aria-live="off" />
                        <Skeleton rows={4} width="88%" active={false} role="presentation" aria-live="off" />
                    </div>
                    <Skeleton variant="rect" width="28%" height="1.5rem" active={false} role="presentation" aria-live="off" />
                    <Skeleton rows={3} active={false} role="presentation" aria-live="off" />
                </div>
                {outlined && <div className="crab-docs-page-load-outline">
                    <Skeleton variant="rect" width="45%" height=".75rem" active={false} role="presentation" aria-live="off" />
                    <Skeleton rows={4} active={false} role="presentation" aria-live="off" />
                </div>}
                <p className="crab-docs-page-load-message">{message}</p>
            </div>
        </article>
        {/* Keep the announcement outside the busy article and decorative skeletons. */}
        <p className="crab-docs-page-load-status" role="status" aria-live="polite" aria-atomic="true">
            {stage === "waiting" ? "" : message}
        </p>
    </>;
}

export default function PageLoading(props: PageLoadingProps) {
    return <DocumentPlaceholder key={props.route.page?.slug ?? props.route.path} {...props} />;
}
