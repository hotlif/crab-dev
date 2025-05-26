+++
path = "/components/button"
title = "Button 按钮"
nav = { id = "components", title = "组件" }
+++

# Button 按钮

按钮用于开始一个即时操作。

## 何时使用

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。


- 🔵 主按钮：用于主行动点，一个操作区域只能有一个主按钮。
- ⚪️ 默认按钮：用于没有主次之分的一组行动点。
- 🫥 虚线按钮：常用于添加操作。
- 🔤 文本按钮：用于最次级的行动点。
- 🔗 链接按钮：一般用于链接，即导航至某位置。


以及四种状态属性与上面配合使用。

- ⚠️ 危险：删除/移动/修改权限等危险操作，一般需要二次确认。
- 👻 幽灵：用于背景色比较复杂的地方，常用在首页/产品页等展示场景。
- 🚫 禁用：行动点不可用的时候，一般需要文案解释。
- 🔃 加载中：用于异步操作等待反馈的时候，也可以避免多次提交。

## 代码演示

<CodeDemo />


## API

|属性	 |说明	   |类型	   |默认值
|-----   |------  |-----      |-------
|loading | 加载中 | `boolean`  | `false`
|appearance | 按钮类型 | `"primary"` \| "subtle" \| "dashed" \| "text" \| "link" | "subtle"
|shouldFitContainer | 宽度设置为父容器宽度 | `boolean` | `false`
|onClick            | 按钮的点击事件 | `(param: Parameters<NonNullable<ButtonHTMLAttributes<HTMLButtonElement>["onClick"]>>[0]) => Promise<void> \| void` | -
