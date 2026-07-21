# @crab-dev/rc-cron-picker

Cron 表达式选择器:五段式(分 时 日 月 周)表达式的可视化编辑、手动输入解析与下次执行时间预览。

```tsx
import CronPicker from '@crab-dev/rc-cron-picker';

<CronPicker defaultValue="30 9 * * 1-5" onChange={(expr) => console.log(expr)} />
```

- 弹层面板按字段分栏,每字段支持 每 / 步进 / 区间 / 指定值 四种模式
- 输入框可直接手输表达式,宽容解析(英文名、周日 7、复合形态),提交时归一化为标准写法
- 底部实时回显表达式、中文描述与接下来的执行时间
- 纯函数 `parseCron` / `formatCron` / `describeCron` / `nextOccurrences` 具名导出,可独立使用
