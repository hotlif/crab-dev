分割线, 用于在内容之间划分区隔并表达从属边界

## ✨ 特性

- 横向 / 竖向双方向, 竖线高度跟随字号, 天然适配按钮组与状态栏等行内场景
- 横线可嵌入文字兼作分节标题, 支持 `start` / `center` / `end` 三种落点与偏移量
- `solid` / `dashed` / `dotted` 三种线型, 四档留白（`none` / `small` / `middle` / `large`）
- 无障碍分级：默认为语义 `separator`；`decorative` 可将纯装饰线移出无障碍树, 避免读屏噪声
- 带文字时以 `aria-labelledby` 回指文字, 读屏播报「XX 分隔线」而非空洞的「分隔线」
- 类型层限制：竖线不可嵌文字、带文字的线不可声明 `decorative`, 非法组合在编译期即不可拼出
- 当前版本：`0.0.1`
- 主题能力：支持 Design Token（token.toml）

## 🔨 使用示例

<demos />

## API

<api />

> 其余原生属性按底层实现透传, 详见 API。
