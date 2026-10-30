# LineEdit 有值只读修复诊断 · 2026-10-30

公开filtered诊断18/18通过，三体系 × 明暗 × small/medium/large；两外观36份原生选区记录与36PNG，每体系12图。没有新人工审图或基准。

所有记录真实Tab获焦、ControlOrMeta+A后选区[0,25]、readOnly=true、focused=true、键入x前后原值一致；原生readonly和清除入口不存在由通过的场景核对。未执行剪贴板复制，不将选区等同复制成功。

2个worker source/asset前后stable；source sha256:52aef56d2ebe4c73702bb3888df63c253dca99c166021dd5a3bad031e6d345d8；artifact sha256:488964434b3e1d98e33a9995db85ced1d12b28aa77b9cbb9e1c2df66c88cc96f。渲染源按共享规范化hasher、224资产与全部PNG/native附件一致，实际Windows Chromium156.0.8078.4。

共享历史目录排除负向验证：两份精确原字节core探针分别放入review与.reports随机owned目录，原生仍301项/4文件。清理前校验realpath/base/前缀/此次创建清单/唯一文件SHA，仅清理这两探针；原archive SHA不变。完整记录见.tmp/discovery-ignore-probes-20261030.json。

矩阵scope=filtered，full core234只执行18，complete=false。原完整301仍283通过/18失败，原results/hash未改；不得拼接成同源完整通过。TextEdit/NumberEdit本批仍未运行。

磁盘最低 2.524GiB，2GiB守卫未触发；无其它采集或源码修改。
