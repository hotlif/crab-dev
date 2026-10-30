/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "基础用法",
        "description": "字段标签与校验反馈由 LineEdit 自行呈现：Material Design 3 Expressive 使用浮动标签，Apple 和 shadcn/ui 使用控件自有的上方静态标签；表单实例操作的结果直接显示在下方。",
        "learning": {
            "components": [
                "Form",
                "Item",
                "LineEdit",
                "Button"
            ],
            "props": [
                "form",
                "defaultValue",
                "onSubmitSuccess",
                "onSubmitFailed",
                "label",
                "labelPlacement",
                "name",
                "adapter",
                "required",
                "placeholder",
                "type",
                "appearance"
            ],
            "events": [
                "onSubmitSuccess",
                "onSubmitFailed",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"字段标签与校验反馈由 LineEdit 自行呈现：Material Design 3 Expressive 使用浮动标签，Apple 和 shadcn/ui 使用控件自有的上方静态标签；表单实例操作的结果直接显示在下方。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Button from \"@crab-dev/rc-button\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport Form, { Item, useForm } from \"../../src/index.js\";\n\ninterface UserInfo {\n    user: {\n        username: string;\n        password: string;\n    };\n}\n\nconst formStyle = css`\n    max-width: 480px;\n`;\n\nconst actionRowStyle = css`\n    display: flex;\n    flex-wrap: wrap;\n    gap: 8px;\n    margin-top: 4px;\n`;\n\nconst resultStyle = css`\n    white-space: pre-wrap;\n    overflow-wrap: anywhere;\n    color: ${token.color.text.secondary};\n`;\n\nconst SimpleFrame = () => {\n    const [form] = useForm\u003cUserInfo>();\n    const [result, setResult] = useState(\"点击操作按钮，在这里查看执行结果。\");\n\n    return (\n        \u003cForm\n            className={formStyle}\n            form={form}\n            defaultValue={{\n                user: {\n                    username: \"ada\",\n                    password: \"password\",\n                },\n            }}\n            onSubmitSuccess={async (values) => {\n                setResult(`提交成功：${JSON.stringify(values, null, 2)}`);\n            }}\n            onSubmitFailed={async () => {\n                setResult(\"提交未通过，请根据字段下方的错误提示补全内容。\");\n            }}\n        >\n            \u003cItem label=\"用户名\" labelPlacement=\"control\" name={[\"user\", \"username\"]} adapter=\"value\" required>\n                \u003cLineEdit placeholder=\"请输入用户名\" />\n            \u003c/Item>\n            \u003cItem label=\"密码\" labelPlacement=\"control\" name={[\"user\", \"password\"]} adapter=\"value\" required>\n                \u003cLineEdit type=\"password\" placeholder=\"请输入密码\" />\n            \u003c/Item>\n\n            \u003cdiv className={actionRowStyle}>\n                \u003cButton type=\"button\" appearance=\"primary\" onClick={async () => { await form.submit(); }}>\n                    提交\n                \u003c/Button>\n                \u003cButton type=\"button\" onClick={async () => {\n                    await form.resetFields();\n                    setResult(\"已恢复初始值，并清除校验反馈。\");\n                }}>\n                    重置\n                \u003c/Button>\n                \u003cButton\n                    type=\"button\"\n                    appearance=\"subtle\"\n                    onClick={() => {\n                        setResult(`getFieldsValue：${JSON.stringify(form.getFieldsValue(), null, 2)}`);\n                    }}\n                >\n                    getFieldsValue\n                \u003c/Button>\n                \u003cButton\n                    type=\"button\"\n                    appearance=\"subtle\"\n                    onClick={() => {\n                        const username = form.getFieldValue([\"user\", \"username\"]);\n                        const password = form.getFieldValue([\"user\", \"password\"]);\n                        setResult(`getFieldValue：${JSON.stringify({ username, password }, null, 2)}`);\n                    }}\n                >\n                    getFieldValue\n                \u003c/Button>\n                \u003cButton\n                    type=\"button\"\n                    appearance=\"subtle\"\n                    onClick={() => {\n                        form.setFieldsValue({\n                            user: {\n                                username: `user-${crypto.randomUUID().slice(0, 8)}`,\n                                password: `pwd-${crypto.randomUUID().slice(0, 8)}`,\n                            },\n                        });\n                        setResult(\"setFieldsValue：已同时更新用户名与密码。\");\n                    }}\n                >\n                    setFieldsValue\n                \u003c/Button>\n                \u003cButton\n                    type=\"button\"\n                    appearance=\"subtle\"\n                    onClick={() => {\n                        form.setFieldValue([\"user\", \"username\"], crypto.randomUUID().slice(0, 8));\n                        setResult(\"setFieldValue：已更新用户名，密码保持不变。\");\n                    }}\n                >\n                    setFieldValue\n                \u003c/Button>\n            \u003c/div>\n            \u003coutput className={resultStyle} aria-live=\"polite\">{result}\u003c/output>\n        \u003c/Form>\n    );\n};\n\nexport default SimpleFrame;\n",
        "previewPath": "/components/rc-form/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-form/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "使用示例"
    },
    {
        "id": "docs/demos/editors.demo.tsx",
        "title": "搭配 crab-dev 编辑器",
        "description": "将 rc-form 与同体系的 rc-line-edit / rc-select / rc-checkbox / rc-radio / rc-switch / rc-slider / rc-button 组合，演示生态内循环。",
        "learning": {
            "components": [
                "Slider",
                "Form",
                "Item",
                "LineEdit",
                "Select",
                "CheckboxGroup"
            ],
            "props": [
                "aria-labelledby",
                "aria-invalid",
                "aria-describedby",
                "aria-busy",
                "aria-readonly",
                "disabled",
                "value",
                "min",
                "max",
                "step",
                "onValueChange",
                "form"
            ],
            "events": [
                "onValueChange",
                "onSubmitSuccess",
                "onSubmitFailed",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"搭配 crab-dev 编辑器\",\n    description: \"将 rc-form 与同体系的 rc-line-edit / rc-select / rc-checkbox / rc-radio / rc-switch / rc-slider / rc-button 组合，演示生态内循环。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { type FC, useId, useState } from \"react\";\nimport token from \"@crab-dev/rc-token-semantic\";\n\nimport Button from \"@crab-dev/rc-button\";\nimport Checkbox, { CheckboxGroup } from \"@crab-dev/rc-checkbox\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport Radio, { RadioGroup } from \"@crab-dev/rc-radio\";\nimport Select from \"@crab-dev/rc-select\";\nimport Slider, { type SliderProps } from \"@crab-dev/rc-slider\";\nimport Switch from \"@crab-dev/rc-switch\";\n\nimport Form, { Item, useForm } from \"../../src/index.js\";\nimport type { FormItemEditor } from \"../../src/types.js\";\n\ntype SliderFieldProps = Omit\u003cFormItemEditor\u003cnumber>, 'onValueChange'>\n    & Pick\u003cSliderProps, 'onValueChange' | 'aria-labelledby'>;\n\nconst SliderField: FC\u003cSliderFieldProps> = ({\n    id, name, value, onValueChange, disabled, readOnly,\n    'aria-labelledby': labelledBy, 'aria-invalid': invalid,\n    'aria-describedby': describedBy, 'aria-busy': busy,\n}) => (\n    \u003c>\n        \u003cSlider\n            id={id}\n            aria-labelledby={labelledBy}\n            aria-invalid={invalid}\n            aria-describedby={describedBy}\n            aria-busy={busy}\n            aria-readonly={readOnly || undefined}\n            disabled={disabled}\n            value={value ?? 0}\n            min={0}\n            max={100}\n            step={1}\n            onValueChange={(next, details) => {\n                if (!disabled && !readOnly) onValueChange?.(next, details);\n            }}\n        />\n        \u003cinput type=\"hidden\" name={name} disabled={disabled} readOnly={readOnly} value={value ?? 0} />\n    \u003c/>\n);\n\n// ---------- 表单数据形态 ----------\n\ninterface ProfileForm {\n    username: string;\n    email: string;\n    role: string;\n    tags: Array\u003cstring | number>;\n    plan: string | number;\n    receiveEmail: boolean;\n    agree: boolean;\n    quota: number;\n}\n\n// Form 内部使用 grid + subgrid 承载「标签 / 编辑器 / 状态」三列布局，\n// 这里只约束宽度，不得覆盖 display，否则 subgrid 因父级非 grid 而失效、布局塌陷。\nconst formStyle = css`\n    max-width: 520px;\n`;\n\nconst actionRowStyle = css`\n    display: flex;\n    gap: 12px;\n    margin-top: 8px;\n`;\n\nconst resultStyle = css`\n    white-space: pre-wrap;\n    overflow-wrap: anywhere;\n    color: ${token.color.text.secondary};\n`;\n\nconst ROLE_OPTIONS = [\n    { label: \"管理员\", value: \"admin\" },\n    { label: \"开发者\", value: \"developer\" },\n    { label: \"访客\", value: \"guest\" },\n];\n\nconst EditorsDemo: FC = () => {\n    const [form] = useForm\u003cProfileForm>();\n    const quotaLabelId = useId();\n    const [result, setResult] = useState(\"修改编辑器后，可查看当前值或提交校验。\");\n\n    return (\n        \u003cForm\n            className={formStyle}\n            form={form}\n            defaultValue={{\n                username: \"ada\",\n                email: \"ada@example.com\",\n                role: \"developer\",\n                tags: [\"typescript\"],\n                plan: \"pro\",\n                receiveEmail: true,\n                agree: false,\n                quota: 30,\n            }}\n            onSubmitSuccess={async (values) => {\n                setResult(`提交成功：${JSON.stringify(values, null, 2)}`);\n            }}\n            onSubmitFailed={async () => {\n                setResult(\"提交未通过，请根据字段下方的错误提示补全内容。\");\n            }}\n        >\n            \u003cItem label=\"用户名\" labelPlacement=\"control\" name=\"username\" adapter=\"value\" required>\n                \u003cLineEdit placeholder=\"请输入用户名\" />\n            \u003c/Item>\n\n            \u003cItem label=\"邮箱\" labelPlacement=\"control\" name=\"email\" adapter=\"value\" required>\n                \u003cLineEdit placeholder=\"name@example.com\" type=\"email\" />\n            \u003c/Item>\n\n            \u003cItem label=\"角色\" name=\"role\" required>\n                {({ id, value, onValueChange, status, 'aria-invalid': invalid, 'aria-describedby': describedBy }) => (\n                    \u003cSelect id={id} aria-label=\"角色\" aria-invalid={invalid} aria-describedby={describedBy}\n                        value={typeof value === 'string' ? value : undefined} onValueChange={onValueChange} status={status}\n                        options={ROLE_OPTIONS} placeholder=\"选择角色\" />\n                )}\n            \u003c/Item>\n\n            \u003cItem label=\"技能\" name=\"tags\" labelPlacement=\"external\" labelTarget=\"group\">\n                {({ id, value, onValueChange, 'aria-labelledby': labelledBy, 'aria-invalid': invalid, 'aria-describedby': describedBy }) => (\n                    \u003cCheckboxGroup\n                        id={id}\n                        aria-labelledby={labelledBy}\n                        aria-invalid={invalid}\n                        aria-describedby={describedBy}\n                        value={Array.isArray(value) ? value.filter((entry: unknown): entry is string | number => typeof entry === 'string' || typeof entry === 'number') : []}\n                        onValueChange={onValueChange}\n                    >\n                        \u003cCheckbox value=\"typescript\" aria-invalid={invalid} aria-describedby={describedBy}>TypeScript\u003c/Checkbox>\n                        \u003cCheckbox value=\"react\" aria-invalid={invalid} aria-describedby={describedBy}>React\u003c/Checkbox>\n                        \u003cCheckbox value=\"rust\" aria-invalid={invalid} aria-describedby={describedBy}>Rust\u003c/Checkbox>\n                    \u003c/CheckboxGroup>\n                )}\n            \u003c/Item>\n\n            \u003cItem label=\"套餐\" name=\"plan\" labelPlacement=\"external\" labelTarget=\"group\">\n                {({ id, value, onValueChange, 'aria-invalid': invalid, 'aria-describedby': describedBy }) => (\n                    \u003cRadioGroup\n                        id={id}\n                        aria-label=\"套餐\"\n                        aria-describedby={describedBy}\n                        value={typeof value === 'string' || typeof value === 'number' ? value : undefined}\n                        onValueChange={onValueChange}\n                    >\n                        \u003cRadio value=\"free\" aria-invalid={invalid}>Free\u003c/Radio>\n                        \u003cRadio value=\"pro\" aria-invalid={invalid}>Pro\u003c/Radio>\n                        \u003cRadio value=\"team\" aria-invalid={invalid}>Team\u003c/Radio>\n                    \u003c/RadioGroup>\n                )}\n            \u003c/Item>\n\n            \u003cItem label=\"接收邮件\" name=\"receiveEmail\" adapter=\"checked\">\n                \u003cSwitch aria-label=\"接收邮件\" />\n            \u003c/Item>\n\n            \u003cItem label={\u003cspan id={quotaLabelId}>额度\u003c/span>} name=\"quota\">\n                \u003cSliderField aria-labelledby={quotaLabelId} />\n            \u003c/Item>\n\n            \u003cItem label=\"协议\" name=\"agree\" adapter=\"checked\" required>\n                \u003cCheckbox>我已阅读并同意服务条款\u003c/Checkbox>\n            \u003c/Item>\n\n            \u003cdiv className={actionRowStyle}>\n                \u003cButton type=\"button\" appearance=\"primary\" onClick={async () => { await form.submit(); }}>\n                    提交\n                \u003c/Button>\n                \u003cButton type=\"button\" onClick={async () => {\n                    await form.resetFields();\n                    setResult(\"已恢复初始值，并清除校验反馈。\");\n                }}>\n                    重置\n                \u003c/Button>\n                \u003cButton\n                    type=\"button\"\n                    appearance=\"text\"\n                    onClick={() => {\n                        setResult(`当前值：${JSON.stringify(form.getFieldsValue(), null, 2)}`);\n                    }}\n                >\n                    查看当前值\n                \u003c/Button>\n            \u003c/div>\n            \u003coutput className={resultStyle} aria-live=\"polite\">{result}\u003c/output>\n        \u003c/Form>\n    );\n};\n\nexport default EditorsDemo;\n",
        "previewPath": "/components/rc-form/workbench/?__wake_demo=docs%2Fdemos%2Feditors.demo.tsx",
        "workbenchPath": "/components/rc-form/workbench/#/components/docs%2Fdemos%2Feditors.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "使用示例"
    },
    {
        "id": "docs/demos/filled.demo.tsx",
        "title": "Filled 填充字段",
        "description": "同一表单统一使用 filled，并由控件布局标签。Material Design 3 Expressive 呈现填充容器、浮动标签和焦点底线；Apple 和 shadcn/ui 使用控件自有的上方静态标签。",
        "learning": {
            "components": [
                "Form",
                "Item",
                "LineEdit",
                "Button"
            ],
            "props": [
                "form",
                "defaultValue",
                "onSubmitSuccess",
                "name",
                "label",
                "labelPlacement",
                "adapter",
                "supportingText",
                "required",
                "appearance",
                "placeholder",
                "type"
            ],
            "events": [
                "onSubmitSuccess",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"Filled 填充字段\",\n    description: \"同一表单统一使用 filled，并由控件布局标签。Material Design 3 Expressive 呈现填充容器、浮动标签和焦点底线；Apple 和 shadcn/ui 使用控件自有的上方静态标签。\",\n};\n\nimport { useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Button from \"@crab-dev/rc-button\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport Form, { Item, useForm } from \"../../src/index.js\";\n\nconst layout = css`\n    display: grid;\n    gap: ${token.space['section-gap']};\n    max-width: calc(${token.size['40']} * 12);\n    min-width: 0;\n`;\nconst actions = css`\n    display: flex;\n    flex-wrap: wrap;\n    gap: ${token.space['component-gap']};\n`;\n\ninterface WorkspaceForm {\n    name: string;\n    email: string;\n}\n\nexport default function FilledDemo() {\n    const [form] = useForm\u003cWorkspaceForm>();\n    const [result, setResult] = useState(\"\");\n\n    return (\n        \u003cdiv className={layout}>\n            \u003cForm\n                form={form}\n                defaultValue={{ name: \"\", email: \"\" }}\n                onSubmitSuccess={async (values) => {\n                    setResult(`已保存：${values.name} · ${values.email}`);\n                }}\n            >\n                \u003cItem\n                    name=\"name\"\n                    label=\"工作空间名称\"\n                    labelPlacement=\"control\"\n                    adapter=\"value\"\n                    supportingText=\"名称会显示在团队首页。\"\n                    required\n                >\n                    \u003cLineEdit appearance=\"filled\" placeholder=\"例如：产品设计组\" />\n                \u003c/Item>\n                \u003cItem\n                    name=\"email\"\n                    label=\"联系邮箱\"\n                    labelPlacement=\"control\"\n                    adapter=\"value\"\n                    supportingText=\"用于接收空间邀请和重要通知。\"\n                    required\n                >\n                    \u003cLineEdit appearance=\"filled\" type=\"email\" placeholder=\"name@example.com\" />\n                \u003c/Item>\n                \u003cdiv className={actions}>\n                    \u003cButton type=\"button\" appearance=\"primary\" onClick={async () => { await form.submit(); }}>保存空间\u003c/Button>\n                    \u003cButton type=\"button\" onClick={async () => {\n                        await form.resetFields();\n                        setResult(\"\");\n                    }}>重置\u003c/Button>\n                \u003c/div>\n            \u003c/Form>\n            \u003coutput aria-live=\"polite\">{result || \"填写后保存；留空提交可查看字段错误。\"}\u003c/output>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-form/workbench/?__wake_demo=docs%2Fdemos%2Ffilled.demo.tsx",
        "workbenchPath": "/components/rc-form/workbench/#/components/docs%2Fdemos%2Ffilled.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "使用示例"
    },
    {
        "id": "docs/demos/validation.demo.tsx",
        "title": "字段校验",
        "description": "使用 required 与自定义 rules 组合 rc-line-edit / rc-select，演示同步与异步校验。",
        "learning": {
            "components": [
                "Form",
                "Item",
                "LineEdit",
                "Select",
                "Button"
            ],
            "props": [
                "form",
                "defaultValue",
                "onSubmitSuccess",
                "onSubmitFailed",
                "label",
                "labelPlacement",
                "name",
                "adapter",
                "required",
                "supportingText",
                "rules",
                "placeholder"
            ],
            "events": [
                "onSubmitSuccess",
                "onSubmitFailed",
                "onValueChange",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"字段校验\",\n    description: \"使用 required 与自定义 rules 组合 rc-line-edit / rc-select，演示同步与异步校验。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useRef, useState } from \"react\";\n\nimport Button from \"@crab-dev/rc-button\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport Select from \"@crab-dev/rc-select\";\n\nimport Form, { Item, useForm } from \"../../src/index.js\";\nimport { type Rule, RuleType } from \"../../src/types.js\";\n\ninterface SignupForm {\n    account: string;\n    password: string;\n    confirm: string;\n    region: string;\n}\n\nconst formStyle = css`\n    max-width: 520px;\n`;\n\nconst actionRowStyle = css`\n    display: flex;\n    gap: 12px;\n    margin-top: 8px;\n`;\n\nconst REGION_OPTIONS = [\n    { label: \"中国大陆\", value: \"cn\" },\n    { label: \"新加坡\", value: \"sg\" },\n    { label: \"美国西部\", value: \"us-west\" },\n];\n\n// 异步校验：账号唯一性（模拟 500ms 服务端查询）\nconst accountRules = (getValue: () => string): Rule[] => [\n    {\n        type: RuleType.ERROR,\n        validator: async () => {\n            const v = getValue();\n            if (!/^[a-zA-Z][a-zA-Z0-9_]{2,15}$/.test(v)) {\n                throw new Error(\"账号需以字母开头，长度 3-16 位\");\n            }\n        },\n    },\n    {\n        type: RuleType.WARNING,\n        validator: async () => {\n            await new Promise((resolve) => setTimeout(resolve, 500));\n            if (getValue().toLowerCase() === \"admin\") {\n                throw new Error(\"账号 admin 已被占用\");\n            }\n        },\n    },\n];\n\nconst passwordRules = (getValue: () => string): Rule[] => [\n    {\n        type: RuleType.ERROR,\n        validator: async () => {\n            const v = getValue();\n            if (v.length \u003c 8) {\n                throw new Error(\"密码至少 8 位\");\n            }\n            if (!/[A-Z]/.test(v) || !/[0-9]/.test(v)) {\n                throw new Error(\"密码需包含大写字母与数字\");\n            }\n        },\n    },\n];\n\nfunction ValidationDemo() {\n    const [form] = useForm\u003cSignupForm>();\n    const [result, setResult] = useState(\"提交或单独校验账号后，在这里查看结果。\");\n    // Mutable operation identity: ignore validation feedback invalidated by reset or a newer run.\n    const validationRun = useRef(0);\n\n    return (\n        \u003cForm\n            className={formStyle}\n            form={form}\n            defaultValue={{ account: \"\", password: \"\", confirm: \"\", region: \"cn\" }}\n            onSubmitSuccess={async (values) => {\n                setResult(`校验通过：${values.account}，部署区域 ${values.region}。此演示不会创建真实账号。`);\n            }}\n            onSubmitFailed={async () => {\n                setResult(\"校验未通过，请修正字段下方显示的错误后重试。\");\n            }}\n        >\n            \u003cItem\n                label=\"账号\"\n                labelPlacement=\"control\"\n                name=\"account\"\n                adapter=\"value\"\n                required\n                supportingText=\"字母开头，长度 3–16 位。\"\n                rules={accountRules(() => (form.getFieldValue(\"account\") as string) ?? \"\")}\n            >\n                \u003cLineEdit placeholder=\"例如：crab_user\" />\n            \u003c/Item>\n\n            \u003cItem\n                label=\"密码\"\n                labelPlacement=\"control\"\n                name=\"password\"\n                adapter=\"value\"\n                required\n                supportingText=\"至少 8 位，包含大写字母与数字。\"\n                rules={passwordRules(() => (form.getFieldValue(\"password\") as string) ?? \"\")}\n            >\n                \u003cLineEdit type=\"password\" />\n            \u003c/Item>\n\n            \u003cItem\n                label=\"确认密码\"\n                labelPlacement=\"control\"\n                name=\"confirm\"\n                adapter=\"value\"\n                required\n                rules={[\n                    {\n                        type: RuleType.ERROR,\n                        validator: async () => {\n                            const pwd = form.getFieldValue(\"password\");\n                            const confirm = form.getFieldValue(\"confirm\");\n                            if (pwd !== confirm) {\n                                throw new Error(\"两次输入的密码不一致\");\n                            }\n                        },\n                    },\n                ]}\n            >\n                \u003cLineEdit type=\"password\" />\n            \u003c/Item>\n\n            \u003cItem label=\"区域\" name=\"region\" required>\n                {({ id, value, onValueChange, status, 'aria-invalid': invalid, 'aria-describedby': describedBy }) => (\n                    \u003cSelect id={id} aria-label=\"区域\" aria-invalid={invalid} aria-describedby={describedBy}\n                        value={typeof value === 'string' ? value : undefined} onValueChange={onValueChange} status={status}\n                        options={REGION_OPTIONS} placeholder=\"选择部署区域\" allowClear />\n                )}\n            \u003c/Item>\n\n            \u003cdiv className={actionRowStyle}>\n                \u003cButton type=\"button\" appearance=\"primary\" onClick={async () => { await form.submit(); }}>\n                    注册\n                \u003c/Button>\n                \u003cButton type=\"button\" onClick={async () => {\n                    validationRun.current += 1;\n                    await form.resetFields();\n                    setResult(\"已恢复初始值，并清除校验反馈。\");\n                }}>\n                    重置\n                \u003c/Button>\n                \u003cButton\n                    type=\"button\"\n                    appearance=\"text\"\n                    onClick={async () => {\n                        const run = ++validationRun.current;\n                        try {\n                            await form.validateFields([\"account\"]);\n                            if (run === validationRun.current) {\n                                setResult(\"账号校验完成；字段下方的警告不会阻止提交。\");\n                            }\n                        } catch {\n                            if (run === validationRun.current) {\n                                setResult(\"账号校验未通过，请查看账号下方的错误提示。\");\n                            }\n                        }\n                    }}\n                >\n                    仅校验账号\n                \u003c/Button>\n            \u003c/div>\n            \u003coutput aria-live=\"polite\">{result}\u003c/output>\n        \u003c/Form>\n    );\n}\n\nexport default ValidationDemo;\n",
        "previewPath": "/components/rc-form/workbench/?__wake_demo=docs%2Fdemos%2Fvalidation.demo.tsx",
        "workbenchPath": "/components/rc-form/workbench/#/components/docs%2Fdemos%2Fvalidation.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "使用示例"
    },
    {
        "id": "docs/demos/visual-states.demo.tsx",
        "title": "字段状态与显式适配",
        "description": "对照禁用、只读、原生值、原生勾选和类型化自定义协议；原生字段保留浏览器外观。",
        "learning": {
            "components": [
                "LineEdit",
                "Form",
                "Item",
                "Button"
            ],
            "props": [
                "value",
                "onValueChange",
                "form",
                "defaultValue",
                "onFieldValueChange",
                "name",
                "label",
                "labelPlacement",
                "disabled",
                "data-demo-state",
                "readOnly",
                "supportingText"
            ],
            "events": [
                "onValueChange",
                "onFieldValueChange",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport Button from '@crab-dev/rc-button';\nimport LineEdit from '@crab-dev/rc-line-edit';\nimport Form, { Item, useForm, type FieldAdapter } from '@crab-dev/rc-form';\nimport token from '@crab-dev/rc-token-semantic';\n\nexport const meta = {\n    title: '字段状态与显式适配',\n    description: '对照禁用、只读、原生值、原生勾选和类型化自定义协议；原生字段保留浏览器外观。',\n};\n\nconst layout = css`\n    display: grid;\n    gap: ${token.space['section-gap']};\n    max-width: calc(${token.size['40']} * 14);\n    min-width: 0;\n`;\n\ninterface PayloadEditorProps {\n    content?: string;\n    onCommit?: (payload: { text: string }) => void;\n    id?: string;\n    name?: string;\n    disabled?: boolean;\n    readOnly?: boolean;\n    'aria-invalid'?: boolean;\n    'aria-describedby'?: string;\n    'aria-busy'?: boolean;\n}\n\nconst payloadAdapter: FieldAdapter\u003cstring, PayloadEditorProps, [{ text: string }]> = {\n    valueProp: 'content',\n    changeProp: 'onCommit',\n    getValue: payload => payload.text,\n    getValueProps: content => ({ content: content ?? '' }),\n};\n\nfunction PayloadEditor({ content, onCommit, ...field }: PayloadEditorProps) {\n    return \u003cLineEdit {...field} value={content} onValueChange={text => onCommit?.({ text })} />;\n}\n\ninterface ExampleValues {\n    disabledName: string;\n    readonlyName: string;\n    nativeName: string;\n    nativeAccepted: boolean;\n    customName: string;\n}\n\nexport default function VisualStatesDemo() {\n    const [form] = useForm\u003cExampleValues>();\n    const [lastChange, setLastChange] = useState('尚未修改字段。');\n\n    return \u003csection className={layout} aria-label=\"表单状态与适配器\">\n        \u003cForm form={form} defaultValue={{\n            disabledName: '锁定工作区',\n            readonlyName: '归档工作区',\n            nativeName: '原生文本字段',\n            nativeAccepted: true,\n            customName: '自定义协议字段',\n        }} onFieldValueChange={change => setLastChange(JSON.stringify(change))}>\n            \u003cItem name=\"disabledName\" label=\"禁用工作区\" labelPlacement=\"control\" disabled data-demo-state=\"disabled\">\n                \u003cLineEdit />\n            \u003c/Item>\n            \u003cItem name=\"readonlyName\" label=\"只读工作区\" labelPlacement=\"control\" readOnly supportingText=\"只读内容仍可选择和复制。\" data-demo-state=\"readonly\">\n                \u003cLineEdit />\n            \u003c/Item>\n            \u003cItem name=\"nativeName\" label=\"原生名称\" adapter=\"native\" data-demo-state=\"native\">\n                \u003cinput type=\"text\" />\n            \u003c/Item>\n            \u003cItem name=\"nativeAccepted\" label=\"接收原生通知\" adapter=\"nativeChecked\" data-demo-state=\"native-checked\">\n                \u003cinput type=\"checkbox\" />\n            \u003c/Item>\n            \u003cItem name=\"customName\" label=\"自定义名称\" adapter={payloadAdapter} data-demo-state=\"custom-adapter\">\n                \u003cPayloadEditor />\n            \u003c/Item>\n        \u003c/Form>\n        \u003cButton type=\"button\" onClick={async () => {\n            await form.resetFields();\n            setLastChange('字段已重置。');\n        }}>重置字段\u003c/Button>\n        \u003coutput aria-live=\"polite\">{lastChange}\u003c/output>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-form/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-states.demo.tsx",
        "workbenchPath": "/components/rc-form/workbench/#/components/docs%2Fdemos%2Fvisual-states.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "使用示例"
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "表单校验与布局矩阵",
        "description": "通过真实校验进入错误、警告、成功和等待状态；外部标签与控件标签保持字段关联。",
        "learning": {
            "components": [
                "Form",
                "Item",
                "LineEdit",
                "Button"
            ],
            "props": [
                "form",
                "defaultValue",
                "name",
                "label",
                "labelPlacement",
                "required",
                "rules",
                "disabled",
                "readOnly",
                "supportingText",
                "aria-label",
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport Form, { Item, RuleType, useForm, type Rule } from '@crab-dev/rc-form';\nimport LineEdit from '@crab-dev/rc-line-edit';\nimport Button from '@crab-dev/rc-button';\nimport { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useId, useRef, useState } from 'react';\n\nexport const meta = { title: '表单校验与布局矩阵', description: '通过真实校验进入错误、警告、成功和等待状态；外部标签与控件标签保持字段关联。' };\nconst frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; max-width: calc(${token.size[40]} * 17); min-width: 0;`;\nconst actions = css`display: flex; flex-wrap: wrap; gap: ${token.space['group-gap']};`;\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const [form] = useForm\u003c{ name: string; owner: string }>();\n    const [state, setState] = useState('default');\n    const [result, setResult] = useState('尚未校验');\n    // A user-controlled completion represents a pending server validation; it\n    // allows natural loading video without imposing an arbitrary capture delay.\n    const complete = useRef\u003c(() => void) | null>(null);\n    const id = useId();\n    const english = locale === 'en-US';\n    const rules: Rule[] = [{ type: state === 'warning' ? RuleType.WARNING : RuleType.ERROR, validator: async () => {\n        if (state === 'validating') await new Promise\u003cvoid>(resolve => { complete.current = resolve; });\n        if (state === 'error') throw new Error(english ? 'This project name is unavailable.' : '此项目名称不可用。');\n        if (state === 'warning') throw new Error(english ? 'Confirm the shared project name.' : '请确认团队共享项目名称。');\n    } }];\n    return \u003csection className={frame} aria-label=\"Form visual matrix\" data-visual-scene data-state={state}>\n        \u003cdiv>\u003clabel htmlFor={id}>验收状态\u003c/label>{' '}\u003cselect id={id} value={state} onChange={event => setState(event.currentTarget.value)}>{['default', 'disabled', 'read-only', 'error', 'warning', 'success', 'validating'].map(value => \u003coption key={value}>{value}\u003c/option>)}\u003c/select>\u003c/div>\n        \u003cForm form={form} defaultValue={{ name: 'Crab workspace', owner: 'Design team' }}>\n            \u003cItem name=\"name\" label={english ? 'Project name' : '项目名称'} labelPlacement=\"control\" required rules={rules} disabled={state === 'disabled'} readOnly={state === 'read-only'} supportingText={english ? 'Shared with your workspace members.' : '此名称会向工作区成员展示。'}>\u003cLineEdit aria-label=\"项目名称\" />\u003c/Item>\n            \u003cItem name=\"owner\" label={english ? 'Project owner' : '项目负责人'} disabled={state === 'disabled'} readOnly={state === 'read-only'}>\u003cLineEdit aria-label=\"项目负责人\" />\u003c/Item>\n        \u003c/Form>\n        \u003cdiv className={actions}>\n            \u003cButton onClick={async () => { try { await form.validateFields(); setResult('校验完成'); } catch { setResult('校验失败'); } }} disabled={state === 'disabled'}>校验字段\u003c/Button>\n            \u003cButton appearance=\"outlined\" onClick={async () => { complete.current?.(); complete.current = null; await form.resetFields(); setResult('字段已重置'); }}>重置字段\u003c/Button>\n            {state === 'validating' && \u003cButton appearance=\"text\" onClick={() => { complete.current?.(); complete.current = null; }}>完成校验\u003c/Button>}\n        \u003c/div>\n        \u003coutput aria-live=\"polite\">{result}\u003c/output>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-form/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-form/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "视觉验收"
    }
] as const satisfies readonly ComponentDemoRecord[];
