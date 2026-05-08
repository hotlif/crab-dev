import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./theme/tokens.js";
import { router } from "./router/router.js";

const App = () => {
    return <RouterProvider router={router} />;
};

const rootDom = document.querySelector("#root");
if (rootDom != null) {
    createRoot(rootDom).render(<App />);
}
