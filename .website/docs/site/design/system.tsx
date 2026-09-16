import { useId } from "react";
import { candidates } from "./tokens.js";
import DesignPreview from "./preview.js";

export default function SystemPage() {
    const id = useId();
    return <DesignPreview><section className="cl-section" aria-labelledby={`${id}-tokens`}><div><p className="cl-kicker">06 / SYSTEM</p><h2 id={`${id}-tokens`}>从视觉规则到设计令牌</h2></div><p className="cl-muted">L1 提供刻度，L2 表达用途，L3 连接组件。以下候选参数目前只用于本页，供后续组件迁移评审。</p>
        <div className="cl-scroll" role="region" aria-label="令牌映射表，可横向滚动" tabIndex={0}><table className="cl-reference"><thead><tr><th>设计角色</th><th>样板值</th><th>归属</th><th>落地方式</th></tr></thead><tbody>{candidates.map(([role, value, layer, note]) => <tr key={role}><th scope="row">{role}</th><td>{value}</td><td><code>{layer}</code></td><td>{note}</td></tr>)}</tbody></table></div>
        <div className="cl-grid"><div className="cl-panel cl-stack"><h4>推荐做法</h4><ul className="cl-rules"><li>一个任务区域有明确的主要操作。</li><li>选中、焦点和错误各自拥有独立含义。</li><li>依靠留白与对齐组织信息。</li><li>主题在 L2 重绑定，组件消费语义值。</li></ul></div><div className="cl-panel cl-stack"><h4>避免的用法</h4><ul className="cl-rules"><li>用大面积品牌色装饰所有容器。</li><li>只用红绿颜色表达结果。</li><li>用厚边框变化制造反馈、引发布局跳动。</li><li>缩小触控目标来换取更多信息。</li></ul></div></div>
        <p className="cl-caption">本提案优先验证视觉与交互。下一步依次推进语义令牌、基础控件、数据组件、浮层反馈与全站一致性；保留公共 API 的兼容性。</p>
    </section></DesignPreview>;
}
