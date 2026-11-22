import { useId, useState } from "react";
import Button from "@crab-dev/rc-button";
import Checkbox from "@crab-dev/rc-checkbox";
import { useConfig } from "@crab-dev/rc-config-provider";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./checkboxPrototype.styles.js";

const exportTasks = [
    { id: "summary", title: "设备巡检结果", detail: "本次巡检的读数、判定和记录时间", format: "CSV" },
    { id: "incidents", title: "异常与处理记录", detail: "异常原因、处理状态和负责人", format: "XLSX" },
    { id: "photos", title: "巡检附件与现场照片，包含用于跨班组交接的原始图片、标注和补充说明", detail: "按设备和巡检时间归档", format: "ZIP" },
    { id: "archive", title: "历史归档附件", detail: "需要归档导出权限", format: "ZIP", unavailable: true },
];
const availableTasks = exportTasks.filter(task => !task.unavailable);
const designs = {
    md3: {
        queue: "巡检导出队列",
        description: "在巡检工作台勾选要导出的资料，体验部分选中、状态层和整行触控。",
        decision: "使用宽行选择区和圆角色调表面。选中项使用浅色调表面配合实心勾记，鼠标状态层与键盘焦点分别呈现。",
        size: "medium",
    },
    macos: {
        queue: "导出项目",
        description: "在导出面板选择报告、记录和附件，再预览已选项目的清单。",
        decision: "全选复选框位于组首，子项向内缩进。用强调色和勾记表示选择，底部同一行展示已选数量和预览操作。",
        size: "small",
    },
    shadcn: {
        queue: "选择导出内容",
        description: "在资料导出表单里勾选独立选项，检查清晰的分组、长标签与汇总反馈。",
        decision: "每项使用单独的边框和两级文字。选中时加重中性色边框，键盘操作使用独立焦点环，禁用原因保持可读。",
        size: "medium",
    },
} as const;

export default function CheckboxPrototype() {
    const { designSystem } = useConfig();
    const design = designs[designSystem];
    const href = useSiteHref();
    const id = useId();
    const [selectedIds, setSelectedIds] = useState<string[]>(["summary"]);
    const [showPreview, setShowPreview] = useState(false);
    const selectedTasks = availableTasks.filter(task => selectedIds.includes(task.id));
    const allSelected = selectedTasks.length === availableTasks.length;
    const partiallySelected = selectedTasks.length > 0 && !allSelected;
    const masterState = allSelected ? "已全选" : partiallySelected ? "部分选中" : "未选择";

    function selectTask(taskId: string, checked: boolean) {
        setSelectedIds(current => checked ? Array.from(new Set([...current, taskId])) : current.filter(selectedId => selectedId !== taskId));
        setShowPreview(false);
    }

    function toggleAll() {
        setSelectedIds(current => current.length === availableTasks.length ? [] : availableTasks.map(task => task.id));
        setShowPreview(false);
    }

    return <div className="crab-design-workspace" data-checkbox-prototype data-prototype-design={designSystem}>
        <DesignHero section="组件原型" title="Checkbox 复选框" description={design.description}>
            <nav className="crab-design-jump-links" aria-label="原型章节">
                <a href="#checkbox-export">导出任务</a>
                <a href="#checkbox-states">状态与键盘</a>
                <a href="#checkbox-rules">交互规则</a>
            </nav>
        </DesignHero>
        <div className="crab-design-body">
            <section id="checkbox-export" aria-labelledby="checkbox-export-title">
                <div className="crab-design-section-head"><h2 id="checkbox-export-title">导出任务</h2></div>
                <div className="crab-checkbox-board">
                    <div className="crab-checkbox-queue" role="group" aria-labelledby={`${id}-queue`} aria-describedby={`${id}-scope`}>
                        <header className="crab-checkbox-queue-heading">
                            <h3 id={`${id}-queue`}>{design.queue}</h3>
                            <p id={`${id}-scope`}>全选适用于当前有权限导出的项目。</p>
                        </header>
                        <Checkbox className="crab-checkbox-option crab-checkbox-master" size={design.size}
                            checked={allSelected} indeterminate={partiallySelected} onCheckedChange={toggleAll}
                            aria-labelledby={`${id}-all-label`}
                            aria-controls={availableTasks.map(task => `${id}-${task.id}`).join(" ")}>
                            <span className="crab-checkbox-option-content">
                                <span id={`${id}-all-label`} className="crab-checkbox-name">全选可导出任务</span>
                                <span className="crab-checkbox-meta" aria-hidden="true">{masterState}</span>
                            </span>
                        </Checkbox>
                        <ul className="crab-checkbox-tasks" role="list">
                            {exportTasks.map(task => <li key={task.id}>
                                <Checkbox id={`${id}-${task.id}`} className="crab-checkbox-option" size={design.size}
                                    checked={selectedIds.includes(task.id)} onCheckedChange={checked => selectTask(task.id, checked)}
                                    disabled={task.unavailable} aria-labelledby={`${id}-${task.id}-label`}
                                    aria-describedby={`${id}-${task.id}-detail ${id}-${task.id}-format`}>
                                    <span className="crab-checkbox-option-content">
                                        <span className="crab-checkbox-copy">
                                            <span id={`${id}-${task.id}-label`} className="crab-checkbox-name">{task.title}</span>
                                            <span id={`${id}-${task.id}-detail`} className="crab-checkbox-detail">{task.detail}</span>
                                        </span>
                                        <span id={`${id}-${task.id}-format`} className="crab-checkbox-meta">{task.format}</span>
                                    </span>
                                </Checkbox>
                            </li>)}
                        </ul>
                    </div>
                    <aside className="crab-checkbox-summary" aria-labelledby={`${id}-summary`}>
                        <h3 id={`${id}-summary`}>导出清单</h3>
                        <p className="crab-checkbox-count" role="status">
                            {showPreview ? "清单已生成，" : ""}已选 {selectedTasks.length} / {availableTasks.length} 项
                        </p>
                        {showPreview && <ul className="crab-checkbox-receipt" role="list" aria-label="选中的导出任务">
                            {selectedTasks.map(task => <li key={task.id}><span>{task.title}</span><small>{task.format}</small></li>)}
                        </ul>}
                        <Button appearance="primary" disabled={selectedTasks.length === 0}
                            onClick={() => setShowPreview(true)}>预览导出清单</Button>
                    </aside>
                </div>
            </section>
            <section id="checkbox-states" aria-labelledby="checkbox-states-title">
                <div className="crab-design-section-head"><h2 id="checkbox-states-title">状态与键盘</h2></div>
                <div className="crab-checkbox-samples">
                    <div><h3>默认未选</h3><Checkbox size={design.size}>附上汇总说明</Checkbox></div>
                    <div><h3>默认已选</h3><Checkbox size={design.size} defaultChecked>保留原始编号</Checkbox></div>
                    <div><h3>禁用且已选</h3><Checkbox size={design.size} disabled defaultChecked>保留审计标识</Checkbox></div>
                </div>
                <p className="crab-checkbox-instructions">按 Tab 移到复选框，再按空格切换。上方的全选复选框展示部分选中，禁用样本可用于核对焦点跳过规则。</p>
            </section>
            <section id="checkbox-rules" aria-labelledby="checkbox-rules-title">
                <div className="crab-design-section-head"><h2 id="checkbox-rules-title">交互规则</h2></div>
                <div className="crab-checkbox-rules">
                    <p>{design.decision}</p>
                    <dl>
                        <dt>用途</dt><dd>在清单中独立选择任意多项，随后统一确认。互斥选项适合 Radio，即时设置适合 Switch。</dd>
                        <dt>全选</dt><dd>无可选任务被选中时显示空框，选中一部分时显示短横线，全部选中时显示勾。点击空框或短横线选中所有可导出项，点击勾取消全选。</dd>
                        <dt>禁用项</dt><dd>在行内说明不可选的原因。禁用项跳过键盘焦点，排除在全选、计数和导出清单之外。</dd>
                        <dt>命中与焦点</dt><dd>复选框和整行文字共享命中区，长标签换行后依旧可点。用 Tab 导航，用空格切换，操作后焦点留在原控件。</dd>
                        <dt>动效</dt><dd>切换状态时保持方框和文字的位置。减少动态效果时直接呈现最终状态，同时保留可见焦点。</dd>
                    </dl>
                </div>
            </section>
            <div><Button appearance="text" href={href("components/rc-checkbox")}>查看 Checkbox 组件文档 →</Button></div>
        </div>
    </div>;
}
