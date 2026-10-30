import { Children, useEffect, useId, useRef, useState } from "react";
import type { FocusEvent } from "react";

import type * as UI from "@crab-dev/wake/docs";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";

import Dialog from "@crab-dev/rc-dialog";

import LineEdit from "@crab-dev/rc-line-edit";

import Segmented from "@crab-dev/rc-segmented";
import Alert from "@crab-dev/rc-alert";
import Empty from "@crab-dev/rc-empty";
import Spin from "@crab-dev/rc-spin";
import { useMediaQuery } from "@crab-dev/rc-hooks";
import { resolveSiteHref } from "../siteContext.js";
import { PageSections } from "../documentNavigation.js";

import SiteIcon from "../siteIcon.js";
import ComponentHeroPreview from "../componentHeroPreview.js";
import { SearchIcon } from "./icons.js";
import { follow } from "./navigation.js";

export function revealDocumentLink(event: FocusEvent<HTMLElement>) {
    const link = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!link || !event.currentTarget.contains(link) || link.closest("[data-wake-demo], [data-live-example]")) return;
    const scrollport = link.closest<HTMLElement>(".crab-home-category-index, .crab-docs-prose > .table-scroll");
    if (!scrollport || !event.currentTarget.contains(scrollport) || scrollport.clientWidth <= 0
        || scrollport.scrollWidth <= scrollport.clientWidth) return;
    // Native Tab scrolling can leave a partially visible link clipped. Reveal it
    // within this document-owned horizontal scrollport without moving the page.
    const box = scrollport.getBoundingClientRect();
    const left = box.left + scrollport.clientLeft;
    const right = left + scrollport.clientWidth;
    const rect = link.getBoundingClientRect();
    const style = link.ownerDocument.defaultView?.getComputedStyle(link);
    const outline = Math.max(0, Number.parseFloat(style?.outlineWidth ?? "") || 0)
        + Math.max(0, Number.parseFloat(style?.outlineOffset ?? "") || 0);
    const start = rect.left - outline;
    const end = rect.right + outline;
    // An oversized label cannot fit at once; expose its reading-order start.
    const delta = end - start > scrollport.clientWidth
        ? style?.direction === "rtl" ? end - right : start - left
        : start < left ? start - left : end > right ? end - right : 0;
    if (delta !== 0) scrollport.scrollBy({ left: delta, behavior: "instant" });
}

export function TableOfContents({
    headings,
    activeId,
    navigate,
    variant,
    route,
}: UI.TableOfContentsProps) {
    const component = /(^|\/)components\//.test(route.page?.slug ?? route.path);
    const visible = headings.filter((heading) => component ? heading.depth === 2 : heading.depth <= 3);
    // Component pages show chapters only; a nested heading keeps its parent chapter active.
    const currentId = component
        ? headings.slice(0, headings.findIndex(heading => heading.id === activeId) + 1)
            .findLast(heading => heading.depth === 2)?.id
        : activeId;
    if (!visible.length) return null;
    return (
        <nav className="crab-docs-toc" role="navigation" data-variant={variant} aria-label="本页目录">
            <strong>本页内容</strong>
            {visible.map((heading) => (
                <Button
                    key={heading.id}
                    appearance="text"
                    href={heading.href}
                    aria-current={currentId === heading.id ? "location" : undefined}
                    onClick={(event) => follow(event, heading.id, navigate)}
                >
                    <span title={heading.title}>{heading.title}</span>
                </Button>
            ))}
        </nav>
    );
}

export function Page({ page, previous, next, route, site, children }: UI.PageProps) {
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    // 例外：持有本站正文 DOM，将历史 Markdown 根路径链接适配到公开部署前缀。
    const article = useRef<HTMLElement>(null);
    useEffect(() => {
        const base = site.basePath.replace(/\/$/, "");
        if (!base) return;
        for (const anchor of article.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ??
            []) {
            if (anchor.closest("[data-wake-demo]")) continue;
            const href = anchor.getAttribute("href");
            if (
                !href ||
                !href.startsWith("/") ||
                href.startsWith("//") ||
                href === base ||
                href.startsWith(`${base}/`)
            )
                continue;
            anchor.setAttribute("href", resolveSiteHref(href, route.href));
        }
    }, [children, page.slug, route.href, site.basePath]);
    const home = page.href === site.homeHref;
    const catalog = page.slug.replace(/^\//, "") === "learn/components";
    const component = page.slug.replace(/^\//, "").startsWith("components/");
    const packageName = page.slug.split("/").at(-1) ?? "";
    // The hero changes height with content and viewport width; share its measured height with sticky offsets.
    useEffect(() => {
        if (home || catalog) return;
        const pageRoot = article.current;
        const hero = pageRoot?.querySelector<HTMLElement>(".crab-docs-page-hero");
        if (!pageRoot || !hero) return;
        const update = () => pageRoot.style.setProperty("--crab-docs-hero-height", `${hero.offsetHeight}px`);
        const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
        observer?.observe(hero);
        update();
        window.addEventListener("resize", update);
        return () => {
            observer?.disconnect();
            window.removeEventListener("resize", update);
            pageRoot.style.removeProperty("--crab-docs-hero-height");
        };
    }, [catalog, home, page.slug]);
    const pageTail = !home && <>
        <nav className="crab-docs-pager" role="navigation" aria-label="文档翻页">
            {previous && <Button appearance="text" href={previous.href}
                onClick={(event) => follow(event, previous.slug, route.navigate)}>
                <span className="crab-docs-pager-label">← 上一篇</span><strong>{previous.title}</strong>
            </Button>}
            {next && <Button appearance="text" href={next.href}
                onClick={(event) => follow(event, next.slug, route.navigate)}>
                <span className="crab-docs-pager-label">下一篇 →</span><strong>{next.title}</strong>
            </Button>}
        </nav>
        <footer className="crab-docs-footer">
            <div><strong>Crab UI</strong><p>支持 MD3 Expressive、Apple 与 shadcn/ui 三套设计体系的 React 组件库。通过统一配置、设计令牌与可运行示例，构建清晰、一致的界面。</p></div>
            <nav aria-label="页脚导航">
                <Button appearance="text" href={route.href("guides/getting-started")}>开始使用</Button>
                <Button appearance="text" href={route.href("guides/accessibility")}>无障碍</Button>
                {site.repositoryUrl && <Button appearance="text" href={site.repositoryUrl}>GitHub ↗</Button>}
            </nav>
            <Button appearance="outlined" className="crab-docs-back-top" aria-label="返回顶部" icon={<SiteIcon name="up" />}
                onClick={() => {
                    article.current?.querySelector("h1")?.focus({ preventScroll: true });
                    window.scrollTo({ top: 0 });
                }} />
        </footer>
    </>;
    return (
        <article ref={article} className="crab-docs-page" data-home={home} data-component={component} data-reading={!home && !catalog}
            onFocusCapture={revealDocumentLink}>
            <div className="crab-docs-page-main">
                {!home && (
                    <div className="crab-docs-page-hero">
                        <header className="crab-docs-page-heading">
                            <h1 tabIndex={-1}>{page.title}</h1>
                            <p>{page.description}</p>
                            {component && (
                                <>
                                    <nav className="crab-docs-actions" role="navigation" aria-label="组件快捷入口">
                                        <Button
                                            appearance="tonal"
                                            href={`${route.href(`${page.slug}/workbench`)}/`}
                                        >
                                            组件工作台 ↗
                                        </Button>
                                        <code className="crab-docs-package">@crab-dev/{packageName}</code>
                                    </nav>
                                    {reducedMotion && <p className="crab-docs-motion-note" role="status">
                            已启用减少动态效果，示例中的位移与展开动画已减弱。
                                    </p>}
                                </>
                            )}
                        </header>
                        {component && <ComponentHeroPreview key={page.slug} name={packageName} />}
                    </div>
                )}
                {!home && !catalog ? <PageSections key={page.slug} page={page}>{children}</PageSections>
                    : <div className="crab-docs-prose">{children}</div>}
                {pageTail}
            </div>
        </article>
    );
}

export function CodeBlock({
    title,
    language,
    code,
    children,
    copy,
    copyStatus,
}: UI.CodeBlockProps) {
    const lines = code.replace(/\r\n?/g, "\n").split("\n");
    const highlighted = Children.toArray(children);
    // Use the public source as the line boundary; custom UI does not inherit Wake's line CSS.
    const content = highlighted.length === lines.length ? highlighted : lines;
    return (
        <figure className="crab-docs-code">
            <figcaption>
                <span>{title || language || "代码"}</span>
                <Button size="s" appearance="text" onClick={copy}>
                    {copyStatus === "copied"
                        ? "已复制"
                        : copyStatus === "error"
                            ? "重试复制"
                            : "复制"}
                </Button>
            </figcaption>
            <pre tabIndex={0}>
                <code>
                    {content.map((line, index) => (
                        <span className="crab-docs-code-line" key={index}>
                            {line || "\n"}
                        </span>
                    ))}
                </code>
            </pre>
            {copyStatus === "error" && <p role="status">复制失败，请重试或手动选择代码。</p>}
        </figure>
    );
}

export function ApiTable(props: UI.ApiTableProps) {
    return (
        <section className="crab-docs-api" aria-label={`${props.symbol} 属性参考`}>
            <div className="crab-docs-api-heading">
                <strong>{props.symbol}</strong>
                <span>
                    {props.properties.length} / {props.total} 项属性
                </span>
            </div>
            {props.description && <p>{props.description}</p>}
            <LineEdit
                className="crab-docs-api-filter"
                aria-label="筛选 API 属性"
                placeholder="筛选属性…"
                prefix={<SearchIcon />}
                value={props.filter}
                onValueChange={(value) => props.setFilter(value)}
            />
            {props.error && (
                <Alert type="error" title="API 加载失败">
                    {props.error}
                </Alert>
            )}
            <dl className="crab-docs-properties">
                {props.properties.map((property) => (
                    <div key={property.name}>
                        <dt>
                            <code>{property.name}</code>
                            {property.required && <span data-kind="required">必填</span>}
                            {property.deprecated && <span data-kind="deprecated">已弃用</span>}
                        </dt>
                        <dd>
                            <code>{property.type_text}</code>
                            <p>{property.description || "暂无说明"}</p>
                            <span className="crab-docs-muted">
                                默认值：{property.default_value ?? "未声明"}
                                {property.since ? ` · 自 ${property.since}` : ""}
                            </span>
                        </dd>
                    </div>
                ))}
            </dl>
            {!props.error && props.properties.length === 0 && (
                <Empty preset="search" title="没有匹配的属性" />
            )}
            {props.inherited.length > 0 && (
                <details>
                    <summary>继承属性（{props.inherited.length}）</summary>
                    <ul>
                        {props.inherited.map((item, index) => (
                            <li key={`${item.name}-${index}`}>
                                <code>
                                    {item.name}: {item.type_text}
                                </code>{" "}
                                — {item.source}
                            </li>
                        ))}
                    </ul>
                </details>
            )}
            {props.warnings.length > 0 && (
                <details>
                    <summary>类型提取提示</summary>
                    <ul>
                        {props.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                        ))}
                    </ul>
                </details>
            )}
        </section>
    );
}

export function Demo(props: UI.DemoProps) {
    const { designSystem: design } = useConfig();
    const [dialogSurface, setDialogSurface] = useState(false);
    const codeId = useId();
    // Dialog 退出动画结束前继续承载唯一 preview，包含外部状态驱动的关闭。
    useEffect(() => {
        if (props.fullscreen) setDialogSurface(true);
    }, [props.fullscreen]);
    const inDialog = props.fullscreen || dialogSurface;
    const preview = (
        <div
            className="crab-docs-demo-viewport"
            data-viewport={props.viewport}
            data-background={props.background}
            data-padding={props.padding === "0" || props.padding === "0px" ? "none" : "default"}
            data-wake-demo
        >
            {props.preview}
        </div>
    );
    return (
        <section className="crab-docs-demo" aria-busy={props.loading}>
            <h3>{props.title}</h3>
            <p>{props.description}</p>
            {props.loading && (
                <div role="status">
                    <Spin /> 正在加载示例…
                </div>
            )}
            {props.error && (
                <Alert type="error" title="示例加载失败">
                    {props.error}
                </Alert>
            )}
            {!inDialog && preview}
            <div className="crab-docs-actions">
                <Button
                    aria-expanded={props.codeOpen}
                    aria-controls={codeId}
                    onClick={() => props.setCodeOpen(!props.codeOpen)}
                >
                    源码
                </Button>
                <Segmented
                    aria-label="示例视口"
                    size="small"
                    value={props.viewport}
                    options={[
                        { label: "自适应", value: "responsive" },
                        { label: "平板", value: "tablet" },
                        { label: "手机", value: "mobile" },
                    ]}
                    onValueChange={(value) => {
                        if (value === "responsive" || value === "tablet" || value === "mobile")
                            props.setViewport(value);
                    }}
                />
                <Button onClick={() => props.setFullscreen(true)}>全屏</Button>
                <Button onClick={props.copy}>{props.copied ? "已复制" : "复制源码"}</Button>
            </div>
            <div id={codeId} hidden={!props.codeOpen} className="crab-docs-code">
                <pre tabIndex={0}>
                    <code>{props.highlightedSource || props.source}</code>
                </pre>
            </div>
            <Dialog
                className="crab-docs-dialog crab-docs-fullscreen"
                data-theme={props.theme.resolved}
                data-crab-design={design}
                title={props.title}
                open={props.fullscreen}
                onOpenChange={props.setFullscreen}
                ref={(node) => {
                    const closed = () => setDialogSurface(false);
                    node?.addEventListener("close", closed);
                    return () => node?.removeEventListener("close", closed);
                }}
            >
                {inDialog && preview}
            </Dialog>
        </section>
    );
}

export function PageLoading() {
    return (
        <div className="crab-docs-state" role="status" aria-busy="true">
            <Spin /> 正在加载文档…
        </div>
    );
}

export function PageError({ error, retry }: UI.PageErrorProps) {
    return (
        <div className="crab-docs-state">
            <Alert type="error" title="文档加载失败">
                {error}
            </Alert>
            <Button onClick={retry}>重试加载</Button>
        </div>
    );
}

export function NotFound({ site }: UI.NotFoundProps) {
    return (
        <div className="crab-docs-state">
            <Empty title="找不到这篇文档" description="请检查地址，或通过搜索查找组件。" />
            <Button href={site.homeHref}>返回首页</Button>
        </div>
    );
}
