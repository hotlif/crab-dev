import Button from "@crab-dev/rc-button";
import { libraryInventory } from "../../_generated/library.js";
import HeroPreview from "./heroPreview.js";
import HomeDesignPicker from "./designPicker.js";
import { useConfig } from "@crab-dev/rc-config-provider";
import { designSystemRegistry } from "@crab-dev/rc-token-semantic";
import { designPresentation } from "../designPresentation.js";

export interface HomeSectionProps {
    readonly href: (slug: string) => string;
}

export default function HomeHero({ href }: HomeSectionProps) {
    const { designSystem } = useConfig();
    const presentation = designPresentation[designSystem];
    return (
        <section className="crab-home-hero" aria-label="Crab UI 组件文档">
            <div className="crab-home-intro">
                <div className="crab-home-title-group crab-site-enter">
                    <span className="crab-home-eyebrow">为 React 19 而构建</span>
                    <h1>Crab UI</h1>
                    <p className="crab-home-headline">{presentation.headline[0]}<br /><span>{presentation.headline[1]}</span></p>
                    <p className="crab-home-lead">{presentation.introduction}</p>
                </div>
                <div className="crab-home-intro-actions crab-site-enter" data-enter-step="actions">
                    <div className="crab-home-actions">
                        <Button size="s" appearance="primary" href={href("guides/getting-started")} iconAfter={<span aria-hidden="true">→</span>}>开始使用</Button>
                        <Button size="s" appearance="outlined" href={href("learn/components")}>组件目录</Button>
                    </div>
                    <HomeDesignPicker />
                    <p className="crab-home-inventory">{libraryInventory.count} 个包 <span aria-hidden="true">·</span> {designSystemRegistry[designSystem].fullName}</p>
                    <nav className="crab-home-quick-links" aria-label="首页快速入口">
                        <Button appearance="text" size="s" href={href("components/rc-token-semantic")}>设计令牌 ↗</Button>
                        <Button appearance="text" size="s" href={href("guides/accessibility")}>无障碍 ↗</Button>
                        <Button appearance="text" size="s" href={href("#practice")}>业务实战</Button>
                    </nav>
                </div>
            </div>
            <div className="crab-home-stage crab-site-enter" data-enter-step="stage"><HeroPreview /></div>
        </section>
    );
}
