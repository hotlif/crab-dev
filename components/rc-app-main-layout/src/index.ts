import AppMainLayout from "./layout.js";

export type { HeaderUserEntity, TabItem } from "./types.js";
export type { TabBarProps } from "./tabBar.js";

export {
    default as AppMainLayoutProvider,
    useAppMainLayoutContext,
    useAppMainLayoutState,
    useAppMainLayoutDispatch,
} from "./context.js";
export type {
    AppMainLayoutContextValue,
    AppMainLayoutProviderProps,
} from "./context.js";

export type { TabsState, TabsAction } from "./reducer.js";

export { default as useAppMainLayoutTabs } from "./useTabs.js";
export type {
    OpenTabOptions,
    UseAppMainLayoutTabsResult,
} from "./useTabs.js";

export default AppMainLayout;
