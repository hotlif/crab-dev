import type { ReactNode } from 'react';
import ActionButton from './action-button.js';
import { headingStyle, panelHeaderStyle } from './styles.js';

interface PanelHeaderProps {
    title: ReactNode;
    panel: 'pages' | 'properties';
    onClose: () => void;
}

export default function PanelHeader({ title, panel, onClose }: PanelHeaderProps) {
    return <div className={panelHeaderStyle}>
        <h2 className={headingStyle}>{title}</h2>
        <ActionButton action={panel === 'pages' ? 'closePages' : 'closeProperties'} onClick={onClose} />
    </div>;
}
