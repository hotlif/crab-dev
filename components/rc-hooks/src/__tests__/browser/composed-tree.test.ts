import { describe, expect, it } from '@crab-dev/wake/test';
import { getComposedParentElement } from '../../composed-tree.js';
import { registerOverlayLayer } from '../../overlay.js';

// Slot assignment and iframe realms are native platform behavior. Wake's
// lightweight DOM intentionally supplies neither; keep these real regressions
// in the registered browser check rather than patching or skipping the APIs.
describe('native composed element ancestry', () => {
    it('follows assigned slots before the light DOM parent and crosses the shadow host', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const wrapper = document.createElement('section');
        const slot = document.createElement('slot');
        const trigger = document.createElement('button');
        wrapper.append(slot); root.append(wrapper); host.append(trigger); document.body.append(host);
        try {
            expect(trigger.assignedSlot).toBe(slot);
            expect(getComposedParentElement(trigger)).toBe(slot);
            expect(getComposedParentElement(slot)).toBe(wrapper);
            expect(getComposedParentElement(wrapper)).toBe(host);
            expect(getComposedParentElement(host)).toBe(document.body);
        } finally { host.remove(); }
    });

    it('crosses an actual foreign iframe ShadowRoot', () => {
        const frame = document.createElement('iframe'); document.body.append(frame);
        try {
            const owner = frame.contentDocument;
            if (!owner) throw new Error('An initialized iframe document is required');
            const host = owner.createElement('div'); owner.body.append(host);
            const root = host.attachShadow({ mode: 'open' });
            const child = owner.createElement('span'); root.append(child);
            expect(root instanceof ShadowRoot).toBe(false);
            expect(getComposedParentElement(child)).toBe(host);
            expect(getComposedParentElement(host)).toBe(owner.body);
        } finally { frame.remove(); }
    });

    it('does not restore focus to a slotted trigger in an inert rendered ancestor', () => {
        const host = document.createElement('div'); document.body.append(host);
        const root = host.attachShadow({ mode: 'open' });
        const blocked = document.createElement('section'); blocked.setAttribute('inert', '');
        const slot = document.createElement('slot'); blocked.append(slot); root.append(blocked);
        const trigger = document.createElement('button'); host.append(trigger);
        const panel = document.createElement('div'), item = document.createElement('button');
        panel.append(item); document.body.append(panel);
        const layer = registerOverlayLayer(panel, undefined, trigger);
        try {
            item.focus();
            expect(document.activeElement).toBe(item);
            panel.remove(); layer.release();
            expect(document.activeElement).toBe(document.body);
            expect(root.activeElement).toBe(null);
            expect(trigger.matches(':focus')).toBe(false);
        } finally { layer.release({ restoreFocus: false }); host.remove(); panel.remove(); }
    });
});
