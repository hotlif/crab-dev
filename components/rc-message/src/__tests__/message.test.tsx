import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, render, screen } from "@crab-dev/wake/test/react";


let Message: (typeof import('../message.js'))['default'];
beforeAll(async () => {
    const messageModule = await mock.import<typeof import('../message.js')>('../message.js');
    Message = messageModule.default;
});
import type { MessageType } from '../types.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe('Message', () => {
    it('updates countdown timing through canonical progress variables', async () => {
        const { container, rerender } = await render(<Message content="Timing" duration={5000} remaining={2000} paused />);
        const progress = container.querySelector<HTMLElement>('[data-paused]');
        expect(progress?.style.getPropertyValue('--message-progress-animation-duration')).toBe('5000ms');
        expect(progress?.style.getPropertyValue('--message-progress-animation-delay')).toBe('-3000ms');
        expect(progress?.getAttribute('data-paused')).toBe('true');
        await rerender(<Message content="Timing" duration={6000} remaining={6000} />);
        const resumed = container.querySelector<HTMLElement>('[data-paused]');
        expect(resumed?.style.getPropertyValue('--message-progress-animation-duration')).toBe('6000ms');
        expect(resumed?.style.getPropertyValue('--message-progress-animation-delay')).toBe('0ms');
        expect(resumed?.getAttribute('data-paused')).toBe('false');
    });

    it('renders content correctly', async () => {
        const { container } = await render(<Message content="Hello World"/>);
        expect(container.firstChild).toBeTruthy();
        expect(container.textContent).toContain('Hello World');
    });
    it('announces routine feedback politely without moving focus', async () => {
        const { rerender } = await render(<><button>Save</button><Message content="Saved" open={false} /></>);
        const trigger = screen.getByRole('button');
        await act(async () => { trigger.focus(); });
        await rerender(<><button>Save</button><Message content="Saved" /></>);
        expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite');
        expect(document.activeElement?.textContent).toBe('Save');
    });
    it('allows an explicit urgent announcement', async () => {
        await render(<Message content="Connection lost" role="alert" aria-live="assertive" />);
        expect(screen.getByRole('alert').getAttribute('aria-live')).toBe('assertive');
    });
    it('renders all five types', async () => {
        const types: MessageType[] = ['success', 'info', 'warning', 'error', 'loading'];
        for (const type of types) {
            const { unmount } = await render(<Message type={type} content={`${type} message`}/>);
            expect(screen.getByRole('status')).toBeTruthy();
            expect(screen.getByRole('status').textContent).toContain(`${type} message`);
            await unmount();
        }
    });
    it('defaults to info type', async () => {
        const { container } = await render(<Message content="Default"/>);
        const svg = container.querySelector('svg');
        expect(svg).toBeTruthy();
    });
    it('renders icon by default', async () => {
        const { container } = await render(<Message content="With icon"/>);
        const svg = container.querySelector('svg');
        expect(svg).toBeTruthy();
    });
    it('renders custom icon when provided', async () => {
        const { container } = await render(<Message content="Custom" icon={<span data-testid="custom-icon">!</span>}/>);
        expect(screen.getByTestId('custom-icon')).toBeTruthy();
        expect(container.querySelector('svg')).toBeNull();
    });
    it('renders ReactNode content', async () => {
        await render(<Message content={<strong data-testid="rich">Bold text</strong>}/>);
        expect(screen.getByTestId('rich')).toBeTruthy();
        expect(screen.getByTestId('rich').textContent).toBe('Bold text');
    });
    it('passes custom className from wrapper', async () => {
        const { container } = await render(<div className="my-wrapper">
            <Message content="Wrapped"/>
        </div>);
        expect(container.querySelector('.my-wrapper')).toBeTruthy();
    });
});
