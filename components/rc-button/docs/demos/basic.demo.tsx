import Button from '../../src/index.js';

interface BasicDemoProps {
    /** 按钮内显示的操作名称。 */
    children: string;
    /** 按钮的视觉层级与操作语义。 */
    appearance?: 'primary' | 'subtle' | 'dashed' | 'text' | 'link' | 'danger';
    /** 按钮尺寸。 */
    size?: 'large' | 'middle' | 'small';
    /** 是否显示加载状态。 */
    loading?: boolean;
    /** 是否禁用当前操作。 */
    disabled?: boolean;
    /** 是否显示为选中状态。 */
    isSelected?: boolean;
    /** 是否撑满预览容器。 */
    shouldFitContainer?: boolean;
}

export const meta = {
    title: '基础配置',
    description: '在属性控件中组合文字、外观、尺寸与常用状态',
    group: '基础组件',
    component: 'Button 按钮',
    order: 10,
    args: {
        children: '保存更改',
        appearance: 'primary',
        size: 'middle',
        loading: false,
        disabled: false,
        isSelected: false,
        shouldFitContainer: false,
    },
    background: 'surface',
    padding: 'lg',
};

export default function BasicDemo({ children, ...props }: BasicDemoProps) {
    return (
        <div style={{ width: 'min(100%, 360px)' }}>
            <Button {...props}>{children}</Button>
        </div>
    );
}
