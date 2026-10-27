import { createContext, use, type Context } from 'react';
import type { ConfigValue } from './types.js';

const defaultConfig: ConfigValue = {
    designSystem: 'md3',
    colorMode: 'light',
    brandColor: null,
    locale: 'zh-CN',
    size: 'medium',
    density: 'standard',
    direction: 'ltr',
    nonce: undefined,
};

const ConfigContext: Context<ConfigValue | null> = createContext<ConfigValue | null>(null);

/** 读取最近的 ConfigProvider；未提供时返回组件库默认配置。 */
export function useConfig(): ConfigValue {
    return use(ConfigContext) ?? defaultConfig;
}

export default ConfigContext;
