import { describe, expect, it } from '@crab-dev/wake/test';
import { matchRoutes } from '../matcher.js';
import type { RouteObject } from '../types.js';

describe('matchRoutes', () => {
    it('ranks static routes above dynamic and splat routes', () => {
        const dynamicRoute: RouteObject = { path: 'users/:id', element: <p>dynamic</p> };
        const staticRoute: RouteObject = { path: 'users/new', element: <p>static</p> };
        const splatRoute: RouteObject = { path: '*', element: <p>splat</p> };

        const matches = matchRoutes(
            [dynamicRoute, splatRoute, staticRoute],
            '/users/new',
        );

        expect(matches?.at(-1)?.route).toBe(staticRoute);
    });

    it('matches nested, pathless, and index routes', () => {
        const indexRoute: RouteObject = { index: true, element: <p>index</p> };
        const routes: RouteObject[] = [
            {
                path: '/',
                element: <p>root</p>,
                children: [
                    {
                        element: <p>layout</p>,
                        children: [
                            indexRoute,
                            { path: 'settings', element: <p>settings</p> },
                        ],
                    },
                ],
            },
        ];

        const matches = matchRoutes(routes, '/');

        expect(matches).toHaveLength(3);
        expect(matches?.at(-1)?.route).toBe(indexRoute);
    });

    it('matches optional parent parameters with child paths', () => {
        const routes: RouteObject[] = [
            {
                path: ':language?',
                children: [{ path: 'docs', element: <p>docs</p> }],
            },
        ];

        const withoutLanguage = matchRoutes(routes, '/docs');
        const withLanguage = matchRoutes(routes, '/zh/docs');

        expect(withoutLanguage?.at(-1)?.params.language).toBeUndefined();
        expect(withLanguage?.at(-1)?.params.language).toBe('zh');
    });

    it('decodes dynamic and splat parameters', () => {
        const routes: RouteObject[] = [
            { path: 'users/:name', element: <p>user</p> },
            { path: 'files/*', element: <p>files</p> },
        ];

        expect(matchRoutes(routes, '/users/Jane%20Doe')?.at(-1)?.params.name).toBe(
            'Jane Doe',
        );
        expect(matchRoutes(routes, '/files/a%20b/report')?.at(-1)?.params['*']).toBe(
            'a b/report',
        );
    });

    it('handles case sensitivity and trailing slashes', () => {
        const sensitiveRoute: RouteObject = {
            path: 'Admin',
            caseSensitive: true,
            element: <p>admin</p>,
        };
        const insensitiveRoute: RouteObject = {
            path: 'profile',
            element: <p>profile</p>,
        };

        expect(matchRoutes([sensitiveRoute], '/admin')).toBeNull();
        expect(matchRoutes([sensitiveRoute], '/Admin/')).not.toBeNull();
        expect(matchRoutes([insensitiveRoute], '/PROFILE/')).not.toBeNull();
    });

    it('validates index, splat, and absolute child routes', () => {
        expect(() =>
            matchRoutes(
                // @ts-expect-error Runtime validation protects JavaScript consumers too.
                [{ index: true, path: 'invalid', element: <p /> }],
                '/',
            ),
        ).toThrow('index route');
        expect(() =>
            matchRoutes([{ path: 'files/*/edit', element: <p /> }], '/files/a/edit'),
        ).toThrow('final path segment');
        expect(() =>
            matchRoutes(
                [
                    {
                        path: '/parent',
                        children: [{ path: '/other', element: <p /> }],
                    },
                ],
                '/other',
            ),
        ).toThrow('must begin with its parent path');
    });
});
