import type { Ref } from 'react';

export interface CronPickerProps {
    /** 受控值:五段式(分 时 日 月 周)cron 表达式 */
    value?: string;

    /** 非受控默认值,默认 `* * * * *` */
    defaultValue?: string;

    /** 表达式变化回调,仅在产生合法表达式时触发 */
    onChange?: (value: string) => void;

    /** 控件尺寸,默认 middle */
    size?: 'large' | 'middle' | 'small';

    /** 是否禁用 */
    disabled?: boolean;

    /** 外部校验状态,影响边框颜色;输入了非法表达式时组件会自行显示 error 态 */
    status?: 'error' | 'warning';

    /** 占位提示,默认 `* * * * *` */
    placeholder?: string;

    /** 弹层内"接下来执行时间"预览条数,传 0 关闭预览,默认 5 */
    previewCount?: number;

    /** 弹层开合变化回调 */
    onOpenChange?: (open: boolean) => void;

    /** 输入框元素的 ref */
    ref?: Ref<HTMLInputElement>;

    /** 自定义类名,作用于触发器容器 */
    className?: string;

    /** 无障碍名称,默认 "Cron 表达式" */
    'aria-label'?: string;
}
