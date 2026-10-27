---
"@crab-dev/rc-form": minor
---

Add explicit external group label semantics to Form.Item. Group editors can receive the visible field caption through aria-labelledby while keeping each option's own name and preserving explicit accessible names. Fix the CheckboxGroup/RadioGroup editor example and document the render-prop migration.

Treat empty arrays as missing required values for collection fields. Preserve zero, false and all existing nonempty-value semantics, and verify CheckboxGroup selection and reset validation.
