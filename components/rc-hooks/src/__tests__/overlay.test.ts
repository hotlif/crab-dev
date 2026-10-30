import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { acquireScrollLock, registerOverlayLayer, resolveOverlayRoot } from '../overlay.js';
import { getComposedParentElement } from '../composed-tree.js';

describe('composed element ancestry', () => {
    it('stops at ordinary detached elements and document fragments without a host', () => {
        const parent = document.createElement('div'), child = document.createElement('span');
        parent.append(child);
        expect(getComposedParentElement(child)).toBe(parent);
        const detached = document.createElement('div');
        expect(getComposedParentElement(detached)).toBe(null);
        const fragment = document.createDocumentFragment(); fragment.append(detached);
        expect(getComposedParentElement(detached)).toBe(null);
        expect(getComposedParentElement(document.documentElement)).toBe(null);
    });
});

describe('document overlay coordination', () => {
    it('holds the original scroll lock until every out-of-order owner releases', () => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'clip';
        const first = acquireScrollLock(document);
        const second = acquireScrollLock(document.body);
        try {
            expect(document.body.style.overflow).toBe('hidden');
            first();
            first();
            expect(document.body.style.overflow).toBe('hidden');
            second();
            expect(document.body.style.overflow).toBe('clip');
        } finally {
            first(); second(); document.body.style.overflow = previous;
        }
    });
    it('routes Escape only to the top layer even when a parent registers later', () => {
        const parent = document.createElement('div');
        const child = document.createElement('div');
        parent.append(child); document.body.append(parent);
        const outer = mock.fn(); const inner = mock.fn();
        const childLayer = registerOverlayLayer(child, inner);
        const parentLayer = registerOverlayLayer(parent, outer);
        try {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
            expect(inner).toHaveBeenCalledTimes(1); expect(outer).not.toHaveBeenCalled();
            childLayer.release();
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
            expect(outer).toHaveBeenCalledTimes(1);
        } finally { childLayer.release(); parentLayer.release(); parent.remove(); }
    });
    it('isolates layers and scroll locks in another ownerDocument', () => {
        const other = document.implementation.createHTMLDocument('frame');
        const first = document.createElement('div'); const second = other.createElement('div');
        document.body.append(first); other.body.append(second);
        const firstEscape = mock.fn(); const secondEscape = mock.fn();
        const firstLayer = registerOverlayLayer(first, firstEscape);
        const secondLayer = registerOverlayLayer(second, secondEscape);
        const unlock = acquireScrollLock(other);
        const previous = document.body.style.overflow;
        try {
            other.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
            expect(secondEscape).toHaveBeenCalledTimes(1); expect(firstEscape).not.toHaveBeenCalled();
            expect(other.body.style.overflow).toBe('hidden'); expect(document.body.style.overflow).toBe(previous);
            expect(resolveOverlayRoot(second)).toBe(other.body);
        } finally { unlock(); firstLayer.release(); secondLayer.release(); first.remove(); }
        expect(other.body.style.overflow).toBe('');
    });
    it('restores focus to a connected opener and preserves a deliberate focus move', () => {
        const opener = document.createElement('button'); const panel = document.createElement('div');
        const inside = document.createElement('button'); const elsewhere = document.createElement('button');
        panel.append(inside); document.body.append(opener, panel, elsewhere);
        try {
            opener.focus(); const layer = registerOverlayLayer(panel); inside.focus(); layer.release();
            expect(document.activeElement).toBe(opener);
            const second = registerOverlayLayer(panel); elsewhere.focus(); second.release();
            expect(document.activeElement).toBe(elsewhere);
        } finally { opener.remove(); panel.remove(); elsewhere.remove(); }
    });
    it('keeps modal content inside its interactive owner and reuses its nearest theme', () => {
        const dialog = document.createElement('dialog'); const boundary = document.createElement('div');
        const trigger = document.createElement('button'); boundary.dataset.theme = 'dark';
        boundary.append(trigger); dialog.append(boundary); document.body.append(dialog);
        try { expect(resolveOverlayRoot(trigger)).toBe(boundary); boundary.removeAttribute('data-theme'); expect(resolveOverlayRoot(trigger)).toBe(dialog); }
        finally { dialog.remove(); }
    });
});

describe('overlay focus initiators', () => {
    it('uses the explicit trigger when panel autofocus runs before passive registration', () => {
        const trigger = document.createElement('button'); const panel = document.createElement('div'); const item = document.createElement('button');
        panel.append(item); document.body.append(trigger, panel);
        try {
            trigger.focus(); item.focus();
            const layer = registerOverlayLayer(panel, undefined, trigger);
            panel.remove(); layer.release();
            expect(document.activeElement).toBe(trigger);
        } finally { trigger.remove(); panel.remove(); }
    });
});

describe('shadow tree realms', () => {
    it('keeps overlays inside their shadow tree and returns focus to a deep trigger', () => {
        const host = document.createElement('div'); document.body.append(host);
        const shadow = host.attachShadow({ mode: 'open' });
        const trigger = document.createElement('button'); const panel = document.createElement('div'); const item = document.createElement('button');
        panel.append(item); shadow.append(trigger, panel);
        try {
            expect(resolveOverlayRoot(trigger)).toBe(shadow);
            trigger.focus(); const layer = registerOverlayLayer(panel); item.focus(); layer.release();
            expect(shadow.activeElement).toBe(trigger);
        } finally { host.remove(); }
    });

    it('restores a deep trigger after the focused shadow panel was removed', () => {
        const host = document.createElement('div'); document.body.append(host);
        const shadow = host.attachShadow({ mode: 'open' });
        const trigger = document.createElement('button'); const panel = document.createElement('div'); const item = document.createElement('button');
        panel.append(item); shadow.append(trigger, panel);
        const layer = registerOverlayLayer(panel, undefined, trigger);
        try {
            item.focus(); panel.remove();
            expect(shadow.activeElement).toBe(null);
            layer.release();
            expect(shadow.activeElement).toBe(trigger);
        } finally { layer.release({ restoreFocus: false }); host.remove(); }
    });

    it('preserves the registered root chain when an inner shadow host is removed', () => {
        const host = document.createElement('div'); document.body.append(host);
        const shadow = host.attachShadow({ mode: 'open' });
        const trigger = document.createElement('button'); const innerHost = document.createElement('div');
        shadow.append(trigger, innerHost);
        const inner = innerHost.attachShadow({ mode: 'open' });
        const panel = document.createElement('div'); const item = document.createElement('button'); panel.append(item); inner.append(panel);
        const layer = registerOverlayLayer(panel, undefined, trigger);
        try {
            item.focus(); innerHost.remove();
            expect(shadow.activeElement).toBe(null);
            layer.release();
            expect(shadow.activeElement).toBe(trigger);
        } finally { layer.release({ restoreFocus: false }); host.remove(); }
    });

    for (const [attribute, value] of [['tabindex', '0'], ['contenteditable', 'true']]) {
        it(`preserves an explicitly focused shadow host with ${attribute}`, () => {
            const host = document.createElement('div'); host.setAttribute(attribute, value); document.body.append(host);
            const shadow = host.attachShadow({ mode: 'open' });
            const trigger = document.createElement('button'); const panel = document.createElement('div'); const item = document.createElement('button');
            panel.append(item); shadow.append(trigger, panel);
            const layer = registerOverlayLayer(panel, undefined, trigger);
            try {
                item.focus(); panel.remove(); host.focus();
                expect(document.activeElement).toBe(host);
                expect(shadow.activeElement).toBe(null);
                layer.release();
                expect(document.activeElement).toBe(host);
                expect(shadow.activeElement).toBe(null);
            } finally { layer.release({ restoreFocus: false }); host.remove(); }
        });
    }

    it('does not restore across an unrelated empty shadow host', () => {
        const host = document.createElement('div'); const externalHost = document.createElement('div'); document.body.append(host, externalHost);
        const shadow = host.attachShadow({ mode: 'open' }); const external = externalHost.attachShadow({ mode: 'open' });
        const trigger = document.createElement('button'); const panel = document.createElement('div'); const item = document.createElement('button');
        const other = document.createElement('button'); panel.append(item); shadow.append(trigger, panel); external.append(other);
        const layer = registerOverlayLayer(panel, undefined, trigger);
        const descriptor = Object.getOwnPropertyDescriptor(document, 'activeElement');
        let patched = false;
        try {
            item.focus(); other.focus(); other.remove(); panel.remove();
            // The DOM host returns body on removal. Chromium retains the empty
            // shadow host; supply only this missing platform read in DOM mode.
            if (document.activeElement === document.body) {
                Object.defineProperty(document, 'activeElement', { configurable: true, get: () => externalHost });
                patched = true;
            }
            expect(document.activeElement).toBe(externalHost);
            layer.release();
            expect(document.activeElement).toBe(externalHost);
            expect(shadow.activeElement).toBe(null);
        } finally {
            layer.release({ restoreFocus: false });
            if (patched) {
                if (descriptor) Object.defineProperty(document, 'activeElement', descriptor);
                else Reflect.deleteProperty(document, 'activeElement');
            }
            host.remove(); externalHost.remove();
        }
    });
});
