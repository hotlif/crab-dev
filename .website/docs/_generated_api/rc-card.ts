/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type CardSize = DocsTypePlaceholder;
type CardVariant = DocsTypePlaceholder;
type HTMLDivElement = DocsTypePlaceholder;
type MouseEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface CardPropsSearchIndex {
    /**
     * 底部操作组, 渲染在分割线下方并靠右排布
     */
    "actions"?: ReactNode[];

    /**
     * 卡片内容：裸内容自动包裹进内容区; 传入 Card.Cover / Card.Header / Card.Body / Card.Footer 时切换为自由拼装模式
     */
    "children"?: ReactNode;

    /**
     * 整卡是否可点击：自带浮起反馈 / 键盘激活（Enter / Space）/ 焦点环, 卡内 extra 与 actions 的点击自动与整卡点击隔离
     * @default false
     */
    "clickable"?: boolean;

    /**
     * 封面媒体, 出血铺满卡片顶部并随圆角裁切
     */
    "cover"?: ReactNode;

    /**
     * 是否禁用：撤销全部交互示能并降低不透明度
     * @default false
     */
    "disabled"?: boolean;

    /**
     * 标题区右侧的操作区（如"更多"按钮）
     */
    "extra"?: ReactNode;

    /**
     * 悬浮时是否浮起（大投影 + 上移 + 封面微缩放）
     * @default false
     */
    "hoverable"?: boolean;

    /**
     * 是否处于加载态, 为 true 时渲染骨架占位
     * @default false
     */
    "loading"?: boolean;

    /**
     * 整卡点击回调, 仅 clickable 时生效
     */
    "onClick"?: MouseEventHandler<HTMLDivElement>;

    /**
     * 根节点 ref
     */
    "ref"?: Ref<HTMLDivElement>;

    /**
     * 尺寸档位
     * @default "middle"
     */
    "size"?: CardSize;

    /**
     * 标题, 渲染在标题区左侧
     */
    "title"?: ReactNode;

    /**
     * 视觉变体
     * @default "elevated"
     */
    "variant"?: CardVariant;
}
