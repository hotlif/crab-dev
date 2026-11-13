/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "最简单的 Checkbox 用法",
        "learning": {
            "components": [
                "Checkbox"
            ],
            "props": [
                "checked",
                "onCheckedChange"
            ],
            "events": [
                "onCheckedChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"最简单的 Checkbox 用法\",\n};\n\nimport { useState } from \"react\";\nimport Checkbox from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    const [checked, setChecked] = useState(false);\n\n    return (\n        \u003cCheckbox\n            checked={checked}\n            onCheckedChange={(val) => setChecked(val)}\n        >\n            Checkbox\n        \u003c/Checkbox>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-checkbox/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-checkbox/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/designs.demo.tsx",
        "title": "当前主题的交互状态",
        "description": "观察当前主题下的选中、禁用和焦点反馈；示例继承文档配置，可直接操作。",
        "learning": {
            "components": [
                "ConfigProvider",
                "Checkbox"
            ],
            "props": [
                "designSystem",
                "defaultChecked",
                "indeterminate",
                "disabled",
                "aria-invalid",
                "aria-describedby"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { useId } from 'react';\nimport { css } from '@crab-dev/css';\nimport ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';\nimport token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';\nimport Checkbox from '@crab-dev/rc-checkbox';\n\nexport const meta = { title: '当前主题的交互状态', description: '观察当前主题下的选中、禁用和焦点反馈；示例继承文档配置，可直接操作。' };\nconst panel = css`\n    display: grid;\n    gap: ${token.space['component-gap']};\n    padding: ${token.space['section-gap']};\n    color: ${token.color.text.primary};\n    background: ${token.color.surface.content};\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: ${token.radius.md};\n`;\nconst stack = css`display: grid; gap: ${token.space['stack-gap']};`;\nexport default function DesignsDemo() {\n    const { designSystem: design } = useConfig();\n    const errorId = useId();\n    return \u003cdiv className={stack}>\n        \u003cConfigProvider designSystem={design}>\n            \u003csection className={panel} aria-label={`${design} 复选框`}>\n                \u003cstrong>{designSystemRegistry[design].label}\u003c/strong>\n                \u003cCheckbox>未选中\u003c/Checkbox>\n                \u003cCheckbox defaultChecked>已选中\u003c/Checkbox>\n                \u003cCheckbox indeterminate>部分选中\u003c/Checkbox>\n                \u003cCheckbox disabled>不可用\u003c/Checkbox>\n                \u003cCheckbox defaultChecked disabled>已选中且不可用\u003c/Checkbox>\n                \u003cCheckbox aria-invalid=\"true\" aria-describedby={`${errorId}-${design}`}>同意使用条款\u003c/Checkbox>\n                \u003csmall id={`${errorId}-${design}`}>请勾选条款后继续。\u003c/small>\n            \u003c/section>\n        \u003c/ConfigProvider>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-checkbox/workbench/?__wake_demo=docs%2Fdemos%2Fdesigns.demo.tsx",
        "workbenchPath": "/components/rc-checkbox/workbench/#/components/docs%2Fdemos%2Fdesigns.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用状态",
        "description": "添加 `disabled` 属性即可让复选框处于禁用状态",
        "learning": {
            "components": [
                "Checkbox"
            ],
            "props": [
                "disabled",
                "checked"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"禁用状态\",\n    description: \"添加 `disabled` 属性即可让复选框处于禁用状态\",\n};\n\nimport Checkbox from \"../../src/index.js\";\n\nconst DisabledDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cCheckbox disabled>未选中禁用\u003c/Checkbox>\n            \u003cbr />\n            \u003cbr />\n            \u003cCheckbox disabled checked>选中禁用\u003c/Checkbox>\n        \u003c/div>\n    );\n};\n\nexport default DisabledDemo;\n",
        "previewPath": "/components/rc-checkbox/workbench/?__wake_demo=docs%2Fdemos%2Fdisabled.demo.tsx",
        "workbenchPath": "/components/rc-checkbox/workbench/#/components/docs%2Fdemos%2Fdisabled.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/group.demo.tsx",
        "title": "复选框组",
        "description": "使用 `CheckboxGroup` 管理一组复选框的状态",
        "learning": {
            "components": [
                "CheckboxGroup",
                "Checkbox"
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
        "sourceCode": "export const meta = {\n    title: \"复选框组\",\n    description: \"使用 `CheckboxGroup` 管理一组复选框的状态\",\n};\n\nimport { useState } from \"react\";\nimport Checkbox, { CheckboxGroup } from \"../../src/index.js\";\n\nconst GroupDemo = () => {\n    const [value, setValue] = useState\u003cArray\u003cstring | number>>([\"apple\"]);\n\n    return (\n        \u003cdiv>\n            \u003cCheckboxGroup value={value} onValueChange={setValue}>\n                \u003cCheckbox value=\"apple\">苹果\u003c/Checkbox>\n                \u003cCheckbox value=\"banana\">香蕉\u003c/Checkbox>\n                \u003cCheckbox value=\"orange\">橘子\u003c/Checkbox>\n            \u003c/CheckboxGroup>\n            \u003cp>当前选中: {value.join(\", \")}\u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default GroupDemo;\n",
        "previewPath": "/components/rc-checkbox/workbench/?__wake_demo=docs%2Fdemos%2Fgroup.demo.tsx",
        "workbenchPath": "/components/rc-checkbox/workbench/#/components/docs%2Fdemos%2Fgroup.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/indeterminate.demo.tsx",
        "title": "半选状态",
        "description": "使用 `indeterminate` 属性表示半选状态, 常用于全选/全不选场景",
        "learning": {
            "components": [
                "Checkbox",
                "CheckboxGroup"
            ],
            "props": [
                "checked",
                "indeterminate",
                "onCheckedChange",
                "value",
                "onValueChange"
            ],
            "events": [
                "onCheckedChange",
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"半选状态\",\n    description: \"使用 `indeterminate` 属性表示半选状态, 常用于全选/全不选场景\",\n};\n\nimport { useState } from \"react\";\nimport Checkbox, { CheckboxGroup } from \"../../src/index.js\";\n\nconst options = [\"苹果\", \"香蕉\", \"橘子\"];\n\nconst IndeterminateDemo = () => {\n    const [value, setValue] = useState\u003cArray\u003cstring | number>>([\"苹果\"]);\n\n    const allChecked = value.length === options.length;\n    const indeterminate = value.length > 0 && !allChecked;\n\n    const handleCheckAll = (checked: boolean) => {\n        setValue(checked ? [...options] : []);\n    };\n\n    return (\n        \u003cdiv>\n            \u003cCheckbox\n                checked={allChecked}\n                indeterminate={indeterminate}\n                onCheckedChange={handleCheckAll}\n            >\n                全选\n            \u003c/Checkbox>\n            \u003cbr />\n            \u003cbr />\n            \u003cCheckboxGroup value={value} onValueChange={setValue}>\n                {options.map((opt) => (\n                    \u003cCheckbox key={opt} value={opt}>\n                        {opt}\n                    \u003c/Checkbox>\n                ))}\n            \u003c/CheckboxGroup>\n        \u003c/div>\n    );\n};\n\nexport default IndeterminateDemo;\n",
        "previewPath": "/components/rc-checkbox/workbench/?__wake_demo=docs%2Fdemos%2Findeterminate.demo.tsx",
        "workbenchPath": "/components/rc-checkbox/workbench/#/components/docs%2Fdemos%2Findeterminate.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "复选框尺寸",
        "description": "通过 `size` 属性设置复选框尺寸, 支持 `large`、`medium`、`small` 三种",
        "learning": {
            "components": [
                "CheckboxGroup",
                "Checkbox"
            ],
            "props": [
                "value",
                "onValueChange",
                "size"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"复选框尺寸\",\n    description: \"通过 `size` 属性设置复选框尺寸, 支持 `large`、`medium`、`small` 三种\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Checkbox, { CheckboxGroup } from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cArray\u003cstring | number>>([]);\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1rem;\n            `}\n        >\n            \u003cCheckboxGroup value={value} onValueChange={setValue} size=\"large\">\n                \u003cCheckbox value=\"a\">Large A\u003c/Checkbox>\n                \u003cCheckbox value=\"b\">Large B\u003c/Checkbox>\n            \u003c/CheckboxGroup>\n            \u003cCheckboxGroup value={value} onValueChange={setValue} size=\"medium\">\n                \u003cCheckbox value=\"a\">Middle A\u003c/Checkbox>\n                \u003cCheckbox value=\"b\">Middle B\u003c/Checkbox>\n            \u003c/CheckboxGroup>\n            \u003cCheckboxGroup value={value} onValueChange={setValue} size=\"small\">\n                \u003cCheckbox value=\"a\">Small A\u003c/Checkbox>\n                \u003cCheckbox value=\"b\">Small B\u003c/Checkbox>\n            \u003c/CheckboxGroup>\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-checkbox/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-checkbox/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系状态矩阵",
        "description": "真实输入对照默认、选择、错误、禁用和键盘焦点；切换外观保留选择。",
        "learning": {
            "components": [
                "Checkbox"
            ],
            "props": [
                "aria-label",
                "checked",
                "onCheckedChange",
                "disabled",
                "aria-invalid",
                "aria-describedby",
                "indeterminate"
            ],
            "events": [
                "onCheckedChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from \"@crab-dev/css\";\nimport Checkbox from \"@crab-dev/rc-checkbox\";\nimport { useConfig } from \"@crab-dev/rc-config-provider\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useId, useState } from \"react\";\n\nexport const meta = {\n    title: \"三体系状态矩阵\",\n    description: \"真实输入对照默认、选择、错误、禁用和键盘焦点；切换外观保留选择。\",\n};\nconst scene = css`\n    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};\n    max-inline-size: 36rem; color: ${token.color.text.primary}; background: ${token.color.background.surface};\n`;\nconst samples = css`\n    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};\n    min-inline-size: 0; overflow-wrap: anywhere;\n`;\nconst states = [\"default\",\"hover\",\"focus-visible\",\"pressed\",\"selected\",\"selected-hover\",\"selected-focus-visible\",\"selected-pressed\",\"error\",\"selected-error\",\"disabled\",\"disabled-selected\",\"indeterminate\",\"indeterminate-error\",\"disabled-indeterminate\"] as const;\n\nexport default function VisualMatrixDemo() {\n    const { size, locale } = useConfig();\n    const [state, setState] = useState\u003ctypeof states[number]>(\"default\");\n    const [checked, setChecked] = useState(false);\n    const id = useId();\n    const english = locale === \"en-US\";\n    const effectiveChecked = state === \"disabled-selected\" || checked;\n    const indeterminate = state.includes(\"indeterminate\");\n    const booleanSelection = effectiveChecked ? \"on\" : \"off\";\n    const selection = indeterminate ? \"mixed\" : booleanSelection;\n    return \u003csection className={scene} aria-label=\"Checkbox visual matrix\" data-visual-scene data-size={size} data-state={state}>\n        \u003cdiv>\u003clabel htmlFor={id}>验收状态\u003c/label>{\" \"}\u003cselect id={id} value={state} onChange={event => {\n            const next = event.currentTarget.value;\n            if (states.some(item => item === next)) setState(next as typeof state);\n        }}>{states.map(item => \u003coption key={item}>{item}\u003c/option>)}\u003c/select>\u003c/div>\n        \u003cdiv className={samples} data-visual-frame>\n            \u003cCheckbox aria-label=\"Primary option\" checked={effectiveChecked}\n                onCheckedChange={setChecked} disabled={state.startsWith(\"disabled\")}\n                aria-invalid={state.includes(\"error\") || undefined}\n                aria-describedby={state.includes(\"error\") ? id + \"-error\" : undefined}\n                indeterminate={indeterminate}\n            >{english ? \"Include archived projects and keep this selection when changing themes\" : \"包含归档项目，并在切换主题时保留选择\"}\u003c/Checkbox>\n            \u003cCheckbox checked disabled aria-label=\"Unavailable selected option\">{english ? \"Selected · unavailable\" : \"已选择 · 暂不可用\"}\u003c/Checkbox>\n            {state.includes(\"error\") && \u003cspan id={id + \"-error\"} role=\"alert\">{english ? \"Review this selection before applying changes.\" : \"应用更改前请核对这一选择。\"}\u003c/span>}\n            \u003coutput aria-live=\"polite\">{english ? \"Selection\" : \"当前选择\"}: {selection}{indeterminate && (english ? ` (boolean: ${booleanSelection})` : `（半选，布尔值: ${booleanSelection}）`)}\u003c/output>\n        \u003c/div>\n    \u003c/section>;\n}\n\n",
        "previewPath": "/components/rc-checkbox/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-checkbox/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/visual-states.demo.tsx",
        "title": "禁用与半选组合",
        "description": "对照未选中、选中和半选的禁用表现；禁用项不可通过鼠标或键盘改变。",
        "learning": {
            "components": [
                "Checkbox"
            ],
            "props": [
                "disabled",
                "checked",
                "indeterminate"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport Checkbox from '@crab-dev/rc-checkbox';\nimport token from '@crab-dev/rc-token-semantic';\n\nexport const meta = {\n    title: '禁用与半选组合',\n    description: '对照未选中、选中和半选的禁用表现；禁用项不可通过鼠标或键盘改变。',\n};\n\nconst layout = css`\n    display: grid;\n    gap: ${token.space['group-gap']};\n`;\n\nexport default function VisualStatesDemo() {\n    return \u003csection className={layout} aria-label=\"禁用复选框状态\">\n        \u003cdiv data-demo-state=\"unchecked-disabled\">\u003cCheckbox disabled>未选中且不可用\u003c/Checkbox>\u003c/div>\n        \u003cdiv data-demo-state=\"checked-disabled\">\u003cCheckbox checked disabled>已选中且不可用\u003c/Checkbox>\u003c/div>\n        \u003cdiv data-demo-state=\"mixed-disabled\">\u003cCheckbox indeterminate disabled>部分选中且不可用\u003c/Checkbox>\u003c/div>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-checkbox/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-states.demo.tsx",
        "workbenchPath": "/components/rc-checkbox/workbench/#/components/docs%2Fdemos%2Fvisual-states.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "使用选中色、勾选与半选标记表达多选，状态层与焦点区分当前交互。",
        "usage": "半选表示集合中部分项目已选；错误还需要关联说明，不能仅让方框变色。",
        "exampleDescription": "用 Tab 和空格切换复选框，观察勾选、半选、错误及禁用状态。",
        "demos": [
            "designs.demo.tsx",
            "basic.demo.tsx",
            "disabled.demo.tsx",
            "group.demo.tsx",
            "indeterminate.demo.tsx",
            "size.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/checkbox/overview",
            "https://material-web.dev/components/checkbox/",
            "https://github.com/material-components/material-web/tree/main/checkbox"
        ]
    },
    "macos": {
        "summary": "以紧凑方框和清晰勾选标记适配桌面设置列表，选中状态使用强调色。",
        "usage": "保持方框与说明精确对齐；组合设置中的半选需要能解释其对应的子项。",
        "exampleDescription": "选择部分子项后查看父项半选，再核对紧凑控件的标签与焦点。",
        "demos": [
            "indeterminate.demo.tsx",
            "basic.demo.tsx",
            "designs.demo.tsx",
            "disabled.demo.tsx",
            "group.demo.tsx",
            "size.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "以细描边方框、对比勾选和简洁焦点轮廓表达多项选择。",
        "usage": "在表单或列表中保持标签可点击，分组的总选与单项选择要有清楚关系。",
        "exampleDescription": "操作复选组并读取选中结果，再比较禁用项目与正常项目的边界。",
        "demos": [
            "group.demo.tsx",
            "basic.demo.tsx",
            "designs.demo.tsx",
            "disabled.demo.tsx",
            "indeterminate.demo.tsx",
            "size.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Checkbox 表示一个可以独立开关的选择；CheckboxGroup 管理多个可同时选择的值。indeterminate 表示一组子项只选中了一部分，不是第三个可提交值。",
    "useWhen": [
        "用户可以从多个选项中选择任意数量。",
        "需要全选/部分选择父子关系，或接受一项非即时生效的确认。"
    ],
    "avoidWhen": [
        "只能选一个时使用 Radio；设置切换后立即生效时优先使用 Switch。"
    ],
    "essentials": [
        "受控模式由 checked 与 onValueChange 共同组成，不能只传 checked。",
        "组内每项 value 必须稳定且唯一，显示标签应能单独理解。",
        "父级 indeterminate 要从子项计算，并在点击后明确转为全选或全不选。"
    ],
    "accessibility": [
        "每个框都要与可点击标签关联，整组使用 fieldset/legend 或等价的组名称。",
        "错误、必填和禁用原因应通过文字传达，焦点指示不能被容器裁掉。"
    ]
} as const;
