import Button from "@crab-dev/rc-button";
import { libraryInventory } from "../../_generated/library.js";
import HeroPreview from "./heroPreview.js";

export interface HomeSectionProps {
    readonly href: (slug: string) => string;
}

export default function HomeHero({ href }: HomeSectionProps) {
    return (
        <section className="crab-home-hero" aria-label="Crab UI 组件文档">
            <div className="crab-home-intro">
                <span className="crab-home-eyebrow">为 React 19 而构建</span>
                <h1>Crab UI</h1>
                <p className="crab-home-headline">从组件开始，<br />构建清晰界面。</p>
                <p className="crab-home-lead">一套组件，三种设计语言。从日常交互到复杂业务，用一致的 API 和设计令牌连接每个细节。</p>
                <div className="crab-home-actions">
                    <Button size="m" appearance="primary" href={href("guides/getting-started")} iconAfter={<span aria-hidden="true">→</span>}>开始使用</Button>
                    <Button size="m" appearance="outlined" href={href("learn/components")}>组件目录</Button>
                </div>
                <p className="crab-home-inventory">{libraryInventory.count} 个包 <span aria-hidden="true">·</span> MD3 Expressive / Apple / shadcn</p>
                <nav className="crab-home-quick-links" aria-label="首页快速入口">
                    <Button appearance="text" size="s" href={href("components/rc-token-semantic")}>设计令牌 ↗</Button>
                    <Button appearance="text" size="s" href={href("guides/accessibility")}>无障碍 ↗</Button>
                    <Button appearance="text" size="s" href={href("#practice")}>业务实战</Button>
                </nav>
            </div>
            <HeroPreview />
        </section>
    );
}
