import type { ReactElement } from 'react';

import DividerImpl from './divider.js';
import type { DividerProps } from './types.js';

/**
 * 对外收窄为可辨识联合：竖线不可嵌文字、带文字的线不可声明 decorative,
 * 非法组合在编译期即拼不出来（见 types.ts）。
 *
 * 实现侧保持扁平签名, 是为了让 react-docgen 能提取出完整的 API 属性表——
 * 顶层联合会让文档站的说明与类型整列丢空。
 */
const Divider: (props: DividerProps) => ReactElement = DividerImpl;

export type {
    DividerDirection,
    DividerLineProps,
    DividerOwnProps,
    DividerProps,
    DividerSpacing,
    DividerTextAlign,
    DividerVariant,
    DividerVerticalProps,
    DividerWithTextProps,
} from './types.js';

export default Divider;
