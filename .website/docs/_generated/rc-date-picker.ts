/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/datePicker.demo.tsx",
        "title": "日期选择器",
        "description": "字段和日期面板随文档站主题切换，使用同一日期和尺寸对照 Apple、MD3 Expressive 与 shadcn/ui。",
        "learning": {
            "components": [
                "Button",
                "DatePicker"
            ],
            "props": [
                "appearance",
                "aria-pressed",
                "onClick",
                "label",
                "supportingText",
                "value",
                "size",
                "renderDisplayString",
                "onValueChange"
            ],
            "events": [
                "onClick",
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"日期选择器\",\n    description: \"字段和日期面板随文档站主题切换，使用同一日期和尺寸对照 Apple、MD3 Expressive 与 shadcn/ui。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport token from \"@crab-dev/rc-token-semantic\";\n\nimport DatePicker from \"../../src/datePicker/datePicker.js\";\nimport { formatTemporal } from \"../../src/util.js\";\n\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cTemporal.ZonedDateTime | null>(null);\n    const [size, setSize] = useState\u003c\"large\" | \"medium\" | \"small\">(\"medium\")\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: ${token.space['group-gap']};\n                margin-bottom: ${token.space['section-gap']};\n            `}\n        >\n            \u003cdiv role=\"group\" aria-label=\"字段尺寸\" className={css`display: flex; gap: ${token.space['inline-gap']};`}>\n                {(['small', 'medium', 'large'] as const).map(item => \u003cButton key={item} appearance={size === item ? 'tonal' : 'outlined'} aria-pressed={size === item} onClick={() => setSize(item)}>{item}\u003c/Button>)}\n            \u003c/div>\n            \u003cDatePicker\n                label=\"计划日期\"\n                supportingText=\"日期面板的选中项与今天标记分别呈现。\"\n                value={value}\n                size={size}\n                renderDisplayString={(value) => formatTemporal(value, \"yyyy-MM-dd\")}\n                onValueChange={setValue}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FdatePicker.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FdatePicker.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "日期选择"
    },
    {
        "id": "docs/demos/datePickerRange.demo.tsx",
        "title": "可选日期范围",
        "description": "限制单个日期只能在今天前后 7 天内选择；范围外的日期禁用。",
        "learning": {
            "components": [
                "DatePicker"
            ],
            "props": [
                "label",
                "supportingText",
                "value",
                "renderDisplayString",
                "range",
                "onValueChange"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { toPickerDateTime } from '@crab-dev/rc-date-picker';\n\nexport const meta = {\n    title: \"可选日期范围\",\n    description: \"限制单个日期只能在今天前后 7 天内选择；范围外的日期禁用。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\n\nimport DatePicker from \"../../src/datePicker/datePicker.js\";\nimport { formatTemporal } from \"../../src/util.js\";\n\nconst now = toPickerDateTime(`${new Date().toISOString()}[${Intl.DateTimeFormat().resolvedOptions().timeZone}]`);\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cTemporal.ZonedDateTime | null>(now);\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                margin-bottom: 2rem;\n            `}\n        >\n            \u003cDatePicker\n                label=\"计划日期\"\n                supportingText=\"只能选择今天前后 7 天内的一个日期。\"\n                value={value}\n                renderDisplayString={(value) => formatTemporal(value, \"yyyy-MM-dd\")}\n                range={{\n                    start: now.subtract({ days: 7 }),\n                    end: now.add({ days: 7 }),\n                }}\n                onValueChange={setValue}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FdatePickerRange.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FdatePickerRange.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "日期选择"
    },
    {
        "id": "docs/demos/datePickerPanel.demo.tsx",
        "title": "日期面板",
        "description": "基础的日期选择面板组件示例。",
        "learning": {
            "components": [
                "DatePickerPanel"
            ],
            "props": [
                "value",
                "weekStartDay",
                "range"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { toPickerDateTime } from '@crab-dev/rc-date-picker';\n\nexport const meta = {\n    title: \"日期面板\",\n    description: \"基础的日期选择面板组件示例。\",\n};\n\nimport DatePickerPanel from \"../../src/panels/datePickerPanel.js\";\n\n\nconst now = toPickerDateTime(`${new Date().toISOString()}[${Intl.DateTimeFormat().resolvedOptions().timeZone}]`);\n\nconst SizeDemo = () => {\n\n    return (\n        \u003cdiv\n            style={{\n                width: 250\n            }}\n        >\n            \u003cDatePickerPanel\n                value={now}\n                weekStartDay={1}\n                range={{\n                    start: now.subtract({ days: 7 }),\n                    end: now.add({ days: 7 }),\n                }}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FdatePickerPanel.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FdatePickerPanel.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "日期选择"
    },
    {
        "id": "docs/demos/dateTimePicker.demo.tsx",
        "title": "带时间的日期选择器",
        "description": "三种不同规格的带时间的日期选择器示例",
        "learning": {
            "components": [
                "DateTimePicker"
            ],
            "props": [
                "value",
                "size",
                "onValueChange"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"带时间的日期选择器\",\n    description: \"三种不同规格的带时间的日期选择器示例\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useId, useState } from \"react\";\nimport DateTimePicker from \"../../src/dateTimePicker/index.js\";\n\n\nconst SizeDemo = () => {\n    const controlId = useId();\n    const [value, setValue] = useState\u003cTemporal.ZonedDateTime | null>(null);\n    const [size, setSize] = useState\u003c\"large\" | \"medium\" | \"small\">(\"medium\")\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                margin-bottom: 2rem;\n            `}\n        >\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    margin-bottom: 1rem;\n                `}\n            >\n                \u003clabel htmlFor={controlId}>\n                    请选择大小\n                \u003c/label>\n                \u003cselect\n                    id={controlId}\n                    value={size}\n                    onChange={e => setSize(e.target.value as \"large\" | \"medium\" | \"small\")}\n                >\n                    \u003coption value=\"large\">Large\u003c/option>\n                    \u003coption value=\"medium\">Medium\u003c/option>\n                    \u003coption value=\"small\">Small\u003c/option>\n                \u003c/select>\n            \u003c/div>\n            \u003cDateTimePicker\n                value={value}\n                size={size}\n                onValueChange={setValue}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FdateTimePicker.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FdateTimePicker.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "日期时间"
    },
    {
        "id": "docs/demos/dateTimePickerPanel.demo.tsx",
        "title": "日期时间面板",
        "description": "基础的日期时间选择面板组件示例。",
        "learning": {
            "components": [
                "DateTimePickerPanel"
            ],
            "props": [
                "value",
                "weekStartDay",
                "range"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { toPickerDateTime } from '@crab-dev/rc-date-picker';\n\nexport const meta = {\n    title: \"日期时间面板\",\n    description: \"基础的日期时间选择面板组件示例。\",\n};\n\nimport DateTimePickerPanel from \"../../src/panels/dateTimePickerPanel.js\";\n\n\nconst now = toPickerDateTime(`${new Date().toISOString()}[${Intl.DateTimeFormat().resolvedOptions().timeZone}]`);\n\nconst SizeDemo = () => {\n\n    return (\n        \u003cdiv>\n            \u003cDateTimePickerPanel\n                value={now}\n                weekStartDay={1}\n                range={{\n                    start: now.subtract({ days: 7 }),\n                    end: now.add({ days: 7 }),\n                }}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FdateTimePickerPanel.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FdateTimePickerPanel.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "日期时间"
    },
    {
        "id": "docs/demos/timePicker.demo.tsx",
        "title": "时间选择与字段尺寸",
        "description": "从字段下方展开时间面板，可切换键盘输入；字段支持 small、medium、large 三档尺寸。",
        "learning": {
            "components": [
                "TimePicker"
            ],
            "props": [
                "label",
                "appearance",
                "size",
                "value",
                "onValueChange"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: '时间选择与字段尺寸',\n    description: '从字段下方展开时间面板，可切换键盘输入；字段支持 small、medium、large 三档尺寸。',\n};\nimport { css } from '@crab-dev/css';\nimport semantic from '@crab-dev/rc-token-semantic';\nimport { useState } from 'react';\nimport TimePicker from '../../src/timePicker/timePicker.js';\nimport type { TimePickerValue } from '../../src/panels/timePickerPanel.js';\n\nfunction SizedTime({ size }: { size: 'small' | 'medium' | 'large' }) {\n    const [value, setValue] = useState\u003cTimePickerValue | null>({ hour: 9, minute: 30, second: 0 });\n    return \u003cTimePicker label={`开始时间 · ${size}`} appearance=\"outlined\" size={size} value={value} onValueChange={setValue} />;\n}\nexport default function TimeInputDemo() {\n    return \u003cdiv className={css`display: flex; flex-direction: column; gap: ${semantic.space['section-gap']};`}>\n        \u003cSizedTime size=\"small\" />\n        \u003cSizedTime size=\"medium\" />\n        \u003cSizedTime size=\"large\" />\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FtimePicker.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FtimePicker.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "时间选择"
    },
    {
        "id": "docs/demos/timePickerDial.demo.tsx",
        "title": "表盘与 12 小时制",
        "description": "先选小时，再选分钟；可切换 AM / PM，或用键盘图标切换到输入模式。",
        "learning": {
            "components": [
                "TimePicker"
            ],
            "props": [
                "label",
                "appearance",
                "value",
                "onValueChange",
                "panelProps"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: '表盘与 12 小时制',\n    description: '先选小时，再选分钟；可切换 AM / PM，或用键盘图标切换到输入模式。',\n};\nimport { useState } from 'react';\nimport TimePicker from '../../src/timePicker/timePicker.js';\nimport type { TimePickerValue } from '../../src/panels/timePickerPanel.js';\n\nexport default function TimeDialDemo() {\n    const [value, setValue] = useState\u003cTimePickerValue | null>({ hour: 13, minute: 45, second: 0 });\n    return \u003cTimePicker label=\"提醒时间\" appearance=\"filled\" value={value} onValueChange={setValue} panelProps={{ hourCycle: 12 }} />;\n}\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FtimePickerDial.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FtimePickerDial.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "时间选择"
    },
    {
        "id": "docs/demos/timePickerPanel.demo.tsx",
        "title": "时间面板",
        "description": "一个基础的时间选择面板组件",
        "learning": {
            "components": [
                "TimePickerPanel"
            ],
            "props": [
                "value",
                "onValueChange"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "\n\nexport const meta = {\n    title: \"时间面板\",\n    description: \"一个基础的时间选择面板组件\",\n};\n\nimport { useState } from \"react\";\nimport TimePickerPanel, { type TimePickerValue } from \"../../src/panels/timePickerPanel.js\";\n\n\nconst now = new Date();\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cTimePickerValue | null>({\n        hour: now.getHours(),\n        minute: now.getMinutes(),\n        second: now.getSeconds()\n    });\n\n    return \u003cTimePickerPanel value={value} onValueChange={setValue} />;\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FtimePickerPanel.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FtimePickerPanel.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "时间选择"
    },
    {
        "id": "docs/demos/visual-states.demo.tsx",
        "title": "选择器字段状态",
        "description": "日期、时间和日期时间字段分别展示禁用、错误、警告与 filled 外观，面板操作沿用各选择器协议。",
        "learning": {
            "components": [
                "DatePicker",
                "TimePicker",
                "DateTimePicker"
            ],
            "props": [
                "label",
                "disabled",
                "supportingText",
                "required",
                "errorText",
                "status",
                "appearance",
                "defaultValue"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport DatePicker, { DateTimePicker, TimePicker } from '@crab-dev/rc-date-picker';\nimport token from '@crab-dev/rc-token-semantic';\n\nexport const meta = {\n    title: '选择器字段状态',\n    description: '日期、时间和日期时间字段分别展示禁用、错误、警告与 filled 外观，面板操作沿用各选择器协议。',\n};\n\nconst layout = css`\n    display: grid;\n    gap: ${token.space['section-gap']};\n    max-width: calc(${token.size['40']} * 12);\n`;\nconst group = css`\n    display: grid;\n    gap: ${token.space['group-gap']};\n`;\n\nexport default function VisualStatesDemo() {\n    return \u003cdiv className={layout}>\n        \u003csection className={group} aria-label=\"日期字段状态\">\n            \u003cdiv data-demo-state=\"date-disabled\">\u003cDatePicker label=\"不可用日期\" disabled supportingText=\"此记录暂不允许调整日期。\" />\u003c/div>\n            \u003cdiv data-demo-state=\"date-error\">\u003cDatePicker label=\"必填日期\" required errorText=\"请选择计划日期。\" />\u003c/div>\n            \u003cdiv data-demo-state=\"date-warning\">\u003cDatePicker label=\"待确认日期\" status=\"warning\" supportingText=\"请确认日期是否与团队排期一致。\" />\u003c/div>\n            \u003cdiv data-demo-state=\"date-filled\">\u003cDatePicker label=\"填充日期\" appearance=\"filled\" supportingText=\"点击字段选择日期。\" />\u003c/div>\n        \u003c/section>\n        \u003csection className={group} aria-label=\"时间字段状态\">\n            \u003cdiv data-demo-state=\"time-disabled\">\u003cTimePicker label=\"不可用时间\" defaultValue={{ hour: 9, minute: 30, second: 0 }} disabled />\u003c/div>\n            \u003cdiv data-demo-state=\"time-error\">\u003cTimePicker label=\"必填时间\" required errorText=\"请选择开始时间。\" />\u003c/div>\n            \u003cdiv data-demo-state=\"time-warning\">\u003cTimePicker label=\"待确认时间\" defaultValue={{ hour: 18, minute: 0, second: 0 }} status=\"warning\" supportingText=\"该时间可能超出团队工作时段。\" />\u003c/div>\n            \u003cdiv data-demo-state=\"time-filled\">\u003cTimePicker label=\"填充时间\" appearance=\"filled\" defaultValue={{ hour: 10, minute: 15, second: 0 }} />\u003c/div>\n        \u003c/section>\n        \u003csection className={group} aria-label=\"日期时间字段状态\">\n            \u003cdiv data-demo-state=\"datetime-disabled\">\u003cDateTimePicker label=\"不可用日期时间\" disabled />\u003c/div>\n            \u003cdiv data-demo-state=\"datetime-error\">\u003cDateTimePicker label=\"必填日期时间\" required errorText=\"请选择完整的日期与时间。\" />\u003c/div>\n            \u003cdiv data-demo-state=\"datetime-warning\">\u003cDateTimePicker label=\"待确认日期时间\" status=\"warning\" supportingText=\"请与参与者确认可用时间。\" />\u003c/div>\n            \u003cdiv data-demo-state=\"datetime-filled\">\u003cDateTimePicker label=\"填充日期时间\" appearance=\"filled\" />\u003c/div>\n        \u003c/section>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-states.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2Fvisual-states.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "标签与状态"
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "日期与时间状态矩阵",
        "description": "固定业务日期对照日期、日期时间、表盘与时间输入，保留真实选择草稿和确认行为。",
        "learning": {
            "components": [
                "DatePicker",
                "DateTimePicker",
                "TimePicker"
            ],
            "props": [
                "label",
                "aria-label",
                "timeZone",
                "value",
                "onValueChange",
                "range",
                "panelProps"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport DatePicker, { DateTimePicker, TimePicker, toPickerDateTime } from '@crab-dev/rc-date-picker';\nimport { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useId, useState } from 'react';\n\nexport const meta = { title: '日期与时间状态矩阵', description: '固定业务日期对照日期、日期时间、表盘与时间输入，保留真实选择草稿和确认行为。' };\nconst frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; max-width: calc(${token.size[40]} * 13); min-width: 0;`;\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const [state, setState] = useState('default');\n    const [date, setDate] = useState\u003cReturnType\u003ctypeof toPickerDateTime> | null>(() => toPickerDateTime('2026-06-15T09:30:00+08:00[Asia/Shanghai]'));\n    const [dateTime, setDateTime] = useState(date);\n    const [time, setTime] = useState\u003c{ hour: number; minute: number; second: number } | null>({ hour: 9, minute: 30, second: 15 });\n    const [timePreset, setTimePreset] = useState('24-dial');\n    const id = useId();\n    const timeId = useId();\n    const english = locale === 'en-US';\n    const common = { disabled: state === 'disabled', status: state === 'error' ? 'error' as const : state === 'warning' ? 'warning' as const : undefined, errorText: state === 'error' ? (english ? 'Choose an available date or time.' : '请选择可用日期或时间。') : undefined, supportingText: english ? 'Confirm to save the selection.' : '确认后保存选择，取消保留原值。' };\n    return \u003csection className={frame} aria-label=\"DatePicker visual matrix\" data-visual-scene data-state={state}>\n        \u003cdiv>\u003clabel htmlFor={id}>验收状态\u003c/label>{' '}\u003cselect id={id} value={state} onChange={event => setState(event.currentTarget.value)}>{['default', 'disabled', 'error', 'warning'].map(value => \u003coption key={value}>{value}\u003c/option>)}\u003c/select>\u003c/div>\n        \u003cDatePicker {...common} label={english ? 'Schedule date' : '计划日期'} aria-label=\"计划日期\" timeZone=\"Asia/Shanghai\" value={date} onValueChange={setDate} range={{ start: toPickerDateTime('2026-06-05T00:00:00+08:00[Asia/Shanghai]'), end: toPickerDateTime('2026-07-25T23:59:00+08:00[Asia/Shanghai]') }} />\n        \u003cDateTimePicker {...common} label={english ? 'Schedule date and time' : '计划日期时间'} aria-label=\"计划日期时间\" timeZone=\"Asia/Shanghai\" value={dateTime} onValueChange={setDateTime} panelProps={{ timePanelProps: { hourCycle: timePreset.startsWith('12') ? 12 : 24, showSeconds: !timePreset.endsWith('input') } }} />\n        \u003cTimePicker {...common} label={english ? 'Time dial' : '表盘时间'} aria-label=\"表盘时间\" value={time} onValueChange={setTime} panelProps={{ hourCycle: timePreset.startsWith('12') ? 12 : 24, defaultMode: timePreset.endsWith('dial') ? 'dial' : 'input', showSeconds: timePreset.endsWith('seconds') }} />\n        \u003cTimePicker {...common} label={english ? 'Time with seconds' : '秒精度时间'} aria-label=\"秒精度时间\" value={time} onValueChange={setTime} panelProps={{ defaultMode: 'input', showSeconds: true, hourCycle: 12 }} />\n        \u003cdiv>\u003clabel htmlFor={timeId}>时间配置\u003c/label>{' '}\u003cselect id={timeId} value={timePreset} onChange={event => setTimePreset(event.currentTarget.value)}>{['24-dial', '12-dial', '24-input', '12-input', '24-seconds', '12-seconds'].map(value => \u003coption key={value}>{value}\u003c/option>)}\u003c/select>\u003c/div>\n        \u003coutput aria-live=\"polite\">{date?.toPlainDate().toString() ?? '未选择日期'} · {time ? `${time.hour}:${time.minute}:${time.second}` : '未选择时间'}\u003c/output>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "视觉验收"
    }
] as const satisfies readonly ComponentDemoRecord[];
