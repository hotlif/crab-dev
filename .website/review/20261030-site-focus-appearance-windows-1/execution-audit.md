# 站点首批 Windows 执行证据审计

本次只读核对原生 `.cache/visual/site-focus-appearance-windows-20261030-1` 与此 review，未逐图外观评审、未采集/构建/改源、未建立 baseline/verified。

真实范围：36 个 attempts，全部 Chromium；18 appearance passed、18 navigation failed，0 skipped/flaky、顶层 errors0。原生 stats 的 expected18 表示符合预期结果的18项，unexpected18是失败18项，不能把 expected18 当成总计划数。Firefox/WebKit 在本批均未运行。

174 PNG全部与原生附件/文件及导出 SHA 一致；183 个原生HTML report文件、43 个不可变根文件全部逐文件字节相同。18 个视频逐一绑定原生SHA及导出report副本。20份 worker 的 source/artifact/完整siteBuild均前后完全相等，且复制字节未变。

| 图片角色 | 数量 | 可作静态golden |
| --- | ---: | --- |
| appearance-live/tutorial-live自然时间序列 | 108 | 否 |
| navigation在失败前的真实过程capture | 30 | 否，本用例最终失败 |
| 相同原字节的空白次页面诊断图 | 18 | 否 |
| Form预期外目的页失败诊断图 | 18 | 否 |

每个appearance用例六帧分两阶段：前3帧 appearance-live 在下一设计体系及翻转后的明暗；后3帧 tutorial-live 回到初始设计/明暗。设计顺序 `md3 → apple → shadcn` 来源于与捕获哈希相同的registry清单。JSON逐图记录初始配置、实际阶段配置、附件序号和时间序列，不能只按case标题分派外观评审。

共36条三时刻time-series JSON，18段原生视频保留；guide中真实持续旋转控件保持运行，tutorial对应空动画数组也按时间序列角色保留，不因PNG相同而提升静态golden。只表示可见viewport，不能外推整页或全部组件状态。

18个导航失败全部具有同一原生签名：readySitePage第30行h1期待LineEdit、实际Form。本批旧测试ArrowDown从默认已选首项移动到Form FAQ后Enter，仍断言LineEdit；已有triage通过代表性原生trace确认操作、选中项和URL链路，非产品排序/href缺陷。此审计没有分别复审18份trace，但已逐项核相同失败签名。原triage所看空白诊断图SHA `3878570f4a62a0d65f57cf1754e0269e56ec797f4e36e26b44c172eb6e800401` 与本批18份原图逐字节相同，保留为空白次页面诊断；另18份保留预期外目的页诊断角色，不当产品视觉通过或失败判据。

捕获source=`sha256:233a188b4f1fab60925de9affbd22c76e13aea0b303b23031bf57471086a3e65`、artifact=`sha256:caaa2e325183ae7c996c04ca4f771c13c77aa1ac188dea3485041171368aa719`、完整siteBuild=`sha256:49e777a2a23e7732e5b17e077b53ce172e692c995ae68f3d7a1bc34d46963dd0`。当前仅导航测试的核对SHA已不同；appearance与support/registry仍匹配捕获。旧指纹未回写，旧失败不能冒充修复后通过。三项输入稳定说明本次证据绑定完整，不代表全部验收完成。

审计问题：0。完整逐图/视频/文件/worker/36case/错误签名与triage锚点见 execution-audit.json。
