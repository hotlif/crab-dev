import { createRoot } from "react-dom/client";
import {
    RouterProvider,
    createBrowserRouter,
	type RouteObject
} from "react-router";

import pages from "@@@/pages"

const dataRouter: RouteObject[] = pages.map(page => {
	const isIndex = page.metadata?.index === true;
	const name = page.metadata?.path ?? page.name;
	const path = isIndex ? "" : name
	return {
		path,
		index: isIndex, 
		lazy: async () => {
			let mod = await page.component
			return {
				Component: mod.default
			}
		}
	}
})

const Error404 = {
	path: "*",
	lazy: async () => {
		let mod = await import("./pages/error/404.page");
		return {
			Component: mod.default
		}
	}
}

dataRouter.push(Error404)

const router = createBrowserRouter([{
	path: "/",
	children: dataRouter
}, Error404])

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
