import Alert from "@crab-dev/rc-alert";
import Avatar, { AvatarGroup } from "@crab-dev/rc-avatar";
import Button from "@crab-dev/rc-button";
import Card from "@crab-dev/rc-card";
import Checkbox, { CheckboxGroup } from "@crab-dev/rc-checkbox";
import ColorPicker, { type OKLCHValue } from "@crab-dev/rc-color-picker";
import ConfigProvider, {
    type ConfigSize,
    type ConfigTheme,
} from "@crab-dev/rc-config-provider";
import { DatePicker } from "@crab-dev/rc-date-picker";
import LineEdit from "@crab-dev/rc-line-edit";
import Radio, { RadioGroup } from "@crab-dev/rc-radio";
import Segmented, { type SegmentedValue } from "@crab-dev/rc-segmented";
import Select from "@crab-dev/rc-select";
import Slider from "@crab-dev/rc-slider";
import Switch from "@crab-dev/rc-switch";
import Tag from "@crab-dev/rc-tag";
import { useState } from "react";

const brandColors = {
    紫罗兰: "#6750a4",
    葡萄紫: "#7c3aed",
    靛青: "#4f46e5",
} as const;

type BrandName = keyof typeof brandColors;

const selectOptions = [
    { label: "设计系统", value: "design" },
    { label: "数据应用", value: "data" },
    { label: "业务后台", value: "admin" },
];

function toBrandName(value: SegmentedValue): BrandName {
    return typeof value === "string" && value in brandColors ? value as BrandName : "紫罗兰";
}

function toTheme(value: SegmentedValue): ConfigTheme {
    return value === "dark" ? "dark" : "light";
}

function toSize(value: SegmentedValue): ConfigSize {
    return value === "small" || value === "large" ? value : "middle";
}

export default function HomeComponentShowcase() {
    const [theme, setTheme] = useState<ConfigTheme>("light");
    const [brandName, setBrandName] = useState<BrandName>("紫罗兰");
    const [size, setSize] = useState<ConfigSize>("middle");
    const [name, setName] = useState("Crab Design");
    const [projects, setProjects] = useState(["design", "data"]);
    const [date, setDate] = useState<Temporal.ZonedDateTime | null>(null);
    const [color, setColor] = useState<OKLCHValue>({
        lightness: 0.58,
        chroma: 0.2,
        hue: 295,
        alpha: 1,
    });
    const [channels, setChannels] = useState<Array<string | number>>(["product", "design"]);
    const [frequency, setFrequency] = useState<string | number>("weekly");
    const [notifications, setNotifications] = useState(true);
    const [view, setView] = useState<SegmentedValue>("概览");
    const [progress, setProgress] = useState(68);
    const [message, setMessage] = useState("所有组件均使用当前局部主题。切换设置即可实时预览。");

    return (
        <section className="crab-home-demo" aria-labelledby="component-wall-title">
            <header className="crab-home-section-heading crab-home-demo-heading">
                <div>
                    <span className="crab-home-eyebrow">组件能力墙</span>
                    <h2 id="component-wall-title">真实组件，组合出完整体验。</h2>
                    <p className="crab-home-section-note">输入、选择、状态和反馈都可以直接操作，局部设置不会改变文档站主题。</p>
                </div>
                <div className="crab-home-theme-controls" aria-label="组件能力墙主题设置">
                    <label>
                        <span>主题</span>
                        <Segmented
                            size="small"
                            options={[{ label: "亮色", value: "light" }, { label: "暗色", value: "dark" }]}
                            value={theme}
                            onChange={(value) => setTheme(toTheme(value))}
                        />
                    </label>
                    <label>
                        <span>尺寸</span>
                        <Segmented
                            size="small"
                            options={[{ label: "小", value: "small" }, { label: "中", value: "middle" }, { label: "大", value: "large" }]}
                            value={size}
                            onChange={(value) => setSize(toSize(value))}
                        />
                    </label>
                    <label>
                        <span>品牌色</span>
                        <Segmented
                            size="small"
                            options={Object.keys(brandColors)}
                            value={brandName}
                            onChange={(value) => setBrandName(toBrandName(value))}
                        />
                    </label>
                </div>
            </header>
            <ConfigProvider
                className="crab-home-demo-surface"
                theme={theme}
                size={size}
                brandColor={brandColors[brandName]}
            >
                <div className="crab-home-component-wall">
                    <div className="crab-home-component-column">
                        <Card variant="elevated" title="创建工作区" extra={<Tag color="primary" bordered={false}>表单</Tag>}>
                            <div className="crab-home-control-stack">
                                <label className="crab-home-field">
                                    <span>工作区名称</span>
                                    <LineEdit
                                        value={name}
                                        allowClear
                                        maxLength={24}
                                        onClear={() => setName("")}
                                        onChange={(event) => setName(event.target.value)}
                                    />
                                </label>
                                <label className="crab-home-field">
                                    <span>应用类型</span>
                                    <Select
                                        multiple
                                        allowClear
                                        maxTagCount={2}
                                        options={selectOptions}
                                        value={projects}
                                        onChange={setProjects}
                                    />
                                </label>
                                <div className="crab-home-inline-fields">
                                    <label className="crab-home-field">
                                        <span>计划日期</span>
                                        <DatePicker
                                            value={date}
                                            onValueChange={setDate}
                                            renderDisplayString={(value) => value?.toPlainDate().toString() ?? ""}
                                        />
                                    </label>
                                    <label className="crab-home-field crab-home-color-field">
                                        <span>强调色</span>
                                        <ColorPicker
                                            value={color}
                                            format="hex"
                                            showAlpha={false}
                                            onValueChange={(value) => value && setColor(value)}
                                        />
                                    </label>
                                </div>
                                <Button
                                    appearance="primary"
                                    shouldFitContainer
                                    disabled={!name.trim() || projects.length === 0}
                                    onClick={() => setMessage(`“${name.trim()}”工作区已在本地示例中创建。`)}
                                >
                                    创建工作区
                                </Button>
                            </div>
                        </Card>
                        <Card variant="filled" title="发布进度" extra={<strong>{progress}%</strong>}>
                            <div className="crab-home-control-stack">
                                <Slider
                                    value={progress}
                                    min={0}
                                    max={100}
                                    step={1}
                                    aria-label="发布进度"
                                    onValueChange={setProgress}
                                />
                                <div className="crab-home-status-row">
                                    <span><span className="crab-home-status-dot" aria-hidden="true" />自动检查</span>
                                    <Tag color={progress === 100 ? "success" : "warning"}>{progress === 100 ? "已完成" : "进行中"}</Tag>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="crab-home-component-column">
                        <Card variant="elevated" title="团队协作">
                            <div className="crab-home-control-stack">
                                <div className="crab-home-team-row">
                                    <AvatarGroup max={4} size="large" aria-label="项目成员">
                                        <Avatar variant="primary">林</Avatar>
                                        <Avatar variant="success">周</Avatar>
                                        <Avatar variant="warning">陈</Avatar>
                                        <Avatar variant="error">许</Avatar>
                                        <Avatar>吴</Avatar>
                                        <Avatar variant="primary">+1</Avatar>
                                    </AvatarGroup>
                                    <span>6 位成员在线</span>
                                </div>
                                <fieldset className="crab-home-fieldset">
                                    <legend>参与频道</legend>
                                    <CheckboxGroup value={channels} onChange={setChannels}>
                                        <Checkbox value="product">产品</Checkbox>
                                        <Checkbox value="design">设计</Checkbox>
                                        <Checkbox value="engineering">研发</Checkbox>
                                    </CheckboxGroup>
                                </fieldset>
                                <fieldset className="crab-home-fieldset">
                                    <legend>摘要频率</legend>
                                    <RadioGroup value={frequency} onChange={setFrequency} aria-label="摘要频率">
                                        <Radio value="daily">每天</Radio>
                                        <Radio value="weekly">每周</Radio>
                                    </RadioGroup>
                                </fieldset>
                                <div className="crab-home-switch-row">
                                    <span><strong>消息提醒</strong><small>仅发送与你有关的更新</small></span>
                                    <Switch
                                        checked={notifications}
                                        aria-label="消息提醒"
                                        onChange={setNotifications}
                                    >
                                        {notifications ? "开" : "关"}
                                    </Switch>
                                </div>
                            </div>
                        </Card>
                        <Alert type="success" title="设计令牌已同步" showIcon>
                            颜色、间距和圆角已更新到当前预览。
                        </Alert>
                    </div>
                    <div className="crab-home-component-column">
                        <Card variant="elevated" className="crab-home-account-card">
                            <div className="crab-home-account-mark" aria-hidden="true">C</div>
                            <h3>欢迎使用 Crab UI</h3>
                            <p>用一致的组件和设计令牌，更快构建企业应用。</p>
                            <Button appearance="primary" shouldFitContainer onClick={() => setMessage("欢迎回来，交互示例已准备就绪。")}>立即开始</Button>
                            <div className="crab-home-divider"><span>或者</span></div>
                            <Button shouldFitContainer onClick={() => setMessage("已切换到团队工作区示例。")}>进入团队工作区</Button>
                        </Card>
                        <Card variant="filled" title="视图设置">
                            <div className="crab-home-control-stack">
                                <Segmented block options={["概览", "任务", "成员"]} value={view} onChange={setView} />
                                <div className="crab-home-tag-row" aria-label="当前状态">
                                    <Tag color="success">运行正常</Tag>
                                    <Tag color="primary">{String(view)}</Tag>
                                    <Tag>{channels.length} 个频道</Tag>
                                </div>
                                <div className="crab-home-button-row">
                                    <Button appearance="primary" onClick={() => setMessage("修改已保存到本地示例。")}>保存</Button>
                                    <Button appearance="danger" onClick={() => setMessage("已撤销本地示例中的修改。")}>撤销</Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                <output className="crab-home-demo-feedback" aria-live="polite">{message}</output>
            </ConfigProvider>
        </section>
    );
}
