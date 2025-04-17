import { createRoot } from "react-dom/client";
import { css, cx } from "@linaria/core";
import { display, width } from "@crab/styleify";
import README from "../../README.mdx";

const App = () => {
	return (
		<div
			className={css`
				${display("flex")}
				justify-content: center;
			`}
		>
			<div
				className={cx(css`
					${width("10/12")}
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
