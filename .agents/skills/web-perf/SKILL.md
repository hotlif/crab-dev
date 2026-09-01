---
name: web-perf
description: Analyze a web page's speed, Lighthouse results, Core Web Vitals, runtime interactions, network activity, and console issues. Use when the user provides a URL and asks for web performance analysis, page-speed diagnostics, Lighthouse, Web Vitals, a performance trace, or invokes $web-perf.
---

# Web Performance Audit

对目标网页执行可复核的性能分析，并以中文生成 Markdown 报告。

## 输入

- 调用格式：`$web-perf <URL> [交互场景描述]`。
- 将请求中的第一个 URL 作为目标，其余文字作为交互场景。缺少 URL 时询问用户。
- 未给场景时，默认滚动页面并操作第一个安全、可逆的交互元素。
- 不得自行执行购买、发布、删除、提交真实表单或输入凭据等高影响操作；只有用户明确授权并提供必要信息时才执行。

## 能力与真实性

- 使用当前会话可用的浏览器或 Chrome 控制技能，并遵守其浏览器选择、登录状态、权限和交互规则。用户明确指定浏览器时不得擅自替换。
- 优先使用环境真实提供的 Lighthouse、设备模拟、性能追踪、网络日志和控制台能力。调用前先确认能力存在。
- 不得自动安装 Lighthouse、浏览器扩展或其他依赖。缺失能力时继续收集可获得的数据，并在相应报告栏明确写“当前能力不可用”。
- 不得估算、推断或编造评分、耗时、资源大小、Web Vitals 或审计结论。每个数值都必须来自实际工具输出或页面 Performance API。
- 遇到登录墙时使用用户已选择浏览器中的现有登录状态；不得用搜索或其他站点绕过认证。

## 审计流程

1. 打开新标签页导航至 URL，等待主要内容稳定，记录最终 URL、分析时间与初始截图。
2. 如果支持设备模拟，切换到接近 iPhone 15 Pro 的移动视口。若支持 Lighthouse，运行 performance、accessibility、best-practices、seo 四类审计并保存评分与诊断项。
3. 切回桌面视图并重新加载页面。开始交互前，启用可用的性能追踪或 PerformanceObserver，收集 navigation timing、paint、LCP、CLS、INP 与 long task；不能通过当前环境观测的指标标记为不可用。
4. 按场景依次滚动、点击、悬停、输入、按键、等待或拖拽。优先使用可访问名称、角色和稳定定位器；操作后确认页面状态符合预期。
5. 停止追踪并提取实际可用的 LCP、CLS、INP、FCP、TTFB；工具额外提供 FID 等指标时列为补充数据。
6. 收集可用的网络请求信息，识别耗时超过 500 ms 的请求、大小超过 1 MB 的资源，以及能由证据确认的压缩或缓存问题。
7. 收集控制台 error 与重要 warning，并获取交互后的最终截图。
8. 只关闭本次新建的标签页，不关闭用户原有标签页。

## 报告要求

输出以下结构；没有可靠数据的单元格写“当前能力不可用”，不得删除整节或填入猜测值。

```markdown
# 网页性能分析报告

**URL**：...
**分析时间**：...
**交互场景**：...

## 1. Lighthouse 评分

| 类别 | 得分 | 等级 |
| --- | --- | --- |
| Performance | .../100 | 🟢/🟡/🔴 |
| Accessibility | .../100 | ... |
| Best Practices | .../100 | ... |
| SEO | .../100 | ... |

## 2. 核心 Web Vitals 与运行时指标

| 指标 | 实测值 | 参考阈值 | 状态 |
| --- | --- | --- | --- |
| LCP | ... ms | < 2500 ms | ... |
| CLS | ... | < 0.1 | ... |
| INP | ... ms | < 200 ms | ... |
| FCP | ... ms | < 1800 ms | ... |
| TTFB | ... ms | < 800 ms | ... |

## 3. 网络请求分析

- 总请求数与页面总传输量
- 慢请求（> 500 ms）：URL、耗时、大小
- 过大资源（> 1 MB）：URL、大小、类型
- 有证据支持的压缩、缓存与加载问题

## 4. 控制台问题

- Error：...
- Warning：...

## 5. 优化建议

按高、中、低优先级列出问题、证据、预期收益和可操作方案。区分实测事实与基于证据的推断。

## 6. 截图

- 初始状态：附实际截图
- 交互后状态：附实际截图
```

Lighthouse 等级：🟢 90–100，🟡 50–89，🔴 0–49。优化建议必须引用前文实际发现，不得给出与页面无关的通用清单。
