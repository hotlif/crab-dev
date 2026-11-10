import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, renderHook } from '@crab-dev/wake/test/react';
import { useDiagramInteraction } from '../hooks/useDiagramInteraction.js';

describe('diagram interaction transaction', () => {
    it('keeps previews out of persistence and commits the latest pointer value exactly once', async () => {
        const commit = mock.fn();
        const view = await renderHook(() => useDiagramInteraction<number>({ revision: 'document:1', onCommit: commit }));
        await act(async () => { view.result.current.begin(1); view.result.current.update(2); view.result.current.update(3); });
        expect(commit.calls.calls.length).toBe(0);
        await act(async () => { view.result.current.commit(4); view.result.current.commit(5); });
        expect(commit.calls.calls).toEqual([[4]]);
        expect(view.result.current.value).toBeNull();
    });
    it('cancels stale documents, readonly and inactive workspaces without committing', async () => {
        const commit = mock.fn(), cancel = mock.fn();
        const visible: Array<{ revision: string; value: number | null }> = [];
        const view = await renderHook((props: { revision: string; disabled: boolean; active: boolean }) => {
            const interaction = useDiagramInteraction<number>({ ...props, onCommit: commit, onCancel: cancel });
            visible.push({ revision: props.revision, value: interaction.value });
            return interaction;
        },
            { initialProps: { revision: 'a', disabled: false, active: true } });
        await act(async () => { view.result.current.begin(1); });
        await view.rerender({ revision: 'b', disabled: false, active: true });
        expect(visible.filter(frame => frame.revision === 'b').every(frame => frame.value === null)).toBe(true);
        await act(async () => { view.result.current.commit(); view.result.current.begin(2); });
        await view.rerender({ revision: 'b', disabled: true, active: true });
        await view.rerender({ revision: 'b', disabled: false, active: true });
        await act(async () => { view.result.current.begin(3); });
        await view.rerender({ revision: 'b', disabled: false, active: false });
        expect(commit.calls.calls.length).toBe(0);
        expect(cancel.calls.calls).toEqual([[1, 'revision'], [2, 'disabled'], [3, 'inactive']]);
    });
    it('cancels on Escape, window blur and unmount, with no duplicate cancellation', async () => {
        const cancel = mock.fn();
        const view = await renderHook(() => useDiagramInteraction<number>({ revision: 1, onCancel: cancel }));
        await act(async () => { view.result.current.begin(1); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); });
        await act(async () => { view.result.current.begin(2); window.dispatchEvent(new Event('blur')); view.result.current.cancel(); });
        await act(async () => { view.result.current.begin(3); });
        await view.unmount();
        expect(cancel.calls.calls).toEqual([[1, 'escape'], [2, 'blur'], [3, 'unmount']]);
    });
});
