export const meta = {
    title: "基础用法",
    description: "字段标签与校验交给 LineEdit 呈现，随全局切换 Material 浮动标签或 shadcn 左侧标签与紧凑输入同排的布局，并保留表单实例操作。",
};

import { css } from "@crab-dev/css";
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
            <Item label="用户名" labelPlacement="control" name={["user", "username"]} binding="event" required>
                <LineEdit placeholder="请输入用户名" />
            </Item>
            <Item label="密码" labelPlacement="control" name={["user", "password"]} binding="event" required>
                <LineEdit type="password" placeholder="请输入密码" />
            </Item>

            <div className={actionRowStyle}>
                <Button appearance="primary" onClick={async () => { await form.submit(); }}>
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
