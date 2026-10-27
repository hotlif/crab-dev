import type { TooltipProps } from '../types.js';
import { createElement } from 'react';
const children = createElement('button');
export const readOnlyTooltip: TooltipProps = { open: true, title: 'Snapshot', children };
// @ts-expect-error Controlled and initial open values are mutually exclusive.
export const conflictingTooltip: TooltipProps = { open: true, defaultOpen: false, title: 'Snapshot', children };
