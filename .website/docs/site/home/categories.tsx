import Button from "@crab-dev/rc-button";
import Card from "@crab-dev/rc-card";
import type { HomeSectionProps } from "./hero.js";

const categories = [
    { id: "home-inputs-actions", title: "输入与操作", detail: "录入、选择和提交清晰可控。", items: [["按钮", "button"], ["表单", "form"], ["选择器", "select"], ["文本输入", "line-edit"]] },
    { id: "home-content-display", title: "信息展示", detail: "让对象、状态和层级一目了然。", items: [["卡片", "card"], ["头像", "avatar"], ["标签", "tag"], ["空状态", "empty"]] },
    { id: "home-feedback-overlays", title: "反馈与浮层", detail: "及时解释结果和下一步操作。", items: [["对话框", "dialog"], ["抽屉", "drawer"], ["警告提示", "alert"], ["文字提示", "tooltip"]] },
    { id: "home-navigation", title: "导航", detail: "在复杂信息中保持方向感。", items: [["标签页", "tabs"], ["菜单", "menu"], ["分页", "pagination"], ["路由", "router"]] },
    { id: "home-layout-performance", title: "布局与性能", detail: "从响应式布局到大数据渲染。", items: [["分栏", "split-pane"], ["虚拟滚动", "virtual"], ["瀑布流", "masonry"], ["自动尺寸", "auto-sizer"]] },
    { id: "home-data-visualization", title: "数据与可视化", detail: "浏览、比较和理解业务数据。", items: [["表格", "table"], ["树形结构", "tree"], ["柱状图", "bar-chart"], ["画布", "canvas"]] },
] as const;

export default function HomeCategories({ href }: HomeSectionProps) {
    return (
        <section className="crab-home-section crab-home-categories-section" id="components" aria-labelledby="component-title">
            <header className="crab-home-section-heading">
                <div><span className="crab-home-eyebrow">精选任务</span><h2 id="component-title">从常用能力开始探索。</h2><p className="crab-home-section-note">按界面任务查找常用组件，或浏览完整组件目录。</p></div>
                <Button appearance="text" className="crab-home-catalog-action" href={href("learn/components")}>查看全部组件 <span aria-hidden="true">→</span></Button>
            </header>
            <div className="crab-home-categories">
                {categories.map((category) => (
                    <article className="crab-home-category" id={category.id} aria-labelledby={`${category.id}-title`} key={category.id}>
                        <Card variant="outlined" className="crab-home-category-panel">
                            <Card.Body className="crab-home-category-body">
                                <header className="crab-home-category-heading">
                                    <h3 id={`${category.id}-title`}>{category.title}</h3>
                                    <p>{category.detail}</p>
                                </header>
                                <nav className="crab-home-component-links" aria-label={`${category.title}组件`}>
                                    {category.items.map(([label, slug]) => <Button key={slug} className="crab-home-category-link" appearance="text" href={href(`components/rc-${slug}`)} iconAfter={<span className="crab-home-category-arrow" aria-hidden="true">→</span>}>{label}</Button>)}
                                </nav>
                            </Card.Body>
                        </Card>
                    </article>
                ))}
            </div>
        </section>
    );
}
