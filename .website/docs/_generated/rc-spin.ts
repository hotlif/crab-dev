/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "默认即处于加载中, 渲染一枚匀速旋转的指示环, 并以 role=status 向读屏播报。",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"默认即处于加载中, 渲染一枚匀速旋转的指示环, 并以 role=status 向读屏播报。\",\n};\n\nimport Spin from '../../src/index.js';\n\nconst BasicDemo = () => {\n    return \u003cSpin />;\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-spin/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-spin/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/delay.demo.tsx",
        "title": "延迟显示",
        "description": "秒回的请求不该闪一下转圈。delay 内完成的操作全程无指示器; 超出才说明它确实耗时, 此时才给反馈。",
        "sourceCode": "export const meta = {\n    title: \"延迟显示\",\n    description: \"秒回的请求不该闪一下转圈。delay 内完成的操作全程无指示器; 超出才说明它确实耗时, 此时才给反馈。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport { useState } from 'react';\nimport Button from '@crab-dev/rc-button';\nimport Spin from '../../src/index.js';\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    max-width: 420px;\n`;\n\nconst rowStyle = css`\n    display: flex;\n    gap: 12px;\n`;\n\nconst panelStyle = css`\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    min-height: 96px;\n    border: 1px dashed oklch(0.9 0.004 286);\n    border-radius: 8px;\n    color: oklch(0.44 0.01 286);\n    font-size: 14px;\n`;\n\nconst DelayDemo = () => {\n    const [spinning, setSpinning] = useState(false);\n\n    // 模拟一次请求：duration 决定它是「秒回」还是「真的慢」\n    const request = (duration: number) => {\n        setSpinning(true);\n        setTimeout(() => setSpinning(false), duration);\n    };\n\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cdiv className={rowStyle}>\n                \u003cButton onClick={() => request(150)}>秒回请求（150ms）\u003c/Button>\n                \u003cButton onClick={() => request(1500)}>慢请求（1500ms）\u003c/Button>\n            \u003c/div>\n\n            {/* delay=300：150ms 的请求全程不闪 spinner, 1500ms 的请求在 300ms 后才给出反馈 */}\n            \u003cSpin spinning={spinning} delay={300}>\n                \u003cdiv className={panelStyle}>\n                    秒回请求不会闪出转圈; 慢请求才会。\n                \u003c/div>\n            \u003c/Spin>\n        \u003c/div>\n    );\n};\n\nexport default DelayDemo;\n",
        "previewPath": "/components/rc-spin/workbench/?__wake_demo=docs%2Fdemos%2Fdelay.demo.tsx",
        "workbenchPath": "/components/rc-spin/workbench/#/components/docs%2Fdemos%2Fdelay.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/indicator.demo.tsx",
        "title": "自定义指示器",
        "description": "indicator 替换默认的旋转环; 无障碍语义（role=status / aria-label）仍由 Spin 统一兜底。",
        "sourceCode": "export const meta = {\n    title: \"自定义指示器\",\n    description: \"indicator 替换默认的旋转环; 无障碍语义（role=status / aria-label）仍由 Spin 统一兜底。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Spin from '../../src/index.js';\n\nconst rowStyle = css`\n    display: flex;\n    gap: 48px;\n    align-items: center;\n`;\n\nconst dotsStyle = css`\n    display: flex;\n    gap: 6px;\n\n    & > span {\n        width: 8px;\n        height: 8px;\n        background-color: oklch(0.22 0.005 286);\n        border-radius: 50%;\n        animation: rc-spin-demo-bounce 1.2s ease-in-out infinite;\n    }\n\n    & > span:nth-child(2) {\n        animation-delay: 0.15s;\n    }\n\n    & > span:nth-child(3) {\n        animation-delay: 0.3s;\n    }\n\n    @keyframes rc-spin-demo-bounce {\n        0%,\n        80%,\n        100% {\n            opacity: 0.25;\n            transform: translateY(0);\n        }\n        40% {\n            opacity: 1;\n            transform: translateY(-4px);\n        }\n    }\n\n    @media (prefers-reduced-motion: reduce) {\n        & > span {\n            animation-name: rc-spin-demo-fade;\n        }\n\n        @keyframes rc-spin-demo-fade {\n            0%,\n            100% {\n                opacity: 1;\n            }\n            50% {\n                opacity: 0.3;\n            }\n        }\n    }\n`;\n\nconst Dots = () => (\n    \u003cdiv className={dotsStyle} aria-hidden=\"true\">\n        \u003cspan />\n        \u003cspan />\n        \u003cspan />\n    \u003c/div>\n);\n\nconst IndicatorDemo = () => {\n    return (\n        \u003cdiv className={rowStyle}>\n            \u003cSpin indicator={\u003cDots />} />\n            \u003cSpin indicator={\u003cDots />} tip=\"正在处理\" />\n        \u003c/div>\n    );\n};\n\nexport default IndicatorDemo;\n",
        "previewPath": "/components/rc-spin/workbench/?__wake_demo=docs%2Fdemos%2Findicator.demo.tsx",
        "workbenchPath": "/components/rc-spin/workbench/#/components/docs%2Fdemos%2Findicator.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "尺寸",
        "description": "通过 size 设置 small / middle / large 三档; 指示器与提示文案会一同缩放。",
        "sourceCode": "export const meta = {\n    title: \"尺寸\",\n    description: \"通过 size 设置 small / middle / large 三档; 指示器与提示文案会一同缩放。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Spin from '../../src/index.js';\n\nconst rowStyle = css`\n    display: flex;\n    gap: 40px;\n    align-items: center;\n`;\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv className={rowStyle}>\n            \u003cSpin size=\"small\" />\n            \u003cSpin size=\"middle\" />\n            \u003cSpin size=\"large\" />\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-spin/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-spin/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/tip.demo.tsx",
        "title": "提示文案",
        "description": "tip 说明「正在做什么」, 比一枚沉默的转圈更能安抚等待。它同时成为读屏播报的内容。",
        "sourceCode": "export const meta = {\n    title: \"提示文案\",\n    description: \"tip 说明「正在做什么」, 比一枚沉默的转圈更能安抚等待。它同时成为读屏播报的内容。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Spin from '../../src/index.js';\n\nconst rowStyle = css`\n    display: flex;\n    gap: 48px;\n    align-items: flex-start;\n`;\n\nconst TipDemo = () => {\n    return (\n        \u003cdiv className={rowStyle}>\n            \u003cSpin tip=\"加载中\" />\n            \u003cSpin size=\"large\" tip=\"正在同步 3 个文件…\" />\n        \u003c/div>\n    );\n};\n\nexport default TipDemo;\n",
        "previewPath": "/components/rc-spin/workbench/?__wake_demo=docs%2Fdemos%2Ftip.demo.tsx",
        "workbenchPath": "/components/rc-spin/workbench/#/components/docs%2Fdemos%2Ftip.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/wrapper.demo.tsx",
        "title": "包裹内容",
        "description": "传入 children 即笼罩该区域: 内容变淡并被 inert 阻断——鼠标点不到, 键盘 Tab 也进不去。",
        "sourceCode": "export const meta = {\n    title: \"包裹内容\",\n    description: \"传入 children 即笼罩该区域: 内容变淡并被 inert 阻断——鼠标点不到, 键盘 Tab 也进不去。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport { useState } from 'react';\nimport Button from '@crab-dev/rc-button';\nimport Spin from '../../src/index.js';\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    max-width: 360px;\n`;\n\nconst panelStyle = css`\n    padding: 16px;\n    border: 1px solid oklch(0.9 0.004 286);\n    border-radius: 8px;\n`;\n\nconst titleStyle = css`\n    margin: 0 0 8px;\n    font-size: 16px;\n    font-weight: 600;\n`;\n\nconst bodyStyle = css`\n    margin: 0 0 12px;\n    color: oklch(0.44 0.01 286);\n    font-size: 14px;\n`;\n\nconst WrapperDemo = () => {\n    const [spinning, setSpinning] = useState(true);\n\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cButton appearance=\"subtle\" onClick={() => setSpinning((prev) => !prev)}>\n                {spinning ? '结束加载' : '开始加载'}\n            \u003c/Button>\n\n            \u003cSpin spinning={spinning} tip=\"正在保存\">\n                \u003cdiv className={panelStyle}>\n                    \u003ch4 className={titleStyle}>草稿\u003c/h4>\n                    \u003cp className={bodyStyle}>\n                        加载期间试着用 Tab 键聚焦下面的按钮 —— 焦点不会落进来。\n                    \u003c/p>\n                    \u003cButton>提交\u003c/Button>\n                \u003c/div>\n            \u003c/Spin>\n        \u003c/div>\n    );\n};\n\nexport default WrapperDemo;\n",
        "previewPath": "/components/rc-spin/workbench/?__wake_demo=docs%2Fdemos%2Fwrapper.demo.tsx",
        "workbenchPath": "/components/rc-spin/workbench/#/components/docs%2Fdemos%2Fwrapper.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
