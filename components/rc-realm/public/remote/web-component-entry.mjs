import { createLifecycle } from './web-component.mjs';

export function init() {}
export async function get(moduleId) {
    if (moduleId !== './WebComponent') throw new Error(`Unknown remote module: ${moduleId}`);
    return () => ({ default: createLifecycle() });
}
