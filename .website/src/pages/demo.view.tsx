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
    const demoPath = searchParams.get("path") ?? "";

    useEffect(() => {
        if (!demoPath) {
            setElement(null);
            return;
        }

        const loader = demoLoaders[demoPath];
        if (!loader) {
            setElement(null);
            return;
        }

        let mounted = true;
        loader()
            .then(mod => {
                if (!mounted) return;
                const C = mod.default as ComponentType;
                setElement(<C />);
            })
            .catch((err: unknown) => {
                if (!mounted) return;
                const message = err instanceof Error ? err.message : String(err);
            });

        return () => {
            mounted = false;
        };
    }, [demoPath]);

    return element
};

export default DemoStandaloneView;
