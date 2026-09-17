import { useState, useTransition } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Spin from "@crab-dev/rc-spin";
import Button from "@crab-dev/rc-button";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [pending, startTransition] = useTransition();
    const [count, setCount] = useState(0);
    return (
        <div className={layout}>
            <Button
                loading={pending}
                onClick={() =>
                    startTransition(async () => {
                        await new Promise((resolve) => setTimeout(resolve, 700));
                        setCount((value) => value + 1);
                    })
                }
            >
                重新读取
            </Button>
            <Spin spinning={pending} delay={200} tip="正在读取项目">
                <p>已完成 {count} 次读取。</p>
            </Spin>
        </div>
    );
}
