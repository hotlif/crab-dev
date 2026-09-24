export type NamePath = string | readonly string[];

type TuplePaths<T, Depth extends readonly unknown[] = []> = Depth['length'] extends 6 ? never : {
    [K in Extract<keyof T, string>]: readonly [K] | (
        NonNullable<T[K]> extends object
            ? readonly [K, ...TuplePaths<NonNullable<T[K]>, [...Depth, unknown]>]
            : never
    )
}[Extract<keyof T, string>];

/** 字符串表示顶层字段，元组表示嵌套路径；动态记录保留 NamePath。 */
export type FieldPath<T extends object> = string extends keyof T ? NamePath : Extract<keyof T, string> | TuplePaths<T>;
export type FieldValue<T, P> = P extends keyof T ? T[P]
    : P extends readonly [infer K, ...infer Rest]
        ? K extends keyof NonNullable<T>
            ? Rest extends [] ? NonNullable<T>[K] : FieldValue<NonNullable<T>[K], Rest>
            : unknown
        : unknown;
type ChangeAtPath<T, P> = P extends NamePath ? { name: P; value: FieldValue<T, P> } : never;
export type FieldChange<T extends object> = ChangeAtPath<T, FieldPath<T>>;

export interface FieldValidationResult {
    name: NamePath;
    errors: string[];
    warnings: string[];
}

export class FormValidationError<T extends object = Record<string, unknown>> extends Error {
    readonly values: T;
    readonly fields: readonly FieldValidationResult[];

    constructor(values: T, fields: readonly FieldValidationResult[]) {
        super('Form validation failed');
        this.name = 'FormValidationError';
        this.values = values;
        this.fields = fields;
    }
}

export type FormSubmitResult<T extends object> =
    | { status: 'success'; values: T }
    | { status: 'invalid'; values: T; error: FormValidationError<T> };

export enum ValidateState {
    // 默认初始化情况， 没做任何校验
    DEFAULT,
    // 校验成功
    SUCCESS,
    // 校验失败
    ERROR,
    // 警告
    WARNING,
    // 在校验中
    VALIDATING
} 

/**
 * 表单的实例， 用它来批量操作表单字段， 例如提交数据或者重置数据
 */
export interface FormInstance<T extends object> {
    /**
     * 提交表单
     */
    submit: () => Promise<FormSubmitResult<T>>

    /**
     * 获取对应字段名的值
     */
    getFieldValue<const P extends FieldPath<T>>(name: P): FieldValue<T, P> | undefined;

    /**
     * 所有表单字段的值
     */
    getFieldsValue(): T

    /**
     * 设置表单字段的值
     */
    setFieldValue<const P extends FieldPath<T>>(name: P, value: FieldValue<T, NoInfer<P>>): void;

    /**
     * 设置所有表单的值
     */
    setFieldsValue(values: T): void

    /** 显式替换当前数据及 resetFields 使用的默认值。 */
    reinitialize(values: T): void

    /**
     * 触发字段校验
     */
    validateFields(fields?: readonly FieldPath<T>[]): Promise<T>

    /**
     * 重置字段， 如果参数为空，则表示重置所有字段
     */
    resetFields(names?: readonly FieldPath<T>[]): Promise<void>
}

export type WrapperInstance<T extends object> = FormInstance<T> & {
    __INTERNAL__: {
        setInstance(instance: FormInstance<T> | null): void
    }
}

export interface FormItemEditor<T = unknown> {

    id?: string;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;

    /**
     * 编辑器的校验状态（枚举形态，语义完整，保留向后兼容）
     */
    validateState?: ValidateState

    /**
     * 校验状态的精简映射：仅在 error / warning 时透传给编辑器，用于驱动边框等即时
     * 视觉反馈；校验通过或未校验时为 undefined。与 rc-line-edit 等编辑器的 `status`
     * 契约对齐，编辑器可选择消费。
     */
    status?: "error" | "warning"

    /**
     * 编辑器的值
     */
    value?: T,

    /**
     * 值改变后触发的事件
     */
    onChange?: (value: T) => void

}


export enum RuleType {
    WARNING,
    ERROR
}

export interface Rule {

    /**
     * 类型
     * 
     * - RuleType.WARNING 警告类型
     * - RuleType.ERROR   错误类型
     */
    type: RuleType,

    /**
     * 通过此方法进行校验
     */
    validator: (value: unknown) => void | Promise<void>
}
