import { useId } from "react";
import { colors } from "../palette.js";
import DesignPreview, { useDesignPreview } from "./preview.js";

function ColorRoles() {
    const { theme } = useDesignPreview();
    const scheme = colors[theme];
    const id = useId();
    return <section className="cl-section" aria-labelledby={`${id}-color`}><div><p className="cl-kicker">01 / COLOR</p><h2 id={`${id}-color`}>色彩为任务服务</h2></div>
        <p className="cl-muted">把基准紫色留给主要操作、选中和焦点。画布、内容和浮层构成三层表面，必要控件边界清晰，装饰分隔保持安静。</p>
        <div className="cl-grid">
            <figure className="cl-swatch cl-brand"><strong>主要操作 · 基准紫色</strong><figcaption>brand.primary / text.on-brand<br /><code>{scheme.brand}</code><br /><code>{scheme.onBrand}</code></figcaption></figure>
            <figure className="cl-swatch cl-selected"><strong>选中容器</strong><figcaption>✓ selection.background / foreground<br /><code>{scheme.selected}</code><br /><code>{scheme.onSelected}</code></figcaption></figure>
            <figure className="cl-swatch cl-surface"><strong>内容表面</strong><figcaption>background.surface / text.primary<br /><code>{scheme.surface}</code><br /><code>{scheme.text}</code></figcaption></figure>
            <figure className="cl-swatch cl-elevated"><strong>浮层表面</strong><figcaption>background.elevated / text.primary<br /><code>{scheme.elevated}</code><br /><code>{scheme.text}</code></figcaption></figure>
        </div>
    </section>;
}

export default function ColorPage() {
    return <DesignPreview><ColorRoles /></DesignPreview>;
}
