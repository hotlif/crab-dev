import { StrictMode } from 'react';
import { act, afterEach, describe, expect, fireEvent, it, mock, render, screen, waitFor } from '@crab-dev/wake/test/react';
import { Link, NavLink } from '../link.js';
import Navigate from '../navigate.js';
import Outlet from '../outlet.js';
import Router from '../router.js';
import { useLocation, useNavigate, useNavigationType, useOutletContext, useParams, useSearchParams, } from '../hooks.js';
import type { RouteObject } from '../types.js';

function createTestWindow(pathname = '/'): Window {
    let currentUrl = new URL(pathname, 'https://router.test');
    let currentState: unknown = null;
    const events = new EventTarget();
    const updateUrl = (url: string | URL | null | undefined): void => {
        if (url !== null && url !== undefined) {
            currentUrl = new URL(String(url), currentUrl);
        }
    };
    const history = {
        get state(): unknown {
            return currentState;
        },
        pushState(data: unknown, _unused: string, url?: string | URL | null): void {
            currentState = data;
            updateUrl(url);
        },
        replaceState(data: unknown, _unused: string, url?: string | URL | null): void {
            currentState = data;
            updateUrl(url);
        },
        go(): void {},
    } as unknown as History;
    return {
        history,
        get location(): Location {
            return currentUrl as unknown as Location;
        },
        addEventListener: events.addEventListener.bind(events),
        removeEventListener: events.removeEventListener.bind(events),
        dispatchEvent: events.dispatchEvent.bind(events),
    } as unknown as Window;
}

afterEach(() => {
    mock.restoreAll();
});

function Layout() {
    return (
        <div>
            <nav aria-label="Primary">
                <NavLink to="/" end>
                    Home
                </NavLink>
                <NavLink
                    to="/users/42"
                    className={({ isActive }) => (isActive ? 'active' : undefined)}
                >
                    User
                </NavLink>
            </nav>
            <Outlet context="layout context" />
        </div>
    );
}

function UserPage() {
    const params = useParams<'id'>();
    const context = useOutletContext<string>();
    const location = useLocation<{ source?: string }>();
    return (
        <p>
            User {params.id}; {context}; {location.state?.source ?? 'direct'}
        </p>
    );
}

function SearchPage() {
    const [params, setParams] = useSearchParams({ tab: 'overview' });
    return (
        <div>
            <span>Tab: {params.get('tab')}</span>
            <button onClick={() => setParams({ tab: 'activity' }, { replace: true })}>
                Change tab
            </button>
        </div>
    );
}

const routes: RouteObject[] = [
    {
        path: '/',
        Component: Layout,
        children: [
            { index: true, element: <p>Home page</p> },
            { path: 'users/:id', Component: UserPage },
            { path: 'search', Component: SearchPage },
            { path: '*', element: <p>Not found</p> },
        ],
    },
];

describe('Router integration', () => {
    it('renders nested routes, params, outlet context, and NavLink state', async () => {
        const targetWindow = createTestWindow();
        await render(<Router routes={routes} window={targetWindow} />);

        expect(screen.getByText('Home page')).toBeTruthy();
        expect(screen.getByText('Home').getAttribute('aria-current')).toBe('page');

        await fireEvent.click(screen.getByText('User'));

        expect(
            await screen.findByText('User 42; layout context; direct'),
        ).toBeTruthy();
        expect(screen.getByText('User').getAttribute('aria-current')).toBe('page');
        expect(screen.getByText('User').className).toBe('active');
        expect(targetWindow.location.pathname).toBe('/users/42');
    });

    it('supports basename, replace, and location state', async () => {
        const targetWindow = createTestWindow('/app');
        const basenameRoutes: RouteObject[] = [
            {
                path: '/',
                element: (
                    <div>
                        <Link to="users/7" replace state={{ source: 'link' }}>
                            Open user
                        </Link>
                        <Outlet context="layout context" />
                    </div>
                ),
                children: [
                    { index: true, element: <p>Start</p> },
                    { path: 'users/:id', Component: UserPage },
                ],
            },
        ];
        await render(<Router basename="/app" routes={basenameRoutes} window={targetWindow} />);

        await fireEvent.click(screen.getByText('Open user'));

        expect(
            await screen.findByText('User 7; layout context; link'),
        ).toBeTruthy();
        expect(targetWindow.location.pathname).toBe('/app/users/7');
    });

    it('updates search params without dropping the pathname', async () => {
        const targetWindow = createTestWindow('/search');
        await render(<Router routes={routes} window={targetWindow} />);

        expect(screen.getByText('Tab: overview')).toBeTruthy();
        await fireEvent.click(screen.getByText('Change tab'));

        await waitFor(() => {
            expect(screen.getByText('Tab: activity')).toBeTruthy();
        });
        expect(targetWindow.location.pathname).toBe('/search');
        expect(targetWindow.location.search).toBe('?tab=activity');
    });

    it('responds to popstate and exposes the navigation type', async () => {
        function Page() {
            const navigationType = useNavigationType();
            return <p>{navigationType}</p>;
        }
        const popRoutes: RouteObject[] = [
            { path: '/', Component: Page },
            { path: '/next', Component: Page },
        ];
        const targetWindow = createTestWindow();
        await render(<Router routes={popRoutes} window={targetWindow} />);

        await act(() => {
            targetWindow.history.pushState(null, '', '/next');
            targetWindow.dispatchEvent(new PopStateEvent('popstate'));
        });

        expect(await screen.findByText('POP')).toBeTruthy();
        expect(targetWindow.location.pathname).toBe('/next');
    });

    it('supports programmatic navigation and Navigate replacement', async () => {
        function Controls() {
            const navigate = useNavigate();
            return <button onClick={() => navigate('/old')}>Go</button>;
        }
        const navigateRoutes: RouteObject[] = [
            { path: '/', Component: Controls },
            { path: '/old', element: <Navigate to="/new" replace /> },
            { path: '/new', element: <p>New page</p> },
        ];
        const targetWindow = createTestWindow();
        await render(<Router routes={navigateRoutes} window={targetWindow} />);

        await fireEvent.click(screen.getByText('Go'));

        expect(await screen.findByText('New page')).toBeTruthy();
        expect(targetWindow.location.pathname).toBe('/new');
    });

    it('does not intercept links requiring native browser behavior', async () => {
        const targetWindow = createTestWindow();
        await render(
            <Router
                window={targetWindow}
                routes={[
                    {
                        path: '/',
                        element: (
                            <div>
                                <Link to="/internal">Internal</Link>
                                <Link to="https://example.com/path">External</Link>
                                <Link to="/download" download>
                                    Download
                                </Link>
                                <Link to="/target" target="_blank">
                                    Target
                                </Link>
                                <Link to="/reload" reloadDocument>
                                    Reload
                                </Link>
                            </div>
                        ),
                    },
                ]}
            />,
        );

        const dispatchClick = (element: HTMLElement, ctrlKey = false): boolean => {
            let prevented = false;
            const captureResult = (event: MouseEvent): void => {
                prevented = event.defaultPrevented;
                event.preventDefault();
            };
            document.addEventListener('click', captureResult, { once: true });
            element.dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    button: 0,
                    ctrlKey,
                }),
            );
            return prevented;
        };

        expect(dispatchClick(screen.getByText('Internal'), true)).toBe(false);
        expect(dispatchClick(screen.getByText('External'))).toBe(false);
        expect(dispatchClick(screen.getByText('Download'))).toBe(false);
        expect(dispatchClick(screen.getByText('Target'))).toBe(false);
        expect(dispatchClick(screen.getByText('Reload'))).toBe(false);
        let internalPrevented = false;
        await act(() => {
            internalPrevented = dispatchClick(screen.getByText('Internal'));
        });
        expect(internalPrevented).toBe(true);
    });

    it('throws a clear error when hooks are used outside Router', async () => {
        function InvalidConsumer() {
            useLocation();
            return null;
        }
        mock.spyOn(console, 'error').implement(() => undefined);

        await expect(render(<InvalidConsumer />)).rejects.toThrow(
            'this hook must be used within <Router>',
        );
    });

    it('cleans up popstate listeners across StrictMode mounts', async () => {
        const targetWindow = createTestWindow();
        const removeListener = mock.spyOn(targetWindow, 'removeEventListener');
        const result = await render(
            <StrictMode>
                <Router routes={routes} window={targetWindow} />
            </StrictMode>,
        );

        await result.unmount();

        expect(removeListener).toHaveBeenCalledWith('popstate', expect.any(Function));
    });
});
