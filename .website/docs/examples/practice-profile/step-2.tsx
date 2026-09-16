import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Card from "@crab-dev/rc-card";
import Form from "@crab-dev/rc-form";
import LineEdit from "@crab-dev/rc-line-edit";
import "@crab-dev/rc-card/css/index.css";
import "@crab-dev/rc-form/css/index.css";
import "@crab-dev/rc-line-edit/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
    & > p {
        margin: 0;
        color: ${token.color.text.secondary};
        font-size: ${token.font.size.caption};
    }
    & > label + p {
        margin-top: calc(${token.space["section-gap"]} * -1);
    }
    & > p[role="alert"] {
        color: ${token.color.feedback.error.text};
    }
    & > output {
        padding: ${token.space["stack-gap"]};
        background: ${token.color.background.sunken};
        border-radius: ${token.radius.md};
        font-size: ${token.font.size.caption};
        overflow-wrap: anywhere;
    }
    & > button {
        justify-self: start;
    }
`;
const cardStyle = css`
    width: 100%;
    max-width: calc(${token.space["section-gap"]} * 36);
    border-color: ${token.color.border.subtle};
    font-size: ${token.font.size.body};
`;
const fieldStyle = css`
    display: grid;
    gap: ${token.space["component-gap"]};
    width: 100%;
    min-width: 0;
    max-width: 100%;
    font-size: ${token.font.size.body};
    font-weight: ${token.font.weight.label};
`;
export default function Example() {
    const [name, setName] = useState("林晓");
    const [email, setEmail] = useState("lin@example.com");
    return (
        <Card className={cardStyle} title="编辑个人资料">
            <Form className={layout}>
                <label className={fieldStyle}>
                    姓名（最多 30 字）
                    <LineEdit
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        maxLength={30}
                    />
                </label>

                <label className={fieldStyle}>
                    邮箱（最多 80 字）
                    <LineEdit
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        maxLength={80}
                    />
                </label>

                <output>
                    待提交：{name || "未填写姓名"} / {email || "未填写邮箱"}
                </output>
            </Form>
        </Card>
    );
}
