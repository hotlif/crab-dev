import { afterAll, beforeAll } from '@crab-dev/wake/test';
import type { ConfigDesignSystem } from '@crab-dev/rc-config-provider';
import { Temporal as TemporalPolyfill } from '@js-temporal/polyfill';
import { testDialLabels } from './dial-labels.js';
import { testFieldPosition } from './field-position.js';
import { testViewportFallback } from './viewport-fallback.js';

// Wake shards files. Each design entry runs all three published-browser suites.
export function testPublishedPicker(designSystem: ConfigDesignSystem) {
    const temporalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'Temporal');
    beforeAll(() => {
        if (!temporalDescriptor) Object.defineProperty(globalThis, 'Temporal', { value: TemporalPolyfill, configurable: true });
    });
    afterAll(() => {
        if (!temporalDescriptor) Reflect.deleteProperty(globalThis, 'Temporal');
    });

    testDialLabels(designSystem);
    testFieldPosition(designSystem);
    testViewportFallback(designSystem);
}
