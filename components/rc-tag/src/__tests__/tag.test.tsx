import { describe, expect, it, mock, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import CheckableTag from '../checkable-tag.js';
import Tag from '../tag.js';
import type { CheckableTagProps, TagProps } from '../types.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const renderTag = async (props: Partial<TagProps> = {}) => {
    const renderResult = await render(<Tag {...props}>Tag Text</Tag>);
    const tag = renderResult.container.firstElementChild as HTMLSpanElement;
    return {
        ...renderResult,
        tag,
    };
};
describe('Tag', () => {
    it('renders children correctly', async () => {
        const { tag } = await renderTag();
        expect(tag).toBeTruthy();
        expect(tag.textContent).toContain('Tag Text');
    });
    it('renders with only aria-label and no children', async () => {
        const { container } = await render(<Tag aria-label="tag only"/>);
        const root = container.firstElementChild as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute('aria-label')).toBe('tag only');
    });
    it('renders icon when provided', async () => {
        const Icon = () => <svg data-testid="tag-icon"/>;
        const { container } = await render(<Tag icon={<Icon />}>Tag Text</Tag>);
        expect(container.querySelector('[data-testid="tag-icon"]')).toBeTruthy();
    });
    it('renders close icon only when closable is true', async () => {
        const { rerender } = await render(<Tag>Tag Text</Tag>);
        expect(screen.queryByRole('button', { name: '关闭' })).toBeNull();
        await rerender(<Tag closable>Tag Text</Tag>);
        expect(screen.getByRole('button', { name: '关闭' })).toBeTruthy();
    });
    it('calls onClose when close icon is clicked', async () => {
        const onClose = mock.fn();
        await render(<Tag closable onClose={onClose}>Tag Text</Tag>);
        await fireEvent.click(screen.getByRole('button', { name: '关闭' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
    it('renders custom closeIcon when provided', async () => {
        await render(<Tag closable closeIcon={<span data-testid="custom-close">x</span>}>
                Tag Text
        </Tag>);
        expect(screen.getByTestId('custom-close')).toBeTruthy();
    });
    it('hides close icon when closeIcon is false', async () => {
        await render(<Tag closable closeIcon={false}>
                Tag Text
        </Tag>);
        expect(screen.queryByRole('button', { name: '关闭' })).toBeNull();
    });
    it('uses a native button for keyboard activation clicks', async () => {
        const onClose = mock.fn();
        await render(<Tag closable onClose={onClose}>Tag Text</Tag>);
        const closeButton = screen.getByRole('button', { name: '关闭' });
        expect(closeButton.tagName).toBe('BUTTON');
        expect(closeButton.getAttribute('type')).toBe('button');
        // The DOM shim does not synthesize browser default activation from key events.
        await fireEvent.click(closeButton, { detail: 0 });
        await fireEvent.click(closeButton, { detail: 0 });
        expect(onClose).toHaveBeenCalledTimes(2);
    });
    it('does not bubble click from close icon to root onClick', async () => {
        const onClick = mock.fn();
        const onClose = mock.fn();
        await render(<Tag closable onClick={onClick} onClose={onClose}>
                Tag Text
        </Tag>);
        await fireEvent.click(screen.getByRole('button', { name: '关闭' }));
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onClick).not.toHaveBeenCalled();
    });
    it('forwards className, style, and data attributes', async () => {
        const { tag } = await renderTag({
            className: 'custom-tag',
            style: { color: 'red' },
            'data-test-id': 'tag-1',
        } as Record<string, unknown>);
        expect(tag.className).toContain('custom-tag');
        expect(tag.style.color).toBe('red');
        expect(tag.getAttribute('data-test-id')).toBe('tag-1');
    });
    it('renders all color and size variants without runtime error', async () => {
        const colors: NonNullable<TagProps['color']>[] = [
            'default',
            'primary',
            'success',
            'warning',
            'error',
        ];
        const sizes: NonNullable<TagProps['size']>[] = ['large', 'medium', 'small'];
        for (const color of colors) {
            for (const size of sizes) {
                const { unmount } = await render(<Tag color={color} size={size} bordered={false}>
                        Tag Text
                </Tag>);
                expect(screen.getByText('Tag Text')).toBeTruthy();
                await unmount();
            }
        }
    });
    it('supports custom color string', async () => {
        const { tag } = await renderTag({ color: '#1677ff' });
        expect(tag.style.backgroundColor).toBe('#1677ff');
        expect(tag.style.borderColor).toBe('#1677ff');
    });
});
const renderCheckableTag = async (props: Partial<CheckableTagProps> = {}) => {
    const { checked = false, defaultChecked: _defaultChecked, onCheckedChange = mock.fn(), ...restProps } = props;
    const renderResult = await render(<CheckableTag {...restProps} checked={checked} onCheckedChange={onCheckedChange}>
            Checkable Tag
    </CheckableTag>);
    const tag = screen.getByRole('checkbox', { name: 'Checkable Tag' });
    return {
        ...renderResult,
        tag,
        onCheckedChange,
    };
};
describe('CheckableTag', () => {
    it('renders with checked state', async () => {
        const { tag } = await renderCheckableTag({ checked: true });
        expect(tag.getAttribute('aria-checked')).toBe('true');
        expect(tag.querySelector('[data-role="selected-icon"]')).toBeTruthy();
    });
    it('calls onCheckedChange when clicked', async () => {
        const { tag, onCheckedChange } = await renderCheckableTag({ checked: false });
        await fireEvent.click(tag);
        expect(onCheckedChange).toHaveBeenCalledWith(true, expect.objectContaining({ reason: 'toggle' }));
    });
    it('calls onCheckedChange when pressing Enter and Space', async () => {
        const { tag, onCheckedChange } = await renderCheckableTag({ checked: false });
        await fireEvent.keyDown(tag, { key: 'Enter' });
        await fireEvent.keyDown(tag, { key: ' ' });
        expect(onCheckedChange).toHaveBeenCalledTimes(2);
    });
    it('renders icon when provided', async () => {
        await render(<CheckableTag checked={false} icon={<svg data-testid="checkable-icon"/>}>
                Checkable Tag
        </CheckableTag>);
        expect(screen.getByTestId('checkable-icon')).toBeTruthy();
    });
    it('uses the selected checkmark instead of the optional leading icon', async () => {
        const { container } = await render(<CheckableTag checked icon={<svg data-testid="checkable-icon"/>}>
                Checkable Tag
        </CheckableTag>);
        expect(container.querySelector('[data-role="selected-icon"]')).toBeTruthy();
        expect(screen.queryByTestId('checkable-icon')).toBeNull();
    });
    it('prevents interaction when disabled', async () => {
        const { tag, onCheckedChange } = await renderCheckableTag({ disabled: true });
        expect(tag.getAttribute('aria-disabled')).toBe('true');
        expect(tag.getAttribute('tabindex')).toBe('-1');
        await fireEvent.click(tag);
        await fireEvent.keyDown(tag, { key: 'Enter' });
        expect(onCheckedChange).not.toHaveBeenCalled();
    });
});
