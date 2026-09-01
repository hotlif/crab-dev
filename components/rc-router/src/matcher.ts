import { joinPaths, matchPath, normalizePathname } from './path.js';
import type { Params, RouteObject } from './types.js';

interface RouteMeta {
    route: RouteObject;
    relativePath: string;
}

interface RouteBranch {
    path: string;
    score: number;
    routesMeta: readonly RouteMeta[];
    order: readonly number[];
}

export interface RouteMatch {
    params: Params;
    pathname: string;
    pathnameBase: string;
    route: RouteObject;
}

function validatePath(path: string): void {
    const segments = path.split('/').filter(Boolean);
    const splatIndex = segments.indexOf('*');
    if (splatIndex >= 0 && splatIndex !== segments.length - 1) {
        throw new Error('Router: a splat segment (*) must be the final path segment.');
    }
    for (const segment of segments) {
        if (segment.includes('*') && segment !== '*') {
            throw new Error('Router: a splat must occupy an entire path segment.');
        }
        if (segment.startsWith(':') && segment.replace(/[?:]/g, '') === '') {
            throw new Error('Router: dynamic path segments must have a parameter name.');
        }
    }
}

function computeScore(path: string, index: boolean): number {
    const segments = normalizePathname(path).split('/').filter(Boolean);
    let score = segments.length + (index ? 2 : 0);
    for (const segment of segments) {
        if (segment === '*') {
            score -= 2;
        } else if (segment.startsWith(':') && segment.endsWith('?')) {
            score += 2;
        } else if (segment.startsWith(':')) {
            score += 3;
        } else {
            score += 10;
        }
    }
    return score;
}

function expandOptionalSegments(path: string): string[] {
    const segments = path.split('/').filter(Boolean);
    let variants: string[][] = [[]];
    for (const segment of segments) {
        if (segment.startsWith(':') && segment.endsWith('?')) {
            const requiredSegment = segment.slice(0, -1);
            variants = variants.flatMap((variant) => [
                [...variant, requiredSegment],
                variant,
            ]);
        } else {
            variants = variants.map((variant) => [...variant, segment]);
        }
    }
    return variants.map((variant) => variant.join('/'));
}

function flattenRoutes(
    routes: readonly RouteObject[],
    branches: RouteBranch[] = [],
    parentsMeta: readonly RouteMeta[] = [],
    parentPath = '/',
    parentOrder: readonly number[] = [],
): RouteBranch[] {
    routes.forEach((route, index) => {
        if (route.index === true && ('children' in route || 'path' in route)) {
            throw new Error('Router: an index route cannot define path or children.');
        }

        let relativePath = route.path ?? '';
        validatePath(relativePath);
        if (relativePath.startsWith('/')) {
            const normalizedParent = normalizePathname(parentPath);
            const normalizedAbsolute = normalizePathname(relativePath);
            if (
                normalizedParent !== '/' &&
                normalizedAbsolute !== normalizedParent &&
                !normalizedAbsolute.startsWith(`${normalizedParent}/`)
            ) {
                throw new Error(
                    `Router: absolute child path "${relativePath}" must begin with its parent path "${normalizedParent}".`,
                );
            }
            relativePath =
                normalizedParent === '/'
                    ? normalizedAbsolute.slice(1)
                    : normalizedAbsolute.slice(normalizedParent.length).replace(/^\//, '');
        }

        const relativePathVariants = expandOptionalSegments(relativePath);
        relativePathVariants.forEach((relativePathVariant, variantIndex) => {
            const meta: RouteMeta = {
                route,
                relativePath: relativePathVariant,
            };
            const routesMeta = [...parentsMeta, meta];
            const path = joinPaths([parentPath, relativePathVariant]);
            const order = [...parentOrder, index, variantIndex];

            if (route.index !== true && route.children !== undefined) {
                flattenRoutes(route.children, branches, routesMeta, path, order);
            }

            if (
                route.path !== undefined ||
                route.index === true ||
                route.element !== undefined ||
                route.Component !== undefined
            ) {
                branches.push({
                    path,
                    score: computeScore(path, route.index === true),
                    routesMeta,
                    order,
                });
            }
        });
    });
    return branches;
}

function compareOrder(left: readonly number[], right: readonly number[]): number {
    const length = Math.min(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
        if (left[index] !== right[index]) {
            return left[index] - right[index];
        }
    }
    return left.length - right.length;
}

function rankBranches(branches: RouteBranch[]): RouteBranch[] {
    return branches.sort((left, right) => {
        if (left.score !== right.score) {
            return right.score - left.score;
        }
        return compareOrder(left.order, right.order);
    });
}

function matchRouteBranch(
    branch: RouteBranch,
    pathname: string,
): RouteMatch[] | null {
    const matches: RouteMatch[] = [];
    let matchedPathname = '/';
    let matchedParams: Record<string, string | undefined> = {};

    for (let index = 0; index < branch.routesMeta.length; index += 1) {
        const meta = branch.routesMeta[index];
        const end = index === branch.routesMeta.length - 1;
        const remainingPathname =
            matchedPathname === '/'
                ? pathname
                : pathname.slice(matchedPathname.length) || '/';
        const match = matchPath(
            {
                path: meta.relativePath,
                caseSensitive: meta.route.caseSensitive,
                end,
            },
            remainingPathname,
        );
        if (match === null) {
            return null;
        }

        matchedParams = { ...matchedParams, ...match.params };
        const pathnameValue = joinPaths([matchedPathname, match.pathname]);
        const pathnameBase = joinPaths([matchedPathname, match.pathnameBase]);
        matches.push({
            params: matchedParams,
            pathname: pathnameValue,
            pathnameBase,
            route: meta.route,
        });
        if (match.pathnameBase !== '/') {
            matchedPathname = pathnameBase;
        }
    }

    return matches;
}

export function matchRoutes(
    routes: readonly RouteObject[],
    pathname: string,
): RouteMatch[] | null {
    const branches = rankBranches(flattenRoutes(routes));
    const normalizedPathname = normalizePathname(pathname);
    for (const branch of branches) {
        const matches = matchRouteBranch(branch, normalizedPathname);
        if (matches !== null) {
            return matches;
        }
    }
    return null;
}
