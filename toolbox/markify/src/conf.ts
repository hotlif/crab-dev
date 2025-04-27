import { loadConfig } from "unconfig";

export interface MarkifyConfig {
} 

/**
 * 定义配置函数
 * 
 * @param config - 配置对象
 * @returns 返回传入的配置对象
 */
export const defineConfig = (config: MarkifyConfig) => config

export const getConfig = async (cwd: string): Promise<MarkifyConfig> => {
	const { config } = await loadConfig<MarkifyConfig>({
		sources: [
			{
				files: ".markify",
				extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'tsx']
			}
		],
		cwd,
		merge: true
	});
    return config;
};
