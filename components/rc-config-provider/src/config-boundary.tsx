import { use, type ReactElement } from 'react';
import ConfigContext from './context.js';
import ConfigProvider from './config-provider.js';
import type { ConfigBoundaryProps } from './types.js';

/** 浮层沿用已有配置；未设置 Provider 时保留原生 CSS 主题继承。 */
export default function ConfigBoundary(props: ConfigBoundaryProps): ReactElement {
    const config = use(ConfigContext);
    return config === null ? <div {...props} /> : <ConfigProvider {...props} />;
}
