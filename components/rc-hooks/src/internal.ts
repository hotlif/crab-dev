/** Internal coordination shared by Crab components; excluded from the stable public API. */
export { acquireScrollLock, registerOverlayLayer, resolveOverlayRoot } from './overlay.js';
export type { OverlayLayer } from './overlay.js';
export { useFieldA11y } from './useFieldA11y.js';
export { useDevicePixelRatio } from './useDevicePixelRatio.js';
export { getComposedParentElement } from './composed-tree.js';
