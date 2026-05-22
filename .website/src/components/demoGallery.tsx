import { css } from "@linaria/core";
import { useEffect, useState, type FC, type ReactNode, type ComponentType } from "react";
import Preview, { type PreviewDensity } from "@crab-dev/rc-component-preview";

import demoLoaders from "../_generated/demoLoaders.js";
import type { DemoMeta } from "../_generated/manifest.js";
import { useTheme } from "../theme/useTheme.js";

const errorStyle = css`
    padding: 24px;
    color: var(--text-tertiary);
    font-size: 13px;
    text-align: center;
    font-family: var(--font-mono);
    line-height: 1.6;
    max-width: 100%;
    word-break: break-word;
`;

const gridStyle = css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
`;

const COMPACT_STAGE_SLUGS = new Set([
    "rc-button",
    "rc-badge",
    "rc-tag",
    "rc-avatar",
    "rc-checkbox",
    "rc-radio",
    "rc-switch",
    "rc-slider",
    "rc-tooltip",
]);

const SPACIOUS_STAGE_SLUGS = new Set([
    "rc-table",
    "rc-tree",
    "rc-virtual",
    "rc-prose",
    "rc-app-main-layout",
    "rc-masonry",
]);

const getStageDensity = (demoPath: string): PreviewDensity => {
    const matched = demoPath.match(/components\/(rc-[^/]+)/);
    const slug = matched?.[1];
    if (!slug) return "regular";
    if (COMPACT_STAGE_SLUGS.has(slug)) return "compact";
    if (SPACIOUS_STAGE_SLUGS.has(slug)) return "spacious";
    return "regular";
};

const getStandaloneDemoHref = (demoPath: string): string =>
    `/demo?path=${encodeURIComponent(demoPath)}`;

interface DemoBlockProps {
    meta: DemoMeta;
}

const DemoBlock: FC<DemoBlockProps> = ({ meta }) => {
    const { theme } = useTheme();
    const [Element, setElement] = useState<ReactNode>(null);
    const [error, setError] = useState<string | null>(null);
    const density = getStageDensity(meta.path);

    useEffect(() => {
        const loader = demoLoaders[meta.path];
        if (!loader) {
            setError("未找到 demo 加载器");
            return;
        }
        let mounted = true;
        loader()
            .then(mod => {
                if (!mounted) return;
                const C = mod.default as ComponentType;
                setElement(<C />);
                setError(null);
            })
            .catch((err: unknown) => {
                if (!mounted) return;
                const msg = err instanceof Error ? err.message : String(err);
                setError(`无法加载示例: ${msg}`);
            });
        return () => {
            mounted = false;
        };
    }, [meta.path]);

    return (
        <Preview
            title={meta.title}
            description={meta.description}
            path={getStandaloneDemoHref(meta.path)}
            sourceCode={meta.source}
            language="tsx"
            density={density}
            codeTheme={theme === "dark" ? "dark" : "light"}
        >
            {error ? <div className={errorStyle}>{error}</div> : Element}
        </Preview>
    );
};

interface DemoGalleryProps {
    demos: DemoMeta[];
}

const DemoGallery: FC<DemoGalleryProps> = ({ demos }) => {
    if (demos.length === 0) return null;
    return (
        <div className={gridStyle}>
            {demos.map(d => (
                <DemoBlock key={d.path} meta={d} />
            ))}
        </div>
    );
};

export default DemoGallery;
