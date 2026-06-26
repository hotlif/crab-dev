分析网页性能并生成报告。参数格式：`<URL> [交互场景描述]`

示例：
- `/web-perf https://example.com`
- `/web-perf https://example.com 点击导航菜单，滚动到底部，点击登录按钮并输入账号密码`

---

## 执行步骤

使用 Chrome DevTools MCP 工具对目标网页进行完整的性能分析。将 `$ARGUMENTS` 的第一个词作为 URL，其余内容作为交互场景描述（若无则默认执行：滚动页面、点击首个可交互元素）。

### 第一阶段：准备与 Lighthouse 审计

1. 用 `mcp__chrome-devtools__new_page` 打开一个新页面标签。
2. 用 `mcp__chrome-devtools__emulate` 模拟移动设备（`device: "iPhone 15 Pro"`）以获得移动端视角的性能数据。
3. 用 `mcp__chrome-devtools__navigate_page` 导航至目标 URL，等待页面加载完成。
4. 用 `mcp__chrome-devtools__take_screenshot` 截图，确认页面已正常渲染。
5. 用 `mcp__chrome-devtools__lighthouse_audit` 执行完整的 Lighthouse 审计（categories 包含 performance、accessibility、best-practices、seo），记录各项评分与诊断建议。

### 第二阶段：运行时性能追踪（用户交互模拟）

6. 用 `mcp__chrome-devtools__emulate` 切回桌面视图（`device: "desktop"`）。
7. 重新 `mcp__chrome-devtools__navigate_page` 导航至目标 URL。
8. 用 `mcp__chrome-devtools__performance_start_trace` 开始性能追踪。
9. 按照交互场景描述依次执行以下操作（根据场景灵活组合）：
   - 滚动：`mcp__chrome-devtools__evaluate_script` 执行 `window.scrollTo(0, document.body.scrollHeight / 2)` 等
   - 点击：`mcp__chrome-devtools__click`（通过 CSS selector 定位元素）
   - 悬停：`mcp__chrome-devtools__hover`
   - 输入文字：`mcp__chrome-devtools__fill` 或 `mcp__chrome-devtools__type_text`
   - 按键：`mcp__chrome-devtools__press_key`
   - 等待：`mcp__chrome-devtools__wait_for`（等待元素出现或网络空闲）
   - 拖拽：`mcp__chrome-devtools__drag`（如需测试拖拽交互）
10. 交互完成后，用 `mcp__chrome-devtools__performance_stop_trace` 停止追踪。
11. 用 `mcp__chrome-devtools__performance_analyze_insight` 分析性能洞察，获取 LCP、CLS、INP、FID 等核心 Web Vitals 数据。

### 第三阶段：补充数据采集

12. 用 `mcp__chrome-devtools__list_network_requests` 列出所有网络请求，识别慢请求（>500ms）、过大资源（>1MB）、未压缩资源。
13. 用 `mcp__chrome-devtools__list_console_messages` 列出控制台消息，记录错误（error）和警告（warn）。
14. 最终截图 `mcp__chrome-devtools__take_screenshot` 记录交互后页面状态。
15. 用 `mcp__chrome-devtools__close_page` 关闭标签页，释放资源。

### 第四阶段：生成综合性能报告

整合以上所有数据，以 Markdown 格式输出报告，结构如下：

```
# 网页性能分析报告

**URL**：...  
**分析时间**：...  
**交互场景**：...

---

## 1. Lighthouse 评分

| 类别 | 得分 | 等级 |
|------|------|------|
| Performance（性能）| xx/100 | 🟢/🟡/🔴 |
| Accessibility（无障碍）| xx/100 | ... |
| Best Practices（最佳实践）| xx/100 | ... |
| SEO | xx/100 | ... |

## 2. 核心 Web Vitals（运行时追踪）

| 指标 | 值 | 阈值 | 状态 |
|------|----|------|------|
| LCP（最大内容绘制）| ...ms | <2500ms | ... |
| CLS（布局偏移）| ... | <0.1 | ... |
| INP（交互响应）| ...ms | <200ms | ... |
| FCP（首次内容绘制）| ...ms | <1800ms | ... |
| TTFB（首字节时间）| ...ms | <800ms | ... |

## 3. 网络请求分析

- 总请求数：x 个
- 页面总大小：x KB
- **慢请求（>500ms）**：列出 URL、耗时、大小
- **过大资源（>1MB）**：列出 URL、大小、类型
- **未优化资源**：未压缩 JS/CSS、未使用 CDN 等

## 4. 控制台问题

- 错误：列出所有 error 级别消息
- 警告：列出重要 warn 消息

## 5. 优化建议

按优先级（高/中/低）列出具体可操作的优化建议，每条包含：
- 问题描述
- 预期收益
- 建议方案

## 6. 截图

[附上页面初始状态和交互后状态的截图说明]
```

评分等级：🟢 90-100（优秀）、🟡 50-89（需改进）、🔴 0-49（较差）
