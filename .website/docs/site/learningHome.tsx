import Button from "@crab-dev/rc-button";
import Card from "@crab-dev/rc-card";
import { sourceCode } from "../_generated_tutorials/home.js";
import HomeComponentShowcase from "./homeComponentShowcase.js";
import LiveExample from "./liveExample.js";
import "./homeStyles.js";
import { useSiteHref } from "./siteContext.js";

const loadProfile = () => import("../examples/home/profile.js");

const categories = [
    { id: "home-inputs-actions", mark: "01", title: "输入与操作", detail: "录入、选择和提交清晰可控。", items: [["按钮", "button"], ["表单", "form"], ["选择器", "select"], ["文本输入", "line-edit"]] },
    { id: "home-content-display", mark: "02", title: "信息展示", detail: "让对象、状态和层级一目了然。", items: [["卡片", "card"], ["头像", "avatar"], ["标签", "tag"], ["空状态", "empty"]] },
    { id: "home-feedback-overlays", mark: "03", title: "反馈与浮层", detail: "及时解释结果和下一步操作。", items: [["对话框", "dialog"], ["抽屉", "drawer"], ["警告提示", "alert"], ["文字提示", "tooltip"]] },
    { id: "home-navigation", mark: "04", title: "导航", detail: "在复杂信息中保持方向感。", items: [["标签页", "tabs"], ["菜单", "menu"], ["分页", "pagination"], ["路由", "router"]] },
    { id: "home-layout-performance", mark: "05", title: "布局与性能", detail: "从响应式布局到大数据渲染。", items: [["分栏", "split-pane"], ["虚拟滚动", "virtual"], ["瀑布流", "masonry"], ["自动尺寸", "auto-sizer"]] },
    { id: "home-data-visualization", mark: "06", title: "数据与可视化", detail: "浏览、比较和理解业务数据。", items: [["表格", "table"], ["树形结构", "tree"], ["柱状图", "bar-chart"], ["画布", "canvas"]] },
] as const;

const capabilities = [
    { mark: "R19", title: "面向 React 19", detail: "遵循现代 React API 与 Compiler 约束，让组件模型更直接。", slug: "guides/getting-started", link: "开始使用" },
    { mark: "0 KB", title: "零运行时样式", detail: "Crab CSS 在构建期生成样式，保持可预测的加载和主题表现。", slug: "guides/toolchain", link: "了解工具链" },
    { mark: "L1–L3", title: "三层设计令牌", detail: "从全局基元到语义和组件令牌，统一亮暗主题与品牌表达。", slug: "design/tokens", link: "查看令牌" },
    { mark: "A11Y", title: "可访问的交互", detail: "键盘、焦点、强制颜色和减少动效从组件底层开始覆盖。", slug: "guides/accessibility", link: "阅读指南" },
] as const;

const practices = [
    { number: "01", title: "资料编辑表单", detail: "从输入校验到异步保存", slug: "practice-profile", components: "Form · LineEdit · Button" },
    { number: "02", title: "数据管理列表", detail: "连接搜索、分页与状态反馈", slug: "practice-data", components: "Table · Pagination · Empty" },
    { number: "03", title: "后台管理页面", detail: "组织导航、内容与编辑流程", slug: "practice-admin", components: "Tabs · Drawer · Form" },
] as const;

interface HomeSectionProps {
    readonly href: (slug: string) => string;
}

export function HomeHero({ href }: HomeSectionProps) {
    return (
        <section className="crab-home-hero" aria-label="Crab UI 组件文档">
            <div className="crab-home-hero-glow" aria-hidden="true" />
            <div className="crab-home-intro">
                <span className="crab-home-eyebrow">CRAB UI · REACT 19 DESIGN SYSTEM</span>
                <h1>为企业应用，<br /><span>构建清晰的界面。</span></h1>
                <p className="crab-home-lead">一套由真实业务需求打磨的 React 组件库。用统一的设计令牌、交互规则和开发工具，把想法稳定地交付为产品。</p>
                <div className="crab-home-actions">
                    <Button size="large" appearance="primary" href={href("guides/getting-started")} iconAfter={<span aria-hidden="true">→</span>}>开始使用</Button>
                    <Button size="large" href={href("learn/components")} iconAfter={<span aria-hidden="true">→</span>}>组件目录</Button>
                </div>
                <nav className="crab-home-quick-links" aria-label="首页快速入口">
                    <Button appearance="text" size="small" href={href("design/language")}>设计语言</Button><span aria-hidden="true">·</span>
                    <Button appearance="text" size="small" href={href("guides/accessibility")}>无障碍</Button><span aria-hidden="true">·</span>
                    <Button appearance="text" size="small" href={href("#practice")}>业务实战</Button>
                </nav>
            </div>
            <div className="crab-home-hero-orbit" aria-hidden="true">
                <span className="crab-home-orbit-ring" />
                <span className="crab-home-orbit-core">C</span>
                <span className="crab-home-orbit-node crab-home-orbit-node-a">UI</span>
                <span className="crab-home-orbit-node crab-home-orbit-node-b">19</span>
                <span className="crab-home-orbit-node crab-home-orbit-node-c">A11Y</span>
            </div>
        </section>
    );
}

export function HomeCategories({ href }: HomeSectionProps) {
    return (
        <section className="crab-home-section" id="components" aria-labelledby="component-title">
            <header className="crab-home-section-heading">
                <div><span className="crab-home-eyebrow">组件目录</span><h2 id="component-title">从常用能力开始探索。</h2><p className="crab-home-section-note">按界面任务分类，快速找到可以直接组合的基础能力。</p></div>
                <Button appearance="text" className="crab-home-catalog-action" href={href("learn/components")}>查看全部组件 <span aria-hidden="true">→</span></Button>
            </header>
            <nav className="crab-home-category-index" role="navigation" aria-label="组件分类跳转">
                {categories.map((category) => <Button key={category.id} appearance="text" href={href(`#${category.id}`)}>{category.title}</Button>)}
            </nav>
            <div className="crab-home-categories">
                {categories.map((category) => (
                    <article className="crab-home-category" id={category.id} key={category.id}>
                        <Card variant="filled" className="crab-home-category-panel">
                            <span className="crab-home-category-mark" aria-hidden="true">{category.mark}</span>
                            <h3>{category.title}</h3><p>{category.detail}</p>
                            <div className="crab-home-component-links">
                                {category.items.map(([label, slug]) => <Button key={slug} appearance="text" href={href(`components/rc-${slug}`)} iconAfter={<span aria-hidden="true">↗</span>}>{label}</Button>)}
                            </div>
                        </Card>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default function LearningHome() {
    const href = useSiteHref();
    return (
        <div className="crab-home" data-learning-home>
            <HomeHero href={href} />

            <HomeComponentShowcase />

            <HomeCategories href={href} />

            <section className="crab-home-section crab-home-capabilities" aria-labelledby="capability-title">
                <header className="crab-home-section-heading">
                    <div><span className="crab-home-eyebrow">设计系统能力</span><h2 id="capability-title">从视觉规范到工程交付。</h2></div>
                    <p className="crab-home-secondary">每一层都有明确边界，也能作为一个整体协同工作。</p>
                </header>
                <div className="crab-home-capability-grid">
                    {capabilities.map((capability) => (
                        <Card key={capability.title} variant="outlined" hoverable className="crab-home-capability-card">
                            <span className="crab-home-capability-mark">{capability.mark}</span><h3>{capability.title}</h3><p>{capability.detail}</p>
                            <Button appearance="text" href={href(capability.slug)}>{capability.link} <span aria-hidden="true">→</span></Button>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="crab-home-section" id="practice" aria-labelledby="practice-title">
                <header className="crab-home-section-heading">
                    <div><span className="crab-home-eyebrow">业务实战</span><h2 id="practice-title">把组件组合成完整流程。</h2></div>
                    <p className="crab-home-secondary">从一个场景进入，跟随步骤完成可运行的界面。</p>
                </header>
                <div className="crab-home-practices">
                    {practices.map((practice) => (
                        <article key={practice.slug}>
                            <span className="crab-home-practice-number">{practice.number}</span>
                            <div><h3>{practice.title}</h3><p>{practice.detail}</p><span className="crab-home-practice-components">{practice.components}</span></div>
                            <Button appearance="text" href={href(`learn/${practice.slug}`)} aria-label={`开始实战：${practice.title}`}><span aria-hidden="true">→</span></Button>
                        </article>
                    ))}
                </div>
            </section>

            <section className="crab-home-section crab-home-showcase" id="first-example" aria-labelledby="showcase-title">
                <header className="crab-home-section-heading">
                    <div><span className="crab-home-eyebrow">在线实战</span><h2 id="showcase-title">先试用，再读实现。</h2></div>
                    <p className="crab-home-secondary">完成邀请表单，再展开源码理解组件如何协作。</p>
                </header>
                <LiveExample title="组件，自然组合。" heading="outside" density="regular" sourceCode={sourceCode} load={loadProfile} />
            </section>

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
