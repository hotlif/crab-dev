import { createRoot } from "react-dom/client";
import {
    RouterProvider,
    createBrowserRouter,
	type RouteObject
} from "react-router";

const router = createBrowserRouter([])

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
