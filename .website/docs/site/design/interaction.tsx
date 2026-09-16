import { useId, useState } from "react";
import Button from "@crab-dev/rc-button";
import LineEdit from "@crab-dev/rc-line-edit";
import Tag from "@crab-dev/rc-tag";
import Alert from "@crab-dev/rc-alert";
import DesignPreview from "./preview.js";

function States() {
    const [selected, setSelected] = useState(false);
    const [notice, setNotice] = useState("");
    const id = useId();
    return <div className="cl-grid">
        <div className="cl-panel cl-state"><h4>默认 / 悬停 / 按压 / 聚焦</h4><Button appearance="primary" onClick={() => setNotice("操作已完成。")}>创建项目</Button><p className="cl-caption">悬停观察色阶，按住观察反馈；按 Tab 查看焦点环。</p><span role="status">{notice}</span></div>
        <div className="cl-panel cl-state"><h4>选中</h4><Button aria-pressed={selected} appearance={selected ? "primary" : undefined} onClick={() => setSelected(!selected)}>{selected ? "✓ 已关注" : "关注项目"}</Button><p className="cl-caption">文字与勾选共同表达选择，避免只靠颜色。</p></div>
        <div className="cl-panel cl-state"><h4>禁用 / 加载</h4><div className="cl-row"><Button disabled aria-describedby={`${id}-disabled`}>发布</Button><Button loading aria-busy="true" disabled>保存中</Button></div><p id={`${id}-disabled`} className="cl-caption">填写必填信息后可发布。加载示例用于观察状态，持续展示。</p></div>
        <div className="cl-panel cl-state"><h4>错误 / 帮助</h4><label htmlFor={`${id}-error`}>项目名称（必填）</label><LineEdit id={`${id}-error`} status="error" aria-invalid="true" aria-describedby={`${id}-error-help`} placeholder="请填写项目名称" /><p id={`${id}-error-help`} className="cl-state-error">! 项目名称不能为空。</p></div>
        <div className="cl-panel cl-state"><h4>反馈 / 状态</h4><div className="cl-row"><Tag color="success">✓ 已完成</Tag><Tag color="warning">! 待处理</Tag><Tag color="error">× 未通过</Tag></div><p className="cl-caption">功能色各司其职；品牌基准紫色不承担成功或错误含义。</p></div>
        <div className="cl-panel cl-state"><h4>空状态 / 恢复</h4><Alert type="info" title="尚无项目">说明原因，并提供与当前上下文相关的下一步。</Alert><p className="cl-caption">在数据工作台章节切换场景，体验重置筛选与错误重试。</p></div>
    </div>;
}


export default function InteractionPage() {
    const id = useId();
    return <DesignPreview><section className="cl-section" aria-labelledby={`${id}-states`}><div><p className="cl-kicker">03 / INTERACTION</p><h2 id={`${id}-states`}>每一次操作都有回应</h2></div><States /><p className="cl-caption">交互沿用 motion.interaction，约 150ms；减少动态效果模式下移除非必要动画。图标以 16px 为基准、20px 用于强调，统一 1.5px 笔画；单独图标操作必须有可访问名称。</p></section></DesignPreview>;
}
