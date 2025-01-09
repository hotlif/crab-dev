import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import { preflight } from "@crab/styleify";
import { css } from "@linaria/core";

import Test from "@@/.tmp/ZGVtb3M=.ts";

import Layout from "./layouts"

console.log("xxx", Test)

css`
	:global() {
		${preflight}
	}
`;

const router = createBrowserRouter([{
	path: "/",
	element: <Layout />,
	children: [
	]
}]);

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
