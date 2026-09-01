/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type FormInstance<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type Promise<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;
type T = DocsTypePlaceholder;

export interface FormPropsSearchIndex {
    /**
     * 设置 Form 实例, 以便后面调用 Form 的方法
     */
    "form"?: FormInstance<T>;

    /**
     * 设置默认值
     */
    "defaultValue"?: T;

    /**
     * 自定义渲染必填样式
     */
    "requiredIndicatorRenderer"?: (param: { label: ReactNode; required: boolean; }) => ReactNode;

    /**
     * 提交表单且数据验证成功后回调事件
     */
    "onSubmitSuccess"?: (record: T) => Promise<void>;

    /**
     * 提交表单并且数据校验失败后的回调事件
     */
    "onSubmitFailed"?: (record: T) => Promise<void>;

    /**
     * 字段值更新的时候触发的回调事件
     */
    "onFieldValueChange"?: (changed: { [K in keyof T]: { name: K; value: T[K]; }; }[keyof T], allValues: T) => Promise<void>;
}
