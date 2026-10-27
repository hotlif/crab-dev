import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Form, { Item, useForm } from "@crab-dev/rc-form";
import LineEdit from "@crab-dev/rc-line-edit";
import Button from "@crab-dev/rc-button";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [form] = useForm<{
        name: string;
    }>();
    const [result, setResult] = useState("");
    return (
        <div className={layout}>
            <Form
                form={form}
                defaultValue={{
                    name: "林晓",
                }}
                onSubmitSuccess={async (record) => {
                    setResult(record.name);
                }}
            >
                <Item name="name" label="姓名" labelPlacement="control" supportingText="最多 30 字。">
                    <LineEdit maxLength={30} />
                </Item>
                <Button onClick={() => void form.submit()}>读取表单</Button>
            </Form>
            <output>提交姓名：{result || "尚未提交"}</output>
        </div>
    );
}
