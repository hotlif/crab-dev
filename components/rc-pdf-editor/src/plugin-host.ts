import { PdfEditorError, type PdfEditorPlugin, type PdfEditorPluginContext, type PdfEditorRef, type PdfEditorToolbarAction } from './types.js';

interface InstalledPlugin { plugin: PdfEditorPlugin; lifetime: AbortController; cleanup?: () => void }
interface PluginTask { pluginId: string; actionId: string; label: string }
interface PluginSnapshot { actions: readonly PdfEditorToolbarAction[]; task: PluginTask | null }

function abortable(task: Promise<void>, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        const cancel = () => reject(new PdfEditorError('cancelled', '插件任务已取消'));
        if (signal.aborted) cancel(); else signal.addEventListener('abort', cancel, { once: true });
        void task.then(() => { signal.removeEventListener('abort', cancel); resolve(); }, error => {
            signal.removeEventListener('abort', cancel); reject(error);
        });
    });
}

/** 插件实例归属当前编辑器，注册对象本身不保存任务状态。 */
export class PdfPluginHost {
    private editor?: PdfEditorRef;
    private readonly installed = new Map<string, InstalledPlugin>();
    private readonly listeners = new Set<() => void>();
    private snapshot: PluginSnapshot = { actions: [], task: null };
    private running?: { controller: AbortController; plugin: InstalledPlugin };
    private report: (error: PdfEditorError) => void = () => {};
    getSnapshot = () => this.snapshot;
    subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
    setEditor(editor: PdfEditorRef) { this.editor = editor; }
    private context(signal: AbortSignal): PdfEditorPluginContext {
        return { signal, getEditor: () => {
            if (signal.aborted || !this.editor) throw new PdfEditorError('cancelled', '插件已卸载或任务已取消');
            return this.editor;
        } };
    }
    private publish(task = this.snapshot.task) {
        const actions = [...this.installed.values()].flatMap(({ plugin }) => (plugin.actions ?? []).map(action => ({
            id: JSON.stringify([plugin.id, action.id]), label: action.label, icon: action.icon, placement: action.placement, visible: action.visible,
            disabled: (state: ReturnType<PdfEditorRef['getState']>) => (action.scope !== 'editor' && !state.document) ||
                (typeof action.disabled === 'function' ? action.disabled(state) : action.disabled === true),
            onSelect: () => this.run(plugin.id, action.id),
        })));
        this.snapshot = { actions, task }; this.listeners.forEach(listener => listener());
    }
    private remove(entry: InstalledPlugin) {
        this.installed.delete(entry.plugin.id); entry.lifetime.abort();
        try { entry.cleanup?.(); } catch (cause) { this.report(new PdfEditorError('plugin', `插件 ${entry.plugin.id} 清理失败`, { cause })); }
    }
    reconcile(plugins: readonly PdfEditorPlugin[], report: (error: PdfEditorError) => void) {
        this.report = report;
        const ids = new Set<string>();
        try {
            for (const plugin of plugins) {
                if (!plugin.id.trim() || ids.has(plugin.id)) throw new PdfEditorError('plugin', '插件 id 不能为空或重复');
                ids.add(plugin.id);
                const actions = new Set<string>();
                for (const action of plugin.actions ?? []) {
                    if (!action.id.trim() || !action.label.trim() || actions.has(action.id)) throw new PdfEditorError('plugin', `插件 ${plugin.id} 的动作 id / 名称无效或重复`);
                    actions.add(action.id);
                }
            }
        } catch (error) { report(error instanceof PdfEditorError ? error : new PdfEditorError('plugin', '插件配置无效', { cause: error })); return; }
        let changed = false;
        for (const entry of this.installed.values()) {
            if (!plugins.includes(entry.plugin)) { this.remove(entry); changed = true; }
        }
        for (const plugin of plugins) {
            if (this.installed.has(plugin.id)) continue;
            const entry: InstalledPlugin = { plugin, lifetime: new AbortController() };
            try {
                entry.cleanup = plugin.setup?.(this.context(entry.lifetime.signal)) || undefined;
                this.installed.set(plugin.id, entry); changed = true;
            } catch (cause) { entry.lifetime.abort(); report(new PdfEditorError('plugin', `插件 ${plugin.id} 安装失败`, { cause })); }
        }
        const ordered = plugins.flatMap(plugin => { const entry = this.installed.get(plugin.id); return entry ? [entry] : []; });
        if ([...this.installed.values()].some((entry, index) => entry !== ordered[index])) {
            this.installed.clear(); ordered.forEach(entry => this.installed.set(entry.plugin.id, entry)); changed = true;
        }
        if (changed) this.publish();
    }
    async run(pluginId: string, actionId: string): Promise<void> {
        const entry = this.installed.get(pluginId), action = entry?.plugin.actions?.find(value => value.id === actionId), editor = this.editor;
        if (!entry || !action || !editor) throw new PdfEditorError('plugin', '插件动作尚未安装');
        if (this.running) throw new PdfEditorError('busy', '已有插件任务正在进行');
        const state = editor.getState(), document = state.document;
        if (state.status !== 'ready' || state.pendingOperations.length) throw new PdfEditorError('busy', '编辑器尚未就绪或正在处理文档');
        if (action.scope !== 'editor' && !document) throw new PdfEditorError('document', '请先打开 PDF');
        if (action.visible === false || (typeof action.disabled === 'function' ? action.disabled(state) : action.disabled)) throw new PdfEditorError('permission', '插件动作不可用');
        const controller = new AbortController(), signal = AbortSignal.any([controller.signal, entry.lifetime.signal]);
        const running = { controller, plugin: entry }; this.running = running;
        const unsubscribe = editor.subscribe(() => {
            const next = editor.getState();
            if (next.status !== 'ready' || (action.scope !== 'editor' && (next.document?.sessionId !== document?.sessionId || next.document?.revision !== document?.revision))) controller.abort();
        });
        this.publish({ pluginId, actionId, label: action.label });
        try { await abortable(Promise.resolve().then(() => { if (!signal.aborted) return action.onSelect(this.context(signal)); }), signal); }
        finally {
            unsubscribe(); controller.abort();
            if (this.running === running) { this.running = undefined; this.publish(null); }
        }
    }
    cancel = () => { this.running?.controller.abort(); };
    dispose() {
        this.cancel();
        for (const entry of this.installed.values()) this.remove(entry);
        this.editor = undefined; this.publish(null);
    }
}
