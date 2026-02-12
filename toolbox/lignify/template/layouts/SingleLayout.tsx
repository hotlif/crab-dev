import { useLocation } from "react-router";
import CodeLayout from "./CodeLayout";
import MarkdownLayout from "./MarkdownLayout"

const LayoutIndex = () => {
    const location = useLocation();

    if (location.pathname.endsWith('/demo/tsx')) {
        return <CodeLayout />;
    } else {
        return <MarkdownLayout />;
    }
}

export default LayoutIndex;
