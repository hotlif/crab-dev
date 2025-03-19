import { createRoot } from "react-dom/client";
import { css } from "@linaria/core";
import { preflight } from "@crab/styleify";
import SimpleDemo from "./demos/simple.demo";

import "../../esm/index.styles.css";

css`
	:global() {
		${preflight}
	}
`;

const App = () => {
	return (
		<SimpleDemo />
	)
}

const rootDom = document.querySelector("#root");

if (rootDom != null) {
	const root = createRoot(rootDom);
	root.render(<App />);
}
