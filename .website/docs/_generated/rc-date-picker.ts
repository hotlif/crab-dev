/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/datePicker.demo.tsx",
        "title": "日期选择器",
        "description": "多种规格的日期选择器演示。",
        "sourceCode": "export const meta = {\n    title: \"日期选择器\",\n    description: \"多种规格的日期选择器演示。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\n\nimport DatePicker from \"../../src/datePicker/datePicker.js\";\nimport { formatTemporal } from \"../../src/util.js\";\n\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cTemporal.ZonedDateTime | null>(null);\n    const [size, setSize] = useState\u003c\"large\" | \"middle\" | \"small\">(\"middle\")\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                margin-bottom: 2rem;\n            `}\n        >\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    margin-bottom: 1rem;\n                `}\n            >\n                \u003clabel>\n                    请选择大小\n                \u003c/label>\n                \u003cselect\n                    value={size}\n                    onChange={e => setSize(e.target.value as \"large\" | \"middle\" | \"small\")}\n                >\n                    \u003coption value=\"large\">Large\u003c/option>\n                    \u003coption value=\"middle\">Middle\u003c/option>\n                    \u003coption value=\"small\">Small\u003c/option>\n                \u003c/select>\n            \u003c/div>\n            \u003cDatePicker\n                value={value}\n                size={size}\n                renderDisplayString={(value) => formatTemporal(value, \"yyyy-MM-dd\")}\n                onValueChange={setValue}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FdatePicker.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FdatePicker.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/datePickerPanel.demo.tsx",
        "title": "日期面板",
        "description": "基础的日期选择面板组件示例。",
        "sourceCode": "export const meta = {\n    title: \"日期面板\",\n    description: \"基础的日期选择面板组件示例。\",\n};\n\nimport DatePickerPanel from \"../../src/panels/datePickerPanel.js\";\n\n\nconst now = Temporal.Now.zonedDateTimeISO();\n\nconst SizeDemo = () => {\n\n    return (\n        \u003cdiv\n            style={{\n                width: 250\n            }}\n        >\n            \u003cDatePickerPanel\n                value={now}\n                weekStartDay={1}\n                range={{\n                    start: now.subtract({ days: 7 }),\n                    end: now.add({ days: 7 }),\n                }}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FdatePickerPanel.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FdatePickerPanel.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/datePickerRange.demo.tsx",
        "title": "日期范围选择",
        "description": "演示如何选择一段日期区间。",
        "sourceCode": "export const meta = {\n    title: \"日期范围选择\",\n    description: \"演示如何选择一段日期区间。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\n\nimport DatePicker from \"../../src/datePicker/datePicker.js\";\nimport { formatTemporal } from \"../../src/util.js\";\n\nconst now = Temporal.Now.zonedDateTimeISO();\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cTemporal.ZonedDateTime | null>(now);\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                margin-bottom: 2rem;\n            `}\n        >\n            \u003cDatePicker\n                value={value}\n                renderDisplayString={(value) => formatTemporal(value, \"yyyy-MM-dd\")}\n                range={{\n                    start: now.subtract({ days: 7 }),\n                    end: now.add({ days: 7 }),\n                }}\n                onValueChange={setValue}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FdatePickerRange.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FdatePickerRange.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/dateTimePicker.demo.tsx",
        "title": "带时间的日期选择器",
        "description": "三种不同规格的带时间的日期选择器示例",
        "sourceCode": "export const meta = {\n    title: \"带时间的日期选择器\",\n    description: \"三种不同规格的带时间的日期选择器示例\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport DateTimePicker from \"../../src/dateTimePicker/index.js\";\n\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cTemporal.ZonedDateTime | null>(null);\n    const [size, setSize] = useState\u003c\"large\" | \"middle\" | \"small\">(\"middle\")\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                margin-bottom: 2rem;\n            `}\n        >\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    margin-bottom: 1rem;\n                `}\n            >\n                \u003clabel>\n                    请选择大小\n                \u003c/label>\n                \u003cselect\n                    value={size}\n                    onChange={e => setSize(e.target.value as \"large\" | \"middle\" | \"small\")}\n                >\n                    \u003coption value=\"large\">Large\u003c/option>\n                    \u003coption value=\"middle\">Middle\u003c/option>\n                    \u003coption value=\"small\">Small\u003c/option>\n                \u003c/select>\n            \u003c/div>\n            \u003cDateTimePicker\n                value={value}\n                size={size}\n                onValueChange={setValue}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FdateTimePicker.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FdateTimePicker.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/dateTimePickerPanel.demo.tsx",
        "title": "日期时间面板",
        "description": "基础的日期时间选择面板组件示例。",
        "sourceCode": "export const meta = {\n    title: \"日期时间面板\",\n    description: \"基础的日期时间选择面板组件示例。\",\n};\n\nimport DateTimePickerPanel from \"../../src/panels/dateTimePickerPanel.js\";\n\n\nconst now = Temporal.Now.zonedDateTimeISO();\n\nconst SizeDemo = () => {\n\n    return (\n        \u003cdiv>\n            \u003cDateTimePickerPanel\n                value={now}\n                weekStartDay={1}\n                range={{\n                    start: now.subtract({ days: 7 }),\n                    end: now.add({ days: 7 }),\n                }}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FdateTimePickerPanel.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FdateTimePickerPanel.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/timePicker.demo.tsx",
        "title": "时间选择器",
        "description": "三种不同规格的时间选择器示例",
        "sourceCode": "\nexport const meta = {\n    title: \"时间选择器\",\n    description: \"三种不同规格的时间选择器示例\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport TimePicker from \"../../src/timePicker/timePicker.js\";\nimport type { TimePickerPanelProps } from \"../../src/panels/timePickerPanel\";\n\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cTimePickerPanelProps[\"value\"]>();\n    const [size, setSize] = useState\u003c\"large\" | \"middle\" | \"small\">(\"middle\")\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                margin-bottom: 2rem;\n            `}\n        >\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    margin-bottom: 1rem;\n                `}\n            >\n                \u003clabel>\n                    请选择大小\n                \u003c/label>\n                \u003cselect\n                    value={size}\n                    onChange={e => setSize(e.target.value as \"large\" | \"middle\" | \"small\")}\n                >\n                    \u003coption value=\"large\">Large\u003c/option>\n                    \u003coption value=\"middle\">Middle\u003c/option>\n                    \u003coption value=\"small\">Small\u003c/option>\n                \u003c/select>\n            \u003c/div>\n            \u003cTimePicker\n                value={value}\n                size={size}\n                onValueChange={setValue}\n            />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FtimePicker.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FtimePicker.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/timePickerPanel.demo.tsx",
        "title": "时间面板",
        "description": "一个基础的时间选择面板组件",
        "sourceCode": "\nexport const meta = {\n    title: \"时间面板\",\n    description: \"一个基础的时间选择面板组件\",\n};\n\nimport { useState } from \"react\";\nimport TimePickerPanel, { type TimePickerValue } from \"../../src/panels/timePickerPanel.js\";\n\n\nconst now = Temporal.Now.zonedDateTimeISO();\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cTimePickerValue | null>({\n        hour: now.hour,\n        minute: now.minute,\n        second: now.second\n    });\n\n    return (\n        \u003cdiv\n            style={{\n                width: 150\n            }}\n        >\n            \u003cTimePickerPanel value={value} onValueChange={setValue} />\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-date-picker/workbench/?__wake_demo=docs%2Fdemos%2FtimePickerPanel.demo.tsx",
        "workbenchPath": "/components/rc-date-picker/workbench/#/components/docs%2Fdemos%2FtimePickerPanel.demo.tsx",
        "density": "regular"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "DatePicker",
    "symbol": "DatePickerProps",
    "props": [
        {
            "name": "instance",
            "required": false,
            "description": "获取实例对象",
            "typeText": "RefObject\u003cDatePickerPanelInstance | null>",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "locale",
            "required": false,
            "description": "国际化",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "onSelect",
            "required": false,
            "description": "选择的时间信息",
            "typeText": "(values: Temporal.ZonedDateTime[]) => void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "onValueChange",
            "required": false,
            "description": "改变日期的时候触发的事件",
            "typeText": "DatePickerInputProps[\"onValueChange\"]",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "range",
            "required": false,
            "description": "限制日期范围",
            "typeText": "{ start?: Temporal.ZonedDateTime; end?: Temporal.ZonedDateTime; }, /** * 时区 */ timeZone?: string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "renderDisplayString",
            "required": false,
            "description": "自定义显示的日期字符串",
            "typeText": "(value: Temporal.ZonedDateTime | null) => string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "selectValues",
            "required": false,
            "description": "选中的时间",
            "typeText": "Temporal.ZonedDateTime[]",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "size",
            "required": false,
            "description": "大小",
            "typeText": "LineEditProps[\"size\"] /** * 限制范围信息 */ range?: DatePickerPanelProps[\"range\"] /** * 时区 */ timeZone?: string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "value",
            "required": true,
            "description": "日期值",
            "typeText": "Temporal.ZonedDateTime | null",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "weekStartDay",
            "required": false,
            "description": "一周的起始天",
            "typeText": "1 | 2 | 3 | 4 | 5 | 6 | 7",
            "defaultValue": null,
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
