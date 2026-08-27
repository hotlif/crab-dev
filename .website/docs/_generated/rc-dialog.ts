/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "基本",
        "description": "一个基础的对话框",
        "sourceCode": "\nexport const meta = {\n    title: \"基本\",\n    description: \"一个基础的对话框\",\n};\n\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\n\nimport Dialog from \"../../src/index.js\";\n\n\nconst BaseDemo = () => {\n    const [open, setOpen] = useState(false)\n    return (\n        \u003c>\n            \u003cDialog\n                title=\"基本对话框\"\n                open={open}\n                onOpenChange={setOpen}\n            >\n                这是一个基础的对话框信息\n            \u003c/Dialog>\n            \u003cButton\n                onClick={() => {\n                    setOpen(true)\n                }}\n            >\n                打开对话框\n            \u003c/Button>\n        \u003c/>\n    )\n}\n\nexport default BaseDemo;\n",
        "previewPath": "/components/rc-dialog/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-dialog/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/formWithDatePicker.demo.tsx",
        "title": "表单 + 日期选择器",
        "description": "在对话框中嵌入 rc-form 表单与 rc-date-picker 日期选择器，用对话框的「确定」按钮触发表单校验：校验通过才关闭，失败则保持打开。",
        "sourceCode": "\nexport const meta = {\n    title: \"表单 + 日期选择器\",\n    description: \"在对话框中嵌入 rc-form 表单与 rc-date-picker 日期选择器，用对话框的「确定」按钮触发表单校验：校验通过才关闭，失败则保持打开。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState, type FC } from \"react\";\n\nimport Button from \"@crab-dev/rc-button\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport { DatePicker } from \"@crab-dev/rc-date-picker\";\nimport Form, { Item, useForm } from \"@crab-dev/rc-form\";\nimport type { FormItemEditor } from \"@crab-dev/rc-form\";\n\nimport Dialog from \"../../src/index.js\";\n\n// rc-date-picker 基于 Temporal，直接复用其全局 Temporal 类型。\ninterface AppointmentForm extends Record\u003cstring, unknown> {\n    name: string;\n    date: Temporal.ZonedDateTime | null;\n}\n\n// ---------- 适配器：把 crab-dev 组件包装成 FormItemEditor ----------\n\nconst LineEditField: FC\u003cFormItemEditor\u003cstring> & { placeholder?: string }> = ({\n    value,\n    onChange,\n    placeholder,\n}) => (\n    \u003cLineEdit\n        value={value ?? \"\"}\n        className={css`width: 100%;`}\n        placeholder={placeholder}\n        onChange={(e) => onChange?.(e.target.value)}\n    />\n);\n\nconst DatePickerField: FC\u003cFormItemEditor\u003cTemporal.ZonedDateTime | null>> = ({ value, onChange }) => (\n    \u003cDatePicker\n        value={value ?? null}\n        renderDisplayString={(current) => (current ? current.toPlainDate().toString() : \"请选择日期\")}\n        onValueChange={(next) => onChange?.(next)}\n    />\n);\n\n// ---------- 样式 ----------\n\nconst formStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 4px;\n    min-width: 320px;\n`;\n\nconst FormWithDatePickerDemo = () => {\n    const [open, setOpen] = useState(false);\n    const [form] = useForm\u003cAppointmentForm>();\n\n    return (\n        \u003c>\n            \u003cDialog\n                title=\"预约信息\"\n                open={open}\n                onOpenChange={setOpen}\n                onConfirm={async () => {\n                    try {\n                        const values = await form.validateFields();\n                        console.log(\"[submit:success]\", values);\n                        return true; // 校验通过 → 关闭对话框\n                    } catch (error) {\n                        console.warn(\"[submit:failed]\", error);\n                        return false; // 校验失败 → 保持打开\n                    }\n                }}\n            >\n                \u003cForm\n                    className={formStyle}\n                    form={form}\n                    defaultValue={{ name: \"\", date: null }}\n                >\n                    \u003cItem label=\"姓名\" name=\"name\" required>\n                        \u003cLineEditField placeholder=\"请输入姓名\" />\n                    \u003c/Item>\n                    \u003cItem label=\"预约日期\" name=\"date\" required>\n                        \u003cDatePickerField />\n                    \u003c/Item>\n                \u003c/Form>\n            \u003c/Dialog>\n            \u003cButton onClick={() => setOpen(true)}>打开预约对话框\u003c/Button>\n        \u003c/>\n    );\n};\n\nexport default FormWithDatePickerDemo;\n",
        "previewPath": "/components/rc-dialog/workbench/?__wake_demo=docs%2Fdemos%2FformWithDatePicker.demo.tsx",
        "workbenchPath": "/components/rc-dialog/workbench/#/components/docs%2Fdemos%2FformWithDatePicker.demo.tsx",
        "density": "regular"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "Dialog",
    "symbol": "DialogProps",
    "props": [
        {
            "name": "i18n",
            "required": false,
            "description": "国际化内容",
            "typeText": "DialogI18n",
            "defaultValue": "{}",
            "deprecated": false
        },
        {
            "name": "onConfirm",
            "required": false,
            "description": "确定按钮点击时触发的事件，返回 `false` 则保持对话框打开，其余情况关闭",
            "typeText": "DialogResultHandler /** * 取消按钮点击时触发的事件，返回 `false` 则保持对话框打开，其余情况关闭 */ onCancel?: DialogResultHandler",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "open",
            "required": true,
            "description": "是否开启",
            "typeText": "boolean",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "ref",
            "required": false,
            "description": "对话框根元素（原生 dialog）的 ref",
            "typeText": "Ref\u003cHTMLDialogElement>",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "shouldResetContent",
            "required": false,
            "description": "是否在关闭的时候重置内容",
            "typeText": "boolean /** * 点击遮罩（对话框外部区域）是否触发取消并关闭，默认 `false` */ maskClosable?: boolean /** * 状态发生改变的时候触发的事件 */ onOpenChange: (open: boolean) => void",
            "defaultValue": "true",
            "deprecated": false
        },
        {
            "name": "title",
            "required": false,
            "description": "标题",
            "typeText": "ReactNode",
            "defaultValue": null,
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
