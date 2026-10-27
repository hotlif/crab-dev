---
"@crab-dev/rc-form": patch
---

Give control-labeled fields a full-row slot and preserve each editor's own label, input, and supporting-text layout. This prevents wrapped editors such as DatePicker and Select from being squeezed into the external-label column and keeps Apple and shadcn field layouts consistent inside and outside Form. Use the existing `external` placement when Form should align labels across rows.
