import type { ComponentPropsWithRef, CSSProperties, Key, ReactNode } from 'react';

type DivProps = Omit<ComponentPropsWithRef<'div'>, 'children'>;

/** 用原生 Flexbox 排列直接传入的子元素。 */
export interface FlexLayoutProps extends DivProps {
    /** 主轴方向，默认 row。 */
    direction?: CSSProperties['flexDirection'];
    /** 换行方式，默认 nowrap。 */
    wrap?: CSSProperties['flexWrap'];
    /** 交叉轴对齐方式。 */
    align?: CSSProperties['alignItems'];
    /** 主轴对齐方式。 */
    justify?: CSSProperties['justifyContent'];
    /** 项目间距。数值单位为 px，也可传入 CSS gap 值。 */
    gap?: CSSProperties['gap'];
    /** 保留原有 DOM 层级的布局内容。 */
    children?: ReactNode;
    /** 普通布局直接接收 children。 */
    virtual?: never;
}

/** 等高虚拟列表或卡片集合，索引从 0 开始。 */
export interface FlexVirtualOptions {
    /** 项目总数，取非负安全整数。 */
    itemCount: number;
    /** 每项固定高度，单位为 px，必须大于 0。 */
    itemHeight: number;
    /** 卡片宽度（px）。提供后按可用宽度换行，省略时每项独占一行。 */
    itemWidth?: number;
    /** 视口上下额外挂载的行数，默认 2。 */
    overscan?: number;
    /** 返回项目的稳定业务标识。 */
    getItemKey: (index: number) => Key;
    /** 渲染指定索引的项目，仅访问当前窗口。 */
    renderItem: (index: number) => ReactNode;
}

/** 纵向滚动的等高集合，需要有明确高度的容器。 */
export interface FlexVirtualProps extends Omit<DivProps, 'role' | 'dangerouslySetInnerHTML'> {
    /** 数据数量、项目尺寸与按索引渲染的回调。 */
    virtual: FlexVirtualOptions;
    /** 横纵间距，单位为 px，默认 0，末项之后不留间距。 */
    gap?: number;
    /** 每行卡片在可用宽度内的水平对齐方式。 */
    justify?: CSSProperties['justifyContent'];
    /** 虚拟集合使用 list 语义，每个挂载项报告它在全集中的位置。 */
    role?: 'list';
    /** 虚拟集合沿纵向滚动。 */
    direction?: never;
    /** 每行容纳的项目数量由 itemWidth 和容器宽度决定。 */
    wrap?: never;
    /** 每个虚拟行使用 itemHeight 指定的高度。 */
    align?: never;
    /** 虚拟条目由 renderItem 按需渲染。 */
    children?: never;
}

export type FlexProps = FlexLayoutProps | FlexVirtualProps;
