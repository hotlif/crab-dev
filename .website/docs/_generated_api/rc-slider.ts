// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。



export interface SliderProps {
    /**
     * 暂无说明。
     * @default 0
     */
    "value": number;

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
     */
    "max"?: number;

    /**
     * 暂无说明。
     */
    "step"?: number;

    /**
     * 暂无说明。
     */
    "disabled"?: boolean;

    /**
     * 暂无说明。
     */
    "onValueChange"?: (value: number) => void;
}
