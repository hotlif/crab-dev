import { lazy, StrictMode, Suspense, useState } from 'react';
import { act, afterEach, describe, expect, fireEvent, it, mock, render, screen } from '@crab-dev/wake/test/react';
import Router from '../router.js';
import Outlet from '../outlet.js';
import { Link } from '../link.js';
import { useBeforeUnload, useBlocker, useLocation, useMatches, useSearchParams } from '../hooks.js';
import type { RouteErrorBoundaryProps, RouteObject } from '../types.js';
import { createTestWindow } from './testWindow.js';

afterEach(() => mock.restoreAll());

describe('route metadata and recovery', () => {
    it('exposes leaf metadata to parents without changing relative navigation', async () => {
        function Layout() {
            const matches = useMatches<{ title: string }>();
            return <><p>{matches.map(match => `${match.id}:${match.handle?.title}`).join('/')}</p>
                <Link to="child/42">Open child</Link><Outlet /></>;
        }
        const routes: RouteObject<{ title: string }>[] = [{
            id: 'layout', path: 'parent', Component: Layout, handle: { title: 'Parent' },
            children: [{ id: 'child', path: 'child/:id', handle: { title: 'Child' }, element: <p>Child page</p> }],
        }];
        const target = createTestWindow('/parent/child/7');
        await render(<Router window={target} routes={routes} />);
        expect(screen.getByText('layout:Parent/child:Child')).toBeTruthy();
        await fireEvent.click(screen.getByText('Open child'));
        expect(target.location.pathname).toBe('/parent/child/42');
    });

    it('keeps healthy layouts mounted and recovers from a child render error on navigation', async () => {
        mock.spyOn(console, 'error').implement(() => undefined);
        function Layout() {
            const [count, setCount] = useState(0);
            return <><button onClick={() => setCount(count + 1)}>Count {count}</button>
                <Link to="/bad">Break</Link><Link to="/good">Recover</Link><Outlet /></>;
        }
        function Broken(): never { throw new Error('broken page'); }
        function Fallback({ error }: RouteErrorBoundaryProps) {
            return <p role="alert">{error instanceof Error ? error.message : 'Error'}</p>;
        }
        const routes: RouteObject[] = [{ Component: Layout, children: [{
            ErrorBoundary: Fallback,
            children: [{ path: '/good', element: <p>Healthy</p> }, { path: '/bad', Component: Broken }],
        }] }];
        await render(<Router window={createTestWindow('/good')} routes={routes} />);
        await fireEvent.click(screen.getByText('Count 0'));
        await fireEvent.click(screen.getByText('Break'));
        expect(await screen.findByText('broken page')).toBeTruthy();
        expect(screen.getByText('Count 1')).toBeTruthy();
        await fireEvent.click(screen.getByText('Recover'));
        expect(await screen.findByText('Healthy')).toBeTruthy();
        expect(screen.getByText('Count 1')).toBeTruthy();
    });

    it('supports lazy loading and routes a rejected import to the nearest boundary', async () => {
        mock.spyOn(console, 'error').implement(() => undefined);
        let rejectLoad: (error: Error) => void = () => {};
        const Page = lazy(() => new Promise<{ default: () => null }>((_resolve, reject) => { rejectLoad = reject; }));
        function Shell() { return <Suspense fallback={<p>Loading module</p>}><Outlet /></Suspense>; }
        function Fallback({ error }: RouteErrorBoundaryProps) { return <p>{String(error)}</p>; }
        await render(<Router window={createTestWindow()} routes={[{
            Component: Shell, children: [{ path: '/', Component: Page, ErrorBoundary: Fallback }],
        }]} />);
        expect(screen.getByText('Loading module')).toBeTruthy();
        await act(async () => { rejectLoad(new Error('module unavailable')); });
        expect(await screen.findByText('Error: module unavailable')).toBeTruthy();
    });

    it('lets the fallback reset a transient error without changing location', async () => {
        mock.spyOn(console, 'error').implement(() => undefined);
        let broken = true;
        function Page() { if (broken) throw new Error('transient'); return <p>Ready</p>; }
        function Fallback({ reset }: RouteErrorBoundaryProps) {
            return <button onClick={() => { broken = false; reset(); }}>Retry</button>;
        }
        await render(<Router window={createTestWindow()} routes={[{ path: '/', Component: Page, ErrorBoundary: Fallback }]} />);
        await fireEvent.click(screen.getByText('Retry'));
        expect(await screen.findByText('Ready')).toBeTruthy();
    });
});

describe('navigation contracts', () => {
    it('keeps query defaults when a search update is blocked and cancelled', async () => {
        function Page() {
            const [params, setParams] = useSearchParams({ tab: 'default' });
            const blocker = useBlocker(true);
            return <><p>Tab: {params.get('tab')}</p><button onClick={() => setParams({})}>Clear</button>
                {blocker.state === 'blocked' && <><button onClick={blocker.reset}>Cancel</button>
                    <button onClick={blocker.proceed}>Continue</button></>}</>;
        }
        await render(<Router window={createTestWindow()} routes={[{ path: '/', Component: Page }]} />);
        await fireEvent.click(screen.getByText('Clear'));
        expect(screen.getByText('Tab: default')).toBeTruthy();
        await fireEvent.click(screen.getByText('Cancel'));
        expect(screen.getByText('Tab: default')).toBeTruthy();
        await fireEvent.click(screen.getByText('Clear'));
        await fireEvent.click(screen.getByText('Continue'));
        expect(screen.getByText('Tab:')).toBeTruthy();
    });
    it('preserves all default query values and allows clearing them', async () => {
        function Page() {
            const [params, setParams] = useSearchParams({ filter: ['open', 'assigned'] });
            return <><p>Filters: {params.getAll('filter').join(',')}</p><button onClick={() => setParams({})}>Clear</button></>;
        }
        await render(<Router window={createTestWindow()} routes={[{ path: '/', Component: Page }]} />);
        expect(screen.getByText('Filters: open,assigned')).toBeTruthy();
        await fireEvent.click(screen.getByText('Clear'));
        expect(screen.getByText('Filters:')).toBeTruthy();
    });

    it('blocks links with basename, uses current dirty state, and cleans up in StrictMode', async () => {
        const target = createTestWindow('/app/edit');
        function Editor() {
            const [dirty, setDirty] = useState(false);
            const blocker = useBlocker(({ nextLocation }) => dirty && nextLocation.pathname !== '/edit');
            useBeforeUnload(dirty);
            const location = useLocation();
            return <><p>{location.pathname}</p><button onClick={() => setDirty(true)}>Edit</button>
                <Link to="/next">Next</Link>
                {blocker.state === 'blocked' && <><p>Leave {blocker.location.pathname}</p>
                    <button onClick={blocker.reset}>Cancel</button>
                    <button onClick={() => { setDirty(false); blocker.proceed(); }}>Save</button></>}
            </>;
        }
        const result = await render(<StrictMode><Router basename="/app" window={target} routes={[
            { path: 'edit', Component: Editor }, { path: 'next', element: <p>Done</p> },
        ]} /></StrictMode>);
        await fireEvent.click(screen.getByText('Edit'));
        const beforeUnload = new Event('beforeunload', { cancelable: true });
        target.dispatchEvent(beforeUnload);
        expect(beforeUnload.defaultPrevented).toBe(true);
        await fireEvent.click(screen.getByText('Next'));
        expect(screen.getByText('Leave /next')).toBeTruthy();
        expect(target.location.pathname).toBe('/app/edit');
        await fireEvent.click(screen.getByText('Cancel'));
        await fireEvent.click(screen.getByText('Next'));
        await fireEvent.click(screen.getByText('Save'));
        expect(await screen.findByText('Done')).toBeTruthy();
        expect(target.location.pathname).toBe('/app/next');
        await result.unmount();
        const afterUnmount = new Event('beforeunload', { cancelable: true });
        target.dispatchEvent(afterUnmount);
        expect(afterUnmount.defaultPrevented).toBe(false);
    });
});
