# MD3 视频附件补充更正：checkbox

原 reviews-md3.json/md 中“没有MD3原生视频附件”的说法有误：此前仅查找name=video，漏掉真实缩放夹具输出的name=zoom-video-0、contentType=video/webm。cases.json仅索引PNG/JSON，不能用它缺少视频字段判断视频不存在。本补充更正该项，原评审文件原样封存、不回写；原132张PNG的实际外观观察与来源审查仍保留。

按原生results.json的contentType逐项查出MD3浅/深色两段真200%视频，原始raw与report/data副本SHA均一一匹配。使用Playwright缓存官方ffmpeg，每段只解码EOF前0.08秒的首帧并实际view_image查看，未完整播放任何视频，也未审查整段过渡或其他体系视频。

- light：EOF前约80ms实际解码帧：勾选方框、完整圆形外焦点环、长中文标签和on输出清楚，禁用参考项可辨。 录像帧1280×900底部有灰色带，而原PNG为1280×813；不把录像画布边带视作页面溢出，不代替原PNG像素评估。
- dark：EOF前约80ms实际解码帧：勾选方框、完整圆形外焦点环、长中文标签和on输出清楚，禁用参考项可辨。 录像帧1280×900底部有灰色带，而原PNG为1280×813；不把录像画布边带视作页面溢出，不代替原PNG像素评估。

原PNG1280×813对应CSS640×406可见viewport，video fixture明确recordVideo1280×900；底部87px灰带属录像画布范围，不作网页溢出结论。指定结尾帧不替代原PNG像素/几何核验，不是整页或静态golden。原source=sha256:b2018cc16cb225c80afbd0053f898b583953700f9c2bf88b94589cf87f32711b，artifact=sha256:a6623d51bffaf00879e651744d65d5eed0ebbe47ba71fedaac78a7830ec1952a。

| 原生case | 名称/类型 | raw SHA256 | report/data副本 | 实际查看EOF−80ms帧及SHA |
| --- | --- | --- | --- | --- |
| 4ce4212075a27b44e623-65fd4574814d908d8a62/chromium/0 | zoom-video-0 · video/webm | 01b6d92d9d82f35a03a7a1f6cbe3d1a0265f800bde7a89f87e67743b3b4e825b | [原视频](report/data/d0ad7833ebe01507ecd2400c190213c234b063ce.webm) · 01b6d92d9d82f35a03a7a1f6cbe3d1a0265f800bde7a89f87e67743b3b4e825b | [指定帧](video-attachment-observations/light-zoom-eof-minus-080ms.png) · 17f56080cd8353a896d71df39495e11d3aaafb1d02cfa40ab616de090114576e |
| 4ce4212075a27b44e623-3ab341506165a2af8361/chromium/0 | zoom-video-0 · video/webm | d2a3ba5ce23eb37eb1cbe4e09120d6dc72e065db028a44040b45bfb17623a438 | [原视频](report/data/f453166bd851dd4e115fbb8d848fa26f7391dc2b.webm) · d2a3ba5ce23eb37eb1cbe4e09120d6dc72e065db028a44040b45bfb17623a438 | [指定帧](video-attachment-observations/dark-zoom-eof-minus-080ms.png) · 4371993d1a9743e52860d82a789ac15189e8369cde0f8b4c6d3031b2faaade1b |

封存原评审锚点：

- reviews-md3.json：a6099a60d251a43b3e5e4ea81f7646284bcd2ac2a83b7b892fe2e9f09f675ac0
- reviews-md3.md：245263de724b9f3fa84fa1c81283909b634b548d34ffa732c08ecd218ff46b87

原生视频、report/data、results、原PNG及封存评审全部保留，仅新增本补充与两张已有视频解码观察帧；未新采集、改源码、构建、清理历史或建立baseline/canonical/verified。完整视频仍未观看。

