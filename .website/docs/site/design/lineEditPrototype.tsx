import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import LineEdit, { type LineEditProps } from "@crab-dev/rc-line-edit";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./lineEditPrototype.styles.js";
import "./lineEditMaterial.styles.js";

const initial = "北区巡检工作区";
const reserved = "系统默认";
const limit = 32;
const characterSegmenter = new Intl.Segmenter("zh", { granularity: "grapheme" });
const examples = [
    { label: "空值", value: "" },
    { label: "默认名称", value: initial },
    { label: "已占用名称", value: reserved },
    { label: "长名称", value: "华东区域配电巡检与远程设备运行状态联合调试工作区" },
];
const designs = {
    md3: {
        title: "工程工作区配置",
        description: "在巡检工作区里试用 Material 3 描边字段，观察浮动标签、清除和校验反馈。",
        hint: "用于区分巡检配置，最多 32 个字符。",
        decision: "巡检工作区统一使用描边字段。浮动标签嵌入边框缺口，辅助说明和校验信息保留在字段下方。",
        save: "保存配置",
        restore: "还原修改",
        size: "medium",
    },
    macos: {
        title: "工作区设置",
        description: "在紧凑设置面板里编辑名称，试用外侧焦点环、清除和键盘还原。",
        hint: "此名称显示在工作区窗口标题中。",
        decision: "紧凑设置行的标签和输入框横向对齐。名称可编辑，工作区标识可选取和复制。按 Escape 恢复已存名称。",
        save: "存储",
        restore: "还原",
        size: "small",
    },
    shadcn: {
        title: "工作区资料",
        description: "用静态标签和中性输入框编辑资料，检查完整路径与字段级错误。",
        hint: "名称显示在成员可见的工作区列表中。",
        decision: "标签和输入框在同一行对齐。可见名称与访问路径分开，完整路径可选择和复制。",
        save: "保存更改",
        restore: "取消编辑",
        size: "medium",
    },
} as const;

function countCharacters(value: string) {
    return Array.from(characterSegmenter.segment(value)).length;
}

function lengthError(value: string) {
    if (countCharacters(value) > limit) return `名称最多可保存 ${limit} 个字符。请缩短后再保存。`;
}

function nameError(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return "请输入工作区名称。";
    if (trimmed === reserved) return "此名称已被占用。请使用能区分工作区的名称，例如北区设备巡检。";
    if (/[/\\]/.test(trimmed)) return "工作区名称不能包含斜杠或反斜杠。";
    return lengthError(value);
}

function CountedNameField({ value, supportingText, errorText, ...props }: LineEditProps & { value: string; supportingText: string }) {
    const id = useId();
    const count = countCharacters(value);
    const messageId = errorText ? `${id}-error` : `${id}-hint`;
    return <div className="crab-line-edit-counted">
        <LineEdit {...props} value={value} status={errorText ? "error" : undefined}
            aria-describedby={`${messageId} ${id}-count`} />
        <div className="crab-line-edit-field-support">
            <div>
                <span id={`${id}-hint`} hidden={Boolean(errorText)}>{supportingText}</span>
                <span id={`${id}-error`} role="alert">{errorText}</span>
            </div>
            <span id={`${id}-count`} className="crab-line-edit-count" aria-label={`已输入 ${count} 个字符，最多 ${limit} 个字符`}>{count}/{limit}</span>
        </div>
    </div>;
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
    const [backupName, setBackupName] = useState("夜间巡检");
    const macos = designSystem === "macos";
    const md3 = designSystem === "md3";
    const statesTitle = md3 ? "描边字段状态" : "字段类型与状态";

    function edit(value: string) {
        setDraft(value);
        setAnnouncement("");
        if (!composing.current) setError(error ? nameError(value) : lengthError(value));
    }

    function loadDraft(value: string) {
        setDraft(value);
        setAnnouncement("");
        setError(undefined);
    }

    function restore() {
        loadDraft(saved);
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
                {md3 && <a href="#line-edit-placeholder">试用标签动效</a>}
                <a href="#line-edit-states">{statesTitle}</a>
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
                            <CountedNameField ref={input} name="workspaceName" label="工作区名称" required allowClear
                                autoComplete="off" appearance="outlined" size={design.size} placeholder="例如北区设备巡检"
                                value={draft} supportingText={design.hint} errorText={error} onValueChange={edit}
                                onCompositionStart={() => { composing.current = true; }}
                                onCompositionEnd={event => { composing.current = false; edit(event.currentTarget.value); }}
                                onKeyDown={handleInputKey} />
                            {macos && <LineEdit label="工作区标识" size="small" defaultValue="north-inspection" readOnly />}
                            {designSystem === "shadcn" && <LineEdit label="当前访问路径" defaultValue="/workspaces/north-inspection" readOnly
                                suffix={<span className="crab-line-edit-affix">只读</span>} />}
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
                        <h3>载入试用值</h3>
                        <div className="crab-design-actions">
                            {examples.map(example => <Button key={example.label} appearance="outlined"
                                onClick={() => { loadDraft(example.value); input.current?.focus(); }}>{example.label}</Button>)}
                        </div>
                        <dl className="crab-line-edit-readout"><dt>已保存名称</dt><dd>{saved}</dd></dl>
                    </aside>
                </div>
            </section>
            <section id="line-edit-states" aria-labelledby="line-edit-states-title">
                <div className="crab-design-section-head"><h2 id="line-edit-states-title">{statesTitle}</h2></div>
                <div className="crab-line-edit-samples">
                    <div id="line-edit-placeholder">
                        <h3>空值与占位提示</h3>
                        <LineEdit label="待编辑名称" size={design.size} placeholder="例如北区巡检"
                            supportingText={md3 ? "点击或按 Tab，标签浮起后显示输入示例。空框失焦时标签回落。" : "空值时显示输入示例，输入内容后消失。"} />
                    </div>
                    <div>
                        <h3>已填写与清除</h3>
                        <CountedNameField label="备用名称" size={design.size} value={backupName} onValueChange={setBackupName}
                            allowClear supportingText="清除后焦点回到输入框。" errorText={lengthError(backupName)} />
                    </div>
                    {md3 && <div>
                        <h3>鼠标悬停</h3>
                        <LineEdit label="巡检区域" size={design.size} readOnly defaultValue="北区配电"
                            supportingText="移入时描边对比度提高，保持 1px。点击或按 Tab 聚焦时加重为 2px。" />
                    </div>}
                    <div>
                        <h3>校验失败</h3>
                        <LineEdit label="重复名称" value={errorSample} required size={design.size} onValueChange={setErrorSample}
                            supportingText="使用未被占用的名称。" errorText={nameError(errorSample)} />
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
                        <h3>长路径与后缀</h3>
                        <LineEdit label="工作区路径" defaultValue="/workspaces/north-inspection-and-equipment-monitoring"
                            suffix={<span className="crab-line-edit-affix">内部</span>}
                            size={macos ? "small" : "large"} supportingText="可全选复制完整路径。窄屏可用方向键查看后面的文字。" />
                    </div>
                </div>
            </section>
            <section id="line-edit-rules" aria-labelledby="line-edit-rules-title">
                <div className="crab-design-section-head"><h2 id="line-edit-rules-title">交互规则</h2></div>
                <div className="crab-line-edit-rules">
                    <p>{design.decision}</p>
                    <dl>
                        <dt>标签与说明</dt><dd>{md3 ? "空字段的标签位于输入框内。聚焦或已有内容时标签浮起，辅助说明留在下方。" : "标签和输入框并排，约束说明放在下方。"}校验失败时错误文字替换说明并与字段关联。</dd>
                        <dt>占位提示</dt><dd>{md3 ? "空字段聚焦且标签浮起后，框内出现输入示例。清空后可再次看到示例，失焦时恢复框内标签。" : "字段为空时，框内显示输入示例，左侧标签保持可见。"}</dd>
                        <dt>提交与校验</dt><dd>保存时检查名称。失败时保留草稿并聚焦字段，修正后清除错误。输入法选词期间暂缓校验。</dd>
                        <dt>字符限制</dt><dd>按用户看到的字符计数。超过 32 个字符时保留原文，缩短后可以保存。</dd>
                        <dt>清除与焦点</dt><dd>有内容且可编辑时显示清除按钮，键盘可触发。清除只影响草稿，操作后焦点回到输入框。</dd>
                        {md3 && <><dt>鼠标悬停</dt><dd>移入可用字段时，提高带缺口描边的对比度。移出后恢复默认，聚焦时使用 2px 描边。</dd></>}
                        <dt>尺寸与动效</dt><dd>{md3 ? "常规字段采用 56px 高度，描边颜色随悬停和聚焦过渡。已有内容时，标签保持浮起。启用减少动态效果时，直接显示最终状态。" : "状态切换沿用字段边界，焦点反馈使用描边或外环。"}窄屏允许说明换行，输入内容在单行框内滚动。</dd>
                        <dt>适用范围</dt><dd>用于名称、短编号等单行文本。多行说明用 TextEdit，数值编辑用 NumberEdit。</dd>
                    </dl>
                </div>
            </section>
            <div><Button appearance="text" href={href("components/rc-line-edit")}>查看 LineEdit 组件文档 →</Button></div>
        </div>
    </div>;
}
