import { useEffect, useId, useRef, useState } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import Switch from "@crab-dev/rc-switch";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./switchPrototype.styles.js";

const designs = {
    md3: {
        size: "medium",
        decision: "用色调面板区分刷新设置和保存反馈。轨道与滑块显示开启或关闭，失败信息放在开关下方并提供重试。",
    },
    macos: {
        size: "small",
        decision: "使用紧凑的设置行，名称与说明靠左，小开关靠右。细分隔线下显示刷新方式与保存反馈。",
    },
    shadcn: {
        size: "medium",
        decision: "用中性描边组织设置行和权限说明。保存失败时在设置下方显示错误与重试，保留原来的开关位置。",
    },
} as const;

type SaveState = { phase: "ready" | "saved" } | { phase: "saving" | "failed"; target: boolean };
const saveDelay = 1100;

export default function SwitchPrototype() {
    const { designSystem } = useConfig();
    const design = designs[designSystem];
    const href = useSiteHref();
    const id = useId();
    const controlId = `${id}-auto-refresh`;
    const [saved, setSaved] = useState(false);
    const [save, setSave] = useState<SaveState>({ phase: "ready" });
    const [failNext, setFailNext] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pending = save.phase === "saving";
    const checked = pending ? save.target : saved;
    const refreshMode = checked ? "每 30 秒自动刷新" : "手动刷新";
    const feedback = {
        ready: "切换后立即更新刷新方式。",
        saving: "正在保存设置…",
        saved: "刷新设置已保存。",
        failed: `保存失败。已恢复为${refreshMode}。`,
    }[save.phase];

    useEffect(() => () => {
        if (timer.current !== null) clearTimeout(timer.current);
    }, []);

    function saveRefresh(target: boolean) {
        if (timer.current !== null || target === saved) return;
        const shouldFail = failNext;
        setFailNext(false);
        setSave({ phase: "saving", target });
        timer.current = setTimeout(() => {
            timer.current = null;
            if (shouldFail) {
                setSave({ phase: "failed", target });
                return;
            }
            setSaved(target);
            setSave({ phase: "saved" });
        }, saveDelay);
    }

    function retryRefresh() {
        if (save.phase !== "failed") return;
        document.getElementById(controlId)?.focus();
        saveRefresh(save.target);
    }

    return <div className="crab-design-workspace" data-switch-prototype data-prototype-design={designSystem}>
        <DesignHero section="组件原型" title="Switch 开关" description="在巡检工作区切换自动刷新，试用即时更新、失败回退和重试。">
            <nav className="crab-design-jump-links" aria-label="原型章节">
                <a href="#switch-setting">刷新设置</a>
                <a href="#switch-permission">权限禁用</a>
                <a href="#switch-rules">交互规则</a>
            </nav>
        </DesignHero>
        <div className="crab-design-body">
            <section id="switch-setting" aria-labelledby="switch-setting-title">
                <div className="crab-design-section-head"><h2 id="switch-setting-title">工作区刷新设置</h2></div>
                <div className="crab-switch-panel" data-phase={save.phase}>
                    <Switch id={controlId} className="crab-switch-setting" size={design.size} checked={checked}
                        onCheckedChange={saveRefresh} aria-disabled={pending || undefined}
                        aria-labelledby={`${id}-title`} aria-describedby={`${id}-detail`}>
                        <span className="crab-switch-copy">
                            <span id={`${id}-title`} className="crab-switch-title">自动刷新</span>
                            <span id={`${id}-detail`} className="crab-switch-detail">开启后每 30 秒检查一次巡检数据。</span>
                        </span>
                    </Switch>
                    <div className="crab-switch-result">
                        <dl className="crab-switch-mode"><dt>当前刷新方式</dt><dd>{refreshMode}</dd></dl>
                        <div className="crab-switch-feedback">
                            <p className="crab-switch-detail" role="status" aria-atomic="true">{feedback}</p>
                            {save.phase === "failed" &&
                                <Button type="button" appearance="outlined" onClick={retryRefresh}>重试保存</Button>}
                        </div>
                    </div>
                </div>
                <div className="crab-switch-simulator">
                    <div>
                        <h3>试用失败回退</h3>
                        <p id={`${id}-simulation`} className="crab-switch-detail">
                            {failNext ? "下一次保存将失败。现在切换自动刷新。" : "模拟一次保存失败，再切换自动刷新。"}
                        </p>
                    </div>
                    <Button type="button" appearance="outlined" aria-pressed={failNext} disabled={pending}
                        aria-describedby={`${id}-simulation`} onClick={() => setFailNext(armed => !armed)}>模拟下次失败</Button>
                </div>
            </section>
            <section id="switch-permission" aria-labelledby="switch-permission-title">
                <div className="crab-design-section-head"><h2 id="switch-permission-title">权限禁用</h2></div>
                <div className="crab-switch-panel">
                    <Switch className="crab-switch-setting" size={design.size} disabled defaultChecked
                        aria-labelledby={`${id}-managed`} aria-describedby={`${id}-permission`}>
                        <span className="crab-switch-copy">
                            <span id={`${id}-managed`} className="crab-switch-title">后台刷新</span>
                            <span id={`${id}-permission`} className="crab-switch-detail">团队策略已开启后台刷新，仅管理员可更改。</span>
                        </span>
                    </Switch>
                </div>
            </section>
            <section id="switch-rules" aria-labelledby="switch-rules-title">
                <div className="crab-design-section-head"><h2 id="switch-rules-title">交互规则</h2></div>
                <div className="crab-switch-rules">
                    <p>{design.decision}</p>
                    <dl>
                        <dt>用途</dt><dd>开关适合即时生效的两态设置。多项独立选择或随表单一起提交的选择适合 Checkbox。</dd>
                        <dt>等待</dt><dd>拨动后立即更新开关和刷新方式。保存期间保留焦点，重复操作等待当前请求完成。</dd>
                        <dt>回退与重试</dt><dd>失败后同时恢复开关和上次保存的刷新方式。重试提交原先选择的值，并将焦点送回开关。</dd>
                        <dt>命中与动效</dt><dd>按 Tab 聚焦开关，按空格切换。触控可点按轨道或标签，禁用项跳过焦点。减少动态效果时直接显示最终位置，保留保存与回退提示。</dd>
                    </dl>
                </div>
            </section>
            <div><Button appearance="text" href={href("components/rc-switch")}>查看 Switch 组件文档 →</Button></div>
        </div>
    </div>;
}
