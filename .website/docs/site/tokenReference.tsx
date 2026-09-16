import { useId, useState } from "react";
import type { KeyboardEvent } from "react";
import Button from "@crab-dev/rc-button";
import { tokenEntries } from "../_generated/globalTokenReference.js";
import { referenceStyle } from "./tokenReferenceStyles.js";

type Entry = (typeof tokenEntries)[number];
const groups: Record<string, string> = {
    colors: "颜色", space: "间距", radius: "圆角", typography: "字体与排版",
    shadow: "阴影", motion: "动效", opacity: "透明度", "z-index": "层级",
};
const families: Record<string, string> = {
    purple: "Purple · 紫色调阶（数值越大越亮）",
    zinc: "Zinc · 中性灰", blue: "Blue · 蓝", red: "Red · 红", green: "Green · 绿",
    amber: "Amber · 琥珀", white: "黑与白", black: "黑与白",
    "font.family": "字体族", "font.size": "字号", "font.weight": "字重", "line.height": "行高",
    duration: "时长", easing: "缓动",
};
function family(entry: Entry) {
    const parts = entry.key.split(".");
    return families[parts.slice(0, 2).join(".")] ?? families[parts[0]] ?? groups[entry.group];
}

function CopyValue({ text, label }: { text: string; label: string }) {
    const [state, setState] = useState<"idle" | "pending" | "success" | "error">("idle");
    async function copy() {
        setState("pending");
        try { await navigator.clipboard.writeText(text); setState("success"); }
        catch { setState("error"); }
    }
    return <div className="tgr-copy">
        <Button size="small" appearance="text" onClick={copy} loading={state === "pending"} aria-label={`${label} ${text}`}>{label}</Button>
        <span role="status">{state === "success" ? "已复制" : state === "error" ? "复制失败，请选择上方代码复制" : state === "pending" ? "复制中" : ""}</span>
    </div>;
}

function TokenDetails({ entry }: { entry: Entry }) {
    return <div className="tgr-details">
        <dl>
            <div><dt>原始值</dt><dd><code className="tgr-value">{entry.value}</code></dd></div>
            <div><dt>公共引用</dt><dd><code className="tgr-expression">{entry.expression}</code></dd></div>
            <div><dt>CSS 变量</dt><dd><code className="tgr-variable">{entry.variable}</code></dd></div>
        </dl>
        <div className="tgr-detail-actions">
            <CopyValue text={entry.expression} label="复制引用" />
            <CopyValue text={entry.variable} label="复制变量名" />
        </div>
    </div>;
}

function SampleFamily({ name, entries }: { name: string; entries: Entry[] }) {
    const [selectedKey, setSelectedKey] = useState(entries[0]?.key);
    const detailId = useId();
    const color = entries[0]?.group === "colors";
    const selected = entries.find(entry => entry.key === selectedKey) ?? entries[0];
    if (!selected) return null;
    function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
        const next = event.key === "ArrowRight" ? (index + 1) % entries.length
            : event.key === "ArrowLeft" ? (index + entries.length - 1) % entries.length
                : event.key === "Home" ? 0 : event.key === "End" ? entries.length - 1 : undefined;
        if (next === undefined) return;
        event.preventDefault();
        setSelectedKey(entries[next].key);
        event.currentTarget.closest(".tgr-sample-strip")?.querySelectorAll<HTMLButtonElement>("button.tgr-color-choice")[next]?.focus();
    }
    return <div className={color ? "tgr-family tgr-color-family" : "tgr-family tgr-sample-family"}>
        {color && <h3>{name}</h3>}
        <div className={color ? "tgr-color-strip tgr-sample-strip" : "tgr-gallery tgr-sample-strip"} role="toolbar" aria-label={`${name}${color ? "色阶" : "样本"}`}>
            {entries.map((entry, index) => <div key={entry.key} className={`tgr-item ${entry.sampleClass}`} data-token-key={entry.key}>
                <Button className="tgr-color-choice" appearance="text" onClick={() => setSelectedKey(entry.key)}
                    aria-label={`查看 ${entry.key}`} aria-pressed={selected.key === entry.key} aria-controls={detailId}
                    tabIndex={selected.key === entry.key ? 0 : -1} onKeyDown={event => move(event, index)}>
                    <span className="tgr-sample" aria-hidden="true">{entry.group === "opacity" ? "Aa" : ""}</span>
                    <span className="tgr-tone"><span className="tgr-check" aria-hidden="true">{selected.key === entry.key ? "●" : ""}</span>{color ? entry.key.split(".").at(-1) : entry.key}</span>
                    {!color && <span className="tgr-summary">{displayValue(entry)}</span>}
                </Button>
            </div>)}
        </div>
        <div id={detailId} className="tgr-color-detail" role="region" aria-label={`${name}详情`}>
            <p className="tgr-selection" role="status">当前{color ? "色阶" : "样本"} · <strong>{selected.key}</strong></p>
            <TokenDetails key={selected.key} entry={selected} />
        </div>
    </div>;
}

function displayValue(entry: Entry) {
    if (entry.group === "shadow") return entry.value === "none" ? "无投影" : `${entry.value.split(",").length} 层投影`;
    if (entry.key === "font.family.sans") return "无衬线回退";
    if (entry.key === "font.family.mono") return "等宽回退";
    return entry.value;
}

function TokenItem({ entry, inLayerList = false }: { entry: Entry; inLayerList?: boolean }) {
    const [expanded, setExpanded] = useState(false);
    const detailId = useId();
    return <article className={inLayerList ? "tgr-item tgr-layer-row" : `tgr-item ${entry.sampleClass}`} data-token-key={inLayerList ? undefined : entry.key}>
        <div className="tgr-info"><strong>{entry.key}</strong><span className="tgr-summary">{displayValue(entry)}</span></div>
        {!inLayerList && <div className="tgr-stage" aria-hidden="true"><span className="tgr-sample">
            {entry.group === "typography" ? <>项目台账 Aa 0123{entry.key.startsWith("line.height.") && <><br />成员记录 · Crab</>}</> : entry.group === "opacity" ? "Aa" : ""}
        </span></div>}
        <Button className="tgr-code-toggle" size="small" appearance="text" aria-expanded={expanded} aria-controls={detailId} aria-label={`${expanded ? "收起" : "查看"} ${entry.key} 代码`} onClick={() => setExpanded(value => !value)}>{expanded ? "收起" : "代码"}</Button>
        <div id={detailId} className="tgr-expanded" hidden={!expanded}>{expanded && <TokenDetails entry={entry} />}</div>
    </article>;
}

export default function TokenReference({ group }: { group: string }) {
    const [moving, setMoving] = useState(false);
    const entries = tokenEntries.filter(entry => entry.group === group);
    const names = [...new Set(entries.map(family))];
    return <section className={referenceStyle} data-group={group} data-moving={moving} aria-label={`${groups[group]}令牌参考`}>
        <div className="tgr-caption"><span>{entries.length} 项 · 源码原始值</span>
            {group === "motion" && <Button size="small" appearance="subtle" onClick={() => setMoving(value => !value)}>播放 / 反向对照</Button>}
        </div>
        {group === "colors" && <p className="tgr-hint">选择色阶查看参数；键盘可用左右方向键、Home 和 End，窄屏可横向浏览色带。</p>}
        {group === "motion" && <p className="tgr-hint">点击后同时移动，再次点击反向。时长组使用 out 缓动，缓动组统一使用 slow 时长。</p>}
        {group === "motion" && <p className="tgr-reduced">已按减少动态效果偏好移除过渡。起止位置与参数仍可查看。</p>}
        {group === "z-index" ? <div className="tgr-layer-layout">
            <div className="tgr-layer-scene" aria-hidden="true">{entries.map(entry => <div className={`tgr-item ${entry.sampleClass}`} data-token-key={entry.key} key={entry.key}><span className="tgr-sample">{entry.value}</span></div>)}</div>
            <div className="tgr-list">{entries.map(entry => <TokenItem key={entry.key} entry={entry} inLayerList />)}</div>
        </div> : names.map(name => ["colors", "radius", "shadow", "opacity"].includes(group) ? <SampleFamily key={name} name={name} entries={entries.filter(entry => family(entry) === name)} /> :
            <div className="tgr-family" key={name}>
                {names.length > 1 && <h3>{name}</h3>}
                <div className={["space", "typography", "motion"].includes(group) ? "tgr-list" : "tgr-gallery"}>
                    {entries.filter(entry => family(entry) === name).map(entry => <TokenItem key={entry.key} entry={entry} />)}
                </div>
            </div>)}
    </section>;
}
