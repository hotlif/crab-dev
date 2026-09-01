import { describe, expect, it } from '@crab-dev/wake/test';
import { createSearchParams, matchPath, resolveTo, stripBasename, } from '../path.js';
import type { Location } from '../types.js';

const location: Location = {
    pathname: '/projects/42/edit',
    search: '?tab=details',
    hash: '#form',
    state: null,
    key: 'test',
};

describe('path utilities', () => {
    it('strips basename only on segment boundaries', () => {
        expect(stripBasename('/app/projects', '/app')).toBe('/projects');
        expect(stripBasename('/application/projects', '/app')).toBeNull();
        expect(stripBasename('/APP/projects/', '/app')).toBe('/projects');
    });

    it('matches optional params and trailing splats', () => {
        expect(matchPath('/:language?/docs', '/docs')?.params.language).toBeUndefined();
        expect(matchPath('/:language?/docs', '/en/docs')?.params.language).toBe('en');
        expect(matchPath('/files/*', '/files/a/b')?.params['*']).toBe('a/b');
    });

    it('resolves route-relative and path-relative navigation', () => {
        expect(
            resolveTo('..', location, ['/', '/projects', '/projects/42/edit'], 'route')
                .pathname,
        ).toBe('/projects');
        expect(
            resolveTo('..', location, ['/', '/projects', '/projects/42/edit'], 'path')
                .pathname,
        ).toBe('/projects/42');
        expect(
            resolveTo('?tab=history', location, ['/projects/42/edit'], 'route'),
        ).toEqual({
            pathname: '/projects/42/edit',
            search: '?tab=history',
            hash: '',
        });
    });

    it('creates search params from object arrays', () => {
        const params = createSearchParams({
            tab: 'activity',
            filter: ['open', 'assigned'],
        });

        expect(params.get('tab')).toBe('activity');
        expect(params.getAll('filter')).toEqual(['open', 'assigned']);
    });
});
