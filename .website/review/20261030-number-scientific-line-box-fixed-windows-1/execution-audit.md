# NumberEdit 上标行框修复代表验收

2/2通过，4原图、4测量，MD3/light/medium下readonly与disabled的outlined/filled均完成实际独立交互。source/asset/原PNG全部绑定且guard稳定；仍scope filtered、complete=false。

修复前sup12px继承24px行高，内部行盒29.328125、overlay24/scroll27；当前sup12px/0px/原生super，内部行盒24，outlined overlay24/scroll24。filled新实测input/overlay40（含padding）、inner24、scroll40；旧失败没有filled独立测量，不伪造前后配对。

尾数/×10的Range相对outlined overlay由top4.671875/bottom23.671875变为top2/bottom21；sup Range由top2.34375/bottom16.34375变为top-0.328125/bottom13.671875，保留原1px容差，不能称所有字体盒精确零外延。disabled outlined记录input与overlay y差1px，原样保留、不改测量或阈值。

Number lint/type0、56默认、登记browser12通过；登记browser脚本确实构建当前库，生成CSS核对expStyle line-height0，非只测默认DOM。独立patch Changeset已新增。

root已逐张复审4原图，无新增可见缺陷；独立附记reviews-representative。两个旧fail目录与原件保留。尚不覆盖更广36、其它引擎/环境和全20状态，不自动baseline/verified。
