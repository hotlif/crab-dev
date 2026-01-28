import { createRoot } from "react-dom/client";
import { css, cx } from "@linaria/core";
import README from "../../README.md";

const App = () => {
	return (
		<div
			className={css`
				justify-content: center;
			`}
		>
			<div
				className={cx(css`
				`)}
			>
				<README />
			</div>
		</div>
	)
}

const rootDom = document.querySelector("#root");

if (rootDom != null) {
	const root = createRoot(rootDom);
	root.render(<App />);
}
