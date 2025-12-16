export type NamePath = string | Array<string> 

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
export interface FormInstance<T extends Record<string, any>> {
    /**
     * 提交表单
     */
    submit: () => void

    /**
     * 获取对应字段名的值
     */
    getFieldValue(name: NamePath): any;

    /**
     * 所有表单字段的值
     */
    getFieldsValue(): T

    /**
     * 设置表单字段的值
     */
    setFieldValue(name: NamePath, value: any): void;

    /**
     * 设置所有表单的值
     */
    setFieldsValue(values: T): void

    /**
     * 触发字段校验
     */
    validateFields(fields?: NamePath[]): Promise<T>

    /**
     * 重置字段， 如果参数为空，则表示重置所有字段
     */
    resetFields(names?: NamePath[]): Promise<void>
}

export type WrapperInstance<T extends Record<string, any>> = FormInstance<T> & {
    __INTERNAL__: {
        setInstance(instance: FormInstance<T>): void
    }
}

export interface FormItemEditor<T = any> {

    /**
     * 编辑器的值
     */
    value: T,

    /**
     * 值改变后触发的事件
     */
    onChange(value: T): void

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
    validator: () => Promise<void>
}