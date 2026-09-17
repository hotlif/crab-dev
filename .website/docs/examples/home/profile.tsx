import { useEffect, useId, useRef, useState, useTransition } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";
import Button from "@crab-dev/rc-button";
import Card from "@crab-dev/rc-card";
import Avatar, { AvatarGroup } from "@crab-dev/rc-avatar";
import Checkbox from "@crab-dev/rc-checkbox";
import Switch from "@crab-dev/rc-switch";
import Segmented from "@crab-dev/rc-segmented";
import Tag from "@crab-dev/rc-tag";
import BarChart from "@crab-dev/rc-bar-chart";
import Form from "@crab-dev/rc-form";
import LineEdit from "@crab-dev/rc-line-edit";

const gallery = css`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: ${token.space["section-gap"]};
    align-items: start;
    font-size: ${token.font.size.body};
    line-height: 1.6;
    & .demo-primary, & .demo-extra-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        align-items: start;
        min-width: 0;
        gap: ${token.space["section-gap"]};
    }
    & :is(h3, p) {
        margin: 0;
    }
    & h3 {
        font-size: ${token.font.size.subhead};
        font-weight: ${token.font.weight.heading};
        letter-spacing: -0.02em;
    }
    & .demo-card {
        /* Let the authored body own padding once, without the Card wrapper adding another layer. */
        --card-size-middle-padding: ${globalToken.space[0]};
        border-radius: ${token.radius.xl};
        border-color: transparent;
        box-shadow: none;
        background: ${token.color.background.surface};
    }
    & .demo-body {
        display: grid;
        gap: ${token.space["section-gap"]};
        padding: ${token.space["page-padding"]};
        min-width: 0;
        overflow-wrap: anywhere;
    }
    & .demo-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${token.space["stack-gap"]};
    }
    & .demo-secondary {
        color: ${token.color.text.secondary};
        font-size: ${token.font.size.caption};
    }
    & .demo-overline {
        font-size: ${token.font.size.caption};
        color: ${token.color.text.secondary};
        letter-spacing: 0.04em;
    }
    & .demo-rule {
        padding-top: ${token.space["section-gap"]};
        border-top: 1px solid ${token.color.border.subtle};
    }
    & .demo-number {
        font-size: calc(${token.font.size.heading} * 2);
        line-height: 1.2;
        letter-spacing: -0.05em;
        font-weight: ${token.font.weight.heading};
        font-variant-numeric: tabular-nums;
    }
    & .demo-task-list {
        display: grid;
        gap: ${token.space["stack-gap"]};
    }
    & .demo-task {
        display: flex;
        align-items: center;
        gap: ${token.space["stack-gap"]};
        padding-block: 0;
    }
    & .demo-task-control {
        width: 100%;
        min-height: 2.75rem;
        gap: ${token.space["stack-gap"]};
    }
    & .demo-task-control :is(.demo-task-title, .demo-secondary) {
        display: block;
        line-height: 1.6;
    }
    & .demo-task[data-done="true"] .demo-task-title {
        text-decoration: line-through;
        color: ${token.color.text.tertiary};
    }
    & .demo-progress {
        width: 100%;
        height: ${token.space["component-gap"]};
        accent-color: ${token.color.text.link};
        border: none;
        border-radius: ${token.radius.pill};
        overflow: hidden;
        background: ${token.color.background.sunken};
    }
    & .demo-progress::-webkit-progress-bar {
        background: ${token.color.background.sunken};
    }
    & .demo-progress::-webkit-progress-value {
        background: ${token.color.text.link};
        border-radius: ${token.radius.pill};
    }
    & .demo-progress::-moz-progress-bar {
        background: ${token.color.text.link};
    }
    & .demo-avatar-row {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: ${token.space["stack-gap"]};
    }
    & .demo-avatar-row .demo-secondary { grid-column: 2 / -1; margin-top: calc(-1 * ${token.space["inline-gap"]}); }
    & .demo-form {
        display: grid;
        gap: ${token.space["stack-gap"]};
    }
    & .demo-form label {
        font-size: ${token.font.size.caption};
        font-weight: ${token.font.weight.strong};
    }
    & .demo-form .demo-input-target { display: block; cursor: text; font-weight: ${token.font.weight.body}; }
    & .demo-form [role="status"] {
        min-height: 3.2em;
        font-size: ${token.font.size.caption};
        color: ${token.color.text.secondary};
        overflow-wrap: anywhere;
        min-width: 0;
    }
    & .demo-form [data-feedback="error"] {
        color: ${token.color.feedback.error.text};
    }
    & .demo-form button {
        width: 100%;
        min-height: calc(${globalToken.space[10]} + ${globalToken.space[1]});
        padding-inline: ${token.space["section-gap"]};
    }
    & .demo-email {
        --line-edit-size-middle-height: calc(${globalToken.space[10]} + ${globalToken.space[1]});
        width: 100%;
    }
    & .demo-period { --segmented-size-middle-height: calc(${globalToken.space[10]} + ${globalToken.space[1]}); }
    & .demo-preference-control { display: flex; min-height: calc(${globalToken.space[10]} + ${globalToken.space[1]}); gap: ${token.space["stack-gap"]}; padding-block: ${token.space["component-gap"]}; line-height: 1.6; }
    & .demo-preference-control .demo-secondary { display: block; }
    & .demo-extra { min-width: 0; }
    & .demo-extra summary { cursor: pointer; padding: ${token.space["stack-gap"]} ${token.space["section-gap"]}; min-height: calc(${globalToken.space[10]} + ${globalToken.space[1]}); border-radius: ${token.radius.md}; color: ${token.color.text.link}; }
    & .demo-extra summary:hover { background: ${token.color.background["hover-subtle"]}; }
    & .demo-extra summary:focus-visible { outline: ${globalToken.space["0-5"]} solid ${token.color.focus.ring}; outline-offset: ${globalToken.space["0-5"]}; }
    & .demo-extra-grid { margin-top: ${token.space["section-gap"]}; }
    & .demo-keyboard-action { min-height: calc(${globalToken.space[10]} + ${globalToken.space[1]}); white-space: normal; height: auto; padding: ${token.space["component-gap"]} ${token.space["stack-gap"]}; }
    & .demo-preferences {
        display: grid;
        gap: ${token.space["group-gap"]};
    }
    & .demo-chart {
        min-width: 0;
        margin-inline: calc(${token.space["component-gap"]} * -1);
    }
    & .demo-palette {
        display: flex;
        gap: ${token.space["component-gap"]};
        flex-wrap: wrap;
    }
    & .demo-shortcut {
        font-family: inherit;
        border: 1px solid ${token.color.border.subtle};
        border-radius: ${token.radius.sm};
        padding: 0 ${token.space["inline-gap"]};
        font-size: ${token.font.size.caption};
    }
    @media (max-width: 767px) {
        & .demo-primary, & .demo-extra-grid {
            grid-template-columns: minmax(0, 1fr);
        }
        & .demo-body {
            padding: ${token.space["section-gap"]};
        }
    }
    @media (forced-colors: active) {
        & .demo-card,
        & .demo-rule {
            border-color: CanvasText;
        }
    }
`;

const initialTasks = [
    { title: "建立设计令牌", detail: "Foundation · 设计系统", done: true },
    { title: "完成组件交互", detail: "Components · 前端开发", done: true },
    { title: "检查键盘可访问性", detail: "Accessibility · 体验验收", done: false },
    { title: "发布第一个页面", detail: "Release · 产品交付", done: false },
];

const invitationHelp = "输入邮箱，体验表单校验与提交。";
type InvitationFeedback = { kind: "idle" | "error" | "success"; message: string };

export default function ComponentGallery() {
    const id = useId();
    const [tasks, setTasks] = useState(initialTasks);
    const [period, setPeriod] = useState("week");
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState<InvitationFeedback>({ kind: "idle", message: invitationHelp });
    const invalid = feedback.kind === "error";
    // DOM references preserve the submission origin; user navigation cancels restoration.
    const emailInput = useRef<HTMLInputElement>(null);
    const submissionFocus = useRef<HTMLElement | null>(null);
    const [pending, startTransition] = useTransition();
    const [notifications, setNotifications] = useState(true);
    const [digest, setDigest] = useState(false);
    useEffect(() => {
        if (!pending) {
            if (document.activeElement === document.body) submissionFocus.current?.focus();
            submissionFocus.current = null;
            return;
        }
        const releaseFocus = () => { submissionFocus.current = null; };
        document.addEventListener("pointerdown", releaseFocus);
        document.addEventListener("focusin", releaseFocus);
        return () => {
            document.removeEventListener("pointerdown", releaseFocus);
            document.removeEventListener("focusin", releaseFocus);
        };
    }, [pending]);
    const done = tasks.filter((task) => task.done).length;
    const visits =
        period === "week"
            ? [124, 186, 142, 245, 198, 284, 232]
            : [98, 134, 180, 162, 226, 210, 276];

    async function invite() {
        if (pending) return;
        const address = email.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
            setFeedback({ kind: "error", message: "请输入有效邮箱，例如 lin@example.com。" });
            emailInput.current?.focus();
            return;
        }
        const active = document.activeElement;
        submissionFocus.current = active instanceof HTMLElement && emailInput.current?.closest(".demo-form")?.contains(active) ? active : null;
        setFeedback({ kind: "idle", message: invitationHelp });
        startTransition(async () => {
            // 本地模拟提交；实际项目中替换为邀请接口。
            await new Promise<void>((resolve) => setTimeout(resolve, 600));
            setFeedback({ kind: "success", message: `已为 ${address} 创建演示邀请，未发送邮件。` });
        });
    }

    return (
        <div className={gallery}>
            <div className="demo-primary">
                <Card className="demo-card" variant="outlined">
                    <div className="demo-body">
                        <div className="demo-row">
                            <span className="demo-overline">WORKSPACE / 01</span>
                            <Tag color={done === tasks.length ? "success" : "primary"} size="small">
                                {done === tasks.length ? "✓ 已完成" : "进行中"}
                            </Tag>
                        </div>
                        <div><h3>发布清单</h3><p className="demo-secondary">设计系统 · 九月迭代</p></div>
                        <div className="demo-row">
                            <strong className="demo-number">{done}<span className="demo-secondary"> / 4</span></strong>
                            <span className="demo-secondary">项任务已完成</span>
                        </div>
                        <progress className="demo-progress" value={done} max={4} aria-label="发布清单完成进度" />
                        <div className="demo-task-list">
                            {tasks.map((task, index) => (
                                <div className="demo-task" data-done={task.done} key={task.title}>
                                    {/* home-source:start */}
                                    <Checkbox
                                        className="demo-task-control"
                                        checked={task.done}
                                        aria-label={task.title}
                                        onChange={(checked) => setTasks(tasks.map((item, itemIndex) =>
                                            itemIndex === index ? { ...item, done: checked } : item,
                                        ))}
                                    >
                                        <span>
                                            <span className="demo-task-title">{task.title}</span>
                                            <span className="demo-secondary">{task.detail}</span>
                                        </span>
                                    </Checkbox>
                                    {/* home-source:end */}
                                </div>
                            ))}
                        </div>
                        <div className="demo-row demo-rule">
                            <AvatarGroup size="small">
                                <Avatar variant="primary">林</Avatar>
                                <Avatar variant="warning">周</Avatar>
                                <Avatar variant="success">许</Avatar>
                            </AvatarGroup>
                            <span className="demo-secondary">一起把细节做好</span>
                        </div>
                    </div>
                </Card>
                <Card className="demo-card" variant="outlined">
                    <div className="demo-body">
                        <div><h3>邀请团队成员</h3><p className="demo-secondary">邀请团队成员，共建下一个项目。</p></div>
                        <div className="demo-avatar-row">
                            <Avatar variant="primary" size="large">林</Avatar>
                            <strong>林晓</strong><Tag size="small">管理员</Tag>
                            <p className="demo-secondary">lin@example.com</p>
                        </div>
                        <div className="demo-avatar-row">
                            <Avatar variant="warning" size="large">周</Avatar>
                            <strong>周予</strong><Tag size="small">设计师</Tag>
                            <p className="demo-secondary">zhou@example.com</p>
                        </div>
                        <Form className="demo-form demo-rule" onSubmitSuccess={invite} aria-busy={pending}>
                            <label htmlFor={`${id}-email`}>邀请新成员</label>
                            <label className="demo-input-target" htmlFor={`${id}-email`}>
                                <LineEdit
                                    ref={emailInput}
                                    className="demo-email"
                                    id={`${id}-email`}
                                    value={email}
                                    placeholder="name@company.com"
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        setFeedback({ kind: "idle", message: invitationHelp });
                                    }}
                                    maxLength={80}
                                    size="middle"
                                    status={invalid ? "error" : undefined}
                                    readOnly={pending}
                                    aria-invalid={invalid}
                                    aria-describedby={`${id}-feedback`}
                                />
                            </label>
                            <Button type="submit" appearance="primary" loading={pending}>
                                {pending ? "正在创建…" : "＋ 创建演示邀请"}
                            </Button>
                            <div id={`${id}-feedback`} role="status" aria-atomic="true" data-feedback={feedback.kind}>
                                {pending ? "正在创建演示邀请…" : feedback.message}
                            </div>
                        </Form>
                    </div>
                </Card>
            </div>
            <details className="demo-extra">
                <summary>更多组件体验 · 图表、通知与状态</summary>
                <div className="demo-extra-grid">
                    <Card className="demo-card" variant="outlined">
                        <div className="demo-body">
                            <div className="demo-row"><h3>访问概览</h3><span className="demo-secondary">示例数据</span></div>
                            <Segmented
                                className="demo-period"
                                size="middle"
                                aria-label="访问统计周期"
                                options={[{ label: "本周", value: "week" }, { label: "上周", value: "previous" }]}
                                value={period}
                                onChange={(value) => setPeriod(String(value))}
                            />
                            <div className="demo-row">
                                <strong className="demo-number">{visits.reduce((sum, value) => sum + value, 0).toLocaleString("en-US")}</strong>
                                <Tag color={period === "week" ? "success" : "default"} size="small">
                                    {period === "week" ? "↑ 9.7%" : "上周记录"}
                                </Tag>
                            </div>
                            <div className="demo-chart">
                                <BarChart
                                    width="auto"
                                    height={184}
                                    categories={["一", "二", "三", "四", "五", "六", "日"]}
                                    series={[{ name: "访问量", data: visits }]}
                                    palette={{
                                        series: [token.color.text.link],
                                        canvasBackground: token.color.background.surface,
                                        gridline: token.color.border.subtle,
                                        baseline: token.color.border.subtle,
                                        axisLabel: token.color.text.secondary,
                                    }}
                                    aria-label={`${period === "week" ? "本周" : "上周"}访问量示例`}
                                />
                            </div>
                            <p className="demo-secondary demo-rule">把变化看清楚，再做下一个决定。</p>
                        </div>
                    </Card>
                    <Card className="demo-card" variant="outlined">
                        <div className="demo-body">
                            <h3>通知偏好</h3>
                            <div className="demo-preferences">
                                <Switch className="demo-preference-control" checked={notifications} onChange={setNotifications} aria-label="桌面通知">
                                    <span>桌面通知</span><span className="demo-secondary">项目有新动态时提醒我</span>
                                </Switch>
                                <Switch className="demo-preference-control" checked={digest} onChange={setDigest} aria-label="每周摘要">
                                    <span>每周摘要</span><span className="demo-secondary">每周一，回顾团队进展</span>
                                </Switch>
                            </div>
                        </div>
                    </Card>
                    <Card className="demo-card" variant="outlined">
                        <div className="demo-body">
                            <div className="demo-row"><h3>状态标签</h3><span className="demo-secondary">Tag</span></div>
                            <div className="demo-palette">
                                <Tag color="success">✓ 已完成</Tag><Tag color="primary">进行中</Tag>
                                <Tag color="warning">待审核</Tag><Tag>草稿</Tag>
                            </div>
                        </div>
                    </Card>
                    <Card className="demo-card" variant="outlined">
                        <div className="demo-body">
                            <div className="demo-row"><h3>为键盘而设计</h3><kbd className="demo-shortcut">Tab ↹</kbd></div>
                            <p className="demo-secondary">试着不用鼠标。焦点、选择与反馈，让每一次操作都有迹可循。</p>
                            <Button className="demo-keyboard-action" appearance="subtle" onClick={() => emailInput.current?.focus()}>
                                聚焦邀请输入框
                            </Button>
                        </div>
                    </Card>
                </div>
            </details>
        </div>
    );
}
