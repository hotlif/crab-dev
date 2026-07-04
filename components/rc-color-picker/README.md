颜色选择组件

## ✨ 特性

- OKLCH 四通道:亮度 / 色度 / 色相 / **透明度**,滑块实时可视化
- **文本输入**并支持 HEX / RGB / HSL / OKLCH **格式切换**(仅影响显示,输出恒为 OKLCH)
- **预设色板**(扁平或分组)与**吸管取色**(基于原生 EyeDropper,自动特性检测)
- 受控 / 非受控(`defaultValue`)、`disabled`、`size`、`allowClear` 重置
- 无障碍:触发器为 `role="button"`,支持 Enter/Space 键盘打开、`aria-*` 与滑块标签
- 主题能力:全量走三层 Design Token(`token.toml`),无硬编码颜色
- 当前版本:`0.0.1`;示例数量:`2` 个 Demo

## 🔨 使用示例

<demos />

## API

<api />

> 其余原生属性按底层实现透传，详见 API。
