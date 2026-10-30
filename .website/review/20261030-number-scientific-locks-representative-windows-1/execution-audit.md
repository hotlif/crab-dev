# NumberEdit 科学计数锁定代表诊断 · 2026-10-30

发现精确2项/1文件，实际Windows Chromium156，1worker；2项均failed，0pass。scope=filtered，只MD3/light/medium，不能扩称全部20states。

两项均在outlined的科学计数overlay发生scrollHeight27/clientHeight24（阈值25）失败。原trace记录真实wheel(0,-120)，其后原生value/aria1250、浮层1.25×103/指数3及透明度检查已通过；不是wheel不派发或超时。filled独立交互尚未进入。

4原PNG已逐张查看并与native/hash核对：2张实际UI可见1.25×10³，无明显肉眼裁切；2张原生附带纯白图对应about:blank上下文，不能算产品白屏。

关键限制：ElementHandle.evaluate的glyphRects未进入raw trace；info.attach的参数求值在几何断言中失败，因此没有保存该数值对象。当前不能判断合法sup行框外延与实际文字裁切；不改产品、不放宽阈值，若授权再做失败前测量附件。

source sha256:52aef56d2ebe4c73702bb3888df63c253dca99c166021dd5a3bad031e6d345d8；artifact sha256:90fdeb33e48e8669e2f250ec5170cc9b5c76c4f3e890ceb20b3d7ee151cd4569；2guard前后stable，当前渲染源（含规范化manifest）与210资产全部匹配。最低 2.550GiB，守卫未触发。

原native/HTML/trace与失败完整保留，无源码更改、额外采集、baseline或verified。
