import { useEffect, useRef, useState } from "react";
import { useConfig } from "@crab-dev/rc-config-provider";
import Button from "@crab-dev/rc-button";
import Segmented from "@crab-dev/rc-segmented";
import Spin from "@crab-dev/rc-spin";
import { LoadingPrototype } from "./loadingPrototype.js";

type Placement = "button" | "panel" | "page";
const placements = [
    { value: "button", label: "按钮内" },
    { value: "panel", label: "局部面板" },
    { value: "page", label: "整页" },
];
const displayDelay = 400;

export default function SpinPrototype() {
    const { designSystem } = useConfig();
    const [placement, setPlacement] = useState<Placement>("button");
    const [request, setRequest] = useState<{ duration: number; placement: Placement } | null>(null);
    const [showInline, setShowInline] = useState(false);
    const [pinned, setPinned] = useState(false);
    const [inspect, setInspect] = useState(false);
    const [status, setStatus] = useState("设备台账可用。");
    const source = useRef<HTMLButtonElement | null>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);
    const variant = designSystem === "md3" ? "expressive" : "circular";

    useEffect(() => {
        if (!request) return;
        const inline = request.placement === "button" ? setTimeout(() => setShowInline(true), displayDelay) : undefined;
        const done = setTimeout(() => {
            setRequest(null);
            setShowInline(false);
            setStatus("设备已同步。");
            if (cancelRef.current?.ownerDocument.activeElement === cancelRef.current) source.current?.focus();
        }, request.duration);
        return () => {
            clearTimeout(inline);
            clearTimeout(done);
        };
    }, [request]);

    function start(duration: number, origin: HTMLButtonElement) {
        if (request) return;
        source.current = origin;
        setRequest({ duration, placement });
    }

    function cancel() {
        if (!request) return;
        setRequest(null);
        setShowInline(false);
        setStatus("同步已取消。");
        source.current?.focus();
    }

    return <LoadingPrototype route="spin" title="Spin 等待反馈" description="用快慢请求对比按钮、面板及整页的等待范围。"
        scene="同步泵站设备台账" rules={[
            ["显示时机", "请求持续超过 400 毫秒才显示指示器。短请求直接给出结果，避免闪烁。"],
            ["等待范围", "按钮内仅拦住重复提交。面板等待保留其他区块操作，整页等待覆盖当前工作区内容。"],
            ["键盘与播报", "提交和取消使用可达的独立操作。完成与取消由同一状态区礼貌播报，指示器在减少动画时依然可辨识。"],
            ["主题差异", "MD3 采用 Expressive 进度指示器，macOS 使用活动辐条，shadcn/ui 使用窄线条圆环。"],
        ]}>
        <div className="crab-loading-actions">
            <Segmented aria-label="等待范围" options={placements} value={placement} disabled={Boolean(request)} onValueChange={(value) => {
                if (value === "button" || value === "panel" || value === "page") setPlacement(value);
            }} />
        </div>
        <div className="crab-loading-actions">
            <Button appearance="primary" loading={showInline} onClick={(event) => start(4200, event.currentTarget)}>模拟慢请求</Button>
            <Button appearance="outlined" onClick={(event) => start(180, event.currentTarget)}>模拟快速响应</Button>
            <Button ref={cancelRef} appearance="text" disabled={!request} onClick={cancel}>取消同步</Button>
        </div>
        <p role="status" className="crab-loading-support crab-loading-status" data-spin-result>{status}</p>
        <Spin role="region" aria-label="设备工作区" data-spin-page delay={displayDelay} size="large" variant={variant}
            spinning={request?.placement === "page"} tip="正在同步整个工作区">
            <div className="crab-loading-content">
                <Spin role="region" aria-label="设备面板" data-spin-panel delay={displayDelay} variant={variant}
                    spinning={request?.placement === "panel"} tip="正在读取设备列表">
                    <div className="crab-loading-surface">
                        <h3>设备台账</h3>
                        <p className="crab-loading-support">北区输水泵 · P-104</p>
                        <Button appearance="text" size="s" aria-pressed={pinned} onClick={() => setPinned(!pinned)}>{pinned ? "取消固定设备" : "固定设备"}</Button>
                    </div>
                </Spin>
                <div className="crab-loading-surface">
                    <h3>检查记录</h3>
                    <p className="crab-loading-support">{inspect ? "上次巡检 · 09:20 · 正常" : "3 条可浏览记录"}</p>
                    <Button appearance="text" size="s" aria-expanded={inspect} onClick={() => setInspect(!inspect)}>最近巡检</Button>
                </div>
            </div>
        </Spin>
    </LoadingPrototype>;
}
