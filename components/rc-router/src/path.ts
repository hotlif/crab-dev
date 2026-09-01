import type { Location, Params, Path, PathMatch, PathPattern, To, URLSearchParamsInit, } from './types.js';

const PROTOCOL_PATTERN = /^[a-z][a-z\d+.-]*:/i;

function ensurePrefix(value: string, prefix: string): string {
    if (value === '') {
        return '';
    }
    return value.startsWith(prefix) ? value : `${prefix}${value}`;
}

export function normalizePathname(pathname: string): string {
    const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
    const collapsed = withLeadingSlash.replace(/\/{2,}/g, '/');
    if (collapsed.length > 1) {
        return collapsed.replace(/\/+$/, '');
    }
    return '/';
}

export function normalizeBasename(basename = '/'): string {
    return normalizePathname(basename);
}

export function joinPaths(paths: readonly string[]): string {
    return normalizePathname(paths.filter(Boolean).join('/'));
}

export function stripBasename(
    pathname: string,
    basename: string,
): string | null {
    const normalizedPathname = normalizePathname(pathname);
    const normalizedBasename = normalizeBasename(basename);
    if (normalizedBasename === '/') {
        return normalizedPathname;
    }

    const prefix = normalizedPathname.slice(0, normalizedBasename.length);
    if (prefix.toLowerCase() !== normalizedBasename.toLowerCase()) {
        return null;
    }

    const boundary = normalizedPathname.charAt(normalizedBasename.length);
    if (boundary !== '' && boundary !== '/') {
        return null;
    }

    return normalizePathname(
        normalizedPathname.slice(normalizedBasename.length) || '/',
    );
}

export function parsePath(value: string): Partial<Path> {
    let pathname = value;
    let hash = '';
    let search = '';

    const hashIndex = pathname.indexOf('#');
    if (hashIndex >= 0) {
        hash = pathname.slice(hashIndex);
        pathname = pathname.slice(0, hashIndex);
    }

    const searchIndex = pathname.indexOf('?');
    if (searchIndex >= 0) {
        search = pathname.slice(searchIndex);
        pathname = pathname.slice(0, searchIndex);
    }

    return {
        ...(pathname === '' ? {} : { pathname }),
        ...(search === '' ? {} : { search }),
        ...(hash === '' ? {} : { hash }),
    };
}

export function createPath(path: Partial<Path>): string {
    const pathname = path.pathname ?? '/';
    const search = ensurePrefix(path.search ?? '', '?');
    const hash = ensurePrefix(path.hash ?? '', '#');
    return `${pathname}${search}${hash}`;
}

export function isAbsoluteUrl(value: string): boolean {
    return PROTOCOL_PATTERN.test(value) || value.startsWith('//');
}

function resolvePathname(toPathname: string, fromPathname: string): string {
    if (toPathname.startsWith('/')) {
        return normalizePathname(toPathname);
    }

    const segments = normalizePathname(fromPathname).split('/');
    const toSegments = toPathname.split('/');
    for (const segment of toSegments) {
        if (segment === '..') {
            if (segments.length > 1) {
                segments.pop();
            }
        } else if (segment !== '.' && segment !== '') {
            segments.push(segment);
        }
    }
    return normalizePathname(segments.join('/'));
}

export function resolveTo(
    to: To,
    location: Location,
    routePathnames: readonly string[],
    relative: 'route' | 'path' = 'route',
): Path {
    const parsed = typeof to === 'string' ? parsePath(to) : to;
    let pathname: string;

    if (parsed.pathname === undefined) {
        pathname = location.pathname;
    } else if (parsed.pathname.startsWith('/')) {
        pathname = normalizePathname(parsed.pathname);
    } else if (relative === 'path') {
        pathname = resolvePathname(parsed.pathname, location.pathname);
    } else {
        const segments = parsed.pathname.split('/');
        let routeIndex = Math.max(routePathnames.length - 1, 0);
        while (segments[0] === '..') {
            segments.shift();
            routeIndex = Math.max(routeIndex - 1, 0);
        }
        const base = routePathnames[routeIndex] ?? '/';
        pathname = resolvePathname(segments.join('/'), base);
    }

    return {
        pathname,
        search:
            parsed.search === undefined
                ? parsed.pathname === undefined
                    ? location.search
                    : ''
                : ensurePrefix(parsed.search, '?'),
        hash:
            parsed.hash === undefined
                ? parsed.pathname === undefined && parsed.search === undefined
                    ? location.hash
                    : ''
                : ensurePrefix(parsed.hash, '#'),
    };
}

interface SegmentMatch {
    params: Record<string, string | undefined>;
    consumed: number;
    baseConsumed: number;
}

function safelyDecode(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function matchSegments(
    patternSegments: readonly string[],
    pathnameSegments: readonly string[],
    caseSensitive: boolean,
    end: boolean,
    patternIndex = 0,
    pathnameIndex = 0,
    params: Record<string, string | undefined> = {},
): SegmentMatch | null {
    if (patternIndex === patternSegments.length) {
        if (end && pathnameIndex < pathnameSegments.length) {
            return null;
        }
        return {
            params,
            consumed: pathnameIndex,
            baseConsumed: pathnameIndex,
        };
    }

    const patternSegment = patternSegments[patternIndex];
    if (patternSegment === '*') {
        const splatSegments = pathnameSegments.slice(pathnameIndex);
        return {
            params: {
                ...params,
                '*': safelyDecode(splatSegments.join('/')),
            },
            consumed: pathnameSegments.length,
            baseConsumed: pathnameIndex,
        };
    }

    const optional = patternSegment.startsWith(':') && patternSegment.endsWith('?');
    if (optional) {
        const key = patternSegment.slice(1, -1);
        if (pathnameIndex < pathnameSegments.length) {
            const consumedMatch = matchSegments(
                patternSegments,
                pathnameSegments,
                caseSensitive,
                end,
                patternIndex + 1,
                pathnameIndex + 1,
                {
                    ...params,
                    [key]: safelyDecode(pathnameSegments[pathnameIndex]),
                },
            );
            if (consumedMatch !== null) {
                return consumedMatch;
            }
        }
        return matchSegments(
            patternSegments,
            pathnameSegments,
            caseSensitive,
            end,
            patternIndex + 1,
            pathnameIndex,
            { ...params, [key]: undefined },
        );
    }

    if (pathnameIndex >= pathnameSegments.length) {
        return null;
    }

    if (patternSegment.startsWith(':')) {
        return matchSegments(
            patternSegments,
            pathnameSegments,
            caseSensitive,
            end,
            patternIndex + 1,
            pathnameIndex + 1,
            {
                ...params,
                [patternSegment.slice(1)]: safelyDecode(
                    pathnameSegments[pathnameIndex],
                ),
            },
        );
    }

    const actualSegment = safelyDecode(pathnameSegments[pathnameIndex]);
    const expectedSegment = safelyDecode(patternSegment);
    const matches = caseSensitive
        ? actualSegment === expectedSegment
        : actualSegment.toLowerCase() === expectedSegment.toLowerCase();
    if (!matches) {
        return null;
    }

    return matchSegments(
        patternSegments,
        pathnameSegments,
        caseSensitive,
        end,
        patternIndex + 1,
        pathnameIndex + 1,
        params,
    );
}

export function matchPath<ParamKey extends string = string>(
    pattern: PathPattern | string,
    pathname: string,
): PathMatch<ParamKey> | null {
    const normalizedPattern: PathPattern =
        typeof pattern === 'string'
            ? { path: pattern, caseSensitive: false, end: true }
            : {
                path: pattern.path,
                caseSensitive: pattern.caseSensitive ?? false,
                end: pattern.end ?? true,
            };
    const patternSegments = normalizePathname(normalizedPattern.path)
        .split('/')
        .filter(Boolean);
    const pathnameSegments = normalizePathname(pathname)
        .split('/')
        .filter(Boolean);

    const splatIndex = patternSegments.indexOf('*');
    if (splatIndex >= 0 && splatIndex !== patternSegments.length - 1) {
        throw new Error('Router: a splat segment (*) must be the final path segment.');
    }

    const result = matchSegments(
        patternSegments,
        pathnameSegments,
        normalizedPattern.caseSensitive ?? false,
        normalizedPattern.end ?? true,
    );
    if (result === null) {
        return null;
    }

    const pathnameValue =
        result.consumed === 0
            ? '/'
            : `/${pathnameSegments.slice(0, result.consumed).join('/')}`;
    const pathnameBase =
        result.baseConsumed === 0
            ? '/'
            : `/${pathnameSegments.slice(0, result.baseConsumed).join('/')}`;

    return {
        params: result.params as Params<ParamKey>,
        pathname: pathnameValue,
        pathnameBase,
        pattern: normalizedPattern,
    };
}

export function createSearchParams(init: URLSearchParamsInit = ''): URLSearchParams {
    if (init instanceof URLSearchParams || typeof init === 'string' || Array.isArray(init)) {
        return new URLSearchParams(init as string | string[][] | URLSearchParams);
    }

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(init)) {
        if (Array.isArray(value)) {
            for (const item of value) {
                params.append(key, item);
            }
        } else {
            params.set(key, value as string);
        }
    }
    return params;
}
