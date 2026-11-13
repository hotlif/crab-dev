/** Same-document history model; real POP timing is also tested in Chromium. */
export function createTestWindow(pathname = '/'): Window {
    const entries = [{ url: new URL(`https://router.test${pathname}`), state: null as unknown }];
    let index = 0;
    const events = new EventTarget();
    const history = {
        get state(): unknown { return entries[index].state; },
        get length(): number { return entries.length; },
        pushState(state: unknown, _unused: string, url?: string | URL | null): void {
            const nextUrl = new URL(String(url ?? entries[index].url), entries[index].url);
            entries.splice(index + 1, entries.length, { url: nextUrl, state });
            index += 1;
        },
        replaceState(state: unknown, _unused: string, url?: string | URL | null): void {
            entries[index] = { url: url == null ? entries[index].url : new URL(String(url), entries[index].url), state };
        },
        go(delta: number): void {
            queueMicrotask(() => {
                const next = index + delta;
                if (next < 0 || next >= entries.length || next === index) return;
                index = next;
                events.dispatchEvent(new PopStateEvent('popstate', { state: entries[index].state }));
            });
        },
    } as History;
    return {
        history,
        get location(): Location { return entries[index].url as unknown as Location; },
        addEventListener: events.addEventListener.bind(events),
        removeEventListener: events.removeEventListener.bind(events),
        dispatchEvent: events.dispatchEvent.bind(events),
    } as unknown as Window;
}
