import { createContext, use, type Context } from 'react';
import type { ConfigValue } from './types.js';

const ConfigContext: Context<ConfigValue> = createContext<ConfigValue>({
    theme: 'light',
    brandColor: null,
    locale: 'zh-CN',
    size: 'middle',
});

/** 读取最近的 ConfigProvider；未提供时返回组件库默认配置。 */
export function useConfig(): ConfigValue {
    return use(ConfigContext);
}

export default ConfigContext;
