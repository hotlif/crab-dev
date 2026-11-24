import { type FormEvent, useEffect, useRef, useState } from "react";
import Alert from "@crab-dev/rc-alert";
import Button from "@crab-dev/rc-button";
import Empty from "@crab-dev/rc-empty";
import LineEdit from "@crab-dev/rc-line-edit";
import Segmented from "@crab-dev/rc-segmented";
import Spin from "@crab-dev/rc-spin";
import { useConfig } from "@crab-dev/rc-config-provider";
import { LoadingPrototype } from "./loadingPrototype.js";

type Scenario = "new" | "search" | "failure";
const scenarios = [
    { value: "new", label: "空项目" },
    { value: "search", label: "搜索无结果" },
    { value: "failure", label: "加载失败" },
];
const sampleDevices = ["北区输水泵", "回流管压力表"];

export default function EmptyPrototype() {
    const { designSystem } = useConfig();
    const [scenario, setScenario] = useState<Scenario>("new");
    const [query, setQuery] = useState("");
    const [addedDevices, setAddedDevices] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [adding, setAdding] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [request, setRequest] = useState<"error" | "loading" | "done">("error");
    const fieldRef = useRef<HTMLInputElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const retryRef = useRef<HTMLButtonElement>(null);
    const resultsRef = useRef<HTMLHeadingElement>(null);
    const focusResults = useRef(false);
    const records = scenario === "new" ? addedDevices : sampleDevices.filter((device) => device.includes(query.trim()));
    const showResults = records.length > 0 && (scenario !== "failure" || request === "done");

    useEffect(() => {
        if (adding) fieldRef.current?.focus();
    }, [adding]);

    useEffect(() => {
        if (showResults && focusResults.current) {
            focusResults.current = false;
            resultsRef.current?.focus();
        }
    }, [showResults]);

    useEffect(() => {
        if (scenario !== "failure" || request !== "loading") return;
        const timer = setTimeout(() => {
            focusResults.current = retryRef.current?.ownerDocument.activeElement === retryRef.current;
            setRequest("done");
        }, 900);
        return () => clearTimeout(timer);
    }, [scenario, request]);

    function select(value: string | number) {
        if (value !== "new" && value !== "search" && value !== "failure") return;
        setScenario(value);
        setAdding(false);
        setName("");
        setInputError(false);
        setQuery(value === "search" ? "东区" : "");
        setRequest("error");
    }

    function add(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const proposed = name.trim();
        if (!proposed) {
            setInputError(true);
            fieldRef.current?.focus();
            return;
        }
        focusResults.current = true;
        setAddedDevices((devices) => [...devices, proposed]);
        setAdding(false);
    }

    return <LoadingPrototype route="empty" title="Empty 空状态" description="从空项目、无匹配和加载失败分别恢复设备列表。"
        scene="泵站设备目录" rules={[
            ["空项目", "项目请求成功且还没有设备时，提供添加第一台设备。输入成功后焦点移到设备列表标题。"],
            ["无匹配", "保留搜索词与输入框，清除筛选后回到搜索框，可继续查找。"],
            ["加载失败", "提供具体故障原因和重试入口。重试期间显示等待，完成后进入返回的设备列表。"],
            ["主题差异", "MD3 保留清楚的空态图形和主动作，macOS 缩小留白与图形，shadcn/ui 使用紧凑的描边区域。"],
        ]}>
        <div className="crab-loading-actions">
            <Segmented aria-label="空状态场景" options={scenarios} value={scenario} onValueChange={select} />
        </div>
        {scenario === "search" && <LineEdit ref={searchRef} label="搜索设备" value={query} onValueChange={setQuery} />}
        <div className="crab-loading-surface">
            {showResults && <>
                <h3 tabIndex={-1} ref={resultsRef}>设备列表</h3>
                <ul className="crab-loading-list" aria-label="设备列表">
                    {records.map((device, index) => <li key={`${device}-${index}`}><span className="crab-loading-type-icon" aria-hidden="true">设</span><strong>{device}</strong></li>)}
                </ul>
            </>}
            {scenario === "new" && !showResults && !adding && <Empty title="还没有设备" imageSize={designSystem === "md3" ? 68 : 48}
                description="添加设备后，可在这里查看状态和历史巡检记录。"
                action={<Button appearance="primary" onClick={() => setAdding(true)}>添加第一台设备</Button>} />}
            {adding && <form className="crab-loading-content" onSubmit={add}>
                <LineEdit ref={fieldRef} label="设备名称" value={name} onValueChange={setName} errorText={inputError ? "请输入设备名称。" : undefined} />
                <div className="crab-loading-actions"><Button type="submit" appearance="primary">创建设备</Button></div>
            </form>}
            {scenario === "search" && !showResults && <Empty preset="search" title="没有匹配的设备"
                imageSize={designSystem === "md3" ? 68 : 48} description={`没有找到包含“${query.trim()}”的设备。`}
                action={<Button appearance="outlined" onClick={() => { setQuery(""); searchRef.current?.focus(); }}>清除搜索条件</Button>} />}
            {scenario === "failure" && request !== "done" && <>
                {request === "error" && <Alert role="group" aria-label="加载失败" type="error" title="暂时无法读取设备列表">现场网关连接超时。可在连接恢复后重试。</Alert>}
                {request === "loading" && <Spin tip="正在重新读取设备列表" />}
                <Button ref={retryRef} appearance="primary" loading={request === "loading"} onClick={() => setRequest("loading")}>重新加载</Button>
            </>}
        </div>
        <p role="status" className="crab-loading-support crab-loading-status">
            {showResults ? `${records.length} 台设备` : scenario === "failure" && request === "error" ? "设备列表未返回。" : ""}
        </p>
    </LoadingPrototype>;
}
