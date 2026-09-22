import Button from '../../src/index.js';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';

const containerStyle = css`width: 100%; max-width: calc(${token.size[40]} * 9);`;

interface BasicDemoProps {
    /** 按钮内显示的操作名称。 */
    children: string;
    /** 按钮的视觉层级与操作语义。 */
    appearance?: 'elevated' | 'primary' | 'tonal' | 'outlined' | 'text';
    /** 危险操作语义。 */
    danger?: boolean;
    /** 按钮尺寸。 */
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    /** Expressive 形状。 */
    shape?: 'round' | 'square';
    /** 是否显示加载状态。 */
    loading?: boolean;
    /** 是否禁用当前操作。 */
    disabled?: boolean;
    /** 是否显示为选中状态。 */
    isSelected?: boolean;
    /** 启用可切换按钮，Text 外观不支持。 */
    toggle?: boolean;
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
        size: 's',
        shape: 'round',
        danger: false,
        loading: false,
        disabled: false,
        isSelected: false,
        toggle: false,
        shouldFitContainer: false,
    },
    background: 'surface',
    padding: 'lg',
};

export default function BasicDemo({ children, toggle, isSelected, ...props }: BasicDemoProps) {
    return (
        <div className={containerStyle}>
            <Button {...props} isSelected={toggle && props.appearance !== 'text' ? isSelected : undefined}>{children}</Button>
        </div>
    );
}
