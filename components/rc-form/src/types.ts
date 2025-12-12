export type NamePath = string | number | Array<string | number> 

/**
 * 表单的实例， 用它来批量操作表单字段， 例如提交数据或者重置数据
 */
export interface FormInstance<T = any> {
    /**
     * 提交表单
     */
    submit: () => void

    /**
     * 获取对应字段名的值
     */
    getFieldValue(name: string): any

    /**
     * 所有表单字段的值
     */
    getFieldsValue(): T

    /**
     * 设置表单字段的值
     */
    setFieldValue(name: string, value: any): void

    /**
     * 设置所有表单的值
     */
    setFieldsValue(values: Record<string, any>): void

    /**
     * 重置字段， 如果参数为空，则表示重置所有字段
     */
    resetFields(names?: string[]): void
}

export type WrapperInstance = FormInstance & {
    __INTERNAL__: {
        setInstance(instance: FormInstance): void
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
    onFormItemValueChange(value: T): void

}