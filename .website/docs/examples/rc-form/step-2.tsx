import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Form, { Item, useForm, RuleType, type FormItemEditor } from "@crab-dev/rc-form";
import LineEdit from "@crab-dev/rc-line-edit";
import Button from "@crab-dev/rc-button";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
function NameEditor({ value, onChange, status }: FormItemEditor<string>) {
    return (
        <LineEdit
            aria-label="姓名"
            maxLength={30}
            value={value ?? ""}
            status={status}
            onChange={(event) => onChange?.(event.target.value)}
        />
    );
}
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
                    name: "",
                }}
                onSubmitSuccess={async (record) => {
                    setResult(record.name);
                }}
            >
                <Item
                    name="name"
                    label="姓名"
                    rules={[
                        {
                            type: RuleType.ERROR,
                            validator: async () => {
                                if (!form.getFieldsValue().name?.trim())
                                    throw new Error("请输入姓名");
                            },
                        },
                    ]}
                >
                    <NameEditor />
                </Item>
                <Button onClick={() => void form.submit()}>校验并提交</Button>
            </Form>
            <output>提交姓名：{result || "尚未通过校验"}</output>
        </div>
    );
}
