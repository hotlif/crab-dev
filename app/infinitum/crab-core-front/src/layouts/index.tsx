import { useOutlet, useRouteLoaderData, useMatches, Navigate } from "react-router";
import BasicLayout from "./BasicLayout";
import { isAuthenticated as isAuthenticatedFun } from "../util/jwt";

const IndexLayout = () => {
    const outlet = useOutlet();
    const matches = useMatches()
    const currentRouter = matches.pop();

    const {
        metadata,
    } = useRouteLoaderData(currentRouter!.id);

    const isAuthenticated = isAuthenticatedFun();

    // 登录成功后, 路由设置了 redirectIfAuthenticated 则按照 redirectIfAuthenticated 的值进行跳转 
    if (isAuthenticated && metadata.redirectIfAuthenticated) {
        return <Navigate to={metadata.redirectIfAuthenticated} />
    }

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
