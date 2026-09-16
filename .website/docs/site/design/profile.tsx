import { useId, useState, useTransition } from "react";
import Form from "@crab-dev/rc-form";
import LineEdit from "@crab-dev/rc-line-edit";
import Select from "@crab-dev/rc-select";
import Button from "@crab-dev/rc-button";
import Card from "@crab-dev/rc-card";
import Tag from "@crab-dev/rc-tag";
import Drawer from "@crab-dev/rc-drawer";
import Dialog from "@crab-dev/rc-dialog";
import Alert from "@crab-dev/rc-alert";
import { design, type Density, type Theme } from "./tokens.js";
import { initialProfile, normalizeProfile, validateProfile, type Profile } from "./data.js";

/** Injecting the operation keeps the demo's pending state and tests deterministic. */
export async function saveProfile(profile: Profile) {
    await new Promise<void>(resolve => setTimeout(resolve, design.saveDelay));
    return normalizeProfile(profile);
}

export default function ProfileExample({ theme, density, save = saveProfile }: {
    theme: Theme; density: Density; save?: (profile: Profile) => Promise<Profile>;
}) {
    const [saved, setSaved] = useState(initialProfile);
    const [draft, setDraft] = useState(initialProfile);
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [pending, startTransition] = useTransition();
    const [errors, setErrors] = useState({ name: "", email: "" });
    const [message, setMessage] = useState("");
    const [failure, setFailure] = useState("");
    const id = useId();
    const dirty = draft.name !== saved.name || draft.email !== saved.email || draft.team !== saved.team;
    function requestClose() {
        if (pending) return false;
        if (dirty) { setConfirm(true); return false; }
        setOpen(false);
        return true;
    }
    async function submit() {
        if (pending) return;
        const nextErrors = validateProfile(draft);
        setErrors(nextErrors);
        setFailure("");
        if (nextErrors.name || nextErrors.email) {
            document.getElementById(`${id}-${nextErrors.name ? "name" : "email"}`)?.focus();
            return;
        }
        startTransition(async () => {
            try {
                const result = await save(draft);
                startTransition(() => {
                    setSaved(result); setDraft(result); setOpen(false);
                    setMessage(`已保存 ${result.name} 的资料。更改仅保留在本页。`);
                });
            } catch {
                setFailure("保存未完成，资料仍保留在表单中，请重试。");
            }
        });
    }
    return <div className="cl-stack">
        <Card variant="outlined" title="成员资料">
            <div className="cl-stack">
                <div className="cl-row cl-between"><div><strong>{saved.name}</strong><p className="cl-muted">{saved.email}</p></div><Tag color="primary">◐ {saved.team}</Tag></div>
                <p className="cl-muted">以一张简洁的摘要卡片承载结果，在抽屉中完成详细编辑，保留工作上下文。</p>
                <div><Button appearance="primary" onClick={() => {
                    setDraft(saved); setErrors({ name: "", email: "" }); setFailure(""); setMessage(""); setOpen(true);
                }}>编辑成员资料</Button></div>
            </div>
        </Card>
        <div role="status">{message && <Alert type="success" title="资料已保存">{message}</Alert>}</div>
        <div className="cl-grid">
            <div className="cl-panel cl-stack"><h4>01 · 输入有边界</h4><p className="cl-muted">可见标签、必填说明与字数限制放在字段附近。错误定位到对应输入，不用全局弹窗打断。</p></div>
            <div className="cl-panel cl-stack"><h4>02 · 提交有回应</h4><p className="cl-muted">保存中阻止重复提交并保留内容；放弃未保存修改需要确认，取消后回到原来的编辑位置。</p></div>
        </div>
        <Drawer className="crab-language-overlay" data-theme={theme} data-density={density}
            open={open} onOpenChange={setOpen} onClose={requestClose} title="编辑成员资料" closeLabel="关闭成员编辑"
            closable={!pending} maskClosable={!pending}>
            <Form className="cl-stack" noValidate aria-label="成员资料表单" aria-busy={pending} onSubmitSuccess={submit}>
                <fieldset className="cl-fieldset" disabled={pending}>
                    <legend>基本信息</legend>
                    <div className="cl-field"><label htmlFor={`${id}-name`}>姓名（必填）</label>
                        <LineEdit id={`${id}-name`} value={draft.name} required maxLength={30}
                            onChange={event => setDraft({ ...draft, name: event.target.value })}
                            status={errors.name ? "error" : undefined} aria-invalid={!!errors.name} aria-describedby={`${id}-name-help`} />
                        <p id={`${id}-name-help`} className={errors.name ? "cl-state-error" : "cl-caption"} role={errors.name ? "alert" : undefined}>{errors.name || `${draft.name.length}/30 字，用于团队内的身份识别。`}</p>
                    </div>
                    <div className="cl-field"><label htmlFor={`${id}-email`}>工作邮箱（必填）</label>
                        <LineEdit id={`${id}-email`} value={draft.email} required maxLength={80} inputMode="email"
                            onChange={event => setDraft({ ...draft, email: event.target.value })}
                            status={errors.email ? "error" : undefined} aria-invalid={!!errors.email} aria-describedby={`${id}-email-help`} />
                        <p id={`${id}-email-help`} className={errors.email ? "cl-state-error" : "cl-caption"} role={errors.email ? "alert" : undefined}>{errors.email || "例如 lin@example.com；保存时清理空白并规范大小写。"}</p>
                    </div>
                </fieldset>
                <fieldset className="cl-fieldset" disabled={pending}>
                    <legend>团队归属</legend>
                    <div className="cl-field"><span id={`${id}-team`}>所属团队</span>
                        <Select aria-label="所属团队" aria-labelledby={`${id}-team`} disabled={pending} value={draft.team}
                            onChange={value => setDraft({ ...draft, team: value ?? "产品设计" })}
                            options={["产品设计", "工程研发", "客户运营"].map(value => ({ label: value, value }))} />
                        <p className="cl-caption">选择团队只更新本地资料，不会发送通知或改变访问权限。</p>
                    </div>
                </fieldset>
                {failure && <Alert type="error" title="保存失败">{failure}</Alert>}
                <div className="cl-row cl-form-actions"><Button appearance="primary" type="submit" loading={pending}>{pending ? "正在保存…" : "保存修改"}</Button><Button type="button" disabled={pending} onClick={() => { requestClose(); }}>取消编辑</Button></div>
                <p role="status" className="cl-caption">{pending ? "正在保存资料，请稍候。" : "此表单为本地模拟，可放心体验。"}</p>
            </Form>
            <Dialog className="crab-language-overlay" data-theme={theme} data-density={density}
                open={confirm} onOpenChange={setConfirm} title="放弃未保存的修改？"
                i18n={{ confirmText: "放弃修改", cancelText: "继续编辑" }}
                onConfirm={() => { setDraft(saved); setConfirm(false); setOpen(false); }}>
                <p>本次填写的内容尚未保存。放弃后恢复为上次保存的资料。</p>
            </Dialog>
        </Drawer>
    </div>;
}
