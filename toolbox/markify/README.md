<div align="center">
	<h1>@crab/markify</h1>
    <span>
        用来构建和生成组件文档
    </span>
</div>

## Markdown 配置

所有 Markdown 配置均以 `FrontMatter` 的形式配置在 Markdown 文件的头部, 例如

```
+++
path = "/docs/overview"

[nav]
title = ""
+++

其他 Markdown 内容
```

目前支持以下 Markdown 配置.


### path 

 - 类型: `String`
 - 默认值: ``

用于设置当前路由的路径, 如果未设置则默认为当前文件夹的相对路径


### nav.name

 - 类型: `String`
 - 默认值: ``
