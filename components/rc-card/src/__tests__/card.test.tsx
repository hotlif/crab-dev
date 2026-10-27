import { describe, expect, it, mock, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import { createRef, use, useEffect, type CSSProperties } from 'react';
import { TokenVars as skeletonVars } from '@crab-dev/rc-skeleton';
import Card from '../card.js';
import { CardContext } from '../context.js';

function MountProbe({ name, onMount, onUnmount }: {
    name: string;
    onMount: (name: string) => void;
    onUnmount: (name: string) => void;
}) {
    useEffect(() => {
        onMount(name);
        return () => onUnmount(name);
    }, [name, onMount, onUnmount]);
    return <span data-mounted={name}>{name}</span>;
}

function ContextProbe() {
    const { size, clickable } = use(CardContext);
    return <span data-card-context="" data-size={size} data-clickable={String(clickable)} />;
}
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe('Card', () => {
    // ─── 结构编排 ────────────────────────────────────────────────────────────
    it('renders title, extra and children', async () => {
        const { container } = await render(<Card title="标题" extra={<button type="button">更多</button>}>
                正文内容
        </Card>);
        expect(screen.getByText('标题')).toBeTruthy();
        expect(screen.getByText('更多')).toBeTruthy();
        expect(container.textContent).toContain('正文内容');
    });
    it('renders cover before header in DOM order', async () => {
        const { container } = await render(<Card title="标题" cover={<img src="x.png" alt="封面"/>}>
                内容
        </Card>);
        const root = container.firstElementChild as HTMLElement;
        const first = root.firstElementChild as HTMLElement;
        expect(first.querySelector('img')).toBeTruthy();
    });
    it('renders actions inside a footer region', async () => {
        const onEdit = mock.fn();
        await render(<Card actions={[
            <button key="edit" type="button" onClick={onEdit}>
                        编辑
            </button>,
            <button key="share" type="button">
                        分享
            </button>,
        ]}>
                内容
        </Card>);
        await fireEvent.click(screen.getByText('编辑'));
        expect(onEdit).toHaveBeenCalledTimes(1);
        expect(screen.getByText('分享')).toBeTruthy();
    });
    it('supports free composition via structural sub-components', async () => {
        const { container } = await render(<Card>
            <Card.Cover>
                <img src="x.png" alt="封面"/>
            </Card.Cover>
            <Card.Header title="自由标题"/>
            <Card.Body>自由内容</Card.Body>
            <Card.Footer>
                <button type="button">操作</button>
            </Card.Footer>
        </Card>);
        expect(screen.getByText('自由标题')).toBeTruthy();
        expect(screen.getByText('自由内容')).toBeTruthy();
        expect(screen.getByText('操作')).toBeTruthy();
        expect(container.querySelector('img')).toBeTruthy();
    });
    it('renders Meta with avatar, title and description', async () => {
        await render(<Card>
            <Card.Meta avatar={<img src="a.png" alt="头像"/>} title="张三" description="前端工程师"/>
        </Card>);
        expect(screen.getByAltText('头像')).toBeTruthy();
        expect(screen.getByText('张三')).toBeTruthy();
        expect(screen.getByText('前端工程师')).toBeTruthy();
    });
    // ─── 整卡可点击 ──────────────────────────────────────────────────────────
    it('exposes button semantics when clickable', async () => {
        const { container } = await render(<Card clickable>内容</Card>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('role')).toBe('button');
        expect(root.getAttribute('tabindex')).toBe('0');
    });
    it('has no interactive semantics by default', async () => {
        const { container } = await render(<Card>内容</Card>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('role')).toBeNull();
        expect(root.getAttribute('tabindex')).toBeNull();
    });
    it('fires onClick on click and keyboard activation', async () => {
        const onClick = mock.fn();
        const { container } = await render(<Card clickable onClick={onClick}>
                内容
        </Card>);
        const root = container.firstElementChild as HTMLElement;
        await fireEvent.click(root);
        expect(onClick).toHaveBeenCalledTimes(1);
        await fireEvent.keyDown(root, { key: 'Enter' });
        expect(onClick).toHaveBeenCalledTimes(2);
        await fireEvent.keyDown(root, { key: ' ' });
        expect(onClick).toHaveBeenCalledTimes(3);
    });
    it('isolates extra clicks from the card onClick', async () => {
        const onCard = mock.fn();
        const onExtra = mock.fn();
        await render(<Card clickable onClick={onCard} title="标题" extra={<button type="button" onClick={onExtra}>
                        更多
        </button>}>
                内容
        </Card>);
        await fireEvent.click(screen.getByText('更多'));
        expect(onExtra).toHaveBeenCalledTimes(1);
        expect(onCard).not.toHaveBeenCalled();
    });
    it('isolates action clicks from the card onClick', async () => {
        const onCard = mock.fn();
        const onAction = mock.fn();
        await render(<Card clickable onClick={onCard} actions={[
            <button key="edit" type="button" onClick={onAction}>
                        编辑
            </button>,
        ]}>
                内容
        </Card>);
        await fireEvent.click(screen.getByText('编辑'));
        expect(onAction).toHaveBeenCalledTimes(1);
        expect(onCard).not.toHaveBeenCalled();
    });
    // ─── 防错：disabled / loading 撤销交互 ───────────────────────────────────
    it('does not fire onClick when disabled', async () => {
        const onClick = mock.fn();
        const { container } = await render(<Card clickable disabled onClick={onClick}>
                内容
        </Card>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('aria-disabled')).toBe('true');
        expect(root.getAttribute('tabindex')).toBeNull();
        await fireEvent.click(root);
        await fireEvent.keyDown(root, { key: 'Enter' });
        expect(onClick).not.toHaveBeenCalled();
    });
    it('does not fire onClick while loading', async () => {
        const onClick = mock.fn();
        const { container } = await render(<Card clickable loading onClick={onClick}>
                内容
        </Card>);
        const root = container.firstElementChild as HTMLElement;
        await fireEvent.click(root);
        expect(onClick).not.toHaveBeenCalled();
    });
    // ─── 加载骨架 ────────────────────────────────────────────────────────────
    it('replaces content with skeleton and sets aria-busy while loading', async () => {
        const { container } = await render(<Card title="标题" loading>
                真实内容
        </Card>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('aria-busy')).toBe('true');
        expect(container.textContent).not.toContain('真实内容');
        expect(container.textContent).not.toContain('标题');
    });
    it('renders real content when loading is false', async () => {
        const { container } = await render(<Card title="标题" loading={false}>
                真实内容
        </Card>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('aria-busy')).toBeNull();
        expect(container.textContent).toContain('真实内容');
    });
    it('restores content and activation after loading while preserving consumer overrides', async () => {
        const onClick = mock.fn();
        const style = { [skeletonVars['root.background-color']]: 'rgb(13, 47, 91)' } as CSSProperties;
        const content = (loading: boolean) => <Card clickable loading={loading} onClick={onClick}
            className="consumer-card" style={style} title="Ready title">Ready content</Card>;
        const view = await render(content(true));
        const root = view.container.firstElementChild as HTMLElement;
        expect(root.style.getPropertyValue(skeletonVars['root.background-color'])).toBe('rgb(13, 47, 91)');
        expect(root.classList.contains('consumer-card')).toBe(true);
        expect(root.getAttribute('aria-busy')).toBe('true');
        expect(root.querySelector('[role="status"]')).toBeTruthy();
        await fireEvent.click(root);
        expect(onClick).not.toHaveBeenCalled();

        await view.rerender(content(false));
        expect(view.container.firstElementChild).toBe(root);
        expect(root.getAttribute('aria-busy')).toBeNull();
        expect(root.querySelector('[role="status"]')).toBeNull();
        expect(root.textContent).toContain('Ready title');
        expect(root.textContent).toContain('Ready content');
        expect(root.getAttribute('tabindex')).toBe('0');
        expect(root.classList.contains('consumer-card')).toBe(true);
        expect(root.style.getPropertyValue(skeletonVars['root.background-color'])).toBe('rgb(13, 47, 91)');
        await fireEvent.keyDown(root, { key: 'Enter' });
        expect(onClick).toHaveBeenCalledTimes(1);
    });
    it('mounts the complete custom loading slot in Card context without mounting real content', async () => {
        const onReadyMount = mock.fn();
        const onReadyUnmount = mock.fn();
        const onLoadingMount = mock.fn();
        const onLoadingUnmount = mock.fn();
        const onClick = mock.fn();
        const ready = (name: string) => <MountProbe name={name} onMount={onReadyMount} onUnmount={onReadyUnmount} />;
        const fixture = (loading: boolean) => <Card loading={loading} size="small" clickable onClick={onClick}
            cover={ready('ready-cover')} title={ready('ready-title')} extra={ready('ready-extra')}
            actions={[<MountProbe key="action" name="ready-action" onMount={onReadyMount} onUnmount={onReadyUnmount} />]}
            loadingContent={<>
                <Card.Cover data-loading-cover="">
                    <MountProbe name="loading-cover" onMount={onLoadingMount} onUnmount={onLoadingUnmount} />
                </Card.Cover>
                <Card.Header data-loading-header="" title="Loading title" />
                <Card.Body data-loading-body=""><ContextProbe /></Card.Body>
                <Card.Footer data-loading-footer="">Loading footer</Card.Footer>
            </>}>
            {ready('ready-body')}
            <ContextProbe />
        </Card>;
        const view = await render(fixture(true));
        const root = view.container.firstElementChild as HTMLElement;
        expect(root.getAttribute('aria-busy')).toBe('true');
        expect(root.getAttribute('tabindex')).toBeNull();
        expect(root.getAttribute('loadingcontent')).toBeNull();
        expect(onReadyMount).not.toHaveBeenCalled();
        expect(onLoadingMount).toHaveBeenCalledTimes(1);
        expect(root.querySelector('[data-mounted="ready-body"]')).toBeNull();
        expect(root.querySelector('span[aria-hidden="true"]')).toBeNull();
        // Structural loading slots are direct children, not wrapped in another Body.
        expect(root.children.length).toBe(4);
        for (const part of ['cover', 'header', 'body', 'footer']) {
            expect(root.querySelector(`[data-loading-${part}]`)?.parentElement).toBe(root);
        }
        expect(root.querySelector('[data-card-context]')?.getAttribute('data-size')).toBe('small');
        expect(root.querySelector('[data-card-context]')?.getAttribute('data-clickable')).toBe('false');
        await fireEvent.click(root);
        await fireEvent.keyDown(root, { key: 'Enter' });
        await fireEvent.keyDown(root, { key: ' ' });
        expect(onClick).not.toHaveBeenCalled();

        await view.rerender(fixture(false));
        expect(view.container.firstElementChild).toBe(root);
        expect(onLoadingUnmount).toHaveBeenCalledTimes(1);
        expect(onReadyMount).toHaveBeenCalledTimes(5);
        expect(root.querySelector('[data-loading-cover]')).toBeNull();
        expect(root.querySelector('[data-loading-body]')).toBeNull();
        expect(root.getAttribute('aria-busy')).toBeNull();
        expect(root.getAttribute('tabindex')).toBe('0');
        expect(root.querySelector('[data-card-context]')?.getAttribute('data-size')).toBe('small');
        expect(root.querySelector('[data-card-context]')?.getAttribute('data-clickable')).toBe('true');
        await fireEvent.keyDown(root, { key: 'Enter' });
        expect(onClick).toHaveBeenCalledTimes(1);

        await view.rerender(fixture(true));
        expect(view.container.firstElementChild).toBe(root);
        expect(onReadyUnmount).toHaveBeenCalledTimes(5);
        expect(onLoadingMount).toHaveBeenCalledTimes(2);
        expect(root.querySelector('[data-mounted="ready-body"]')).toBeNull();
        expect(root.children.length).toBe(4);
    });
    it('uses default placeholders only for an omitted or undefined loadingContent', async () => {
        const view = await render(<Card loading cover={<div>Real cover</div>}>Real body</Card>);
        const root = view.container.firstElementChild as HTMLElement;
        expect(root.querySelectorAll('span[aria-hidden="true"]').length).toBe(5);
        await view.rerender(<Card loading loadingContent={undefined} cover={<div>Real cover</div>}>Real body</Card>);
        expect(root.querySelectorAll('span[aria-hidden="true"]').length).toBe(5);

        for (const loadingContent of [null, false, 0] as const) {
            await view.rerender(<Card loading loadingContent={loadingContent}
                cover={<div>Real cover</div>} title="Real title">Real body</Card>);
            expect(view.container.firstElementChild).toBe(root);
            expect(root.getAttribute('aria-busy')).toBe('true');
            expect(root.childElementCount).toBe(0);
            expect(root.textContent).toBe(loadingContent === 0 ? '0' : '');
            expect(root.getAttribute('loadingcontent')).toBeNull();
        }
    });
    it('does not mount a custom loading slot when initially ready', async () => {
        const onMount = mock.fn();
        const onUnmount = mock.fn();
        const { container } = await render(<Card loading={false}
            loadingContent={<MountProbe name="unused-loading" onMount={onMount} onUnmount={onUnmount} />}
            title="Ready title">Ready body</Card>);
        expect(onMount).not.toHaveBeenCalled();
        expect(onUnmount).not.toHaveBeenCalled();
        expect(container.textContent).toContain('Ready title');
        expect(container.textContent).toContain('Ready body');
        expect(container.querySelector('[data-mounted="unused-loading"]')).toBeNull();
    });
    // ─── 透传与 ref ──────────────────────────────────────────────────────────
    it('forwards ref to the root element', async () => {
        const ref = createRef<HTMLDivElement>();
        const { container } = await render(<Card ref={ref}>内容</Card>);
        expect(ref.current).toBe(container.firstElementChild);
    });
    it('merges rest props and className onto the root', async () => {
        const { container } = await render(<Card data-testid="my-card" className="custom-cls">
                内容
        </Card>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute('data-testid')).toBe('my-card');
        expect(root.className).toContain('custom-cls');
    });
});
