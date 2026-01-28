import { createRoot } from "react-dom/client";
import {
    RouterProvider,
} from "react-router";

import pages from "@@@/pages";
import { createRouter} from "./util/router";

const router = createRouter(pages);

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
