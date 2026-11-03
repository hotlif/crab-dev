import { useState } from "react";
import { css, cx } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import DropdownContainer, { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import Button from "@crab-dev/rc-button";

export const meta = { title: "三体系浮层边界矩阵", description: "真实触发、快速反转、上下翻转、Escape、焦点移出与 Portal 配置继承。" };
const layout = css`padding: ${token.space['section-gap']}; min-height: 22rem;`;
const panel = css`padding: ${token.space['section-gap']}; display: grid; gap: ${token.space['component-gap']}; max-width: 18rem; overflow-wrap: anywhere;`;
const bottomAnchor = css`position: fixed; inset-block-end: ${token.space['section-gap']}; inset-inline-start: ${token.space['section-gap']}; z-index: 1;`;
function Trigger() {
    const { state, refs, dispatch } = useDropdownContext<HTMLButtonElement>();
    return <Button ref={refs.setReference} aria-haspopup="dialog" aria-expanded={state.open} onClick={event => dispatch({ type: "setOpen", payload: !state.open, details: { reason: "trigger", event: event.nativeEvent } })}>打开验收浮层</Button>;
}
export default function VisualMatrixDemo() {
    const [draft, setDraft] = useState("保留的浮层草稿");
    const [position, setPosition] = useState('normal');
    return <section aria-label="Dropdown visual matrix" className={layout}>
        <label>触发位置 <select aria-label="触发位置" value={position} onChange={event => setPosition(event.target.value)}><option value="normal">常规位置</option><option value="bottom">靠近视口底部</option></select></label>
        <p>连续点击触发器可反转进出场；底部位置用于检查翻转后的入场方向。</p>
        <div className={cx(position === 'bottom' && bottomAnchor)}>
        <DropdownContainer closeOnFocusOut overlay={<div role="dialog" aria-label="浮层内容" className={panel}><strong>上下文面板</strong><p>Long identifier: workspace_0123456789_ABCDEFGHIJKLMN</p><label>浮层草稿<input aria-label="浮层草稿" value={draft} onChange={event => setDraft(event.target.value)} /></label><Button>浮层操作</Button></div>}>
            <Trigger />
        </DropdownContainer>
        </div>
        <Button>浮层外操作</Button>
    </section>;
}
