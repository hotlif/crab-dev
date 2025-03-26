import { createRoot } from "react-dom/client";
import { css, cx } from "@linaria/core";

const App = () => {
	return (
		<div>
		</div>
	)
}

const rootDom = document.querySelector("#root");

if (rootDom != null) {
	const root = createRoot(rootDom);
	root.render(<App />);
}
