# Checkbox local Linux execution audit

397/397 native tests passed: Chromium 337, Firefox 30, WebKit 30. The complete declared core matrix passed 270/270, 24/24, 24/24 respectively; environment extensions passed 60/60, including six real 200% browser zoom proofs. No failures, skips, flaky results or missing cells were accepted.

All 396 original PNG hashes and native input records matched. Two concurrent workers were configured; all six worker input records stayed stable. Each design has 132 PNGs: Chromium 112, Firefox 10, WebKit 10. Original appearance review remains pending.

See [exact execution/source audit](execution-audit.json), [native report](report/index.html) and [matrix](matrix.json). This was the first sequential package run in one retained local Linux snapshot. Full shared command, resource guard, image/font/browser bindings and limitations are recorded in `.tmp/selection-controls-all-engines-linux-candidate-20261030-1-handoff.md`.

No baseline, two-run pixel stability, full-repository Linux check or verified coverage is established.
