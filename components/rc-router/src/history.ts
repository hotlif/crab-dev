import { createPath } from './path.js';
import type { Location, NavigationType, Path } from './types.js';

interface StoredHistoryState {
    __crabRouter: true;
    key: string;
    state: unknown;
}

export interface HistorySnapshot {
    action: NavigationType;
    location: Location;
}

export interface BrowserHistory {
    getSnapshot: () => HistorySnapshot;
    listen: (listener: (snapshot: HistorySnapshot) => void) => () => void;
    push: (path: Path, state?: unknown) => void;
    replace: (path: Path, state?: unknown) => void;
    go: (delta: number) => void;
    createHref: (path: Path) => string;
    window: Window;
}

function createKey(): string {
    return Math.random().toString(36).slice(2, 10);
}

function isStoredHistoryState(value: unknown): value is StoredHistoryState {
    return (
        typeof value === 'object' &&
        value !== null &&
        '__crabRouter' in value &&
        value.__crabRouter === true &&
        'key' in value &&
        typeof value.key === 'string'
    );
}

function readLocation(targetWindow: Window): Location {
    const rawState: unknown = targetWindow.history.state;
    const storedState = isStoredHistoryState(rawState) ? rawState : null;
    return {
        pathname: targetWindow.location.pathname,
        search: targetWindow.location.search,
        hash: targetWindow.location.hash,
        state: storedState?.state ?? rawState,
        key: storedState?.key ?? 'default',
    };
}

export function createBrowserHistory(targetWindow: Window): BrowserHistory {
    let snapshot: HistorySnapshot = {
        action: 'POP',
        location: readLocation(targetWindow),
    };
    const listeners = new Set<(nextSnapshot: HistorySnapshot) => void>();

    const notify = (action: NavigationType): void => {
        snapshot = {
            action,
            location: readLocation(targetWindow),
        };
        for (const listener of listeners) {
            listener(snapshot);
        }
    };

    const handlePopState = (): void => {
        notify('POP');
    };
    const write = (
        action: 'PUSH' | 'REPLACE',
        path: Path,
        state?: unknown,
    ): void => {
        const storedState: StoredHistoryState = {
            __crabRouter: true,
            key: createKey(),
            state,
        };
        if (action === 'PUSH') {
            targetWindow.history.pushState(storedState, '', createPath(path));
        } else {
            targetWindow.history.replaceState(storedState, '', createPath(path));
        }
        notify(action);
    };

    return {
        getSnapshot: () => snapshot,
        listen(listener) {
            if (listeners.size === 0) {
                targetWindow.addEventListener('popstate', handlePopState);
            }
            listeners.add(listener);
            listener(snapshot);
            return () => {
                listeners.delete(listener);
                if (listeners.size === 0) {
                    targetWindow.removeEventListener('popstate', handlePopState);
                }
            };
        },
        push: (path, state) => write('PUSH', path, state),
        replace: (path, state) => write('REPLACE', path, state),
        go: (delta) => targetWindow.history.go(delta),
        createHref: createPath,
        window: targetWindow,
    };
}
