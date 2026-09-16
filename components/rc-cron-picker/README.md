# @crab-dev/rc-cron-picker

可视化编辑五段式 Cron 表达式，并预览后续执行时间。

```tsx
import CronPicker from '@crab-dev/rc-cron-picker';
import '@crab-dev/rc-cron-picker/css/index.css';

<CronPicker defaultValue="30 9 * * 1-5" onChange={(expr) => console.log(expr)} />
```

- 面板按分、时、日、月、周组织字段，支持每个值、步进、区间和指定值四种模式。
- 可直接输入表达式，支持英文缩写、以 `7` 表示周日及组合写法，提交时规范化输出。
- 实时预览表达式、中文说明与后续执行时间。
- `parseCron`、`formatCron`、`describeCron` 和 `nextOccurrences` 均为具名导出的纯函数，可独立使用。

## 文档

- [使用说明与 API](./docs/index.mdx)
- [示例源码](./docs/demos/)

在当前包目录运行 `yarn start` 可打开组件工作台，查看交互示例。
