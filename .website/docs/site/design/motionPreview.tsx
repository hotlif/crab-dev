import { useEffect, useRef, useState } from "react";
import { useConfig } from "@crab-dev/rc-config-provider";
import Segmented from "@crab-dev/rc-segmented";
import Select from "@crab-dev/rc-select";
import Switch from "@crab-dev/rc-switch";
import { buttonDesigns } from "./buttonDesigns.js";
import { buttonKinds, describeButton, hasAsyncExample, type ButtonKind } from "./buttonKinds.js";
import { MotionButton, MotionFeedback, type SavePhase } from "./buttonMotion.js";

export default function MotionPreview({ candidate }: { candidate: boolean }) {
    const { designSystem } = useConfig();
    const design = buttonDesigns[designSystem];
    const engineering = designSystem === "md3";
    const [kind, setKind] = useState<ButtonKind>("primary");
    const [selected, setSelected] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const sample = describeButton(kind, designSystem, candidate);
    const options = buttonKinds.map(value => ({ value, label: describeButton(value, designSystem, candidate).title }));
    const clips = [{ value: "press", label: "按压释放" }, { value: "success", label: sample.action + "成功" }, { value: "failed", label: sample.action + "失败" }];
    const [clip, setClip] = useState<"press" | "success" | "failed">("press");
    const [slow, setSlow] = useState(false);
    const [phase, setPhase] = useState<SavePhase>("idle");
    const [pressed, setPressed] = useState(false);
    const activeClip = hasAsyncExample(kind, designSystem) ? clip : "press";
    const halfSpeed = slow && (engineering || candidate);
    const timer = useRef<number | undefined>(undefined);
    useEffect(() => () => window.clearTimeout(timer.current), []);
    function play() {
        if (timer.current !== undefined) return;
        if (activeClip === "press") {
            setPressed(true);
            if (kind === "toggle") setSelected(value => !value);
            if (engineering && kind === "text") setExpanded(value => !value);
            return;
        }
        setPhase("busy");
        timer.current = window.setTimeout(() => {
            timer.current = undefined;
            setPhase(activeClip);
            if (activeClip === "success" && kind === "toggle") setSelected(value => !value);
        }, 800 * (halfSpeed ? 2 : 1));
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
    function specimen(proposed: boolean) {
        const item = describeButton(kind, designSystem, proposed);
        const label = !engineering && kind === "primary" && activeClip === "press" ? "试按一下" : phase === "busy" ? item.busy
            : kind === "primary" && phase === "failed" && proposed ? design.retry : item.label;
        const name = proposed ? "候选方案" : "现有方案";
        return <div className="crab-design-trial" key={name} role="group" aria-label={name} data-proposed={proposed}>
            {engineering && <strong>{name}</strong>}
            <MotionButton kind={kind} selected={selected} candidate={proposed} busy={phase === "busy"} onActivate={play}
                expanded={engineering && kind === "text" ? expanded : undefined} controls={engineering && kind === "text" ? "button-config-detail" : undefined}>
                {engineering && kind === "text" && expanded ? "收起" : label}
            </MotionButton>
        </div>;
    }
    return <section id="button-motion" aria-labelledby="button-motion-heading" className="crab-design-motion-lab" data-slow={halfSpeed}>
        <div className="crab-design-section-head"><h2 id="button-motion-heading">按钮动效</h2>{!engineering && <small>{candidate ? "候选方案" : "现有方案"}</small>}</div>
        <div className="crab-design-motion-board">
            <div className="crab-design-motion-stage">
                <div className="crab-design-trials">{(engineering ? [false, true] : [candidate]).map(specimen)}</div>
                {engineering && kind === "text" && <p id="button-config-detail" hidden={!expanded}>启动视图会在下次打开工作区时载入。</p>}
                {engineering && kind === "toggle" && <ul className="crab-design-presets" aria-label="配置预设"><li>标准配置 · 已收藏</li>{!selected && <li>临时配置</li>}</ul>}
                <MotionFeedback candidate={engineering || candidate} phase={phase}>{messages[phase]}</MotionFeedback>
            </div>
            <div className="crab-design-motion-controls">
                <Select label="按钮类型" value={kind} options={options} allowClear={false} onValueChange={value => {
                    const next = buttonKinds.find(item => item === value);
                    if (next && next !== kind) { resetPlayback(); setKind(next); setSelected(false); setExpanded(false); }
                }} />
                {hasAsyncExample(kind, designSystem) && <Segmented aria-label="动效片段" options={clips} value={activeClip} onValueChange={value => {
                    if (value === "press" || value === "success" || value === "failed") { resetPlayback(); setClip(value); }
                }} />}
                <p>{engineering && !hasAsyncExample(kind, designSystem) ? "此操作立即生效，可分别点按两边比较反馈。" : engineering || candidate ? design.motion : "体验当前组件的按压和加载反馈。"}</p>
                {(engineering || candidate) && <Switch checked={slow} onCheckedChange={setSlow}>半速播放</Switch>}
            </div>
        </div>
    </section>;
}
