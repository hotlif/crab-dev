# @crab-dev/rc-pie-chart

## 0.1.0

### Minor Changes

- [#125](https://github.com/hotlif/crab-dev/pull/125) [`62a350f`](https://github.com/hotlif/crab-dev/commit/62a350fcb0263fa5169b0c870b86cf45aa65576e) Thanks [@hotlif](https://github.com/hotlif)! - 新增 PieChart 饼图和圆环图，支持图例筛选、扇区点击、键盘操作和可访问数据表。Canvas 的 Circle 图元支持内半径和起止角度，可以绘制并命中圆环和扇区。
  
  Canvas 仅在同一图元注册双击行为时识别双击，连续点选扇区可逐次触发对应回调。

### Patch Changes

- Updated dependencies [[`62a350f`](https://github.com/hotlif/crab-dev/commit/62a350fcb0263fa5169b0c870b86cf45aa65576e), [`4d81ab3`](https://github.com/hotlif/crab-dev/commit/4d81ab3202ae3091a64aabfea503e795e831464d)]:
  - @crab-dev/rc-canvas@0.4.0
  - @crab-dev/rc-config-provider@1.1.0
