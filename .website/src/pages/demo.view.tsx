import { css } from "@linaria/core";
import { useEffect, useMemo, useState, type ComponentType, type FC, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router";
import demoLoaders from "../_generated/demoLoaders.js";
import manifest from "../_generated/manifest.js";

const pageStyle = css`
    max-width: 1080px;
    margin: 0 auto;
    padding: 24px;

    @media (max-width: 720px) {
        padding: 16px;
    }
`;

const panelStyle = css`
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--card);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
`;

const headerStyle = css`
    padding: 16px 18px;
    border-bottom: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    gap: 4px;

    > .title {
        font-size: 15px;
        font-weight: 600;
        color: var(--foreground);
    }

    > .desc {
        font-size: 13px;
        color: var(--muted-foreground);
        line-height: 1.55;
    }
`;

const stageStyle = css`
    padding: 22px;
    min-height: 140px;
    background:
        linear-gradient(var(--surface-raised), var(--surface-raised)) padding-box,
        repeating-linear-gradient(
            45deg,
            var(--border-subtle) 0 1px,
            transparent 1px 12px
        );
    background-clip: padding-box;
    overflow-x: auto;

    @media (max-width: 720px) {
        padding: 14px;
        min-height: 96px;
    }
`;

const actionRowStyle = css`
    margin-top: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
`;

const actionLinkStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--card);
    color: var(--foreground);
    text-decoration: none;
    font-size: 12px;
    transition: background-color var(--transition-fast), border-color var(--transition-fast);

    &:hover {
        background: var(--accent);
        border-color: var(--border-default);
    }

    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px var(--focus-ring-soft);
    }
`;

const errorStyle = css`
    padding: 14px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    background: var(--surface-sunken);
    color: var(--muted-foreground);
    font-size: 13px;
`;

const getSlugFromPath = (demoPath: string): string | null => {
    const matched = demoPath.match(/components\/(rc-[^/]+)/);
    return matched?.[1] ?? null;
};

const DemoStandaloneView: FC = () => {
    const [searchParams] = useSearchParams();
    const [element, setElement] = useState<ReactNode>(null);
    const [error, setError] = useState<string | null>(null);
    const demoPath = searchParams.get("path") ?? "";

    const meta = useMemo(() => {
        if (!demoPath) return null;
        for (const item of manifest) {
            const matched = item.demos.find(d => d.path === demoPath);
            if (matched) return { item, demo: matched };
        }
        return null;
    }, [demoPath]);

    const slug = useMemo(() => getSlugFromPath(demoPath), [demoPath]);
    const backHref = slug ? `/components/${slug}` : "/components";

    useEffect(() => {
        if (!demoPath) {
            setElement(null);
            setError("缺少 path 查询参数，无法定位 demo。");
            return;
        }

        const loader = demoLoaders[demoPath];
        if (!loader) {
            setElement(null);
            setError(`未找到 demo 加载器：${demoPath}`);
            return;
        }

        let mounted = true;
        setError(null);
        loader()
            .then(mod => {
                if (!mounted) return;
                const C = mod.default as ComponentType;
                setElement(<C />);
            })
            .catch((err: unknown) => {
                if (!mounted) return;
                const message = err instanceof Error ? err.message : String(err);
                setElement(null);
                setError(`无法加载示例：${message}`);
            });

        return () => {
            mounted = false;
        };
    }, [demoPath]);

    const title = meta?.demo.title ?? "独立示例";
    const description = meta?.demo.description ?? meta?.item.title ?? demoPath;

    return (
        <div className={pageStyle}>
            <div className={panelStyle}>
                <div className={headerStyle}>
                    <span className="title">{title}</span>
                    <span className="desc">{description}</span>
                </div>
                <div className={stageStyle}>
                    {error
                        ? <div className={errorStyle}>{error}</div>
                        : element}
                </div>
            </div>
            <div className={actionRowStyle}>
                <Link to={backHref} className={actionLinkStyle}>
                    返回{slug ? `「${slug}」` : "组件总览"}
                </Link>
                <Link to="/components" className={actionLinkStyle}>
                    所有组件
                </Link>
            </div>
        </div>
    );
};

export default DemoStandaloneView;
