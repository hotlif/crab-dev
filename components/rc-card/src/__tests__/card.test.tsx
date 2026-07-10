import { createRef } from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';

import Card from '../card.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('Card', () => {
    afterEach(() => {
        cleanup();
    });

    // ─── 结构编排 ────────────────────────────────────────────────────────────

    it('renders title, extra and children', () => {
        const { container, getByText } = render(
            <Card title="标题" extra={<button type="button">更多</button>}>
                正文内容
            </Card>,
        );
        expect(getByText('标题')).toBeTruthy();
        expect(getByText('更多')).toBeTruthy();
        expect(container.textContent).toContain('正文内容');
    });

    it('renders cover before header in DOM order', () => {
        const { container } = render(
            <Card title="标题" cover={<img src="x.png" alt="封面" />}>
                内容
            </Card>,
        );
        const root = container.firstElementChild as HTMLElement;
        const first = root.firstElementChild as HTMLElement;
        expect(first.querySelector('img')).toBeTruthy();
    });

    it('renders actions inside a footer region', () => {
        const onEdit = jest.fn();
        const { getByText } = render(
            <Card
                actions={[
                    <button key="edit" type="button" onClick={onEdit}>
                        编辑
                    </button>,
                    <button key="share" type="button">
                        分享
                    </button>,
                ]}
            >
                内容
            </Card>,
        );
        fireEvent.click(getByText('编辑'));
        expect(onEdit).toHaveBeenCalledTimes(1);
        expect(getByText('分享')).toBeTruthy();
    });

    it('supports free composition via structural sub-components', () => {
        const { container, getByText } = render(
            <Card>
                <Card.Cover>
                    <img src="x.png" alt="封面" />
                </Card.Cover>
                <Card.Header title="自由标题" />
                <Card.Body>自由内容</Card.Body>
                <Card.Footer>
                    <button type="button">操作</button>
                </Card.Footer>
            </Card>,
        );
        expect(getByText('自由标题')).toBeTruthy();
        expect(getByText('自由内容')).toBeTruthy();
        expect(getByText('操作')).toBeTruthy();
        expect(container.querySelector('img')).toBeTruthy();
    });

    it('renders Meta with avatar, title and description', () => {
        const { getByText, getByAltText } = render(
            <Card>
                <Card.Meta
                    avatar={<img src="a.png" alt="头像" />}
                    title="张三"
                    description="前端工程师"
                />
            </Card>,
        );
        expect(getByAltText('头像')).toBeTruthy();
        expect(getByText('张三')).toBeTruthy();
        expect(getByText('前端工程师')).toBeTruthy();
    });

    // ─── 整卡可点击 ──────────────────────────────────────────────────────────

    it('exposes button semantics when clickable', () => {
        const { container } = render(<Card clickable>内容</Card>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('role')).toBe('button');
        expect(root.getAttribute('tabindex')).toBe('0');
    });

    it('has no interactive semantics by default', () => {
        const { container } = render(<Card>内容</Card>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('role')).toBeNull();
        expect(root.getAttribute('tabindex')).toBeNull();
    });

    it('fires onClick on click and keyboard activation', () => {
        const onClick = jest.fn();
        const { container } = render(
            <Card clickable onClick={onClick}>
                内容
            </Card>,
        );
        const root = container.firstElementChild as HTMLElement;

        fireEvent.click(root);
        expect(onClick).toHaveBeenCalledTimes(1);

        fireEvent.keyDown(root, { key: 'Enter' });
        expect(onClick).toHaveBeenCalledTimes(2);

        fireEvent.keyDown(root, { key: ' ' });
        expect(onClick).toHaveBeenCalledTimes(3);
    });

    it('isolates extra clicks from the card onClick', () => {
        const onCard = jest.fn();
        const onExtra = jest.fn();
        const { getByText } = render(
            <Card
                clickable
                onClick={onCard}
                title="标题"
                extra={
                    <button type="button" onClick={onExtra}>
                        更多
                    </button>
                }
            >
                内容
            </Card>,
        );
        fireEvent.click(getByText('更多'));
        expect(onExtra).toHaveBeenCalledTimes(1);
        expect(onCard).not.toHaveBeenCalled();
    });

    it('isolates action clicks from the card onClick', () => {
        const onCard = jest.fn();
        const onAction = jest.fn();
        const { getByText } = render(
            <Card
                clickable
                onClick={onCard}
                actions={[
                    <button key="edit" type="button" onClick={onAction}>
                        编辑
                    </button>,
                ]}
            >
                内容
            </Card>,
        );
        fireEvent.click(getByText('编辑'));
        expect(onAction).toHaveBeenCalledTimes(1);
        expect(onCard).not.toHaveBeenCalled();
    });

    // ─── 防错：disabled / loading 撤销交互 ───────────────────────────────────

    it('does not fire onClick when disabled', () => {
        const onClick = jest.fn();
        const { container } = render(
            <Card clickable disabled onClick={onClick}>
                内容
            </Card>,
        );
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('aria-disabled')).toBe('true');
        expect(root.getAttribute('tabindex')).toBeNull();

        fireEvent.click(root);
        fireEvent.keyDown(root, { key: 'Enter' });
        expect(onClick).not.toHaveBeenCalled();
    });

    it('does not fire onClick while loading', () => {
        const onClick = jest.fn();
        const { container } = render(
            <Card clickable loading onClick={onClick}>
                内容
            </Card>,
        );
        const root = container.firstElementChild as HTMLElement;
        fireEvent.click(root);
        expect(onClick).not.toHaveBeenCalled();
    });

    // ─── 加载骨架 ────────────────────────────────────────────────────────────

    it('replaces content with skeleton and sets aria-busy while loading', () => {
        const { container } = render(
            <Card title="标题" loading>
                真实内容
            </Card>,
        );
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('aria-busy')).toBe('true');
        expect(container.textContent).not.toContain('真实内容');
        expect(container.textContent).not.toContain('标题');
    });

    it('renders real content when loading is false', () => {
        const { container } = render(
            <Card title="标题" loading={false}>
                真实内容
            </Card>,
        );
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('aria-busy')).toBeNull();
        expect(container.textContent).toContain('真实内容');
    });

    // ─── 透传与 ref ──────────────────────────────────────────────────────────

    it('forwards ref to the root element', () => {
        const ref = createRef<HTMLDivElement>();
        const { container } = render(<Card ref={ref}>内容</Card>);
        expect(ref.current).toBe(container.firstElementChild);
    });

    it('merges rest props and className onto the root', () => {
        const { container } = render(
            <Card data-testid="my-card" className="custom-cls">
                内容
            </Card>,
        );
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('data-testid')).toBe('my-card');
        expect(root.className).toContain('custom-cls');
    });
});
