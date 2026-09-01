/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HeaderUserEntity = DocsTypePlaceholder;
type Promise<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;
type SidebarProps = DocsTypePlaceholder;

export interface LayoutPropsSearchIndex {
    /**
     * 侧边栏顶部 Logo
     */
    "sidebarLogo"?: ReactNode;

    /**
     * 侧边栏顶部标题
     */
    "sidebarTitle"?: ReactNode;

    /**
     * 点击 Logo
     */
    "onLogoClick"?: () => void;

    /**
     * 侧边栏菜单加载函数
     */
    "sidebarLoadMenus"?: SidebarProps["loadMenus"];

    /**
     * 点击侧边栏菜单项
     */
    "onSidebarMenuItemClick"?: SidebarProps["onMenuItemClick"];

    /**
     * 远程加载顶部用户实体
     */
    "headerLoadUser"?: () => Promise<HeaderUserEntity>;

    /**
     * 点击铃铛
     */
    "onBell"?: () => void;

    /**
     * 是否有未读通知
     */
    "hasNotification"?: boolean;

    /**
     * 点击用户区域
     */
    "onUserClick"?: () => void;

    /**
     * 点击切换角色
     */
    "onSwitchRole"?: () => void;

    /**
     * 点击退出登录
     */
    "onLogout"?: () => void;

    /**
     * 是否显示全屏按钮，默认 true
     */
    "fullscreenable"?: boolean;

    /**
     * 全屏状态变化回调
     */
    "onFullscreenChange"?: (fullscreen: boolean) => void;
}
