import { useRef, useState } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import DatePicker, { toPickerDateTime } from "@crab-dev/rc-date-picker";
import LineEdit, { TokenVars as lineEditTokens } from "@crab-dev/rc-line-edit";
import { PickerPrototype } from "./pickerPrototype.js";

const timeZone = "Asia/Singapore";
const earliest = "2026-11-01";
const latest = "2026-12-15";
const toDate = (value: string) => toPickerDateTime(`${value}T00:00:00+08:00[${timeZone}]`);
const windowStart = toDate(earliest);
const windowEnd = toDate(latest);
const initialDate = toDate("2026-11-23");
const reportWindow = { start: windowStart, end: windowEnd };
type ReportDate = ReturnType<typeof toPickerDateTime>;

const notes = {
    md3: "MD3 描边字段配浮动标签，日历与手动输入共用同一可选范围。",
    macos: "macOS 使用紧凑字段和桌面日历面板，保留月份切换和日期范围读数。",
    shadcn: "shadcn/ui 使用中性描边、低干扰的日历面板和可见的状态提示。",
};

export default function DatePickerPrototype() {
    const { designSystem } = useConfig();
    const size = designSystem === "macos" ? "small" : "medium";
    const [locale, setLocale] = useState<"zh-CN" | "en-US">("zh-CN");
    const [report, setReport] = useState<ReportDate | null>(initialDate);
    const [start, setStart] = useState<ReportDate | null>(toDate("2026-11-20"));
    const [end, setEnd] = useState<ReportDate | null>(initialDate);
    const [manual, setManual] = useState(false);
    const [draft, setDraft] = useState("");
    const [error, setError] = useState("");
    const manualField = useRef<HTMLInputElement>(null);
    const display = (value: ReportDate | null) => value
        ? new Intl.DateTimeFormat(locale, { timeZone, dateStyle: "medium" }).format(value.epochMilliseconds) : "未设置";
    const dateLabel = (value: ReportDate | null) => value ? display(value) : "";

    function commitDraft() {
        const text = draft.trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
            setError("按 YYYY-MM-DD 输入日期。");
            manualField.current?.focus();
            return;
        }
        let next: ReportDate;
        try {
            next = toDate(text);
        } catch {
            setError("日期不存在，请检查月份和日。");
            manualField.current?.focus();
            return;
        }
        if (text < earliest || text > latest) {
            setError("报告日期须在 2026-11-01 至 2026-12-15 之间。");
            manualField.current?.focus();
            return;
        }
        setReport(next);
        setError("");
    }

    return <PickerPrototype route="date-picker" title="DatePicker 日期选择器" scene="巡检报告日期"
        description="选取出报日期和统计区间，试用日期手输、清除、翻月和地区格式。"
        note={notes[designSystem]} rules={[
            ["适用日期", "当前记录开放 2026-11-01 至 2026-12-15。开始与结束日期相互约束，允许同一天。"],
            ["日历操作", "聚焦字段打开日历，方向键移动，Enter 确认，Escape 收起。可以翻月查看边界。"],
            ["手动输入", "固定输入 YYYY-MM-DD。校验失败保留草稿并将焦点放回输入框；清除可回到无日期状态。"],
            ["地区与时区", "切换语言更改日历和呈现格式。统计日期保持同一个 Asia/Singapore 日历日。"],
        ]} summary={<>
            <h3>报告摘要</h3>
            <dl className="crab-picker-rules">
                <div><dt>报告日期</dt><dd data-report-date>{display(report)}</dd></div>
                <div><dt>统计区间</dt><dd data-report-window>{display(start)} 至 {display(end)}</dd></div>
                <div><dt>业务时区</dt><dd>{timeZone}</dd></div>
            </dl>
            <Button size="s" appearance="outlined" aria-pressed={locale === "en-US"}
                onClick={() => setLocale(locale === "zh-CN" ? "en-US" : "zh-CN")}>使用英文日期格式</Button>
        </>}>
        <div className="crab-picker-heading">
            <h3>报告日期</h3>
            <Button size="s" appearance="text" aria-expanded={manual} onClick={() => {
                if (!manual) {
                    setDraft(report?.toPlainDate().toString() ?? "");
                    setError("");
                }
                setManual(!manual);
            }}>{manual ? "切换到日历" : "手动输入日期"}</Button>
        </div>
        {manual ? <div className="crab-picker-manual">
            <LineEdit ref={manualField} autoFocus label="输入报告日期" value={draft} placeholder="YYYY-MM-DD"
                appearance="outlined" size={size} errorText={error || undefined}
                style={designSystem === "md3" ? { [lineEditTokens["field.outlined.box-shadow-error"]]: "none" } : undefined}
                onValueChange={value => { setDraft(value); setError(""); }}
                onKeyDown={event => { if (event.key === "Enter" && !event.nativeEvent.isComposing) commitDraft(); }} />
            <Button size="s" appearance="primary" onClick={commitDraft}>应用日期</Button>
        </div> : <DatePicker label="选择报告日期" value={report} onValueChange={setReport} size={size}
            timeZone={timeZone} locale={locale} range={reportWindow} renderDisplayString={dateLabel}
            placeholder={locale === "zh-CN" ? "请选择日期" : "Choose a date"} />}
        {manual && <Button size="s" appearance="text" onClick={() => {
            setReport(null);
            setDraft("");
            setError("");
            manualField.current?.focus();
        }}>清除报告日期</Button>}
        <h3>统计区间</h3>
        <div className="crab-picker-range">
            <DatePicker label="开始日期" value={start} onValueChange={setStart} size={size} timeZone={timeZone}
                locale={locale} range={{ start: windowStart, end: end ?? windowEnd }} renderDisplayString={dateLabel} />
            <DatePicker label="结束日期" value={end} onValueChange={setEnd} size={size} timeZone={timeZone}
                locale={locale} range={{ start: start ?? windowStart, end: windowEnd }} renderDisplayString={dateLabel} />
        </div>
        <p className="crab-picker-support">数据可用期为 2026-11-01 至 2026-12-15。</p>
    </PickerPrototype>;
}
