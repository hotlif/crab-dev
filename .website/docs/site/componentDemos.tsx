import { css } from "@crab-dev/css";
import Preview from "@crab-dev/rc-component-preview";
import token from "@crab-dev/rc-token-semantic";
import { useState } from "react";
import ComponentDemoFrame, {
    EmptyComponentDemos,
    type ComponentDemoCodeTheme,
} from "./componentDemoFrame.js";

export interface ComponentDemoRecord {
    readonly id: string;
    readonly title: string;
    readonly description: string;
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

const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 19rem), 1fr));
    gap: ${token.space['group-gap']};
`;

const wideCardStyle = css`
    grid-column: 1 / -1;
`;

function DemoCard({ demo }: { readonly demo: ComponentDemoRecord }) {
    const [codeTheme, setCodeTheme] = useState<ComponentDemoCodeTheme>("light");

    return (
        <Preview
            className={demo.layout === "wide" ? wideCardStyle : undefined}
            title={demo.title}
            description={demo.description}
            sourceCode={demo.sourceCode}
            path={demo.workbenchPath}
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

function DemoGrid({ demos }: { readonly demos: readonly ComponentDemoRecord[] }) {
    return (
        <div className={gridStyle}>
            {demos.map((demo) => <DemoCard key={demo.id} demo={demo} />)}
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
                    ? <DemoGrid key="ungrouped" demos={group.demos} />
                    : (
                        <section
                            key={group.title}
                            className={groupStyle}
                            data-demo-group={group.title}
                        >
                            <h3 className={groupTitleStyle}>{group.title}</h3>
                            <DemoGrid demos={group.demos} />
                        </section>
                    )
            ))}
        </div>
    );
}
