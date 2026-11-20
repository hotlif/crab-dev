import { useEffect, useRef, useState } from "react";
import { useConfig } from "@crab-dev/rc-config-provider";
import Segmented from "@crab-dev/rc-segmented";
import Select from "@crab-dev/rc-select";
import Switch from "@crab-dev/rc-switch";
import { buttonDesigns } from "./buttonDesigns.js";
import { buttonKinds, describeButton, hasAsyncExample, type ButtonKind } from "./buttonKinds.js";
import { MotionButton, MotionFeedback, type SavePhase } from "./buttonMotion.js";

export default function MotionPreview() {
    const { designSystem } = useConfig();
    const design = buttonDesigns[designSystem];
    const [kind, setKind] = useState<ButtonKind>("primary");
    const [selected, setSelected] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const sample = describeButton(kind, designSystem);
    const options = buttonKinds.map(value => ({ value, label: describeButton(value, designSystem).title }));
    const clips = [{ value: "press", label: "按压释放" }, { value: "success", label: sample.action + "成功" }, { value: "failed", label: sample.action + "失败" }];
    const [clip, setClip] = useState<"press" | "success" | "failed">("press");
    const [slow, setSlow] = useState(false);
    const [phase, setPhase] = useState<SavePhase>("idle");
    const [pressed, setPressed] = useState(false);
    const asyncExample = hasAsyncExample(kind);
    const activeClip = asyncExample ? clip : "press";
    const timer = useRef<number | undefined>(undefined);
    useEffect(() => () => window.clearTimeout(timer.current), []);
    function play() {
        if (timer.current !== undefined) return;
        if (activeClip === "press") {
            setPressed(true);
            if (kind === "toggle") setSelected(value => !value);
            if (kind === "text") setExpanded(value => !value);
            return;
        }
        setPhase("busy");
        timer.current = window.setTimeout(() => {
            timer.current = undefined;
            setPhase(activeClip);
        }, 800 * (slow ? 2 : 1));
    }
    function resetPlayback() {
        window.clearTimeout(timer.current);
        timer.current = undefined;
        setPhase("idle");
        setPressed(false);
    }
    const released = kind === "toggle" ? (selected ? "已选中，仅显示收藏。" : "已取消选中，显示全部。") : "已释放，可再次点按。";
    const messages = { idle: pressed ? released : "点按按钮，或聚焦后按空格键播放。", busy: "正在" + sample.action + "…",
        success: sample.action + "成功，可再次播放。", failed: sample.action + "失败，可再次播放。" };
    const label = phase === "busy" ? sample.busy
        : kind === "primary" && phase === "failed" ? design.retry : sample.label;
    return <section id="button-motion" aria-labelledby="button-motion-heading" className="crab-design-motion-lab" data-slow={slow}>
        <div className="crab-design-section-head"><h2 id="button-motion-heading">按钮动效</h2></div>
        <div className="crab-design-motion-board">
            <div className="crab-design-motion-stage" role="group" aria-label="动效试用">
                <MotionButton kind={kind} selected={selected} busy={phase === "busy"} onActivate={play}
                    expanded={kind === "text" ? expanded : undefined} controls={kind === "text" ? "button-config-detail" : undefined}>
                    {kind === "text" && expanded ? "收起" : label}
                </MotionButton>
                {kind === "text" && <p id="button-config-detail" hidden={!expanded}>{design.observation}</p>}
                {kind === "toggle" && <ul className="crab-design-presets" aria-label="配置预设"><li>标准配置 · 已收藏</li>{!selected && <li>临时配置</li>}</ul>}
                <MotionFeedback phase={phase}>{messages[phase]}</MotionFeedback>
            </div>
            <div className="crab-design-motion-controls">
                <Select label="按钮类型" value={kind} options={options} allowClear={false} onValueChange={value => {
                    const next = buttonKinds.find(item => item === value);
                    if (next && next !== kind) { resetPlayback(); setKind(next); setSelected(false); setExpanded(false); }
                }} />
                {asyncExample && <Segmented aria-label="动效片段" options={clips} value={activeClip} onValueChange={value => {
                    if (value === "press" || value === "success" || value === "failed") { resetPlayback(); setClip(value); }
                }} />}
                {asyncExample && <p>{design.motion}</p>}
                <Switch checked={slow} onCheckedChange={setSlow}>半速播放</Switch>
            </div>
        </div>
    </section>;
}
