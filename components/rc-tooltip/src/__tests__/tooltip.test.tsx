import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import Tooltip from '../tooltip.js';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

describe('Tooltip', () => {
    // ─── 基础渲染 ──────────────────────────────────────────────────────────

    it('renders trigger element', () => {
        render(
            <Tooltip title="提示">
                <button>触发</button>
            </Tooltip>,
        );
        expect(screen.getByRole('button', { name: '触发' })).toBeTruthy();
    });

    it('does not show tooltip by default', () => {
        render(
            <Tooltip title="提示">
                <button>触发</button>
            </Tooltip>,
        );
        expect(screen.queryByRole('tooltip')).toBeNull();
    });

    // ─── 受控模式 ──────────────────────────────────────────────────────────

    it('shows tooltip when open is true', () => {
        render(
            <Tooltip title="受控提示" open>
                <button>触发</button>
            </Tooltip>,
        );
        expect(screen.getByRole('tooltip')).toBeTruthy();
        expect(screen.getByText('受控提示')).toBeTruthy();
    });

    it('hides tooltip when open is false', () => {
        render(
            <Tooltip title="受控提示" open={false}>
                <button>触发</button>
            </Tooltip>,
        );
        expect(screen.queryByRole('tooltip')).toBeNull();
    });

    it('supports defaultOpen', () => {
        render(
            <Tooltip title="默认显示" defaultOpen>
                <button>触发</button>
            </Tooltip>,
        );
        expect(screen.getByRole('tooltip')).toBeTruthy();
        expect(screen.getByText('默认显示')).toBeTruthy();
    });

    // ─── 交互触发 ──────────────────────────────────────────────────────────

    it('shows tooltip on pointer enter', () => {
        render(
            <Tooltip title="悬浮提示" mouseEnterDelay={0} mouseLeaveDelay={0}>
                <button>触发</button>
            </Tooltip>,
        );
        const trigger = screen.getByRole('button');
        act(() => {
            fireEvent.mouseEnter(trigger);
        });
        expect(screen.getByRole('tooltip')).toBeTruthy();
        expect(screen.getByText('悬浮提示')).toBeTruthy();
    });

    it('shows tooltip on focus', () => {
        render(
            <Tooltip title="聚焦提示" mouseEnterDelay={0} mouseLeaveDelay={0}>
                <button>触发</button>
            </Tooltip>,
        );
        act(() => {
            fireEvent.focus(screen.getByRole('button'));
        });
        expect(screen.getByRole('tooltip')).toBeTruthy();
        expect(screen.getByText('聚焦提示')).toBeTruthy();
    });

    it('calls onOpenChange when tooltip opens via focus', () => {
        const handleOpenChange = jest.fn();
        render(
            <Tooltip title="提示" mouseEnterDelay={0} onOpenChange={handleOpenChange}>
                <button>触发</button>
            </Tooltip>,
        );
        act(() => {
            fireEvent.focus(screen.getByRole('button'));
        });
        expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    it('calls onOpenChange when tooltip closes via escape', () => {
        const handleOpenChange = jest.fn();
        render(
            <Tooltip title="提示" mouseEnterDelay={0} onOpenChange={handleOpenChange}>
                <button>触发</button>
            </Tooltip>,
        );
        act(() => {
            fireEvent.focus(screen.getByRole('button'));
        });
        expect(handleOpenChange).toHaveBeenCalledWith(true);

        handleOpenChange.mockClear();
        act(() => {
            fireEvent.keyDown(document, { key: 'Escape' });
        });
        expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    // ─── 空内容 ────────────────────────────────────────────────────────────

    it('does not show tooltip when title is empty string', () => {
        render(
            <Tooltip title="" open>
                <button>触发</button>
            </Tooltip>,
        );
        expect(screen.queryByRole('tooltip')).toBeNull();
    });

    it('does not show tooltip when title is null', () => {
        render(
            <Tooltip title={null as unknown as string} open>
                <button>触发</button>
            </Tooltip>,
        );
        expect(screen.queryByRole('tooltip')).toBeNull();
    });

    // ─── 箭头 ──────────────────────────────────────────────────────────────

    it('renders arrow by default', () => {
        render(
            <Tooltip title="提示" open>
                <button>触发</button>
            </Tooltip>,
        );
        const tooltip = screen.getByRole('tooltip');
        const arrowEl = tooltip.firstElementChild!.lastElementChild;
        expect(arrowEl).toBeTruthy();
    });

    it('hides arrow when arrow is false', () => {
        render(
            <Tooltip title="提示" open arrow={false}>
                <button>触发</button>
            </Tooltip>,
        );
        const tooltip = screen.getByRole('tooltip');
        const content = tooltip.firstElementChild!;
        expect(content.childElementCount).toBe(0);
    });

    // ─── 样式与属性 ────────────────────────────────────────────────────────

    it('applies custom className', () => {
        render(
            <Tooltip title="提示" open className="custom-tooltip">
                <button>触发</button>
            </Tooltip>,
        );
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip.querySelector('.custom-tooltip')).toBeTruthy();
    });

    it('adds aria-describedby to trigger when open', () => {
        render(
            <Tooltip title="提示" open>
                <button>触发</button>
            </Tooltip>,
        );
        const trigger = screen.getByRole('button');
        const describedBy = trigger.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();

        const tooltip = screen.getByRole('tooltip');
        expect(tooltip.getAttribute('id')).toBe(describedBy);
    });

    it('renders ReactNode as title', () => {
        render(
            <Tooltip title={<span data-testid="rich-title">富文本提示</span>} open>
                <button>触发</button>
            </Tooltip>,
        );
        expect(screen.getByTestId('rich-title')).toBeTruthy();
        expect(screen.getByText('富文本提示')).toBeTruthy();
    });

    // ─── dialog 内挂载 ─────────────────────────────────────────────────────

    it('portals tooltip into the enclosing dialog to escape modal top-layer', () => {
        // 模拟在原生 modal <dialog> 中使用 tooltip 的场景：
        // 浮层必须位于 dialog 子树内，否则会被 top-layer 的 dialog 遮挡且受 inert 屏蔽
        const { container } = render(
            <dialog open>
                <Tooltip title="对话框内提示" mouseEnterDelay={0}>
                    <button>触发</button>
                </Tooltip>
            </dialog>,
        );
        act(() => {
            fireEvent.focus(screen.getByRole('button'));
        });

        const tooltip = screen.getByRole('tooltip');
        const dialog = container.querySelector('dialog') as HTMLDialogElement;
        expect(dialog.contains(tooltip)).toBe(true);
    });

    it('does not portal into a dialog when trigger is outside of one', () => {
        render(
            <Tooltip title="普通提示" mouseEnterDelay={0}>
                <button>触发</button>
            </Tooltip>,
        );
        act(() => {
            fireEvent.focus(screen.getByRole('button'));
        });

        const tooltip = screen.getByRole('tooltip');
        expect(tooltip.closest('dialog')).toBeNull();
    });
});
