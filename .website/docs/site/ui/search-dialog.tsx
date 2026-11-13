import { use, useEffect, useId, useRef } from "react";

import type * as UI from "@crab-dev/wake/docs";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";

import Dialog from "@crab-dev/rc-dialog";

import LineEdit from "@crab-dev/rc-line-edit";

import { SpinIndicator } from "@crab-dev/rc-spin";
import { EmptyFeedback, ErrorFeedback } from "./feedback.js";

import { SearchIcon } from "./icons.js";
import { SearchReturnFocusContext } from "./search-return-focus.js";
import { componentDesignSummaries, componentDemoDesigns } from "../../_generated/component-design-summaries.js";

export function SearchDialog({ search, route, theme }: UI.SearchDialogProps) {
    const { designSystem: design } = useConfig();
    const searchReturnFocus = use(SearchReturnFocusContext);
    const id = useId();
    // 例外：搜索输入 DOM 和关闭原因只供事件、effect 使用，不触发渲染。
    const input = useRef<HTMLInputElement>(null);
    const list = useRef<HTMLUListElement>(null);
    const navigating = useRef(false);
    const results = search.loading || search.error ? [] : search.results.filter(result => {
        const component = result.slug.split(/[\/#]/).find(part => part.startsWith("rc-"));
        const designs = component ? componentDemoDesigns[component]?.[result.title] : undefined;
        return !designs || designs.includes(design);
    });
    const activeIndex = Math.min(search.activeIndex, results.length - 1);
    const activeResult = results[activeIndex];
    const closed = () => {
        const returnToSearch = searchReturnFocus?.current;
        if (searchReturnFocus) searchReturnFocus.current = false;
        if (navigating.current) {
            navigating.current = false;
            route.focusContent();
        } else {
            const active = document.activeElement;
            // A shortcut can open search from the navigation drawer. Its old
            // control may be hidden by the time the native dialog returns focus.
            if (returnToSearch || active === document.body || active?.closest('[inert], dialog:not([open])')) {
                document.querySelector<HTMLButtonElement>(".crab-docs-rail-search")?.focus({ preventScroll: true });
            }
        }
    };
    const choose = (slug: string) => {
        navigating.current = true;
        search.select(slug);
    };
    const clear = () => {
        search.setQuery("");
        input.current?.focus();
    };
    useEffect(() => {
        if (search.open) {
            navigating.current = false;
            input.current?.focus();
        }
    }, [search.open]);
    useEffect(() => {
        if (!search.open) return;
        const active = list.current?.querySelector<HTMLElement>('[aria-selected="true"]');
        active?.scrollIntoView?.({ block: "nearest" });
    }, [search.open, search.activeIndex, search.query, search.loading]);
    return (
        <Dialog
            className="crab-docs-dialog crab-docs-search-dialog"
            data-theme={theme.resolved}
            data-crab-design={design}
            title="搜索文档"
            header={null}
            aria-labelledby={`${id}-title`}
            open={search.open}
            maskClosable
            footer={null}
            i18n={{ cancelText: "关闭" }}
            onOpenChange={search.setOpen}
            onKeyDown={event => {
                // Native cancel owns dismissal and return focus. Do not let
                // Wake's window shortcut close an underlying surface as well.
                if (event.key === "Escape") event.stopPropagation();
            }}
            ref={(node) => {
                node?.addEventListener("close", closed);
                return () => node?.removeEventListener("close", closed);
            }}
        >
            <div className="crab-docs-search" aria-busy={search.loading}>
                <div className="crab-docs-search-heading">
                    <h2 id={`${id}-title`}>搜索文档</h2>
                    <Button appearance="text" className="crab-docs-search-close" aria-label="关闭"
                        onClick={() => search.setOpen(false)}
                        icon={<svg className="crab-docs-tool-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" /></svg>} />
                </div>
                <div className="crab-docs-search-field">
                    <LineEdit
                        id={`${id}-query`}
                        className="crab-docs-search-input"
                        size="large"
                        bordered={false}
                        ref={input}
                        autoFocus
                        role="combobox"
                        aria-label="搜索组件、属性或教程"
                        aria-autocomplete="list"
                        aria-expanded={results.length > 0}
                        aria-controls={`${id}-results`}
                        aria-activedescendant={
                            activeResult ? `${id}-result-${activeIndex}` : undefined
                        }
                        aria-describedby={`${id}-help`}
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        enterKeyHint="search"
                        placeholder="搜索组件、API 或教程…"
                        prefix={<SearchIcon />}
                        suffix={
                            search.query ? (
                                <Button
                                    className="crab-docs-search-clear"
                                    appearance="text"
                                    aria-label="清除搜索"
                                    onClick={clear}
                                >
                                    <svg
                                        className="crab-docs-search-icon"
                                        viewBox="0 0 20 20"
                                        aria-hidden="true"
                                    >
                                        <path d="m5 5 10 10M15 5 5 15" />
                                    </svg>
                                </Button>
                            ) : undefined
                        }
                        value={search.query}
                        onValueChange={(value) => search.setQuery(value)}
                        onKeyDown={(event) => {
                            if (event.nativeEvent.isComposing || event.keyCode === 229) return;
                            if (event.key === "ArrowDown" && results.length) {
                                event.preventDefault();
                                search.setActiveIndex(
                                    Math.min(activeIndex + 1, results.length - 1),
                                );
                            }
                            if (event.key === "ArrowUp" && results.length) {
                                event.preventDefault();
                                search.setActiveIndex(Math.max(activeIndex - 1, 0));
                            }
                            if (event.key === "Enter" && activeResult) {
                                event.preventDefault();
                                choose(activeResult.slug);
                            }
                        }}
                    />
                </div>
                <div className="crab-docs-search-meta" role={search.error ? undefined : "status"}>
                    <span>{search.query.trim() ? "搜索结果" : "文档索引"}</span>
                    <span>
                        {search.loading
                            ? "正在搜索"
                            : search.error
                                ? "搜索失败"
                                : `${results.length} 个结果`}
                    </span>
                </div>
                <div className="crab-docs-search-scroll">
                    {search.loading && (
                        <div className="crab-docs-search-pending" aria-hidden="true">
                            <SpinIndicator /> 正在搜索…
                        </div>
                    )}
                    {search.error && (
                        <ErrorFeedback title="搜索暂时不可用" detail={search.error}
                            actions={<Button appearance="outlined" onClick={() => choose("/learn/components")}>浏览组件目录</Button>}>
                            暂时无法获取搜索结果，可以先通过组件目录或站点导航查找文档。
                        </ErrorFeedback>
                    )}
                    {!search.loading && !search.error && results.length === 0 && (
                        <EmptyFeedback search announce={false}
                            title={search.query ? "没有匹配的文档" : "输入关键词开始搜索"}
                            description={search.query ? "试试更短的关键词，或清空后查看文档推荐。" : "可以搜索组件名、API 属性或教程步骤。"}
                            actions={search.query && <Button appearance="outlined" onClick={clear}>清空关键词</Button>}
                        />
                    )}
                    <ul
                        className="crab-docs-results"
                        ref={list}
                        id={`${id}-results`}
                        role="listbox"
                        aria-label="搜索结果"
                    >
                        {results.map((result, index) => {
                            // 生成的示例标题使用“名称 — 说明”；展示分层，完整文字仍参与无障碍描述。
                            const separator = result.title.indexOf(" — ");
                            const title =
                                separator > 0 ? result.title.slice(0, separator) : result.title;
                            const component = result.slug.split(/[\/#]/).find(part => part.startsWith("rc-"));
                            const detail = separator > 0 ? result.title.slice(separator + 3)
                                : result.kind === "component" && !result.slug.includes("#") && component && componentDesignSummaries[component]
                                ? componentDesignSummaries[component]?.[design]
                                : result.detail;
                            const kind = searchResultKind(result.kind);
                            return (
                                <li key={`${result.slug}-${index}`} role="presentation">
                                    <Button
                                        appearance="text"
                                        id={`${id}-result-${index}`}
                                        role="option"
                                        tabIndex={-1}
                                        aria-selected={index === activeIndex}
                                        aria-label={title}
                                        aria-describedby={`${id}-detail-${index}${separator > 0 ? ` ${id}-source-${index}` : ""}`}
                                        onClick={() => choose(result.slug)}
                                    >
                                        <span className="crab-docs-result-heading">
                                            <strong>{title}</strong>
                                            {kind && (
                                                <span className="crab-docs-result-kind">
                                                    {kind}
                                                </span>
                                            )}
                                        </span>
                                        <span
                                            className="crab-docs-result-detail"
                                            id={`${id}-detail-${index}`}
                                        >
                                            {detail}
                                        </span>
                                        {separator > 0 && (
                                            <span
                                                className="crab-docs-result-source"
                                                id={`${id}-source-${index}`}
                                            >
                                                {result.detail}
                                            </span>
                                        )}
                                        <span className="crab-docs-result-enter" aria-hidden="true">
                                            ↵
                                        </span>
                                    </Button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="crab-docs-search-help" id={`${id}-help`}>
                    {results.length > 0 && <><span>
                        <kbd>↑</kbd> <kbd>↓</kbd> 选择
                    </span>
                    <span>
                        <kbd>Enter</kbd> 打开
                    </span></>}
                    <span>
                        <kbd>Esc</kbd> 关闭
                    </span>
                </div>
            </div>
        </Dialog>
    );
}

export function searchResultKind(kind: string) {
    const labels: Record<string, string> = {
        component: "组件",
        api: "API",
        demo: "示例",
        guide: "指南",
        tutorial: "教程",
    };
    return labels[kind];
}
