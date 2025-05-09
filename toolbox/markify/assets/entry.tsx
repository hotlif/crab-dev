import { createRoot } from "react-dom/client";
import { css } from "@linaria/core";
import { preflight } from "@crab/styleify";
import { RouterProvider, createBrowserRouter } from "react-router";
import SandBox from "./components/sandbox";

import mdxs from "@@@/mdxs";
import Layout from "./layouts";
import E404 from "./errors/E404";

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
                const Component = mdx.component;
                return {
                    element: (
                        <Component
                            components={{
                                sandbox: (props: any) => (
                                    <SandBox
                                        {...props}
                                    />
                                )
                            }}
                        />
                    )
                }
            },
            path: mdx.name ===  "___docs_README_md" ? "/" : mdx.metadata?.path ?? mdx.relativePath,
            index: mdx.name === "___docs_README_md",
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
