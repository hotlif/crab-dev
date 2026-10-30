# NumberEdit 科学上标原生测量 · 2026-10-30

同2项MD3/light/medium代表仍2failed；仅outlined进入测量，filled独立交互未进入。两项都有断言前原生附件，所有原图与旧失败保留。

| 目标 | 实测 |
| --- | --- |
| input/overlay | y127.5、高24、底151.5 |
| overlay client/scroll | 24 / 27；overflow hidden |
| 内层span行盒 | y124.84375、高29.328125、底154.171875 |
| sup字号/行高/对齐 | 12px / 24px / 原生super |
| 尾数与×10 Range | y132.171875..151.171875 |
| 指数3 Range | y129.84375..143.84375 |

当前Range均在overlay真实裁切盒内，不能称已证实裁字。是固定行高继承撑大sup所在行盒；Canvas只提供原始font/ink数值，不能替代原图。

两项wheel均trusted、deltaY-120，nativeValue保留1.25e+3，readOnly/disabled对应正确。4原PNG逐张查看：2实际UI、2附带空白视口，不归因产品白屏。

2guard前后stable，渲染源/资产按共享hasher一致。修复前source/CSS/ESM已逐字节归档到test-sources；此审计封存于产品修改前。未建立baseline或verified。
