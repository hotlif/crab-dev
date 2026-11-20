import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import LineEdit from "@crab-dev/rc-line-edit";
import Segmented from "@crab-dev/rc-segmented";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./lineEditPrototype.styles.js";
import "./lineEditMaterial.styles.js";

const initial = "北区巡检工作区";
const reserved = "系统默认";
const limit = 32;
const examples = [
    { label: "空值", value: "" },
    { label: "默认名称", value: initial },
    { label: "已占用名称", value: reserved },
    { label: "长名称", value: "华东区域配电巡检与远程设备运行状态联合调试工作区" },
];
const materialAppearances = [
    { value: "filled", label: "填充" },
    { value: "outlined", label: "描边" },
];

const designs = {
    md3: {
        title: "工程工作区配置",
        description: "在巡检工作区里体验 Material 3 的填充、描边文本字段与浮动标签。",
        hint: "用于区分巡检配置，最多 32 个字符。",
        decision: "默认使用带底线的填充字段强调工作区名称。描边变体用于同层级设置较多的表单，浮动标签嵌入边框缺口。两种外观共用输入与校验行为。",
        save: "保存配置",
        restore: "还原修改",
        size: "medium",
    },
    macos: {
        title: "工作区设置",
        description: "在紧凑设置面板里编辑名称，试用外侧焦点环、清除和键盘还原。",
        hint: "此名称显示在工作区窗口标题中。",
        decision: "使用紧凑描边字段对齐相邻设置。名称可编辑，工作区标识可选取和复制。按 Escape 恢复已存名称。",
        save: "存储",
        restore: "还原",
        size: "small",
    },
    shadcn: {
        title: "工作区资料",
        description: "用静态标签和中性输入框编辑资料，检查路径前缀与字段级错误。",
        hint: "名称显示在成员可见的工作区列表中。",
        decision: "标签、输入和说明垂直排列。可见名称与访问路径分开，路径前缀独立占位，留出可输入的文本宽度。",
        save: "保存更改",
        restore: "取消编辑",
        size: "medium",
    },
} as const;

function nameError(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return "请输入工作区名称。";
    if (trimmed === reserved) return "此名称已被占用。请使用能区分工作区的名称，例如北区设备巡检。";
    if (/[/\\]/.test(trimmed)) return "工作区名称不能包含斜杠或反斜杠。";
}

export default function LineEditPrototype() {
    const { designSystem } = useConfig();
    const design = designs[designSystem];
    const href = useSiteHref();
    const input = useRef<HTMLInputElement>(null);
    const composing = useRef(false);
    const [draft, setDraft] = useState(initial);
    const [saved, setSaved] = useState(initial);
    const [error, setError] = useState<string>();
    const [announcement, setAnnouncement] = useState("");
    const [errorSample, setErrorSample] = useState(reserved);
    const [materialAppearance, setMaterialAppearance] = useState<"filled" | "outlined">("filled");
    const macos = designSystem === "macos";
    const md3 = designSystem === "md3";
    const appearance = md3 ? materialAppearance : "outlined";

    function edit(value: string) {
        setDraft(value);
        setAnnouncement("");
        if (!composing.current) setError(undefined);
    }

    function restore() {
        edit(saved);
        input.current?.focus();
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (composing.current) return;
        const invalid = nameError(draft);
        setError(invalid);
        if (invalid) {
            setAnnouncement("");
            input.current?.focus();
            return;
        }
        const name = draft.trim();
        setDraft(name);
        setSaved(name);
        setAnnouncement("工作区名称已保存。");
    }

    function handleInputKey(event: KeyboardEvent<HTMLInputElement>) {
        const imeKey = event.nativeEvent.isComposing || event.keyCode === 229;
        if (imeKey || composing.current) {
            // A non-composing Enter with key code 229 can still finalize a candidate.
            if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode === 229) event.preventDefault();
            return;
        }
        if (macos && event.key === "Escape" && (draft !== saved || error)) {
            event.preventDefault();
            event.stopPropagation();
            restore();
        }
    }

    return <div className="crab-design-workspace" data-line-edit-prototype data-prototype-design={designSystem}>
        <DesignHero section="组件原型" title="LineEdit 单行输入框" description={design.description}>
            <nav className="crab-design-jump-links" aria-label="原型章节">
                <a href="#line-edit-scenario">编辑工作区名称</a>
                <a href="#line-edit-states">字段类型与状态</a>
                <a href="#line-edit-rules">交互规则</a>
            </nav>
        </DesignHero>
        <div className="crab-design-body">
            <section id="line-edit-scenario" aria-labelledby="line-edit-scenario-title">
                <div className="crab-design-section-head"><h2 id="line-edit-scenario-title">编辑工作区名称</h2></div>
                <div className="crab-line-edit-board">
                    <form className="crab-line-edit-form" aria-label="编辑工作区名称" onSubmit={submit} noValidate>
                        <h3>{design.title}</h3>
                        <div className="crab-line-edit-fields">
                            <LineEdit ref={input} name="workspaceName" label="工作区名称" required allowClear showCount
                                autoComplete="off" maxLength={limit} appearance={appearance} size={design.size}
                                value={draft} supportingText={design.hint} errorText={error} onValueChange={edit}
                                onCompositionStart={() => { composing.current = true; }}
                                onCompositionEnd={() => { composing.current = false; setError(undefined); }}
                                onKeyDown={handleInputKey} />
                            {macos && <LineEdit label="工作区标识" size="small" defaultValue="north-inspection" readOnly />}
                            {designSystem === "shadcn" && <LineEdit label="当前访问路径" defaultValue="north-inspection" readOnly
                                prefix={<span aria-hidden="true">/workspaces/</span>} suffix={<span className="crab-line-edit-affix">只读</span>} />}
                        </div>
                        <div className="crab-line-edit-footer">
                            <p role="status">{announcement}</p>
                            <div className="crab-design-actions">
                                <Button type="button" appearance="text" onClick={restore}>{design.restore}</Button>
                                <Button type="submit" appearance="primary">{design.save}</Button>
                            </div>
                        </div>
                    </form>
                    <aside className="crab-line-edit-controls" aria-label="试用设置">
                        {md3 && <div className="crab-line-edit-appearance">
                            <h3>字段外观</h3>
                            <Segmented aria-label="字段外观" value={materialAppearance} options={materialAppearances}
                                onValueChange={value => setMaterialAppearance(value === "outlined" ? "outlined" : "filled")} />
                        </div>}
                        <h3>载入试用值</h3>
                        <div className="crab-design-actions">
                            {examples.map(example => <Button key={example.label} appearance="outlined"
                                onClick={() => { edit(example.value); input.current?.focus(); }}>{example.label}</Button>)}
                        </div>
                        <dl className="crab-line-edit-readout"><dt>已保存名称</dt><dd>{saved}</dd></dl>
                    </aside>
                </div>
            </section>
            <section id="line-edit-states" aria-labelledby="line-edit-states-title">
                <div className="crab-design-section-head"><h2 id="line-edit-states-title">字段类型与状态</h2></div>
                <div className="crab-line-edit-samples">
                    <div>
                        <h3>{md3 ? "描边 · 空值" : "空值与键盘焦点"}</h3>
                        <LineEdit label="待编辑名称" placeholder="例如北区巡检" size={design.size}
                            supportingText="试用鼠标悬停，或按 Tab 进入字段。" />
                    </div>
                    <div>
                        <h3>{md3 ? "填充 · 有内容" : "已填写与清除"}</h3>
                        <LineEdit label="备用名称" appearance={md3 ? "filled" : "outlined"} size={design.size} defaultValue="夜间巡检"
                            allowClear maxLength={limit} showCount supportingText="清除后焦点回到输入框。" />
                    </div>
                    <div>
                        <h3>校验失败</h3>
                        <LineEdit label="重复名称" value={errorSample} required size={design.size} onValueChange={setErrorSample}
                            supportingText="使用未被占用的名称。" errorText={errorSample === reserved ? "此名称已被占用，请换一个名称。" : undefined} />
                    </div>
                    <div>
                        <h3>只读</h3>
                        <LineEdit label="已分配名称" defaultValue={initial} readOnly size={design.size}
                            supportingText="可聚焦、选中文字和复制。" />
                    </div>
                    <div>
                        <h3>禁用</h3>
                        <LineEdit label="归档名称" defaultValue="旧站点巡检" disabled size={design.size}
                            supportingText="归档期间跳过键盘焦点。" />
                    </div>
                    <div>
                        <h3>{macos ? "紧凑尺寸与单位" : "前后缀与长内容"}</h3>
                        <LineEdit label="工作区路径" defaultValue="north-inspection-and-equipment-monitoring"
                            prefix={<span aria-hidden="true">/workspaces/</span>}
                            suffix={<span className="crab-line-edit-affix">内部</span>}
                            size={macos ? "small" : "large"} supportingText="在窄屏用方向键查看后面的文字。" />
                    </div>
                </div>
            </section>
            <section id="line-edit-rules" aria-labelledby="line-edit-rules-title">
                <div className="crab-design-section-head"><h2 id="line-edit-rules-title">交互规则</h2></div>
                <div className="crab-line-edit-rules">
                    <p>{design.decision}</p>
                    <dl>
                        <dt>标签与说明</dt><dd>{md3 ? "空字段的标签位于输入框内。聚焦或已有内容时标签浮起，辅助说明留在下方。" : "标签始终在上方可见，约束说明放在下方。"}校验失败时错误文字替换说明并与字段关联。</dd>
                        <dt>提交与校验</dt><dd>点保存或按 Enter 后检查必填和名称冲突。失败时保留草稿并聚焦字段。继续编辑清除旧错误，输入法选词期间暂缓校验。</dd>
                        <dt>清除与焦点</dt><dd>有内容且可编辑时显示清除按钮，键盘可触发。清除只影响草稿，操作后焦点回到输入框。</dd>
                        <dt>尺寸与动效</dt><dd>{md3 ? "常规字段采用 56px 高度，聚焦时填充底线或描边加重。标签过渡时输入框和说明的位置保持稳定。" : "状态切换沿用字段边界，焦点反馈使用描边或外环。"}窄屏允许说明换行，输入内容在单行框内滚动。</dd>
                        <dt>适用范围</dt><dd>用于名称、短编号等单行文本。多行说明用 TextEdit，数值编辑用 NumberEdit。</dd>
                    </dl>
                </div>
            </section>
            <div><Button appearance="text" href={href("components/rc-line-edit")}>查看 LineEdit 组件文档 →</Button></div>
        </div>
    </div>;
}
