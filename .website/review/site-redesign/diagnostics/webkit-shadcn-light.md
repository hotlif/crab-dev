# Test info

- Name: .website/docs/site/site-motion.visual.spec.mjs >> Site motion respects focus and reduced motion shadcn light
- Location: .website/docs/site/site-motion.visual.spec.mjs:88:5

# Error details

```
Error: Browser runtime errors

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "ResizeObserver loop completed with undelivered notifications.",
+ ]
```

# Page snapshot

```yaml
- generic [ref=f1e4]:
  - status [ref=f1e5]
  - generic [ref=f1e7]:
    - link "跳到主要内容" [ref=f1e8] [cursor=pointer]:
      - /url: "#_r_1_"
    - banner [ref=f1e13]:
      - link "Crab UI" [ref=f1e14] [cursor=pointer]:
        - /url: /
      - navigation "主导航" [ref=f1e23]:
        - link "开始" [ref=f1e24] [cursor=pointer]:
          - /url: /guides/getting-started
        - link "组件" [ref=f1e39] [cursor=pointer]:
          - /url: /learn/components
        - link "设计" [ref=f1e47] [cursor=pointer]:
          - /url: /guides/design-styles
        - link "实战" [ref=f1e55] [cursor=pointer]:
          - /url: /learn
        - link "维护" [ref=f1e62] [cursor=pointer]:
          - /url: /guides/contributing
        - link "GitHub" [ref=f1e71] [cursor=pointer]:
          - /url: https://github.com/hotlif/crab-dev
      - button "搜索文档" [ref=f1e78] [cursor=pointer]:
        - generic [ref=f1e84]:
          - generic [ref=f1e85]: 搜索文档…
          - generic [ref=f1e86]: Ctrl K
      - button "文档外观：shadcn/ui · 浅色" [ref=f1e90] [cursor=pointer]:
        - generic [ref=f1e96]: shadcn/ui
    - group "文档内容" [ref=f1e98]:
      - main [ref=f1e99]:
        - article [ref=f1e101]:
          - generic [ref=f1e104]:
            - region "Crab UI 组件文档" [ref=f1e105]:
              - generic [ref=f1e106]:
                - generic [ref=f1e107]:
                  - generic [ref=f1e108]: 为 React 19 而构建
                  - heading "Crab UI" [level=1] [ref=f1e109]
                  - paragraph [ref=f1e110]: 从组件开始，构建清晰界面。
                  - paragraph [ref=f1e111]: 一套组件，三种设计语言。从日常交互到复杂业务，用一致的 API 和设计令牌连接每个细节。
                - generic [ref=f1e112]:
                  - generic [ref=f1e113]:
                    - link "开始使用" [ref=f1e114] [cursor=pointer]:
                      - /url: /guides/getting-started
                      - generic [aria-hidden] [ref=f1e118]: →
                    - link "组件目录" [ref=f1e119] [cursor=pointer]:
                      - /url: /learn/components
                  - generic [ref=f1e122]:
                    - generic [ref=f1e123]: 一种体验，三种表达
                    - radiogroup "首页设计体系" [ref=f1e124]:
                      - generic [ref=f1e125] [cursor=pointer]:
                        - radio "MD3" [ref=f1e126]
                        - generic [ref=f1e127]: MD3
                      - generic [ref=f1e128] [cursor=pointer]:
                        - radio "Apple" [ref=f1e129]
                        - generic [ref=f1e130]: Apple
                      - generic [ref=f1e131] [cursor=pointer]:
                        - radio "shadcn" [checked] [ref=f1e132]
                        - generic [ref=f1e133]: shadcn
                    - paragraph [ref=f1e134]: 清晰描边，简洁表达。
                  - paragraph [ref=f1e135]: 54 个包 · MD3 Expressive / Apple / shadcn
                  - navigation "首页快速入口" [ref=f1e136]:
                    - link "设计令牌 ↗" [ref=f1e137] [cursor=pointer]:
                      - /url: /components/rc-token-semantic
                    - link "无障碍 ↗" [ref=f1e140] [cursor=pointer]:
                      - /url: /guides/accessibility
                    - link "业务实战" [ref=f1e143] [cursor=pointer]:
                      - /url: "#practice"
              - region "交互组件预览" [ref=f1e147]:
                - generic [ref=f1e148]:
                  - generic [ref=f1e149]: COMPONENTS IN ACTION
                  - generic [ref=f1e151]: 交互预览
                - generic [ref=f1e152]:
                  - generic [ref=f1e153]:
                    - generic [ref=f1e154]: 创建工作区
                    - generic [ref=f1e155]: 实时预览
                  - generic [ref=f1e159]:
                    - paragraph [ref=f1e160]: 从一个小小的工作区开始。
                    - generic [ref=f1e161]:
                      - generic [ref=f1e162]: 示例项目名称
                      - textbox "示例项目名称" [ref=f1e165]:
                        - /placeholder: " "
                        - text: Design workspace
                    - generic [ref=f1e166]:
                      - generic [ref=f1e167]:
                        - strong [ref=f1e168]: 团队协作
                        - paragraph [ref=f1e169]: 让灵感在团队中流动。
                      - switch "允许团队协作" [checked] [ref=f1e171] [cursor=pointer]
                    - button "创建项目" [ref=f1e173] [cursor=pointer]:
                      - generic [ref=f1e175]: 创建项目 ↗
                    - status [ref=f1e176]: 试着修改名称，创建你的第一个项目。
                - generic [ref=f1e177]:
                  - generic [ref=f1e178]:
                    - generic [ref=f1e179]: 状态与反馈
                    - generic [ref=f1e180]: 设计已同步
                    - generic [ref=f1e182]: 颜色、形状、动效，自然一致。
                  - generic [ref=f1e183]:
                    - generic [ref=f1e184]: 试试切换视图
                    - radiogroup "示例视图" [ref=f1e185]:
                      - generic [ref=f1e186] [cursor=pointer]:
                        - radio "概览" [checked] [ref=f1e187]
                        - generic [ref=f1e188]: 概览
                      - generic [ref=f1e189] [cursor=pointer]:
                        - radio "活动" [ref=f1e190]
                        - generic [ref=f1e191]: 活动
                    - generic [ref=f1e192]: 当前主题，即刻预览。
                - generic [ref=f1e193]:
                  - generic [ref=f1e194]: 真实组件 · 当前主题
                  - generic [aria-hidden] [ref=f1e195]: ↗
            - region [ref=f1e197]:
              - generic [ref=f1e198]:
                - generic [ref=f1e199]:
                  - text: 组件能力墙
                  - heading "真实组件，组合出完整体验。" [level=2] [ref=f1e200]
                  - paragraph [ref=f1e201]: 默认跟随全站风格与明暗模式；局部设置可以独立覆盖，直接体验输入、选择、状态和反馈。
                - generic "组件能力墙主题设置" [ref=f1e202]:
                  - generic [ref=f1e203]:
                    - generic [ref=f1e204]: 主题
                    - radiogroup "主题" [ref=f1e205]:
                      - generic [ref=f1e206] [cursor=pointer]:
                        - radio "跟随全站" [checked] [ref=f1e207]
                        - generic [ref=f1e208]: 跟随全站
                      - generic [ref=f1e209] [cursor=pointer]:
                        - radio "亮色" [ref=f1e210]
                        - generic [ref=f1e211]: 亮色
                      - generic [ref=f1e212] [cursor=pointer]:
                        - radio "暗色" [ref=f1e213]
                        - generic [ref=f1e214]: 暗色
                  - generic [ref=f1e215]:
                    - generic [ref=f1e216]: 尺寸
                    - radiogroup "尺寸" [ref=f1e217]:
                      - generic [ref=f1e218] [cursor=pointer]:
                        - radio "小" [ref=f1e219]
                        - generic [ref=f1e220]: 小
                      - generic [ref=f1e221] [cursor=pointer]:
                        - radio "中" [checked] [ref=f1e222]
                        - generic [ref=f1e223]: 中
                      - generic [ref=f1e224] [cursor=pointer]:
                        - radio "大" [ref=f1e225]
                        - generic [ref=f1e226]: 大
                  - generic [ref=f1e227]:
                    - generic [ref=f1e228]: 品牌色
                    - radiogroup "品牌色" [ref=f1e229]:
                      - generic [ref=f1e230] [cursor=pointer]:
                        - radio "默认" [checked] [ref=f1e231]
                        - generic [ref=f1e232]: 默认
                      - generic [ref=f1e233] [cursor=pointer]:
                        - radio "紫罗兰" [ref=f1e234]
                        - generic [ref=f1e235]: 紫罗兰
                      - generic [ref=f1e236] [cursor=pointer]:
                        - radio "葡萄紫" [ref=f1e237]
                        - generic [ref=f1e238]: 葡萄紫
                      - generic [ref=f1e239] [cursor=pointer]:
                        - radio "靛青" [ref=f1e240]
                        - generic [ref=f1e241]: 靛青
              - generic [ref=f1e242]:
                - generic [ref=f1e243]:
                  - generic [ref=f1e244]:
                    - generic [ref=f1e245]:
                      - generic [ref=f1e246]:
                        - generic [ref=f1e247]: 创建工作区
                        - generic [ref=f1e248]: 表单
                      - generic [ref=f1e252]:
                        - generic [ref=f1e254]:
                          - generic [ref=f1e255]: 工作区名称
                          - generic [ref=f1e257]:
                            - textbox "工作区名称" [ref=f1e258]:
                              - /placeholder: " "
                              - text: Crab Design
                            - button "清除" [ref=f1e259] [cursor=pointer]
                          - generic [ref=f1e265]: 最多 24 字，可随时修改。
                        - generic [ref=f1e267]:
                          - generic [ref=f1e268]: 应用类型
                          - combobox "应用类型" [ref=f1e272] [cursor=pointer]:
                            - generic [ref=f1e273]:
                              - generic [ref=f1e274]:
                                - generic [ref=f1e275]: 设计系统
                                - button "移除 设计系统" [ref=f1e276]
                              - generic [ref=f1e281]:
                                - generic [ref=f1e282]: 数据应用
                                - button "移除 数据应用" [ref=f1e283]
                            - button "展开选项" [ref=f1e289]
                        - generic [ref=f1e295]:
                          - generic [ref=f1e296]:
                            - generic [ref=f1e297]: 计划日期
                            - generic [ref=f1e299]:
                              - textbox "计划日期" [ref=f1e300]:
                                - /placeholder: 选择日期
                              - button "打开日历" [ref=f1e302] [cursor=pointer]
                          - generic [ref=f1e307]:
                            - generic [ref=f1e308]: 强调色
                            - button "强调色" [ref=f1e310] [cursor=pointer]
                        - button "创建工作区" [ref=f1e312] [cursor=pointer]
                    - generic [ref=f1e315]:
                      - generic [ref=f1e316]:
                        - generic [ref=f1e317]: 发布进度
                        - strong [ref=f1e319]: 68%
                      - generic [ref=f1e321]:
                        - slider "发布进度" [ref=f1e322] [cursor=pointer]
                        - generic [ref=f1e327]:
                          - generic [ref=f1e328]: 自动检查
                          - generic [ref=f1e330]: 进行中
                  - generic [ref=f1e332]:
                    - generic [ref=f1e333]:
                      - generic [ref=f1e334]: 团队协作
                      - generic [ref=f1e337]:
                        - generic [ref=f1e338]:
                          - generic "项目成员" [ref=f1e339]:
                            - generic [ref=f1e340]: 林
                            - generic [ref=f1e343]: 周
                            - generic [ref=f1e346]: 陈
                            - generic [ref=f1e350]:
                              - generic [ref=f1e351]: 许
                              - status "另外 2 个头像":
                                - generic: "+2"
                          - generic [ref=f1e353]: 6 位成员在线
                        - group "参与频道" [ref=f1e354]:
                          - group [ref=f1e356]:
                            - generic [ref=f1e357] [cursor=pointer]:
                              - checkbox "产品" [checked] [ref=f1e358]
                              - generic [ref=f1e361]: 产品
                            - generic [ref=f1e362] [cursor=pointer]:
                              - checkbox "设计" [checked] [ref=f1e363]
                              - generic [ref=f1e366]: 设计
                            - generic [ref=f1e367] [cursor=pointer]:
                              - checkbox "研发" [ref=f1e368]
                              - generic [ref=f1e371]: 研发
                        - group "摘要频率" [ref=f1e372]:
                          - radiogroup "摘要频率" [ref=f1e374]:
                            - generic [ref=f1e375] [cursor=pointer]:
                              - radio "每天" [ref=f1e376]
                              - generic [ref=f1e379]: 每天
                            - generic [ref=f1e380] [cursor=pointer]:
                              - radio "每周" [checked] [ref=f1e381]
                              - generic [ref=f1e384]: 每周
                        - generic [ref=f1e385]:
                          - generic [ref=f1e386]:
                            - strong [ref=f1e387]: 消息提醒
                            - generic [ref=f1e388]: 仅发送与你有关的更新
                          - generic [ref=f1e389] [cursor=pointer]:
                            - switch "消息提醒" [checked] [ref=f1e390]
                            - generic [ref=f1e392]: 开
                    - alert [ref=f1e393]:
                      - generic [ref=f1e397]:
                        - generic [ref=f1e398]: 设计令牌已同步
                        - generic [ref=f1e399]: 颜色、间距和圆角已更新到当前预览。
                  - generic [ref=f1e400]:
                    - generic [ref=f1e402]:
                      - generic [aria-hidden] [ref=f1e403]: C
                      - heading "欢迎使用 Crab UI" [level=3] [ref=f1e404]
                      - paragraph [ref=f1e405]: 用一致的组件和设计令牌，更快构建企业应用。
                      - button "立即开始" [ref=f1e406] [cursor=pointer]
                      - generic [ref=f1e409]: 或者
                      - button "进入团队工作区" [ref=f1e411] [cursor=pointer]
                    - generic [ref=f1e414]:
                      - generic [ref=f1e415]: 视图设置
                      - generic [ref=f1e418]:
                        - radiogroup "视图设置" [ref=f1e419]:
                          - generic [ref=f1e420] [cursor=pointer]:
                            - radio "概览" [checked] [ref=f1e421]
                            - generic [ref=f1e422]: 概览
                          - generic [ref=f1e423] [cursor=pointer]:
                            - radio "任务" [ref=f1e424]
                            - generic [ref=f1e425]: 任务
                          - generic [ref=f1e426] [cursor=pointer]:
                            - radio "成员" [ref=f1e427]
                            - generic [ref=f1e428]: 成员
                        - generic "当前状态" [ref=f1e429]:
                          - generic [ref=f1e430]: 运行正常
                          - generic [ref=f1e432]: 概览
                          - generic [ref=f1e434]: 2 个频道
                        - generic [ref=f1e436]:
                          - button "保存" [ref=f1e437] [cursor=pointer]
                          - button "撤销" [ref=f1e440] [cursor=pointer]
                - status [ref=f1e443]: 所有组件均使用当前局部主题。切换设置即可实时预览。
            - region [ref=f1e445]:
              - generic [ref=f1e446]:
                - generic [ref=f1e447]:
                  - text: 精选任务
                  - heading "从常用能力开始探索。" [level=2] [ref=f1e448]
                  - paragraph [ref=f1e449]: 按界面任务查找常用组件，或浏览完整组件目录。
                - link "查看全部组件" [ref=f1e450] [cursor=pointer]:
                  - /url: /learn/components
                  - generic [ref=f1e452]: 查看全部组件 →
              - generic [ref=f1e453]:
                - article [ref=f1e454]:
                  - generic [ref=f1e456]:
                    - generic [ref=f1e457]:
                      - heading "输入与操作" [level=3] [ref=f1e458]
                      - paragraph [ref=f1e459]: 录入、选择和提交清晰可控。
                    - navigation "输入与操作组件" [ref=f1e460]:
                      - link "按钮" [ref=f1e461] [cursor=pointer]:
                        - /url: /components/rc-button
                        - generic [aria-hidden] [ref=f1e465]: →
                      - link "表单" [ref=f1e466] [cursor=pointer]:
                        - /url: /components/rc-form
                        - generic [aria-hidden] [ref=f1e470]: →
                      - link "选择器" [ref=f1e471] [cursor=pointer]:
                        - /url: /components/rc-select
                        - generic [aria-hidden] [ref=f1e475]: →
                      - link "文本输入" [ref=f1e476] [cursor=pointer]:
                        - /url: /components/rc-line-edit
                        - generic [aria-hidden] [ref=f1e480]: →
                - article [ref=f1e481]:
                  - generic [ref=f1e483]:
                    - generic [ref=f1e484]:
                      - heading "信息展示" [level=3] [ref=f1e485]
                      - paragraph [ref=f1e486]: 让对象、状态和层级一目了然。
                    - navigation "信息展示组件" [ref=f1e487]:
                      - link "卡片" [ref=f1e488] [cursor=pointer]:
                        - /url: /components/rc-card
                        - generic [aria-hidden] [ref=f1e492]: →
                      - link "头像" [ref=f1e493] [cursor=pointer]:
                        - /url: /components/rc-avatar
                        - generic [aria-hidden] [ref=f1e497]: →
                      - link "标签" [ref=f1e498] [cursor=pointer]:
                        - /url: /components/rc-tag
                        - generic [aria-hidden] [ref=f1e502]: →
                      - link "空状态" [ref=f1e503] [cursor=pointer]:
                        - /url: /components/rc-empty
                        - generic [aria-hidden] [ref=f1e507]: →
                - article [ref=f1e508]:
                  - generic [ref=f1e510]:
                    - generic [ref=f1e511]:
                      - heading "反馈与浮层" [level=3] [ref=f1e512]
                      - paragraph [ref=f1e513]: 及时解释结果和下一步操作。
                    - navigation "反馈与浮层组件" [ref=f1e514]:
                      - link "对话框" [ref=f1e515] [cursor=pointer]:
                        - /url: /components/rc-dialog
                        - generic [aria-hidden] [ref=f1e519]: →
                      - link "抽屉" [ref=f1e520] [cursor=pointer]:
                        - /url: /components/rc-drawer
                        - generic [aria-hidden] [ref=f1e524]: →
                      - link "警告提示" [ref=f1e525] [cursor=pointer]:
                        - /url: /components/rc-alert
                        - generic [aria-hidden] [ref=f1e529]: →
                      - link "文字提示" [ref=f1e530] [cursor=pointer]:
                        - /url: /components/rc-tooltip
                        - generic [aria-hidden] [ref=f1e534]: →
                - article [ref=f1e535]:
                  - generic [ref=f1e537]:
                    - generic [ref=f1e538]:
                      - heading "导航" [level=3] [ref=f1e539]
                      - paragraph [ref=f1e540]: 在复杂信息中保持方向感。
                    - navigation "导航组件" [ref=f1e541]:
                      - link "标签页" [ref=f1e542] [cursor=pointer]:
                        - /url: /components/rc-tabs
                        - generic [aria-hidden] [ref=f1e546]: →
                      - link "菜单" [ref=f1e547] [cursor=pointer]:
                        - /url: /components/rc-menu
                        - generic [aria-hidden] [ref=f1e551]: →
                      - link "分页" [ref=f1e552] [cursor=pointer]:
                        - /url: /components/rc-pagination
                        - generic [aria-hidden] [ref=f1e556]: →
                      - link "路由" [ref=f1e557] [cursor=pointer]:
                        - /url: /components/rc-router
                        - generic [aria-hidden] [ref=f1e561]: →
                - article [ref=f1e562]:
                  - generic [ref=f1e564]:
                    - generic [ref=f1e565]:
                      - heading "布局与性能" [level=3] [ref=f1e566]
                      - paragraph [ref=f1e567]: 从响应式布局到大数据渲染。
                    - navigation "布局与性能组件" [ref=f1e568]:
                      - link "分栏" [ref=f1e569] [cursor=pointer]:
                        - /url: /components/rc-split-pane
                        - generic [aria-hidden] [ref=f1e573]: →
                      - link "虚拟滚动" [ref=f1e574] [cursor=pointer]:
                        - /url: /components/rc-virtual
                        - generic [aria-hidden] [ref=f1e578]: →
                      - link "瀑布流" [ref=f1e579] [cursor=pointer]:
                        - /url: /components/rc-masonry
                        - generic [aria-hidden] [ref=f1e583]: →
                      - link "自动尺寸" [ref=f1e584] [cursor=pointer]:
                        - /url: /components/rc-auto-sizer
                        - generic [aria-hidden] [ref=f1e588]: →
                - article [ref=f1e589]:
                  - generic [ref=f1e591]:
                    - generic [ref=f1e592]:
                      - heading "数据与可视化" [level=3] [ref=f1e593]
                      - paragraph [ref=f1e594]: 浏览、比较和理解业务数据。
                    - navigation "数据与可视化组件" [ref=f1e595]:
                      - link "表格" [ref=f1e596] [cursor=pointer]:
                        - /url: /components/rc-table
                        - generic [aria-hidden] [ref=f1e600]: →
                      - link "树形结构" [ref=f1e601] [cursor=pointer]:
                        - /url: /components/rc-tree
                        - generic [aria-hidden] [ref=f1e605]: →
                      - link "柱状图" [ref=f1e606] [cursor=pointer]:
                        - /url: /components/rc-bar-chart
                        - generic [aria-hidden] [ref=f1e610]: →
                      - link "画布" [ref=f1e611] [cursor=pointer]:
                        - /url: /components/rc-canvas
                        - generic [aria-hidden] [ref=f1e615]: →
            - region [ref=f1e617]:
              - generic [ref=f1e618]:
                - generic [ref=f1e619]:
                  - text: 业务实战
                  - heading "把组件组合成完整流程。" [level=2] [ref=f1e620]
                - paragraph [ref=f1e621]: 从一个场景进入，跟随步骤完成可运行的界面。
              - generic [ref=f1e622]:
                - article [ref=f1e623]:
                  - generic [ref=f1e624]: "01"
                  - generic [ref=f1e625]:
                    - heading "资料编辑表单" [level=3] [ref=f1e626]
                    - paragraph [ref=f1e627]: 从输入校验到异步保存
                    - generic [ref=f1e628]: Form · LineEdit · Button
                  - link "开始实战：资料编辑表单" [ref=f1e629] [cursor=pointer]:
                    - /url: /learn/practice-profile
                    - generic [ref=f1e631]: →
                - article [ref=f1e632]:
                  - generic [ref=f1e633]: "02"
                  - generic [ref=f1e634]:
                    - heading "数据管理列表" [level=3] [ref=f1e635]
                    - paragraph [ref=f1e636]: 连接搜索、分页与状态反馈
                    - generic [ref=f1e637]: Table · Pagination · Empty
                  - link "开始实战：数据管理列表" [ref=f1e638] [cursor=pointer]:
                    - /url: /learn/practice-data
                    - generic [ref=f1e640]: →
                - article [ref=f1e641]:
                  - generic [ref=f1e642]: "03"
                  - generic [ref=f1e643]:
                    - heading "后台管理页面" [level=3] [ref=f1e644]
                    - paragraph [ref=f1e645]: 组织导航、内容与编辑流程
                    - generic [ref=f1e646]: Tabs · Drawer · Form
                  - link "开始实战：后台管理页面" [ref=f1e647] [cursor=pointer]:
                    - /url: /learn/practice-admin
                    - generic [ref=f1e649]: →
            - region [ref=f1e651]:
              - generic [ref=f1e652]:
                - generic [ref=f1e653]:
                  - text: 在线实战
                  - heading "先试用，再读实现。" [level=2] [ref=f1e654]
                - paragraph [ref=f1e655]: 完成邀请表单，再展开源码理解组件如何协作。
              - region "组件，自然组合。 运行示例" [ref=f1e656]:
                - generic [ref=f1e657]: 组件，自然组合。
                - article [ref=f1e659]:
                  - generic [ref=f1e662]:
                    - generic [ref=f1e663]:
                      - generic [ref=f1e666]:
                        - generic [ref=f1e667]:
                          - generic [ref=f1e668]: WORKSPACE / 01
                          - generic [ref=f1e669]: 进行中
                        - generic [ref=f1e671]:
                          - heading "发布清单" [level=3] [ref=f1e672]
                          - paragraph [ref=f1e673]: 设计系统 · 九月迭代
                        - generic [ref=f1e674]:
                          - strong [ref=f1e675]: 2 / 4
                          - generic [ref=f1e676]: 项任务已完成
                        - progressbar "发布清单完成进度" [ref=f1e677]
                        - generic [ref=f1e678]:
                          - generic [ref=f1e680] [cursor=pointer]:
                            - checkbox "建立设计令牌" [checked] [ref=f1e681]
                            - generic [ref=f1e685]:
                              - generic [ref=f1e686]: 建立设计令牌
                              - generic [ref=f1e687]: Foundation · 设计系统
                          - generic [ref=f1e689] [cursor=pointer]:
                            - checkbox "完成组件交互" [checked] [ref=f1e690]
                            - generic [ref=f1e694]:
                              - generic [ref=f1e695]: 完成组件交互
                              - generic [ref=f1e696]: Components · 前端开发
                          - generic [ref=f1e698] [cursor=pointer]:
                            - checkbox "检查键盘可访问性" [ref=f1e699]
                            - generic [ref=f1e703]:
                              - generic [ref=f1e704]: 检查键盘可访问性
                              - generic [ref=f1e705]: Accessibility · 体验验收
                          - generic [ref=f1e707] [cursor=pointer]:
                            - checkbox "发布第一个页面" [ref=f1e708]
                            - generic [ref=f1e712]:
                              - generic [ref=f1e713]: 发布第一个页面
                              - generic [ref=f1e714]: Release · 产品交付
                        - generic [ref=f1e715]:
                          - generic [ref=f1e716]:
                            - generic [ref=f1e717]: 林
                            - generic [ref=f1e720]: 周
                            - generic [ref=f1e723]: 许
                          - generic [ref=f1e726]: 一起把细节做好
                      - generic [ref=f1e729]:
                        - generic [ref=f1e730]:
                          - heading "邀请团队成员" [level=3] [ref=f1e731]
                          - paragraph [ref=f1e732]: 邀请团队成员，共建下一个项目。
                        - generic [ref=f1e733]:
                          - generic [ref=f1e734]: 林
                          - strong [ref=f1e736]: 林晓
                          - generic [ref=f1e737]: 管理员
                          - paragraph [ref=f1e739]: lin@example.com
                        - generic [ref=f1e740]:
                          - generic [ref=f1e741]: 周
                          - strong [ref=f1e743]: 周予
                          - generic [ref=f1e744]: 设计师
                          - paragraph [ref=f1e746]: zhou@example.com
                        - generic [ref=f1e747]:
                          - generic [ref=f1e748]: 邀请新成员
                          - textbox "邀请新成员" [ref=f1e751]:
                            - /placeholder: name@company.com
                          - button "＋ 创建演示邀请" [ref=f1e752] [cursor=pointer]
                          - status [ref=f1e755]: 输入邮箱，体验表单校验与提交。
                    - group [ref=f1e756]:
                      - generic "更多组件体验 · 图表、通知与状态" [ref=f1e757] [cursor=pointer]
                  - group "预览操作" [ref=f1e758]:
                    - button "重置组件，自然组合。" [ref=f1e759] [cursor=pointer]:
                      - generic [ref=f1e761]: 重置
                    - button "复制代码" [ref=f1e762] [cursor=pointer]:
                      - generic [ref=f1e768]: 复制
                    - button "查看源码" [ref=f1e769] [cursor=pointer]:
                      - generic [ref=f1e775]: 源码
            - generic [ref=f1e776]:
              - generic [ref=f1e777]:
                - strong [ref=f1e778]: Crab UI
                - text: 为清晰、可靠的界面而构建。
              - navigation "页脚导航" [ref=f1e779]:
                - link "无障碍" [ref=f1e780] [cursor=pointer]:
                  - /url: /guides/accessibility
                - link "开发与维护" [ref=f1e783] [cursor=pointer]:
                  - /url: /guides/toolchain
                - link "GitHub ↗" [ref=f1e786] [cursor=pointer]:
                  - /url: https://github.com/hotlif/crab-dev
```

# Test source

```ts
  1   | import { test as base, expect } from "@playwright/test";
  2   | import fs from "node:fs/promises";
  3   | import path from "node:path";
  4   | import { createDocsPreview } from "../../.website/scripts/dev/preview-docs.mjs";
  5   | import { readLibraryMetadata, repositoryRoot } from "../../scripts/library-manifest.mjs";
  6   | import { captureVisualInputs } from "../../scripts/visual/evidence-inputs.mjs";
  7   | import { validateVisualSpec } from "../../scripts/visual/specification.mjs";
  8   | import { zoomFixtures } from "./zoom-fixture.mjs";
  9   | import { inspectBrowserRendering } from './browser-capabilities.mjs';
  10  | 
  11  | export { expect };
  12  | export { environmentCases, applyEnvironment } from "./environments.mjs";
  13  | export const configurations = readLibraryMetadata().designSystems.flatMap(({ id: designSystem }) => ["light", "dark"].map(colorMode => ({ designSystem, colorMode })));
  14  | 
  15  | export async function openDemo(page, origin, slug, demo, configuration) {
  16  |     const response = await page.goto(`${origin}/components/${slug}/workbench/?__wake_demo=${encodeURIComponent(`docs/demos/${demo}`)}`);
  17  |     expect(response.status()).toBe(200);
  18  |     const root = page.locator(".demo-default-preview").first();
  19  |     await expect(root).toBeVisible();
  20  |     const config = { type: "crab:preview-config", size: "medium", density: "standard", locale: "zh-CN", direction: "ltr", brandColor: null, ...configuration };
  21  |     await page.emulateMedia({ colorScheme: config.colorMode });
  22  |     await page.evaluate(config => globalThis.postMessage(config, globalThis.location.origin), config);
  23  |     await expect(root).toHaveAttribute("data-crab-design", config.designSystem);
  24  |     await expect(root).toHaveAttribute("data-theme", config.colorMode);
  25  |     await expect(root).toHaveAttribute("data-crab-size", config.size);
  26  |     await expect(root).toHaveAttribute("data-crab-density", config.density);
  27  |     await page.evaluate(() => globalThis.document.fonts.ready);
  28  |     await settleFiniteAnimations(page);
  29  |     return root;
  30  | }
  31  | 
  32  | export async function settleFiniteAnimations(page) {
  33  |     await expect.poll(() => page.evaluate(() => globalThis.document.getAnimations().filter(animation => animation.playState === "running" && Number.isFinite(animation.effect?.getComputedTiming().endTime)).length), { message: "Finite transitions settle naturally" }).toBe(0);
  34  | }
  35  | 
  36  | /** Capture/comparison policy is shared; each package chooses its meaningful boundary. */
  37  | export async function captureVisual(target, name, info) {
  38  |     await attachSnapshotTarget(info, name);
  39  |     if (process.env.CRAB_VISUAL_CANDIDATE !== "1") {
  40  |         await expect(target).toHaveScreenshot(name, { animations: "allow", caret: "hide" });
  41  |     } else {
  42  |         await info.attach("actual", { body: await target.screenshot({ animations: "allow", caret: "hide" }), contentType: "image/png" });
  43  |     }
  44  | }
  45  | 
  46  | export const test = base.extend({
  47  |     renderingEnvironment: [async ({ browser, browserName }, use, workerInfo) => {
  48  |         const record = await inspectBrowserRendering(browser);
  49  |         const file = path.join(path.dirname(workerInfo.project.outputDir), `rendering-worker-${workerInfo.workerIndex}.json`);
  50  |         await fs.mkdir(path.dirname(file), { recursive: true });
  51  |         await fs.writeFile(file, JSON.stringify({ ...record, browserName, image: process.env.CRAB_VISUAL_IMAGE, launchArguments: workerInfo.project.use.launchOptions?.args ?? [] }, null, 2));
  52  |         if (process.env.CRAB_VISUAL_REQUIRE_WEBGL2 === '1') expect(record.webgl2 && record.drawn && record.error === 0, `Real WebGL2 drawing is required; see ${file}`).toBe(true);
  53  |         await use({ file, browserName, browser: record.browser });
  54  |     }, { scope: 'worker', timeout: 120_000 }],
  55  |     visualInputs: [async ({ renderingEnvironment }, use, workerInfo) => {
  56  |         const before = await captureVisualInputs();
  57  |         const file = path.join(path.dirname(workerInfo.project.outputDir), `inputs-worker-${workerInfo.workerIndex}.json`);
  58  |         await fs.mkdir(path.dirname(file), { recursive: true });
  59  |         await fs.writeFile(file, JSON.stringify({ before, status: "capturing" }, null, 2));
  60  |         try { await use({ source: before.source.fingerprint, artifact: before.artifact.fingerprint, ...(before.siteBuild ? { siteBuild: before.siteBuild.fingerprint } : {}), file, renderingEnvironment }); }
  61  |         finally {
  62  |             const after = await captureVisualInputs();
  63  |             const stable = JSON.stringify(before) === JSON.stringify(after);
  64  |             await fs.writeFile(file, JSON.stringify({ before, after, stable }, null, 2));
  65  |             expect(stable, "Visual source and artifacts must be unchanged during capture").toBe(true);
  66  |         }
  67  |     }, { scope: "worker", timeout: 120_000 }],
  68  |     previewOrigin: [async ({ visualInputs }, use) => {
  69  |         if (!visualInputs.source || !visualInputs.artifact) throw Error("Missing visual input fingerprints");
  70  |         const server = createDocsPreview({ root: process.env.CRAB_VISUAL_WORKBENCH_ROOT, base: process.env.CRAB_VISUAL_WORKBENCH_BASE });
  71  |         await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  72  |         try { await use(`http://127.0.0.1:${server.address().port}`); }
  73  |         finally { await new Promise(resolve => server.close(resolve)); }
  74  |     }, { scope: "worker" }],
  75  |     runtimeErrors: [async ({ page }, use, info) => {
  76  |         const errors = [], consoleErrors = [];
  77  |         page.on("pageerror", error => errors.push(error.message));
  78  |         page.on("console", message => { if (message.type() === "error") consoleErrors.push({ text: message.text(), location: message.location() }); });
  79  |         await use(errors);
  80  |         if (consoleErrors.length) await info.attach('browser-console', { body: JSON.stringify(consoleErrors), contentType: 'application/json' });
> 81  |         expect(errors, "Browser runtime errors").toEqual([]);
      |                                                  ^ Error: Browser runtime errors
  82  |     }, { auto: true }],
  83  |     evidence: [async ({ visualInputs, context, browserName }, use, info) => {
  84  |         await use();
  85  |         await info.attach("candidate-inputs", { body: JSON.stringify({ ...visualInputs, browserName, browser: context.browser()?.version(), platform: process.platform, arch: process.arch, image: process.env.CRAB_VISUAL_IMAGE, mode: process.env.CRAB_VISUAL_MODE, visualReview: "pending" }, null, 2), contentType: "application/json" });
  86  |     }, { auto: true }],
  87  | });
  88  | export const zoomTest = test.extend(zoomFixtures);
  89  | 
  90  | export async function captureZoom(page, realZoom, name, info) {
  91  |     await attachSnapshotTarget(info, name);
  92  |     const body = await realZoom.capture200(page);
  93  |     await info.attach('actual-zoom-200', { body, contentType: 'image/png' });
  94  |     if (process.env.CRAB_VISUAL_CANDIDATE !== '1') expect(body).toMatchSnapshot(name, { maxDiffPixels: 0 });
  95  | }
  96  | 
  97  | async function attachSnapshotTarget(info, name) {
  98  |     await info.attach('snapshot-target', { body: JSON.stringify({ name, path: path.relative(repositoryRoot, info.snapshotPath(name)).replaceAll('\\', '/') }), contentType: 'application/json' });
  99  | }
  100 | 
  101 | /** Matrix axes are component-owned; no central component-name switch table. */
  102 | export async function readVisualSpec(url) {
  103 |     const spec = JSON.parse(await fs.readFile(new URL("visual.json", url), "utf8"));
  104 |     const demos = await fs.readdir(new URL("demos/", url));
  105 |     const errors = validateVisualSpec(spec, demos);
  106 |     if (errors.length) throw Error(`${url}: ${errors.join("; ")}`);
  107 |     return spec;
  108 | }
  109 | 
```