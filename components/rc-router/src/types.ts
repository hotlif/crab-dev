import type { AnchorHTMLAttributes, ComponentType, ReactNode, Ref, } from 'react';

export type NavigationType = 'POP' | 'PUSH' | 'REPLACE';

export interface Path {
    pathname: string;
    search: string;
    hash: string;
}

export type To = string | Partial<Path>;

export interface Location<State = unknown> extends Path {
    state: State;
    key: string;
}

export type Params<Key extends string = string> = Readonly<
    Record<Key, string | undefined>
>;

export interface NavigateOptions {
    replace?: boolean;
    state?: unknown;
    relative?: 'route' | 'path';
}

export type NavigateFunction = (
    to: To | number,
    options?: NavigateOptions,
) => void;

interface ElementRouteContent {
    element: ReactNode;
    Component?: never;
}

interface ComponentRouteContent {
    Component: ComponentType;
    element?: never;
}

interface PassthroughRouteContent {
    element?: undefined;
    Component?: undefined;
}

type RouteContent =
    | ElementRouteContent
    | ComponentRouteContent
    | PassthroughRouteContent;

export interface RouteErrorBoundaryProps {
    error: unknown;
    /** 清除当前渲染错误；不会重新请求 React.lazy 已缓存的失败模块。 */
    reset: () => void;
}

interface RouteObjectBase<Handle> {
    /** 全路由表唯一；省略时按路由树位置生成，动态路由表建议显式声明。 */
    id?: string;
    handle?: Handle;
    ErrorBoundary?: ComponentType<RouteErrorBoundaryProps>;
    caseSensitive?: boolean;
}

export type IndexRouteObject<Handle = unknown> = RouteObjectBase<Handle> &
    RouteContent & {
        index: true;
        path?: never;
        children?: never;
    };

export type NonIndexRouteObject<Handle = unknown> = RouteObjectBase<Handle> &
    RouteContent & {
        index?: false;
        path?: string;
        children?: readonly RouteObject<Handle>[];
    };

export type RouteObject<Handle = unknown> = IndexRouteObject<Handle> | NonIndexRouteObject<Handle>;

export interface RouteMatch<Handle = unknown> {
    readonly id: string;
    readonly pathname: string;
    readonly pathnameBase: string;
    readonly params: Params;
    readonly handle: Handle | undefined;
}

export interface BlockerFunctionArgs {
    currentLocation: Location;
    nextLocation: Location;
    historyAction: NavigationType;
}

export type BlockerFunction = (args: BlockerFunctionArgs) => boolean;

export type Blocker =
    | { state: 'unblocked'; location?: undefined; proceed?: undefined; reset?: undefined }
    | { state: 'blocked'; location: Location; proceed: () => void; reset: () => void }
    | { state: 'proceeding'; location: Location; proceed?: undefined; reset?: undefined };

export interface RouterProps {
    routes: readonly RouteObject[];
    basename?: string;
    window?: Window;
}

export interface PathPattern {
    path: string;
    caseSensitive?: boolean;
    end?: boolean;
}

export interface PathMatch<ParamKey extends string = string> {
    params: Params<ParamKey>;
    pathname: string;
    pathnameBase: string;
    pattern: PathPattern;
}

export interface LinkProps
    extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    ref?: Ref<HTMLAnchorElement>;
    to: To;
    replace?: boolean;
    state?: unknown;
    relative?: 'route' | 'path';
    reloadDocument?: boolean;
}

export interface NavLinkRenderProps {
    isActive: boolean;
    isPending: false;
}

export interface NavLinkProps
    extends Omit<LinkProps, 'children' | 'className'> {
    children?: ReactNode | ((props: NavLinkRenderProps) => ReactNode);
    className?: string | ((props: NavLinkRenderProps) => string | undefined);
    caseSensitive?: boolean;
    end?: boolean;
}

export interface NavigateProps extends NavigateOptions {
    to: To;
}

export interface OutletProps {
    context?: unknown;
}

export type URLSearchParamsInit =
    | string
    | readonly (readonly [string, string])[]
    | Record<string, string | readonly string[]>
    | URLSearchParams;

export type SetURLSearchParams = (
    nextInit:
        | URLSearchParamsInit
        | ((previous: URLSearchParams) => URLSearchParamsInit),
    navigateOptions?: NavigateOptions,
) => void;
