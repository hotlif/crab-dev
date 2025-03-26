import { createBrowserRouter } from "react-router";
import mdxs from "@@@/mdxs";
import Layout from "@@/src/lyaouts"

const reactRouters = createBrowserRouter([{
    Component: Layout,
    children: [
        ...mdxs.map(router => ({
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
        }))
    ]
}]);
