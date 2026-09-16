import { useId } from "react";
import DesignPreview from "./preview.js";

export default function TypographyPage() {
    const id = useId();
    return <DesignPreview><section className="cl-section" aria-labelledby={`${id}-type`}><div><p className="cl-kicker">TYPE / 字体与排版</p><h2 id={`${id}-type`}>清晰的阅读节奏</h2></div>
        <div className="cl-panel cl-stack"><div className="cl-scale"><strong className="cl-number">项目工作台</strong><code>28 / 36 · 页面标题</code></div><div className="cl-scale"><h3>掌握每一个进展</h3><code>20 / 28 · 区块标题</code></div><p>14 / 22 · 正文用于长时间阅读，中文与数字保持自然节奏。</p><p className="cl-caption">12 / 18 · 辅助说明，减少干扰但保持可读。</p><code>0123456789 · ¥ 128,000.00 · 等宽数字对齐比较</code></div>
    </section></DesignPreview>;
}
