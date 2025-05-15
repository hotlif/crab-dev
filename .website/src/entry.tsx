import { createRoot } from "react-dom/client";
import { css, cx } from "@linaria/core";
import { display, width, preflight } from "@crab/styleify";
import E404 from "./errors/E404";
import { RouterProvider, createBrowserRouter } from "react-router";

import mdxs from "@@@/mdx";
import Layout from "./layouts";

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
        ...mdxs.map(mdx => ({
            lazy: async () => {
                return {
                    Component: mdx.component
                }
            },
            path: mdx.metadata?.path ?? mdx.relativePath,
            caseSensitive: true,
            loader: async () => {
                return {
                    metadata: mdx.metadata,
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
	return (
		<RouterProvider router={reactRouters} />
	)
}

const rootDom = document.querySelector("#root");

if (rootDom != null) {
	const root = createRoot(rootDom);
	root.render(<App />);
}
