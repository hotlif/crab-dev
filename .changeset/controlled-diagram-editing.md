---
"@crab-dev/rc-canvas": minor
"@crab-dev/rc-flow-diagram": minor
---

新增受控视口命令、稳定端口连线与改接、手动折线编辑和共享手势事务。拖动预览与最终提交分离，支持 Esc、失焦、隐藏、只读、非活动文档和修订变化时取消，便于宿主将一次手势记为一次撤销。

FlowDiagram 支持手动布局和受控视口，已保存的节点位置不再等待 ELK 完成；布局与文档加载不会自动改变视口。保留现有 Canvas、FlowDiagram 和路由接口，新几何工具支持恢复旧的手动路线。
