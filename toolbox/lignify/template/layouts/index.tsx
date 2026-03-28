import { useLocation } from "react-router";
import mdxs from "@@@/mdxs";
import MultipleLayout from "./tabsLayout";
import PlaygroundLayout from "./playgroundLayout";
import DocLayout from "./docLayout";

const isSingleComponent = mdxs.some(element => element.path === "/docs/README.md");

const LayoutIndex = () => {
    const { pathname } = useLocation();

    if (!isSingleComponent) {
        return <MultipleLayout />;
    }

    return pathname.endsWith("/demo/tsx") ? <PlaygroundLayout /> : <DocLayout />;
}

export default LayoutIndex;
