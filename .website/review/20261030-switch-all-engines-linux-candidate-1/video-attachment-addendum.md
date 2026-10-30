# MD3 视频附件补充更正：switch

原 reviews-md3.json/md 中“没有MD3原生视频附件”的说法有误：此前仅查找name=video，漏掉真实缩放夹具输出的name=zoom-video-0、contentType=video/webm。cases.json仅索引PNG/JSON，不能用它缺少视频字段判断视频不存在。本补充更正该项，原评审文件原样封存、不回写；原114张PNG的实际外观观察与来源审查仍保留。

按原生results.json的contentType逐项查出MD3浅/深色两段真200%视频，原始raw与report/data副本SHA均一一匹配。使用Playwright缓存官方ffmpeg，每段只解码EOF前0.08秒的首帧并实际view_image查看，未完整播放任何视频，也未审查整段过渡或其他体系视频。

- light：EOF前约80ms实际解码帧：选中轨道、末侧拇指、完整外焦点轮廓、长中文和on输出清楚，禁用参考轨道完整。 录像帧1280×900底部有灰色带，而原PNG为1280×813；不把录像画布边带视作页面溢出，不代替原PNG像素评估。
- dark：EOF前约80ms实际解码帧：选中轨道、末侧拇指、完整外焦点轮廓、长中文和on输出清楚，禁用参考轨道完整。 录像帧1280×900底部有灰色带，而原PNG为1280×813；不把录像画布边带视作页面溢出，不代替原PNG像素评估。

原PNG1280×813对应CSS640×406可见viewport，video fixture明确recordVideo1280×900；底部87px灰带属录像画布范围，不作网页溢出结论。指定结尾帧不替代原PNG像素/几何核验，不是整页或静态golden。原source=sha256:b2018cc16cb225c80afbd0053f898b583953700f9c2bf88b94589cf87f32711b，artifact=sha256:d22bfc4d34a2453b8d9370de6373615014351de9bafa5c0efb3039f24ad2ef26。

| 原生case | 名称/类型 | raw SHA256 | report/data副本 | 实际查看EOF−80ms帧及SHA |
| --- | --- | --- | --- | --- |
| fa242b81ff824cff60df-adf473bfe5b50704afe5/chromium/0 | zoom-video-0 · video/webm | d96f594a22d1b8d69d962decfeb7b6f6a268775ccbaef677b428b5f084f42a64 | [原视频](report/data/9808510763154597e7d75c6d4e0730cbf5050559.webm) · d96f594a22d1b8d69d962decfeb7b6f6a268775ccbaef677b428b5f084f42a64 | [指定帧](video-attachment-observations/light-zoom-eof-minus-080ms.png) · 51c60d33fcf4c6b39bff7fbb65e01d56cec3009bc874f10266e976845bdd38dc |
| fa242b81ff824cff60df-53bbe8f2429fe3ff254c/chromium/0 | zoom-video-0 · video/webm | ea14bf793a9dd238e70c856b9b9d633cb84a5b393b4908b5a80ac7a7f46d28e9 | [原视频](report/data/28c0e03e2f2d8267e84e34342ef2ebb7d37590bb.webm) · ea14bf793a9dd238e70c856b9b9d633cb84a5b393b4908b5a80ac7a7f46d28e9 | [指定帧](video-attachment-observations/dark-zoom-eof-minus-080ms.png) · 62451c0cf017fdca24de279c741546859a842ff4da656908a62cc76459a1b272 |

封存原评审锚点：

- reviews-md3.json：47138d8e82c982fef5bf9679ba1c90672f0a31d7148691383b55bf54257ac3dc
- reviews-md3.md：58bd67000afb2bb8d0b34e32d2eda34c856209b0376cb9c9d7277e70e3fcc57a

原生视频、report/data、results、原PNG及封存评审全部保留，仅新增本补充与两张已有视频解码观察帧；未新采集、改源码、构建、清理历史或建立baseline/canonical/verified。完整视频仍未观看。

