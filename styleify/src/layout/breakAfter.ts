// 定义一个 BreakAfterValue 对象，包含各种 break-after 属性的值
const BreakAfterValue = {
  auto: "auto", // 自动
  avoid: "avoid", // 避免
  all: "all", // 全部
  avoidPage: "avoid-page", // 避免分页
  page: "page", // 分页
  left: "left", // 左边
  right: "right", // 右边
  column: "column", // 列
};

// 定义一个函数 breakAfter，接收一个 key 参数，返回对应的 break-after 样式字符串
export const breakAfter = (key: keyof typeof BreakAfterValue) => {
    return `break-after: ${BreakAfterValue[key]};`
}
