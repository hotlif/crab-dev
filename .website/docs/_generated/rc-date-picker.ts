/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/datePicker.demo.tsx",
        "title": "日期选择器",
        "description": "字段和日期面板随文档站主题切换，使用同一日期和尺寸对照 macOS、MD3 与 shadcn。",
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
        "sourceCode": "export const meta = {\n    title: \"日期选择器\",\n    description: \"字段和日期面板随文档站主题切换，使用同一日期和尺寸对照 macOS、MD3 与 shadcn。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport token from \"@crab-dev/rc-token-semantic\";\n\nimport DatePicker from \"../../src/datePicker/datePicker.js\";\nimport { formatTemporal } from \"../../src/util.js\";\n\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cTemporal.ZonedDateTime | null>(null);\n    const [size, setSize] = useState\u003c\"large\" | \"middle\" | \"small\">(\"middle\")\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: ${token.space['group-gap']};\n                margin-bottom: ${token.space['section-gap']};\n            `}\n        >\n            \u003cdiv role=\"group\" aria-label=\"字段尺寸\" className={css`display: flex; gap: ${token.space['inline-gap']};`}>\n                {(['small', 'middle', 'large'] as const).map(item => \u003cButton key={item} appearance={size === item ? 'tonal' : 'outlined'} aria-pressed={size === item} onClick={() => setSize(item)}>{item}\u003c/Button>)}\n            \u003c/div>\n            \u003cDatePicker\n                label=\"计划日期\"\n                supportingText=\"日期面板的选中项与今天标记分别呈现。\"\n                value={value}\n                size={size}\n                renderDisplayString={(value) => formatTemporal(value, \"yyyy-MM-dd\")}\n                onValueChange={setValue}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"可选日期范围\",\n    description: \"限制单个日期只能在今天前后 7 天内选择；范围外的日期禁用。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\n\nimport DatePicker from \"../../src/datePicker/datePicker.js\";\nimport { formatTemporal } from \"../../src/util.js\";\n\nconst now = Temporal.Now.zonedDateTimeISO();\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cTemporal.ZonedDateTime | null>(now);\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                margin-bottom: 2rem;\n            `}\n        >\n            \u003cDatePicker\n                label=\"计划日期\"\n                supportingText=\"只能选择今天前后 7 天内的一个日期。\"\n                value={value}\n                renderDisplayString={(value) => formatTemporal(value, \"yyyy-MM-dd\")}\n                range={{\n                    start: now.subtract({ days: 7 }),\n                    end: now.add({ days: 7 }),\n                }}\n                onValueChange={setValue}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"日期面板\",\n    description: \"基础的日期选择面板组件示例。\",\n};\n\nimport DatePickerPanel from \"../../src/panels/datePickerPanel.js\";\n\n\nconst now = Temporal.Now.zonedDateTimeISO();\n\nconst SizeDemo = () => {\n\n    return (\n        \u003cdiv\n            style={{\n                width: 250\n            }}\n        >\n            \u003cDatePickerPanel\n                value={now}\n                weekStartDay={1}\n                range={{\n                    start: now.subtract({ days: 7 }),\n                    end: now.add({ days: 7 }),\n                }}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"带时间的日期选择器\",\n    description: \"三种不同规格的带时间的日期选择器示例\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useId, useState } from \"react\";\nimport DateTimePicker from \"../../src/dateTimePicker/index.js\";\n\n\nconst SizeDemo = () => {\n    const controlId = useId();\n    const [value, setValue] = useState\u003cTemporal.ZonedDateTime | null>(null);\n    const [size, setSize] = useState\u003c\"large\" | \"middle\" | \"small\">(\"middle\")\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                margin-bottom: 2rem;\n            `}\n        >\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    margin-bottom: 1rem;\n                `}\n            >\n                \u003clabel htmlFor={controlId}>\n                    请选择大小\n                \u003c/label>\n                \u003cselect\n                    id={controlId}\n                    value={size}\n                    onChange={e => setSize(e.target.value as \"large\" | \"middle\" | \"small\")}\n                >\n                    \u003coption value=\"large\">Large\u003c/option>\n                    \u003coption value=\"middle\">Middle\u003c/option>\n                    \u003coption value=\"small\">Small\u003c/option>\n                \u003c/select>\n            \u003c/div>\n            \u003cDateTimePicker\n                value={value}\n                size={size}\n                onValueChange={setValue}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"日期时间面板\",\n    description: \"基础的日期时间选择面板组件示例。\",\n};\n\nimport DateTimePickerPanel from \"../../src/panels/dateTimePickerPanel.js\";\n\n\nconst now = Temporal.Now.zonedDateTimeISO();\n\nconst SizeDemo = () => {\n\n    return (\n        \u003cdiv>\n            \u003cDateTimePickerPanel\n                value={now}\n                weekStartDay={1}\n                range={{\n                    start: now.subtract({ days: 7 }),\n                    end: now.add({ days: 7 }),\n                }}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FdateTimePickerPanel.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FdateTimePickerPanel.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "日期时间"
    },
    {
        "id": "docs/demos/timePicker.demo.tsx",
        "title": "时间选择与字段尺寸",
        "description": "从字段下方展开时间面板，可切换键盘输入；字段支持三档密度。",
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
        "sourceCode": "export const meta = {\n    title: '时间选择与字段尺寸',\n    description: '从字段下方展开时间面板，可切换键盘输入；字段支持三档密度。',\n};\nimport { css } from '@crab-dev/css';\nimport semantic from '@crab-dev/rc-token-semantic';\nimport { useState } from 'react';\nimport TimePicker from '../../src/timePicker/timePicker.js';\nimport type { TimePickerValue } from '../../src/panels/timePickerPanel.js';\n\nfunction SizedTime({ size }: { size: 'small' | 'middle' | 'large' }) {\n    const [value, setValue] = useState\u003cTimePickerValue | null>({ hour: 9, minute: 30, second: 0 });\n    return \u003cTimePicker label={`开始时间 · ${size}`} appearance=\"outlined\" size={size} value={value} onValueChange={setValue} />;\n}\nexport default function TimeInputDemo() {\n    return \u003cdiv className={css`display: flex; flex-direction: column; gap: ${semantic.space['section-gap']};`}>\n        \u003cSizedTime size=\"small\" />\n        \u003cSizedTime size=\"middle\" />\n        \u003cSizedTime size=\"large\" />\n    \u003c/div>;\n}\n",
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
        "sourceCode": "\nexport const meta = {\n    title: \"时间面板\",\n    description: \"一个基础的时间选择面板组件\",\n};\n\nimport { useState } from \"react\";\nimport TimePickerPanel, { type TimePickerValue } from \"../../src/panels/timePickerPanel.js\";\n\n\nconst now = Temporal.Now.zonedDateTimeISO();\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cTimePickerValue | null>({\n        hour: now.hour,\n        minute: now.minute,\n        second: now.second\n    });\n\n    return \u003cTimePickerPanel value={value} onValueChange={setValue} />;\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FtimePickerPanel.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FtimePickerPanel.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "时间选择"
    }
] as const satisfies readonly ComponentDemoRecord[];
