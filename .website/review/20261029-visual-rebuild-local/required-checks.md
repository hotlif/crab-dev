# 登记附加检查累计覆盖

49 个登记单项均已有实际通过记录：原公开入口前 36 项、修复后的 Table 浏览器检查、随后独立执行的后 12 项。原 frozen-5 统一入口退出码仍为 1，未覆盖或改写为成功。

两个输入版本只相差 Table 的包内浏览器取样 helper；实际 ESM/CSS/组件工作台及完整站点产物指纹相同。Table 修复保留真正重叠区域、顶层命中、焦点和激活断言，117 项默认及 26 项浏览器用例通过。

required-checks.json 由原始结果直接生成，逐项关联公开命令、输入版本与原始日志。这是分段检查覆盖，最终冻结候选的 Windows/Linux 完整入口和视觉矩阵仍需执行。

| 序号 | 包 | 检查 | 实际结果 |
| --- | --- | --- | --- |
| 1 | @crab-dev/rc-app-main-layout | test:browser | passed |
| 2 | @crab-dev/rc-avatar | test:browser | passed |
| 3 | @crab-dev/rc-avatar | test:forced-colors | passed |
| 4 | @crab-dev/rc-badge | test:browser | passed |
| 5 | @crab-dev/rc-bar-chart | test:browser | passed |
| 6 | @crab-dev/rc-bar-chart | test:forced-colors | passed |
| 7 | @crab-dev/rc-bar-chart | test:focus | passed |
| 8 | @crab-dev/rc-canvas | test:browser | passed |
| 9 | @crab-dev/rc-card | test:browser | passed |
| 10 | @crab-dev/rc-card | test:natural | passed |
| 11 | @crab-dev/rc-color-picker | test:browser | passed |
| 12 | @crab-dev/rc-color-picker | test:forced-colors | passed |
| 13 | @crab-dev/rc-cron-picker | test:browser | passed |
| 14 | @crab-dev/rc-date-picker | test:browser | passed |
| 15 | @crab-dev/rc-divider | test:browser | passed |
| 16 | @crab-dev/rc-dropdown-container | test:browser | passed |
| 17 | @crab-dev/rc-dropdown-container | test:published | passed |
| 18 | @crab-dev/rc-form | test:browser | passed |
| 19 | @crab-dev/rc-hooks | test:browser | passed |
| 20 | @crab-dev/rc-line-edit | test:browser | passed |
| 21 | @crab-dev/rc-line-edit | test:forced-colors | passed |
| 22 | @crab-dev/rc-masonry | test:browser | passed |
| 23 | @crab-dev/rc-menu | test:browser | passed |
| 24 | @crab-dev/rc-menu | test:forced-colors | passed |
| 25 | @crab-dev/rc-notification | test:browser | passed |
| 26 | @crab-dev/rc-number-edit | test:browser | passed |
| 27 | @crab-dev/rc-pagination | test:browser | passed |
| 28 | @crab-dev/rc-pdf-editor | test:build-tools | passed |
| 29 | @crab-dev/rc-pdf-editor | test:web-component | passed |
| 30 | @crab-dev/rc-prose | test:browser | passed |
| 31 | @crab-dev/rc-segmented | test:browser | passed |
| 32 | @crab-dev/rc-select | test:browser | passed |
| 33 | @crab-dev/rc-skeleton | test:browser | passed |
| 34 | @crab-dev/rc-skeleton | test:forced-colors | passed |
| 35 | @crab-dev/rc-spin | test:reduced-motion | passed |
| 36 | @crab-dev/rc-switch | test:forced-colors | passed |
| 37 | @crab-dev/rc-table | test:browser | passed |
| 38 | @crab-dev/rc-table | test:selection | passed |
| 39 | @crab-dev/rc-table | test:forced-colors | passed |
| 40 | @crab-dev/rc-table-pro | test:browser | passed |
| 41 | @crab-dev/rc-tabs | test:browser | passed |
| 42 | @crab-dev/rc-tabs | test:forced-colors | passed |
| 43 | @crab-dev/rc-tag | test:browser | passed |
| 44 | @crab-dev/rc-tag | test:forced-colors | passed |
| 45 | @crab-dev/rc-text-edit | test:browser | passed |
| 46 | @crab-dev/rc-tree | test:browser | passed |
| 47 | @crab-dev/rc-tree | test:custom-editor | passed |
| 48 | @crab-dev/rc-tree | test:forced-colors | passed |
| 49 | @crab-dev/rc-virtual | test:browser | passed |
