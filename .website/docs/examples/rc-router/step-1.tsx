import { useState, useEffect } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Router, { NavLink, type RouteObject } from "@crab-dev/rc-router";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
const routes: RouteObject[] = [
    {
        path: "/",
        element: (
            <>
                <p>项目概览</p>
                <NavLink to="/members">进入成员页</NavLink>
            </>
        ),
    },
    {
        path: "/members",
        element: <p>成员：林晓、周宁</p>,
    },
];
// 仅用于文档隔离：在 iframe Window 上代理内存 History，避免修改文档地址。
// 真实应用直接使用 <Router routes={routes} />，不需要这个模拟函数。
function createDemoWindow(target: Window): Window {
    const entries: {
        url: URL;
        state: unknown;
    }[] = [
        {
            url: new URL("https://crab.example/"),
            state: null,
        },
    ];
    let index = 0;
    const events = new EventTarget();
    const history = new Proxy(target.history, {
        get(original, key) {
            if (key === "state") return entries[index]!.state;
            if (key === "length") return entries.length;
            if (key === "pushState" || key === "replaceState")
                return (state: unknown, _title: string, path?: string | URL | null) => {
                    const entry = {
                        url: new URL(
                            path?.toString() ?? entries[index]!.url.href,
                            entries[index]!.url,
                        ),
                        state,
                    };
                    if (key === "pushState") {
                        entries.splice(index + 1);
                        entries.push(entry);
                        index += 1;
                    } else entries[index] = entry;
                };
            if (key === "go")
                return (delta: number) => {
                    const next = index + delta;
                    if (next >= 0 && next < entries.length) {
                        index = next;
                        events.dispatchEvent(new Event("popstate"));
                    }
                };
            return Reflect.get(original, key, original);
        },
    });
    return new Proxy(target, {
        get(original, key) {
            if (key === "location") return entries[index]!.url;
            if (key === "history") return history;
            if (key === "addEventListener") return events.addEventListener.bind(events);
            if (key === "removeEventListener") return events.removeEventListener.bind(events);
            return Reflect.get(original, key, original);
        },
    });
}
export default function Example() {
    const [frame, setFrame] = useState<HTMLIFrameElement | null>(null);
    const [routerWindow, setRouterWindow] = useState<Window | null>(null);
    useEffect(() => {
        const target = frame?.contentWindow;
        if (target) setRouterWindow(createDemoWindow(target));
    }, [frame]);
    return (
        <div className={layout}>
            <iframe ref={setFrame} hidden title="教程专用 History" />
            {routerWindow && <Router routes={routes} window={routerWindow} />}
        </div>
    );
}
