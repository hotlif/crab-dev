<div align="center">
	<h1>@crab-dev/infinitum-front</h1>
	这是代码开发平台的前端
</div>


## 路由

所有路由文件写在 `src/routers`, 文件夹和文件名需要大写, 需要 `/\.Router\.tsx$/` 作为结尾


### 路由元数据

在路由中可以在第行文件夹中添加注释, 并且可以在其他地方读取, 这些内容叫做路由 `元数据`, 采用  `toml` 格式


- path
    - type: `string`
    - descript: 用于设置路由路径, 如果不设置, 默认情况下就文件夹的相对路径 
- ignoreLayout
    - type: `boolean`
    - descript: 是否使用布局信息, 如果设置为 `true` 则表示忽略所有的布局, 是一个单独的页面
- noAuthRequired
    - type: `boolean`
    - descript: 在未登录的情况下是否可以访问, 如果设置为 `true`, 则表示这个页面是可以在未经过登录的情况来进行访问的
    
