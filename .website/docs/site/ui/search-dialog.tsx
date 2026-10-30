import { useEffect, useId, useRef } from "react";

import type * as UI from "@crab-dev/wake/docs";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";

import Dialog from "@crab-dev/rc-dialog";

import LineEdit from "@crab-dev/rc-line-edit";

import Alert from "@crab-dev/rc-alert";
import Empty from "@crab-dev/rc-empty";
import Spin from "@crab-dev/rc-spin";

import { SearchIcon } from "./icons.js";

export function SearchDialog({ search, route, theme }: UI.SearchDialogProps) {
    const { designSystem: design } = useConfig();
    const id = useId();
    // 例外：搜索输入 DOM 和关闭原因只供事件、effect 使用，不触发渲染。
    const input = useRef<HTMLInputElement>(null);
    const list = useRef<HTMLUListElement>(null);
    const navigating = useRef(false);
    const results = search.loading || search.error ? [] : search.results;
    const activeResult = results[search.activeIndex];
    const closed = () => {
        if (navigating.current) {
            navigating.current = false;
            route.focusContent();
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
            open={search.open}
            maskClosable
            onOpenChange={search.setOpen}
            ref={(node) => {
                node?.addEventListener("close", closed);
                return () => node?.removeEventListener("close", closed);
            }}
            onConfirm={() => {
                if (activeResult) choose(activeResult.slug);
                else input.current?.focus();
                return false;
            }}
            i18n={{ confirmText: activeResult ? "打开文档" : "编辑关键词", cancelText: "关闭" }}
        >
            <div className="crab-docs-search" aria-busy={search.loading}>
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
                            activeResult ? `${id}-result-${search.activeIndex}` : undefined
                        }
                        aria-describedby={`${id}-help`}
                        autoComplete="off"
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
                            if (event.nativeEvent.isComposing) return;
                            if (event.key === "ArrowDown" && results.length) {
                                event.preventDefault();
                                search.setActiveIndex(
                                    Math.min(search.activeIndex + 1, results.length - 1),
                                );
                            }
                            if (event.key === "ArrowUp" && results.length) {
                                event.preventDefault();
                                search.setActiveIndex(Math.max(search.activeIndex - 1, 0));
                            }
                            if (event.key === "Enter" && activeResult) {
                                event.preventDefault();
                                choose(activeResult.slug);
                            }
                        }}
                    />
                </div>
                <div className="crab-docs-search-meta" role="status">
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
                        <div className="crab-docs-search-pending" role="status">
                            <Spin /> 正在搜索…
                        </div>
                    )}
                    {search.error && (
                        <Alert type="error" title="搜索失败">
                            {search.error}
                        </Alert>
                    )}
                    {!search.loading && !search.error && results.length === 0 && (
                        <Empty
                            preset="search"
                            title={search.query ? "没有匹配的文档" : "输入关键词开始搜索"}
                            description="可以搜索组件名、API 属性或教程步骤。"
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
                            const detail =
                                separator > 0 ? result.title.slice(separator + 3) : result.detail;
                            const kind = searchResultKind(result.kind);
                            return (
                                <li key={`${result.slug}-${index}`} role="presentation">
                                    <Button
                                        appearance="text"
                                        id={`${id}-result-${index}`}
                                        role="option"
                                        tabIndex={-1}
                                        aria-selected={index === search.activeIndex}
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
                    <span>
                        <kbd>↑</kbd> <kbd>↓</kbd> 选择
                    </span>
                    <span>
                        <kbd>Enter</kbd> 打开
                    </span>
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
