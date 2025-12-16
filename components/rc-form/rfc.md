<div align="center">
	<h1>RFC-FORM-20251210</h1>
</div>

	
当我们在 `Web` 网页上进行填写数据的时候， 我们会有大量的信息进行填写， 页面上会有大量的 `label`, `input` 这种组件， 它们并不能快速批量的进行状态控制， 以及快速填充内容等等... 需要编写很多的代码，才能完成这样的工作。 为了抽象并且简化这部分的工作量， 在此提出了这个提案。


## 功能性要求

需要有一个 `Form` 组件， 可以放置任何 `ReactNode` 在此 `Form` 的子节点中， `Form` 布局采用 `display: grid;` 方式进行布局。 **`Form` 必须是一个 HTML 中的  `form` 元素**


如下所示

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

其中 `Form` 必须继承 `Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit">` 包含额外的以下属性

| 属性                      | 描述                                      | 类型       |  默认值
|---                       |----                                       |-----      |------
|form                      | 使用 `useForm()` 创建的 `form` 实例, 可以对 `form` 进行操作
|requiredIndicatorRenderer | 用来渲染表单的必选择样式元素
|onFinishSuccess           | 提交表单且数据验证成功后回调事件      
|onFinishFailed            | 提交表单并且数据校验失败后的回调事件
|onFieldValueChange        | 字段值更新的时候触发的回调事件


- `useForm` 创建 Form 实例，用于管理所有数据状态。 


其中 `FormInstance` 是需要通过 `useForm` 创建进行传递

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



其中 `Form.Item` 必须继承 `Omit<HTMLAttributes<HTMLDivElement>, "children">` 它的子节点必须是一个 `ReactElement<FormItenEditor<T>>`


| 属性                      | 描述                                      | 类型       |  默认值
|---                       |----                                       |-----      |------
|hidden                    | 是否隐藏字段                               | `boolean` | `false`
|label                     | 文本的标签                                 | `ReactNode` | `""`
|name                      | 字段名称                                   | `NamePath` | `""` 
|required                  | 是否必填                                   | `boolean` | `false`
|rules                     | 校验规则，设置字段的校验逻辑                 | `Rule[]`  | `[]`