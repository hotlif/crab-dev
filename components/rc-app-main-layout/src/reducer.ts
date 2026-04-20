import type { Key } from "react";
import type { TabItem } from "./types.js";

export interface TabsState {
    tabs: TabItem[]
    activeKey: Key | undefined
    reloadVersions: ReadonlyMap<Key, number>
}

export type TabsAction =
    | { type: "open", tab: TabItem, activate?: boolean, reloadIfExists?: boolean }
    | { type: "close", key: Key }
    | { type: "closeOthers", key: Key }
    | { type: "closeAll" }
    | { type: "activate", key: Key }
    | { type: "reorder", keys: Key[] }
    | { type: "reload", key?: Key };

export const initialTabsState: TabsState = {
    tabs: [],
    activeKey: undefined,
    reloadVersions: new Map(),
};

function reorderTabsByKeys(items: TabItem[], keys: Key[]): TabItem[] {
    const itemMap = new Map(items.map((item) => [item.key, item]));
    return keys.map((key) => itemMap.get(key)).filter((item): item is TabItem => !!item);
}

function pickNextActiveKey(items: TabItem[], closingKey: Key): Key | undefined {
    const closingIndex = items.findIndex((item) => item.key === closingKey);
    if (closingIndex < 0) return items[0]?.key;

    const next = items.filter((item) => item.key !== closingKey);
    if (next.length === 0) return undefined;

    const fallbackIndex = Math.min(closingIndex, next.length - 1);
    return next[fallbackIndex]?.key;
}

function bumpVersion(map: ReadonlyMap<Key, number>, key: Key): ReadonlyMap<Key, number> {
    const next = new Map(map);
    next.set(key, (next.get(key) ?? 0) + 1);
    return next;
}

function dropVersions(map: ReadonlyMap<Key, number>, removedKeys: ReadonlySet<Key>): ReadonlyMap<Key, number> {
    if (removedKeys.size === 0) return map;
    let mutated = false;
    let next: Map<Key, number> | null = null;
    for (const key of removedKeys) {
        if (map.has(key)) {
            if (!mutated) {
                next = new Map(map);
                mutated = true;
            }
            next!.delete(key);
        }
    }
    return mutated ? next! : map;
}

function isClosable(item: TabItem): boolean {
    return item.closable !== false;
}

export function tabsReducer(state: TabsState, action: TabsAction): TabsState {
    switch (action.type) {
        case "open": {
            const { tab, activate = true, reloadIfExists = false } = action;
            const exists = state.tabs.some((item) => item.key === tab.key);
            let nextTabs = state.tabs;
            let nextReloadVersions = state.reloadVersions;

            if (!exists) {
                nextTabs = [...state.tabs, tab];
            } else if (reloadIfExists) {
                nextReloadVersions = bumpVersion(state.reloadVersions, tab.key);
            }

            return {
                tabs: nextTabs,
                activeKey: activate ? tab.key : state.activeKey,
                reloadVersions: nextReloadVersions,
            };
        }
        case "close": {
            const exists = state.tabs.some((item) => item.key === action.key);
            if (!exists) return state;

            const nextTabs = state.tabs.filter((item) => item.key !== action.key);
            const nextActiveKey = state.activeKey === action.key
                ? pickNextActiveKey(state.tabs, action.key)
                : state.activeKey;

            let nextReloadVersions = state.reloadVersions;
            if (state.reloadVersions.has(action.key)) {
                const copy = new Map(state.reloadVersions);
                copy.delete(action.key);
                nextReloadVersions = copy;
            }

            return {
                tabs: nextTabs,
                activeKey: nextActiveKey,
                reloadVersions: nextReloadVersions,
            };
        }
        case "closeOthers": {
            const target = state.tabs.find((item) => item.key === action.key);
            if (!target) return state;

            const removedKeys = new Set<Key>();
            const nextTabs = state.tabs.filter((item) => {
                if (item.key === action.key) return true;
                if (!isClosable(item)) return true;
                removedKeys.add(item.key);
                return false;
            });
            if (removedKeys.size === 0) return state;

            return {
                tabs: nextTabs,
                activeKey: action.key,
                reloadVersions: dropVersions(state.reloadVersions, removedKeys),
            };
        }
        case "closeAll": {
            const removedKeys = new Set<Key>();
            const nextTabs = state.tabs.filter((item) => {
                if (!isClosable(item)) return true;
                removedKeys.add(item.key);
                return false;
            });
            if (removedKeys.size === 0) return state;

            const activeStillExists = state.activeKey !== undefined
                && nextTabs.some((item) => item.key === state.activeKey);
            const nextActiveKey = activeStillExists ? state.activeKey : nextTabs[0]?.key;

            return {
                tabs: nextTabs,
                activeKey: nextActiveKey,
                reloadVersions: dropVersions(state.reloadVersions, removedKeys),
            };
        }
        case "activate": {
            if (state.activeKey === action.key) return state;
            return { ...state, activeKey: action.key };
        }
        case "reorder": {
            return { ...state, tabs: reorderTabsByKeys(state.tabs, action.keys) };
        }
        case "reload": {
            const targetKey = action.key ?? state.activeKey;
            if (typeof targetKey === "undefined") return state;
            return { ...state, reloadVersions: bumpVersion(state.reloadVersions, targetKey) };
        }
        default:
            return state;
    }
}
