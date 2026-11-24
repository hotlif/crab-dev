import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Button from "@crab-dev/rc-button";
import Checkbox from "@crab-dev/rc-checkbox";
import { useConfig } from "@crab-dev/rc-config-provider";
import LineEdit from "@crab-dev/rc-line-edit";
import Select from "@crab-dev/rc-select";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./fieldWorkflow.styles.js";

const equipment = [
    { value: "pump", label: "离心泵" },
    { value: "valve", label: "电动调节阀" },
    { value: "monitor", label: "远程振动监测与故障预警采集终端" },
    { value: "legacy", label: "旧式压力变送器（已停用）", disabled: true },
];

const statuses = [
    { value: "online", label: "运行正常" },
    { value: "service", label: "运行中，等待现场维护窗口确认" },
    { value: "offline", label: "通讯中断" },
    { value: "alarm", label: "告警待处理" },
];

const equipmentRows = [
    { id: "P-104", name: "北区输水泵", type: "pump", status: "online" },
    { id: "P-207", name: "西区循环泵", type: "pump", status: "service" },
    { id: "V-019", name: "二号线进水阀", type: "valve", status: "offline" },
    { id: "M-032", name: "三号线设备监测终端", type: "monitor", status: "alarm" },
];

const designs = {
    md3: {
        size: "medium",
        button: "tonal",
        note: "设备类型使用 MD3 描边字段和浮动标签。状态筛选以着色复选框显示已选值，读数与查询反馈独立放置。",
    },
    macos: {
        size: "small",
        button: "outlined",
        note: "设备类型使用紧凑的弹出式单选。状态筛选在相邻面板呈现，标签和字段对齐，保留桌面设置的密度。",
    },
    shadcn: {
        size: "medium",
        button: "outlined",
        note: "设备类型和状态筛选使用轻描边与简洁的圆角。查询反馈与结果共用列表区域，焦点环保持可见。",
    },
} as const;

type SearchRequest = { query: string; fails: boolean };
type SearchResult = { request: SearchRequest; matches: typeof statuses | null };

export default function SelectPrototype() {
    const { designSystem } = useConfig();
    const design = designs[designSystem];
    const href = useSiteHref();
    const panelId = useId();
    const [equipmentType, setEquipmentType] = useState<string | null>(null);
    const [selected, setSelected] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [failNextSearch, setFailNextSearch] = useState(false);
    const [request, setRequest] = useState<SearchRequest>({ query: "", fails: false });
    const [result, setResult] = useState<SearchResult | null>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const search = useRef<HTMLInputElement>(null);
    const matches = result?.request === request ? result.matches : undefined;
    const failed = matches === null;
    const pending = matches === undefined;

    useEffect(() => {
        if (!open || result?.request === request) return;
        const timer = window.setTimeout(() => {
            const query = request.query.trim().toLocaleLowerCase();
            setResult({
                request,
                matches: request.fails ? null : statuses.filter(status =>
                    status.label.includes(query) || status.value.includes(query)),
            });
        }, 550);
        return () => window.clearTimeout(timer);
    }, [open, request, result]);

    useEffect(() => {
        if (open) search.current?.focus();
    }, [open]);

    function queryStatuses(query: string) {
        setRequest({ query, fails: failNextSearch });
        setFailNextSearch(false);
    }

    function closeFilters() {
        setOpen(false);
        trigger.current?.focus();
    }

    function handleFilterKey(event: KeyboardEvent<HTMLElement>) {
        if (event.key !== "Escape" || event.nativeEvent.isComposing || !open) return;
        event.preventDefault();
        event.stopPropagation();
        closeFilters();
    }

    const rows = equipmentRows.filter(row => (!equipmentType || row.type === equipmentType) &&
        (selected.length === 0 || selected.includes(row.status)));

    return <div className="crab-design-workspace crab-field-workflow" data-select-prototype data-prototype-design={designSystem}>
        <DesignHero section="组件原型" title="Select 选择器"
            description="按设备类型和运行状态筛选设备台账，试用搜索、选中、清空和失败重试。" />
        <div className="crab-design-body">
            <section aria-labelledby="select-workflow-title">
                <div className="crab-design-section-head"><h2 id="select-workflow-title">北区设备台账</h2></div>
                <div className="crab-field-workflow-layout">
                    <div className="crab-field-workflow-panel crab-field-workflow-scene">
                        <div className="crab-field-workflow-filter">
                            <Select label="设备类型" aria-label="设备类型" placeholder="全部设备"
                                size={design.size} appearance="outlined" value={equipmentType}
                                options={equipment} onValueChange={setEquipmentType} allowClear />
                            <div className="crab-field-workflow-filter-actions">
                                <Button ref={trigger} size="s" appearance={design.button} aria-expanded={open} aria-controls={open ? panelId : undefined}
                                    onKeyDown={handleFilterKey}
                                    iconAfter={<span aria-hidden="true">{open ? "▴" : "▾"}</span>}
                                    onClick={() => { if (open) closeFilters(); else setOpen(true); }}>
                                    {selected.length === 0 ? "运行状态" : `运行状态（${selected.length}）`}
                                </Button>
                                {selected.length > 0 && <Button size="s" appearance="text" onClick={() => {
                                    setSelected([]);
                                    if (!open) trigger.current?.focus();
                                    else search.current?.focus();
                                }}>清空状态</Button>}
                            </div>
                        </div>
                        {open && <section id={panelId} className="crab-field-workflow-search" aria-label="筛选运行状态" onKeyDown={handleFilterKey}>
                            <LineEdit ref={search} label="搜索状态" aria-label="搜索状态" placeholder="例如：运行"
                                size={design.size} appearance="outlined" value={request.query} onValueChange={queryStatuses} allowClear />
                            <p role="status" aria-atomic="true" className="crab-field-workflow-support">
                                {pending ? "正在搜索状态…" : failed ? "状态加载失败，已保留搜索词和筛选。" :
                                    matches.length === 0 ? "没有匹配的状态。" : `找到 ${matches.length} 个状态。`}
                            </p>
                            {failed && <Button size="s" appearance="outlined" onClick={() => {
                                setRequest({ query: request.query, fails: false });
                                search.current?.focus();
                            }}>重试查询</Button>}
                            {matches && matches.length > 0 && <div className="crab-field-workflow-option-list" role="group" aria-label="匹配的状态">
                                {matches.map(status => <Checkbox key={status.value} checked={selected.includes(status.value)}
                                    onCheckedChange={checked => setSelected(current => checked
                                        ? [...current, status.value] : current.filter(value => value !== status.value))}>
                                    {status.label}
                                </Checkbox>)}
                            </div>}
                            <Button size="s" appearance="text" onClick={closeFilters}>收起状态筛选</Button>
                        </section>}
                        {selected.length > 0 && <p className="crab-field-workflow-support" data-select-filters>
                            已筛选 {statuses.filter(status => selected.includes(status.value)).map(status => status.label).join("、")}
                        </p>}
                        <div className="crab-field-workflow-result">
                            <p role="status" aria-atomic="true" className="crab-field-workflow-support">显示 {rows.length} 台设备</p>
                            {rows.length > 0 ? <ul className="crab-field-workflow-rows" role="list" aria-label="匹配的设备">
                                {rows.map(row => <li key={row.id}>
                                    <div><strong>{row.name}</strong><span>{row.id}</span></div>
                                    <span>{statuses.find(status => status.value === row.status)?.label}</span>
                                </li>)}
                            </ul> : <p>当前筛选下没有设备。</p>}
                        </div>
                    </div>
                    <aside className="crab-field-workflow-panel crab-field-workflow-aside" aria-labelledby="select-search-exercise">
                        <h3 id="select-search-exercise">试用异步查询</h3>
                        <p>输入「运行」查看结果，输入「库存」查看无匹配。触发失败后，用原搜索词重试。</p>
                        <Button size="s" appearance="outlined" aria-pressed={failNextSearch}
                            onClick={() => setFailNextSearch(!failNextSearch)}>下次搜索返回错误</Button>
                        <p role="status" className="crab-field-workflow-support">
                            {failNextSearch ? "下一次修改搜索词会收到错误。" : "搜索使用模拟的设备状态数据。"}
                        </p>
                    </aside>
                </div>
            </section>
            <section aria-labelledby="select-rules-title">
                <div className="crab-design-section-head"><h2 id="select-rules-title">交互规则</h2></div>
                <div className="crab-field-workflow-panel crab-field-workflow-rules">
                    <p>{design.note}</p>
                    <dl>
                        <dt>设备类型</dt><dd>少量互斥选项用单选。方向键定位选项，Enter 确认，Escape 收起并保留旧值。清除后显示全部设备。</dd>
                        <dt>状态筛选</dt><dd>打开时焦点进入搜索框。Tab 移动到复选项，空格勾选。选中立即筛选台账，选择可跨搜索保留。</dd>
                        <dt>关闭与重试</dt><dd>Escape 或收起动作将焦点还给触发按钮。重试保留搜索词并将焦点移回搜索框，旧查询不会覆盖新结果。</dd>
                        <dt>名称与空间</dt><dd>结果行显示完整的状态名称。窄屏分行排列；设备类型菜单利用视口空间安置。</dd>
                    </dl>
                    <Button appearance="text" href={href("components/rc-select")}>查看 Select 组件文档</Button>
                </div>
            </section>
        </div>
    </div>;
}
