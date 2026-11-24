import { useEffect, useState } from "react";
import { useConfig } from "@crab-dev/rc-config-provider";
import Alert from "@crab-dev/rc-alert";
import Button from "@crab-dev/rc-button";
import Empty from "@crab-dev/rc-empty";
import Skeleton from "@crab-dev/rc-skeleton";
import { LoadingPrototype } from "./loadingPrototype.js";

const devices = [
    { id: "P-104", glyph: "泵", name: "北区输水泵", state: "运行正常" },
    { id: "PT-203", glyph: "压", name: "回流管压力表", state: "待复核" },
    { id: "V-041", glyph: "阀", name: "进水调节阀", state: "运行正常" },
];
type Request = "initial" | "refresh" | "empty" | "error";
type Result = "records" | "empty" | "error";

export default function SkeletonPrototype() {
    const { designSystem } = useConfig();
    const [pending, setPending] = useState<Request | null>(null);
    const [result, setResult] = useState<Result>("records");
    const [revision, setRevision] = useState(0);
    const refreshing = pending === "refresh" && result === "records";
    const placeholder = pending !== null && !refreshing;
    const busy = pending !== null;
    const animation = designSystem === "md3" ? "wave" : "pulse";

    useEffect(() => {
        if (!pending) return;
        const timer = setTimeout(() => {
            setResult(pending === "empty" || pending === "error" ? pending : "records");
            if (pending === "refresh") setRevision((current) => current + 1);
            setPending(null);
        }, 1750);
        return () => clearTimeout(timer);
    }, [pending]);

    function load(request: Request) {
        if (!pending) setPending(request);
    }

    return <LoadingPrototype route="skeleton" title="Skeleton 骨架屏" description="比较首次占位、保留旧设备列表的刷新，以及空结果和失败。"
        scene="西区泵站设备列表" rules={[
            ["首次加载", "预留与真实列表一致的图标、标题与状态行尺寸，用一处状态播报解释等待。"],
            ["刷新数据", "保留当前条目并标记刷新状态。响应返回后更新内容，焦点留在发起操作上。"],
            ["过渡结束", "无记录时显示空状态，失败时提供重试。骨架的动画遵循系统减少动画设置。"],
            ["主题差异", "MD3 浅层容器内使用低对比扫描，macOS 和 shadcn/ui 采用安静的脉动占位及各自的边界。"],
        ]}>
        <div className="crab-loading-actions">
            <Button appearance="primary" onClick={() => load("initial")}>模拟首次加载</Button>
            <Button appearance="outlined" onClick={() => load("refresh")}>后台刷新</Button>
            <Button appearance="text" onClick={() => load("empty")}>返回空数据</Button>
            <Button appearance="text" onClick={() => load("error")}>模拟读取失败</Button>
        </div>
        <p role="status" className="crab-loading-support crab-loading-status" data-skeleton-status>
            {refreshing ? "正在刷新，仍可查看上一批设备。" : placeholder ? "正在加载设备列表。"
                : result === "records" ? `已载入 ${devices.length} 台设备${revision ? ` · 第 ${revision} 次刷新` : ""}。`
                : result === "empty" ? "当前工作区没有设备。" : "请求失败，可重试。"}
        </p>
        <div className="crab-loading-surface crab-loading-list-surface" data-skeleton-surface aria-busy={busy}>
            {placeholder && <ul className="crab-loading-list" aria-hidden="true" data-skeleton-placeholder>
                {devices.map(({ id }) => <li key={id}>
                    <Skeleton variant="rect" width="2.2rem" height="2.2rem" animation={animation} />
                    <div className="crab-loading-skeleton-label">
                        <Skeleton variant="rect" width="min(10rem, 80%)" height=".8rem" animation={animation} />
                        <Skeleton variant="rect" width="min(7rem, 60%)" height=".65rem" animation={animation} />
                    </div>
                </li>)}
            </ul>}
            {!placeholder && result === "records" && <ul className="crab-loading-list" aria-label="设备列表" data-skeleton-records>
                {devices.map((device, index) => <li key={device.id}>
                    <span className="crab-loading-type-icon" aria-hidden="true">{device.glyph}</span>
                    <div>
                        <strong>{device.name}</strong>
                        <span className="crab-loading-support">{device.id} · {revision && index === 1 ? "已复核" : device.state}</span>
                    </div>
                </li>)}
            </ul>}
            {!placeholder && result === "empty" && <Empty role="group" title="暂无设备" imageSize={42}
                description="可切回首次加载，检查正常设备数据。" />}
            {!placeholder && result === "error" && <>
                <Alert role="group" aria-label="设备读取失败" type="error" title="设备台账请求失败">巡检服务没有返回可用数据。</Alert>
                <Button appearance="outlined" size="s" onClick={() => load("initial")}>重试读取设备</Button>
            </>}
        </div>
    </LoadingPrototype>;
}
