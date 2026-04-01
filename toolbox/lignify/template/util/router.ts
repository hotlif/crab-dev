import { createBrowserRouter } from "react-router";

interface Frontmatter {
    // 用于设置当前页面使用的布局
    layout: string
    // 用于设置当前页面的路径
    path: string
    // 用于设置当前页面是否为索引页面
    index: boolean
}

/**
 * 扫描到的组件信息
 */
interface ScanComponent {
    name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: Promise<any>
    path: string
    frontmatter: Frontmatter
    source: string | null
}

/**
 * 创建路由
 */
export const createRouter = (components: ScanComponent[]) => {
    const routers = {
        path: "/",
        lazy: async () => {
            const Layout = await import("../layouts/index.js");
            return {
                Component: Layout.default
            }
        },
        children: components.map(({
            path,
            frontmatter,
            component,
            source
        }) => {
            let newPath = (frontmatter?.path ?? path).replaceAll(".", "/");
            let index = frontmatter?.index ?? false;
            return {
                path: index ? "" : newPath,
                index,
                handle: {
                    frontmatter,
                    source
                },
                lazy: async () => {
                    const Component = await component;
                    return {
                        Component: Component.default
                    }
                } 
            }
        })
    };

    const error404Router = {
        path: "*",
        lazy: async () => {
            const ErrorLayout = await import("../components/errors/404.js");
            return {
                Component: ErrorLayout.default
            }
        }
    };

    return createBrowserRouter([routers, error404Router])
}