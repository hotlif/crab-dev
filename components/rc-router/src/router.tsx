import { startTransition, useEffect, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { LocationContext, NavigationContext, RouteContext, } from './contexts.js';
import { createBrowserHistory } from './history.js';
import { matchRoutes } from './matcher.js';
import type { RouteMatch } from './matcher.js';
import { normalizeBasename, stripBasename } from './path.js';
import type { RouteObject, RouterProps } from './types.js';

interface RenderedRouteProps {
    matchIndex: number;
    matches: readonly RouteMatch[];
    outlet: ReactElement | null;
    children: ReactNode;
}

function RenderedRoute({
    matchIndex,
    matches,
    outlet,
    children,
}: RenderedRouteProps) {
    return (
        <RouteContext value={{ matches: matches.slice(0, matchIndex + 1), outlet }}>
            {children}
        </RouteContext>
    );
}

function getRouteElement(route: RouteObject): ReactNode | undefined {
    if (route.element !== undefined && route.Component !== undefined) {
        throw new Error('Router: a route cannot define both element and Component.');
    }
    if (route.element !== undefined) {
        return route.element;
    }
    if (route.Component !== undefined) {
        const Component = route.Component;
        return <Component />;
    }
    return undefined;
}

function renderMatches(matches: readonly RouteMatch[] | null): ReactElement | null {
    if (matches === null) {
        return null;
    }

    let outlet: ReactElement | null = null;
    for (let index = matches.length - 1; index >= 0; index -= 1) {
        const routeElement = getRouteElement(matches[index].route);
        const children = routeElement === undefined ? outlet : routeElement;
        const childOutlet = outlet;
        outlet = (
            <RenderedRoute
                matchIndex={index}
                matches={matches}
                outlet={childOutlet}
            >
                {children}
            </RenderedRoute>
        );
    }
    return outlet;
}

interface RouterRuntimeProps extends RouterProps {
    targetWindow: Window;
}

function RouterRuntime({ routes, basename = '/', targetWindow }: RouterRuntimeProps) {
    const [history] = useState(() => createBrowserHistory(targetWindow));
    const [snapshot, setSnapshot] = useState(history.getSnapshot);

    useEffect(() => {
        return history.listen((nextSnapshot) => {
            startTransition(() => {
                setSnapshot(nextSnapshot);
            });
        });
    }, [history]);

    const normalizedBasename = normalizeBasename(basename);
    const pathname = stripBasename(
        snapshot.location.pathname,
        normalizedBasename,
    );
    const appLocation = {
        ...snapshot.location,
        pathname: pathname ?? '/',
    };
    const matches = pathname === null ? null : matchRoutes(routes, pathname);

    return (
        <NavigationContext value={{ basename: normalizedBasename, history }}>
            <LocationContext
                value={{
                    location: appLocation,
                    navigationType: snapshot.action,
                }}
            >
                {renderMatches(matches)}
            </LocationContext>
        </NavigationContext>
    );
}

/**
 * 使用浏览器 History API 渲染对象式路由配置。
 */
function Router({ routes, basename = '/', window: windowOverride }: RouterProps) {
    const targetWindow = windowOverride ?? globalThis.window;
    if (targetWindow === undefined) {
        throw new Error('Router: a browser Window is required.');
    }
    return (
        <RouterRuntime
            routes={routes}
            basename={basename}
            window={windowOverride}
            targetWindow={targetWindow}
        />
    );
}

export default Router;
