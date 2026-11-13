---
"@crab-dev/rc-token-global": patch
"@crab-dev/rc-token-semantic": patch
"@crab-dev/rc-theme": patch
"@crab-dev/rc-button": patch
"@crab-dev/rc-table": minor
---

校准 macOS Tahoe 桌面工作区的公共视觉尺度：正文采用 13px 系统字体，单行字段改为 28/32/36px，控件统一 8px 轮廓；标题和数据表头降低字重。表格默认保留水平分隔，减少正文纵向网格。调整结构分隔线、字段内阴影、按钮高光和导航/浮层玻璃材质，避免固定斜向高光和厚重的灰色面板。

这些规则通过公共主题与令牌应用到相关组件及组合控件。字段公开尺寸档位的实际高度会变小；使用显式 TokenVars 定制几何的消费方需重新核对自己的布局。粗指针目标、焦点、系统高对比度以及尺寸和密度的独立契约保持有效。

Table 新增 `rowSelection.showColumn`，允许专业列表隐藏内置选择列、保留选中行语义，并通过现有行点击和 Enter 入口更新受控选择。默认仍显示选择列。
