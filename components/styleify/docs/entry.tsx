import { createRoot } from "react-dom/client";

const App = () => {
    return (
        <>
        </>
    )
}

const rootDom = document.querySelector("#root");

if (rootDom != null) {
	const root = createRoot(rootDom);
	root.render(<App />);
}
