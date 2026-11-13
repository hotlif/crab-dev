import { createPath } from './path.js';
import type { Blocker, BlockerFunction, BlockerFunctionArgs, Location, NavigationType, Path } from './types.js';

interface StoredHistoryState {
    __crabRouter: true;
    key: string;
    state: unknown;
    index?: number;
    session?: string;
}

export interface HistorySnapshot {
    action: NavigationType;
    location: Location;
}

interface BlockerRegistration {
    shouldBlock: BlockerFunction;
    update: (blocker: Blocker) => void;
}

interface PendingNavigation {
    location: Location;
    participants: BlockerRegistration[];
    active: number;
    phase: 'restoring' | 'blocked' | 'proceeding';
    commit: () => void;
}

export interface BrowserHistory {
    getSnapshot: () => HistorySnapshot;
    listen: (listener: (snapshot: HistorySnapshot) => void) => () => void;
    block: (shouldBlock: BlockerFunction, update: (blocker: Blocker) => void) => () => void;
    push: (path: Path, state?: unknown, onCommit?: () => void) => void;
    replace: (path: Path, state?: unknown, onCommit?: () => void) => void;
    go: (delta: number) => void;
    createHref: (path: Path) => string;
    window: Window;
}

function createKey(): string {
    return Math.random().toString(36).slice(2, 10);
}

function isStoredHistoryState(value: unknown): value is StoredHistoryState {
    return (
        typeof value === 'object' && value !== null &&
        '__crabRouter' in value && value.__crabRouter === true &&
        'key' in value && typeof value.key === 'string'
    );
}

function readLocation(targetWindow: Window): Location {
    const rawState: unknown = targetWindow.history.state;
    const storedState = isStoredHistoryState(rawState) ? rawState : null;
    return {
        pathname: targetWindow.location.pathname,
        search: targetWindow.location.search,
        hash: targetWindow.location.hash,
        state: storedState === null ? rawState : storedState.state,
        key: storedState?.key ?? 'default',
    };
}

export function createBrowserHistory(targetWindow: Window): BrowserHistory {
    let snapshot: HistorySnapshot = { action: 'POP', location: readLocation(targetWindow) };
    const listeners = new Set<(nextSnapshot: HistorySnapshot) => void>();
    const blockers = new Set<BlockerRegistration>();
    let session = createKey();
    let index = 0;
    let initialized = false;
    let listening = false;
    let restoring = false;
    let afterRestore: (() => void) | null = null;
    let pending: PendingNavigation | null = null;

    // Initialization is deferred to subscription/navigation, never React render.
    const initialize = (): void => {
        if (initialized) return;
        const raw: unknown = targetWindow.history.state;
        if (isStoredHistoryState(raw) && Number.isInteger(raw.index) && typeof raw.session === 'string') {
            index = raw.index!;
            session = raw.session;
        } else {
            targetWindow.history.replaceState({
                __crabRouter: true, key: snapshot.location.key,
                state: snapshot.location.state, index, session,
            } satisfies StoredHistoryState, '');
        }
        initialized = true;
    };

    const notify = (action: NavigationType): void => {
        snapshot = { action, location: readLocation(targetWindow) };
        for (const listener of listeners) listener(snapshot);
    };

    const clearPending = (): void => {
        const previous = pending;
        pending = null;
        afterRestore = null;
        previous?.participants.forEach((entry) => {
            if (blockers.has(entry)) entry.update({ state: 'unblocked' });
        });
    };

    const showBlocker = (navigation: PendingNavigation): void => {
        if (pending !== navigation) return;
        const active = navigation.active;
        if (active === navigation.participants.length) {
            navigation.phase = 'proceeding';
            try {
                navigation.commit();
            } catch (error) {
                clearPending();
                throw error;
            }
            return;
        }
        navigation.phase = 'blocked';
        const entry = navigation.participants[active];
        const proceed = (): void => {
            if (pending !== navigation || navigation.phase !== 'blocked' || navigation.active !== active) return;
            if (restoring) {
                afterRestore = proceed;
                return;
            }
            entry.update({ state: 'proceeding', location: navigation.location });
            navigation.active += 1;
            showBlocker(navigation);
        };
        entry.update({
            state: 'blocked', location: navigation.location,
            proceed,
            reset: () => {
                if (pending === navigation && navigation.phase === 'blocked' && navigation.active === active) clearPending();
            },
        });
    };

    const prepare = (args: BlockerFunctionArgs, commit: () => void): PendingNavigation | null => {
        const participants = [...blockers].filter((entry) => entry.shouldBlock(args));
        if (participants.length === 0) return null;
        pending = { location: args.nextLocation, participants, active: 0, phase: 'restoring', commit };
        return pending;
    };

    const handlePopState = (): void => {
        const raw: unknown = targetWindow.history.state;
        const nextLocation = readLocation(targetWindow);
        if (!isStoredHistoryState(raw) || raw.session !== session || !Number.isInteger(raw.index)) {
            // Foreign history entries cannot be reliably reversed. Adopt a new
            // indexed segment; applications must use Router navigation APIs.
            clearPending();
            restoring = false;
            initialized = false;
            session = createKey();
            index = 0;
            snapshot = { action: 'POP', location: nextLocation };
            initialize();
            notify('POP');
            return;
        }
        const nextIndex = raw.index!;
        const delta = nextIndex - index;
        if (restoring) {
            if (delta !== 0) {
                targetWindow.history.go(-delta);
            } else {
                restoring = false;
                if (pending?.phase === 'restoring') showBlocker(pending);
                const resume = afterRestore;
                afterRestore = null;
                resume?.();
            }
            return;
        }
        if (pending?.phase === 'proceeding' && nextLocation.key === pending.location.key) {
            index = nextIndex;
            notify('POP');
            clearPending();
            return;
        }
        if (pending !== null) {
            // Keep the first navigation intent while a confirmation is active.
            if (delta !== 0) {
                restoring = true;
                targetWindow.history.go(-delta);
            }
            return;
        }
        const commit = (): void => {
            targetWindow.history.go(delta);
        };
        const navigation = delta === 0 ? null : prepare({
            currentLocation: snapshot.location, nextLocation, historyAction: 'POP',
        }, commit);
        if (navigation !== null) {
            restoring = true;
            targetWindow.history.go(-delta);
        } else {
            index = nextIndex;
            notify('POP');
        }
    };

    const syncListener = (): void => {
        const required = listeners.size > 0 || blockers.size > 0;
        if (required && !listening) targetWindow.addEventListener('popstate', handlePopState);
        if (!required && listening) targetWindow.removeEventListener('popstate', handlePopState);
        listening = required;
    };

    const write = (action: 'PUSH' | 'REPLACE', path: Path, state?: unknown, onCommit?: () => void): void => {
        initialize();
        if (pending !== null || restoring) return;
        const nextLocation: Location = { ...path, state, key: createKey() };
        const commit = (): void => {
            const nextIndex = action === 'PUSH' ? index + 1 : index;
            const storedState: StoredHistoryState = {
                __crabRouter: true, key: nextLocation.key, state, index: nextIndex, session,
            };
            if (action === 'PUSH') targetWindow.history.pushState(storedState, '', createPath(path));
            else targetWindow.history.replaceState(storedState, '', createPath(path));
            index = nextIndex;
            notify(action);
            onCommit?.();
            clearPending();
        };
        const navigation = prepare({ currentLocation: snapshot.location, nextLocation, historyAction: action }, commit);
        if (navigation === null) commit();
        else showBlocker(navigation);
    };

    return {
        getSnapshot: () => snapshot,
        listen(listener) {
            initialize();
            listeners.add(listener);
            syncListener();
            listener(snapshot);
            return () => {
                listeners.delete(listener);
                syncListener();
            };
        },
        block(shouldBlock, update) {
            initialize();
            const entry = { shouldBlock, update };
            blockers.add(entry);
            syncListener();
            return () => {
                blockers.delete(entry);
                if (pending?.participants.includes(entry)) clearPending();
                syncListener();
            };
        },
        push: (path, state, onCommit) => write('PUSH', path, state, onCommit),
        replace: (path, state, onCommit) => write('REPLACE', path, state, onCommit),
        go: (delta) => {
            initialize();
            if (pending === null && !restoring) targetWindow.history.go(delta);
        },
        createHref: createPath,
        window: targetWindow,
    };
}
