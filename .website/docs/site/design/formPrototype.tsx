import { useRef, useState } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import Form, { Item, RuleType, useForm } from "@crab-dev/rc-form";
import LineEdit, { TokenVars as lineEditTokens } from "@crab-dev/rc-line-edit";
import Select from "@crab-dev/rc-select";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./fieldWorkflow.styles.js";

interface Configuration {
    name: string;
    interval: string;
}

const initialConfiguration: Configuration = { name: "北区输水运行", interval: "30" };
const intervals = [
    { label: "每 15 秒", value: "15" },
    { label: "每 30 秒", value: "30" },
    { label: "每 60 秒", value: "60" },
];
const nameRules = [{
    type: RuleType.ERROR,
    validator(value: unknown) {
        if (typeof value !== "string" || value.trim().length < 3) {
            throw new Error("请输入至少 3 个字符的配置名称。");
        }
    },
}];
const designs = {
    md3: {
        size: "medium",
        note: "工程配置使用 MD3 描边字段和浮动标签。字段错误直接靠近输入，保存失败单独显示在操作区。",
    },
    macos: {
        size: "small",
        note: "桌面设置采用横排、右对齐的标签和紧凑的控件。底部操作栏保留稳定的位置，窄屏将表单和保存记录分行。",
    },
    shadcn: {
        size: "medium",
        note: "紧凑的表单卡片使用简单的纵向字段与中性描边。失败反馈强调错误信息，主操作始终保持最高视觉层级。",
    },
} as const;

export default function FormPrototype() {
    const { designSystem } = useConfig();
    const design = designs[designSystem];
    const nameLabel = designSystem === "macos"
        ? { label: "配置名称", labelPlacement: "external" } as const
        : { label: "配置名称", labelPlacement: "control" } as const;
    const intervalLabel = designSystem === "macos"
        ? { label: "采样频率", labelPlacement: "external", labelTarget: "group" } as const
        : { label: "采样频率", labelPlacement: "control" } as const;
    const href = useSiteHref();
    const [form] = useForm<Configuration>();
    const nameField = useRef<HTMLInputElement>(null);
    const [saved, setSaved] = useState(initialConfiguration);
    const [draft, setDraft] = useState(initialConfiguration);
    const [failNextSave, setFailNextSave] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [phase, setPhase] = useState<"idle" | "invalid" | "saving" | "failed" | "saved">("idle");
    const dirty = draft.name !== saved.name || draft.interval !== saved.interval;
    const saving = phase === "saving";

    async function save(values: Configuration) {
        const shouldFail = failNextSave;
        setFailNextSave(false);
        setPhase("saving");
        setAttempts(count => count + 1);
        await new Promise<void>(resolve => window.setTimeout(resolve, 1100));
        if (shouldFail) {
            setPhase("failed");
            return;
        }
        setSaved(values);
        setPhase("saved");
    }

    const status = {
        idle: "",
        invalid: "请修正标记的字段。",
        saving: "正在保存提交时的配置…",
        failed: "",
        saved: "配置已保存。",
    }[phase];

    return <div className="crab-design-workspace crab-field-workflow" data-form-prototype data-prototype-design={designSystem}>
        <DesignHero section="组件原型" title="Form 表单"
            description="更新设备采样配置，检查字段校验、保存进度和请求失败后的恢复。" />
        <div className="crab-design-body">
            <section aria-labelledby="form-workflow-title">
                <div className="crab-design-section-head"><h2 id="form-workflow-title">泵站采样配置</h2></div>
                <div className="crab-field-workflow-layout">
                    <div className="crab-field-workflow-panel crab-field-workflow-scene">
                        <div className="crab-field-workflow-heading">
                            <h3>采样规则</h3>
                            <span className="crab-field-workflow-support" data-form-dirty>{dirty ? "有未保存修改" : "与已保存配置一致"}</span>
                        </div>
                        <p className="crab-field-workflow-support">设备编号 P-104。配置名称至少 3 个字符。</p>
                        <Form form={form} defaultValue={initialConfiguration} className="crab-field-workflow-form"
                            aria-label="采样规则" onFieldValueChange={(_changed, values) => setDraft(values)}
                            onSubmitSuccess={save} onSubmitFailed={() => {
                                setPhase("invalid");
                                nameField.current?.focus();
                            }}>
                            <Item name="name" {...nameLabel} required rules={nameRules}>
                                <LineEdit ref={nameField} size={design.size} appearance="outlined" placeholder="例如：输水泵巡检"
                                    style={designSystem === "md3" ? { [lineEditTokens["field.outlined.box-shadow-error"]]: "none" } : undefined} />
                            </Item>
                            <Item name="interval" {...intervalLabel}>
                                {field => <Select
                                    id={field.id}
                                    value={field.value as string | null}
                                    onValueChange={value => field.onValueChange?.(value)}
                                    aria-labelledby={field["aria-labelledby"]}
                                    label={field.label}
                                    options={intervals}
                                    appearance="outlined"
                                    size={design.size}
                                />}
                            </Item>
                            <div className="crab-field-workflow-form-footer">
                                <Button type="button" appearance={designSystem === "shadcn" ? "outlined" : "text"} size="s"
                                    disabled={!dirty || saving} onClick={() => {
                                        form.reinitialize(saved);
                                        setDraft(saved);
                                        setPhase("idle");
                                        nameField.current?.focus();
                                    }}>还原修改</Button>
                                <Button type="submit" appearance="primary" size="s" loading={saving} aria-busy={saving}>
                                    {saving ? "正在保存" : "保存配置"}
                                </Button>
                            </div>
                        </Form>
                        <div className="crab-field-workflow-submission">
                            <p role="status" aria-atomic="true" className="crab-field-workflow-support">{status}</p>
                            {phase === "failed" && <div role="alert" className="crab-field-workflow-error">
                                <strong>保存失败</strong><p>服务暂时不可用。已保留修改，请再次保存。</p>
                            </div>}
                        </div>
                    </div>
                    <aside className="crab-field-workflow-panel crab-field-workflow-aside" aria-labelledby="form-saved-title">
                        <h3 id="form-saved-title">已保存配置</h3>
                        <dl className="crab-field-workflow-record">
                            <dt>配置名称</dt><dd data-saved-name>{saved.name}</dd>
                            <dt>采样频率</dt><dd data-saved-interval>{intervals.find(variant => variant.value === saved.interval)?.label}</dd>
                            <dt>本次会话请求数</dt><dd data-form-attempts>{attempts}</dd>
                        </dl>
                        <Button size="s" appearance="outlined" aria-pressed={failNextSave}
                            onClick={() => setFailNextSave(!failNextSave)}>下次保存返回错误</Button>
                        <p role="status" className="crab-field-workflow-support">
                            {failNextSave ? "下次通过字段校验的提交会失败。" : "保存只更新本页的模拟记录。"}
                        </p>
                    </aside>
                </div>
            </section>
            <section aria-labelledby="form-rules-title">
                <div className="crab-design-section-head"><h2 id="form-rules-title">交互规则</h2></div>
                <div className="crab-field-workflow-panel crab-field-workflow-rules">
                    <p>{design.note}</p>
                    <dl>
                        <dt>适用场景</dt><dd>相关字段共同保存。需要即时生效的单个设置，使用开关一类的独立控件。</dd>
                        <dt>字段错误</dt><dd>提交时校验，焦点移到第一个错误字段。字段信息随输入保留，当前示例在下次提交时复核。</dd>
                        <dt>提交与重试</dt><dd>保存按钮反馈进度，同一时刻只有一个请求。请求失败时保持草稿和焦点，可直接再次保存。</dd>
                        <dt>保存期间编辑</dt><dd>保存使用发起请求时的配置。之后输入的内容仍是草稿，保留到下一次保存或还原。</dd>
                    </dl>
                    <Button appearance="text" href={href("components/rc-form")}>查看 Form 组件文档</Button>
                </div>
            </section>
        </div>
    </div>;
}
