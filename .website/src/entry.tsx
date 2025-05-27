import { createRoot } from "react-dom/client";
import { css, cx } from "@linaria/core";
import { preflight } from "@crab/styleify";
import E404 from "./errors/E404";
import { RouterProvider, createBrowserRouter } from "react-router";

import mdxs from "@@@/mdx";
import Layout from "./layouts";
import MdxComponents from "./components/mdx";
import FontsAndTypography from "./styles/FontsAndTypography";

export const globals = cx(FontsAndTypography, css`
    :global() {
        #root {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;

        }
        * {
            color: rgba(0,0,0,0.88);
        }
        body {
            margin: 0px;
            background-color: rgb(245, 245, 245);
        }
    }
`);



const reactRouters = createBrowserRouter([{
    Component: Layout,
    children: [
        ...mdxs.map(mdx => ({
            element: (
                <mdx.component
                    components={MdxComponents}
                />
            ),
            path: mdx.metadata?.path ?? mdx.relativePath,
            index: mdx.metadata?.path === "/",
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
