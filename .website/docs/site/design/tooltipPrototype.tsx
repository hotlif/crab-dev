import { useState } from "react";
import { useConfig } from "@crab-dev/rc-config-provider";
import Button from "@crab-dev/rc-button";
import Tooltip from "@crab-dev/rc-tooltip";
import { FeedbackPrototype } from "./feedbackPrototype.js";

const reportPath = "/inspection/2026/line-07/report-and-device-history.csv";

export default function TooltipPrototype() {
    const { designSystem } = useConfig();
    const [runCount, setRunCount] = useState(0);
    const [fullPath, setFullPath] = useState(false);
    const [toolOpen, setToolOpen] = useState(false);
    const [pathOpen, setPathOpen] = useState(false);
    const hoverDelay = designSystem === "macos" ? 550 : 350;
    const arrow = designSystem === "shadcn";

    function togglePath() {
        setPathOpen(false);
        setFullPath((current) => !current);
    }

    return <FeedbackPrototype route="tooltip" title="Tooltip 辅助提示" description="对比鼠标、键盘和触屏如何取得同一条辅助说明。"
        scene="报告工具栏和长路径" rules={[
            ["指针与键盘", "鼠标停留后打开，可移入提示继续阅读。键盘聚焦时显示，Esc 关闭时焦点留在触发控件。"],
            ["内容边界", "纯图标独立提供名称“刷新报告”。提示补充它更新的数据范围。长路径提示只展示完整路径。"],
            ["触屏路径", "刷新按钮可直接点按。需要查看或复制完整路径时，点按路径或使用带文字的展开按钮。"],
            ["主题差异", "MD3 使用无箭头的短提示，macOS 延长悬停时长并采用轻描边，shadcn/ui 用高对比色和小箭头指明锚点。"],
        ]}>
        <div className="crab-feedback-two-col">
            <div className="crab-feedback-preview">
                <h3>报告工具栏</h3>
                <div className="crab-feedback-actions">
                    <Tooltip title="重新读取最近一次巡检数据。" mouseEnterDelay={hoverDelay} mouseLeaveDelay={330}
                        placement="bottom" arrow={arrow} open={toolOpen} onOpenChange={setToolOpen}>
                        <Button appearance="outlined" aria-label="刷新报告" onClick={() => {
                            setToolOpen(false);
                            setRunCount((count) => count + 1);
                        }}><span aria-hidden="true">↻</span></Button>
                    </Tooltip>
                    <p className="crab-feedback-support" role="status">{runCount ? `已刷新 ${runCount} 次` : "最近更新 · 09:20"}</p>
                </div>
            </div>
            <div className="crab-feedback-preview">
                <h3>导出位置</h3>
                <Tooltip title={reportPath} mouseEnterDelay={hoverDelay} mouseLeaveDelay={330} placement="bottom-start"
                    arrow={arrow} open={pathOpen} onOpenChange={setPathOpen}>
                    <Button appearance="outlined" className="crab-feedback-path-button" aria-label="报告路径"
                        aria-expanded={fullPath} aria-controls="prototype-full-path" onClick={togglePath}>
                        <span className="crab-feedback-truncated">{reportPath}</span>
                    </Button>
                </Tooltip>
                <Button appearance="text" aria-expanded={fullPath} aria-controls="prototype-full-path" onClick={togglePath}>
                    {fullPath ? "收起完整路径" : "查看完整路径"}
                </Button>
                <p id="prototype-full-path" className="crab-feedback-full-path" hidden={!fullPath}>{reportPath}</p>
            </div>
        </div>
    </FeedbackPrototype>;
}
