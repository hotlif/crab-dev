export const meta = {
    title: "字段校验",
    description: "使用 required 与自定义 rules 组合 rc-line-edit / rc-select，演示同步与异步校验。",
};

import { css } from "@crab-dev/css";
import { useRef, useState } from "react";

import Button from "@crab-dev/rc-button";
import LineEdit from "@crab-dev/rc-line-edit";
import Select from "@crab-dev/rc-select";

import Form, { Item, useForm } from "../../src/index.js";
import { type Rule, RuleType } from "../../src/types.js";

interface SignupForm {
    account: string;
    password: string;
    confirm: string;
    region: string;
}

const formStyle = css`
    max-width: 520px;
`;

const actionRowStyle = css`
    display: flex;
    gap: 12px;
    margin-top: 8px;
`;

const REGION_OPTIONS = [
    { label: "中国大陆", value: "cn" },
    { label: "新加坡", value: "sg" },
    { label: "美国西部", value: "us-west" },
];

// 异步校验：账号唯一性（模拟 500ms 服务端查询）
const accountRules = (getValue: () => string): Rule[] => [
    {
        type: RuleType.ERROR,
        validator: async () => {
            const v = getValue();
            if (!/^[a-zA-Z][a-zA-Z0-9_]{2,15}$/.test(v)) {
                throw new Error("账号需以字母开头，长度 3-16 位");
            }
        },
    },
    {
        type: RuleType.WARNING,
        validator: async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (getValue().toLowerCase() === "admin") {
                throw new Error("账号 admin 已被占用");
            }
        },
    },
];

const passwordRules = (getValue: () => string): Rule[] => [
    {
        type: RuleType.ERROR,
        validator: async () => {
            const v = getValue();
            if (v.length < 8) {
                throw new Error("密码至少 8 位");
            }
            if (!/[A-Z]/.test(v) || !/[0-9]/.test(v)) {
                throw new Error("密码需包含大写字母与数字");
            }
        },
    },
];

function ValidationDemo() {
    const [form] = useForm<SignupForm>();
    const [result, setResult] = useState("提交或单独校验账号后，在这里查看结果。");
    // Mutable operation identity: ignore validation feedback invalidated by reset or a newer run.
    const validationRun = useRef(0);

    return (
        <Form
            className={formStyle}
            form={form}
            defaultValue={{ account: "", password: "", confirm: "", region: "cn" }}
            onSubmitSuccess={async (values) => {
                setResult(`校验通过：${values.account}，部署区域 ${values.region}。此演示不会创建真实账号。`);
            }}
            onSubmitFailed={async () => {
                setResult("校验未通过，请修正字段下方显示的错误后重试。");
            }}
        >
            <Item
                label="账号"
                labelPlacement="control"
                name="account"
                binding="event"
                required
                supportingText="字母开头，长度 3–16 位。"
                rules={accountRules(() => (form.getFieldValue("account") as string) ?? "")}
            >
                <LineEdit placeholder="例如：crab_user" />
            </Item>

            <Item
                label="密码"
                labelPlacement="control"
                name="password"
                binding="event"
                required
                supportingText="至少 8 位，包含大写字母与数字。"
                rules={passwordRules(() => (form.getFieldValue("password") as string) ?? "")}
            >
                <LineEdit type="password" />
            </Item>

            <Item
                label="确认密码"
                labelPlacement="control"
                name="confirm"
                binding="event"
                required
                rules={[
                    {
                        type: RuleType.ERROR,
                        validator: async () => {
                            const pwd = form.getFieldValue("password");
                            const confirm = form.getFieldValue("confirm");
                            if (pwd !== confirm) {
                                throw new Error("两次输入的密码不一致");
                            }
                        },
                    },
                ]}
            >
                <LineEdit type="password" />
            </Item>

            <Item label="区域" name="region" required>
                {({ id, value, onChange, status, 'aria-invalid': invalid, 'aria-describedby': describedBy }) => (
                    <Select id={id} aria-label="区域" aria-invalid={invalid} aria-describedby={describedBy}
                        value={typeof value === 'string' ? value : undefined} onChange={onChange} status={status}
                        options={REGION_OPTIONS} placeholder="选择部署区域" allowClear />
                )}
            </Item>

            <div className={actionRowStyle}>
                <Button type="button" appearance="primary" onClick={async () => { await form.submit(); }}>
                    注册
                </Button>
                <Button type="button" onClick={async () => {
                    validationRun.current += 1;
                    await form.resetFields();
                    setResult("已恢复初始值，并清除校验反馈。");
                }}>
                    重置
                </Button>
                <Button
                    type="button"
                    appearance="text"
                    onClick={async () => {
                        const run = ++validationRun.current;
                        try {
                            await form.validateFields(["account"]);
                            if (run === validationRun.current) {
                                setResult("账号校验完成；字段下方的警告不会阻止提交。");
                            }
                        } catch {
                            if (run === validationRun.current) {
                                setResult("账号校验未通过，请查看账号下方的错误提示。");
                            }
                        }
                    }}
                >
                    仅校验账号
                </Button>
            </div>
            <output aria-live="polite">{result}</output>
        </Form>
    );
}

export default ValidationDemo;
