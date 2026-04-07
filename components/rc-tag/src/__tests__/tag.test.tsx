import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';

import CheckableTag from '../checkable-tag.js';
import Tag from '../tag.js';
import type { CheckableTagProps, TagProps } from '../types.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const renderTag = (props: Partial<TagProps> = {}) => {
    const renderResult = render(<Tag {...props}>Tag Text</Tag>);
    const tag = renderResult.container.firstElementChild as HTMLSpanElement;

    return {
        ...renderResult,
        tag,
    };
};

describe('Tag', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders children correctly', () => {
        const { tag } = renderTag();
        expect(tag).toBeTruthy();
        expect(tag.textContent).toContain('Tag Text');
    });

    it('renders with only aria-label and no children', () => {
        const { container } = render(<Tag aria-label="tag only" />);
        const root = container.firstElementChild as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute('aria-label')).toBe('tag only');
    });

    it('renders icon when provided', () => {
        const Icon = () => <svg data-testid="tag-icon" />;
        const { container } = render(<Tag icon={<Icon />}>Tag Text</Tag>);
        expect(container.querySelector('[data-testid="tag-icon"]')).toBeTruthy();
    });

    it('renders close icon only when closable is true', () => {
        const { rerender } = render(<Tag>Tag Text</Tag>);
        expect(screen.queryByRole('button', { name: 'close' })).toBeNull();

        rerender(<Tag closable>Tag Text</Tag>);
        expect(screen.getByRole('button', { name: 'close' })).toBeTruthy();
    });

    it('calls onClose when close icon is clicked', () => {
        const onClose = jest.fn();
        render(<Tag closable onClose={onClose}>Tag Text</Tag>);

        fireEvent.click(screen.getByRole('button', { name: 'close' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('renders custom closeIcon when provided', () => {
        render(
            <Tag closable closeIcon={<span data-testid="custom-close">x</span>}>
                Tag Text
            </Tag>,
        );

        expect(screen.getByTestId('custom-close')).toBeTruthy();
    });

    it('hides close icon when closeIcon is false', () => {
        render(
            <Tag closable closeIcon={false}>
                Tag Text
            </Tag>,
        );

        expect(screen.queryByRole('button', { name: 'close' })).toBeNull();
    });

    it('calls onClose when pressing Enter or Space on close icon', () => {
        const onClose = jest.fn();
        render(<Tag closable onClose={onClose}>Tag Text</Tag>);

        const closeButton = screen.getByRole('button', { name: 'close' });
        fireEvent.keyDown(closeButton, { key: 'Enter' });
        fireEvent.keyDown(closeButton, { key: ' ' });

        expect(onClose).toHaveBeenCalledTimes(2);
    });

    it('does not bubble click from close icon to root onClick', () => {
        const onClick = jest.fn();
        const onClose = jest.fn();

        render(
            <Tag closable onClick={onClick} onClose={onClose}>
                Tag Text
            </Tag>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'close' }));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onClick).not.toHaveBeenCalled();
    });

    it('forwards className, style, and data attributes', () => {
        const { tag } = renderTag({
            className: 'custom-tag',
            style: { color: 'red' },
            'data-test-id': 'tag-1',
        } as Record<string, unknown>);

        expect(tag.className).toContain('custom-tag');
        expect(tag.style.color).toBe('red');
        expect(tag.getAttribute('data-test-id')).toBe('tag-1');
    });

    it('renders all color and size variants without runtime error', () => {
        const colors: NonNullable<TagProps['color']>[] = [
            'default',
            'primary',
            'success',
            'warning',
            'error',
        ];
        const sizes: NonNullable<TagProps['size']>[] = ['large', 'middle', 'small'];

        colors.forEach((color) => {
            sizes.forEach((size) => {
                const { unmount } = render(
                    <Tag color={color} size={size} bordered={false}>
                        Tag Text
                    </Tag>,
                );
                expect(screen.getByText('Tag Text')).toBeTruthy();
                unmount();
            });
        });
    });

    it('supports custom color string', () => {
        const { tag } = renderTag({ color: '#1677ff' });

        expect(tag.style.backgroundColor).toBe('rgb(22, 119, 255)');
        expect(tag.style.borderColor).toBe('rgb(22, 119, 255)');
    });
});

const renderCheckableTag = (props: Partial<CheckableTagProps> = {}) => {
    const onChange = props.onChange ?? jest.fn();
    const renderResult = render(
        <CheckableTag checked={props.checked ?? false} onChange={onChange} {...props}>
            Checkable Tag
        </CheckableTag>,
    );
    const tag = screen.getByRole('checkbox', { name: 'Checkable Tag' });

    return {
        ...renderResult,
        tag,
        onChange,
    };
};

describe('CheckableTag', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders with checked state', () => {
        const { tag } = renderCheckableTag({ checked: true });
        expect(tag.getAttribute('aria-checked')).toBe('true');
    });

    it('calls onChange when clicked', () => {
        const { tag, onChange } = renderCheckableTag({ checked: false });
        fireEvent.click(tag);
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange when pressing Enter and Space', () => {
        const { tag, onChange } = renderCheckableTag({ checked: false });

        fireEvent.keyDown(tag, { key: 'Enter' });
        fireEvent.keyDown(tag, { key: ' ' });

        expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('renders icon when provided', () => {
        render(
            <CheckableTag checked={false} icon={<svg data-testid="checkable-icon" />}>
                Checkable Tag
            </CheckableTag>,
        );

        expect(screen.getByTestId('checkable-icon')).toBeTruthy();
    });
});
