import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Drawer, { type DrawerPlacement } from "@crab-dev/rc-drawer";
import Button from "@crab-dev/rc-button";

export const meta = { title: "三体系边缘面板矩阵", description: "四个方向、长内容、焦点与保留草稿。" };
const layout = css`padding: ${token.space['section-gap']}; min-height: 20rem;`;
const content = css`display: grid; gap: ${token.space['component-gap']}; overflow-wrap: anywhere;`;
export default function VisualMatrixDemo() {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<DrawerPlacement>("right");
    const [long, setLong] = useState(false);
    return <section aria-label="Drawer visual matrix" className={layout}>
        <label>验收方向<select aria-label="验收方向" value={placement} onChange={event => setPlacement(event.target.value as DrawerPlacement)}>{["right", "left", "top", "bottom"].map(value => <option key={value}>{value}</option>)}</select></label>
        <label><input type="checkbox" checked={long} onChange={event => setLong(event.target.checked)} />长内容</label>
        <Button onClick={() => setOpen(true)}>打开验收抽屉</Button>
        <Drawer title="项目详情 Project details" open={open} onOpenChange={setOpen} placement={placement} shouldResetContent={false} footer={<Button onClick={() => setOpen(false)}>保存草稿</Button>}>
            <div className={content}><p>边缘面板保持页面上下文。</p><label>项目备注<input aria-label="项目备注" defaultValue="本地草稿" /></label>
                {long && Array.from({ length: 30 }, (_, index) => <p key={index}>第 {index + 1} 项：跨团队协作记录 LongWorkspaceIdentifier_0123456789。</p>)}
            </div>
        </Drawer>
    </section>;
}
