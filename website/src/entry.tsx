import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import { preflight } from "@crab/styleify";
import { css } from "@linaria/core";
import Layout from "./layouts"

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
