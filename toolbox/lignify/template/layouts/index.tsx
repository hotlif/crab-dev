import mdxs from "@@@/mdxs";
import MultipleLayout from "./MultipleLayout";
import SingleLayout from "./SingleLayout";

const LayoutIndex = () => {
    const isSingleComponent = mdxs.find(element => element.path === "/docs/README.md") != null;
    if (isSingleComponent) {
        return <SingleLayout />
    }
    return <MultipleLayout />
}

export default LayoutIndex;
