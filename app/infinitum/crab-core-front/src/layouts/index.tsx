import { useOutlet, useRouteLoaderData, useMatches, Navigate } from "react-router";
import BasicLayout from "./BasicLayout";

const IndexLayout = () => {
    const outlet = useOutlet();
    const matches = useMatches()
    const currentRouter = matches.pop();

    const {
        metadata,
        isAuthenticated,
    } = useRouteLoaderData(currentRouter!.id);

    // 如果用户未登录, 并且此页面是需要认证的, 则跳转到登录页面
    if (isAuthenticated !== true && metadata.noAuthRequired !== true) {
        return <Navigate to="/User/Login" />
    }
    
    if (metadata?.ignoreLayout) {
        return outlet;
    }

    return (
        <BasicLayout />
    )
}

export default IndexLayout;
