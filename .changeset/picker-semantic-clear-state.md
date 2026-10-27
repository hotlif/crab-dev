---
"@crab-dev/rc-date-picker": patch
---

Base DatePicker, DateTimePicker and TimePicker clear actions on their semantic value instead of formatted display text. Empty values with custom text no longer expose clear, while existing values formatted as an empty string remain clearable. Include the actual button event in clear details without synthesizing input events.
