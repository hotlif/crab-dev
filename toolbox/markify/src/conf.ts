import { loadConfig } from "unconfig";

export interface MarkifyConfig {
    theme?: string
} 

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
