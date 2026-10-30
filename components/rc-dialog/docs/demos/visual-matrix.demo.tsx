import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Dialog from "@crab-dev/rc-dialog";
import Button from "@crab-dev/rc-button";

export const meta = { title: "三体系模态状态矩阵", description: "真实打开、键盘焦点、按下、长内容和草稿保留。" };
const layout = css`padding: ${token.space['section-gap']}; min-height: 20rem;`;
const content = css`display: grid; gap: ${token.space['component-gap']}; overflow-wrap: anywhere;`;
export default function VisualMatrixDemo() {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState("default");
    const [requests, setRequests] = useState(0);
    const [pending, setPending] = useState(false);
    // The demo owns a real pending request; resolve it on completion or unmount.
    const complete = useRef<((result: boolean) => void) | null>(null);
    useEffect(() => () => { complete.current?.(false); }, []);
    const request = (action: "confirm" | "cancel") => {
        if (state !== `pending-${action}`) return action === "confirm" ? false : undefined;
        // Dialog calls this inside its transition. Keep the real request counter
        // and completion control observable while the returned promise is pending.
        flushSync(() => { setRequests(count => count + 1); setPending(true); });
        return new Promise<boolean>(resolve => { complete.current = resolve; });
    };
    return <section aria-label="Dialog visual matrix" className={layout}>
        <label>验收状态<select aria-label="验收状态" value={state} onChange={event => setState(event.target.value)}><option>default</option><option>long-content</option><option>error</option><option>pending-confirm</option><option>pending-cancel</option></select></label>
        <Button onClick={() => setOpen(true)}>打开验收对话框</Button>
        <Dialog title="保存工作区 Save workspace" open={open} onOpenChange={setOpen} shouldResetContent={false} onConfirm={() => request("confirm")} onCancel={() => request("cancel")}>
            <div className={content}>
                <p>检查布局和操作层级，取消后返回原任务。</p>
                <label>工作区名称<input aria-label="工作区名称" defaultValue="Crab workspace" /></label>
                {state.startsWith("pending-") && <><output aria-label="异步请求次数">{requests}</output><Button disabled={!pending} onClick={() => { complete.current?.(false); complete.current = null; setPending(false); setState("default"); }}>完成异步请求</Button></>}
                {state === "error" && <p role="alert">工作区名称已存在，请修改后重试。</p>}
                {state === "long-content" && Array.from({ length: 24 }, (_, index) => <p key={index}>第 {index + 1} 段：LongWorkspaceIdentifier_ABCDEFGHIJKLMN_0123456789_继续保持操作可达。</p>)}
            </div>
        </Dialog>
    </section>;
}
