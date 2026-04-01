import { useLocation } from "react-router";
import mdxs from "@@@/mdxs";
import MultipleLayout from "./tabsLayout.js";
import PlaygroundLayout from "./playgroundLayout.js";
import DocLayout from "./docLayout.js";

const isSingleComponent = mdxs.some(element => element.path === "/docs/README.md");

const LayoutIndex = () => {
    const { pathname } = useLocation();

    if (!isSingleComponent) {
        return <MultipleLayout />;
    }

    return pathname.endsWith("/demo/tsx") ? <PlaygroundLayout /> : <DocLayout />;
}

export default LayoutIndex;
