import { createContext } from 'react';
import { DEFAULT_FLOW_DIAGRAM_PALETTE, type FlowDiagramPalette } from './palette.js';

export const FlowDiagramPaletteContext = createContext<FlowDiagramPalette>(
    DEFAULT_FLOW_DIAGRAM_PALETTE,
);
