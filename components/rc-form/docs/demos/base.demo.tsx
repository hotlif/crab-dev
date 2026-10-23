export const meta = {
    title: "基础用法",
    description: "字段标签与校验交给 LineEdit 呈现，随全局切换 Material 浮动标签或 macOS、shadcn 的同排静态标签；表单实例操作的结果直接显示在下方。",
};

import { css } from "@crab-dev/css";
import { useState } from "react";
import token from "@crab-dev/rc-token-semantic";
import Button from "@crab-dev/rc-button";
import LineEdit from "@crab-dev/rc-line-edit";
import Form, { Item, useForm } from "../../src/index.js";

interface UserInfo {
    user: {
        username: string;
        password: string;
    };
}

const formStyle = css`
    max-width: 480px;
`;

const actionRowStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
`;

const resultStyle = css`
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    color: ${token.color.text.secondary};
`;

const SimpleFrame = () => {
    const [form] = useForm<UserInfo>();
    const [result, setResult] = useState("点击操作按钮，在这里查看执行结果。");

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
            onSubmitSuccess={async (values) => {
                setResult(`提交成功：${JSON.stringify(values, null, 2)}`);
            }}
            onSubmitFailed={async () => {
                setResult("提交未通过，请根据字段下方的错误提示补全内容。");
            }}
        >
            <Item label="用户名" labelPlacement="control" name={["user", "username"]} binding="event" required>
                <LineEdit placeholder="请输入用户名" />
            </Item>
            <Item label="密码" labelPlacement="control" name={["user", "password"]} binding="event" required>
                <LineEdit type="password" placeholder="请输入密码" />
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
                    appearance="subtle"
                    onClick={() => {
                        setResult(`getFieldsValue：${JSON.stringify(form.getFieldsValue(), null, 2)}`);
                    }}
                >
                    getFieldsValue
                </Button>
                <Button
                    type="button"
                    appearance="subtle"
                    onClick={() => {
                        const username = form.getFieldValue(["user", "username"]);
                        const password = form.getFieldValue(["user", "password"]);
                        setResult(`getFieldValue：${JSON.stringify({ username, password }, null, 2)}`);
                    }}
                >
                    getFieldValue
                </Button>
                <Button
                    type="button"
                    appearance="subtle"
                    onClick={() => {
                        form.setFieldsValue({
                            user: {
                                username: `user-${crypto.randomUUID().slice(0, 8)}`,
                                password: `pwd-${crypto.randomUUID().slice(0, 8)}`,
                            },
                        });
                        setResult("setFieldsValue：已同时更新用户名与密码。");
                    }}
                >
                    setFieldsValue
                </Button>
                <Button
                    type="button"
                    appearance="subtle"
                    onClick={() => {
                        form.setFieldValue(["user", "username"], crypto.randomUUID().slice(0, 8));
                        setResult("setFieldValue：已更新用户名，密码保持不变。");
                    }}
                >
                    setFieldValue
                </Button>
            </div>
            <output className={resultStyle} aria-live="polite">{result}</output>
        </Form>
    );
};

export default SimpleFrame;
