# Dropdown 默认 Demo 标签间距复审

仅修改包内 base Demo 的局部布局，采用语义间距与可换行 flex，保留原标签关联和输入引用。Windows Chromium 六配置均通过自动检查，六张实际 PNG 已逐一查看：标签与输入框边界有清晰间隔、垂直对齐且无裁切。图像哈希、来源/构建指纹和稳定 worker 绑定均已核对；逐项见 [reviews-selection-overlays.json](./reviews-selection-overlays.json)。

这份新候选解决旧库存审查中的 demo-label-gap。旧报告和旧图保持原样。本图仅有关闭状态的触发输入框，弹层外观和完整状态/尺寸矩阵仍待复审，没有建立基准或更新 verified。

Firefox 六项和 WebKit 六项均在启动前失败：工作区官方浏览器缓存缺少相应程序。十二项失败保留于 cases.json 和原生报告，未计为通过或已看图。首次筛选未发现测试的运行也已保留；修正筛选后才取得本次六张 Chromium 图。

