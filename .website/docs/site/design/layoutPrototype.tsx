import type { ReactNode } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./layoutPrototype.styles.js";

export function LayoutPrototype({ route, title, description, scene, note, rules, children }: {
    route: string;
    title: string;
    description: string;
    scene: string;
    note: string;
    rules: ReadonlyArray<readonly [string, string]>;
    children: ReactNode;
}) {
    const href = useSiteHref();
    const { designSystem } = useConfig();
    return <div className="crab-design-workspace crab-layout-prototype" data-layout-prototype={route} data-prototype-design={designSystem}>
        <DesignHero section="组件原型" title={title} description={description} />
        <div className="crab-design-body">
            <section aria-labelledby={`${route}-scene`}>
                <div className="crab-design-section-head"><h2 id={`${route}-scene`}>{scene}</h2></div>
                <div className="crab-layout-stage">{children}</div>
            </section>
            <section aria-labelledby={`${route}-rules`}>
                <div className="crab-design-section-head"><h2 id={`${route}-rules`}>交互规则</h2></div>
                <div className="crab-layout-stage">
                    <p>{note}</p>
                    <dl className="crab-layout-rules">{rules.map(([term, detail]) =>
                        <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl>
                    <Button appearance="text" href={href(`components/rc-${route}`)}>查看 {title.split(" ")[0]} 组件文档</Button>
                </div>
            </section>
        </div>
    </div>;
}
