# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: components\rc-alert\docs\alert.visual.spec.mjs >> Alert touch >> Alert environment md3 light touch
- Location: components\rc-alert\docs\alert.visual.spec.mjs:60:42

# Error details

```
Error: locator.evaluate: TypeError: Failed to execute 'elementFromPoint' on 'Document': The provided double value is non-finite.
    at eval (eval at evaluate (:370:30), <anonymous>:18:60)
    at Array.map (<anonymous>)
    at eval (eval at evaluate (:370:30), <anonymous>:18:24)
    at UtilityScript.evaluate (<anonymous>:372:16)
    at UtilityScript.<anonymous> (<anonymous>:1:44)
```

# Page snapshot

```yaml
- generic [ref=e5]:
  - generic [ref=e6]:
    - generic [ref=e7]:
      - text: 验收尺寸
      - combobox "验收尺寸" [ref=e8]:
        - option "medium" [selected]
    - generic [ref=e9]:
      - text: 验收密度
      - combobox "验收密度" [ref=e10]:
        - option "standard" [selected]
    - generic [ref=e11]:
      - text: 验收状态
      - combobox "验收状态" [ref=e12]:
        - option "default" [selected]
        - option "title"
        - option "action"
        - option "hover"
        - option "focus-visible"
        - option "pressed"
        - option "error"
        - option "closed"
  - generic [ref=e13]:
    - checkbox "长文本" [ref=e14]
    - text: 长文本
  - generic [ref=e15]:
    - text: 配置切换草稿
    - textbox "配置切换草稿" [ref=e16]: 保留这份草稿
  - region "Alert visual matrix" [ref=e18]:
    - generic [ref=e19]:
      - alert [ref=e20]:
        - generic [ref=e24]: 工作区更改已保存。可以继续编辑下一条记录。
        - button "关闭" [ref=e26] [cursor=pointer]
      - alert [ref=e31]:
        - generic [ref=e35]: 保存成功
      - alert [ref=e37]:
        - generic [ref=e41]: 连接不稳定
    - status "操作次数" [ref=e43]: "0"
```