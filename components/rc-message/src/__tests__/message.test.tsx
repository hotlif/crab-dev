import { beforeAll, describe, expect, it, mock, render, screen } from "@crab-dev/wake/test/react";

mock.module("motion/react", async () => {
    const mockReact = await mock.actual<typeof import("react")>("react");
    const MockDiv = (props: Record<string, unknown>) => mockReact.createElement("div", props);
    return {
        motion: { div: MockDiv },
    };
});

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
    it('renders content correctly', async () => {
        const { container } = await render(<Message content="Hello World"/>);
        expect(container.firstChild).toBeTruthy();
        expect(container.textContent).toContain('Hello World');
    });
    it('has role="alert"', async () => {
        await render(<Message content="Test"/>);
        expect(screen.getByRole('alert')).toBeTruthy();
    });
    it('renders all five types', async () => {
        const types: MessageType[] = ['success', 'info', 'warning', 'error', 'loading'];
        for (const type of types) {
            const { unmount } = await render(<Message type={type} content={`${type} message`}/>);
            expect(screen.getByRole('alert')).toBeTruthy();
            expect(screen.getByRole('alert').textContent).toContain(`${type} message`);
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
