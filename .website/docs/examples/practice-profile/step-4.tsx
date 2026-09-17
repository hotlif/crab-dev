import { useState, useTransition, useId } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Card from "@crab-dev/rc-card";
import Form from "@crab-dev/rc-form";
import LineEdit from "@crab-dev/rc-line-edit";
import Button from "@crab-dev/rc-button";
import Alert from "@crab-dev/rc-alert";
import Switch from "@crab-dev/rc-switch";
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
// 业务接入位置：将函数体替换为保存资料的接口请求。
async function mockSave(
    profile: {
        name: string;
        email: string;
    },
    fail: boolean,
) {
    await new Promise<void>((resolve) => setTimeout(resolve, 600));
    if (fail) throw new Error("模拟保存失败");
    return profile;
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
    const [pending, startTransition] = useTransition();
    const [fail, setFail] = useState(false);
    const [failed, setFailed] = useState(false);
    return (
        <Card className={cardStyle} title="编辑个人资料">
            <Form
                onSubmitSuccess={async () => {
                    const next = validate(name, email);
                    setErrors(next);
                    setResult("");
                    setFailed(false);
                    if (next.name || next.email) return;
                    startTransition(async () => {
                        try {
                            const saved = await mockSave(
                                {
                                    name: name.trim(),
                                    email: email.trim(),
                                },
                                fail,
                            );
                            setResult(`已保存：${saved.name}`);
                        } catch {
                            setFailed(true);
                            setResult("保存失败。请关闭模拟失败后重试，输入已保留。");
                        }
                    });
                }}
                className={layout}
                aria-busy={pending}
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
                        disabled={pending}
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
                        disabled={pending}
                    />
                </label>
                <p id={`${errorId}-email`} role={errors.email ? "alert" : undefined}>
                    {errors.email || "例如：lin@example.com"}
                </p>
                <output>
                    待提交：{name || "未填写姓名"} / {email || "未填写邮箱"}
                </output>
                <Switch checked={fail} onChange={setFail} disabled={pending}>
                    模拟保存失败
                </Switch>
                <p>开启后可体验保存失败，输入内容会保留。</p>
                <Button type="submit" appearance="primary" disabled={pending} aria-busy={pending}>
                    {pending ? "正在保存…" : "保存资料"}
                </Button>
            </Form>
            <div className={feedbackStyle} aria-live="polite">
                {result && (
                    <Alert type={failed ? "error" : "success"} title="提交结果">
                        {result}
                    </Alert>
                )}
            </div>
        </Card>
    );
}
