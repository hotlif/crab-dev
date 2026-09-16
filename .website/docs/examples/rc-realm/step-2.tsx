import { useState, useId, useEffect } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Realm, { type RemoteContainer } from "@crab-dev/rc-realm";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-realm/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
function Welcome({ message }: { message: string }) {
    return <p>{message}</p>;
}
// 仅供本地教学：真实应用由远程入口提供这个容器协议。
const container: RemoteContainer = {
    init: () => undefined,
    get: async () => () => ({
        default: Welcome,
    }),
};
export default function Example() {
    const scope = useId();
    const [ready, setReady] = useState(false);
    const [message, setMessage] = useState("欢迎，林晓");
    useEffect(() => {
        const target = globalThis as Record<string, unknown>;
        target[scope] = container;
        setReady(true);
        return () => {
            delete target[scope];
        };
    }, [scope]);
    return (
        <div className={layout}>
            <Button
                onClick={() =>
                    setMessage((value) => (value === "欢迎，林晓" ? "欢迎，周宁" : "欢迎，林晓"))
                }
            >
                切换当前成员
            </Button>
            {ready ? (
                <Realm
                    entry="/virtual/remoteEntry.js"
                    scope={scope}
                    module="./Welcome"
                    remoteProps={{
                        message,
                    }}
                />
            ) : (
                <p>正在准备本地容器…</p>
            )}
        </div>
    );
}
