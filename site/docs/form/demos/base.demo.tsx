/**
 * title = "基础用法"
 * description = "一个简单的表单示例"
 */

import { css } from "@linaria/core";
import Form, { Item, useForm } from "@crab-dev/rc-form";
import type { FormItemEditor } from "@crab-dev/rc-form";

const Input = ({
    value,
    onChange
}: FormItemEditor<string>) => {
    return (
        <input
            value={value ?? ""}
            style={{
                width: "100%",
            }}
            onChange={(e) => {
                onChange?.(e.target.value)
            }}
        />
    )
}

interface UserInfo {
    user: {
        username: string,
        password: string
    }
}

const SimpleFrame = () => {
    const [form] = useForm<UserInfo>();
    return (
        <Form
            className={css`
                gap: 4px;
            `}
            defaultValue={{
                user: {
                    username: "你好",
                    password: "password"
                }
            }}
            form={form}
            onFieldValueChange={async (changed, allValues) => {
                console.log("[changed]: ", changed);
                console.log("[allValues]: ", allValues)
            }}
            onSubmitSuccess={async (result) => {
                console.log("onSubmitSuccess", result)
            }}
            onSubmitFailed={async (result) => {
                console.log("onSubmitFailed", result)
            }}
        >
            <Item
                label="用户"
                name={["user", "username"]}
                required
            >
                <Input />
            </Item>
            <Item
                label="密码"
                name={["user", "password"]}
                required
            >
                <Input />
            </Item>
            <button type="submit">提交</button>
            <button
                type="button"
                onClick={() => form.resetFields()}
            >
                重置
            </button>
        </Form>
    )
};

export default SimpleFrame;
