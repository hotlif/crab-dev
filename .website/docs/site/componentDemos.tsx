import { css } from "@crab-dev/css";
import Preview from "@crab-dev/rc-component-preview";
import Masonry from "@crab-dev/rc-masonry";
import { useResizeObserver } from "@crab-dev/rc-hooks";
import token from "@crab-dev/rc-token-semantic";
import { useRef, useState } from "react";
import { useSiteHref } from "./siteContext.js";
import ComponentDemoFrame, {
    EmptyComponentDemos,
    type ComponentDemoCodeTheme,
} from "./componentDemoFrame.js";

export interface ComponentDemoRecord {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly learning: {
        readonly components: readonly string[];
        readonly props: readonly string[];
        readonly events: readonly string[];
        readonly hasState: boolean;
    };
    readonly sourceCode: string;
    readonly previewPath: string;
    readonly workbenchPath: string;
    readonly density: "compact" | "regular" | "spacious";
    readonly layout: "grid" | "wide";
    readonly group: string | null;
}

interface ComponentDemosProps {
    readonly demos: readonly ComponentDemoRecord[];
}

const collectionStyle = css`
    display: grid;
    gap: ${token.space['section-gap']};
    margin-block: ${token.space['group-gap']};
`;

const groupStyle = css`
    display: grid;
    gap: ${token.space['group-gap']};
`;

const groupTitleStyle = css`
    margin: 0;
    padding-block-end: ${token.space['component-gap']};
    border-bottom: 1px solid ${token.color.border.default};
    color: ${token.color.text.primary};
    font-size: ${token.font.size.subhead};
    font-weight: ${token.font.weight.heading};
`;

const layoutStyle = css`
    display: grid;
    min-width: 0;
    gap: ${token.space['group-gap']};
`;

const masonryStyle = css`
    min-width: 0;
    column-gap: ${token.space['group-gap']};
`;

function DemoCard({ demo }: { readonly demo: ComponentDemoRecord }) {
    const href = useSiteHref();
    const [codeTheme, setCodeTheme] = useState<ComponentDemoCodeTheme>("light");

    return (
        <Preview
            title={demo.title}
            description={demo.description}
            sourceCode={demo.sourceCode}
            path={href(demo.workbenchPath)}
            density={demo.density}
            codeTheme={codeTheme}
            data-component-demo-id={demo.id}
            data-demo-layout={demo.layout}
        >
            <ComponentDemoFrame demo={demo} onThemeChange={setCodeTheme} />
        </Preview>
    );
}

interface DemoGroup {
    readonly title: string | null;
    readonly demos: readonly ComponentDemoRecord[];
}

function collectDemoGroups(demos: readonly ComponentDemoRecord[]): readonly DemoGroup[] {
    const groups = new Map<string | null, ComponentDemoRecord[]>();
    for (const demo of demos) {
        const current = groups.get(demo.group);
        if (current) {
            current.push(demo);
        } else {
            groups.set(demo.group, [demo]);
        }
    }
    return [...groups].map(([title, groupedDemos]) => ({ title, demos: groupedDemos }));
}

function DemoMasonry({ demos }: { readonly demos: readonly ComponentDemoRecord[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [layout, setLayout] = useState({ columns: 1, gutter: 0 });

    useResizeObserver(containerRef, ({ target, contentRect }) => {
        const gutter = Number.parseFloat(getComputedStyle(target).columnGap) || 0;
        // Preserve the existing 19rem minimum, using the content width rather
        // than viewport breakpoints so navigation and wide demos remain usable.
        const minColumnWidth = 19 * (Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
        const columns = Math.max(1, Math.min(demos.length,
            Math.floor((contentRect.width + gutter) / (minColumnWidth + gutter))));
        setLayout(previous => previous.columns === columns && previous.gutter === gutter
            ? previous : { columns, gutter });
    });

    return (
        <div ref={containerRef} className={masonryStyle} data-demo-masonry>
            <Masonry columns={layout.columns} gutter={layout.gutter}>
                {demos.map(demo => <DemoCard key={demo.id} demo={demo} />)}
            </Masonry>
        </div>
    );
}

function DemoLayout({ demos }: { readonly demos: readonly ComponentDemoRecord[] }) {
    const runs: { wide: boolean; demos: ComponentDemoRecord[] }[] = [];
    for (const demo of demos) {
        const previous = runs.at(-1);
        if (demo.layout !== "wide" && previous && !previous.wide) {
            previous.demos.push(demo);
        } else {
            runs.push({ wide: demo.layout === "wide", demos: [demo] });
        }
    }

    return (
        <div className={layoutStyle}>
            {runs.map(run => run.wide
                ? <DemoCard key={run.demos[0].id} demo={run.demos[0]} />
                : <DemoMasonry key={run.demos[0].id} demos={run.demos} />)}
        </div>
    );
}

export default function ComponentDemos({ demos }: ComponentDemosProps) {
    if (demos.length === 0) return <EmptyComponentDemos />;

    const groups = collectDemoGroups(demos);

    return (
        <div className={collectionStyle}>
            {groups.map((group) => (
                group.title === null
                    ? <DemoLayout key="ungrouped" demos={group.demos} />
                    : (
                        <section
                            key={group.title}
                            className={groupStyle}
                            data-demo-group={group.title}
                        >
                            <h3 className={groupTitleStyle}>{group.title}</h3>
                            <DemoLayout demos={group.demos} />
                        </section>
                    )
            ))}
        </div>
    );
}
