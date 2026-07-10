import { createContext } from 'react';
import type { CardSize } from './types.js';

export interface CardContextValue {
    /**
     * 卡片尺寸档位, 供区块子组件感知
     */
    size: CardSize;

    /**
     * 整卡是否可点击：为 true 时 Header extra / Footer 内的点击
     * 需与整卡 onClick 隔离（stopPropagation）
     */
    clickable: boolean;
}

export const CardContext = createContext<CardContextValue>({
    size: 'middle',
    clickable: false,
});
