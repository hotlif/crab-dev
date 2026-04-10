import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from '@jest/globals';

import Message from '../message.js';
import type { MessageType } from '../types.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

describe('Message', () => {
    it('renders content correctly', () => {
        const { container } = render(<Message content="Hello World" />);
        expect(container.firstChild).toBeTruthy();
        expect(container.textContent).toContain('Hello World');
    });

    it('has role="alert"', () => {
        render(<Message content="Test" />);
        expect(screen.getByRole('alert')).toBeTruthy();
    });

    it('renders all five types', () => {
        const types: MessageType[] = ['success', 'info', 'warning', 'error', 'loading'];

        for (const type of types) {
            const { unmount } = render(<Message type={type} content={`${type} message`} />);
            expect(screen.getByRole('alert')).toBeTruthy();
            expect(screen.getByRole('alert').textContent).toContain(`${type} message`);
            unmount();
        }
    });

    it('defaults to info type', () => {
        const { container } = render(<Message content="Default" />);
        const svg = container.querySelector('svg');
        expect(svg).toBeTruthy();
    });

    it('renders icon by default', () => {
        const { container } = render(<Message content="With icon" />);
        const svg = container.querySelector('svg');
        expect(svg).toBeTruthy();
    });

    it('renders custom icon when provided', () => {
        const { container } = render(
            <Message
                content="Custom"
                icon={<span data-testid="custom-icon">!</span>}
            />,
        );
        expect(screen.getByTestId('custom-icon')).toBeTruthy();
        expect(container.querySelector('svg')).toBeNull();
    });

    it('renders ReactNode content', () => {
        render(
            <Message content={<strong data-testid="rich">Bold text</strong>} />,
        );
        expect(screen.getByTestId('rich')).toBeTruthy();
        expect(screen.getByTestId('rich').textContent).toBe('Bold text');
    });

    it('passes custom className from wrapper', () => {
        const { container } = render(
            <div className="my-wrapper">
                <Message content="Wrapped" />
            </div>,
        );
        expect(container.querySelector('.my-wrapper')).toBeTruthy();
    });
});
