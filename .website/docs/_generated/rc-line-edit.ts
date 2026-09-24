/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/simple.demo.tsx",
        "title": "基础用法",
        "description": "一个简单的单行文本编辑器",
        "learning": {
            "components": [
                "LineEdit"
            ],
            "props": [
                "prefix",
                "size"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"一个简单的单行文本编辑器\",\n};\n\nimport { useId } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport { Lollipop } from \"lucide-react\";\nimport LineEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n\tpadding: 1rem;\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 1rem;\n`;\n\nconst SimpleDemo = () => {\n    const fieldId = useId();\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cdiv>\n                \u003clabel htmlFor={`${fieldId}-large`}>大尺寸输入\u003c/label>\n                \u003cLineEdit id={`${fieldId}-large`} prefix={\u003cLollipop aria-hidden=\"true\" />} size=\"large\" />\n            \u003c/div>\n            \u003cdiv>\n                \u003clabel htmlFor={`${fieldId}-middle`}>中尺寸输入\u003c/label>\n                \u003cLineEdit id={`${fieldId}-middle`} prefix={\u003cLollipop aria-hidden=\"true\" />} size=\"middle\" />\n            \u003c/div>\n            \u003cdiv>\n                \u003clabel htmlFor={`${fieldId}-small`}>小尺寸输入\u003c/label>\n                \u003cLineEdit id={`${fieldId}-small`} prefix={\u003cLollipop aria-hidden=\"true\" />} size=\"small\" />\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default SimpleDemo;\n",
        "previewPath": "/components/rc-line-edit/workbench/?__wake_demo=docs%2Fdemos%2Fsimple.demo.tsx",
        "workbenchPath": "/components/rc-line-edit/workbench/#/components/docs%2Fdemos%2Fsimple.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与尺寸"
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "尺寸",
        "description": "通过 `size` 属性设置输入框尺寸",
        "learning": {
            "components": [
                "LineEdit"
            ],
            "props": [
                "size",
                "placeholder"
            ],
            "events": [],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"尺寸\",\n    description: \"通过 `size` 属性设置输入框尺寸\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useId, useState } from \"react\";\nimport LineEdit from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    const controlId = useId();\n    const [size, setSize] = useState\u003c\"large\" | \"middle\" | \"small\">(\"middle\");\n\n    return (\n        \u003cdiv\n            className={css`\n                padding: 1rem;\n            `}\n        >\n            \u003cdiv\n                className={css`\n\t\t\t\t\tdisplay: flex;\n\t\t\t\t\talign-items: flex-start;\n\t\t\t\t\tgap: 0.5rem;\n\t\t\t\t\tmargin-bottom: 1rem;\n\t\t\t\t`}\n            >\n                \u003clabel htmlFor={controlId}>请选择大小\u003c/label>\n                \u003cselect\n                    id={controlId}\n                    value={size}\n                    onChange={(e) =>\n                        setSize(e.target.value as \"large\" | \"middle\" | \"small\")\n                    }\n                >\n                    \u003coption value=\"large\">Large\u003c/option>\n                    \u003coption value=\"middle\">Middle\u003c/option>\n                    \u003coption value=\"small\">Small\u003c/option>\n                \u003c/select>\n            \u003c/div>\n            \u003cLineEdit size={size} placeholder=\"请输入内容\" />\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-line-edit/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-line-edit/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与尺寸"
    },
    {
        "id": "docs/demos/prefix-suffix.demo.tsx",
        "title": "前缀和后缀",
        "description": "通过 `prefix` 和 `suffix` 属性设置前缀/后缀图标",
        "learning": {
            "components": [
                "LineEdit"
            ],
            "props": [
                "prefix",
                "placeholder",
                "suffix"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"前缀和后缀\",\n    description: \"通过 `prefix` 和 `suffix` 属性设置前缀/后缀图标\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { Search, X } from \"lucide-react\";\nimport LineEdit from \"../../src/index.js\";\n\nconst PrefixSuffixDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n\t\t\t\tdisplay: flex;\n\t\t\t\tflex-direction: column;\n\t\t\t\talign-items: flex-start;\n\t\t\t\tgap: 1rem;\n\t\t\t\tpadding: 1rem;\n\t\t\t`}\n        >\n            \u003cLineEdit prefix={\u003cSearch size={16} />} placeholder=\"搜索\" />\n            \u003cLineEdit suffix={\u003cX size={16} />} placeholder=\"可清除\" />\n            \u003cLineEdit\n                prefix={\u003cSearch size={16} />}\n                suffix={\u003cX size={16} />}\n                placeholder=\"前缀和后缀\"\n            />\n        \u003c/div>\n    );\n};\n\nexport default PrefixSuffixDemo;\n",
        "previewPath": "/components/rc-line-edit/workbench/?__wake_demo=docs%2Fdemos%2Fprefix-suffix.demo.tsx",
        "workbenchPath": "/components/rc-line-edit/workbench/#/components/docs%2Fdemos%2Fprefix-suffix.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与尺寸"
    },
    {
        "id": "docs/demos/allow-clear.demo.tsx",
        "title": "可清除",
        "description": "设置 `allowClear` 后，输入框有内容时右侧显示清除按钮；配合受控 `value` 和 `onChange` 回调使用，`disabled` 或 `readOnly` 时清除按钮自动隐藏",
        "learning": {
            "components": [
                "LineEdit"
            ],
            "props": [
                "aria-label",
                "value",
                "allowClear",
                "prefix",
                "onChange",
                "placeholder",
                "disabled"
            ],
            "events": [
                "onChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"可清除\",\n    description: \"设置 `allowClear` 后，输入框有内容时右侧显示清除按钮；配合受控 `value` 和 `onChange` 回调使用，`disabled` 或 `readOnly` 时清除按钮自动隐藏\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { Search } from \"lucide-react\";\nimport { useState } from \"react\";\nimport LineEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n    padding: 1rem;\n    max-width: 300px;\n`;\n\nconst AllowClearDemo = () => {\n    const [keyword, setKeyword] = useState(\"React 设计心理学\");\n    const [note, setNote] = useState(\"\");\n\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cLineEdit\n                aria-label=\"搜索关键词\"\n                value={keyword}\n                allowClear\n                prefix={\u003cSearch />}\n                onChange={(e) => setKeyword(e.target.value)}\n                placeholder=\"搜索\"\n            />\n            \u003cLineEdit\n                aria-label=\"备注\"\n                value={note}\n                allowClear\n                onChange={(e) => setNote(e.target.value)}\n                placeholder=\"备注（输入后可清除）\"\n            />\n            \u003cLineEdit\n                aria-label=\"禁用清除示例\"\n                value=\"禁用状态不显示清除按钮\"\n                allowClear\n                disabled\n                placeholder=\"\"\n            />\n        \u003c/div>\n    );\n};\n\nexport default AllowClearDemo;\n",
        "previewPath": "/components/rc-line-edit/workbench/?__wake_demo=docs%2Fdemos%2Fallow-clear.demo.tsx",
        "workbenchPath": "/components/rc-line-edit/workbench/#/components/docs%2Fdemos%2Fallow-clear.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "输入能力"
    },
    {
        "id": "docs/demos/password.demo.tsx",
        "title": "密码输入",
        "description": "设置 `type=\\\"password\\\"` 时右侧自动出现可见性切换按钮（眼睛图标），用户可随时核查已输入的密码内容，降低因误输入导致的挫败感",
        "learning": {
            "components": [
                "LineEdit"
            ],
            "props": [
                "aria-label",
                "type",
                "value",
                "onChange",
                "placeholder",
                "aria-describedby",
                "status",
                "disabled",
                "readOnly"
            ],
            "events": [
                "onChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"密码输入\",\n    description: \"设置 `type=\\\\\\\"password\\\\\\\"` 时右侧自动出现可见性切换按钮（眼睛图标），用户可随时核查已输入的密码内容，降低因误输入导致的挫败感\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useId, useState } from \"react\";\nimport LineEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n    padding: 1rem;\n    max-width: 300px;\n`;\n\nconst PasswordDemo = () => {\n    const [password, setPassword] = useState(\"\");\n    const [confirm, setConfirm] = useState(\"\");\n    const hintId = useId();\n\n    const mismatch = confirm.length > 0 && password !== confirm;\n\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cLineEdit\n                aria-label=\"密码\"\n                type=\"password\"\n                value={password}\n                onChange={(e) => setPassword(e.target.value)}\n                placeholder=\"密码\"\n            />\n            \u003cLineEdit\n                aria-label=\"确认密码\"\n                aria-describedby={mismatch ? hintId : undefined}\n                type=\"password\"\n                value={confirm}\n                status={mismatch ? \"error\" : undefined}\n                onChange={(e) => setConfirm(e.target.value)}\n                placeholder=\"确认密码\"\n            />\n            {mismatch && \u003cp id={hintId}>两次输入的密码不同，请核对后重新输入。\u003c/p>}\n            \u003cLineEdit type=\"password\" aria-label=\"禁用密码示例\" value=\"disabled-example\" disabled />\n            \u003cLineEdit type=\"password\" aria-label=\"只读密码示例\" value=\"readonly-example\" readOnly />\n        \u003c/div>\n    );\n};\n\nexport default PasswordDemo;\n",
        "previewPath": "/components/rc-line-edit/workbench/?__wake_demo=docs%2Fdemos%2Fpassword.demo.tsx",
        "workbenchPath": "/components/rc-line-edit/workbench/#/components/docs%2Fdemos%2Fpassword.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "输入能力"
    },
    {
        "id": "docs/demos/show-count.demo.tsx",
        "title": "字符计数",
        "description": "设置 `showCount` 后在输入框右侧实时显示已输入字符数；配合 `maxLength` 使用时显示「已输入 / 上限」格式，帮助用户掌握剩余可输入量",
        "learning": {
            "components": [
                "LineEdit"
            ],
            "props": [
                "value",
                "showCount",
                "onChange",
                "placeholder",
                "maxLength"
            ],
            "events": [
                "onChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"字符计数\",\n    description: \"设置 `showCount` 后在输入框右侧实时显示已输入字符数；配合 `maxLength` 使用时显示「已输入 / 上限」格式，帮助用户掌握剩余可输入量\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport LineEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n    padding: 1rem;\n    max-width: 320px;\n`;\n\nconst ShowCountDemo = () => {\n    const [title, setTitle] = useState(\"\");\n    const [bio, setBio] = useState(\"前端开发者\");\n\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cLineEdit\n                value={title}\n                showCount\n                onChange={(e) => setTitle(e.target.value)}\n                placeholder=\"标题（仅显示字符数）\"\n            />\n            \u003cLineEdit\n                value={bio}\n                showCount\n                maxLength={30}\n                onChange={(e) => setBio(e.target.value)}\n                placeholder=\"简介（30 字以内）\"\n            />\n        \u003c/div>\n    );\n};\n\nexport default ShowCountDemo;\n",
        "previewPath": "/components/rc-line-edit/workbench/?__wake_demo=docs%2Fdemos%2Fshow-count.demo.tsx",
        "workbenchPath": "/components/rc-line-edit/workbench/#/components/docs%2Fdemos%2Fshow-count.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "输入能力"
    },
    {
        "id": "docs/demos/status.demo.tsx",
        "title": "验证状态",
        "description": "通过 `status` 属性设置 `error` 或 `warning` 验证状态。失焦时触发校验，边框颜色随状态改变，配合提示文字形成完整反馈闭环",
        "learning": {
            "components": [
                "LineEdit"
            ],
            "props": [
                "aria-describedby",
                "value",
                "status",
                "placeholder",
                "onChange",
                "onBlur"
            ],
            "events": [
                "onChange",
                "onBlur"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"验证状态\",\n    description: \"通过 `status` 属性设置 `error` 或 `warning` 验证状态。失焦时触发校验，边框颜色随状态改变，配合提示文字形成完整反馈闭环\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useId, useState } from \"react\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport LineEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space['group-gap']};\n    padding: ${token.space['card-padding']};\n    max-width: 300px;\n`;\n\nconst fieldStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space['inline-gap']};\n`;\n\nconst hintStyle = css`\n    font-size: ${token.font.size.caption};\n    margin: 0;\n`;\n\nconst errorHintStyle = css`\n    color: ${token.color.feedback.error.text};\n`;\n\nconst warningHintStyle = css`\n    color: ${token.color.feedback.warning.text};\n`;\n\ntype FieldStatus = \"error\" | \"warning\" | undefined;\n\nconst validate = (value: string): FieldStatus => {\n    if (!value.trim()) return \"error\";\n    if (value.length \u003c 6) return \"warning\";\n    return undefined;\n};\n\nconst StatusDemo = () => {\n    const fieldId = useId();\n    const [email, setEmail] = useState(\"\");\n    const [emailStatus, setEmailStatus] = useState\u003cFieldStatus>();\n\n    const [name, setName] = useState(\"\");\n    const [nameStatus, setNameStatus] = useState\u003cFieldStatus>();\n\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-email`}>邮箱\u003c/label>\n                \u003cLineEdit\n                    id={`${fieldId}-email`}\n                    aria-describedby={emailStatus ? `${fieldId}-email-hint` : undefined}\n                    value={email}\n                    status={emailStatus}\n                    placeholder=\"邮箱（失焦后触发校验）\"\n                    onChange={(e) => { setEmail(e.target.value); setEmailStatus(undefined); }}\n                    onBlur={() => setEmailStatus(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim()) ? undefined : \"error\")}\n                />\n                {emailStatus === \"error\" && (\n                    \u003cp id={`${fieldId}-email-hint`} className={`${hintStyle} ${errorHintStyle}`}>请填写完整邮箱，例如 name@example.com\u003c/p>\n                )}\n            \u003c/div>\n\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-name`}>用户名\u003c/label>\n                \u003cLineEdit\n                    id={`${fieldId}-name`}\n                    aria-describedby={nameStatus ? `${fieldId}-name-hint` : undefined}\n                    value={name}\n                    status={nameStatus}\n                    placeholder=\"用户名（至少 6 个字符）\"\n                    onChange={(e) => { setName(e.target.value); setNameStatus(undefined); }}\n                    onBlur={() => setNameStatus(validate(name))}\n                />\n                {nameStatus === \"error\" && (\n                    \u003cp id={`${fieldId}-name-hint`} className={`${hintStyle} ${errorHintStyle}`}>用户名不能为空\u003c/p>\n                )}\n                {nameStatus === \"warning\" && (\n                    \u003cp id={`${fieldId}-name-hint`} className={`${hintStyle} ${warningHintStyle}`}>用户名过短，建议至少 6 个字符\u003c/p>\n                )}\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default StatusDemo;\n",
        "previewPath": "/components/rc-line-edit/workbench/?__wake_demo=docs%2Fdemos%2Fstatus.demo.tsx",
        "workbenchPath": "/components/rc-line-edit/workbench/#/components/docs%2Fdemos%2Fstatus.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "输入能力"
    }
] as const satisfies readonly ComponentDemoRecord[];
