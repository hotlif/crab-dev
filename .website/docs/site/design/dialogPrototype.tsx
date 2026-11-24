import { useId, useRef, useState } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import Dialog from "@crab-dev/rc-dialog";
import LineEdit, { TokenVars as lineEditTokens } from "@crab-dev/rc-line-edit";
import { OverlayPrototype } from "./overlayPrototype.js";

const initialName = "泵站巡检配置";
const actions = [
    ["读数采集", "压力和流量每 30 秒采样，写入当前泵站的巡检记录。"],
    ["离线处理", "设备短时离线时保留最后一次有效读数。恢复后按时间顺序补传。"],
    ["重复告警", "同一处告警在维护窗口内合并，操作员仍能查阅每次触发的详情。"],
    ["操作权限", "只有当班负责人和设备管理员可以调整采样策略。"],
    ["审计记录", "配置名称变动会记录操作时间、人员以及修改前后的配置名称。"],
    ["变更生效", "值班工作台随下一次同步展示配置名称。正在进行的巡检持续保留原记录。"],
] as const;

const notes = {
    md3: "MD3 使用圆角对话框与实色主操作。删除使用简短确认，编辑使用独立滚动区保留标题和底部动作。",
    macos: "macOS 保持紧凑的模态面板，取消与确认靠右排列。安全动作获得初始焦点。",
    shadcn: "shadcn/ui 使用中性描边和清晰的标题层级，危险操作采用独立颜色。编辑按钮与正文保持稳定间距。",
};

function markInitialFocus(node: HTMLElement | null) {
    // Set the DOM attribute before the dialog runs its native focusing steps.
    if (node) node.autofocus = true;
}

export default function DialogPrototype() {
    const { designSystem } = useConfig();
    const descriptionId = useId();
    const nameField = useRef<HTMLInputElement>(null);
    const [layer, setLayer] = useState<"confirm" | "edit" | null>(null);
    const [name, setName] = useState(initialName);
    const [draft, setDraft] = useState(initialName);
    const [invalid, setInvalid] = useState(false);
    const [details, setDetails] = useState(false);
    const [deletePhase, setDeletePhase] = useState<"idle" | "pending" | "failed">("idle");
    const [exists, setExists] = useState(true);
    const [failFirst, setFailFirst] = useState(true);
    const [feedback, setFeedback] = useState("");
    const busy = deletePhase === "pending";

    async function remove() {
        if (busy) return;
        setDeletePhase("pending");
        await new Promise<void>(resolve => window.setTimeout(resolve, 850));
        if (failFirst) {
            setFailFirst(false);
            setDeletePhase("failed");
            return;
        }
        setExists(false);
        setLayer(null);
        setDeletePhase("idle");
        setFeedback(`已删除「${name}」。`);
    }

    function saveName() {
        if (draft.trim().length < 3) {
            setInvalid(true);
            nameField.current?.focus();
            return;
        }
        setName(draft.trim());
        setLayer(null);
        setFeedback(`已保存「${draft.trim()}」。`);
    }

    return <OverlayPrototype route="dialog" title="Dialog 对话框" scene="维护配置"
        description="比较删除确认和短表单编辑，检查弹窗的安全焦点、异步失败和关闭后的焦点。"
        note={notes[designSystem]} rules={[
            ["进入与退出", "删除时先聚焦取消，编辑时先聚焦名称。Tab 留在当前弹窗内，Escape 取消，完成后回到原操作位置。"],
            ["遮罩", "删除确认和配置编辑均需通过明确动作结束，点击遮罩保持弹窗打开。"],
            ["异步确认", "第一次删除模拟网络失败。期间锁住重复操作，失败后保留确认上下文与重试入口。"],
            ["长内容", "查看高级设置后，可滚动核对配置规则并继续编辑。标题和底部操作始终可见。"],
        ]}>
        <div className="crab-overlay-row">
            <div><h3>{name}</h3><p>{exists ? "北区泵站 · 配置 P-104" : "该示例配置已删除。"}</p></div>
            <div className="crab-overlay-actions">
                <Button size="s" appearance="outlined" disabled={!exists} onClick={() => {
                    setDraft(name);
                    setInvalid(false);
                    setDetails(false);
                    setLayer("edit");
                }}>编辑配置</Button>
                <Button size="s" appearance="outlined" danger={exists} onClick={() => {
                    if (exists) {
                        setDeletePhase("idle");
                        setLayer("confirm");
                    } else {
                        setExists(true);
                        setFailFirst(true);
                        setFeedback("已恢复示例配置。");
                    }
                }}>{exists ? "删除配置" : "恢复示例配置"}</Button>
            </div>
        </div>
        <p className="crab-overlay-support" role="status">{feedback}</p>
        <Dialog open={layer === "confirm"} title="删除配置？" aria-describedby={descriptionId}
            onOpenChange={open => { if (!open && !busy) setLayer(null); }} onCancel={() => !busy}
            footer={<div className="crab-overlay-actions crab-overlay-modal-actions">
                <Button ref={markInitialFocus} appearance="text" size="s" disabled={busy} onClick={() => setLayer(null)}>取消</Button>
                <Button appearance="primary" danger size="s" loading={busy} onClick={remove}>
                    {busy ? "正在删除" : deletePhase === "failed" ? "重试删除" : "删除配置"}
                </Button>
            </div>}>
            <p id={descriptionId}>将移除「{name}」及其定时巡检设置。设备历史记录仍可查阅。</p>
            {deletePhase === "failed" && <p role="alert" className="crab-overlay-notice">删除失败，配置仍然有效。可以重试。</p>}
        </Dialog>
        <Dialog open={layer === "edit"} title="编辑配置" onOpenChange={open => { if (!open) setLayer(null); }}
            footer={<div className="crab-overlay-actions crab-overlay-modal-actions">
                <Button appearance="text" size="s" onClick={() => setLayer(null)}>取消</Button>
                <Button appearance="primary" size="s" onClick={saveName}>保存名称</Button>
            </div>}>
            <div className="crab-overlay-dialog-fields">
                <LineEdit ref={node => { nameField.current = node; markInitialFocus(node); }} label="配置名称" value={draft}
                    size={designSystem === "macos" ? "small" : "medium"} appearance="outlined"
                    errorText={invalid ? "请输入至少 3 个字符的配置名称。" : undefined}
                    style={designSystem === "md3" ? { [lineEditTokens["field.outlined.box-shadow-error"]]: "none" } : undefined}
                    onValueChange={value => { setDraft(value); setInvalid(false); }}
                    onKeyDown={event => {
                        if (event.key === "Enter" && !event.nativeEvent.isComposing) saveName();
                    }} />
                <Button size="s" appearance="outlined" aria-expanded={details}
                    onClick={() => setDetails(!details)}>{details ? "收起高级设置" : "查看高级设置"}</Button>
                {details && <dl className="crab-overlay-details" data-dialog-details>
                    {actions.map(([title, message]) => <div key={title}><dt>{title}</dt><dd>{message}</dd></div>)}
                </dl>}
            </div>
        </Dialog>
    </OverlayPrototype>;
}
