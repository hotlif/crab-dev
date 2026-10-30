# Number 科学计数锁定：shadcn 原图复审

逐张使用view_image original查看全部40张PNG（包括重复）：Chromium24、Firefox8、WebKit8，来自20个原生用例、两种appearance阶段。40图原生附件body/导出/复核SHA均匹配，91个原生HTML report文件与本地原生证据逐文件一致，3个worker source/artifact前后稳定。未发现新的阻断外观问题。

只覆盖scientific-read-only与scientific-disabled：只读20张、禁用20张，明暗及small/medium/large（Firefox/WebKit仅medium）。全部科学值1.25×10³中的上标3完整可见，没有字段边界裁切或标签/步进图标重叠。只读值正常可读；禁用值与控制低强调。每张图已对应实际native标记：只读为readOnly=true/disabled=false，禁用为disabled=true/readOnly=false，native value均保持1.25e+3，包含此前出错的Firefox禁用组合。

每个PNG显示outlined与filled整个场景，appearance仅标记当轮测量/输入步骤的字段。截图中边框深浅可随真实指针位置不同；同字节重复PNG仍逐张查看，未用去重替代复审。Native键盘、wheel、真实scene padding点击及状态保持是独立行为证据，不由静态图替代。

新旧两批实际artifact指纹及完整资产文件表完全相同，旧54通过/6失败批保留原失败。此次测试修正真实blur后ArrowUp并核data-state，不能说runtime Sup CSS在两批间再次改变，也不回写旧source指纹。捕获源码差异逐文件：

- components/rc-number-edit/docs/number-edit.visual.spec.mjs: ab0ded96f5eaac0c124c754b0d359c2fd4b1cb97589d65757457adc2ffb81c43 → 29bd68a09c76eebf2d7fcc5399d81ba18f997421b9b7401dc2cd5288a0caf0fa

当前Number自身37份范围内来源SHA再次相符，但不宣称当前全仓与冻结Linux快照相同。此定向60-pass native与本40图复审不替代完整20状态矩阵或另在运行的511用例。未构建/新采集/改源，未编辑原始证据，未建立或批准baseline/verified；原生Canvas墨迹数据只作诊断，实际外观依据为本次原PNG。逐图观察、原生属性、worker/HTML/图片绑定见reviews-shadcn.json。
