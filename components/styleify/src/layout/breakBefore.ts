// 定义一个 BreakBeforeValue 对象，包含各种 break-before 属性的值
const BreakBeforeValue = {
  auto: "auto", // 自动
  avoid: "avoid", // 避免
  all: "all", // 所有
  "avoidPage": "avoid-page", // 避免分页
  page: "page", // 分页
  left: "left", // 左边
  right: "right", // 右边
  column: "column", // 列
};

// 定义一个函数 breakBefore，接收一个 key 并返回对应的 break-before 样式字符串
export const breakBefore = (key: keyof typeof BreakBeforeValue) => {
  return `break-before: ${BreakBeforeValue[key]};`;
};
