import {
    createContext,
    useContext,
    useMemo,
    useReducer,
    type Dispatch,
    type Key,
    type ReactNode,
} from "react";
import type { TabItem } from "./types.js";
import { initialTabsState, tabsReducer, type TabsAction, type TabsState } from "./reducer.js";

export interface AppMainLayoutContextValue {
    state: TabsState
    dispatch: Dispatch<TabsAction>
}

const AppMainLayoutContext = createContext<AppMainLayoutContextValue | null>(null);

export function useAppMainLayoutContext(): AppMainLayoutContextValue {
    const ctx = useContext(AppMainLayoutContext);
    if (!ctx) {
        throw new Error("useAppMainLayoutContext must be used within <AppMainLayoutProvider>");
    }
    return ctx;
}

export function useAppMainLayoutState(): TabsState {
    return useAppMainLayoutContext().state;
}

export function useAppMainLayoutDispatch(): Dispatch<TabsAction> {
    return useAppMainLayoutContext().dispatch;
}

export interface AppMainLayoutProviderProps {
    /** 初始标签列表 */
    initialTabs?: TabItem[]
    /** 初始激活标签 key；未传时取 initialTabs[0]?.key */
    initialActiveTabKey?: Key
    children?: ReactNode
}

function initState(args: { initialTabs: TabItem[], initialActiveTabKey?: Key }): TabsState {
    return {
        ...initialTabsState,
        tabs: args.initialTabs,
        activeKey: args.initialActiveTabKey ?? args.initialTabs[0]?.key,
    };
}

export default function AppMainLayoutProvider({
    initialTabs = [],
    initialActiveTabKey,
    children,
}: AppMainLayoutProviderProps) {
    const [state, dispatch] = useReducer(
        tabsReducer,
        { initialTabs, initialActiveTabKey },
        initState,
    );
    const value = useMemo(() => ({ state, dispatch }), [state]);

    return (
        <AppMainLayoutContext.Provider value={value}>
            {children}
        </AppMainLayoutContext.Provider>
    );
}
