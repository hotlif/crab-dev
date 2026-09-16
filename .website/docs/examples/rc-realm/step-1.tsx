import { useState, useId, useEffect } from "react";
import Realm, { type RemoteContainer } from "@crab-dev/rc-realm";
import "@crab-dev/rc-realm/css/index.css";
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
    useEffect(() => {
        const target = globalThis as Record<string, unknown>;
        target[scope] = container;
        setReady(true);
        return () => {
            delete target[scope];
        };
    }, [scope]);
    return ready ? (
        <Realm
            entry="/virtual/remoteEntry.js"
            scope={scope}
            module="./Welcome"
            remoteProps={{
                message: "来自主应用的问候",
            }}
        />
    ) : (
        <p>正在准备本地容器…</p>
    );
}
