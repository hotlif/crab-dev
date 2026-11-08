import { useState } from "react";
import Button from "@crab-dev/rc-button";
import Card from "@crab-dev/rc-card";
import LineEdit from "@crab-dev/rc-line-edit";
import Switch from "@crab-dev/rc-switch";
import Tag from "@crab-dev/rc-tag";
import Segmented from "@crab-dev/rc-segmented";

export default function HeroPreview() {
    const [name, setName] = useState("Design workspace");
    const [collaboration, setCollaboration] = useState(true);
    const [view, setView] = useState<string | number>("概览");
    const [message, setMessage] = useState("试着修改名称，创建你的第一个项目。");
    return (
        <div className="crab-home-hero-preview" role="region" aria-label="交互组件预览">
            <div className="crab-home-preview-caption"><span><span className="crab-home-status-dot" aria-hidden="true" />COMPONENTS IN ACTION</span><span>交互预览</span></div>
            <Card variant="outlined" title="创建工作区" extra={<Tag color="primary" bordered={false}>实时预览</Tag>}>
                <div className="crab-home-preview-form">
                    <p className="crab-home-secondary">从一个小小的工作区开始。</p>
                    <LineEdit label="示例项目名称" value={name} maxLength={40} onValueChange={setName} />
                    <div className="crab-home-preview-option">
                        <div><strong>团队协作</strong><p>让灵感在团队中流动。</p></div>
                        <Switch aria-label="允许团队协作" checked={collaboration} onCheckedChange={setCollaboration} />
                    </div>
                    <Button appearance="primary" disabled={!name.trim()} onClick={() => setMessage(`已创建「${name.trim()}」，${collaboration ? "团队协作已开启" : "仅自己可见"}。`)}>
                        创建项目 <span aria-hidden="true">↗</span>
                    </Button>
                    <p className="crab-home-preview-status" role="status">{message}</p>
                </div>
            </Card>
            <div className="crab-home-preview-notes">
                <div className="crab-home-preview-note">
                    <span className="crab-home-note-label">状态与反馈</span>
                    <Tag color="success" bordered={false}>设计已同步</Tag>
                    <span>颜色、形状、动效，自然一致。</span>
                </div>
                <div className="crab-home-preview-note">
                    <span className="crab-home-note-label">试试切换视图</span>
                    <Segmented size="small" aria-label="示例视图" options={["概览", "活动"]} value={view} onValueChange={setView} />
                    <span>{view === "概览" ? "当前主题，即刻预览。" : "刚刚 · 切换了示例视图。"}</span>
                </div>
            </div>
            <div className="crab-home-preview-caption"><span>真实组件 · 当前主题</span><span aria-hidden="true">↗</span></div>
        </div>
    );
}
