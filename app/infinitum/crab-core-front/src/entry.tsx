import { createRoot } from "react-dom/client";
import { css } from "@linaria/core";
import { preflight } from "@crab/styleify";
import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router";
import { RequestProvider } from "@crab/rc-request";

import routers from "@@@/routers";
import E404 from "./errors/E404";
import Layout from "./layouts";
import { printSystemInfo } from "./util/sysinfo";
import { getToken } from "./util/jwt";

export const globals = css`
    :global() {
        #root {
            height: 100%;
            width: 100%;
        }
        * {
            color: rgba(0,0,0,0.88);
        }
        body {
            background-image: linear-gradient(rgb(255, 255, 255), rgb(245, 245, 245) 28%);
            background-color: rgba(0, 0, 0, 0);
        }
        ${preflight}
    }
`;

const reactRouters = createBrowserRouter([{
    Component: Layout,
    children: [
        ...routers.map(router => ({
            lazy: async () => {
                return {
                    Component: router.component
                }
            },
            path: router.metadata?.path ?? router.relativePath,
            caseSensitive: true,
            loader: async () => {
                return {
                    metadata: router.metadata,
                }
            },
        })),
        {
            path: "*",
            loader: async () => {
                return {
                    metadata: {
                        noAuthRequired: false
                    }
                }
            },
            Component: E404
        }
    ]
}]);

const App = () => {
    useEffect(() => {
        printSystemInfo();
    }, [])
    return (
        <RequestProvider
            config={{
                baseURL: "/api",
            }}
            interceptorRequest={config => {
                config.headers.Authorization = getToken();
                return config;
            }}
        >
            <RouterProvider router={reactRouters} />
        </RequestProvider>
    )
}

const rootDom = document.querySelector("#root");

if (rootDom != null) {
    const root = createRoot(rootDom);
    root.render(<App />);
}
