# MD3 视频附件补充更正：radio

原 reviews-md3.json/md 中“没有MD3原生视频附件”的说法有误：此前仅查找name=video，漏掉真实缩放夹具输出的name=zoom-video-0、contentType=video/webm。cases.json仅索引PNG/JSON，不能用它缺少视频字段判断视频不存在。本补充更正该项，原评审文件原样封存、不回写；原114张PNG的实际外观观察与来源审查仍保留。

按原生results.json的contentType逐项查出MD3浅/深色两段真200%视频，原始raw与report/data副本SHA均一一匹配。使用Playwright缓存官方ffmpeg，每段只解码EOF前0.08秒的首帧并实际view_image查看，未完整播放任何视频，也未审查整段过渡或其他体系视频。

- light：EOF前约80ms实际解码帧：选中内圆点/外环、完整圆形焦点外环、长中文与on输出清楚，禁用参考圆点完整。 录像帧1280×900底部有灰色带，而原PNG为1280×813；不把录像画布边带视作页面溢出，不代替原PNG像素评估。
- dark：EOF前约80ms实际解码帧：选中内圆点/外环、完整圆形焦点外环、长中文与on输出清楚，禁用参考圆点完整。 录像帧1280×900底部有灰色带，而原PNG为1280×813；不把录像画布边带视作页面溢出，不代替原PNG像素评估。

原PNG1280×813对应CSS640×406可见viewport，video fixture明确recordVideo1280×900；底部87px灰带属录像画布范围，不作网页溢出结论。指定结尾帧不替代原PNG像素/几何核验，不是整页或静态golden。原source=sha256:b136b2e5f406321a88de6a2b4def6b4a3ba885a0a6ede79d7b2e41591c80bfcb，artifact=sha256:ca945befa7e008710cfd7bea2922372ae9332150451ffcde5505f9bf156682c6。

| 原生case | 名称/类型 | raw SHA256 | report/data副本 | 实际查看EOF−80ms帧及SHA |
| --- | --- | --- | --- | --- |
| 6112fc9f176121a3fe62-dbc9df12b0381c56a220/chromium/0 | zoom-video-0 · video/webm | 22fffb91b485fcb4e70ce1304c687bd7e1c2d2e425bd3a9b22fa6b9acd43a7b2 | [原视频](report/data/8e04d7218f9083eb1c33c89c93fc352bf82d565e.webm) · 22fffb91b485fcb4e70ce1304c687bd7e1c2d2e425bd3a9b22fa6b9acd43a7b2 | [指定帧](video-attachment-observations/light-zoom-eof-minus-080ms.png) · ead0d85449cc2deba98e6f2c67b83a7aa7992aed59eac50bb17090dbed4da925 |
| 6112fc9f176121a3fe62-af05b80749d11b79f156/chromium/0 | zoom-video-0 · video/webm | ceb871cf0467af249823047a6fa1bd9ab73bdbcb17c8d7ff3aea5651b4870d07 | [原视频](report/data/8e97b1b0f6a06d981d150cb016e14e4cfa2c95f8.webm) · ceb871cf0467af249823047a6fa1bd9ab73bdbcb17c8d7ff3aea5651b4870d07 | [指定帧](video-attachment-observations/dark-zoom-eof-minus-080ms.png) · d2c54f02ce9c5f2b8e31676fe1b9d178f87317be9c8aaf875d735e8be6881fff |

封存原评审锚点：

- reviews-md3.json：c5e2b1ee9fe4f156b4d8774a97165c71a316c80dbea3108a0c430e64300d0bac
- reviews-md3.md：794a717a53977f3a551a8b8cbdae6371336b55857f35ef6acdc77d6d12744daf

原生视频、report/data、results、原PNG及封存评审全部保留，仅新增本补充与两张已有视频解码观察帧；未新采集、改源码、构建、清理历史或建立baseline/canonical/verified。完整视频仍未观看。

