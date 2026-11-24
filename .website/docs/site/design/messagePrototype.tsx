import { useEffect, useRef, useState } from "react";
import Button from "@crab-dev/rc-button";
import Message from "@crab-dev/rc-message";
import { FeedbackPrototype } from "./feedbackPrototype.js";

const duration = 6000;
const label = { save: "配置已保存", copy: "已复制报告编号" };
type Action = keyof typeof label;
interface Notice {
    id: number;
    action: Action;
    count: number;
    remaining: number;
}

export default function MessagePrototype() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [over, setOver] = useState(false);
    const [focused, setFocused] = useState(false);
    const nextId = useRef(0);
    const startedAt = useRef<number | null>(null);
    const saveRef = useRef<HTMLButtonElement>(null);
    const copyRef = useRef<HTMLButtonElement>(null);
    const active = notices[0];
    const id = active?.id;
    const remaining = active?.remaining;
    const paused = over || focused;

    useEffect(() => {
        if (id === undefined || remaining === undefined || paused) return;
        startedAt.current = performance.now();
        const timer = setTimeout(() => {
            setNotices((current) => current[0]?.id === id ? current.slice(1) : current);
        }, remaining);
        return () => {
            clearTimeout(timer);
            startedAt.current = null;
        };
    }, [id, paused, remaining]);

    function send(action: Action, count = 1) {
        const newNotice = { id: ++nextId.current, action, count, remaining: duration };
        setNotices((current) => current.some((item) => item.action === action)
            ? current.map((item) => item.action === action ? { ...item, count: item.count + count } : item)
            : [...current, newNotice]);
    }

    function rememberRemaining() {
        if (paused || startedAt.current === null || !active) return;
        const elapsed = performance.now() - startedAt.current;
        setNotices((current) => current.map((item) => item.id === active.id
            ? { ...item, remaining: Math.max(1, item.remaining - elapsed) }
            : item));
    }

    function close() {
        if (!active) return;
        const returnTo = active.action === "save" ? saveRef.current : copyRef.current;
        returnTo?.focus({ preventScroll: true });
        setFocused(false);
        setOver(false);
        setNotices((current) => current.filter((item) => item.id !== active.id));
    }

    return <FeedbackPrototype route="message" title="Message 短时反馈" description="试用保存、复制和连续触发，观察短时反馈如何排队。"
        scene="巡检报告操作反馈" rules={[
            ["时长和顺序", "一条反馈显示 6 秒。保存和复制按触发顺序展示。重复内容合并为次数，保留剩余时长。"],
            ["暂停和关闭", "鼠标进入消息或键盘聚焦关闭按钮时暂停。离开后从剩余时长继续。主动关闭后焦点回到对应操作。"],
            ["读屏时机", "新消息和合并后的次数用礼貌播报。倒计时只显示进度，重要恢复操作应留在任务界面。"],
            ["主题差异", "MD3 将短消息居中于反馈区底部，macOS 使用紧凑右对齐提示，shadcn/ui 使用右侧描边卡片。"],
        ]}>
        <div className="crab-feedback-actions">
            <Button ref={saveRef} appearance="primary" onClick={() => send("save")}>保存配置</Button>
            <Button ref={copyRef} appearance="outlined" onClick={() => send("copy")}>模拟复制编号</Button>
            <Button appearance="text" onClick={() => { send("save", 2); send("copy"); }}>连续触发</Button>
        </div>
        <div className="crab-feedback-preview crab-feedback-message-preview">
            <p className="crab-feedback-support" data-message-queue>{active ? `${notices.length - 1} 条等待展示` : "暂无消息"}</p>
            <div className="crab-feedback-toast-location" onPointerEnter={(event) => {
                if (event.pointerType === "touch") return;
                rememberRemaining();
                setOver(true);
            }} onPointerLeave={() => setOver(false)} data-message-paused={paused}>
                {active && <Message key={active.id} type={active.action === "save" ? "success" : "info"} role="group"
                    aria-label="当前消息" aria-live="off" duration={duration} remaining={active.remaining} paused={paused}
                    content={<span className="crab-feedback-toast-content">
                        <strong>{label[active.action]}{active.count > 1 && ` ×${active.count}`}</strong>
                        <Button appearance="text" size="s" aria-label="关闭当前消息" onClick={close}
                            onFocus={() => { rememberRemaining(); setFocused(true); }}
                            onBlur={() => setFocused(false)}>关闭</Button>
                    </span>} />}
            </div>
        </div>
        <span className="crab-feedback-sr" role="status" aria-atomic="true">
            {active && `${label[active.action]}${active.count > 1 ? `，共 ${active.count} 次` : ""}。`}
        </span>
    </FeedbackPrototype>;
}
