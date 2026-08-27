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
}

interface ComponentDemosProps {
    readonly demos: readonly ComponentDemoRecord[];
}

const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${token.space['group-gap']};
    margin-block: ${token.space['group-gap']};

    @media (max-width: 980px) {
        grid-template-columns: minmax(0, 1fr);
    }
`;

function DemoCard({ demo }: { readonly demo: ComponentDemoRecord }) {
    const [codeTheme, setCodeTheme] = useState<ComponentDemoCodeTheme>("light");

    return (
        <Preview
            title={demo.title}
            description={demo.description}
            sourceCode={demo.sourceCode}
            path={demo.workbenchPath}
            density={demo.density}
            codeTheme={codeTheme}
            data-component-demo-id={demo.id}
        >
            <ComponentDemoFrame demo={demo} onThemeChange={setCodeTheme} />
        </Preview>
    );
}

export default function ComponentDemos({ demos }: ComponentDemosProps) {
    if (demos.length === 0) return <EmptyComponentDemos />;

    return (
        <div className={gridStyle}>
            {demos.map((demo) => <DemoCard key={demo.id} demo={demo} />)}
        </div>
    );
}
