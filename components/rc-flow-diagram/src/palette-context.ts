import { createContext } from 'react';
import { SEMANTIC_FLOW_DIAGRAM_PALETTE, type FlowDiagramPalette } from './palette.js';

export const FlowDiagramPaletteContext = createContext<FlowDiagramPalette>(
    SEMANTIC_FLOW_DIAGRAM_PALETTE,
);
