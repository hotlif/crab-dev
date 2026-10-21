import type { ReactElement, ReactNode } from "react";

export interface WorkbenchPreviewProps {
    readonly children: ReactNode;
    readonly className?: string;
}

export default function WorkbenchPreview(props: WorkbenchPreviewProps): ReactElement;
