/**
 * module 型 remoteEntry 的动态导入。独立成模块的唯一目的是留出 jest.mock 接缝
 * （Jest ESM 下动态 import 无法直接拦截）。
 *
 * webpackIgnore 注释必须保留：webpack 消费方下, 变量表达式的 import()
 * 会被编成 Critical dependency 的空 ContextModule 并在运行时失败；
 * Wake 的 ESM 产物则原样透传动态 import()。
 */
export function importModule(url: string): Promise<unknown> {
    return import(/* webpackIgnore: true */ url);
}
