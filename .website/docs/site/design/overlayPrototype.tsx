import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./overlayPrototype.styles.js";

export function usePositionedFocus<Element extends HTMLElement>(enabled: boolean, focusKey?: string) {
    const target = useRef<Element>(null);
    useEffect(() => {
        const node = target.current;
        const container = node?.closest("[data-positioned]");
        if (!enabled || !node || !container) return;
        const focus = () => {
            if (container.getAttribute("data-positioned") !== "true") return false;
            node.focus({ preventScroll: true });
            return true;
        };
        if (focus()) return;
        const observer = new MutationObserver(() => { if (focus()) observer.disconnect(); });
        observer.observe(container, { attributes: true, attributeFilter: ["data-positioned"] });
        return () => observer.disconnect();
    }, [enabled, focusKey]);
    return target;
}

export function OverlayPrototype({ route, title, description, scene, note, rules, children }: {
    route: string;
    title: string;
    description: string;
    scene: string;
    note: string;
    rules: ReadonlyArray<readonly [string, string]>;
    children: ReactNode;
}) {
    const { designSystem } = useConfig();
    const href = useSiteHref();
    return <div className="crab-design-workspace crab-overlay-prototype" data-overlay-prototype={route} data-prototype-design={designSystem}>
        <DesignHero section="组件原型" title={title} description={description} />
        <div className="crab-design-body">
            <section aria-labelledby={`${route}-scene-title`}>
                <div className="crab-design-section-head"><h2 id={`${route}-scene-title`}>{scene}</h2></div>
                <div className="crab-overlay-stage">{children}</div>
            </section>
            <section aria-labelledby={`${route}-rules-title`}>
                <div className="crab-design-section-head"><h2 id={`${route}-rules-title`}>交互规则</h2></div>
                <div className="crab-overlay-stage">
                    <p>{note}</p>
                    <dl className="crab-overlay-rules">
                        {rules.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}
                    </dl>
                    <Button appearance="text" href={href(`components/rc-${route}`)}>查看 {title.split(" ")[0]} 组件文档</Button>
                </div>
            </section>
        </div>
    </div>;
}
