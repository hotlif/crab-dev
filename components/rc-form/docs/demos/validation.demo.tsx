/**
 * label="字段校验"
 * description="使用 required 与自定义 rules 组合 rc-line-edit / rc-select，演示同步与异步校验。"
 */

import { css } from "@linaria/core";
import { type FC } from "react";

import Button from "@crab-dev/rc-button";
import LineEdit from "@crab-dev/rc-line-edit";
import Select from "@crab-dev/rc-select";

import Form, { Item, useForm } from "../../src/index.js";
import { type FormItemEditor, type Rule, RuleType } from "../../src/types.js";

const LineEditField: FC<FormItemEditor<string> & { placeholder?: string; type?: string }> = ({
    value,
    onChange,
    placeholder,
    type,
    status,
}) => (
    <LineEdit
        value={value ?? ""}
        type={type}
        status={status}
        className={css`width: 100%;`}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
    />
);

interface SignupForm extends Record<string, unknown> {
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

const ValidationDemo: FC = () => {
    const [form] = useForm<SignupForm>();

    return (
        <Form
            className={formStyle}
            form={form}
            defaultValue={{ account: "", password: "", confirm: "", region: "cn" }}
            onSubmitSuccess={async (values) => {
                console.log("[submit:success]", values);
            }}
            onSubmitFailed={async () => {
                console.warn("[submit:failed] 请修正字段后重试");
            }}
        >
            <Item
                label="账号"
                name="account"
                required
                rules={accountRules(() => (form.getFieldValue("account") as string) ?? "")}
            >
                <LineEditField placeholder="字母开头，3-16 位" />
            </Item>

            <Item
                label="密码"
                name="password"
                required
                rules={passwordRules(() => (form.getFieldValue("password") as string) ?? "")}
            >
                <LineEditField type="password" placeholder="至少 8 位，含大写字母与数字" />
            </Item>

            <Item
                label="确认密码"
                name="confirm"
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
                <LineEditField type="password" placeholder="再次输入密码" />
            </Item>

            <Item label="区域" name="region" required>
                <Select options={REGION_OPTIONS} placeholder="选择部署区域" />
            </Item>

            <div className={actionRowStyle}>
                <Button appearance="primary" onClick={() => form.submit()}>
                    注册
                </Button>
                <Button onClick={() => form.resetFields()}>
                    重置
                </Button>
                <Button
                    appearance="text"
                    onClick={async () => {
                        try {
                            await form.validateFields(["account"]);
                            console.log("[validate] 账号校验通过");
                        } catch {
                            // 校验失败信息由 Item 内部展示
                        }
                    }}
                >
                    仅校验账号
                </Button>
            </div>
        </Form>
    );
};

export default ValidationDemo;
