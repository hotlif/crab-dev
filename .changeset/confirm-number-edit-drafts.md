---
"@crab-dev/rc-number-edit": minor
---

数值字段在 Enter 和失焦时以同一路径确认，并将调整结果传给 `onValueCommit`。使用 `NumberEditChangeDetails.reason` 的消费者可处理新增的 `enter` 分支。
