import { beforeAll, describe, expect, it, mock, act, fireEvent, render, screen } from "@crab-dev/wake/test/react";

mock.module("motion/react", async () => {
    const mockReact = await mock.actual<typeof import("react")>("react");
    const MockDiv = (props: Record<string, unknown>) => {
        const elementProps = { ...props };
        delete elementProps.initial;
        delete elementProps.animate;
        delete elementProps.exit;
        delete elementProps.transition;
        return mockReact.createElement("div", elementProps);
    };
    return {
        motion: { div: MockDiv },
        AnimatePresence: ({ children }: { children?: import("react").ReactNode }) => (
            mockReact.createElement(mockReact.Fragment, null, children)
        ),
    };
});

mock.module("@floating-ui/react", async () => {
    const mockReact = await mock.actual<typeof import("react")>("react");
    type FloatingContext = {
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
    };
    type Interaction = {
        getReferenceProps?: (props?: Record<string, unknown>) => Record<string, unknown>;
        getFloatingProps?: (props?: Record<string, unknown>) => Record<string, unknown>;
    };

    return {
        useFloating: (options: FloatingContext & { placement?: string }) => ({
            refs: {
                setReference: mock.fn(),
                setFloating: mock.fn(),
            },
            floatingStyles: {},
            context: { open: options.open, onOpenChange: options.onOpenChange },
            middlewareData: { arrow: { x: 0, y: 0 } },
            placement: options.placement ?? "top",
        }),
        autoUpdate: mock.fn(),
        offset: mock.fn(() => ({})),
        flip: mock.fn(() => ({})),
        shift: mock.fn(() => ({})),
        arrow: mock.fn(() => ({})),
        useHover: (context: FloatingContext) => ({
            getReferenceProps: (props: Record<string, unknown> = {}) => ({
                ...props,
                onMouseEnter: () => context.onOpenChange?.(true),
                onMouseLeave: () => context.onOpenChange?.(false),
            }),
        }),
        useFocus: (context: FloatingContext) => ({
            getReferenceProps: (props: Record<string, unknown> = {}) => ({
                ...props,
                onFocus: () => context.onOpenChange?.(true),
                onBlur: () => context.onOpenChange?.(false),
            }),
        }),
        useDismiss: (context: FloatingContext) => {
            mockReact.useEffect(() => {
                const handleKeyDown = (event: KeyboardEvent) => {
                    if (event.key === "Escape") context.onOpenChange?.(false);
                };
                document.addEventListener("keydown", handleKeyDown);
                return () => document.removeEventListener("keydown", handleKeyDown);
            }, [context.onOpenChange]);
            return {};
        },
        useRole: (context: FloatingContext) => ({
            getReferenceProps: (props: Record<string, unknown> = {}) => ({
                ...props,
                "aria-describedby": context.open ? "wake-tooltip" : undefined,
            }),
            getFloatingProps: (props: Record<string, unknown> = {}) => ({
                ...props,
                id: "wake-tooltip",
                role: "tooltip",
            }),
        }),
        useInteractions: (interactions: Interaction[]) => ({
            getReferenceProps: (props: Record<string, unknown> = {}) => interactions.reduce(
                (result, interaction) => interaction.getReferenceProps?.(result) ?? result,
                props,
            ),
            getFloatingProps: (props: Record<string, unknown> = {}) => interactions.reduce(
                (result, interaction) => interaction.getFloatingProps?.(result) ?? result,
                props,
            ),
        }),
        FloatingPortal: ({ children }: { children?: import("react").ReactNode }) => (
            mockReact.createElement(mockReact.Fragment, null, children)
        ),
        useMergeRefs: (refs: Array<import("react").Ref<unknown> | undefined>) => (node: unknown) => {
            for (const ref of refs) {
                if (typeof ref === "function") ref(node);
                else if (ref && "current" in ref) (ref as { current: unknown }).current = node;
            }
        },
    };
});

let Tooltip: (typeof import('../tooltip.js'))['default'];
beforeAll(async () => {
    const tooltipModule = await mock.import<typeof import('../tooltip.js')>('../tooltip.js');
    Tooltip = tooltipModule.default;
});
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe('Tooltip', () => {
    // ─── 基础渲染 ──────────────────────────────────────────────────────────
    it('renders trigger element', async () => {
        await render(<Tooltip title="提示">
            <button>触发</button>
        </Tooltip>);
        expect(screen.getByRole('button', { name: '触发' })).toBeTruthy();
    });
    it('does not show tooltip by default', async () => {
        await render(<Tooltip title="提示">
            <button>触发</button>
        </Tooltip>);
        expect(screen.queryByRole('tooltip')).toBeNull();
    });
    // ─── 受控模式 ──────────────────────────────────────────────────────────
    it('shows tooltip when open is true', async () => {
        await render(<Tooltip title="受控提示" open>
            <button>触发</button>
        </Tooltip>);
        expect(screen.getByRole('tooltip')).toBeTruthy();
        expect(screen.getByText('受控提示')).toBeTruthy();
    });
    it('hides tooltip when open is false', async () => {
        await render(<Tooltip title="受控提示" open={false}>
            <button>触发</button>
        </Tooltip>);
        expect(screen.queryByRole('tooltip')).toBeNull();
    });
    it('supports defaultOpen', async () => {
        await render(<Tooltip title="默认显示" defaultOpen>
            <button>触发</button>
        </Tooltip>);
        expect(screen.getByRole('tooltip')).toBeTruthy();
        expect(screen.getByText('默认显示')).toBeTruthy();
    });
    // ─── 交互触发 ──────────────────────────────────────────────────────────
    it('shows tooltip on pointer enter', async () => {
        await render(<Tooltip title="悬浮提示" mouseEnterDelay={0} mouseLeaveDelay={0}>
            <button>触发</button>
        </Tooltip>);
        const trigger = screen.getByRole('button');
        await act(async () => {
            await fireEvent(trigger, new MouseEvent("mouseover", { bubbles: true }));
        });
        expect(screen.getByRole('tooltip')).toBeTruthy();
        expect(screen.getByText('悬浮提示')).toBeTruthy();
    });
    it('shows tooltip on focus', async () => {
        await render(<Tooltip title="聚焦提示" mouseEnterDelay={0} mouseLeaveDelay={0}>
            <button>触发</button>
        </Tooltip>);
        await act(async () => {
            await fireEvent(screen.getByRole('button'), new FocusEvent("focusin", { bubbles: true }));
        });
        expect(screen.getByRole('tooltip')).toBeTruthy();
        expect(screen.getByText('聚焦提示')).toBeTruthy();
    });
    it('calls onOpenChange when tooltip opens via focus', async () => {
        const handleOpenChange = mock.fn();
        await render(<Tooltip title="提示" mouseEnterDelay={0} onOpenChange={handleOpenChange}>
            <button>触发</button>
        </Tooltip>);
        await act(async () => {
            await fireEvent(screen.getByRole('button'), new FocusEvent("focusin", { bubbles: true }));
        });
        expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
    it('calls onOpenChange when tooltip closes via escape', async () => {
        const handleOpenChange = mock.fn();
        await render(<Tooltip title="提示" mouseEnterDelay={0} onOpenChange={handleOpenChange}>
            <button>触发</button>
        </Tooltip>);
        await act(async () => {
            await fireEvent(screen.getByRole('button'), new FocusEvent("focusin", { bubbles: true }));
        });
        expect(handleOpenChange).toHaveBeenCalledWith(true);
        handleOpenChange.clear();
        await act(async () => {
            await fireEvent.keyDown(document as unknown as Element, { key: 'Escape' });
        });
        expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
    // ─── 空内容 ────────────────────────────────────────────────────────────
    it('does not show tooltip when title is empty string', async () => {
        await render(<Tooltip title="" open>
            <button>触发</button>
        </Tooltip>);
        expect(screen.queryByRole('tooltip')).toBeNull();
    });
    it('does not show tooltip when title is null', async () => {
        await render(<Tooltip title={null as unknown as string} open>
            <button>触发</button>
        </Tooltip>);
        expect(screen.queryByRole('tooltip')).toBeNull();
    });
    // ─── 箭头 ──────────────────────────────────────────────────────────────
    it('renders arrow by default', async () => {
        await render(<Tooltip title="提示" open>
            <button>触发</button>
        </Tooltip>);
        const tooltip = screen.getByRole('tooltip');
        const arrowEl = tooltip.firstElementChild!.lastElementChild;
        expect(arrowEl).toBeTruthy();
    });
    it('hides arrow when arrow is false', async () => {
        await render(<Tooltip title="提示" open arrow={false}>
            <button>触发</button>
        </Tooltip>);
        const tooltip = screen.getByRole('tooltip');
        const content = tooltip.firstElementChild!;
        expect(content.childElementCount).toBe(0);
    });
    // ─── 样式与属性 ────────────────────────────────────────────────────────
    it('applies custom className', async () => {
        await render(<Tooltip title="提示" open className="custom-tooltip">
            <button>触发</button>
        </Tooltip>);
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip.querySelector('.custom-tooltip')).toBeTruthy();
    });
    it('adds aria-describedby to trigger when open', async () => {
        await render(<Tooltip title="提示" open>
            <button>触发</button>
        </Tooltip>);
        const trigger = screen.getByRole('button');
        const describedBy = trigger.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip.getAttribute('id')).toBe(describedBy);
    });
    it('renders ReactNode as title', async () => {
        await render(<Tooltip title={<span data-testid="rich-title">富文本提示</span>} open>
            <button>触发</button>
        </Tooltip>);
        expect(screen.getByTestId('rich-title')).toBeTruthy();
        expect(screen.getByText('富文本提示')).toBeTruthy();
    });

    // ─── dialog 内挂载 ─────────────────────────────────────────────────────

    it('portals tooltip into the enclosing dialog to escape modal top-layer', async () => {
        // 模拟在原生 modal <dialog> 中使用 tooltip 的场景：
        // 浮层必须位于 dialog 子树内，否则会被 top-layer 的 dialog 遮挡且受 inert 屏蔽
        const { container } = await render(
            <dialog open>
                <Tooltip title="对话框内提示" mouseEnterDelay={0}>
                    <button>触发</button>
                </Tooltip>
            </dialog>,
        );
        await act(() => {
            screen.getByRole('button').focus();
        });

        const tooltip = screen.getByRole('tooltip');
        const dialog = container.querySelector('dialog') as HTMLDialogElement;
        expect(dialog.contains(tooltip)).toBe(true);
    });

    it('does not portal into a dialog when trigger is outside of one', async () => {
        await render(
            <Tooltip title="普通提示" mouseEnterDelay={0}>
                <button>触发</button>
            </Tooltip>,
        );
        await act(() => {
            screen.getByRole('button').focus();
        });

        const tooltip = screen.getByRole('tooltip');
        expect(tooltip.closest('dialog')).toBeNull();
    });
});
