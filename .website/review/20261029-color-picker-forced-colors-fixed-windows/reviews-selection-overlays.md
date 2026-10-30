# ColorPicker forced-colors 定向复验

本次 Windows Chromium 六配置自动检查全部通过，并逐张查看六张实际 PNG。所有图像哈希与导出索引一致；四个 worker 的采集前后 392 项输入完全相同。逐项 ID、哈希、令牌几何与四边像素结果见 [reviews-selection-overlays.json](./reviews-selection-overlays.json)。

原失败来自旧夹具对 1px outline-offset 的硬编码；产品的唯一 L3 令牌已为 2px。夹具现从生成令牌计算预期宽度和偏移，核对真实聚焦元素，并保留每边像素匹配率至少 90% 的要求。本轮四边均为 100%，没有修改产品样式。

六张图均可见完整系统色焦点轮廓，颜色数据预览、禁用边框及面板控件清楚，无可见裁切。原 09:40 失败、09:46 诊断、09:49 成功原图、trace 和日志均保留。

此结论仅覆盖 Playwright 强制颜色模拟与夹具实际 DOM focus；操作系统高对比度设置、物理键盘遍历、弹层状态、原生吸管、完整尺寸及环境矩阵仍待验收。没有建立基准或更新 verified。导出器将未带包标签的 published.spec 记录于 website 目录；实际包归属由原生 job/fixture/inputs 绑定，未改写导出索引。

