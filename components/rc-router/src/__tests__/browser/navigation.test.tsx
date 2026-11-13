import { StrictMode, useState } from 'react';
import { afterEach, describe, expect, it } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen, waitFor } from '@crab-dev/wake/test/react';
import Router from '../../router.js';
import Outlet from '../../outlet.js';
import Navigate from '../../navigate.js';
import { Link } from '../../link.js';
import { useBlocker, useLocation, useNavigate, useSearchParams } from '../../hooks.js';
import type { RouteObject } from '../../types.js';
import type { Blocker } from '../../types.js';
import { createBrowserHistory } from '../../history.js';

const initialUrl = window.location.href;
const initialState: unknown = window.history.state;
afterEach(() => window.history.replaceState(initialState, '', initialUrl));

function Shell() {
    const location = useLocation();
    const [session, setSession] = useState('session');
    return <><input aria-label="Session" value={session} onChange={event => setSession(event.target.value)} />
        <button onClick={() => setSession('retained session')}>Start session</button>
        <p data-testid="location">{location.pathname}{location.search}</p><Outlet /></>;
}

function Editor() {
    const [dirty, setDirty] = useState(false);
    const [error, setError] = useState('');
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();
    const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname);
    return <><p>Editor {params.get('workspace')}</p><button onClick={() => setDirty(true)}>Edit draft</button>
        <button onClick={() => setParams({ workspace: 'two' })}>Workspace two</button>
        <button onClick={() => navigate('/done', { replace: true })}>Replace with done</button>
        <Link to="/done">Done</Link><p>{error}</p>
        {blocker.state === 'blocked' && <section aria-label="Unsaved changes">
            <p>Leave for {blocker.location.pathname}</p>
            <button onClick={blocker.reset}>Stay</button>
            <button onClick={async () => { await Promise.resolve(); setError('Save failed'); }}>Fail save</button>
            <button onClick={async () => { await Promise.resolve(); setDirty(false); blocker.proceed(); }}>Save and leave</button>
        </section>}
    </>;
}

const routes: RouteObject[] = [{ Component: Shell, children: [
    { path: '/', element: <Link to="/edit?workspace=one">Open editor</Link> },
    { path: '/edit', Component: Editor },
    { path: '/done', element: <p>Finished</p> },
    { path: '/login', element: <Navigate to="/edit?workspace=one" replace /> },
    { path: '*', element: <p>Not found</p> },
] }];

async function traverse(delta: number, expectedPath: string) {
    await act(async () => {
        window.history.go(delta);
        await waitFor(() => expect(window.location.pathname).toBe(expectedPath));
    });
}

describe('native browser navigation', () => {
    it('blocks multi-entry back and forward traversals, including another back while confirming', async () => {
        window.history.replaceState(null, '', '/router-native/start');
        const history = createBrowserHistory(window);
        const path = (pathname: string) => ({ pathname, search: '', hash: '' });
        history.push(path('/router-native/a'));
        history.push(path('/router-native/b'));
        history.push(path('/router-native/c'));
        const states: Blocker[] = [];
        const cleanup = history.block(() => true, next => states.push(next));
        try {
            window.history.go(-2);
            await waitFor(() => expect(states.at(-1)?.state).toBe('blocked'));
            expect(window.location.pathname).toBe('/router-native/c');
            const backward = states.at(-1);
            if (backward?.state !== 'blocked') throw new Error('Missing backward blocker');
            expect(backward.location.pathname).toBe('/router-native/a');
            // A second native POP starts rollback before the user approves the
            // original intent. Approval must wait for rollback to finish.
            window.addEventListener('popstate', () => backward.proceed(), { once: true });
            window.history.back();
            await waitFor(() => expect(history.getSnapshot().location.pathname).toBe('/router-native/a'));
            expect(window.location.pathname).toBe('/router-native/a');
            expect(states.at(-1)?.state).toBe('unblocked');
            window.history.go(2);
            await waitFor(() => expect(states.at(-1)?.state).toBe('blocked'));
            expect(window.location.pathname).toBe('/router-native/a');
            const forward = states.at(-1);
            if (forward?.state !== 'blocked') throw new Error('Missing forward blocker');
            expect(forward.location.pathname).toBe('/router-native/c');
            forward.reset();
            expect(window.location.pathname).toBe('/router-native/a');
        } finally {
            cleanup();
        }
    });
    it('restores a blocked back traversal, retains drafts on cancellation, then continues and goes forward', async () => {
        window.history.replaceState(null, '', '/router-test/');
        const result = await render(<StrictMode><Router basename="/router-test" routes={routes} /></StrictMode>);
        await fireEvent.click(screen.getByText('Start session'));
        expect((screen.getByLabelText('Session') as HTMLInputElement).value).toBe('retained session');
        await fireEvent.click(screen.getByText('Open editor'));
        await fireEvent.click(screen.getByText('Edit draft'));
        await act(async () => {
            window.history.back();
            await waitFor(() => expect(screen.getByText('Leave for /')).toBeTruthy());
        });
        expect(window.location.pathname).toBe('/router-test/edit');
        expect(screen.getByText('Editor one')).toBeTruthy();
        await fireEvent.click(screen.getByText('Fail save'));
        expect(await screen.findByText('Save failed')).toBeTruthy();
        expect(window.location.pathname).toBe('/router-test/edit');
        await fireEvent.click(screen.getByText('Stay'));
        await act(async () => {
            window.history.back();
            await waitFor(() => expect(screen.getByText('Leave for /')).toBeTruthy());
        });
        await act(async () => {
            await fireEvent.click(screen.getByText('Save and leave'));
            await waitFor(() => expect(window.location.pathname).toBe('/router-test/'));
        });
        expect(screen.getByText('Open editor')).toBeTruthy();
        expect((screen.getByLabelText('Session') as HTMLInputElement).value).toBe('retained session');
        await traverse(1, '/router-test/edit');
        expect(screen.getByText('Editor one')).toBeTruthy();
        await result.unmount();
    });

    it('blocks replace, permits workspace query changes, and preserves history length', async () => {
        window.history.replaceState(null, '', '/router-test/edit?workspace=one');
        const result = await render(<Router basename="/router-test" routes={routes} />);
        await fireEvent.click(screen.getByText('Edit draft'));
        await fireEvent.click(screen.getByText('Workspace two'));
        expect(screen.getByText('Editor two')).toBeTruthy();
        const length = window.history.length;
        await fireEvent.click(screen.getByText('Replace with done'));
        expect(screen.getByText('Leave for /done')).toBeTruthy();
        expect(window.location.pathname).toBe('/router-test/edit');
        await fireEvent.click(screen.getByText('Save and leave'));
        expect(await screen.findByText('Finished')).toBeTruthy();
        expect(window.history.length).toBe(length);
        await result.unmount();
    });

    it('reads deep links on remount, replaces login redirects, and renders a wildcard 404', async () => {
        window.history.replaceState(null, '', '/router-test/login');
        const length = window.history.length;
        const first = await render(<Router basename="/router-test" routes={routes} />);
        expect(await screen.findByText('Editor one')).toBeTruthy();
        expect(window.history.length).toBe(length);
        await first.unmount();
        const remounted = await render(<Router basename="/router-test" routes={routes} />);
        expect(screen.getByText('Editor one')).toBeTruthy();
        await remounted.unmount();
        window.history.replaceState(null, '', '/router-test/unknown');
        const missing = await render(<Router basename="/router-test" routes={routes} />);
        expect(screen.getByText('Not found')).toBeTruthy();
        await missing.unmount();
    });
});
