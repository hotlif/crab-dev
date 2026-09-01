/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLSpanElement = DocsTypePlaceholder;
type PresetTagColor = DocsTypePlaceholder;
type ReactMouseEvent<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;

export interface TagPropsSearchIndex {
    /**
     * 标签颜色预设
     * @default 'default'
     */
    "color"?: PresetTagColor | string;

    /**
     * 标签尺寸
     * @default 'middle'
     */
    "size"?: 'large' | 'middle' | 'small';

    /**
     * 是否显示边框
     * @default true
     */
    "bordered"?: boolean;

    /**
     * 是否可关闭
     * @default false
     */
    "closable"?: boolean;

    /**
     * 自定义关闭图标，设置为 false 可隐藏默认关闭图标
     */
    "closeIcon"?: ReactNode | false;

    /**
     * 关闭按钮的无障碍标签，默认为 "close"；同一容器内出现多个可关闭标签时应传入可区分的描述
     * @default 'close'
     */
    "closeAriaLabel"?: string;

    /**
     * 标签图标
     */
    "icon"?: ReactNode;

    /**
     * 关闭回调
     */
    "onClose"?: (e: ReactMouseEvent<HTMLSpanElement>) => void;

    /**
     * 暂无说明。
     */
    "children"?: ReactNode;

    /**
     * 暂无说明。
     */
    "aria-label"?: string;
}
