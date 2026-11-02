import { expect, it } from '@crab-dev/wake/test';
import { focusedPanel, returnPanelFocus } from '../panel-focus.js';

for (const kind of ['document', 'shadow', 'iframe-shadow'] as const) {
    it(`returns panel focus within the actual ${kind} editor and preserves outside focus`, async () => {
        let frame: HTMLIFrameElement | undefined;
        let owner = document;
        if (kind === 'iframe-shadow') {
            frame = document.createElement('iframe');
            const loaded = new Promise<void>(resolve => frame!.addEventListener('load', () => resolve(), { once: true }));
            document.body.append(frame);
            await loaded;
            owner = frame.contentDocument!;
        }
        const host = owner.createElement('div');
        owner.body.append(host);
        const scope = kind === 'document' ? host : host.attachShadow({ mode: 'open' });
        const root = owner.createElement('section');
        const trigger = owner.createElement('button'); trigger.id = 'panel-toggle'; trigger.textContent = 'Properties';
        const panel = owner.createElement('aside'); panel.id = 'panel';
        const input = owner.createElement('input'); panel.append(input);
        const canvas = owner.createElement('div'); canvas.id = 'canvas'; canvas.tabIndex = 0;
        root.append(trigger, panel, canvas); scope.append(root);
        const outside = owner.createElement('input'); scope.append(outside);
        try {
            input.focus();
            expect(focusedPanel(root, ['panel'])).toBe('panel');
            returnPanelFocus(root, 'panel', 'canvas');
            expect(trigger.matches(':focus')).toBe(true);
            expect(trigger.hasAttribute('data-pdf-focus-return')).toBe(true);
            trigger.dispatchEvent(new Event('pointerdown'));
            expect(trigger.hasAttribute('data-pdf-focus-return')).toBe(false);
            input.focus(); trigger.disabled = true;
            returnPanelFocus(root, 'panel', 'canvas');
            expect(canvas.matches(':focus')).toBe(true);
            expect(canvas.hasAttribute('data-pdf-focus-return')).toBe(true);
            trigger.remove(); input.focus();
            expect(canvas.hasAttribute('data-pdf-focus-return')).toBe(false);
            returnPanelFocus(root, 'panel', 'canvas');
            expect(canvas.matches(':focus')).toBe(true);
            outside.focus();
            expect(focusedPanel(root, ['panel'])).toBe(undefined);
            expect(outside.matches(':focus')).toBe(true);
            returnPanelFocus(root, undefined, 'canvas');
            expect(canvas.matches(':focus')).toBe(true);
        } finally { host.remove(); frame?.remove(); }
    });
}
