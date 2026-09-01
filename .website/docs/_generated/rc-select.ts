/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "单选模式下的基础选择",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"单选模式下的基础选择\",\n};\n\nimport Select from '../../src/index.js';\n\nconst options = Array.from({ length: 1000 }, (_, i) => ({\n    label: `City ${i + 1}`,\n    value: `city-${i + 1}`,\n}));\n\nconst BasicDemo = () => {\n    return \u003cSelect aria-label=\"city\" options={options} placeholder=\"请选择城市\" />;\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-select/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-select/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与状态"
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "尺寸",
        "description": "提供 large、middle、small 三种尺寸",
        "sourceCode": "export const meta = {\n    title: \"尺寸\",\n    description: \"提供 large、middle、small 三种尺寸\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Select from '../../src/index.js';\n\nconst containerStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    max-width: 320px;\n`;\n\nconst options = [\n    { label: '选项一', value: '1' },\n    { label: '选项二', value: '2' },\n    { label: '选项三', value: '3' },\n];\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv className={containerStyle}>\n            \u003cSelect aria-label=\"large\" size=\"large\" options={options} placeholder=\"Large\" />\n            \u003cSelect aria-label=\"middle\" size=\"middle\" options={options} placeholder=\"Middle (默认)\" />\n            \u003cSelect aria-label=\"small\" size=\"small\" options={options} placeholder=\"Small\" />\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-select/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-select/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与状态"
    },
    {
        "id": "docs/demos/status.demo.tsx",
        "title": "校验状态",
        "description": "设置 status 以展示 error 或 warning 状态",
        "sourceCode": "export const meta = {\n    title: \"校验状态\",\n    description: \"设置 status 以展示 error 或 warning 状态\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Select from '../../src/index.js';\n\nconst containerStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    max-width: 320px;\n`;\n\nconst options = [\n    { label: '选项一', value: '1' },\n    { label: '选项二', value: '2' },\n    { label: '选项三', value: '3' },\n];\n\nconst StatusDemo = () => {\n    return (\n        \u003cdiv className={containerStyle}>\n            \u003cSelect aria-label=\"error\" status=\"error\" options={options} placeholder=\"Error 状态\" />\n            \u003cSelect aria-label=\"warning\" status=\"warning\" options={options} placeholder=\"Warning 状态\" />\n        \u003c/div>\n    );\n};\n\nexport default StatusDemo;\n",
        "previewPath": "/components/rc-select/workbench/?__wake_demo=docs%2Fdemos%2Fstatus.demo.tsx",
        "workbenchPath": "/components/rc-select/workbench/#/components/docs%2Fdemos%2Fstatus.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与状态"
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用",
        "description": "设置 disabled 禁用整个选择器，或在选项中设置 disabled 禁用单个选项",
        "sourceCode": "export const meta = {\n    title: \"禁用\",\n    description: \"设置 disabled 禁用整个选择器，或在选项中设置 disabled 禁用单个选项\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Select from '../../src/index.js';\n\nconst containerStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    max-width: 320px;\n`;\n\nconst DisabledDemo = () => {\n    return (\n        \u003cdiv className={containerStyle}>\n            \u003cSelect\n                aria-label=\"disabled-all\"\n                disabled\n                defaultValue=\"1\"\n                options={[\n                    { label: '选项一', value: '1' },\n                    { label: '选项二', value: '2' },\n                ]}\n                placeholder=\"整体禁用\"\n            />\n            \u003cSelect\n                aria-label=\"disabled-option\"\n                options={[\n                    { label: '可选', value: '1' },\n                    { label: '禁用选项', value: '2', disabled: true },\n                    { label: '可选', value: '3' },\n                ]}\n                placeholder=\"部分选项禁用\"\n            />\n        \u003c/div>\n    );\n};\n\nexport default DisabledDemo;\n",
        "previewPath": "/components/rc-select/workbench/?__wake_demo=docs%2Fdemos%2Fdisabled.demo.tsx",
        "workbenchPath": "/components/rc-select/workbench/#/components/docs%2Fdemos%2Fdisabled.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与状态"
    },
    {
        "id": "docs/demos/loading.demo.tsx",
        "title": "加载中",
        "description": "设置 loading 展示加载状态",
        "sourceCode": "export const meta = {\n    title: \"加载中\",\n    description: \"设置 loading 展示加载状态\",\n};\n\nimport { useState } from 'react';\nimport Select from '../../src/index.js';\nimport type { SelectOption } from '../../src/index.js';\n\nconst LoadingDemo = () => {\n    const [loading, setLoading] = useState(true);\n    const [options, setOptions] = useState\u003cSelectOption[]>([]);\n\n    const handleOpenChange = (open: boolean) => {\n        if (open && options.length === 0) {\n            setLoading(true);\n            setTimeout(() => {\n                setOptions([\n                    { label: '异步选项一', value: '1' },\n                    { label: '异步选项二', value: '2' },\n                    { label: '异步选项三', value: '3' },\n                ]);\n                setLoading(false);\n            }, 1500);\n        }\n    };\n\n    return (\n        \u003cSelect\n            aria-label=\"loading\"\n            loading={loading}\n            options={options}\n            onOpenChange={handleOpenChange}\n            placeholder=\"点击加载选项\"\n        />\n    );\n};\n\nexport default LoadingDemo;\n",
        "previewPath": "/components/rc-select/workbench/?__wake_demo=docs%2Fdemos%2Floading.demo.tsx",
        "workbenchPath": "/components/rc-select/workbench/#/components/docs%2Fdemos%2Floading.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与状态"
    },
    {
        "id": "docs/demos/allowClear.demo.tsx",
        "title": "可清除",
        "description": "设置 allowClear 允许一键清空已选值",
        "sourceCode": "export const meta = {\n    title: \"可清除\",\n    description: \"设置 allowClear 允许一键清空已选值\",\n};\n\nimport Select from '../../src/index.js';\n\nconst options = [\n    { label: '北京', value: 'beijing' },\n    { label: '上海', value: 'shanghai' },\n    { label: '广州', value: 'guangzhou' },\n    { label: '深圳', value: 'shenzhen' },\n];\n\nconst AllowClearDemo = () => {\n    return (\n        \u003cSelect\n            aria-label=\"clearable\"\n            allowClear\n            defaultValue=\"beijing\"\n            options={options}\n            placeholder=\"请选择城市\"\n        />\n    );\n};\n\nexport default AllowClearDemo;\n",
        "previewPath": "/components/rc-select/workbench/?__wake_demo=docs%2Fdemos%2FallowClear.demo.tsx",
        "workbenchPath": "/components/rc-select/workbench/#/components/docs%2Fdemos%2FallowClear.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与状态"
    },
    {
        "id": "docs/demos/group.demo.tsx",
        "title": "分组选项",
        "description": "使用 { label, options } 结构对选项进行分组",
        "sourceCode": "export const meta = {\n    title: \"分组选项\",\n    description: \"使用 { label, options } 结构对选项进行分组\",\n};\n\nimport Select from '../../src/index.js';\n\nconst options = [\n    {\n        label: '水果',\n        options: [\n            { label: '苹果', value: 'apple' },\n            { label: '香蕉', value: 'banana' },\n            { label: '橙子', value: 'orange' },\n        ],\n    },\n    {\n        label: '蔬菜',\n        options: [\n            { label: '胡萝卜', value: 'carrot' },\n            { label: '西兰花', value: 'broccoli' },\n            { label: '菠菜', value: 'spinach' },\n        ],\n    },\n];\n\nconst GroupDemo = () => {\n    return (\n        \u003cSelect\n            aria-label=\"group\"\n            options={options}\n            placeholder=\"请选择食物\"\n        />\n    );\n};\n\nexport default GroupDemo;\n",
        "previewPath": "/components/rc-select/workbench/?__wake_demo=docs%2Fdemos%2Fgroup.demo.tsx",
        "workbenchPath": "/components/rc-select/workbench/#/components/docs%2Fdemos%2Fgroup.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "数据与搜索"
    },
    {
        "id": "docs/demos/searchable.demo.tsx",
        "title": "可搜索",
        "description": "设置 searchable 支持关键字过滤",
        "sourceCode": "export const meta = {\n    title: \"可搜索\",\n    description: \"设置 searchable 支持关键字过滤\",\n};\n\nimport Select from '../../src/index.js';\n\nconst options = Array.from({ length: 1000 }, (_, i) => ({\n    label: `Language ${i + 1}`,\n    value: `lang-${i + 1}`,\n}));\n\nconst SearchableDemo = () => {\n    return (\n        \u003cSelect\n            aria-label=\"language\"\n            searchable\n            options={options}\n            placeholder=\"输入关键字筛选\"\n        />\n    );\n};\n\nexport default SearchableDemo;\n",
        "previewPath": "/components/rc-select/workbench/?__wake_demo=docs%2Fdemos%2Fsearchable.demo.tsx",
        "workbenchPath": "/components/rc-select/workbench/#/components/docs%2Fdemos%2Fsearchable.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "数据与搜索"
    },
    {
        "id": "docs/demos/multiple.demo.tsx",
        "title": "多选模式",
        "description": "设置 multiple 启用多选",
        "sourceCode": "export const meta = {\n    title: \"多选模式\",\n    description: \"设置 multiple 启用多选\",\n};\n\nimport Select from '../../src/index.js';\n\nconst options = Array.from({ length: 1000 }, (_, i) => ({\n    label: `Framework ${i + 1}`,\n    value: `framework-${i + 1}`,\n}));\n\nconst MultipleDemo = () => {\n    return (\n        \u003cSelect\n            aria-label=\"framework\"\n            multiple\n            options={options}\n            placeholder=\"请选择框架\"\n            defaultValue={[\"framework-1\", \"framework-2\"]}\n        />\n    );\n};\n\nexport default MultipleDemo;\n",
        "previewPath": "/components/rc-select/workbench/?__wake_demo=docs%2Fdemos%2Fmultiple.demo.tsx",
        "workbenchPath": "/components/rc-select/workbench/#/components/docs%2Fdemos%2Fmultiple.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "多选能力"
    },
    {
        "id": "docs/demos/maxTagCount.demo.tsx",
        "title": "标签数量限制",
        "description": "多选模式下设置 maxTagCount 限制展示的标签数量",
        "sourceCode": "export const meta = {\n    title: \"标签数量限制\",\n    description: \"多选模式下设置 maxTagCount 限制展示的标签数量\",\n};\n\nimport Select from '../../src/index.js';\n\nconst options = Array.from({ length: 20 }, (_, i) => ({\n    label: `Tag ${i + 1}`,\n    value: `tag-${i + 1}`,\n}));\n\nconst MaxTagCountDemo = () => {\n    return (\n        \u003cSelect\n            aria-label=\"max-tag\"\n            multiple\n            maxTagCount={3}\n            defaultValue={['tag-1', 'tag-2', 'tag-3', 'tag-4', 'tag-5']}\n            options={options}\n            placeholder=\"请选择标签\"\n        />\n    );\n};\n\nexport default MaxTagCountDemo;\n",
        "previewPath": "/components/rc-select/workbench/?__wake_demo=docs%2Fdemos%2FmaxTagCount.demo.tsx",
        "workbenchPath": "/components/rc-select/workbench/#/components/docs%2Fdemos%2FmaxTagCount.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "多选能力"
    }
] as const satisfies readonly ComponentDemoRecord[];
