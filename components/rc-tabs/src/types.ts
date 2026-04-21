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

interface BaseTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    items: TabsItem[];
    activeKey?: string;
    defaultActiveKey?: string;
    type?: TabsType;
    size?: TabsSize;
    centered?: boolean;
    destroyInactiveTabPane?: boolean;
    tabBarExtraContent?: ReactNode | TabsBarExtraContent;
    onChange?: (activeKey: string) => void;
    onTabClose?: (key: string, event: ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>) => void;
}

export type TabsProps = BaseTabsProps;
