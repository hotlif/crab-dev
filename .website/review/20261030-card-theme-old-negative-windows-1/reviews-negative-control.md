# Card 旧实现负对照

1例自然失败，worker稳定；仅default/medium/standard、Chromium156。MD3浅色→Apple深色时，RAF641.928外层和最近边界都已是Apple/dark，五处正文前景已是最终颜色，但背景仍为oklab(0.967283 0.00808987 -0.0086097)，background-color过渡currentTime0/end100ms。到RAF792.1背景才达最终oklch(0.22 0.005 286)，最终825.7；10帧中节点和草稿均保留。

两张原PNG逐图已看：第一张是自然过渡结束后的最终深色端点，第二张为空白诊断图，都不能冒称混色中间帧。逐图路径和SHA、原生video/trace绑定见JSON；录像未完整播放。

此报告只证明旧背景过渡的回归能被行为断言检出。其他3variant未达到，修复后的18例尚未运行。原生报告/原图/录像/trace完整保留，未批准baseline、canonical或verified。
