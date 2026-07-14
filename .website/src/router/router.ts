import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
    {
        path: "/",
        lazy: async () => {
            const Layout = await import("../layouts/siteLayout.js");
            return { Component: Layout.default };
        },
        children: [
            {
                index: true,
                lazy: async () => {
                    const Page = await import("../pages/home.view.js");
                    return { Component: Page.default };
                },
            },
            {
                path: "components",
                lazy: async () => {
                    const Page = await import("../pages/overview.view.js");
                    return { Component: Page.default };
                },
            },
            {
                path: "components/:slug",
                lazy: async () => {
                    const Page = await import("../pages/component.view.js");
                    return { Component: Page.default };
                },
            },
            {
                path: "toolchain",
                lazy: async () => {
                    const Page = await import("../pages/toolchain.view.js");
                    return { Component: Page.default };
                },
            },
            {
                path: "toolchain/:slug",
                lazy: async () => {
                    const Page = await import("../pages/tool.view.js");
                    return { Component: Page.default };
                },
            },
            {
                path: "*",
                lazy: async () => {
                    const Page = await import("../pages/notFound.view.js");
                    return { Component: Page.default };
                },
            },
        ],
    },
    {
        path: "/demo",
        lazy: async () => {
            const Page = await import("../pages/demo.view.js");
            return { Component: Page.default };
        },
    },
]);
