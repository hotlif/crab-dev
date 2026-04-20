import type { Key, ReactNode } from "react";
import type { BreadcrumbsItem } from "@crab-dev/rc-breadcrumbs";

export interface TabItem {
    /** 标签唯一标识 */
    key: Key
    /** 标签标题 */
    title: ReactNode
    /** 标签图标 */
    icon?: ReactNode
    /** 是否可关闭，默认 true */
    closable?: boolean
    /** 路径导航；渲染于内容区顶部 */
    breadcrumbs?: BreadcrumbsItem[]
    /** 标签内容 */
    children?: ReactNode
}
