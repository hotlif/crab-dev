import { type ComponentType } from "react";
import { type Configuration } from "webpack";
import { loadConfig } from "unconfig";
import { transformSync } from "@swc/core";


/**
 * 对应的规则信息
 */
export interface ComponentScanRule {

	/**
	 * 命名空间, 标识命名空间后, 使用 `@@/${namespaces}` 来进行调用
	 */
    namespaces: string,

	/**
	 * 当前目录
	 */
	cwd: string

	/**
	 * 生成源文件信息, 默认情况下不开启源文件字符生成
	 * 
	 * @default false
	 */
	generateSourceCharacter?: boolean 

	/**
	 * 匹配对应的文件, 并且加载到内存中
	 */
	include?: RegExp
	
	/**
	 * 排除掉匹配的内容信息
	 */
	exclude?: RegExp
}

/**
 * 代理配置信息
 */
interface Proxy {
	context: string[],
	target: string,
	pathRewrite?: Record<string, string>
}

/**
 * 开发服务器的配置
 */
interface DevServer {
	server?: "http" | "https"
	proxy?: Proxy[]
	port?: number
	host?: string
	open?: boolean
}

/**
 * 构建器的配置文件信息
 */
export interface Config {

	/**
	 * 默认 src 目录
	 */
	rootDir?: string

	/**
	 * 自动扫描对应的组件
	 */
	componentScan?: ComponentScanRule[]

	/**
	 * 模组中心
	 */
	mods?: Modification[]

	/**
	 * 开发的服务器配置
	 */
	devServer?: DevServer

	/**
	 * 静态资源的公共路径，默认为 "/"，部署到子路径时需设置（如 "/app/"）
	 * @default "/"
	 */
	publicPath?: string
}

/**
 * 定义配置函数
 * 
 * @param config - 配置对象
 * @returns 返回传入的配置对象
 */
export const defineConfig = (config: Config) => config

/**
 * 从指定的当前工作目录 (cwd) 加载并返回 Crustify 的配置。
 * 配置从具有指定扩展名的文件中加载。
 * 
 * @param {string} cwd - 要从中加载配置的当前工作目录。
 * @returns {Promise<Config>} - 一个解析为加载的配置的 Promise。
 */
export const getConfig = async (cwd: string): Promise<Config> => {
    const { config } = await loadConfig<Config>({
        sources: [
            {
                files: ".crustify",
                extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'tsx']
            }
        ],
        cwd,
        merge: true
    });
    return config;
};


export const renderHTML = async (cwd: string): Promise<ComponentType>  => {
    const { config } = await loadConfig<ComponentType>({
        sources: [
            {
                files: "bootstrap",
                extensions: ['tsx'],
                transform: (source) => {
                    const sourceCode = "import React from \"react\";" + source;
                    const { code } = transformSync(sourceCode, {
                        jsc: {
                            parser: {
                                syntax: "typescript",
                                tsx: true
                            }
                        }
                    });
                    return code;
                }
            }
        ],
        cwd,
        merge: true
    });
    return config;
}


export interface Modification {

	/**
	 * 修改文件
	 */
	modifyEntry?(entry: string): string

	/**
	 * 修改 Webpack 配置
	 * @param configuration Webpack 信息
	 * @returns 返回一个修改好的 Webpack 信息
	 */
	modifyWebpack?(configuration: Configuration): Configuration

	/**
	 * 修改加载 Bootstrap 的文件路径
	 */
	modifyBootstrapPath?(string: string): string

	/**
	 * 修改构建器的配置信息
	 */
	modifyConfig?(config: Config): Config
}
