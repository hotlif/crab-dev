import { useLocation } from "react-router";
import PlaygroundLayout from "./playgroundLayout";
import DocLayout from "./docLayout"

const PageLayout = () => {
    const location = useLocation();

    if (location.pathname.endsWith('/demo/tsx')) {
        return <PlaygroundLayout />;
    } else {
        return <DocLayout />;
    }
}

export default PageLayout;
