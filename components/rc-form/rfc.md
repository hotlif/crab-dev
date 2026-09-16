<div align="center">
	<h1>RFC-FORM-20251210</h1>
</div>

> 本文是 2025-12-10 的表单设计提案，保留当时的接口设想。当前用法与 API 以[组件文档](./docs/index.mdx)为准。

复杂表单需要统一管理字段值、批量填充、校验和提交状态。仅组合原生标签与输入控件会产生重复的状态管理代码。本提案通过 Form、Form.Item 和表单实例集中处理这些职责。

## 功能要求

`Form` 接收 `ReactNode` 子节点，使用 `display: grid` 布局，并渲染为原生 HTML `form` 元素。

基本结构如下：

```jsx
const Demo = () => {
    return (
        <>
            <Form>
                <Form.Item></Form.Item>
            </Form>
        </>
    )
}
```

`Form` 继承 `Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit">`，并增加以下属性：

| 属性                      | 描述                                      | 类型       |  默认值
|---                       |----                                       |-----      |------
|form                      | 由 `useForm()` 创建的表单实例
|requiredIndicatorRenderer | 自定义必填标记的渲染方式
|onFinishSuccess           | 提交时校验成功的回调
|onFinishFailed            | 提交时校验失败的回调
|onFieldValueChange        | 字段值变化时的回调

`useForm` 创建表单实例，用于管理字段值和表单状态。

将 `useForm` 创建的 `FormInstance` 传入 `Form` 的 `form` 属性。实例提供以下方法：

| 属性                      | 描述                                      | 类型       |  默认值
|---                       |----                                       |-----      |------
|submit                     | 提交表单                                  |`() => void` |
|getFieldValue              | 获取对应字段名的值
|getFieldsValue             | 所有表单字段的值
|setFieldValue              | 设置表单字段的值
|setFieldsValue             | 设置表单的值
|resetFields                | 重置表单字段
|validateFields             | 校验表单字段
|isFieldsTouched            | 检查一组字段是否被用户操作过
|isFieldTouched             | 检查对应字段是否被用户操作过

`Form.Item` 继承 `Omit<HTMLAttributes<HTMLDivElement>, "children">`，子节点类型为提案中的 `ReactElement<FormItenEditor<T>>`：

| 属性                      | 描述                                      | 类型       |  默认值
|---                       |----                                       |-----      |------
|hidden                    | 是否隐藏字段                               | `boolean` | `false`
|label                     | 文本的标签                                 | `ReactNode` | `""`
|name                      | 字段名称                                   | `NamePath` | `""`
|required                  | 是否必填                                   | `boolean` | `false`
|rules                     | 校验规则，设置字段的校验逻辑                 | `Rule[]`  | `[]`
