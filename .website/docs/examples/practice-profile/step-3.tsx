import { useState, useId } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Card from "@crab-dev/rc-card";
import Form from "@crab-dev/rc-form";
import LineEdit from "@crab-dev/rc-line-edit";
import Button from "@crab-dev/rc-button";
import Alert from "@crab-dev/rc-alert";
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
        min-height: calc(${token.space["card-padding"]} * 2 + ${token.space["inline-gap"]});
    }
`;
function validate(name: string, email: string) {
    return {
        name: name.trim() ? "" : "请输入姓名",
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
            ? ""
            : "请输入有效邮箱，例如 lin@example.com",
    };
}
const feedbackStyle = css`
    & > * { margin-top: ${token.space["section-gap"]}; }
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
    const errorId = useId();
    const [errors, setErrors] = useState({
        name: "",
        email: "",
    });
    const [result, setResult] = useState("");
    return (
        <Card className={cardStyle} title="编辑个人资料">
            <Form
                onSubmitSuccess={async () => {
                    const next = validate(name, email);
                    setErrors(next);
                    setResult("");
                    if (next.name || next.email) return;
                    setResult("校验通过，可以接入保存逻辑。");
                }}
                className={layout}
            >
                <label className={fieldStyle}>
                    姓名（最多 30 字）
                    <LineEdit
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        maxLength={30}
                        status={errors.name ? "error" : undefined}
                        aria-invalid={!!errors.name}
                        aria-describedby={`${errorId}-name`}
                    />
                </label>
                <p id={`${errorId}-name`} role={errors.name ? "alert" : undefined}>
                    {errors.name || "填写对外显示的姓名。"}
                </p>
                <label className={fieldStyle}>
                    邮箱（最多 80 字）
                    <LineEdit
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        maxLength={80}
                        status={errors.email ? "error" : undefined}
                        aria-invalid={!!errors.email}
                        aria-describedby={`${errorId}-email`}
                    />
                </label>
                <p id={`${errorId}-email`} role={errors.email ? "alert" : undefined}>
                    {errors.email || "例如：lin@example.com"}
                </p>
                <output>
                    待提交：{name || "未填写姓名"} / {email || "未填写邮箱"}
                </output>

                <Button type="submit" appearance="primary">
                    校验资料
                </Button>
            </Form>
            <div className={feedbackStyle} aria-live="polite">
                {result && (
                    <Alert type={"success"} title="提交结果">
                        {result}
                    </Alert>
                )}
            </div>
        </Card>
    );
}
