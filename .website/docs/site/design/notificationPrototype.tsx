import { useEffect, useRef, useState } from "react";
import { useConfig } from "@crab-dev/rc-config-provider";
import Button from "@crab-dev/rc-button";
import Notification from "@crab-dev/rc-notification";
import { FeedbackPrototype } from "./feedbackPrototype.js";

type Job = "night" | "weekly" | "sensors";
type Phase = "error" | "done" | "retrying";
interface ExportNotice { job: Job; phase: Phase }

const names: Record<Job, string> = { night: "夜间巡检", weekly: "周巡检汇总", sensors: "传感器清单" };
const phaseLabels: Record<Phase, string> = { done: "导出完成", error: "导出失败", retrying: "正在重试" };

export default function NotificationPrototype() {
    const { designSystem } = useConfig();
    const [notices, setNotices] = useState<ExportNotice[]>([]);
    const [selected, setSelected] = useState<Job | null>(null);
    const [announced, announce] = useState("");
    const originRef = useRef<HTMLButtonElement>(null);
    const resultRef = useRef<HTMLHeadingElement>(null);
    const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const direction = designSystem === "shadcn" ? "bottomRight" : "topRight";

    useEffect(() => () => {
        if (retryTimer.current !== null) clearTimeout(retryTimer.current);
    }, []);
    const revealResult = useRef(false);
    useEffect(() => {
        if (selected && revealResult.current) {
            revealResult.current = false;
            resultRef.current?.focus({ preventScroll: true });
        }
    }, [selected]);

    function show(job: Job, phase: Phase) {
        if (job === "night" && retryTimer.current !== null) {
            clearTimeout(retryTimer.current);
            retryTimer.current = null;
        }
        setNotices((prior) => [{ job, phase }, ...prior.filter((item) => item.job !== job)]);
        announce(`${names[job]}${phaseLabels[phase]}。`);
    }

    function changePhase(job: Job, phase: Phase) {
        setNotices((prior) => prior.map((item) => item.job === job ? { job, phase } : item));
        announce(`${names[job]}${phaseLabels[phase]}。`);
    }

    function retry(job: Job) {
        if (retryTimer.current !== null) return;
        changePhase(job, "retrying");
        originRef.current?.focus({ preventScroll: true });
        retryTimer.current = setTimeout(() => {
            retryTimer.current = null;
            changePhase(job, "done");
        }, 950);
    }

    function close(item: ExportNotice) {
        if (item.job === "night" && retryTimer.current !== null) {
            clearTimeout(retryTimer.current);
            retryTimer.current = null;
        }
        setNotices((prior) => prior.filter(({ job }) => job !== item.job));
        originRef.current?.focus({ preventScroll: true });
        announce(`已关闭${names[item.job]}通知。`);
    }

    function inspect(job: Job) {
        if (selected === job) {
            resultRef.current?.focus({ preventScroll: true });
            return;
        }
        revealResult.current = true;
        setSelected(job);
    }

    return <FeedbackPrototype route="notification" title="Notification 持久通知" description="查看后台导出状态，试用堆叠、失败重试和结果入口。"
        scene="后台导出中心" rules={[
            ["信息留存", "后台导出完成或失败后保留通知，用户查看结果或重试后可手动关闭。连续触发同一任务时更新原通知。"],
            ["堆叠顺序", "最新任务在前台，最多保留三个任务。点击通知列表中的任务可将它移到前台，焦点留在列表。"],
            ["键盘与读屏", "到达通知不会移动焦点。关闭后回到导出操作区，查看结果时聚焦结果标题。后台结果使用礼貌播报。"],
            ["主题差异", "MD3 用工作区内的任务面板显示通知，macOS 借鉴窗口右侧通知的对齐与层级，shadcn/ui 用清晰描边和短动作。"],
        ]}>
        <div className="crab-feedback-actions">
            <Button ref={originRef} appearance="primary" onClick={() => show("night", "error")}>模拟巡检失败</Button>
            <Button appearance="outlined" onClick={() => show("weekly", "done")}>模拟汇总完成</Button>
            <Button appearance="outlined" onClick={() => show("sensors", "done")}>模拟清单完成</Button>
        </div>
        <div className="crab-feedback-two-col">
            <div className="crab-feedback-preview">
                <h3>待处理通知</h3>
                {notices.length ? <ul className="crab-feedback-notice-list">
                    {notices.map(({ job, phase }, index) => <li key={job}>
                        <Button appearance={index === 0 ? "tonal" : "text"} aria-pressed={index === 0} onClick={() => {
                            setNotices((prior) => [{ job, phase }, ...prior.filter((item) => item.job !== job)]);
                        }}>{names[job]} · {phaseLabels[phase]}</Button>
                    </li>)}
                </ul> : <p className="crab-feedback-support">暂无通知。</p>}
            </div>
            <div className="crab-feedback-preview">
                <h3>通知预览</h3>
                <div className="crab-feedback-notice-stack" data-notification-count={notices.length}>
                    {notices.map((item, index) => <Notification key={item.job} open stack={index + 1} direction={direction}
                        role="group" aria-label={`${names[item.job]}通知`} aria-live="off" duration={0} showProgress={false}
                        title={`${names[item.job]} · ${phaseLabels[item.phase]}`} onOpenChange={(open) => { if (!open) close(item); }}>
                        <p>{item.phase === "error" ? "上游存储暂不可用，原始数据仍在。"
                            : item.phase === "retrying" ? "正在重新生成报告，完成后会更新本条通知。"
                            : "CSV 文件可在导出记录中查看。"}</p>
                        <div className="crab-feedback-actions crab-feedback-notice-actions">
                            {item.phase === "error" && <Button appearance="outlined" size="s" onClick={() => retry(item.job)}>重试导出</Button>}
                            {item.phase === "done" && <Button appearance="text" size="s" onClick={() => inspect(item.job)}>查看结果</Button>}
                        </div>
                    </Notification>)}
                </div>
            </div>
        </div>
        {selected && <div className="crab-feedback-visible-status">
            <h3 ref={resultRef} tabIndex={-1}>导出结果</h3>
            <p>{names[selected]} · CSV · 已完成</p>
        </div>}
        <span className="crab-feedback-sr" role="status" aria-atomic="true">{announced}</span>
    </FeedbackPrototype>;
}
