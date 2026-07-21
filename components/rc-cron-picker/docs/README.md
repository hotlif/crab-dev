+++
title = "CronPicker"
index = true
+++


# CronPicker

Cron 表达式选择器:五段式(分 时 日 月 周)表达式的可视化编辑与手动输入。


## 何时使用

- 定时任务、调度策略、报表周期等需要用户配置 cron 表达式,而用户不一定熟悉 cron 语法时
- 需要"所见即所得"的反馈:面板实时回显表达式、自然语言描述与接下来的执行时间
- 高级用户希望直接手输表达式(支持 `JAN-DEC` / `SUN-SAT` 名字、`7` 表示周日、`1,2-5`
  等复合形态,提交时自动归一化为标准写法)

解析 / 格式化 / 求下次执行时间的纯函数(`parseCron` / `formatCron` / `describeCron` /
`nextOccurrences`)均以具名导出,可在表单校验等场景独立使用。


## 代码演示

<Demos path="/docs/demos" />

## API

<API path="./src/cronPicker.tsx" />
