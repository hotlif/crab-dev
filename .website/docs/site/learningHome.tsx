import Button from "@crab-dev/rc-button";
import Card from "@crab-dev/rc-card";
import "@crab-dev/rc-card/css/index.css";
import LiveExample from "./liveExample.js";
import HomeProjectPreview from "./homeProjectPreview.js";
import { sourceCode } from "../_generated_tutorials/home.js";
import { useSiteHref } from "./siteContext.js";
import "./homeStyles.js";

const loadProfile = () => import("../examples/home/profile.js");
const categories = [
    {
        id: "home-inputs-actions",
        title: "输入与操作",
        detail: "填写资料、选择条件与提交更改。",
        items: [
            ["按钮", "Button", "button"],
            ["表单", "Form", "form"],
            ["选择器", "Select", "select"],
            ["文本输入", "LineEdit", "line-edit"],
        ],
    },
    {
        id: "home-content-display",
        title: "信息展示",
        detail: "呈现对象摘要、成员身份与无数据说明。",
        items: [
            ["卡片", "Card", "card"],
            ["头像", "Avatar", "avatar"],
            ["标签", "Tag", "tag"],
            ["空状态", "Empty", "empty"],
        ],
    },
    {
        id: "home-feedback-overlays",
        title: "反馈与浮层",
        detail: "确认关键操作、展开详情与解释操作结果。",
        items: [
            ["对话框", "Dialog", "dialog"],
            ["抽屉", "Drawer", "drawer"],
            ["警告提示", "Alert", "alert"],
            ["文字提示", "Tooltip", "tooltip"],
        ],
    },
    {
        id: "home-navigation",
        title: "导航",
        detail: "定位页面、切换视图与翻阅数据页。",
        items: [
            ["标签页", "Tabs", "tabs"],
            ["菜单", "Menu", "menu"],
            ["分页", "Pagination", "pagination"],
            ["路由", "Router", "router"],
        ],
    },
    {
        id: "home-layout-performance",
        title: "布局与性能",
        detail: "安排工作区、适配尺寸与按需渲染长列表。",
        items: [
            ["分栏", "SplitPane", "split-pane"],
            ["虚拟滚动", "Virtual", "virtual"],
            ["瀑布流", "Masonry", "masonry"],
            ["自动尺寸", "AutoSizer", "auto-sizer"],
        ],
    },
    {
        id: "home-data-visualization",
        title: "数据与可视化",
        detail: "浏览多条记录、组织层级与比较统计指标。",
        items: [
            ["表格", "Table", "table"],
            ["树形结构", "Tree", "tree"],
            ["柱状图", "BarChart", "bar-chart"],
            ["画布", "Canvas", "canvas"],
        ],
    },
];
const componentKinds: Readonly<Record<string, string>> = {
    router: "路由工具",
    "auto-sizer": "尺寸工具",
};
const featuredCount = categories.reduce((total, category) => total + category.items.length, 0);
const practices = [
    {
        number: "01",
        title: "资料编辑表单",
        detail: "从输入校验到异步保存",
        slug: "practice-profile",
        components: "Form · LineEdit · Button",
    },
    {
        number: "02",
        title: "数据管理列表",
        detail: "连接搜索、分页与状态反馈",
        slug: "practice-data",
        components: "Table · Pagination · Empty",
    },
    {
        number: "03",
        title: "后台管理页面",
        detail: "组织导航、内容与编辑流程",
        slug: "practice-admin",
        components: "Tabs · Drawer · Form",
    },
];

const startingPoints = [
    { title: "设计语言", detail: "查阅原则、视觉基础与业务模式", slug: "design/language" },
    { title: "无障碍指南", detail: "检查键盘操作、焦点与辅助说明", slug: "guides/accessibility" },
    { title: "业务实战", detail: "从表单、数据列表与后台页面开始", slug: "#practice" },
];

export default function LearningHome() {
    const href = useSiteHref();
    return (
        <div className="crab-home" data-learning-home>
            <section className="crab-home-hero" aria-label="Crab UI 组件文档">
                <div className="crab-home-intro">
                    <span className="crab-home-eyebrow">CRAB UI · REACT 19</span>
                    <h1><span>为企业应用，</span><span>构建清晰的界面。</span></h1>
                    <p className="crab-home-lead">从设计令牌到业务组件，让设计有依据，让开发有参考。</p>
                    <div className="crab-home-actions">
                        <Button size="large" appearance="primary" href={href("guides/getting-started")} iconAfter={<span aria-hidden="true">→</span>}>开始使用</Button>
                        <Button size="large" appearance="text" href={href("learn/components")}>组件目录 <span aria-hidden="true">→</span></Button>
                    </div>
                    <p className="crab-home-stack"><span><strong>52</strong> 组件文档</span><span><strong>246</strong> 进阶示例</span><span><strong>55</strong> 分步教程</span></p>
                </div>
                <HomeProjectPreview />
                <nav className="crab-home-paths" aria-labelledby="learning-path">
                    <h2 id="learning-path">设计与实践</h2>
                    {startingPoints.map(point => <Button key={point.slug} appearance="text" href={href(point.slug)} className="crab-home-path">
                        <span className="crab-home-path-content"><span><strong>{point.title}</strong><span className="crab-home-path-detail">{point.detail}</span></span><span className="crab-home-path-arrow" aria-hidden="true">{point.slug.startsWith("#") ? "↓" : "→"}</span></span>
                    </Button>)}
                </nav>
            </section>
            <section className="crab-home-section" id="components" aria-labelledby="component-title">
                <header className="crab-home-section-heading">
                    <div>
                        <h2 id="component-title">常用组件</h2>
                        <p className="crab-home-section-note">精选 {featuredCount} 个入口，按界面用途分组。</p>
                    </div>
                    <Button appearance="text" className="crab-home-catalog-action" href={href("learn/components")}>查看全部组件 <span aria-hidden="true">→</span></Button>
                </header>
                <nav className="crab-home-category-index" aria-label="常用组件分类跳转" id="home-category-index" tabIndex={-1}>
                    {categories.map(category => <Button key={category.id} appearance="text" href={href(`#${category.id}`)} iconAfter={<span aria-hidden="true">↓</span>}>{category.title}</Button>)}
                </nav>
                <div className="crab-home-categories">
                    {categories.map(category => <section className="crab-home-category" key={category.title} aria-label={category.title}>
                        <Card variant="filled" className="crab-home-category-panel">
                            <div className="crab-home-category-header">
                                <h3 id={category.id} tabIndex={-1}>{category.title}</h3>
                                <Button appearance="text" size="small" href={href(`learn/components#${encodeURIComponent(category.title)}`)} className="crab-home-category-link" aria-label={`查看分类：${category.title}`} iconAfter={<span aria-hidden="true">→</span>}>查看分类</Button>
                            </div>
                            <p className="crab-home-category-detail">{category.detail}</p>
                            <div className="crab-home-component-links">{category.items.map(([label, name, slug]) => <Button key={slug} appearance="text" href={href(`components/rc-${slug}`)}><span className="crab-home-component-label"><strong>{label}</strong>{" "}<span className="crab-home-component-name">{name}</span>{componentKinds[slug] && <span className="crab-home-component-kind">{componentKinds[slug]}</span>}</span></Button>)}</div>
                        </Card>
                    </section>)}
                </div>
                <Button appearance="text" className="crab-home-index-return" href={href("#home-category-index")}>返回分类索引 <span aria-hidden="true">↑</span></Button>
            </section>
            <section className="crab-home-section" id="practice" aria-labelledby="practice-title">
                <header className="crab-home-section-heading">
                    <div><span className="crab-home-eyebrow">业务实战</span><h2 id="practice-title">把组件组合成完整流程。</h2></div>
                    <span className="crab-home-secondary">三个场景，每个四步。</span>
                </header>
                <div className="crab-home-practices">{practices.map(practice => <article key={practice.slug}>
                    <span className="crab-home-eyebrow">实战 / {practice.number}</span>
                    <h3><Button appearance="text" href={href(`learn/${practice.slug}`)} iconAfter={<span aria-hidden="true">→</span>}>{practice.title}</Button></h3>
                    <p>{practice.detail}</p><span className="crab-home-practice-components">{practice.components}</span>
                </article>)}</div>
            </section>
            <section className="crab-home-section crab-home-showcase" id="first-example" aria-labelledby="showcase-title">
                <header className="crab-home-section-heading">
                    <div><span className="crab-home-eyebrow">交互体验</span><h2 id="showcase-title">先试用，再读实现。</h2></div>
                    <p className="crab-home-secondary">勾选发布清单，体验邀请表单；展开查看更多组件。</p>
                </header>
                <LiveExample title="组件，自然组合。" heading="outside" density="regular" sourceCode={sourceCode} load={loadProfile} />
                <div className="crab-home-showcase-caption"><span>示例数据与操作仅用于演示。</span><Button appearance="text" size="small" href={href("learn/practice-admin")}>学习如何组合 <span aria-hidden="true">→</span></Button></div>
            </section>
            <footer className="crab-home-footer"><span><strong>Crab UI</strong> / 为清晰的界面而构建</span><nav aria-label="页脚导航">
                <Button appearance="text" href={href("guides/accessibility")}>无障碍</Button>
                <Button appearance="text" href={href("guides/toolchain")}>开发与维护</Button>
                <Button appearance="text" href="https://github.com/hotlif/crab-dev">GitHub ↗</Button>
            </nav></footer>
        </div>
    );
}
