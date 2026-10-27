import type { ControlledValueProps } from '@crab-dev/rc-hooks';
import type {
    CSSProperties,
    HTMLAttributes,
    KeyboardEvent as ReactKeyboardEvent,
    MouseEvent as ReactMouseEvent,
    ReactNode,
} from 'react';

export interface TabsItem {
    key: string;
    label: ReactNode;
    children?: ReactNode;
    disabled?: boolean;
    closable?: boolean;
    icon?: ReactNode;
    className?: string;
    style?: CSSProperties;
}

export type TabsType = 'line' | 'card' | 'pill';

export type TabsSize = 'small' | 'medium' | 'large';

export interface TabsBarExtraContent {
    left?: ReactNode;
    right?: ReactNode;
}

interface BaseTabsProps extends HTMLAttributes<HTMLDivElement> {
    items: TabsItem[];

    type?: TabsType;
    size?: TabsSize;
    centered?: boolean;
    destroyInactiveTabPane?: boolean;
    tabBarExtraContent?: ReactNode | TabsBarExtraContent;

    onTabClose?: (key: string, event: ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>) => void;
}

export interface TabsChangeDetails {
    reason: 'pointer' | 'keyboard';
    event?: ReactMouseEvent<HTMLButtonElement> | ReactKeyboardEvent<HTMLButtonElement>;
}

export type TabsProps = BaseTabsProps & ControlledValueProps<string, TabsChangeDetails>;
