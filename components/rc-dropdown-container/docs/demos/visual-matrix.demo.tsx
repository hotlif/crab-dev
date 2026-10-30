import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import DropdownContainer, { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import Button from "@crab-dev/rc-button";

export const meta = { title: "三体系浮层边界矩阵", description: "真实触发、Escape、焦点移出与 Portal 配置继承。" };
const layout = css`padding: ${token.space['section-gap']}; min-height: 22rem;`;
const panel = css`padding: ${token.space['section-gap']}; display: grid; gap: ${token.space['component-gap']}; max-width: 18rem; overflow-wrap: anywhere;`;
function Trigger() {
    const { state, refs, dispatch } = useDropdownContext<HTMLButtonElement>();
    return <Button ref={refs.setReference} aria-haspopup="dialog" aria-expanded={state.open} onClick={event => dispatch({ type: "setOpen", payload: !state.open, details: { reason: "trigger", event: event.nativeEvent } })}>打开验收浮层</Button>;
}
export default function VisualMatrixDemo() {
    const [draft, setDraft] = useState("保留的浮层草稿");
    return <section aria-label="Dropdown visual matrix" className={layout}>
        <DropdownContainer closeOnFocusOut overlay={<div role="dialog" aria-label="浮层内容" className={panel}><strong>上下文面板</strong><p>Long identifier: workspace_0123456789_ABCDEFGHIJKLMN</p><label>浮层草稿<input aria-label="浮层草稿" value={draft} onChange={event => setDraft(event.target.value)} /></label><Button>浮层操作</Button></div>}>
            <Trigger />
        </DropdownContainer>
        <Button>浮层外操作</Button>
    </section>;
}
