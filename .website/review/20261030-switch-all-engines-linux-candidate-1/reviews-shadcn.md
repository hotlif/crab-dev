# Switch shadcn 原图复审

已逐张实际使用 view_image original 查看全部114张PNG，包括重复图：Chromium94、Firefox10、WebKit10；114张原图SHA、原生附件body SHA和复核SHA一致，6份捕获worker source/artifact均稳定。无新增阻断外观问题。

范围：核心矩阵88张（Chromium72、Firefox8、WebKit8），环境18张，真实200%可见视口2张，默认库存6张。具名Linux候选108张，库存6张只作默认展示证据。未建立/批准基准，未执行两次普通比较，未更新verified或生命周期。

浅色关闭态的1px手柄边界可辨，明暗选中中性配对、三档轨道/圆柄比例、错误关闭/开启和禁用层级完整。各尺寸键盘焦点圈未见裁切；禁用选中各图均显示on，与开启姿态一致。shadcn hover/pressed部分字节与默认/选中相同，重复图仍逐张查看；本体系不叠加MD3光晕或改变手柄尺寸，不把相同图自动判为原生交互未发生。

320px与英文长标签自然换行，RTL对齐和开启方向一致；品牌紫色与强制颜色系统配对可见。两张200%图仅证明真实缩放下当前可见viewport的轨道、外焦点圈、标签及on完整，不外推整页。减少动画图片不证明时长；视频本次未逐段评审。

可见外观与不可见命中范围分别记录：已有原生Chromium环境/缩放断言使用CDP实际伪元素box model、真实边缘click/tap和状态/输出反馈；PNG本身不能证明48px目标或跨引擎伪元素命中。Firefox/WebKit仅按实际默认/焦点/选中/禁用选中子集评审。

当前Switch自身29份来源及5份published ESM/CSS均再次与捕获SHA相符。没有声称当前全仓等于快照：其他输入包正扩展，宿主.cache/visual-workbench也属于另一构建缓存（index/404/manifest不同，16份Linux hash命名文件宿主缺失）。本结论绑定冻结Linux真实资产指纹、稳定worker、原生附件及这些原图；没有修改、重建或回写旧指纹。

固定参考为shadcn New York V4提交3d98900e9b73c45f035f8109e9d41ba6a51685e7，浅色关闭柄边界是已记录的项目桌面适配。逐图case/engine/config/hash/观察、disabled-selected反馈、原生几何和范围限制见reviews-shadcn.json。

