import type { Key, ReactNode } from "react";
import type { BreadcrumbsItem } from "@crab-dev/rc-breadcrumbs";

export interface HeaderUserEntity {
    /** 用户名 */
    name?: ReactNode
    /** 用户头像 */
    avatar?: ReactNode
    /** 用户角色名称 */
    roleName?: ReactNode
    /** 用户角色 ID */
    roleId?: string
}

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
