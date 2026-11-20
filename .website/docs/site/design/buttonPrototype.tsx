import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import LineEdit from "@crab-dev/rc-line-edit";
import Segmented from "@crab-dev/rc-segmented";
import Select from "@crab-dev/rc-select";
import Switch from "@crab-dev/rc-switch";
import SiteIcon from "../siteIcon.js";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import { buttonDesigns } from "./buttonDesigns.js";
import { MotionButton, MotionFeedback, type SavePhase } from "./buttonMotion.js";
import ButtonStateMatrix from "./buttonStateMatrix.js";
import ButtonComposition from "./buttonComposition.js";
import MotionPreview from "./motionPreview.js";

const variants = [{ value: "current", label: "现有方案" }, { value: "candidate", label: "候选方案" }];
const speeds = [{ value: "360", label: "快速 · 0.36 秒" }, { value: "3000", label: "慢速 · 3 秒" }];
const initialDraft = "林悦";
const initialSaved = "林月";
const views = [{ value: "项目总览", label: "项目总览" }, { value: "最近工程", label: "最近工程" }];

export default function ButtonPrototype({ scenario = false }: { scenario?: boolean }) {
    const href = useSiteHref();
    const { designSystem } = useConfig();
    const design = buttonDesigns[designSystem];
    const [candidate, setCandidate] = useState(true);
    const [draft, setDraft] = useState(initialDraft);
    const [saved, setSaved] = useState(initialSaved);
    const [startView, setStartView] = useState("项目总览");
    const [savedView, setSavedView] = useState("项目总览");
    const [phase, setPhase] = useState<SavePhase>("idle");
    const [delay, setDelay] = useState(3000);
    const [failNext, setFailNext] = useState(false);
    const nameInput = useRef<HTMLInputElement>(null);
    const request = useRef<number | undefined>(undefined);
    useEffect(() => () => window.clearTimeout(request.current), []);
    const busy = phase === "busy";
    const mac = designSystem === "macos";
    const engineering = designSystem === "md3";
    const saveLabel = candidate || engineering ? design.save : "保存修改";
    const busyLabel = candidate ? design.busy : saveLabel;
    const changed = draft !== saved || (engineering && startView !== savedView);
    const canSave = Boolean(draft.trim()) && changed;
    const messages = { idle: !draft.trim() ? "请填写显示名称" : changed ? "有未保存的修改" : "没有待保存的修改",
        busy: "正在保存…", failed: "保存失败，修改已保留。", success: engineering ? "工作区配置已生效。" : "资料已保存。" };

    function reset() {
        window.clearTimeout(request.current);
        request.current = undefined;
        setDraft(initialDraft);
        setSaved(initialSaved);
        setStartView("项目总览");
        setSavedView("项目总览");
        setPhase("idle");
        setFailNext(false);
        setDelay(3000);
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (request.current !== undefined || !canSave) return;
        const form = event.currentTarget;
        const focused = form.ownerDocument.activeElement;
        const focusedSave = focused?.matches('button[type="submit"]:focus-visible') && form.contains(focused) ? focused : null;
        setPhase("busy");
        setFailNext(false);
        request.current = window.setTimeout(() => {
            request.current = undefined;
            if (failNext) setPhase("failed");
            else {
                if (focusedSave && form.ownerDocument.activeElement === focusedSave) nameInput.current?.focus();
                setSaved(draft);
                if (engineering) setSavedView(startView);
                setPhase("success");
            }
        }, delay);
    }

    const cancel = <Button key="cancel" type="button" appearance={candidate && designSystem === "shadcn" ? "text" : "outlined"} disabled={busy || (engineering && !changed)}
        onClick={() => { setDraft(saved); if (engineering) setStartView(savedView); setPhase("idle"); }}>{engineering ? "还原修改" : "取消"}</Button>;
    const save = <MotionButton key="save" type="submit" candidate={candidate} busy={busy} disabled={!canSave}>
        {busy ? busyLabel : candidate && phase === "failed" ? design.retry : saveLabel}
    </MotionButton>;
    const schemeControl = <Segmented aria-label="方案对照" options={variants} value={candidate ? "candidate" : "current"}
        onValueChange={value => setCandidate(value === "candidate")} />;

    const sceneTitle = engineering ? "工作区配置" : "保存个人资料";
    const scene = <section key="scenario" id="button-scenario" aria-label="异步保存体验">
        <div className="crab-design-section-head">
            <div>{!engineering && <small>{scenario ? "应用场景" : "Button 应用场景"}</small>}<h2>{scenario && !engineering ? "资料编辑表单" : sceneTitle}</h2></div>
            {schemeControl}
        </div>
        <div className="crab-design-experiment">
            <div className="crab-design-stage">
                <form onSubmit={submit} aria-label={engineering ? "编辑工作区配置" : "编辑个人资料"} data-phase={phase} onKeyDown={event => {
                    if (mac && candidate && event.metaKey && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "s") {
                        event.preventDefault();
                        if (!event.repeat) event.currentTarget.requestSubmit();
                    }
                }}>
                    <h3>{engineering && <SiteIcon name="tools" />}{design.formTitle}</h3>
                    <div className="crab-design-form-field">
                        <LineEdit ref={nameInput} label="显示名称" value={draft} readOnly={busy} onValueChange={value => { setDraft(value); setPhase("idle"); }} />
                        {engineering && <div className="crab-design-start-view"><span>启动视图</span>
                            <Segmented aria-label="启动视图" disabled={busy} value={startView} options={views}
                                onValueChange={value => { setStartView(String(value)); setPhase("idle"); }} /></div>}
                    </div>
                    {engineering && <dl className="crab-design-applied"><dt>已生效配置</dt><dd>{saved} · {savedView}</dd></dl>}
                    <div className="crab-design-form-footer">
                        <div className="crab-design-actions">{mac || engineering ? [cancel, save] : [save, cancel]}</div>
                        <MotionFeedback phase={phase} candidate={candidate}>{messages[phase]}</MotionFeedback>
                    </div>
                </form>
            </div>
            <div className="crab-design-settings">
                <h3>{!engineering && <SiteIcon name="tools" />}{engineering ? "模拟请求" : "场景设置"}</h3>
                <Select label="响应速度" value={String(delay)} options={speeds} allowClear={false} onValueChange={value => { if (value) setDelay(Number(value)); }} />
                <div className="crab-design-failure"><span>下次保存失败</span><Switch aria-label="下次保存失败" checked={failNext} onCheckedChange={setFailNext} /></div>
                <Button appearance="text" onClick={reset}>重置场景</Button>
                {!engineering && <div className="crab-design-notes"><strong>观察重点</strong>
                    <p>{candidate ? design.observation : "现有 Button 在原文案前显示加载指示，等待期间保留“保存修改”。"}</p>
                </div>}
            </div>
        </div>
    </section>;
    return <div className="crab-design-workspace" data-button-prototype data-prototype-design={designSystem} data-variant={candidate ? "candidate" : "current"}>
        <DesignHero section={scenario ? "应用场景" : "组件原型"} title={scenario ? (engineering ? "保存工作区配置" : sceneTitle) : "Button 按钮"}
            description={scenario ? design.scenario : design.prototype}>
            {!scenario && <nav aria-label="原型章节" className="crab-design-jump-links">
                <a href="#button-scenario">{engineering ? "工作区配置" : "体验保存场景"}</a>
                <a href="#button-motion">动效对照</a><a href="#button-states">按钮类型与状态</a>
                <a href="#button-composition">按钮组合与布局</a>
            </nav>}
        </DesignHero>
        <div className="crab-design-body">
            {scene}
            {!scenario && <><MotionPreview /><ButtonStateMatrix candidate={candidate} /><ButtonComposition /></>}
            <div>{scenario ? <Button appearance="text" href={href("design/button#button-motion")}>查看 Button 动效与状态 →</Button>
                : <Button appearance="text" href={href("components/rc-button")}>查看 Button 组件文档 →</Button>}</div>
        </div>
    </div>;
}
