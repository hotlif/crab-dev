// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLButtonElement = DocsTypePlaceholder;
type PresetTagColor = DocsTypePlaceholder;
type ReactMouseEvent<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;

export interface TagProps {
    /**
     * Defines a string value that labels the current element.
     */
    "aria-label"?: string | undefined | string;

    /**
     * 暂无说明。
     */
    "children"?: ReactNode | undefined | ReactNode;

    /**
     * 标签颜色预设
     * @default ’default’
     */
    "color"?: PresetTagColor | string;

    /**
     * 标签尺寸
     */
    "size"?: 'large' | 'medium' | 'small';

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
     * 关闭按钮的无障碍标签，默认跟随 ConfigProvider 的语言；同一容器内出现多个可关闭标签时应传入可区分的描述
     */
    "closeAriaLabel"?: string;

    /**
     * 标签图标
     */
    "icon"?: ReactNode;

    /**
     * 关闭回调
     */
    "onClose"?: (e: ReactMouseEvent<HTMLButtonElement>) => void;
}
