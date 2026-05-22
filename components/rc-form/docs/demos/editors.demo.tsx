/**
 * label="搭配 crab-dev 编辑器"
 * description="将 rc-form 与同体系的 rc-line-edit / rc-select / rc-checkbox / rc-radio / rc-switch / rc-slider / rc-button 组合，演示生态内循环。"
 */

import { css } from "@linaria/core";
import { type FC } from "react";

import Button from "@crab-dev/rc-button";
import Checkbox, { CheckboxGroup } from "@crab-dev/rc-checkbox";
import LineEdit from "@crab-dev/rc-line-edit";
import Radio, { RadioGroup } from "@crab-dev/rc-radio";
import Select from "@crab-dev/rc-select";
import Slider from "@crab-dev/rc-slider";
import Switch from "@crab-dev/rc-switch";

import Form, { Item, useForm } from "../../src/index.js";
import type { FormItemEditor } from "../../src/types.js";

// ---------- 适配器：把 crab-dev 组件包装成 FormItemEditor ----------

const LineEditField: FC<FormItemEditor<string> & { placeholder?: string; type?: string }> = ({
    value,
    onChange,
    placeholder,
    type,
}) => (
    <LineEdit
        value={value ?? ""}
        type={type}
        className={css`width: 100%;`}
        inputProps={{
            placeholder,
            onChange: (e) => onChange?.(e.target.value),
        }}
    />
);

const SwitchField: FC<FormItemEditor<boolean> & { label: string }> = ({
    value,
    onChange,
    label,
}) => (
    <Switch
        checked={value ?? false}
        onChange={(checked: boolean) => onChange?.(checked)}
        aria-label={label}
    />
);

const SingleCheckboxField: FC<FormItemEditor<boolean> & { children: string }> = ({
    value,
    onChange,
    children,
}) => (
    <Checkbox
        checked={value ?? false}
        onChange={(checked: boolean) => onChange?.(checked)}
    >
        {children}
    </Checkbox>
);

const SliderField: FC<FormItemEditor<number>> = ({ value, onChange }) => (
    <Slider
        value={value ?? 0}
        min={0}
        max={100}
        step={1}
        onValueChange={(v) => onChange?.(v)}
    />
);

// ---------- 表单数据形态 ----------

interface ProfileForm extends Record<string, unknown> {
    username: string;
    email: string;
    role: string;
    tags: Array<string | number>;
    plan: string | number;
    receiveEmail: boolean;
    agree: boolean;
    quota: number;
}

const formStyle = css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 520px;
`;

const actionRowStyle = css`
    display: flex;
    gap: 12px;
    margin-top: 8px;
`;

const ROLE_OPTIONS = [
    { label: "管理员", value: "admin" },
    { label: "开发者", value: "developer" },
    { label: "访客", value: "guest" },
];

const EditorsDemo: FC = () => {
    const [form] = useForm<ProfileForm>();

    return (
        <Form
            className={formStyle}
            form={form}
            defaultValue={{
                username: "ada",
                email: "ada@example.com",
                role: "developer",
                tags: ["typescript"],
                plan: "pro",
                receiveEmail: true,
                agree: false,
                quota: 30,
            }}
            onFieldValueChange={async (changed) => {
                console.log("[changed]", changed);
            }}
            onSubmitSuccess={async (values) => {
                console.log("[submit:success]", values);
            }}
            onSubmitFailed={async (err) => {
                console.warn("[submit:failed]", err);
            }}
        >
            <Item label="用户名" name="username" required>
                <LineEditField placeholder="请输入用户名" />
            </Item>

            <Item label="邮箱" name="email" required>
                <LineEditField placeholder="name@example.com" type="email" />
            </Item>

            <Item label="角色" name="role" required>
                <Select options={ROLE_OPTIONS} placeholder="选择角色" />
            </Item>

            <Item label="技能" name="tags">
                <CheckboxGroup>
                    <Checkbox value="typescript">TypeScript</Checkbox>
                    <Checkbox value="react">React</Checkbox>
                    <Checkbox value="rust">Rust</Checkbox>
                </CheckboxGroup>
            </Item>

            <Item label="套餐" name="plan">
                <RadioGroup>
                    <Radio value="free">Free</Radio>
                    <Radio value="pro">Pro</Radio>
                    <Radio value="team">Team</Radio>
                </RadioGroup>
            </Item>

            <Item label="接收邮件" name="receiveEmail">
                <SwitchField label="接收邮件" />
            </Item>

            <Item label="额度" name="quota">
                <SliderField />
            </Item>

            <Item label="协议" name="agree" required>
                <SingleCheckboxField>我已阅读并同意服务条款</SingleCheckboxField>
            </Item>

            <div className={actionRowStyle}>
                <Button appearance="primary" onClick={() => form.submit()}>
                    提交
                </Button>
                <Button onClick={() => form.resetFields()}>
                    重置
                </Button>
                <Button
                    appearance="text"
                    onClick={() => {
                        console.log("[snapshot]", form.getFieldsValue());
                    }}
                >
                    打印当前值
                </Button>
            </div>
        </Form>
    );
};

export default EditorsDemo;
