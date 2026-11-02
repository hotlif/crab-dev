import Button from "@crab-dev/rc-button";
import HomeComponentShowcase from "./homeComponentShowcase.js";
import HomeHero from "./home/hero.js";
import HomeCategories from "./home/categories.js";
import HomePractices from "./home/practices.js";
import { useSiteHref } from "./siteContext.js";
import "./homeStyles.js";

export { HomeHero, HomeCategories };

export default function LearningHome() {
    const href = useSiteHref();
    return (
        <div className="crab-home" data-learning-home>
            <HomeHero href={href} />

            <HomeComponentShowcase />

            <HomeCategories href={href} />

            <HomePractices href={href} />

            <footer className="crab-home-footer">
                <span><strong>Crab UI</strong> 为清晰、可靠的界面而构建。</span>
                <nav aria-label="页脚导航">
                    <Button appearance="text" href={href("guides/accessibility")}>无障碍</Button>
                    <Button appearance="text" href={href("guides/toolchain")}>开发与维护</Button>
                    <Button appearance="text" href="https://github.com/hotlif/crab-dev" target="_blank" rel="noopener noreferrer">GitHub ↗</Button>
                </nav>
            </footer>
        </div>
    );
}
