import { useEffect, useRef, useState } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import Drawer from "@crab-dev/rc-drawer";
import TextEdit from "@crab-dev/rc-text-edit";
import { OverlayPrototype } from "./overlayPrototype.js";

const equipment = [
    { id: "P-104", name: "北区输水泵", note: "下次巡检核对入口压力。" },
    { id: "V-019", name: "二号线进水阀", note: "阀门已完成开度复核。" },
];
const details = [
    ["位置", "北区泵房 · 地下一层"],
    ["最近巡检", "11 月 23 日 14:20"],
    ["责任班组", "设备维护组"],
    ["采样周期", "每 30 秒"],
    ["维护窗口", "周五 22:00 至 24:00"],
    ["记录保留", "当前季度运行记录及现场复查结果"],
] as const;

const notes = {
    md3: "MD3 使用独立表面和遮罩保留场景层级，顶部定位设备，底部实色按钮用于保存。",
    macos: "macOS 采用紧凑的右侧详情与底部操作栏，内容分组、标签对齐。",
    shadcn: "shadcn/ui 使用细分隔线和简洁标题，右侧工作区集中展示详情和备注。",
};

export default function DrawerPrototype() {
    const { designSystem } = useConfig();
    const [records, setRecords] = useState(equipment);
    const [selected, setSelected] = useState(records[0]);
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState("");
    const [confirmClose, setConfirmClose] = useState(false);
    const [status, setStatus] = useState("");
    const note = useRef<HTMLTextAreaElement>(null);
    const safeAction = useRef<HTMLButtonElement>(null);
    const dirty = draft !== selected.note;

    useEffect(() => {
        if (confirmClose) safeAction.current?.focus();
    }, [confirmClose]);

    function closeDrawer() {
        setConfirmClose(false);
        setOpen(false);
    }

    function beforeClose() {
        if (!dirty) return true;
        setConfirmClose(true);
        return false;
    }

    return <OverlayPrototype route="drawer" title="Drawer 抽屉" scene="设备列表"
        description="从设备列表进入详情编辑，检查窄屏、遮罩、焦点和未保存修改的处理。"
        note={notes[designSystem]} rules={[
            ["适用场景", "在保留列表上下文时查看二级详情并编辑备注。需要明确确认风险动作时使用 Dialog。"],
            ["关闭", "关窗按钮、遮罩和 Escape 都检查草稿。干净状态直接关闭；有改动时先选择继续编辑或放弃。"],
            ["滚动与窄屏", "记录在面板正文滚动，关闭和保存按钮保持可见。窄屏面板宽度受视口约束。"],
            ["焦点", "打开时焦点从列表转入面板。关闭后回到原设备的详情按钮。未保存提醒首先聚焦继续编辑。"],
        ]}>
        <ul className="crab-overlay-rows" role="list" aria-label="设备">
            {records.map(device => <li className="crab-overlay-row" key={device.id}>
                <div><h3>{device.name}</h3><p>{device.id} · {device.note}</p></div>
                <Button size="s" appearance="outlined" onClick={() => {
                    setSelected(device);
                    setDraft(device.note);
                    setOpen(true);
                }}>查看 {device.id} 详情</Button>
            </li>)}
        </ul>
        <p className="crab-overlay-support" role="status">{status}</p>
        <Drawer open={open} onOpenChange={next => { if (!next) closeDrawer(); }} onClose={beforeClose}
            placement="right" size={designSystem === "macos" ? "small" : "medium"} maskClosable
            title={selected.name} closeLabel="关闭设备详情" footer={<div className="crab-overlay-actions crab-overlay-modal-actions">
                <Button size="s" appearance="text" onClick={() => { if (beforeClose()) closeDrawer(); }}>关闭详情</Button>
                <Button size="s" appearance="primary" disabled={!dirty || confirmClose} onClick={() => {
                    setRecords(current => current.map(device => device.id === selected.id ? { ...device, note: draft } : device));
                    setStatus(`${selected.name}的备注已保存。`);
                    closeDrawer();
                }}>保存备注</Button>
            </div>}>
            <div className="crab-overlay-dialog-fields">
                <p className="crab-overlay-support">{selected.id} · {dirty ? "有未保存修改" : "已保存"}</p>
                {confirmClose && <div className="crab-overlay-notice" role="group" aria-label="有未保存修改">
                    <p role="alert">备注还未保存。关闭会丢弃本次修改。</p>
                    <div className="crab-overlay-actions">
                        <Button ref={safeAction} size="s" appearance="outlined" onClick={() => {
                            setConfirmClose(false);
                            note.current?.focus();
                        }}>继续编辑</Button>
                        <Button size="s" appearance="text" danger onClick={() => {
                            setStatus("已放弃本次备注修改。");
                            closeDrawer();
                        }}>放弃修改</Button>
                    </div>
                </div>}
                <TextEdit ref={note} label="巡检备注" appearance="outlined" value={draft} rows={4} resize="none" onValueChange={setDraft} />
                <dl className="crab-overlay-details">
                    {details.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}
                </dl>
            </div>
        </Drawer>
    </OverlayPrototype>;
}
