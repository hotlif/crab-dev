import { type FormEvent, useRef, useState } from "react";
import Alert from "@crab-dev/rc-alert";
import Button from "@crab-dev/rc-button";
import LineEdit from "@crab-dev/rc-line-edit";
import { FeedbackPrototype } from "./feedbackPrototype.js";

type Feedback = "risk" | "error" | "saved" | null;
const defaultPath = "/exports/readonly";
const workspacePrefix = "/exports/workspace/";
const writablePath = `${workspacePrefix}line-07`;

export default function AlertPrototype() {
    const [path, setPath] = useState(defaultPath);
    const [savedPath, setSavedPath] = useState("");
    const [feedback, setFeedback] = useState<Feedback>("risk");
    const [announced, announce] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const saveRef = useRef<HTMLButtonElement>(null);
    const error = feedback === "error";

    function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const proposed = path.trim();
        const valid = proposed.startsWith(workspacePrefix) && proposed.length > workspacePrefix.length;
        setFeedback(valid ? "saved" : "error");
        announce(valid ? "工作区配置已保存。" : "");
        if (valid) setSavedPath(proposed);
    }

    function dismiss() {
        setFeedback(null);
        announce("已关闭共享目录提示。");
        saveRef.current?.focus({ preventScroll: true });
    }

    return <FeedbackPrototype route="alert" title="Alert 页内警告" description="把严重程度、原因和恢复入口放在同一处。"
        scene="配置巡检报告的导出目录" rules={[
            ["严重程度", "共享目录是可关闭的警告。保存遇到权限错误时保留正文与草稿，直到重新校验。成功反馈保持轻量。"],
            ["恢复入口", "校验失败后可写入工作区目录，再次保存。关闭普通提醒后，焦点回到保存按钮。"],
            ["读屏时机", "保存失败由目录字段的关联错误播报。初始警告可直接读到，关闭和成功用礼貌播报。"],
            ["主题差异", "MD3 用语义色区分表面，macOS 用紧凑行距和清晰图标，shadcn/ui 用描边和文字传递严重程度。"],
        ]}>
        <form className="crab-feedback-form" onSubmit={save}>
            <LineEdit ref={inputRef} label="导出目录" value={path} onValueChange={setPath}
                supportingText="可用目录位于 /exports/workspace/ 下。" errorText={error ? "保存失败。请选择一个可写入的工作区目录。" : undefined} />
            <div className="crab-feedback-actions">
                <Button ref={saveRef} type="submit" appearance="primary">保存配置</Button>
                <Button type="button" appearance="text" onClick={() => {
                    setPath(defaultPath);
                    setFeedback("risk");
                    announce("已还原示例目录。");
                }}>还原示例</Button>
            </div>
        </form>
        {feedback === "risk" && <Alert key="risk" role="group" aria-label="共享目录风险" type="warning" title="共享目录可能影响其他工作区"
            closable onClose={dismiss}>此目录由运维组维护。建议把巡检报告存到当前工作区，以便单独管理写入权限和历史报告。</Alert>}
        {error && <div className="crab-feedback-preview">
            <Alert role="group" aria-label="保存失败详情" type="error" title="无法写入导出目录">
                当前账户没有目标目录的写入权限。配置草稿和历史报告都已保留。
            </Alert>
            <Button type="button" appearance="outlined" onClick={() => {
                setPath(writablePath);
                setFeedback(null);
                announce("已填入工作区目录，可重新保存。");
                inputRef.current?.focus({ preventScroll: true });
            }}>使用工作区目录</Button>
        </div>}
        {feedback === "saved" && <Alert role="group" aria-label="保存结果" type="success" title="工作区配置已保存">
            巡检报告将导出到 {savedPath}。
        </Alert>}
        <span className="crab-feedback-sr" role="status" aria-atomic="true">{announced}</span>
    </FeedbackPrototype>;
}
