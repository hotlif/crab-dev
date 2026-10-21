import { createContext, use, type Context } from 'react';
import type { ConfigValue } from './types.js';

const defaultConfig: ConfigValue = {
    design: 'material',
    theme: 'light',
    brandColor: null,
    locale: 'zh-CN',
    size: 'middle',
};

const ConfigContext: Context<ConfigValue | null> = createContext<ConfigValue | null>(null);

/** 读取最近的 ConfigProvider；未提供时返回组件库默认配置。 */
export function useConfig(): ConfigValue {
    return use(ConfigContext) ?? defaultConfig;
}

export default ConfigContext;
