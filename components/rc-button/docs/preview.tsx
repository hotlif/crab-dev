import type { ReactNode } from 'react';
import WorkbenchPreview from '../../../.website/docs/site/workbenchPreview.js';

export default function Preview({ children }: { children: ReactNode }) {
    return <WorkbenchPreview className="rc-button-console-preview">{children}</WorkbenchPreview>;
}
