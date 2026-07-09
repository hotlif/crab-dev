import { type HTMLAttributes, type ReactNode, type Ref } from 'react';

/**
 * 分段控制器可选值：与原生表单一致，仅允许字符串或数字。
 */
export type SegmentedValue = string | number;

/**
 * 尺寸档位，与 rc-radio / rc-switch 对齐。
 */
export type SegmentedSize = 'large' | 'middle' | 'small';

/**
 * 单个分段选项的完整配置。
 */
export interface SegmentedOption {
    /**
     * 选项展示内容
     */
    label: ReactNode;

    /**
     * 选项值, 选中后经 onChange 回传
     */
    value: SegmentedValue;

    /**
     * 是否禁用该选项
     */
    disabled?: boolean;

    /**
     * 选项前置图标
     */
    icon?: ReactNode;

    /**
     * 无障碍名, 用于纯图标选项（label 无可读文本时必填）
     */
    'aria-label'?: string;

    /**
     * 选项自定义类名
     */
    className?: string;
}

/**
 * 选项的简写形式：直接传入原始值时, 等价于 `{ label: value, value }`。
 */
export type SegmentedRawOption = SegmentedOption | string | number;

interface BaseSegmentedProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
    /**
     * 选项数据源, 支持对象或原始值简写
     */
    options: SegmentedRawOption[];

    /**
     * 当前选中值（受控）
     */
    value?: SegmentedValue;

    /**
     * 默认选中值（非受控）, 缺省时取第一个可用选项
     */
    defaultValue?: SegmentedValue;

    /**
     * 选中值变化时的回调
     */
    onChange?: (value: SegmentedValue) => void;

    /**
     * 是否禁用整个控制器
     */
    disabled?: boolean;

    /**
     * 尺寸, 默认为 middle
     */
    size?: SegmentedSize;

    /**
     * 是否撑满父容器并等宽分布各选项
     */
    block?: boolean;

    /**
     * 底层 radio 分组的 name, 缺省时自动生成, 用于隔离页面上多个控制器的键盘导航
     */
    name?: string;

    /**
     * 根节点 ref
     */
    ref?: Ref<HTMLDivElement>;
}

export type SegmentedProps = BaseSegmentedProps;
