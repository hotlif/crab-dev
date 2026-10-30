// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type Booleanish = DocsTypePlaceholder;
type ChangeEventHandler<T0 = unknown, T1 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0, T1] };
type FocusEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type HTMLInputElement = DocsTypePlaceholder;
type InputEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface CronPickerPropsNativeAttributes {
    /**
     * 暂无说明。
     */
    "id"?: string | undefined;

    /**
     * 暂无说明。
     */
    "aria-busy"?: Booleanish | undefined;

    /**
     * Identifies the element (or elements) that describes the object.
     */
    "aria-describedby"?: string | undefined;

    /**
     * Indicates the entered value does not conform to the format expected by the application.
     */
    "aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling" | undefined;

    /**
     * Identifies the element (or elements) that labels the current element.
     */
    "aria-labelledby"?: string | undefined;

    /**
     * Focus Events
     */
    "onFocus"?: FocusEventHandler<HTMLInputElement>;

    /**
     * 暂无说明。
     */
    "onBlur"?: FocusEventHandler<HTMLInputElement>;

    /**
     * No other element dispatching change events can be nested in a <input> so we know the target will be a HTMLInputElement.
     */
    "onChange"?: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;

    /**
     * 暂无说明。
     */
    "onInput"?: InputEventHandler<HTMLInputElement>;

    /**
     * 暂无说明。
     */
    "name"?: string | undefined;

    /**
     * 暂无说明。
     */
    "readOnly"?: boolean | undefined;

    /**
     * 暂无说明。
     */
    "required"?: boolean | undefined;
}
