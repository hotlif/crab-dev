# Docs UI 浏览器验收夹具

使用本仓库 `docs/site/ui.tsx` 的公开展示组件，在正式 React 测试被版本检查阻塞时补充浏览器观察。该夹具独立构建，不进入正式站点导航或内容库存；它不能替代自动化测试。

在 `.website` 目录使用 PowerShell：

```powershell
corepack yarn exec wake docs build review/ui-fixture --outdir .tmp/ui-fixture
$env:DOCS_PREVIEW_DIR = '.tmp/ui-fixture'
$env:DOCS_PREVIEW_PORT = '4175'
corepack yarn preview
```

检查打开全屏、点击“关闭全屏预览”到退出动画结束的全过程，`[data-testid="fixture-preview"]` 应始终只有一个；切换视口后预览区域跟随变化。复制失败保留可选择源码，点击“重试加载”会增加重试次数。这里提供的是受控 props，不模拟真实网络或剪贴板故障。

退出服务后清除本次终端的变量，避免影响正式预览：

```powershell
Remove-Item Env:DOCS_PREVIEW_DIR, Env:DOCS_PREVIEW_PORT
```
