import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import Avatar from '../avatar.js';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

describe('Avatar', () => {
    it('renders children as fallback content', () => {
        render(<Avatar>cd</Avatar>);
        expect(screen.getByText('cd')).toBeTruthy();
    });

    it('renders image when src is provided', () => {
        render(<Avatar src="https://example.com/avatar.png" alt="Crab Dev" />);
        const image = screen.getByAltText('Crab Dev') as HTMLImageElement;
        expect(image).toBeTruthy();
        expect(image.getAttribute('src')).toContain('https://example.com/avatar.png');
    });

    it('falls back to children when image load fails', () => {
        const { container } = render(
            <Avatar src="https://example.com/avatar.png" alt="Fallback User">
                fu
            </Avatar>,
        );

        const image = screen.getByAltText('Fallback User');
        fireEvent.error(image);

        expect(container.querySelector('img')).toBeNull();
        expect(screen.getByText('fu')).toBeTruthy();
    });

    it('keeps image when onError returns false', () => {
        const onError = jest.fn(() => false);
        const { container } = render(
            <Avatar src="https://example.com/avatar.png" alt="Keep Image" onError={onError} />,
        );

        const image = screen.getByAltText('Keep Image');
        fireEvent.error(image);

        expect(onError).toHaveBeenCalledTimes(1);
        expect(container.querySelector('img')).toBeTruthy();
    });

    it('renders custom icon when icon prop is provided', () => {
        render(
            <Avatar aria-label="custom avatar" icon={<svg data-testid="custom-avatar-icon" />} />,
        );
        expect(screen.getByTestId('custom-avatar-icon')).toBeTruthy();
    });

    it('renders default icon when no image, icon, or children are provided', () => {
        const { container } = render(<Avatar aria-label="anonymous" />);
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('aria-label')).toBe('anonymous');
        expect(container.querySelector('svg')).toBeTruthy();
    });

    it('supports square shape and large size', () => {
        const { container } = render(
            <Avatar aria-label="square large avatar" shape="square" size="large" />,
        );
        const root = container.firstElementChild as HTMLElement;
        expect(root.className.length).toBeGreaterThan(0);
    });

    it('applies bordered class when bordered prop is true', () => {
        const { container: bordered } = render(<Avatar aria-label="bordered" bordered />);
        const { container: unbordered } = render(<Avatar aria-label="unbordered" />);
        const borderedRoot = bordered.firstElementChild as HTMLElement;
        const unborderedRoot = unbordered.firstElementChild as HTMLElement;
        expect(borderedRoot.className).not.toBe(unborderedRoot.className);
    });

    it('applies different className for each variant', () => {
        const variants = ['default', 'primary', 'success', 'warning', 'error'] as const;
        const classNames = variants.map((variant) => {
            const { container } = render(
                <Avatar aria-label={`${variant} variant`} variant={variant} />,
            );
            return (container.firstElementChild as HTMLElement).className;
        });
        const unique = new Set(classNames);
        expect(unique.size).toBe(variants.length);
    });

    it('sets aria-disabled when disabled is true', () => {
        const { container } = render(<Avatar aria-label="disabled avatar" disabled />);
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not set aria-disabled when disabled is false', () => {
        const { container } = render(<Avatar aria-label="enabled avatar" />);
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('aria-disabled')).toBeNull();
    });

    it('resets image error state when src changes', () => {
        const { container, rerender } = render(
            <Avatar src="https://example.com/bad.png" alt="Reset Test" />,
        );

        const image = screen.getByAltText('Reset Test');
        fireEvent.error(image);
        expect(container.querySelector('img')).toBeNull();

        rerender(<Avatar src="https://example.com/good.png" alt="Reset Test" />);
        expect(container.querySelector('img')).toBeTruthy();
    });

    it('uses alt as aria-label when image fails and no aria-label given', () => {
        const { container } = render(
            <Avatar src="https://example.com/bad.png" alt="Alt Label" />,
        );
        fireEvent.error(screen.getByAltText('Alt Label'));
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('aria-label')).toBe('Alt Label');
    });

    it('applies number size as inline style', () => {
        const { container } = render(<Avatar aria-label="custom size" size={56} />);
        const root = container.firstElementChild as HTMLElement;
        expect(root.style.width).toBe('56px');
        expect(root.style.height).toBe('56px');
    });

    it('passes crossOrigin to img element', () => {
        render(
            <Avatar
                src="https://example.com/avatar.png"
                alt="CORS Avatar"
                crossOrigin="anonymous"
            />,
        );
        const img = screen.getByAltText('CORS Avatar') as HTMLImageElement;
        expect(img.getAttribute('crossorigin')).toBe('anonymous');
    });
});