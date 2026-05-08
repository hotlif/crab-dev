import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "crab-dev:theme";

export type Theme = "light" | "dark";

const getInitial = (): Theme => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(getInitial);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        try {
            window.localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // ignore quota / private mode
        }
    }, [theme]);

    const toggle = useCallback(() => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    }, []);

    return { theme, setTheme, toggle };
};
