import type { ReactNode } from 'react';

export default function Preview({ children }: { children: ReactNode }) {
    return <div className="rc-button-console-preview">{children}</div>;
}
