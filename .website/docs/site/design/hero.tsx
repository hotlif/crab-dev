import { useConfig } from "@crab-dev/rc-config-provider";
import type { ReactNode } from "react";
import { designSystemRegistry } from "@crab-dev/rc-token-semantic";
import { useSiteHref } from "../siteContext.js";
import "./styles.js";
import "./systemStyles.js";
import "./engineering.styles.js";

export function DesignHero({ section, title, description, children }: { section?: string; title: string; description: string; children?: ReactNode }) {
    const href = useSiteHref();
    const { designSystem } = useConfig();
    return <header className="crab-design-hero">
        <div>
            <div className="crab-design-crumb">{section ? <><a href={href("design")}>设计</a> ／ {section}</> : "Crab UI"} · {designSystemRegistry[designSystem].label}</div>
            <div className="crab-design-title"><h1 tabIndex={-1}>{title}</h1>{section && designSystem !== "md3" && <span className="crab-design-status">探索中</span>}</div>
            <p>{description}</p>
            {children}
        </div>
        {designSystem !== "md3" && <div className="crab-design-hero-art" aria-hidden="true" data-overview={!section}>
            <div className="crab-design-panel-art"><div className="crab-design-panel-heading"><i/><i/><i/></div>
                <div className="crab-design-panel-field"/><div className="crab-design-panel-actions"><i/><i/></div>
            </div>
        </div>}
    </header>;
}
