# LineEdit Windows Chromium native candidate

Requested tests: 229. Actual final result statuses: {"failed":35,"passed":66,"interrupted":1,"not-run":127}.

Failure groups: test/visual/content-geometry.mjs:20:22 (35). The native maxFailures=35 threshold stopped the run. The interrupted and never-run cases remain unaccepted. Native JSON counts interrupted under skipped; the explicit statuses above preserve that distinction.

Core matrix: 26/162; environments: 40/60. scopeDeclaredComplete describes the requested scope, not successful coverage. Contract errors: 156.

Workers: 36; all before/after source and artifact fingerprints stable: true; all Chromium156.0.8078.4: true.

Source: sha256:ffd29f110c9752e84672f1831420b551cb1ffb6e18d839a1ea501d2ba5df1ddb. Artifact: sha256:1ce2740d66f2090a45357e0bd3a1b007bd6a988784485bff3a28831697df1c3d.

Exported PNGs: 192; all original hashes match: true.

One 320×768 original was actually viewed (hash recorded in JSON): the MD3 floating label is visible in the outer scene, while the inner unpadded grid starts below its legitimate top overhang. The source-confirmed -50% floating transform is not a component error. A prospective demo-stage padding repair must preserve the existing generic geometry thresholds and component label CSS; it requires a new candidate.

All other images, interaction scopes not reached, Firefox/WebKit, canonical Linux pixel comparison and baseline approval remain pending. The original report, errors, traces, partial cases and earlier history remain unchanged.
