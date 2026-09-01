import { use, useState } from 'react';
import type { ReactElement } from 'react';
import { LocationContext, NavigationContext, OutletContext, RouteContext, } from './contexts.js';
import type { LocationContextValue, NavigationContextValue, RouteContextValue, } from './contexts.js';
import { joinPaths, matchPath, normalizeBasename, resolveTo } from './path.js';
import { createSearchParams } from './path.js';
import type { Location, NavigateFunction, NavigateOptions, NavigationType, Params, Path, PathMatch, PathPattern, SetURLSearchParams, To, URLSearchParamsInit, } from './types.js';

export function useNavigationContext(): NavigationContextValue {
    const context = use(NavigationContext);
    if (context === null) {
        throw new Error('Router: this hook must be used within <Router>.');
    }
    return context;
}

export function useLocationContext(): LocationContextValue {
    useNavigationContext();
    const context = use(LocationContext);
    if (context === null) {
        throw new Error('Router: location context is unavailable.');
    }
    return context;
}

export function useRouteContext(): RouteContextValue {
    useNavigationContext();
    const context = use(RouteContext);
    if (context === null) {
        throw new Error('Router: route context is unavailable.');
    }
    return context;
}

function getRoutePathnames(context: RouteContextValue): string[] {
    const pathnames = context.matches
        .filter((match) => match.route.index !== true && match.route.path !== undefined)
        .map((match) => match.pathnameBase);
    return pathnames.length === 0 ? ['/'] : pathnames;
}

export function useResolvedPath(
    to: To,
    relative: 'route' | 'path' = 'route',
): Path {
    const { location } = useLocationContext();
    const routeContext = useRouteContext();
    return resolveTo(to, location, getRoutePathnames(routeContext), relative);
}

export function useHref(
    to: To,
    relative: 'route' | 'path' = 'route',
): string {
    const { basename, history } = useNavigationContext();
    const path = useResolvedPath(to, relative);
    return history.createHref({
        ...path,
        pathname:
            normalizeBasename(basename) === '/'
                ? path.pathname
                : joinPaths([basename, path.pathname]),
    });
}

export function useNavigate(): NavigateFunction {
    const { basename, history } = useNavigationContext();
    const { location } = useLocationContext();
    const routeContext = useRouteContext();

    const navigate: NavigateFunction = (
        to: To | number,
        options: NavigateOptions = {},
    ): void => {
        if (typeof to === 'number') {
            history.go(to);
            return;
        }

        const path = resolveTo(
            to,
            location,
            getRoutePathnames(routeContext),
            options.relative,
        );
        const historyPath = {
            ...path,
            pathname:
                normalizeBasename(basename) === '/'
                    ? path.pathname
                    : joinPaths([basename, path.pathname]),
        };
        if (options.replace) {
            history.replace(historyPath, options.state);
        } else {
            history.push(historyPath, options.state);
        }
    };

    return navigate;
}

export function useLocation<State = unknown>(): Location<State> {
    return useLocationContext().location as Location<State>;
}

export function useNavigationType(): NavigationType {
    return useLocationContext().navigationType;
}

export function useParams<Key extends string = string>(): Params<Key> {
    const context = useRouteContext();
    const match = context.matches.at(-1);
    return (match?.params ?? {}) as Params<Key>;
}

export function useMatch<ParamKey extends string = string>(
    pattern: PathPattern | string,
): PathMatch<ParamKey> | null {
    const location = useLocation();
    return matchPath<ParamKey>(pattern, location.pathname);
}

export function useOutlet(): ReactElement | null {
    return useRouteContext().outlet;
}

export function useOutletContext<Context = unknown>(): Context {
    useNavigationContext();
    return use(OutletContext) as Context;
}

export function useSearchParams(
    defaultInit?: URLSearchParamsInit,
): [URLSearchParams, SetURLSearchParams] {
    const location = useLocation();
    const navigate = useNavigate();
    const [defaultParams] = useState(() => createSearchParams(defaultInit));
    const [hasSetSearchParams, setHasSearchParams] = useState(false);
    const searchParams = createSearchParams(location.search);
    if (!hasSetSearchParams && location.search === '') {
        for (const [key, value] of defaultParams) {
            if (!searchParams.has(key)) {
                searchParams.append(key, value);
            }
        }
    }

    const setSearchParams: SetURLSearchParams = (nextInit, navigateOptions) => {
        const nextValue =
            typeof nextInit === 'function'
                ? nextInit(new URLSearchParams(searchParams))
                : nextInit;
        const nextParams = createSearchParams(nextValue);
        setHasSearchParams(true);
        navigate(
            { search: nextParams.size === 0 ? '' : `?${nextParams.toString()}` },
            navigateOptions,
        );
    };

    return [searchParams, setSearchParams];
}
