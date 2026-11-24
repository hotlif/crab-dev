import type { ReactNode } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./pickerPrototype.styles.js";

export function PickerPrototype({ route, title, description, scene, note, rules, children, summary }: {
    route: string;
    title: string;
    description: string;
    scene: string;
    note: string;
    rules: ReadonlyArray<readonly [string, string]>;
    children: ReactNode;
    summary: ReactNode;
}) {
    const { designSystem } = useConfig();
    const href = useSiteHref();
    return <div className="crab-design-workspace crab-picker-prototype" data-picker-prototype={route} data-prototype-design={designSystem}>
        <DesignHero section="组件原型" title={title} description={description} />
        <div className="crab-design-body">
            <section aria-labelledby={`${route}-scene`}>
                <div className="crab-design-section-head"><h2 id={`${route}-scene`}>{scene}</h2></div>
                <div className="crab-picker-layout">
                    <div className="crab-picker-panel crab-picker-control">{children}</div>
                    <aside className="crab-picker-panel" aria-label="配置与实时预览">{summary}</aside>
                </div>
            </section>
            <section aria-labelledby={`${route}-rules`}>
                <div className="crab-design-section-head"><h2 id={`${route}-rules`}>交互规则</h2></div>
                <div className="crab-picker-panel">
                    <p>{note}</p>
                    <dl className="crab-picker-rules">
                        {rules.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}
                    </dl>
                    <Button appearance="text" href={href(`components/rc-${route}`)}>查看 {title.split(" ")[0]} 组件文档</Button>
                </div>
            </section>
        </div>
    </div>;
}
