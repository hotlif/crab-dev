import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

beforeAll(() => {
    (globalThis as Record<string, unknown>).ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

// 弹层容器涉及 floating-ui 定位与 motion 动画,jsdom 无布局引擎,统一以最小实现替身:
// open 状态 + dispatch + overlay 条件渲染,交互语义与真实实现一致
jest.mock('@crab-dev/rc-dropdown-container', () => {
    const mockReact = jest.requireActual('react') as typeof import('react');

    type MockDropdownContextValue = {
        state: { open: boolean };
        dispatch: (action: { type: 'setOpen'; payload: boolean }) => void;
        refs: { setReference: () => void };
    };

    const DropdownContext = mockReact.createContext<MockDropdownContextValue | null>(null);

    function MockDropdownContainer({ children, overlay }: { children: ReactNode; overlay: ReactNode }) {
        const [open, setOpen] = mockReact.useState(false);
        const ctx = {
            state: { open },
            dispatch: (action: { type: 'setOpen'; payload: boolean }) => {
                if (action.type === 'setOpen') {
                    setOpen(action.payload);
                }
            },
            refs: { setReference: () => {} },
        };

        return (
            <div>
                <DropdownContext value={ctx}>
                    {children}
                    {open ? overlay : null}
                </DropdownContext>
            </div>
        );
    }

    function useDropdownContext() {
        const context = mockReact.use(DropdownContext);

        if (!context) {
            throw new Error('useDropdownContext must be used within a DropdownContainer');
        }

        return context;
    }

    return {
        __esModule: true,
        default: MockDropdownContainer,
        useDropdownContext,
    };
});

import CronPicker from '../cronPicker.js';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const getInput = () => screen.getByRole('textbox', { name: 'Cron 表达式' }) as HTMLInputElement;

describe('CronPicker', () => {
    afterEach(() => {
        cleanup();
    });

    it('非受控默认渲染 * * * * *', () => {
        render(<CronPicker />);

        expect(getInput().value).toBe('* * * * *');
    });

    it('手动输入合法表达式,回车提交并归一化', () => {
        const onChange = jest.fn();

        render(<CronPicker onChange={onChange} />);

        const input = getInput();

        fireEvent.change(input, { target: { value: '0 9 * * MON-FRI' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(onChange).toHaveBeenCalledWith('0 9 * * 1-5');
        expect(input.value).toBe('0 9 * * 1-5');
    });

    it('非法输入即时给出 error 意符,回车不提交,失焦回退旧值', () => {
        const onChange = jest.fn();

        render(<CronPicker onChange={onChange} />);

        const input = getInput();

        fireEvent.change(input, { target: { value: '* * *' } });

        expect(input.getAttribute('aria-invalid')).toBe('true');

        fireEvent.keyDown(input, { key: 'Enter' });

        expect(onChange).not.toHaveBeenCalled();

        fireEvent.blur(input);

        expect(input.value).toBe('* * * * *');
        expect(input.getAttribute('aria-invalid')).toBeNull();
    });

    it('Escape 放弃编辑草稿并回退显示', () => {
        render(<CronPicker defaultValue="30 9 * * *" />);

        const input = getInput();

        fireEvent.change(input, { target: { value: 'x' } });
        fireEvent.keyDown(input, { key: 'Escape' });

        expect(input.value).toBe('30 9 * * *');
    });

    it('点击输入框打开弹层,展示表达式与中文描述', () => {
        render(<CronPicker defaultValue="30 9 * * 1-5" />);

        fireEvent.click(getInput());

        const dialog = screen.getByRole('dialog', { name: 'Cron 表达式编辑面板' });

        expect(dialog.textContent).toContain('30 9 * * 1-5');
        expect(dialog.textContent).toContain('周一至周五 09:30');
    });

    it('弹层内点击网格值,一步切入指定模式并上抛新表达式', () => {
        const onChange = jest.fn();

        render(<CronPicker onChange={onChange} />);

        fireEvent.click(getInput());
        fireEvent.click(screen.getByRole('checkbox', { name: '30分' }));

        expect(onChange).toHaveBeenCalledWith('30 * * * *');
        expect(getInput().value).toBe('30 * * * *');
    });

    it('弹层内选中步进模式,以默认步长产出表达式', () => {
        const onChange = jest.fn();

        render(<CronPicker onChange={onChange} />);

        fireEvent.click(getInput());
        fireEvent.click(screen.getByRole('radio', { name: '按步进指定分钟' }));

        expect(onChange).toHaveBeenCalledWith('*/5 * * * *');
    });

    it('previewCount 控制下次执行时间预览', () => {
        render(<CronPicker defaultValue="0 0 * * *" previewCount={3} />);

        fireEvent.click(getInput());

        const dialog = screen.getByRole('dialog', { name: 'Cron 表达式编辑面板' });

        expect(dialog.textContent).toContain('接下来 3 次执行');
    });

    it('disabled 时不打开弹层', () => {
        render(<CronPicker disabled />);

        fireEvent.click(getInput());

        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('受控模式下交互只上抛,不自更新', () => {
        const onChange = jest.fn();

        render(<CronPicker value="* * * * *" onChange={onChange} />);

        const input = getInput();

        fireEvent.change(input, { target: { value: '0 12 * * *' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(onChange).toHaveBeenCalledWith('0 12 * * *');
        expect(input.value).toBe('* * * * *');
    });

    it('受控传入非法表达式时输入框呈 error 态', () => {
        render(<CronPicker value="not a cron" />);

        expect(getInput().getAttribute('aria-invalid')).toBe('true');
    });
});
