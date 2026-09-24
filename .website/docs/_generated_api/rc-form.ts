/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type FieldChange<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type FormInstance<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type FormValidationError<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type Promise<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;
type T = DocsTypePlaceholder;

export interface FormProps {
    /**
     * 仅在挂载时读取；后续更新使用 form.reinitialize。
     */
    "defaultValue"?: T;

    /**
     * 暂无说明。
     */
    "form"?: FormInstance<T>;

    /**
     * 暂无说明。
     */
    "onFieldValueChange"?: (changed: FieldChange<T>, allValues: T) => void | Promise<void>;

    /**
     * 第一参数保留原数据协议，第二参数提供结构化错误。
     */
    "onSubmitFailed"?: (record: T, error: FormValidationError<T>) => void | Promise<void>;

    /**
     * 暂无说明。
     */
    "onSubmitSuccess"?: (record: T) => void | Promise<void>;

    /**
     * 暂无说明。
     */
    "requiredIndicatorRenderer"?: (param: { label: ReactNode; required: boolean }) => ReactNode;
}
