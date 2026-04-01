import { createRoot } from "react-dom/client";
import {
    RouterProvider,
} from "react-router";
import { css } from "@linaria/core";

import pages from "@@@/pages";
import mdxs from "@@@/mdxs";
import demos from "@@@/demos";
import { createRouter} from "./util/router.js";

const router = createRouter([...pages, ...mdxs, ...demos]);
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
css`
	:global() {
		html, body, #root {
			margin: 0;
			padding: 0;
			height: 100%;
		}
	}
`

const App = () => {
    return (
        <RouterProvider
            router={router}
        />
    )
}

const rootDom = document.querySelector("#root");

if (rootDom != null) {
    const root = createRoot(rootDom);
    root.render(<App />);
}
