import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import Layout from "./layouts"

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
