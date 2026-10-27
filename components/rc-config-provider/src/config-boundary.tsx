import { use, type ReactElement } from 'react';
import ConfigContext, { useConfig } from './context.js';
import ConfigProvider from './config-provider.js';
import type { ConfigBoundaryProps } from './types.js';

/** 浮层沿用已有配置；未设置 Provider 时保留原生 CSS 主题继承。 */
export default function ConfigBoundary({ size, ...props }: ConfigBoundaryProps): ReactElement {
    const config = use(ConfigContext);
    const inherited = useConfig();
    if (config !== null) return <ConfigProvider {...props} size={size} />;
    const content = <div {...props} data-crab-size={size} />;
    return size === undefined ? content : <ConfigContext value={{ ...inherited, size }}>{content}</ConfigContext>;
}
