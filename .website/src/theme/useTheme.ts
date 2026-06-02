import { useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "crab-dev:theme";

export type Theme = "light" | "dark";

const getInitial = (): Theme => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

// Module-level singleton store so every useTheme() consumer (header, markdown,
// demo gallery, ...) stays in sync after a toggle without page reload.
let currentTheme: Theme = getInitial();
const listeners = new Set<() => void>();

const applyTheme = (next: Theme): void => {
    if (typeof document !== "undefined") {
        document.documentElement.dataset.theme = next;
    }
    try {
        window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
        // ignore quota / private mode
    }
};

const setThemeInternal = (next: Theme): void => {
    if (next === currentTheme) return;
    currentTheme = next;
    applyTheme(next);
    listeners.forEach(l => l());
};

const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

const getSnapshot = (): Theme => currentTheme;
const getServerSnapshot = (): Theme => "light";

if (typeof window !== "undefined") {
    // Apply the initial theme to <html data-theme> on first import so SSR-less
    // hydration matches the localStorage / system preference.
    applyTheme(currentTheme);

    // Cross-tab sync: react to other tabs writing to the same storage key.
    window.addEventListener("storage", (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY) return;
        const next = event.newValue;
        if (next === "light" || next === "dark") {
            setThemeInternal(next);
        }
    });
}

export const useTheme = () => {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const setTheme = useCallback((next: Theme) => {
        setThemeInternal(next);
    }, []);

    const toggle = useCallback(() => {
        setThemeInternal(currentTheme === "light" ? "dark" : "light");
    }, []);

    // Keep the previous "applied on mount" semantics for safety, even though
    // the module-level init already handled it.
    useEffect(() => {
        applyTheme(currentTheme);
    }, []);

    return { theme, setTheme, toggle };
};
