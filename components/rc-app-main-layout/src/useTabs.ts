import { useCallback, useMemo } from "react";
import type { Key } from "react";
import type { TabItem } from "./types.js";
import { useAppMainLayoutContext } from "./context.js";

export interface OpenTabOptions {
    /** 打开后是否切换为激活标签，默认 true */
    activate?: boolean
    /** 若标签已存在，是否触发 reload，默认 false */
    reloadIfExists?: boolean
}

export interface UseAppMainLayoutTabsResult {
    tabs: TabItem[]
    activeTabKey: Key | undefined
    reloadVersions: ReadonlyMap<Key, number>
    openTab: (tab: TabItem, options?: OpenTabOptions) => void
    closeTab: (key: Key) => void
    /** 关闭除指定 key 以外的所有可关闭标签；不可关闭（closable=false）的标签会被保留 */
    closeOtherTabs: (key: Key) => void
    /** 关闭所有可关闭标签；不可关闭（closable=false）的标签会被保留 */
    closeAllTabs: () => void
    activateTab: (key: Key) => void
    reorderTabs: (keys: Key[]) => void
    reloadTab: (key?: Key) => void
    getReloadVersion: (key: Key) => number
}

/** 语义化的 tabs 操作 hook。必须在 `<AppMainLayoutProvider>` 中使用。 */
export default function useAppMainLayoutTabs(): UseAppMainLayoutTabsResult {
    const { state, dispatch } = useAppMainLayoutContext();
    const { tabs, activeKey, reloadVersions } = state;

    const openTab = useCallback((tab: TabItem, options?: OpenTabOptions) => {
        dispatch({
            type: "open",
            tab,
            activate: options?.activate,
            reloadIfExists: options?.reloadIfExists,
        });
    }, [dispatch]);

    const closeTab = useCallback((key: Key) => {
        dispatch({ type: "close", key });
    }, [dispatch]);

    const closeOtherTabs = useCallback((key: Key) => {
        dispatch({ type: "closeOthers", key });
    }, [dispatch]);

    const closeAllTabs = useCallback(() => {
        dispatch({ type: "closeAll" });
    }, [dispatch]);

    const activateTab = useCallback((key: Key) => {
        dispatch({ type: "activate", key });
    }, [dispatch]);

    const reorderTabs = useCallback((keys: Key[]) => {
        dispatch({ type: "reorder", keys });
    }, [dispatch]);

    const reloadTab = useCallback((key?: Key) => {
        dispatch({ type: "reload", key });
    }, [dispatch]);

    const getReloadVersion = useCallback(
        (key: Key) => reloadVersions.get(key) ?? 0,
        [reloadVersions],
    );

    return useMemo(() => ({
        tabs,
        activeTabKey: activeKey,
        reloadVersions,
        openTab,
        closeTab,
        closeOtherTabs,
        closeAllTabs,
        activateTab,
        reorderTabs,
        reloadTab,
        getReloadVersion,
    }), [tabs, activeKey, reloadVersions, openTab, closeTab, closeOtherTabs, closeAllTabs, activateTab, reorderTabs, reloadTab, getReloadVersion]);
}
