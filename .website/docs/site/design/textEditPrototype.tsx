import { useRef, useState, type FormEvent } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import TextEdit from "@crab-dev/rc-text-edit";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./textEditPrototype.styles.js";

const savedNote = "夜班交接\n北区 2 号泵运行正常，下一班复查入口滤网。";
const exampleNote = "上午巡检\n已完成北区设备巡检，2 号泵滤网已清洁。\n下班前复测入口压差。";
const noteLimit = 500;
const longNote = [
    "北区运行交接记录",
    "06:00 核对夜班记录，补记 2 号泵的停机时间。",
    "07:15 检查入口滤网，确认压差回到基线。",
    "08:00 记录 3 号泵出口读数，趋势稳定。",
    "09:20 更新阀位台账，确认旁通阀已关闭。",
    "10:30 复查控制箱散热，补齐点检照片。",
    "11:10 核对备用电源试运行结果。",
    "13:45 清理巡检通道，记录待更换的标识。",
    "15:30 复测入口压差，结果交给下一班。",
    "交接事项：先检查北区滤网，再核对工单关闭记录。",
].join("\n");

const designs = {
    md3: {
        size: "medium",
        decision: "采用单一描边形态。标签固定在轮廓缺口，空值示例从第一行开始。悬停加深边界，聚焦强化轮廓，错误同步更新标签和辅助区。",
    },
    macos: {
        size: "small",
        decision: "采用紧凑的桌面备注编辑区。静态标签在上方，文字区用轻描边和蓝色焦点环，保存与恢复集中在底部。",
    },
    shadcn: {
        size: "medium",
        decision: "采用中性边界、静态标签和下方说明。聚焦显示外侧焦点环，校验错误同时标记字段并给出修正提示。",
    },
} as const;

export default function TextEditPrototype() {
    const { designSystem } = useConfig();
    const design = designs[designSystem];
    const href = useSiteHref();
    const editor = useRef<HTMLTextAreaElement>(null);
    const resizeEditor = useRef<HTMLTextAreaElement>(null);
    const [draft, setDraft] = useState(savedNote);
    const [saved, setSaved] = useState(savedNote);
    const [comparison, setComparison] = useState(exampleNote);
    const [nextSaveFails, setNextSaveFails] = useState(false);
    const [result, setResult] = useState<"idle" | "invalid" | "failed" | "saved">("idle");

    function loadDraft(value: string, fail = false) {
        setDraft(value);
        setNextSaveFails(fail);
        setResult("idle");
        editor.current?.focus();
    }

    function setExampleHeight(height: string) {
        if (resizeEditor.current) resizeEditor.current.style.height = height;
    }

    function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!draft.trim()) {
            setResult("invalid");
            editor.current?.focus();
            return;
        }
        if (nextSaveFails) {
            setNextSaveFails(false);
            setResult("failed");
            return;
        }
        setSaved(draft);
        setResult("saved");
    }

    return <div className="crab-design-workspace" data-text-edit-prototype data-prototype-design={designSystem}>
        <DesignHero section="组件原型" title="TextEdit 多行输入框" description="编写运行交接备注，试用换行、校验、长文本和只读复核。">
            <nav className="crab-text-edit-jump" aria-label="原型章节">
                <a href="#text-edit-note">运行备注</a>
                <a href="#text-edit-height">高度与滚动</a>
                <a href="#text-edit-rules">交互规则</a>
            </nav>
        </DesignHero>
        <div className="crab-design-body">
            <section id="text-edit-note" aria-labelledby="text-edit-note-title">
                <div className="crab-design-section-head"><h2 id="text-edit-note-title">运行交接备注</h2></div>
                <div className="crab-text-edit-workspace">
                    <form className="crab-text-edit-panel crab-text-edit-editor" aria-label="编辑交接备注" onSubmit={save} noValidate>
                        <TextEdit ref={editor} label="交接备注" name="note" required size={design.size}
                            rows={5} resize="none" maxLength={noteLimit} showCount allowClear value={draft}
                            placeholder="例如：滤网已清洁，下一班复测入口压差。"
                            supportingText={draft.length === noteLimit
                                ? "已达到输入上限。删减内容后可继续输入。"
                                : "记录已完成事项和下一班需处理的工作。"}
                            errorText={result === "invalid" ? "请输入交接备注，至少包含一个非空白字符。" : undefined}
                            onValueChange={value => {
                                setDraft(value);
                                setResult(current => current === "invalid" && !value.trim() ? "invalid" : "idle");
                            }} />
                        <div className="crab-text-edit-footer">
                            <p role="status" data-result={result}>
                                {result === "failed" && "保存失败，草稿已保留。可以再次保存。"}
                                {result === "saved" && "备注已保存。"}
                                {result === "idle" && nextSaveFails && "下一次保存将模拟失败。"}
                            </p>
                            <div className="crab-design-actions">
                                <Button type="button" appearance="text" onClick={() => loadDraft(saved)}>恢复已保存版本</Button>
                                <Button type="submit" appearance="primary">保存备注</Button>
                            </div>
                        </div>
                    </form>
                    <aside className="crab-text-edit-panel crab-text-edit-presets" aria-label="试用数据">
                        <h3>试用数据</h3>
                        <div className="crab-text-edit-preset-actions">
                            <Button appearance="outlined" size="s" onClick={() => loadDraft("")}>载入空白</Button>
                            <Button appearance="outlined" size="s" onClick={() => loadDraft(exampleNote)}>载入示例</Button>
                            <Button appearance="outlined" size="s" onClick={() => loadDraft(longNote)}>载入长备注</Button>
                            <Button appearance="outlined" size="s" onClick={() => loadDraft(exampleNote, true)}>模拟保存失败</Button>
                        </div>
                        <figure className="crab-text-edit-saved">
                            <figcaption>上次保存</figcaption>
                            <p tabIndex={0}>{saved}</p>
                        </figure>
                    </aside>
                </div>
            </section>

            <section id="text-edit-height" aria-labelledby="text-edit-height-title">
                <div className="crab-design-section-head">
                    <h2 id="text-edit-height-title">高度与滚动</h2>
                    <div className="crab-design-actions">
                        <Button appearance="text" size="s" onClick={() => setComparison(exampleNote)}>恢复短文</Button>
                        <Button appearance="outlined" size="s" onClick={() => setComparison(longNote)}>比较长文</Button>
                    </div>
                </div>
                <div className="crab-text-edit-comparison">
                    <div className="crab-text-edit-panel">
                        <TextEdit label="固定四行" size={design.size} rows={4} resize="none"
                            value={comparison} onValueChange={setComparison} supportingText="表单高度保持稳定，超出的内容在框内滚动。" />
                    </div>
                    <div className="crab-text-edit-panel crab-text-edit-grow">
                        <TextEdit label="随内容增长" size={design.size} rows={3} autoSize
                            value={comparison} onValueChange={setComparison} supportingText="从三行增长到八行，超过八行后在框内滚动。" />
                    </div>
                    <div className="crab-text-edit-panel crab-text-edit-resize">
                        <TextEdit ref={resizeEditor} label="手动调整高度" size={design.size} rows={4} resize="vertical"
                            value={comparison} onValueChange={setComparison}
                            supportingText="上下拖动右下角，在三到十行之间调整。也可用下方按钮设置高度。" />
                        <div className="crab-design-actions" role="group" aria-label="调整编辑区高度">
                            <Button appearance="outlined" size="s" onClick={() => setExampleHeight("8lh")}>设为八行</Button>
                            <Button appearance="text" size="s" onClick={() => setExampleHeight("")}>恢复四行</Button>
                        </div>
                    </div>
                    <div className="crab-text-edit-panel">
                        <TextEdit label="只读长记录" size={design.size} rows={4} resize="none"
                            readOnly value={longNote} supportingText="可用 Page Down 或滚动查看后续内容，也可选择复制。" />
                    </div>
                </div>
            </section>

            <section id="text-edit-rules" aria-labelledby="text-edit-rules-title">
                <div className="crab-design-section-head"><h2 id="text-edit-rules-title">交互规则</h2></div>
                <div className="crab-text-edit-panel crab-text-edit-rules">
                    <p>{design.decision}</p>
                    <dl>
                        <dt>何时使用</dt><dd>备注、描述或交接记录可以换行。名称和编号使用 LineEdit。长篇或富文本编辑使用专门的编辑器。</dd>
                        <dt>键盘与输入法</dt><dd>Enter 换行，Tab 移到下一项，保存由按钮触发。中文候选确认保留输入法行为。</dd>
                        <dt>校验与恢复</dt><dd>保存时检查空白内容。清除后焦点回到文本区，保存失败保留草稿，恢复操作载入上次保存的文本。</dd>
                        <dt>高度选择</dt><dd>交接表单采用固定五行，让操作区稳定。短备注可随内容增长，反复编辑长文时可纵向拖拽，归档复核保持固定视窗。不支持自动增长时按三行显示并允许内部滚动。</dd>
                    </dl>
                    <TextEdit label="禁用的归档备注" size={design.size} rows={2} resize="none" disabled
                        defaultValue="归档任务正在同步。\n同步结束后可复核记录。"
                        supportingText="同步期间跳过键盘焦点。" />
                    <Button appearance="text" href={href("components/rc-text-edit")}>查看 TextEdit 组件文档</Button>
                </div>
            </section>
        </div>
    </div>;
}
