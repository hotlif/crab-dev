export const meta = {
    title: "搭配 crab-dev 编辑器",
    description: "将 rc-form 与同体系的 rc-line-edit / rc-select / rc-checkbox / rc-radio / rc-switch / rc-slider / rc-button 组合，演示生态内循环。",
};

import { css } from "@crab-dev/css";
import { type FC, useState } from "react";
import token from "@crab-dev/rc-token-semantic";

import Button from "@crab-dev/rc-button";
import Checkbox, { CheckboxGroup } from "@crab-dev/rc-checkbox";
import LineEdit from "@crab-dev/rc-line-edit";
import Radio, { RadioGroup } from "@crab-dev/rc-radio";
import Select from "@crab-dev/rc-select";
import Slider from "@crab-dev/rc-slider";
import Switch from "@crab-dev/rc-switch";

import Form, { Item, useForm } from "../../src/index.js";
import type { FormItemEditor } from "../../src/types.js";

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

interface ProfileForm {
    username: string;
    email: string;
    role: string;
    tags: Array<string | number>;
    plan: string | number;
    receiveEmail: boolean;
    agree: boolean;
    quota: number;
}

// Form 内部使用 grid + subgrid 承载「标签 / 编辑器 / 状态」三列布局，
// 这里只约束宽度，不得覆盖 display，否则 subgrid 因父级非 grid 而失效、布局塌陷。
const formStyle = css`
    max-width: 520px;
`;

const actionRowStyle = css`
    display: flex;
    gap: 12px;
    margin-top: 8px;
`;

const resultStyle = css`
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    color: ${token.color.text.secondary};
`;

const ROLE_OPTIONS = [
    { label: "管理员", value: "admin" },
    { label: "开发者", value: "developer" },
    { label: "访客", value: "guest" },
];

const EditorsDemo: FC = () => {
    const [form] = useForm<ProfileForm>();
    const [result, setResult] = useState("修改编辑器后，可查看当前值或提交校验。");

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
            onSubmitSuccess={async (values) => {
                setResult(`提交成功：${JSON.stringify(values, null, 2)}`);
            }}
            onSubmitFailed={async () => {
                setResult("提交未通过，请根据字段下方的错误提示补全内容。");
            }}
        >
            <Item label="用户名" labelPlacement="control" name="username" binding="event" required>
                <LineEdit placeholder="请输入用户名" />
            </Item>

            <Item label="邮箱" labelPlacement="control" name="email" binding="event" required>
                <LineEdit placeholder="name@example.com" type="email" />
            </Item>

            <Item label="角色" name="role" required>
                {({ id, value, onChange, status, 'aria-invalid': invalid, 'aria-describedby': describedBy }) => (
                    <Select id={id} aria-label="角色" aria-invalid={invalid} aria-describedby={describedBy}
                        value={typeof value === 'string' ? value : undefined} onChange={onChange} status={status}
                        options={ROLE_OPTIONS} placeholder="选择角色" />
                )}
            </Item>

            <Item label="技能" name="tags">
                {({ id, value, onChange, 'aria-invalid': invalid, 'aria-describedby': describedBy }) => (
                    <CheckboxGroup
                        value={Array.isArray(value) ? value.filter((entry: unknown): entry is string | number => typeof entry === 'string' || typeof entry === 'number') : []}
                        onChange={onChange}
                    >
                        <Checkbox id={id} value="typescript" aria-invalid={invalid} aria-describedby={describedBy}>TypeScript</Checkbox>
                        <Checkbox value="react" aria-invalid={invalid} aria-describedby={describedBy}>React</Checkbox>
                        <Checkbox value="rust" aria-invalid={invalid} aria-describedby={describedBy}>Rust</Checkbox>
                    </CheckboxGroup>
                )}
            </Item>

            <Item label="套餐" name="plan">
                {({ id, value, onChange, 'aria-invalid': invalid, 'aria-describedby': describedBy }) => (
                    <RadioGroup
                        aria-label="套餐"
                        aria-describedby={describedBy}
                        value={typeof value === 'string' || typeof value === 'number' ? value : undefined}
                        onChange={onChange}
                    >
                        <Radio id={id} value="free" aria-invalid={invalid}>Free</Radio>
                        <Radio value="pro" aria-invalid={invalid}>Pro</Radio>
                        <Radio value="team" aria-invalid={invalid}>Team</Radio>
                    </RadioGroup>
                )}
            </Item>

            <Item label="接收邮件" name="receiveEmail" binding="checked">
                <Switch aria-label="接收邮件" />
            </Item>

            <Item label="额度" name="quota">
                <SliderField />
            </Item>

            <Item label="协议" name="agree" binding="checked" required>
                <Checkbox>我已阅读并同意服务条款</Checkbox>
            </Item>

            <div className={actionRowStyle}>
                <Button type="button" appearance="primary" onClick={async () => { await form.submit(); }}>
                    提交
                </Button>
                <Button type="button" onClick={async () => {
                    await form.resetFields();
                    setResult("已恢复初始值，并清除校验反馈。");
                }}>
                    重置
                </Button>
                <Button
                    type="button"
                    appearance="text"
                    onClick={() => {
                        setResult(`当前值：${JSON.stringify(form.getFieldsValue(), null, 2)}`);
                    }}
                >
                    查看当前值
                </Button>
            </div>
            <output className={resultStyle} aria-live="polite">{result}</output>
        </Form>
    );
};

export default EditorsDemo;
