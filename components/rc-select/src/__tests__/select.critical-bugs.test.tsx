import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import type { ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// 回归测试:锁定「严重问题」清单里 3 个已修复 bug 的正确行为,防止回退。
//
// 关键:与 select.test.tsx 不同,这里把 RcVirtual mock 成【真正的虚拟化】——
// 只渲染可见窗口内的行,并暴露真实 RcVirtual 那样的命令式 scrollToCell API。
// select.test.tsx 里的 mock 是「一次性渲染全部行」,无法覆盖 #1 的滚动行为。
// ─────────────────────────────────────────────────────────────────────────────

beforeAll(() => {
    (globalThis as Record<string, unknown>).ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

// 忠实的虚拟化 mock:viewportHeight / rowHeight 决定可见行数,只渲染可见窗口,
// 并通过 useImperativeHandle 暴露 scrollToCell —— 正确的 Select 会拿到 gridRef
// 并调用它,把视口外的高亮行滚进来。
jest.mock('@crab-dev/rc-virtual', () => {
    const mockReact = jest.requireActual('react') as typeof import('react');

    function MockVirtual({
        renderRows,
        gridTemplateRows,
        viewportHeight,
        gridRef,
    }: {
        renderRows: (rowRange: [number, number], columnRange: [number, number]) => ReactNode;
        gridTemplateRows: number[];
        viewportHeight: number;
        gridRef?: { current: unknown };
    }) {
        const rowCount = gridTemplateRows.length;
        const rowHeight = gridTemplateRows[0] ?? 32;
        const visibleCount = Math.max(1, Math.floor(viewportHeight / rowHeight));
        const [start, setStart] = mockReact.useState(0);
        const end = Math.min(rowCount - 1, start + visibleCount - 1);

        mockReact.useImperativeHandle(gridRef as never, () => ({
            scrollToCell: ({ rowIndex }: { rowIndex?: number }) => {
                if (rowIndex == null) return;
                if (rowIndex < start) setStart(rowIndex);
                else if (rowIndex > end) setStart(rowIndex - visibleCount + 1);
            },
            getScrollCellPosition: () => ({ rowIndex: start, columnIndex: 0 }),
        }));

        return (
            <div data-testid="vlist" data-visible={`${start}-${end}`}>
                {renderRows([start, end], [0, 0])}
            </div>
        );
    }

    return { __esModule: true, default: MockVirtual };
});

jest.mock('@crab-dev/rc-dropdown-container', () => {
    const mockReact = jest.requireActual('react') as typeof import('react');

    type MockCtx = {
        state: { open: boolean };
        dispatch: (action: { type: 'setOpen'; payload: boolean }) => void;
        refs: { setReference: () => void };
    };

    const DropdownContext = mockReact.createContext<MockCtx | null>(null);

    function MockDropdownContainer({ children, overlay }: { children: ReactNode; overlay: ReactNode }) {
        const [open, setOpen] = mockReact.useState(false);
        const ctx = mockReact.useMemo(
            () => ({
                state: { open },
                dispatch: (action: { type: 'setOpen'; payload: boolean }) => {
                    if (action.type === 'setOpen') setOpen(action.payload);
                },
                refs: { setReference: () => {} },
            }),
            [open],
        );

        return (
            <div>
                <DropdownContext.Provider value={ctx}>
                    {children}
                    {open ? overlay : null}
                </DropdownContext.Provider>
            </div>
        );
    }

    function useDropdownContext() {
        const context = mockReact.useContext(DropdownContext);
        if (!context) throw new Error('useDropdownContext must be used within a DropdownContainer');
        return context;
    }

    return { __esModule: true, default: MockDropdownContainer, useDropdownContext };
});

import Select from '../select.js';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('rc-select 严重问题回归', () => {
    afterEach(() => {
        cleanup();
    });

    // ── #1:虚拟滚动键盘导航 ────────────────────────────────────────────────────
    // selectOverlay 通过 gridRef.scrollToCell(按全局行索引)把高亮行滚入视口。
    it('#1: 键盘高亮到视口外的选项时,该项被滚入视口、出现在 DOM', () => {
        const options = Array.from({ length: 20 }, (_, i) => ({
            label: `Option ${i + 1}`,
            value: `opt-${i}`,
        }));

        render(<Select aria-label="s1" options={options} />);
        const combobox = screen.getByRole('combobox', { name: 's1' });

        // 连按 12 次 ArrowDown → highlightIndex 走到第 12 项(Option 12)
        for (let i = 0; i < 12; i += 1) {
            fireEvent.keyDown(combobox, { key: 'ArrowDown' });
        }

        // 视口 min(256, 20*32)=256 → 可见 8 行。高亮到 Option 12 后 scrollToCell
        // 把窗口滚到 [4,11]:Option 12 现在在 DOM,而滚出视口的 Option 1 不在。
        expect(screen.getByRole('option', { name: 'Option 12' })).toBeTruthy();
        expect(screen.queryByRole('option', { name: 'Option 1' })).toBeNull();
    });

    // ── #2:过滤后重置高亮 ──────────────────────────────────────────────────────
    it('#2: 搜索过滤出唯一项后,直接按 Enter 即可选中该项', () => {
        const onChange = jest.fn();

        render(
            <Select
                aria-label="s2"
                searchable
                onChange={onChange}
                options={[
                    { label: 'Alpha', value: 'alpha' },
                    { label: 'Beta', value: 'beta' },
                    { label: 'Gamma', value: 'gamma' },
                ]}
            />,
        );

        const combobox = screen.getByRole('combobox', { name: 's2' });

        // 打开并把高亮移到第 3 项 Gamma(highlightIndex = 2)
        fireEvent.keyDown(combobox, { key: 'ArrowDown' }); // → 0 Alpha
        fireEvent.keyDown(combobox, { key: 'ArrowDown' }); // → 1 Beta
        fireEvent.keyDown(combobox, { key: 'ArrowDown' }); // → 2 Gamma

        // 输入 "beta" 过滤 → 结果只剩 Beta;高亮被重置到该项(索引 0)
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'beta' } });

        expect(screen.getByRole('option', { name: 'Beta' })).toBeTruthy();
        expect(screen.queryByRole('option', { name: 'Gamma' })).toBeNull();

        // 直接回车即可选中唯一匹配项
        fireEvent.keyDown(combobox, { key: 'Enter' });

        expect(onChange).toHaveBeenCalledWith('beta', expect.objectContaining({ value: 'beta' }));
    });

    // ── #3:分组 key 不碰撞 ─────────────────────────────────────────────────────
    it('#3: 分组标题为 ReactNode 时不产生重复 key 警告', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <Select
                aria-label="s3"
                options={[
                    { label: <span>Fruits</span>, options: [{ label: 'Apple', value: 'apple' }] },
                    { label: <span>Vegetables</span>, options: [{ label: 'Carrot', value: 'carrot' }] },
                ]}
            />,
        );

        fireEvent.click(screen.getByRole('combobox', { name: 's3' }));

        const messages = errorSpy.mock.calls.map((call) => String(call[0]));
        errorSpy.mockRestore();

        // 分组合成 value 用下标生成 → 两个分组 key 唯一,无重复 key 警告。
        expect(messages.some((m) => /same key|two children|Encountered two/i.test(m))).toBe(false);
    });

    // ── #4:打开时定位到已选项 ───────────────────────────────────────────────────
    // 单选且已有值时,打开下拉必须直接把当前选中项滚入视口并高亮,而非停在顶部
    // 让用户自己往下翻找"选的到底是哪个"。
    it('#4: 单选已有值时,打开下拉应把选中项滚入视口', () => {
        const options = Array.from({ length: 20 }, (_, i) => ({
            label: `Option ${i + 1}`,
            value: `opt-${i}`,
        }));

        render(<Select aria-label="s4" defaultValue="opt-15" options={options} />);
        const combobox = screen.getByRole('combobox', { name: 's4' });

        fireEvent.click(combobox);

        // 视口只能看到 8 行;若打开时未定位到选中项,Option 16 会停留在视口外。
        expect(screen.getByRole('option', { name: 'Option 16' })).toBeTruthy();
        expect(screen.getByRole('option', { name: 'Option 16' }).getAttribute('aria-selected')).toBe('true');
    });
});
