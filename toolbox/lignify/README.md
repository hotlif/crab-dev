<div align="center">
	<h1>@crab-dev/lignify</h1>
	<p>
		用于构建组件文档， 以及在线调试组件库的开发工具<br/>
		无需任何配置， 快速开始组件的开发，专注于组件的 <b>性能</b> 与 <b>可维护性</b>。
	</p>
</div>


## ✨ 特性

- ⚡ **零配置启动**：快速开始组件开发和提示
- 🧩 **支持主题调整**：开发时候, 默认支持 `token.toml` 主题样式变化的调整
- 🎨 **CSS-in-JS 支持**：原生支持 `Linaria` 和 `@wyw-in-js`，构建期提取样式，无运行时开销

## 📦 安装

```bash
npm install @crab-dev/lignify --save-dev

yarn add -D @crab-dev/lignify

pnpm add -D @crab-dev/lignify
```


## 🚀 快速开始

### 项目结构

大部分场景下，文件结构遵循约定生成。推荐的项目目录结构如下：

```
├─ .cache              # 缓存目录，CSS 加载问题时可尝试删除
├─ .tmp                # 临时文件目录，可安全删除
├─ docs
├─ src                 # 源码目录
├─ token.toml          # 主题文件可选
├─ package.json        # 项目配置
├─ tsconfig.json       # TypeScript 配置
```

## 🧩 自动生成侧边栏

侧边栏的数据根据 `docs` 目录中的 `markdown` 的头部文件进行生成

```md
+++
name = "你好"
+++

这是一个 button 按钮的测试文档说明
```


### 属性

| 属性名称       | 类型           | 描述
|-----------    |-------         |-----------
|id             | `string`       | 唯一 id，如果设置了，就使用这个 `id`, 不设置会默认生成一个 id
|title          | `string`       | 标题信息
|