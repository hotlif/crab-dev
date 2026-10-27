---
"@crab-dev/rc-app-main-layout": patch
---

Keep sidebar selection synchronized with the active workspace tab when tabs switch or close. Match tab and menu keys exactly by default, and support explicit `sidebarSelectedKeys` for business routes with different keys. Desktop and mobile navigation share the same selection without replaying menu click callbacks.
