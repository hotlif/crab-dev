/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "基础用法",
        "description": "字段标签与校验交给 LineEdit 呈现，随全局切换 Material 浮动标签或 shadcn 左侧标签与紧凑输入同排的布局，并保留表单实例操作。",
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
                "onFieldValueChange",
                "onSubmitSuccess",
                "onSubmitFailed",
                "label",
                "labelPlacement",
                "name",
                "binding",
                "required",
                "placeholder",
                "type"
            ],
            "events": [
                "onFieldValueChange",
                "onSubmitSuccess",
                "onSubmitFailed",
                "onClick"
            ],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"字段标签与校验交给 LineEdit 呈现，随全局切换 Material 浮动标签或 shadcn 左侧标签与紧凑输入同排的布局，并保留表单实例操作。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Button from \"@crab-dev/rc-button\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport Form, { Item, useForm } from \"../../src/index.js\";\n\ninterface UserInfo {\n    user: {\n        username: string;\n        password: string;\n    };\n}\n\nconst formStyle = css`\n    max-width: 480px;\n`;\n\nconst actionRowStyle = css`\n    display: flex;\n    flex-wrap: wrap;\n    gap: 8px;\n    margin-top: 4px;\n`;\n\nconst SimpleFrame = () => {\n    const [form] = useForm\u003cUserInfo>();\n\n    return (\n        \u003cForm\n            className={formStyle}\n            form={form}\n            defaultValue={{\n                user: {\n                    username: \"ada\",\n                    password: \"password\",\n                },\n            }}\n            onFieldValueChange={async (changed, allValues) => {\n                console.log(\"[changed]\", changed);\n                console.log(\"[allValues]\", allValues);\n            }}\n            onSubmitSuccess={async (result) => {\n                console.log(\"[submit:success]\", result);\n            }}\n            onSubmitFailed={async (result) => {\n                console.warn(\"[submit:failed]\", result);\n            }}\n        >\n            \u003cItem label=\"用户名\" labelPlacement=\"control\" name={[\"user\", \"username\"]} binding=\"event\" required>\n                \u003cLineEdit placeholder=\"请输入用户名\" />\n            \u003c/Item>\n            \u003cItem label=\"密码\" labelPlacement=\"control\" name={[\"user\", \"password\"]} binding=\"event\" required>\n                \u003cLineEdit type=\"password\" placeholder=\"请输入密码\" />\n            \u003c/Item>\n\n            \u003cdiv className={actionRowStyle}>\n                \u003cButton appearance=\"primary\" onClick={async () => { await form.submit(); }}>\n                    提交\n                \u003c/Button>\n                \u003cButton onClick={() => form.resetFields()}>\n                    重置\n                \u003c/Button>\n                \u003cButton\n                    appearance=\"subtle\"\n                    onClick={() => {\n                        console.log(\"[getFieldsValue]\", form.getFieldsValue());\n                    }}\n                >\n                    getFieldsValue\n                \u003c/Button>\n                \u003cButton\n                    appearance=\"subtle\"\n                    onClick={() => {\n                        const username = form.getFieldValue([\"user\", \"username\"]);\n                        const password = form.getFieldValue([\"user\", \"password\"]);\n                        console.log(\"[getFieldValue] username =\", username, \"| password =\", password);\n                    }}\n                >\n                    getFieldValue\n                \u003c/Button>\n                \u003cButton\n                    appearance=\"subtle\"\n                    onClick={() => {\n                        form.setFieldsValue({\n                            user: {\n                                username: `user-${crypto.randomUUID().slice(0, 8)}`,\n                                password: `pwd-${crypto.randomUUID().slice(0, 8)}`,\n                            },\n                        });\n                    }}\n                >\n                    setFieldsValue\n                \u003c/Button>\n                \u003cButton\n                    appearance=\"subtle\"\n                    onClick={() => {\n                        form.setFieldValue([\"user\", \"username\"], crypto.randomUUID().slice(0, 8));\n                    }}\n                >\n                    setFieldValue\n                \u003c/Button>\n            \u003c/div>\n        \u003c/Form>\n    );\n};\n\nexport default SimpleFrame;\n",
        "previewPath": "/components/rc-form/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-form/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
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
                "value",
                "min",
                "max",
                "step",
                "onValueChange",
                "form",
                "defaultValue",
                "onFieldValueChange",
                "onSubmitSuccess",
                "onSubmitFailed",
                "label",
                "labelPlacement"
            ],
            "events": [
                "onValueChange",
                "onFieldValueChange",
                "onSubmitSuccess",
                "onSubmitFailed",
                "onChange",
                "onClick"
            ],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"搭配 crab-dev 编辑器\",\n    description: \"将 rc-form 与同体系的 rc-line-edit / rc-select / rc-checkbox / rc-radio / rc-switch / rc-slider / rc-button 组合，演示生态内循环。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { type FC } from \"react\";\n\nimport Button from \"@crab-dev/rc-button\";\nimport Checkbox, { CheckboxGroup } from \"@crab-dev/rc-checkbox\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport Radio, { RadioGroup } from \"@crab-dev/rc-radio\";\nimport Select from \"@crab-dev/rc-select\";\nimport Slider from \"@crab-dev/rc-slider\";\nimport Switch from \"@crab-dev/rc-switch\";\n\nimport Form, { Item, useForm } from \"../../src/index.js\";\nimport type { FormItemEditor } from \"../../src/types.js\";\n\nconst SliderField: FC\u003cFormItemEditor\u003cnumber>> = ({ value, onChange }) => (\n    \u003cSlider\n        value={value ?? 0}\n        min={0}\n        max={100}\n        step={1}\n        onValueChange={(v) => onChange?.(v)}\n    />\n);\n\n// ---------- 表单数据形态 ----------\n\ninterface ProfileForm {\n    username: string;\n    email: string;\n    role: string;\n    tags: Array\u003cstring | number>;\n    plan: string | number;\n    receiveEmail: boolean;\n    agree: boolean;\n    quota: number;\n}\n\n// Form 内部使用 grid + subgrid 承载「标签 / 编辑器 / 状态」三列布局，\n// 这里只约束宽度，不得覆盖 display，否则 subgrid 因父级非 grid 而失效、布局塌陷。\nconst formStyle = css`\n    max-width: 520px;\n`;\n\nconst actionRowStyle = css`\n    display: flex;\n    gap: 12px;\n    margin-top: 8px;\n`;\n\nconst ROLE_OPTIONS = [\n    { label: \"管理员\", value: \"admin\" },\n    { label: \"开发者\", value: \"developer\" },\n    { label: \"访客\", value: \"guest\" },\n];\n\nconst EditorsDemo: FC = () => {\n    const [form] = useForm\u003cProfileForm>();\n\n    return (\n        \u003cForm\n            className={formStyle}\n            form={form}\n            defaultValue={{\n                username: \"ada\",\n                email: \"ada@example.com\",\n                role: \"developer\",\n                tags: [\"typescript\"],\n                plan: \"pro\",\n                receiveEmail: true,\n                agree: false,\n                quota: 30,\n            }}\n            onFieldValueChange={async (changed) => {\n                console.log(\"[changed]\", changed);\n            }}\n            onSubmitSuccess={async (values) => {\n                console.log(\"[submit:success]\", values);\n            }}\n            onSubmitFailed={async (err) => {\n                console.warn(\"[submit:failed]\", err);\n            }}\n        >\n            \u003cItem label=\"用户名\" labelPlacement=\"control\" name=\"username\" binding=\"event\" required>\n                \u003cLineEdit placeholder=\"请输入用户名\" />\n            \u003c/Item>\n\n            \u003cItem label=\"邮箱\" labelPlacement=\"control\" name=\"email\" binding=\"event\" required>\n                \u003cLineEdit placeholder=\"name@example.com\" type=\"email\" />\n            \u003c/Item>\n\n            \u003cItem label=\"角色\" name=\"role\" required>\n                {({ id, value, onChange, status, 'aria-invalid': invalid, 'aria-describedby': describedBy }) => (\n                    \u003cSelect id={id} aria-label=\"角色\" aria-invalid={invalid} aria-describedby={describedBy}\n                        value={typeof value === 'string' ? value : undefined} onChange={onChange} status={status}\n                        options={ROLE_OPTIONS} placeholder=\"选择角色\" />\n                )}\n            \u003c/Item>\n\n            \u003cItem label=\"技能\" name=\"tags\">\n                {({ id, value, onChange, 'aria-invalid': invalid, 'aria-describedby': describedBy }) => (\n                    \u003cCheckboxGroup\n                        value={Array.isArray(value) ? value.filter((entry: unknown): entry is string | number => typeof entry === 'string' || typeof entry === 'number') : []}\n                        onChange={onChange}\n                    >\n                        \u003cCheckbox id={id} value=\"typescript\" aria-invalid={invalid} aria-describedby={describedBy}>TypeScript\u003c/Checkbox>\n                        \u003cCheckbox value=\"react\" aria-invalid={invalid} aria-describedby={describedBy}>React\u003c/Checkbox>\n                        \u003cCheckbox value=\"rust\" aria-invalid={invalid} aria-describedby={describedBy}>Rust\u003c/Checkbox>\n                    \u003c/CheckboxGroup>\n                )}\n            \u003c/Item>\n\n            \u003cItem label=\"套餐\" name=\"plan\">\n                {({ id, value, onChange, 'aria-invalid': invalid, 'aria-describedby': describedBy }) => (\n                    \u003cRadioGroup\n                        aria-label=\"套餐\"\n                        aria-describedby={describedBy}\n                        value={typeof value === 'string' || typeof value === 'number' ? value : undefined}\n                        onChange={onChange}\n                    >\n                        \u003cRadio id={id} value=\"free\" aria-invalid={invalid}>Free\u003c/Radio>\n                        \u003cRadio value=\"pro\" aria-invalid={invalid}>Pro\u003c/Radio>\n                        \u003cRadio value=\"team\" aria-invalid={invalid}>Team\u003c/Radio>\n                    \u003c/RadioGroup>\n                )}\n            \u003c/Item>\n\n            \u003cItem label=\"接收邮件\" name=\"receiveEmail\" binding=\"checked\">\n                \u003cSwitch aria-label=\"接收邮件\" />\n            \u003c/Item>\n\n            \u003cItem label=\"额度\" name=\"quota\">\n                \u003cSliderField />\n            \u003c/Item>\n\n            \u003cItem label=\"协议\" name=\"agree\" binding=\"checked\" required>\n                \u003cCheckbox>我已阅读并同意服务条款\u003c/Checkbox>\n            \u003c/Item>\n\n            \u003cdiv className={actionRowStyle}>\n                \u003cButton appearance=\"primary\" onClick={async () => { await form.submit(); }}>\n                    提交\n                \u003c/Button>\n                \u003cButton onClick={() => form.resetFields()}>\n                    重置\n                \u003c/Button>\n                \u003cButton\n                    appearance=\"text\"\n                    onClick={() => {\n                        console.log(\"[snapshot]\", form.getFieldsValue());\n                    }}\n                >\n                    打印当前值\n                \u003c/Button>\n            \u003c/div>\n        \u003c/Form>\n    );\n};\n\nexport default EditorsDemo;\n",
        "previewPath": "/components/rc-form/workbench/?__wake_demo=docs%2Fdemos%2Feditors.demo.tsx",
        "workbenchPath": "/components/rc-form/workbench/#/components/docs%2Fdemos%2Feditors.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/filled.demo.tsx",
        "title": "Filled 填充字段",
        "description": "同一表单统一使用 filled。Material 呈现 56px 填充容器、浮动标签和焦点底线；切换 shadcn 后，左侧标签与右侧紧凑输入保持同排。",
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
                "binding",
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
        "sourceCode": "export const meta = {\n    title: \"Filled 填充字段\",\n    description: \"同一表单统一使用 filled。Material 呈现 56px 填充容器、浮动标签和焦点底线；切换 shadcn 后，左侧标签与右侧紧凑输入保持同排。\",\n};\n\nimport { useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Button from \"@crab-dev/rc-button\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport Form, { Item, useForm } from \"../../src/index.js\";\n\nconst layout = css`\n    display: grid;\n    gap: ${token.space['section-gap']};\n    max-width: calc(${token.size['40']} * 12);\n    min-width: 0;\n`;\nconst actions = css`\n    display: flex;\n    flex-wrap: wrap;\n    gap: ${token.space['component-gap']};\n`;\n\ninterface WorkspaceForm {\n    name: string;\n    email: string;\n}\n\nexport default function FilledDemo() {\n    const [form] = useForm\u003cWorkspaceForm>();\n    const [result, setResult] = useState(\"\");\n\n    return (\n        \u003cdiv className={layout}>\n            \u003cForm\n                form={form}\n                defaultValue={{ name: \"\", email: \"\" }}\n                onSubmitSuccess={async (values) => {\n                    setResult(`已保存：${values.name} · ${values.email}`);\n                }}\n            >\n                \u003cItem\n                    name=\"name\"\n                    label=\"工作空间名称\"\n                    labelPlacement=\"control\"\n                    binding=\"event\"\n                    supportingText=\"名称会显示在团队首页。\"\n                    required\n                >\n                    \u003cLineEdit appearance=\"filled\" placeholder=\"例如：产品设计组\" />\n                \u003c/Item>\n                \u003cItem\n                    name=\"email\"\n                    label=\"联系邮箱\"\n                    labelPlacement=\"control\"\n                    binding=\"event\"\n                    supportingText=\"用于接收空间邀请和重要通知。\"\n                    required\n                >\n                    \u003cLineEdit appearance=\"filled\" type=\"email\" placeholder=\"name@example.com\" />\n                \u003c/Item>\n                \u003cdiv className={actions}>\n                    \u003cButton appearance=\"primary\" onClick={async () => { await form.submit(); }}>保存空间\u003c/Button>\n                    \u003cButton onClick={async () => {\n                        await form.resetFields();\n                        setResult(\"\");\n                    }}>重置\u003c/Button>\n                \u003c/div>\n            \u003c/Form>\n            \u003coutput aria-live=\"polite\">{result || \"填写后保存；留空提交可查看字段错误。\"}\u003c/output>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-form/workbench/?__wake_demo=docs%2Fdemos%2Ffilled.demo.tsx",
        "workbenchPath": "/components/rc-form/workbench/#/components/docs%2Fdemos%2Ffilled.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
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
                "binding",
                "required",
                "supportingText",
                "rules",
                "placeholder"
            ],
            "events": [
                "onSubmitSuccess",
                "onSubmitFailed",
                "onChange",
                "onClick"
            ],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"字段校验\",\n    description: \"使用 required 与自定义 rules 组合 rc-line-edit / rc-select，演示同步与异步校验。\",\n};\n\nimport { css } from \"@crab-dev/css\";\n\nimport Button from \"@crab-dev/rc-button\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport Select from \"@crab-dev/rc-select\";\n\nimport Form, { Item, useForm } from \"../../src/index.js\";\nimport { type Rule, RuleType } from \"../../src/types.js\";\n\ninterface SignupForm {\n    account: string;\n    password: string;\n    confirm: string;\n    region: string;\n}\n\nconst formStyle = css`\n    max-width: 520px;\n`;\n\nconst actionRowStyle = css`\n    display: flex;\n    gap: 12px;\n    margin-top: 8px;\n`;\n\nconst REGION_OPTIONS = [\n    { label: \"中国大陆\", value: \"cn\" },\n    { label: \"新加坡\", value: \"sg\" },\n    { label: \"美国西部\", value: \"us-west\" },\n];\n\n// 异步校验：账号唯一性（模拟 500ms 服务端查询）\nconst accountRules = (getValue: () => string): Rule[] => [\n    {\n        type: RuleType.ERROR,\n        validator: async () => {\n            const v = getValue();\n            if (!/^[a-zA-Z][a-zA-Z0-9_]{2,15}$/.test(v)) {\n                throw new Error(\"账号需以字母开头，长度 3-16 位\");\n            }\n        },\n    },\n    {\n        type: RuleType.WARNING,\n        validator: async () => {\n            await new Promise((resolve) => setTimeout(resolve, 500));\n            if (getValue().toLowerCase() === \"admin\") {\n                throw new Error(\"账号 admin 已被占用\");\n            }\n        },\n    },\n];\n\nconst passwordRules = (getValue: () => string): Rule[] => [\n    {\n        type: RuleType.ERROR,\n        validator: async () => {\n            const v = getValue();\n            if (v.length \u003c 8) {\n                throw new Error(\"密码至少 8 位\");\n            }\n            if (!/[A-Z]/.test(v) || !/[0-9]/.test(v)) {\n                throw new Error(\"密码需包含大写字母与数字\");\n            }\n        },\n    },\n];\n\nfunction ValidationDemo() {\n    const [form] = useForm\u003cSignupForm>();\n\n    return (\n        \u003cForm\n            className={formStyle}\n            form={form}\n            defaultValue={{ account: \"\", password: \"\", confirm: \"\", region: \"cn\" }}\n            onSubmitSuccess={async (values) => {\n                console.log(\"[submit:success]\", values);\n            }}\n            onSubmitFailed={async () => {\n                console.warn(\"[submit:failed] 请修正字段后重试\");\n            }}\n        >\n            \u003cItem\n                label=\"账号\"\n                labelPlacement=\"control\"\n                name=\"account\"\n                binding=\"event\"\n                required\n                supportingText=\"字母开头，长度 3–16 位。\"\n                rules={accountRules(() => (form.getFieldValue(\"account\") as string) ?? \"\")}\n            >\n                \u003cLineEdit placeholder=\"例如：crab_user\" />\n            \u003c/Item>\n\n            \u003cItem\n                label=\"密码\"\n                labelPlacement=\"control\"\n                name=\"password\"\n                binding=\"event\"\n                required\n                supportingText=\"至少 8 位，包含大写字母与数字。\"\n                rules={passwordRules(() => (form.getFieldValue(\"password\") as string) ?? \"\")}\n            >\n                \u003cLineEdit type=\"password\" />\n            \u003c/Item>\n\n            \u003cItem\n                label=\"确认密码\"\n                labelPlacement=\"control\"\n                name=\"confirm\"\n                binding=\"event\"\n                required\n                rules={[\n                    {\n                        type: RuleType.ERROR,\n                        validator: async () => {\n                            const pwd = form.getFieldValue(\"password\");\n                            const confirm = form.getFieldValue(\"confirm\");\n                            if (pwd !== confirm) {\n                                throw new Error(\"两次输入的密码不一致\");\n                            }\n                        },\n                    },\n                ]}\n            >\n                \u003cLineEdit type=\"password\" />\n            \u003c/Item>\n\n            \u003cItem label=\"区域\" name=\"region\" required>\n                {({ id, value, onChange, status, 'aria-invalid': invalid, 'aria-describedby': describedBy }) => (\n                    \u003cSelect id={id} aria-label=\"区域\" aria-invalid={invalid} aria-describedby={describedBy}\n                        value={typeof value === 'string' ? value : undefined} onChange={onChange} status={status}\n                        options={REGION_OPTIONS} placeholder=\"选择部署区域\" />\n                )}\n            \u003c/Item>\n\n            \u003cdiv className={actionRowStyle}>\n                \u003cButton appearance=\"primary\" onClick={async () => { await form.submit(); }}>\n                    注册\n                \u003c/Button>\n                \u003cButton onClick={() => form.resetFields()}>\n                    重置\n                \u003c/Button>\n                \u003cButton\n                    appearance=\"text\"\n                    onClick={async () => {\n                        try {\n                            await form.validateFields([\"account\"]);\n                            console.log(\"[validate] 账号校验通过\");\n                        } catch {\n                            // 校验失败信息由 Item 内部展示\n                        }\n                    }}\n                >\n                    仅校验账号\n                \u003c/Button>\n            \u003c/div>\n        \u003c/Form>\n    );\n}\n\nexport default ValidationDemo;\n",
        "previewPath": "/components/rc-form/workbench/?__wake_demo=docs%2Fdemos%2Fvalidation.demo.tsx",
        "workbenchPath": "/components/rc-form/workbench/#/components/docs%2Fdemos%2Fvalidation.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
