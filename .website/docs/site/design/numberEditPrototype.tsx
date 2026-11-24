import { useRef, useState, type FormEvent, type Ref } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import NumberEdit from "@crab-dev/rc-number-edit";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./numberEditPrototype.styles.js";

const frequency = { label: "采样频率", unit: "Hz", min: .5, max: 8, step: .25, largeStep: 1, precision: 2 };
const quantity = { label: "告警数量", unit: "条", min: 1, max: 120, step: 1, largeStep: 10, precision: 0 };
const initial = { frequency: 2, quantity: 30 };

const designs = {
    md3: {
        size: "medium",
        decision: "设定项采用单一描边，单位与步进集成在字段尾部。输入中的提示、边界修正和错误说明都位于同一辅助区。",
    },
    macos: {
        size: "small",
        decision: "紧凑编辑区沿用上下步进和蓝色焦点环。单位跟随数值，增减操作留在字段右侧。",
    },
    shadcn: {
        size: "medium",
        decision: "中性描边与明确的焦点环保持表单层级，范围和错误以文字表达。",
    },
} as const;

function display(value: number, definition: typeof frequency) {
    return value.toFixed(definition.precision) + " " + definition.unit;
}

function NumericField({ definition, size, value, submitted, inputRef, onChange }: {
    definition: typeof frequency;
    size: "small" | "medium";
    value: number | null;
    submitted: boolean;
    inputRef: Ref<HTMLInputElement>;
    onChange: (value: number | null) => void;
}) {
    const [draft, setDraft] = useState<string | null>(null);
    const [previousDraft, setPreviousDraft] = useState<string | null>(null);
    const { label, unit, min, max, step, largeStep, precision } = definition;
    const invalid = value === null && ((draft === null && previousDraft !== null) || (submitted && !draft?.trim()));
    const parsedDraft = previousDraft === null ? null : Number(previousDraft);
    const adjusted = value !== null && parsedDraft !== null && Number.isFinite(parsedDraft) && parsedDraft !== value;
    const outside = parsedDraft !== null && (parsedDraft < min || parsedDraft > max);
    const rangeText = `${min}–${max} ${unit}，步长 ${step}`;
    const supportingText = draft !== null
        ? `编辑中。可保留未输完的数值，按 Enter 或离开字段确认。`
        : adjusted
            ? `${outside ? "超出范围，已调整为" : "已按精度舍入为"} ${display(value, definition)}。`
            : rangeText + "。";

    return <div className="crab-number-edit-field">
        <NumberEdit ref={inputRef} label={label} size={size} appearance="outlined" required
            value={value} min={min} max={max} step={step} largeStep={largeStep} precision={precision} scientific="never"
            suffix={<span className="crab-number-edit-unit">{unit}</span>}
            supportingText={supportingText}
            errorText={invalid ? `请输入有效数值，范围为 ${min}–${max} ${unit}。` : undefined}
            onValueChange={(next, details) => {
                onChange(next);
                if (details.reason === "step") setDraft(current => current === null ? null : String(next));
            }}
            onFocus={event => {
                setDraft(event.currentTarget.value);
                setPreviousDraft(null);
            }}
            onChange={event => setDraft(event.currentTarget.value)}
            onBlur={event => {
                setPreviousDraft(event.currentTarget.value.trim());
                setDraft(null);
            }}
            onKeyDown={event => {
                if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    event.currentTarget.blur();
                }
            }} />
    </div>;
}

export default function NumberEditPrototype() {
    const { designSystem } = useConfig();
    const design = designs[designSystem];
    const href = useSiteHref();
    const rateInput = useRef<HTMLInputElement>(null);
    const countInput = useRef<HTMLInputElement>(null);
    const [rate, setRate] = useState<number | null>(initial.frequency);
    const [count, setCount] = useState<number | null>(initial.quantity);
    const [saved, setSaved] = useState(initial);
    const [submitted, setSubmitted] = useState(false);
    const [notice, setNotice] = useState("");

    function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitted(true);
        if (rate === null || count === null) {
            setNotice("请先补齐有效数值。");
            (rate === null ? rateInput : countInput).current?.focus();
            return;
        }
        setSaved({ frequency: rate, quantity: count });
        setNotice("采样与告警设置已保存。");
    }

    return <div className="crab-design-workspace" data-number-edit-prototype data-prototype-design={designSystem}>
        <DesignHero section="组件原型" title="NumberEdit 数值输入框"
            description="设置采样频率和告警数量，观察编辑、归一化与显式保存。" />
        <div className="crab-design-body">
            <section id="number-edit-settings" aria-labelledby="number-edit-settings-title">
                <div className="crab-design-section-head"><h2 id="number-edit-settings-title">采样与告警</h2></div>
                <div className="crab-number-edit-layout">
                    <form className="crab-number-edit-panel crab-number-edit-form" aria-label="采样与告警设置" onSubmit={save} noValidate>
                        <NumericField definition={frequency} size={design.size} inputRef={rateInput} value={rate} submitted={submitted} onChange={next => {
                            setRate(next);
                            setNotice("");
                        }} />
                        <NumericField definition={quantity} size={design.size} inputRef={countInput} value={count} submitted={submitted} onChange={next => {
                            setCount(next);
                            setNotice("");
                        }} />
                        <div className="crab-number-edit-actions">
                            <p role="status">{notice}</p>
                            <Button appearance="primary" type="submit">保存设置</Button>
                        </div>
                    </form>
                    <aside className="crab-number-edit-panel crab-number-edit-receipt" aria-label="生效数值">
                        <h3>上次保存</h3>
                        <dl>
                            <dt>采样频率</dt><dd data-saved-rate>{display(saved.frequency, frequency)}</dd>
                            <dt>告警数量</dt><dd data-saved-count>{display(saved.quantity, quantity)}</dd>
                        </dl>
                        <p>可以输入 <code>-</code>、<code>3.</code>、<code>3.126</code> 或 <code>9</code>，再按 Enter 查看字段如何处理。保存设置后才会更新这里。</p>
                    </aside>
                </div>
            </section>
            <section id="number-edit-states" aria-labelledby="number-edit-states-title">
                <div className="crab-design-section-head"><h2 id="number-edit-states-title">只读与禁用</h2></div>
                <div className="crab-number-edit-examples crab-number-edit-panel">
                    <NumberEdit label="设备额定频率" size={design.size} defaultValue={6} precision={2} controls={false}
                        readOnly suffix="Hz" supportingText="可聚焦并复制设备参数。" />
                    <NumberEdit label="维护期间告警数量" size={design.size} defaultValue={30} disabled
                        suffix="条" supportingText="锁定时跳过键盘焦点。" />
                </div>
            </section>
            <section id="number-edit-rules" aria-labelledby="number-edit-rules-title">
                <div className="crab-design-section-head"><h2 id="number-edit-rules-title">交互规则</h2></div>
                <div className="crab-number-edit-panel crab-number-edit-rules">
                    <p>{design.decision}</p>
                    <dl>
                        <dt>适用场景</dt><dd>可度量、可步进的值用数值输入框。编号、版本号和保留前导零的内容用文本输入框。</dd>
                        <dt>编辑与确认</dt><dd>输入期间保留未输完的小数和符号。Enter 或离开字段后按精度归一，越界时调整到最近边界并说明。</dd>
                        <dt>步进与焦点</dt><dd>上下方向键走一步，Shift 加方向键或 Page Up / Page Down 走大步。达到边界后最末一档不可再调整。</dd>
                        <dt>提交</dt><dd>保存时检查有效数值。缺值时焦点回到第一个待修正字段，已保存值继续显示。</dd>
                    </dl>
                    <Button appearance="text" href={href("components/rc-number-edit")}>查看 NumberEdit 组件文档</Button>
                </div>
            </section>
        </div>
    </div>;
}
