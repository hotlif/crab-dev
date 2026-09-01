/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "点击输入框打开可视化面板;也可直接手输表达式,回车提交(非法输入会以 error 边框提示并在失焦时回退)",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"点击输入框打开可视化面板;也可直接手输表达式,回车提交(非法输入会以 error 边框提示并在失焦时回退)\",\n};\n\nimport { useState } from 'react';\nimport CronPicker, { describeCron, parseCron } from '../../src/index.js';\n\nconst BasicDemo = () => {\n    const [expression, setExpression] = useState('30 9 * * 1-5');\n    const parsed = parseCron(expression);\n\n    return (\n        \u003cdiv style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>\n            \u003cCronPicker defaultValue=\"30 9 * * 1-5\" onChange={setExpression} />\n            \u003cdiv style={{ fontSize: 13, color: '#666' }}>\n                当前值:\u003ccode>{expression}\u003c/code>\n                {parsed ? ` —— ${describeCron(parsed)}` : null}\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-cron-picker/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-cron-picker/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/controlled.demo.tsx",
        "title": "受控与常用预设",
        "description": "受控模式配合快捷预设:外部一键切换常用调度周期,面板与输入框同步跟随",
        "sourceCode": "export const meta = {\n    title: \"受控与常用预设\",\n    description: \"受控模式配合快捷预设:外部一键切换常用调度周期,面板与输入框同步跟随\",\n};\n\nimport { useState } from 'react';\nimport CronPicker from '../../src/index.js';\n\nconst PRESETS: Array\u003c{ label: string; value: string }> = [\n    { label: '每小时', value: '0 * * * *' },\n    { label: '每天零点', value: '0 0 * * *' },\n    { label: '工作日 9 点', value: '0 9 * * 1-5' },\n    { label: '每月 1 日', value: '0 0 1 * *' },\n];\n\nconst ControlledDemo = () => {\n    const [value, setValue] = useState('0 0 * * *');\n\n    return (\n        \u003cdiv style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>\n            \u003cdiv style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>\n                {PRESETS.map((preset) => (\n                    \u003cbutton\n                        key={preset.value}\n                        type=\"button\"\n                        style={{ padding: '2px 10px', cursor: 'pointer' }}\n                        onClick={() => setValue(preset.value)}\n                    >\n                        {preset.label}\n                    \u003c/button>\n                ))}\n            \u003c/div>\n            \u003cCronPicker value={value} onChange={setValue} />\n        \u003c/div>\n    );\n};\n\nexport default ControlledDemo;\n",
        "previewPath": "/components/rc-cron-picker/workbench/?__wake_demo=docs%2Fdemos%2Fcontrolled.demo.tsx",
        "workbenchPath": "/components/rc-cron-picker/workbench/#/components/docs%2Fdemos%2Fcontrolled.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/sizes.demo.tsx",
        "title": "尺寸与状态",
        "description": "三档尺寸、禁用态与外部校验状态;预览条数可通过 previewCount 调整或关闭",
        "sourceCode": "export const meta = {\n    title: \"尺寸与状态\",\n    description: \"三档尺寸、禁用态与外部校验状态;预览条数可通过 previewCount 调整或关闭\",\n};\n\nimport CronPicker from '../../src/index.js';\n\nconst SizesDemo = () => (\n    \u003cdiv style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>\n        \u003cCronPicker size=\"large\" defaultValue=\"*/10 * * * *\" aria-label=\"大尺寸 Cron 表达式\" />\n        \u003cCronPicker size=\"middle\" defaultValue=\"*/10 * * * *\" aria-label=\"中尺寸 Cron 表达式\" />\n        \u003cCronPicker size=\"small\" defaultValue=\"*/10 * * * *\" aria-label=\"小尺寸 Cron 表达式\" previewCount={0} />\n        \u003cCronPicker disabled defaultValue=\"0 0 * * *\" aria-label=\"禁用的 Cron 表达式\" />\n        \u003cCronPicker status=\"warning\" defaultValue=\"0 0 * * *\" aria-label=\"警告态 Cron 表达式\" />\n    \u003c/div>\n);\n\nexport default SizesDemo;\n",
        "previewPath": "/components/rc-cron-picker/workbench/?__wake_demo=docs%2Fdemos%2Fsizes.demo.tsx",
        "workbenchPath": "/components/rc-cron-picker/workbench/#/components/docs%2Fdemos%2Fsizes.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
