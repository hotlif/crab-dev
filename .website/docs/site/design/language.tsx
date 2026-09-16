import Tag from "@crab-dev/rc-tag";
import DesignPreview from "./preview.js";

export default function DesignLanguage() {
    return <DesignPreview>
        <header className="cl-hero">
            <div className="cl-row cl-between"><span className="cl-kicker">CRAB DESIGN LANGUAGE / 01</span><Tag>视觉提案 · v1</Tag></div>
            <h2>冷静精密。<br />让复杂工作，清晰有序。</h2>
            <p className="cl-muted">基准紫色指引行动，中性色承载内容。为企业后台与专业工具建立一套清楚、稳定、可持续演进的视觉语言。</p>
            <div className="cl-row"><Tag color="primary">内容优先</Tag><Tag>层次清晰</Tag><Tag>操作精确</Tag><Tag>反馈克制</Tag></div>
        </header>
        <section className="cl-section" aria-label="设计原则">
            <h2>四条原则，同一个方向</h2>
            <div className="cl-grid">
                <div className="cl-panel cl-stack"><h3>内容优先</h3><p>让数据与任务成为视觉中心。品牌色集中用于主要操作、选中和焦点。</p></div>
                <div className="cl-panel cl-stack"><h3>层次清晰</h3><p>用画布、内容、浮层区分关系；用留白、对齐和细分隔组织信息。</p></div>
                <div className="cl-panel cl-stack"><h3>操作精确</h3><p>让标签、边界和焦点清楚可见，密度变化不改变操作含义。</p></div>
                <div className="cl-panel cl-stack"><h3>反馈克制</h3><p>在操作附近解释结果与恢复方法。状态结合文字或图形，不只依赖颜色。</p></div>
            </div>
            <p className="cl-muted">通过侧边栏分别阅读视觉基础、组件状态和业务样板。每个章节都有独立地址，可直接分享或加入书签。</p>
        </section>
    </DesignPreview>;
}
