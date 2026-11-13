import { describe, expect, it } from '@crab-dev/wake/test';
import { createBrowserHistory } from '../history.js';
import type { Blocker } from '../types.js';
import { createTestWindow } from './testWindow.js';

const path = (pathname: string) => ({ pathname, search: '', hash: '' });

describe('browser history state and blocking', () => {
    it('round trips undefined, null, falsy, and object state without exposing the envelope', () => {
        const history = createBrowserHistory(createTestWindow());
        for (const state of [undefined, null, false, 0, '', { source: 'test' }]) {
            history.push(path('/next'), state);
            expect(history.getSnapshot().location.state).toEqual(state);
            history.replace(path('/replacement'), state);
            expect(history.getSnapshot().location.state).toEqual(state);
        }
    });

    it('requires every blocker to approve, ignores stale callbacks, and retains the first intent', () => {
        const target = createTestWindow();
        const history = createBrowserHistory(target);
        const states: Blocker[] = [{ state: 'unblocked' }, { state: 'unblocked' }];
        const cleanups = states.map((_, index) => history.block(() => true, next => { states[index] = next; }));
        history.push(path('/first'));
        history.push(path('/ignored'));
        const first = states[0];
        if (first.state !== 'blocked') throw new Error('First blocker not active');
        first.proceed();
        first.proceed();
        expect(target.location.pathname).toBe('/');
        const second = states[1];
        if (second.state !== 'blocked') throw new Error('Second blocker not active');
        second.reset();
        first.proceed();
        second.proceed();
        expect(target.location.pathname).toBe('/');
        history.replace(path('/replacement'));
        const retryFirst = states[0];
        if (retryFirst.state !== 'blocked') throw new Error('First blocker not active');
        retryFirst.proceed();
        const retrySecond = states[1];
        if (retrySecond.state !== 'blocked') throw new Error('Second blocker not active');
        retrySecond.proceed();
        expect(target.location.pathname).toBe('/replacement');
        expect(target.history.length).toBe(1);
        cleanups.forEach(cleanup => cleanup());
    });

    it('cancels a pending intent if a participating blocker unmounts', () => {
        const target = createTestWindow();
        const history = createBrowserHistory(target);
        const states: Blocker[] = [];
        const cleanup = history.block(() => true, next => states.push(next));
        history.push(path('/cancelled'));
        const previous = states.at(-1);
        cleanup();
        if (previous?.state === 'blocked') previous.proceed();
        expect(target.location.pathname).toBe('/');
        history.push(path('/allowed'));
        expect(target.location.pathname).toBe('/allowed');
    });
});
