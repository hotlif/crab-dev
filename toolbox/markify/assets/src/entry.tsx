import { createRoot } from "react-dom/client";
import { css, cx } from "@linaria/core";
import { RouterProvider } from "react-router";
import { routers } from "<%= theme %>"

const App = () => {
	return (
		<RouterProvider router={routers} />
	)
}

const rootDom = document.querySelector("#root");

if (rootDom != null) {
	const root = createRoot(rootDom);
	root.render(<App />);
}
