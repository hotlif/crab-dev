/**
 * label="基础用法"
 * description="使用 rc-line-edit 作为编辑器，演示 getFieldValue / setFieldValue / resetFields 等实例方法。"
 */

import { css } from "@linaria/core";
import { type FC } from "react";
import Button from "@crab-dev/rc-button";
import LineEdit from "@crab-dev/rc-line-edit";
import Form, { Item, useForm } from "../../src/index.js";
import type { FormItemEditor } from "../../src/types.js";

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

interface UserInfo extends Record<string, unknown> {
    user: {
        username: string;
        password: string;
    };
}

const formStyle = css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 480px;
`;

const actionRowStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
`;

const SimpleFrame = () => {
    const [form] = useForm<UserInfo>();

    return (
        <Form
            className={formStyle}
            form={form}
            defaultValue={{
                user: {
                    username: "ada",
                    password: "password",
                },
            }}
            onFieldValueChange={async (changed, allValues) => {
                console.log("[changed]", changed);
                console.log("[allValues]", allValues);
            }}
            onSubmitSuccess={async (result) => {
                console.log("[submit:success]", result);
            }}
            onSubmitFailed={async (result) => {
                console.warn("[submit:failed]", result);
            }}
        >
            <Item label="用户名" name={["user", "username"]} required>
                <LineEditField placeholder="请输入用户名" />
            </Item>
            <Item label="密码" name={["user", "password"]} required>
                <LineEditField type="password" placeholder="请输入密码" />
            </Item>

            <div className={actionRowStyle}>
                <Button appearance="primary" onClick={() => form.submit()}>
                    提交
                </Button>
                <Button onClick={() => form.resetFields()}>
                    重置
                </Button>
                <Button
                    appearance="subtle"
                    onClick={() => {
                        console.log("[getFieldsValue]", form.getFieldsValue());
                    }}
                >
                    getFieldsValue
                </Button>
                <Button
                    appearance="subtle"
                    onClick={() => {
                        const username = form.getFieldValue(["user", "username"]);
                        const password = form.getFieldValue(["user", "password"]);
                        console.log("[getFieldValue] username =", username, "| password =", password);
                    }}
                >
                    getFieldValue
                </Button>
                <Button
                    appearance="subtle"
                    onClick={() => {
                        form.setFieldsValue({
                            user: {
                                username: `user-${crypto.randomUUID().slice(0, 8)}`,
                                password: `pwd-${crypto.randomUUID().slice(0, 8)}`,
                            },
                        });
                    }}
                >
                    setFieldsValue
                </Button>
                <Button
                    appearance="subtle"
                    onClick={() => {
                        form.setFieldValue(["user", "username"], crypto.randomUUID().slice(0, 8));
                    }}
                >
                    setFieldValue
                </Button>
            </div>
        </Form>
    );
};

export default SimpleFrame;
