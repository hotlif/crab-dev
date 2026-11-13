/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "点击输入框打开可视化面板;也可直接手输表达式,回车提交(非法输入会以 error 边框提示并在失焦时回退)",
        "learning": {
            "components": [
                "CronPicker"
            ],
            "props": [
                "label",
                "supportingText",
                "defaultValue",
                "onValueChange"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"点击输入框打开可视化面板;也可直接手输表达式,回车提交(非法输入会以 error 边框提示并在失焦时回退)\",\n};\n\nimport { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport CronPicker, { describeCron, parseCron } from '../../src/index.js';\n\nconst layout = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space['component-gap']};\n    max-width: 360px;\n`;\nconst description = css`\n    font-size: ${token.typography.body.medium['font-size']};\n    color: ${token.color.text.secondary};\n`;\n\nconst BasicDemo = () => {\n    const [expression, setExpression] = useState('30 9 * * 1-5');\n    const parsed = parseCron(expression);\n\n    return (\n        \u003cdiv className={layout}>\n            \u003cCronPicker label=\"执行计划\" supportingText=\"输入五段式表达式，或在面板中设置执行时间。\" defaultValue=\"30 9 * * 1-5\" onValueChange={setExpression} />\n            \u003cdiv className={description}>\n                当前值:\u003ccode>{expression}\u003c/code>\n                {parsed ? ` —— ${describeCron(parsed)}` : null}\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-cron-picker/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-cron-picker/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "使用示例"
    },
    {
        "id": "docs/demos/controlled.demo.tsx",
        "title": "受控与常用预设",
        "description": "受控模式配合快捷预设:外部一键切换常用调度周期,面板与输入框同步跟随",
        "learning": {
            "components": [
                "Button",
                "CronPicker"
            ],
            "props": [
                "type",
                "onClick",
                "value",
                "onValueChange"
            ],
            "events": [
                "onClick",
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"受控与常用预设\",\n    description: \"受控模式配合快捷预设:外部一键切换常用调度周期,面板与输入框同步跟随\",\n};\n\nimport { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport Button from '@crab-dev/rc-button';\nimport token from '@crab-dev/rc-token-semantic';\nimport CronPicker from '../../src/index.js';\n\nconst rootStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space['stack-gap']};\n    min-inline-size: 0;\n`;\n\nconst presetsStyle = css`\n    display: flex;\n    flex-wrap: wrap;\n    gap: ${token.space['inline-gap']};\n`;\n\nconst PRESETS: Array\u003c{ label: string; value: string }> = [\n    { label: '每小时', value: '0 * * * *' },\n    { label: '每天零点', value: '0 0 * * *' },\n    { label: '工作日 9 点', value: '0 9 * * 1-5' },\n    { label: '每月 1 日', value: '0 0 1 * *' },\n];\n\nconst ControlledDemo = () => {\n    const [value, setValue] = useState('0 0 * * *');\n\n    return (\n        \u003cdiv className={rootStyle}>\n            \u003cdiv className={presetsStyle}>\n                {PRESETS.map((preset) => (\n                    \u003cButton\n                        key={preset.value}\n                        type=\"button\"\n                        onClick={() => setValue(preset.value)}\n                    >\n                        {preset.label}\n                    \u003c/Button>\n                ))}\n            \u003c/div>\n            \u003cCronPicker value={value} onValueChange={setValue} />\n        \u003c/div>\n    );\n};\n\nexport default ControlledDemo;\n",
        "previewPath": "/components/rc-cron-picker/workbench/?__wake_demo=docs%2Fdemos%2Fcontrolled.demo.tsx",
        "workbenchPath": "/components/rc-cron-picker/workbench/#/components/docs%2Fdemos%2Fcontrolled.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "使用示例"
    },
    {
        "id": "docs/demos/sizes.demo.tsx",
        "title": "尺寸与状态",
        "description": "三档尺寸、禁用态与外部校验状态;预览条数可通过 previewCount 调整或关闭",
        "learning": {
            "components": [
                "CronPicker"
            ],
            "props": [
                "size",
                "defaultValue",
                "aria-label",
                "previewCount",
                "disabled",
                "status"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"尺寸与状态\",\n    description: \"三档尺寸、禁用态与外部校验状态;预览条数可通过 previewCount 调整或关闭\",\n};\n\nimport CronPicker from '../../src/index.js';\n\nconst SizesDemo = () => (\n    \u003cdiv style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>\n        \u003cCronPicker size=\"large\" defaultValue=\"*/10 * * * *\" aria-label=\"大尺寸 Cron 表达式\" />\n        \u003cCronPicker size=\"medium\" defaultValue=\"*/10 * * * *\" aria-label=\"中尺寸 Cron 表达式\" />\n        \u003cCronPicker size=\"small\" defaultValue=\"*/10 * * * *\" aria-label=\"小尺寸 Cron 表达式\" previewCount={0} />\n        \u003cCronPicker disabled defaultValue=\"0 0 * * *\" aria-label=\"禁用的 Cron 表达式\" />\n        \u003cCronPicker status=\"warning\" defaultValue=\"0 0 * * *\" aria-label=\"警告态 Cron 表达式\" />\n    \u003c/div>\n);\n\nexport default SizesDemo;\n",
        "previewPath": "/components/rc-cron-picker/workbench/?__wake_demo=docs%2Fdemos%2Fsizes.demo.tsx",
        "workbenchPath": "/components/rc-cron-picker/workbench/#/components/docs%2Fdemos%2Fsizes.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "使用示例"
    },
    {
        "id": "docs/demos/visual-states.demo.tsx",
        "title": "只读与填充计划字段",
        "description": "只读计划可聚焦、复制和展开查看，面板控件不能修改计划；填充字段保留正常编辑和校验反馈。",
        "learning": {
            "components": [
                "CronPicker"
            ],
            "props": [
                "label",
                "value",
                "readOnly",
                "supportingText",
                "appearance",
                "defaultValue"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport CronPicker from '@crab-dev/rc-cron-picker';\nimport token from '@crab-dev/rc-token-semantic';\n\nexport const meta = {\n    title: '只读与填充计划字段',\n    description: '只读计划可聚焦、复制和展开查看，面板控件不能修改计划；填充字段保留正常编辑和校验反馈。',\n};\n\nconst layout = css`\n    display: grid;\n    gap: ${token.space['group-gap']};\n    max-width: calc(${token.size['40']} * 12);\n`;\n\nexport default function VisualStatesDemo() {\n    return \u003csection className={layout} aria-label=\"计划字段状态\">\n        \u003cdiv data-demo-state=\"outlined-readonly\">\u003cCronPicker label=\"固定执行计划\" value=\"30 9 * * 1-5\" readOnly supportingText=\"工作日上午 9:30 执行，由管理员维护。\" />\u003c/div>\n        \u003cdiv data-demo-state=\"filled-value\">\u003cCronPicker appearance=\"filled\" label=\"可编辑执行计划\" defaultValue=\"0 10 * * *\" supportingText=\"点击字段编辑计划。\" />\u003c/div>\n        \u003cdiv data-demo-state=\"filled-readonly\">\u003cCronPicker appearance=\"filled\" label=\"归档执行计划\" value=\"0 8 * * 1\" readOnly supportingText=\"每周一上午 8:00 执行。\" />\u003c/div>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-cron-picker/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-states.demo.tsx",
        "workbenchPath": "/components/rc-cron-picker/workbench/#/components/docs%2Fdemos%2Fvisual-states.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "使用示例"
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "计划编辑状态矩阵",
        "description": "真实文本草稿、五段式规则面板与只读查看，预览使用固定日期采集。",
        "learning": {
            "components": [
                "CronPicker"
            ],
            "props": [
                "label",
                "aria-label",
                "value",
                "onValueChange",
                "disabled",
                "readOnly",
                "status",
                "supportingText",
                "previewCount",
                "appearance"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport CronPicker from '@crab-dev/rc-cron-picker';\nimport { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useId, useState } from 'react';\n\nexport const meta = { title: '计划编辑状态矩阵', description: '真实文本草稿、五段式规则面板与只读查看，预览使用固定日期采集。' };\nconst frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; max-width: calc(${token.size[40]} * 14); min-width: 0;`;\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const [state, setState] = useState('default');\n    const [value, setValue] = useState('30 9 * * 1-5');\n    const id = useId();\n    const english = locale === 'en-US';\n    return \u003csection className={frame} aria-label=\"CronPicker visual matrix\" data-visual-scene data-state={state}>\n        \u003cdiv>\u003clabel htmlFor={id}>验收状态\u003c/label>{' '}\u003cselect id={id} value={state} onChange={event => setState(event.currentTarget.value)}>{['default', 'disabled', 'read-only', 'warning'].map(item => \u003coption key={item}>{item}\u003c/option>)}\u003c/select>\u003c/div>\n        \u003cCronPicker label={english ? 'Execution schedule' : '执行计划'} aria-label=\"执行计划\" value={value} onValueChange={setValue} disabled={state === 'disabled'} readOnly={state === 'read-only'} status={state === 'warning' ? 'warning' : undefined} supportingText={english ? 'Five fields: minute, hour, day, month, weekday.' : '五段式：分、时、日、月、周。'} previewCount={3} />\n        \u003cCronPicker appearance=\"filled\" label={english ? 'Archived schedule' : '归档计划'} aria-label=\"归档计划\" value=\"0 8 * * 1\" readOnly previewCount={0} />\n        \u003coutput aria-live=\"polite\">{value}\u003c/output>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-cron-picker/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-cron-picker/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "视觉验收"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "以清晰的时间字段和语义分组编辑周期任务表达式，是时间选择模式的项目扩展。",
        "usage": "将周期选择与最终表达式一同呈现，保存动作要明确说明任务执行频率。",
        "exampleDescription": "选择任务周期并读取表达式，观察分组字段和主要操作之间的层级。",
        "demos": [
            "basic.demo.tsx",
            "controlled.demo.tsx",
            "sizes.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/text-fields/overview",
            "https://material-web.dev/components/select/",
            "https://github.com/material-components/material-web/tree/main/select"
        ]
    },
    "macos": {
        "summary": "以桌面设置面板的紧凑字段组织任务周期，让重复执行规则容易检查。",
        "usage": "在设置表单中保留表达式预览；复杂周期需要提供可读的业务说明。",
        "exampleDescription": "修改受控周期并观察外部结果，检查设置保存前后的值是否一致。",
        "demos": [
            "controlled.demo.tsx",
            "basic.demo.tsx",
            "sizes.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "以中性字段、简洁分区和文本结果构成周期编辑器，适合管理后台。",
        "usage": "表达式编辑是本库组合能力，应让用户能核对生成结果及任务含义。",
        "exampleDescription": "比较不同尺寸下的周期字段，确认密集表单中的标签和结果仍可读。",
        "demos": [
            "sizes.demo.tsx",
            "basic.demo.tsx",
            "controlled.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "CronPicker 用分段表单帮助用户配置周期、日期和时间，再生成 Cron 表达式。它把难懂的机器语法转为可检查的人类语言，但最终调度能力仍取决于服务端所采用的 Cron 方言。",
    "useWhen": [
        "定时任务需要由非专业用户配置常见周期。",
        "既要提供可视化编辑，也要让高级用户核对表达式。"
    ],
    "avoidWhen": [
        "只有几个固定计划时用 Radio 或 Select；涉及复杂日历例外时应使用专门的日程规则界面。"
    ],
    "essentials": [
        "先确认后端支持的字段数、时区和特殊字符。",
        "受控 value 与可读摘要必须同步，不能只显示一串表达式。",
        "无效组合要在具体字段附近解释原因，并阻止提交错误规则。"
    ],
    "accessibility": [
        "每个分段字段都要有 label、说明和错误关联，分组名称说明当前配置哪一部分。",
        "时间与星期不能只用缩写，需提供可读文本并明确时区。"
    ]
} as const;
