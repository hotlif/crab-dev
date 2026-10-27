// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type SliderChangeDetails = DocsTypePlaceholder;

export interface SliderProps {
    /**
     * 轨道尺寸，默认 xs；各设计主题使用独立的轨道与手柄比例。
     */
    "size"?: 'xs' | 's' | 'm' | 'l' | 'xl';

    /**
     * 暂无说明。
     * @default 0
     */
    "min"?: number;

    /**
     * 暂无说明。
     * @default 100
     */
    "max"?: number;

    /**
     * 暂无说明。
     * @default 1
     */
    "step"?: number;

    /**
     * 暂无说明。
     * @default false
     */
    "disabled"?: boolean;

    /**
     * 暂无说明。 与 defaultValue 互斥，不能同时提供。
     */
    "value"?: number;

    /**
     * 暂无说明。 与 value 互斥，不能同时提供。
     */
    "defaultValue"?: number;

    /**
     * 暂无说明。
     */
    "onValueChange"?: ((value: number, details: SliderChangeDetails) => void);
}
