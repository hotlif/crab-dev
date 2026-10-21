export const meta = {
    title: "Filled 填充字段",
    description: "同一表单统一使用 filled。Material 呈现 56px 填充容器、浮动标签和焦点底线；切换 shadcn 后，左侧标签与右侧紧凑输入保持同排。",
};

import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Button from "@crab-dev/rc-button";
import LineEdit from "@crab-dev/rc-line-edit";
import Form, { Item, useForm } from "../../src/index.js";

const layout = css`
    display: grid;
    gap: ${token.space['section-gap']};
    max-width: calc(${token.size['40']} * 12);
    min-width: 0;
`;
const actions = css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.space['component-gap']};
`;

interface WorkspaceForm {
    name: string;
    email: string;
}

export default function FilledDemo() {
    const [form] = useForm<WorkspaceForm>();
    const [result, setResult] = useState("");

    return (
        <div className={layout}>
            <Form
                form={form}
                defaultValue={{ name: "", email: "" }}
                onSubmitSuccess={async (values) => {
                    setResult(`已保存：${values.name} · ${values.email}`);
                }}
            >
                <Item
                    name="name"
                    label="工作空间名称"
                    labelPlacement="control"
                    binding="event"
                    supportingText="名称会显示在团队首页。"
                    required
                >
                    <LineEdit appearance="filled" placeholder="例如：产品设计组" />
                </Item>
                <Item
                    name="email"
                    label="联系邮箱"
                    labelPlacement="control"
                    binding="event"
                    supportingText="用于接收空间邀请和重要通知。"
                    required
                >
                    <LineEdit appearance="filled" type="email" placeholder="name@example.com" />
                </Item>
                <div className={actions}>
                    <Button appearance="primary" onClick={async () => { await form.submit(); }}>保存空间</Button>
                    <Button onClick={async () => {
                        await form.resetFields();
                        setResult("");
                    }}>重置</Button>
                </div>
            </Form>
            <output aria-live="polite">{result || "填写后保存；留空提交可查看字段错误。"}</output>
        </div>
    );
}
