import { createContext } from "react";

const recoveryKey = "crab-docs-retry-focus";

export function rememberDocumentRecovery(slug: string) {
    try { window.sessionStorage.setItem(recoveryKey, slug); }
    catch { /* The framework retry remains usable without browser storage. */ }
}

export function consumeDocumentRecovery(): string | null {
    try {
        const slug = window.sessionStorage.getItem(recoveryKey);
        window.sessionStorage.removeItem(recoveryKey);
        return slug;
    } catch { return null; }
}

export const DocumentRecoveryContext = createContext<{
    request(): void;
    complete(slug: string, heading: HTMLElement | null): void;
} | null>(null);
