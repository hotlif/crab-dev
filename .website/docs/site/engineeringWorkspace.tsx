import { use, useState, type Key } from 'react';
import { css, cx } from '@crab-dev/css';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Button from '@crab-dev/rc-button';
import Dialog, { TokenVars as dialogVars } from '@crab-dev/rc-dialog';
import AutoSizer from '@crab-dev/rc-auto-sizer';
import SplitPane from '@crab-dev/rc-split-pane';
import Tree, { LoadStateType, NodeType, type Node } from '@crab-dev/rc-tree';
import Table, { type Row, type ColumnType } from '@crab-dev/rc-table';
import Tabs from '@crab-dev/rc-tabs';
import LineEdit from '@crab-dev/rc-line-edit';
import Select from '@crab-dev/rc-select';
import NumberEdit from '@crab-dev/rc-number-edit';
import TextEdit from '@crab-dev/rc-text-edit';
import token from '@crab-dev/rc-token-semantic';
import { DocumentDesignContext, SiteContext } from './siteContext.js';
import { tahoeWorkspace } from './engineeringWorkspace.styles.js';

const launcher = css`display: grid; gap: ${token.space['stack-gap']}; justify-items: start;`;
const dialog = css`
    ${dialogVars['root.min-width']}: min(1440px, calc(100vw - 48px));
    ${dialogVars['root.max-width']}: calc(100vw - 32px);
    ${dialogVars['root.max-height']}: calc(100dvh - 32px);
    ${dialogVars['root.top']}: 16px;
    ${dialogVars['root.padding']}: 0;
    &[data-workspace-design="macos"] {
        ${dialogVars['material.backdrop-filter']}: none;
        ${dialogVars['material.background-image']}: none;
        ${dialogVars['root.background-color']}: transparent;
    }
`;
const windowStyle = css`
    color: ${token.color.text.primary}; background: ${token.color.workspace.toolbar};
    font-size: ${token.font.size.body}; line-height: ${token.font['line-height'].body};
    font-weight: ${token.font.weight.body}; font-synthesis: none;
    min-width: 0; overflow: auto;
    & strong { font-weight: ${token.font.weight.strong}; }
`;
const header = css`
    display: flex; align-items: center; justify-content: space-between; gap: ${token.space['group-gap']};
    padding: ${token.space['component-gap']} ${token.space['group-gap']};
    min-height: 40px;
    & strong { font-size: ${token.font.size.body}; }
    & p { margin: 0; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
`;
const inline = css`display: flex; align-items: center; gap: ${token.space['stack-gap']}; flex-wrap: wrap;`;
const titleGroup = css`display: flex; align-items: center; gap: ${token.space['component-gap']};`;
const appIcon = css`
    display: grid; place-items: center; width: 32px; height: 32px;
    border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.control};
    background: ${token.color.surface.raised}; color: ${token.color.text.secondary};
`;
const navigation = css`padding: 0 ${token.space['component-gap']};`;
const workspace = css`
    height: min(650px, calc(100dvh - 170px)); min-height: 480px; min-width: 1120px;
    display: grid; grid-template-rows: minmax(0, 1fr) auto;
`;
const panel = css`
    height: 100%; min-width: 0; box-sizing: border-box; overflow: auto;
    padding: ${token.space['component-gap']} ${token.space['stack-gap']} ${token.space['component-gap']} 0;
    & h3 { margin: 0; font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.label}; }
`;
const navigator = css`
    height: 100%; display: grid; grid-template-rows: auto 1fr auto; gap: ${token.space['stack-gap']};
    background-color: ${token.material.background}; background-image: ${token.material.sheen};
    backdrop-filter: ${token.material.filter}; box-shadow: ${token.material.shadow};
    border: 1px solid ${token.material.border}; border-radius: ${token.shape.card};
    padding: ${token.space['stack-gap']}; box-sizing: border-box;
`;
const sectionTitle = css`
    padding: ${token.space['stack-gap']} ${token.space['stack-gap']} 0;
    display: flex; justify-content: space-between; align-items: center; color: ${token.color.text.secondary};
`;
const center = css`
    height: 100%; min-width: 0; display: grid; grid-template-rows: auto auto minmax(0, 1fr) auto;
    background: ${token.color.surface.content}; border-radius: ${token.shape.card} 0 0 0; overflow: hidden;
`;
const toolbar = css`
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
    gap: ${token.space['stack-gap']}; padding: ${token.space['component-gap']} ${token.space['component-gap']} ${token.space['stack-gap']};
`;
const commands = css`
    display: flex; align-items: center; gap: ${token.space['inline-gap']};
    padding: ${token.space['inline-gap']}; border-radius: ${token.shape.control};
    border: 1px solid ${token.material.border}; background: ${token.material.background};
    backdrop-filter: ${token.material.filter}; box-shadow: ${token.material['control-shadow']};
`;
const filters = css`
    display: grid; grid-template-columns: minmax(180px, 320px) 128px auto; align-items: center; justify-content: start;
    gap: ${token.space['stack-gap']}; padding: 0 ${token.space['component-gap']} ${token.space['component-gap']};
    border-bottom: 1px solid ${token.color.border.subtle};
`;
const measured = css`height: 100%; min-height: 0; min-width: 0;`;
const caption = css`font-size: ${token.font.size.caption}; color: ${token.color.text.secondary};`;
const footer = css`
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
    padding: ${token.space['stack-gap']} ${token.space['component-gap']}; min-height: 16px;
    border-top: 1px solid ${token.color.border.subtle};
    font-size: ${token.font.size.caption}; color: ${token.color.text.secondary};
`;
const inspector = css`
    height: 100%; box-sizing: border-box; overflow: auto; padding: ${token.space['component-gap']} ${token.space['group-gap']};
    border-inline-start: 1px solid ${token.material.border}; background: ${token.material.background};
    backdrop-filter: ${token.material.filter};
    display: flex; flex-direction: column; gap: ${token.space['component-gap']};
    & h3 { margin: 0; font-size: ${token.font.size.subhead}; }
    & p { margin: 0; }
`;
const fields = css`display: grid; gap: ${token.space['component-gap']}; padding-block: ${token.space['component-gap']}; border-block: 1px solid ${token.color.border.subtle};`;
const facts = css`
    display: grid; gap: ${token.space['stack-gap']}; margin: 0; padding-block: ${token.space['stack-gap']};
    & div { display: grid; grid-template-columns: 72px 1fr; gap: ${token.space['stack-gap']}; align-items: baseline; }
    & dt { color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
    & dd { margin: 0; font-variant-numeric: tabular-nums; }
`;
const equipmentTitle = css`display: grid; gap: ${token.space['stack-gap']}; padding-block: ${token.space['stack-gap']};`;
const inspectorHeader = css`display: flex; align-items: center; justify-content: space-between; gap: ${token.space['stack-gap']};`;
const hint = css`margin-top: auto; padding-top: ${token.space['component-gap']}; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption};`;
const statusStyle = css`
    display: inline-flex; gap: ${token.space['inline-gap']}; align-items: center;
    &[data-status='待保养'] { color: ${token.color.feedback.warning.text}; }
    &[data-status='检修中'] { color: ${token.color.feedback.error.text}; }
    &[data-status='运行中'] { color: ${token.color.feedback.success.text}; }
    &[data-selected='true'] { color: inherit; }
`;

function WorkspaceIcon({ kind }: { kind: 'plant' | 'system' | 'asset' | 'refresh' | 'add' | 'close' | 'previous' | 'next' }) {
    const paths = {
        plant: 'M3 20V9l6 3V9l5 3V4h5v16H3ZM6 16h1m3 0h1m3 0h1m3 0h1',
        system: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z',
        asset: 'M5 4h14v16H5V4Zm4 4h6m-6 4h6m-6 4h3',
        refresh: 'M20 7v5h-5M4 17v-5h5m10-3a7 7 0 0 0-12-3L4 9m16 6-3 3a7 7 0 0 1-12-3',
        add: 'M12 5v14M5 12h14',
        close: 'm6 6 12 12M6 18 18 6',
        previous: 'm14 6-6 6 6 6',
        next: 'm10 6 6 6-6 6',
    };
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={paths[kind]} /></svg>;
}

interface Asset extends Row {
    dataRef: { code: string; name: string; system: string; status: string; owner: string; inspected: string; due: string; cycle: number; note: string };
}
const seed: Asset[] = [
    ['CW-101', '循环水泵 A', '循环水系统', '运行中', '陈工'],
    ['CW-102', '循环水泵 B', '循环水系统', '待保养', '陈工'],
    ['CW-103', '冷却塔风机', '循环水系统', '运行中', '王工'],
    ['CW-104', '补水泵', '循环水系统', '备用', '陈工'],
    ['CW-105', '板式换热器', '循环水系统', '检修中', '李工'],
    ['CW-106', '旁滤装置', '循环水系统', '运行中', '李工'],
    ['AC-201', '空压机 01', '压缩空气系统', '运行中', '周工'],
    ['AC-202', '空压机 02', '压缩空气系统', '运行中', '周工'],
    ['AC-203', '冷冻式干燥机', '压缩空气系统', '待保养', '周工'],
    ['AC-204', '储气罐', '压缩空气系统', '运行中', '王工'],
    ['AS-301', '装配输送线', '1号装配线', '运行中', '赵工'],
    ['AS-302', '拧紧工作站', '1号装配线', '运行中', '赵工'],
    ['AS-303', '检验工作站', '1号装配线', '备用', '王工'],
    ['AS-304', '自动上料机', '1号装配线', '待保养', '赵工'],
    ['EL-401', '低压配电柜', '电气与动力', '运行中', '孙工'],
    ['EL-402', '变频控制柜', '电气与动力', '运行中', '孙工'],
].map(([code, name, system, status, owner], index) => ({ id: code!, dataRef: { code: code!, name: name!, system: system!, status: status!, owner: owner!, inspected: '2026-11-10', due: index % 4 === 1 ? '2026-11-13' : '2026-12-10', cycle: 30, note: index === 1 ? '计划更换机械密封；停机前确认备用泵可用。' : '按设备标准点检表执行。' } }));
const plant: Node = { id: 'plant', title: '华东工厂', parent: null, icon: <WorkspaceIcon kind="plant" />, type: NodeType.FOLDER, loadState: LoadStateType.LOADING_COMPLETED };
const utilities: Node = { ...plant, id: 'utilities', title: '公用工程', icon: <WorkspaceIcon kind="system" />, parent: plant };
const assembly: Node = { ...plant, id: 'assembly', title: '装配车间', icon: <WorkspaceIcon kind="system" />, parent: plant };
const nodes: Node[] = [plant, utilities, assembly, ...['循环水系统', '压缩空气系统', '1号装配线', '电气与动力'].map((name, index) => ({ ...plant, id: name, title: name, type: NodeType.FILE, icon: <WorkspaceIcon kind="asset" />, parent: index < 2 ? utilities : index === 2 ? assembly : plant }))];
const loadNodes = async (parent: Node | null) => nodes.filter(node => (node.parent?.id ?? null) === (parent?.id ?? null));
function Status({ value, selected = false }: { value: string; selected?: boolean }) {
    return <span className={statusStyle} data-status={value} data-selected={selected || undefined}><span aria-hidden>{value === '待保养' ? '▲' : value === '检修中' ? '◆' : '●'}</span>{value}</span>;
}

function AssetWorkbench({ maintenance = false }: { maintenance?: boolean }) {
    const { design } = use(DocumentDesignContext);
    const [rows, setRows] = useState(seed);
    const [treeNodes, setTreeNodes] = useState(nodes);
    const [selected, setSelected] = useState<Key>('CW-102');
    const [scope, setScope] = useState<Key[]>(['plant']);
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('全部状态');
    const [drafts, setDrafts] = useState<Record<string, { cycle: number; note: string }>>({});
    const [feedback, setFeedback] = useState('本地示例 · 数据更新于 09:42');
    const active = rows.find(row => row.id === selected) ?? rows[0]!;
    const draft = drafts[String(active.id)] ?? { cycle: active.dataRef.cycle, note: active.dataRef.note };
    const dirty = draft.cycle !== active.dataRef.cycle || draft.note !== active.dataRef.note;
    const visibleRows = rows.filter(row => {
        const group = scope[0];
        const inScope = !group || group === 'plant' || group === row.dataRef.system || (group === 'utilities' && ['循环水系统', '压缩空气系统'].includes(row.dataRef.system)) || (group === 'assembly' && row.dataRef.system === '1号装配线');
        return inScope && (!maintenance || row.dataRef.status === '待保养') && (status === '全部状态' || row.dataRef.status === status) && `${row.dataRef.code} ${row.dataRef.name}`.toLowerCase().includes(query.toLowerCase());
    });
    const columns: ColumnType<Asset>[] = [
        { name: '$.code', title: '设备编号', width: 100, fixed: 'left', sortable: true },
        { name: '$.name', title: '设备名称', width: 150 },
        { name: '$.status', title: '状态', width: 90, render: ({ row }) => <Status value={row.dataRef.status} selected={design === 'macos' && row.id === selected} /> },
        { name: '$.system', title: '所属系统', width: 116 },
        { name: '$.owner', title: '负责人', width: 68 },
        { name: '$.inspected', title: '最近点检', width: 108, sortable: true },
        { name: '$.due', title: '下次保养', width: 108, sortable: true },
    ];
    const activeIndex = visibleRows.findIndex(row => row.id === active.id);
    const moveDevice = (offset: number) => {
        const next = visibleRows[activeIndex + offset];
        if (next) setSelected(next.id);
    };
    const fitColumns = (width: number) => {
        const spare = Math.max(0, width - columns.reduce((total, column) => total + (column.width ?? 0), 0));
        return columns.map(column => ({ ...column, width: (column.width ?? 0) + spare * (column.name === '$.name' ? 0.5 : column.name === '$.system' ? 0.3 : column.name === '$.due' ? 0.2 : 0) }));
    };
    const updateDraft = (next: Partial<typeof draft>) => setDrafts(current => ({ ...current, [String(active.id)]: { ...draft, ...next } }));
    return <div className={workspace}>
        <SplitPane defaultSize={228} min={200} max={320} aria-label="调整设备树宽度">
            <aside className={panel} data-workspace-part="sidebar-inset" aria-label="设备范围">
                <div className={navigator} data-workspace-part="sidebar">
                    <div className={sectionTitle}><h3>设备范围</h3><span className={caption}>{rows.length} 台</span></div>
                    <AutoSizer className={measured}>{({ width, height }) => <Tree aria-label="工厂设备树" width={width} height={height} treeData={treeNodes} onTreeNodeChange={setTreeNodes} loadData={loadNodes} defaultExpandedKeys={['plant', 'utilities', 'assembly']} selectedKeys={scope} onSelectedKeysChange={setScope} />}</AutoSizer>
                    <div className={caption}>按位置与设备系统归类</div>
                </div>
            </aside>
            <SplitPane primary="second" defaultSize={292} min={268} max={360} aria-label="调整属性面板宽度">
                <section className={center} data-workspace-part="content" aria-label={maintenance ? '保养任务' : '设备台账'}>
                    <div className={toolbar} data-workspace-part="toolbar"><div className={inline}><strong>{maintenance ? '待执行保养' : '设备资产'}</strong><span className={caption}>华东工厂 / {visibleRows.length} 台设备</span></div><div className={commands} data-workspace-part="commands" role="group" aria-label="设备操作"><Button appearance="text" size="s" icon={<WorkspaceIcon kind="refresh" />} onClick={() => setFeedback('本地示例已刷新 · 设备数据已就绪')}>刷新</Button><Button appearance={design === 'macos' ? 'text' : 'primary'} data-workspace-part="create" size="s" icon={<WorkspaceIcon kind="add" />} onClick={() => setFeedback(`已为 ${active.dataRef.code} 创建本地保养工单`)}>创建工单</Button></div></div>
                    <div className={filters} data-workspace-part="filters"><LineEdit aria-label="搜索设备" placeholder="搜索设备编号或名称" value={query} onValueChange={setQuery} /><Select aria-label="筛选设备状态" value={status} onValueChange={value => setStatus(String(value))} options={['全部状态', '运行中', '待保养', '检修中', '备用'].map(value => ({ value, label: value }))} /><Button appearance="text" size="s" onClick={() => { setQuery(''); setStatus('全部状态'); setScope(['plant']); }}>重置</Button></div>
                    {/* Run after cell selection clears the previous editor focus. */}
                    <div className={measured} data-workspace-part="table"><AutoSizer className={measured}>{({ width, height }) => <Table aria-label="设备列表" width={width} height={height} rows={visibleRows} columns={fitColumns(width)} resizable rowSelection={{ type: 'radio', showColumn: false, selectedRowIds: new Set([selected]) }} onMouseDown={event => { if (design === 'macos') event.currentTarget.focus({ preventScroll: true }); }} onRowClick={row => setSelected(row.id)} />}</AutoSizer></div>
                    <div className={footer} data-workspace-part="footer"><span>共 {visibleRows.length} 台 · 当前设备 {active.dataRef.code}</span><span>单击设备查看属性</span></div>
                </section>
                <aside className={inspector} data-workspace-part="inspector" aria-label="设备属性">
                    <div className={inspectorHeader}><div className={inline}><WorkspaceIcon kind="asset" /><strong>设备属性</strong></div><div className={inline}><Button appearance="text" size="xs" aria-label="上一台设备" icon={<WorkspaceIcon kind="previous" />} disabled={activeIndex <= 0} onClick={() => moveDevice(-1)} /><Button appearance="text" size="xs" aria-label="下一台设备" icon={<WorkspaceIcon kind="next" />} disabled={visibleRows.length === 0 || activeIndex >= visibleRows.length - 1} onClick={() => moveDevice(1)} /></div></div>
                    <div className={equipmentTitle} data-workspace-part="identity"><p className={caption}>{active.dataRef.code}</p><h3>{active.dataRef.name}</h3><Status value={active.dataRef.status} /></div>
                    <dl className={facts} data-workspace-part="facts"><div><dt>所属系统</dt><dd>{active.dataRef.system}</dd></div><div><dt>负责人</dt><dd>{active.dataRef.owner}</dd></div><div><dt>最近点检</dt><dd>{active.dataRef.inspected}</dd></div><div><dt>下次保养</dt><dd>{active.dataRef.due}</dd></div></dl>
                    <div className={fields} data-workspace-part="fields"><strong>保养参数</strong><NumberEdit label="保养周期（天）" min={1} max={365} value={draft.cycle} onValueChange={value => updateDraft({ cycle: value ?? 30 })} /><TextEdit label="工作备注" rows={4} value={draft.note} onValueChange={note => updateDraft({ note })} /></div>
                    <div className={inline}><Button appearance="primary" size="s" disabled={!dirty} onClick={() => { setRows(current => current.map(row => row.id === active.id ? { ...row, dataRef: { ...row.dataRef, ...draft } } : row)); setFeedback(`${active.dataRef.code} 的保养参数已保存到本地示例`); }}>保存修改</Button><Button appearance={design === 'macos' ? 'text' : 'outlined'} size="s" disabled={!dirty} onClick={() => { setDrafts(current => ({ ...current, [String(active.id)]: { cycle: active.dataRef.cycle, note: active.dataRef.note } })); setFeedback('已恢复当前设备的已保存参数'); }}>还原</Button></div>
                    <p className={hint}>草稿随设备保留，仅保存到本页。</p>
                </aside>
            </SplitPane>
        </SplitPane>
        <output className={footer} data-workspace-part="footer" aria-live="polite">{feedback}</output>
    </div>;
}

export default function EngineeringWorkspace() {
    const [open, setOpen] = useState(false);
    const { design } = use(DocumentDesignContext);
    const site = use(SiteContext);
    return <ConfigProvider designSystem={design} colorMode={site?.theme.resolved} size="small" density="compact">
        <div className={launcher}><Button appearance="outlined" onClick={() => setOpen(true)}>打开工程设备工作台</Button><span className={caption}>设备树、可调分栏、数据表格、属性编辑与多任务页签。示例数据仅在页面内修改。</span></div>
        <Dialog className={dialog} data-workspace-design={design} open={open} onOpenChange={setOpen} header={null} footer={null} shouldResetContent={false} aria-label="工程设备工作台">
            <section className={cx(windowStyle, tahoeWorkspace)} data-workspace-design={design} data-workspace-mode={site?.theme.resolved ?? 'light'} aria-label="工程管理与设备运维">
                <div data-workspace-part="backdrop" aria-hidden="true" />
                <header className={header} data-workspace-part="window-header"><div className={titleGroup}><span className={appIcon} data-workspace-part="app-icon"><WorkspaceIcon kind="plant" /></span><div><strong>工程设备工作台</strong><p>华东工厂 · 设备管理</p></div></div><div className={inline}><span className={caption}>设备工程师 · 陈工</span><Button appearance="text" size="s" aria-label="关闭工作台" icon={<WorkspaceIcon kind="close" />} onClick={() => setOpen(false)} /></div></header>
                <Tabs className={navigation} data-workspace-part="navigation" aria-label="工作任务" destroyInactiveTabPane={false} items={[{ key: 'assets', label: '设备台账', children: <AssetWorkbench /> }, { key: 'maintenance', label: '保养工单 · 3', children: <AssetWorkbench maintenance /> }]} />
            </section>
        </Dialog>
    </ConfigProvider>;
}
