import { useConfig } from "@crab-dev/rc-config-provider";
import type { DesignSystem } from "@crab-dev/rc-token-semantic";
import { designSystemRegistry } from "@crab-dev/rc-token-semantic";

export interface ComponentDesignDocument {
    readonly summary: string;
    readonly usage: string;
    readonly exampleDescription: string;
    readonly demos: readonly string[];
    readonly references: readonly string[];
}

export type ComponentDesignDocuments = Readonly<Record<DesignSystem, ComponentDesignDocument>>;

interface ComponentGuide {
    readonly definition: string;
    readonly useWhen: readonly string[];
    readonly avoidWhen: readonly string[];
    readonly essentials: readonly string[];
    readonly accessibility: readonly string[];
}

export function DesignIntroduction({ documents }: { readonly documents: ComponentDesignDocuments }) {
    const { designSystem } = useConfig();
    const document = documents[designSystem];
    return <section className="crab-docs-design-intro" data-design-document={designSystem} aria-label={`${designSystemRegistry[designSystem].label} 组件说明`}>
        <p>{document.summary}</p>
        <p>{document.usage}</p>
    </section>;
}

export function DesignExampleIntroduction({ documents }: { readonly documents: ComponentDesignDocuments }) {
    const { designSystem } = useConfig();
    return <p data-design-example-description={designSystem}>{documents[designSystem].exampleDescription}</p>;
}

export default function ComponentDesignGuide({ guide, documents }: {
    readonly guide: ComponentGuide;
    readonly documents: ComponentDesignDocuments;
}) {
    const { designSystem } = useConfig();
    const document = documents[designSystem];
    return <div className="crab-docs-component-guide" data-design-guide={designSystem}>
        <p>{guide.definition}</p>
        <h3>适用场景</h3>
        {guide.useWhen.map(text => <p key={text}>{text}</p>)}
        {guide.avoidWhen.map(text => <p key={text}>{text}</p>)}
        <h3>使用要点</h3>
        <ul>{guide.essentials.map(text => <li key={text}>{text}</li>)}</ul>
        <h3>无障碍</h3>
        <ul>{guide.accessibility.map(text => <li key={text}>{text}</li>)}</ul>
        <h3>设计参考</h3>
        <p>{designSystemRegistry[designSystem].fullName}</p>
        <ul>{document.references.map((href, index) => <li key={href}><a href={href}>设计参考 {index + 1}</a></li>)}</ul>
    </div>;
}
