import { useId, useState } from "react";
import Prose, { type ProseSize } from "@crab-dev/rc-prose";
import Segmented from "@crab-dev/rc-segmented";
import { useConfig } from "@crab-dev/rc-config-provider";
import { ContentPrototype } from "./contentPrototype.js";

const readingSizes = [{ value: "base", label: "标准正文" }, { value: "lg", label: "较大正文" }];
const steps = [
    { key: "safe", title: "作业前确认" },
    { key: "readings", title: "采样检查表" },
    { key: "report", title: "记录格式" },
];

export default function ProsePrototype() {
    const { designSystem } = useConfig();
    const [size, setSize] = useState<ProseSize>("base");
    const articleId = useId();
    const sectionId = (name: string) => `${articleId}-${name}`;

    return <ContentPrototype route="prose" title="Prose 长文排版" description="阅读巡检手册，试用字号、章节跳转和可键盘滚动的宽内容。"
        scene="输水泵例行巡检手册" rules={[
            ["阅读结构", "标题、步骤、引用和表格连续使用各自语义。章节链接进入对应标题，可从那里继续沿正文操作。"],
            ["行宽", "正文保持适合阅读的列宽。放大字号时行数自然变化，段落内容完整可见。"],
            ["窄屏", "目录移到正文上方。宽表和代码分别在自己的区域滚动，可通过 Tab 进入并用方向键查看后半段。"],
            ["主题差异", "MD3 采用清晰的圆角信息表面，macOS 使用紧凑系统字面，shadcn/ui 以清楚的标题和中性描边保持文档节奏。"],
        ]}>
        <div className="crab-content-actions">
            <Segmented aria-label="阅读字号" options={readingSizes} value={size} onValueChange={(next) => {
                if (next === "base" || next === "lg") setSize(next);
            }} />
        </div>
        <div className="crab-content-reader-layout">
            <nav className="crab-content-toc" aria-label="手册目录">
                {steps.map(({ key, title }) => <a key={key} href={`#${sectionId(key)}`} onClick={(event) => {
                    event.currentTarget.ownerDocument.getElementById(sectionId(key))?.focus({ preventScroll: true });
                }}>{title}</a>)}
            </nav>
            <Prose as="article" size={size} aria-label="输水泵巡检流程" data-reading-size={size} data-reading-design={designSystem}>
                <p>本手册用于交接前的常规设备走查。先确认工作区，再核对远程仪表与现场面板的记录。</p>
                <h3 id={sectionId("safe")} tabIndex={-1} data-content-focus>作业前确认</h3>
                <ol>
                    <li>打开当班工作区，核对现场设备编号。</li>
                    <li>核对采样时间，标记需要复测的项目。</li>
                    <li>把需要现场确认的问题交给下一班。</li>
                </ol>
                <blockquote><p>发现读数和历史趋势不一致时，记录现场观察及时间，便于下一班对照。</p></blockquote>
                <h3 id={sectionId("readings")} tabIndex={-1} data-content-focus>采样检查表</h3>
                <div className="crab-content-scroll" tabIndex={0} role="region" aria-label="横向滚动采样检查表">
                    <table>
                        <caption>示例记录</caption>
                        <thead><tr><th scope="col">设备</th><th scope="col">巡检项目</th><th scope="col">时间</th><th scope="col">记录状态</th></tr></thead>
                        <tbody>
                            <tr><th scope="row">P-104</th><td>入口压力</td><td>14:20</td><td>完成核对</td></tr>
                            <tr><th scope="row">V-019</th><td>开度反馈</td><td>13:50</td><td>等待复测</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3 id={sectionId("report")} tabIndex={-1} data-content-focus>记录格式</h3>
                <p>使用 <code>recordId</code> 区分各次巡检，使历史记录能回到原设备。</p>
                <div className="crab-content-scroll" tabIndex={0} role="region" aria-label="横向滚动记录代码">
                    <pre><code>{'{\n  "recordId": "NORTH-INTAKE-PUMP-STATION-P104-INSPECTION-2026-11-24",\n  "result": "checked"\n}'}</code></pre>
                </div>
                <p><a href={`#${sectionId("safe")}`} onClick={(event) => {
                    event.currentTarget.ownerDocument.getElementById(sectionId("safe"))?.focus({ preventScroll: true });
                }}>回到作业前确认</a></p>
            </Prose>
        </div>
    </ContentPrototype>;
}
