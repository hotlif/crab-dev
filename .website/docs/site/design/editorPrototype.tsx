import type { ReactNode } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./editorPrototype.styles.js";

interface EditorPrototypeProps {
    route: string;
    title: string;
    description: string;
    scene: string;
    rules: ReadonlyArray<readonly [string, string]>;
    children: ReactNode;
}

export function EditorPrototype({ route, title, description, scene, rules, children }: EditorPrototypeProps) {
    const { designSystem } = useConfig();
    const href = useSiteHref();
    return <div className="crab-design-workspace crab-editor-prototype" data-editor-prototype={route} data-prototype-design={designSystem}>
        <DesignHero section="组件原型" title={title} description={description} />
        <div className="crab-design-body">
            <section aria-labelledby={`${route}-scene`}>
                <div className="crab-design-section-head"><h2 id={`${route}-scene`}>{scene}</h2></div>
                <div className="crab-editor-stage" data-editor-stage>{children}</div>
            </section>
            <section aria-labelledby={`${route}-rules`}>
                <div className="crab-design-section-head"><h2 id={`${route}-rules`}>交互规则</h2></div>
                <div className="crab-editor-stage">
                    <dl className="crab-editor-rules">
                        {rules.map(([term, rule]) => <div key={term}><dt>{term}</dt><dd>{rule}</dd></div>)}
                    </dl>
                    <Button appearance="text" href={href(`components/rc-${route}`)}>查看 {title.split(" ")[0]} 组件文档</Button>
                </div>
            </section>
        </div>
    </div>;
}
