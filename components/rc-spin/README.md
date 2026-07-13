加载中指示器, 用于表达耗时操作正在进行

## ✨ 特性

- 独立指示器与包裹模式二合一：传入 `children` 即笼罩该区域, 不传则单独渲染一枚指示环
- `delay` 延迟显示：秒回的请求全程不闪 spinner, 消除「闪一下就消失」的噪声反馈
- 包裹模式下内容被 `inert` 阻断——鼠标点不到, 键盘 Tab 也进不去, 而非只是看起来禁用
- `tip` 提示文案说明「正在做什么」, 并自动成为读屏播报的可访问名
- `role="status"` + `aria-live="polite"` + `aria-busy`, 加载状态对读屏可感知
- `prefers-reduced-motion` 下不静止, 而是降级为低频呼吸——加载反馈不可缺席
- `large` / `middle` / `small` 三档尺寸, 支持 `indicator` 自定义指示器
- 具名导出 `SpinIndicator`：纯视觉的旋转环, 供自身已声明 `aria-busy` 的宿主复用（如 rc-button）,
  避免嵌套 `role="status"` 造成读屏重复播报
- 当前版本：`0.0.1`
- 主题能力：支持 Design Token（token.toml）

## 🔨 使用示例

<demos />

## API

<api />

> 其余原生属性按底层实现透传, 详见 API。
