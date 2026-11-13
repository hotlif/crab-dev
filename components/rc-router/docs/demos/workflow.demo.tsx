import { useState } from 'react';
import Button from '@crab-dev/rc-button';
import LineEdit from '@crab-dev/rc-line-edit';
import Router, { Link, Outlet, useBlocker, useMatches, useSearchParams } from '@crab-dev/rc-router';
import type { RouteErrorBoundaryProps, RouteObject } from '@crab-dev/rc-router';

interface PageHandle { title: string }

function Layout() {
    const matches = useMatches<PageHandle>();
    return <section>
        <h3>{matches.at(-1)?.handle?.title ?? '工作区'}</h3>
        <nav aria-label="工作区导航"><Link to="/">概览</Link>{' '}<Link to="/edit?workspace=demo">编辑草稿</Link>{' '}<Link to="/broken">失败页面</Link></nav>
        <Outlet />
    </section>;
}

function Editor() {
    const [draft, setDraft] = useState('初始草稿');
    const [saved, setSaved] = useState('初始草稿');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [params] = useSearchParams();
    const blocker = useBlocker(({ currentLocation, nextLocation }) =>
        draft !== saved && currentLocation.pathname !== nextLocation.pathname,
    );
    async function saveAndLeave(fail: boolean) {
        setSaving(true);
        setError('');
        try {
            // This self-contained demo simulates a save; replace with the app API.
            await Promise.resolve();
            if (fail) throw new Error('保存失败，草稿仍保留，可重试或取消离开。');
            setSaved(draft);
            if (blocker.state === 'blocked') blocker.proceed();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : '保存失败');
        } finally {
            setSaving(false);
        }
    }
    return <section>
        <p>工作区：{params.get('workspace')}。修改草稿后点击概览，检查离开确认。</p>
        <LineEdit aria-label="工作区草稿" value={draft} onValueChange={setDraft} />
        {error && <p role="alert">{error}</p>}
        {blocker.state === 'blocked' && <section aria-label="未保存草稿" aria-live="polite">
            <p>草稿未保存，即将前往 {blocker.location.pathname}。</p>
            <Button disabled={saving} onClick={blocker.reset}>继续编辑</Button>{' '}
            <Button disabled={saving} onClick={() => saveAndLeave(true)}>模拟保存失败</Button>{' '}
            <Button disabled={saving} onClick={() => saveAndLeave(false)}>保存并离开</Button>
        </section>}
    </section>;
}

function BrokenPage(): never { throw new Error('示例页面发生渲染错误。'); }
function PageError({ error }: RouteErrorBoundaryProps) {
    return <section role="alert"><p>{error instanceof Error ? error.message : '页面失败'}</p>
        <p>导航仍可使用，返回概览后可继续编辑。</p><Link to="/">返回概览</Link></section>;
}

const routes: RouteObject<PageHandle>[] = [{
    id: 'workspace', Component: Layout, children: [
        { id: 'home', path: '/', handle: { title: '工作区概览' }, element: <p>编辑草稿演示导航阻断；失败页面演示局部错误恢复。</p> },
        { id: 'editor', path: '/edit', handle: { title: '编辑器' }, Component: Editor },
        { id: 'broken', path: '/broken', handle: { title: '错误隔离' }, Component: BrokenPage, ErrorBoundary: PageError },
    ],
}];

export default function WorkflowDemo() {
    const [routerWindow, setRouterWindow] = useState<Window | null>(null);
    return <>
        <iframe hidden title="工作区示例的独立 History" src="./history-frame.html" onLoad={event => {
            const target = event.currentTarget.contentWindow;
            if (!target) return;
            target.history.replaceState(null, '', '/');
            setRouterWindow(target);
        }} />
        {routerWindow && <Router routes={routes} window={routerWindow} />}
    </>;
}

export const meta = {
    title: '工作区离开确认与错误恢复',
    description: '父布局读取页面元数据，保存失败保留草稿，错误页面不影响导航',
    group: 'navigation', component: 'Router 路由', order: 20, args: {},
};
