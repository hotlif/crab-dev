import { useId, useState, type FormEvent } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import Radio, { RadioGroup } from "@crab-dev/rc-radio";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./radioPrototype.styles.js";

const startupOptions = [
    { value: "restore", title: "恢复上次会话", detail: "重新打开上次使用的项目、标签页和面板。" },
    { value: "blank", title: "打开空白工作区", detail: "从空白视图开始，之后可以手动打开项目。" },
    { value: "managed", title: "使用团队预设", detail: "需要管理员授权才能载入团队维护的布局。", disabled: true },
] as const;

const viewOptions = [
    { value: "overview", title: "项目总览" },
    { value: "recent", title: "最近项目" },
] as const;

const designs = {
    md3: {
        size: "medium",
        decision: "用色调表面组织启动设置，圆环和圆点表示选择。悬停和按下使用圆形状态层，键盘焦点有独立轮廓。",
    },
    macos: {
        size: "small",
        decision: "标签排在小圆盘右侧，选项按同一基线纵向成组。当前生效项和保存操作集中在面板底部，选中项用强调色圆盘和对比圆点表示。",
    },
    shadcn: {
        size: "medium",
        decision: "每个长说明选项使用独立的中性描边容器，选中时加深描边。短标签横排，使用圆点和焦点环区分选择与键盘焦点。",
    },
} as const;

interface RadioOption {
    value: string;
    title: string;
    detail?: string;
    disabled?: boolean;
}

interface RadioChoicesProps {
    options: readonly RadioOption[];
    name: string;
    labelId: string;
    helpId: string;
    size: "small" | "medium";
    value: string | number;
    onValueChange: (value: string | number) => void;
    required?: boolean;
    invalid?: boolean;
}

function RadioChoices({ options, name, labelId, helpId, size, value, onValueChange, required, invalid }: RadioChoicesProps) {
    const id = useId();
    return <RadioGroup className="crab-radio-choices" name={name} size={size} value={value} onValueChange={onValueChange}
        aria-labelledby={labelId} aria-describedby={helpId} aria-required={required} aria-invalid={invalid || undefined}>
        {options.map(option => {
            const titleId = `${id}-${option.value}-title`;
            const detailId = option.detail ? `${id}-${option.value}-detail` : undefined;
            return <Radio key={option.value} className="crab-radio-choice" value={option.value} disabled={option.disabled}
                required={required} aria-invalid={invalid || undefined} aria-labelledby={titleId}
                aria-describedby={invalid ? helpId : detailId}>
                <span className="crab-radio-choice-copy">
                    <span id={titleId} className="crab-radio-choice-title">{option.title}</span>
                    {option.detail && <span id={detailId} className="crab-radio-detail">{option.detail}</span>}
                </span>
            </Radio>;
        })}
    </RadioGroup>;
}

export default function RadioPrototype() {
    const { designSystem } = useConfig();
    const design = designs[designSystem];
    const href = useSiteHref();
    const id = useId();
    const [startup, setStartup] = useState<string | number>(startupOptions[0].value);
    const [savedStartup, setSavedStartup] = useState(startup);
    const [view, setView] = useState<string | number>("");
    const [validation, setValidation] = useState<"idle" | "invalid" | "confirmed">("idle");
    const changed = startup !== savedStartup;
    const savedTitle = startupOptions.find(option => option.value === savedStartup)?.title;
    const viewTitle = viewOptions.find(option => option.value === view)?.title;
    const viewStatus = validation === "confirmed" ? `已确认 ${viewTitle}` : viewTitle ? "已选择，待确认。" : "尚未选择。";
    const invalid = validation === "invalid";
    const startupLabel = `${id}-startup-title`;
    const startupHelp = `${id}-startup-help`;
    const viewLabel = `${id}-view-title`;
    const viewHelp = `${id}-view-help`;

    function saveStartup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSavedStartup(startup);
    }

    function validateView(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (view === "") {
            setValidation("invalid");
            event.currentTarget.querySelector<HTMLInputElement>('input[type="radio"]:enabled')?.focus();
            return;
        }
        setValidation("confirmed");
    }

    function updateView(next: string | number) {
        setView(next);
        setValidation("idle");
    }

    return <div className="crab-design-workspace" data-radio-prototype data-prototype-design={designSystem}>
        <DesignHero section="组件原型" title="Radio 单选框" description="比较工作区的启动方式，试用互斥选择、权限禁用和必填校验。">
            <nav className="crab-design-jump-links" aria-label="原型章节">
                <a href="#radio-startup">启动设置</a>
                <a href="#radio-required">必填校验</a>
                <a href="#radio-rules">交互规则</a>
            </nav>
        </DesignHero>
        <div className="crab-design-body">
            <section id="radio-startup" aria-labelledby="radio-startup-title">
                <div className="crab-design-section-head"><h2 id="radio-startup-title">工作区启动设置</h2></div>
                <form className="crab-radio-panel" onSubmit={saveStartup}>
                    <div className="crab-radio-panel-body">
                        <header className="crab-radio-group-heading">
                            <h3 id={startupLabel}>启动方式</h3>
                            <p id={startupHelp} className="crab-radio-detail">保存后，下次打开工作区时使用此设置。</p>
                        </header>
                        <RadioChoices options={startupOptions} name={`${id}-startup`} labelId={startupLabel} helpId={startupHelp}
                            size={design.size} value={startup} onValueChange={setStartup} />
                    </div>
                    <div className="crab-radio-footer">
                        <p className="crab-radio-detail" role="status">{changed && "尚未保存。"}当前生效 <strong>{savedTitle}</strong></p>
                        <Button type="submit" appearance="primary" disabled={!changed}>保存设置</Button>
                    </div>
                </form>
            </section>
            <section id="radio-required" aria-labelledby="radio-required-title">
                <div className="crab-design-section-head"><h2 id="radio-required-title">无默认项与必填校验</h2></div>
                <form className="crab-radio-panel" noValidate onSubmit={validateView}>
                    <div className="crab-radio-panel-body">
                        <header className="crab-radio-group-heading">
                            <h3 id={viewLabel}>启动视图（必填）</h3>
                            <p id={viewHelp} className="crab-radio-detail" data-invalid={invalid || undefined} role={invalid ? "alert" : undefined}>
                                {invalid ? "请选择一个启动视图。" : "试着在未选择时提交，再选一项。"}
                            </p>
                        </header>
                        <RadioChoices options={viewOptions} name={`${id}-view`} labelId={viewLabel} helpId={viewHelp}
                            size={design.size} value={view} onValueChange={updateView} required invalid={invalid} />
                    </div>
                    <div className="crab-radio-footer">
                        <p className="crab-radio-detail" role="status">{viewStatus}</p>
                        <div className="crab-radio-actions">
                            <Button type="button" appearance="text" onClick={() => updateView("")}>重置</Button>
                            <Button type="submit" appearance="primary">确认视图</Button>
                        </div>
                    </div>
                </form>
            </section>
            <section id="radio-rules" aria-labelledby="radio-rules-title">
                <div className="crab-design-section-head"><h2 id="radio-rules-title">交互规则</h2></div>
                <div className="crab-radio-rules">
                    <p>{design.decision}</p>
                    <dl>
                        <dt>用途</dt><dd>少量、互斥且需要同时比较的选项使用 Radio。可以多选时用 Checkbox，选项较多时考虑 Select。</dd>
                        <dt>默认项</dt><dd>已有设置回显原值。需要用户明确决定时留空，提交时校验。重复点击已选项会保留选择。</dd>
                        <dt>排列</dt><dd>附说明的选项纵排，便于对齐和比较。简短选项可横排，窄屏允许换行。整行标签都可以点击或轻触。</dd>
                        <dt>禁用与必填</dt><dd>禁用项展示原因，方向键跳过该项。必填组在空值提交时给出错误并聚焦第一项，选择后清除错误。</dd>
                        <dt>键盘与动效</dt><dd>Tab 进入或离开整组，方向键在可选项之间循环，空格选中焦点项。切换保持圆环和文字的位置，减少动态效果时直接显示最终状态。</dd>
                    </dl>
                </div>
            </section>
            <div><Button appearance="text" href={href("components/rc-radio")}>查看 Radio 组件文档 →</Button></div>
        </div>
    </div>;
}
