$ErrorActionPreference = 'Stop'
$workspaceRoot = (Resolve-Path -LiteralPath ([IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..')))).ProviderPath
$runtimePath = [IO.Path]::GetFullPath((Join-Path $workspaceRoot 'components/rc-pdf-editor/public/runtime'))
$backupPath = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'original-runtime'))
$partialPath = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'failed-restoration-runtime'))
$env:TEMP = (Resolve-Path -LiteralPath (Join-Path $workspaceRoot '.tmp/verification-temp')).ProviderPath
$env:TMP = $env:TEMP
$env:TMPDIR = $env:TEMP
$env:RAYON_NUM_THREADS = '2'
$turboArguments = @('exec', 'turbo', 'run', 'build:library', '--filter=@crab-dev/rc-pdf-editor', '--concurrency=2', '--summarize')
$state = [ordered]@{ status = 'preparing'; workspace = $workspaceRoot; generatedDirectory = $runtimePath; backupDirectory = $backupPath; failedAttemptDirectory = $partialPath; command = @('yarn') + $turboArguments; temp = $env:TEMP; tmpdir = $env:TMPDIR; rayon = $env:RAYON_NUM_THREADS; startedAt = [DateTime]::UtcNow.ToString('o'); moves = @() }
function Save-State { $state | ConvertTo-Json -Depth 15 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'index.json') }
function Assert-WorkspacePath([string] $Candidate, [bool] $MustExist) {
    $absolute = [IO.Path]::GetFullPath($Candidate)
    if (-not $absolute.StartsWith($workspaceRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw "Path escapes intended workspace: $absolute" }
    $root = [IO.Path]::GetPathRoot($absolute)
    $current = $root
    foreach ($segment in $absolute.Substring($root.Length).Split([IO.Path]::DirectorySeparatorChar, [StringSplitOptions]::RemoveEmptyEntries)) {
        $current = Join-Path $current $segment
        if (-not (Test-Path -LiteralPath $current)) { continue }
        $item = Get-Item -LiteralPath $current -Force
        if (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw "Reparse point is forbidden for this move: $current" }
        $real = (Resolve-Path -LiteralPath $current).ProviderPath
        if (-not [string]::Equals([IO.Path]::GetFullPath($current), [IO.Path]::GetFullPath($real), [StringComparison]::OrdinalIgnoreCase)) { throw "Unexpected canonical path: $current -> $real" }
    }
    if ($MustExist -and -not (Test-Path -LiteralPath $absolute -PathType Container)) { throw "Expected existing directory: $absolute" }
    $parent = Split-Path $absolute -Parent
    if (-not (Test-Path -LiteralPath $parent -PathType Container)) { throw "Missing destination/source parent: $parent" }
    return $absolute
}
function Assert-TreeNoReparse([string] $Directory) {
    $checked = Assert-WorkspacePath $Directory $true
    $entries = @(Get-Item -LiteralPath $checked -Force) + @(Get-ChildItem -LiteralPath $checked -Recurse -Force)
    foreach ($entry in $entries) { if (($entry.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw "Reparse entry in generated tree: $($entry.FullName)" } }
}
function Get-NativeRealPath([string] $Path) {
    $resolved = & node -e 'process.stdout.write(require("node:fs").realpathSync.native(process.argv[1]));' -- $Path
    if ($LASTEXITCODE -ne 0) { throw "Native realpath failed: $Path" }
    return [IO.Path]::GetFullPath($resolved)
}
function Move-Checked([string] $Source, [string] $Destination, [string] $Reason) {
    $sourceAbsolute = Assert-WorkspacePath $Source $true
    $destinationAbsolute = Assert-WorkspacePath $Destination $false
    if (Test-Path -LiteralPath $destinationAbsolute) { throw "Will not overwrite existing backup/output: $destinationAbsolute" }
    Assert-TreeNoReparse $sourceAbsolute
    $nativeSource = Get-NativeRealPath $sourceAbsolute
    $nativeParent = Get-NativeRealPath (Split-Path $destinationAbsolute -Parent)
    if (-not [string]::Equals($nativeSource, $sourceAbsolute, [StringComparison]::OrdinalIgnoreCase) -or -not [string]::Equals($nativeParent, (Split-Path $destinationAbsolute -Parent), [StringComparison]::OrdinalIgnoreCase)) { throw 'Native realpath differs from the checked absolute source/destination parent.' }
    $record = [ordered]@{ reason = $Reason; sourceAbsolute = $sourceAbsolute; sourceRealPath = $nativeSource; destinationAbsolute = $destinationAbsolute; destinationParentRealPath = $nativeParent; allAncestorsAndTreeNonReparse = $true; sourceInsideWorkspace = $true; destinationInsideWorkspace = $true; verifiedAt = [DateTime]::UtcNow.ToString('o'); completed = $false }
    $state.moves += $record
    Save-State
    Move-Item -LiteralPath $sourceAbsolute -Destination $destinationAbsolute -ErrorAction Stop
    $record.completed = $true
    $record.completedAt = [DateTime]::UtcNow.ToString('o')
    Save-State
}
function Get-PdfSource {
    $sourceRoot = Join-Path $workspaceRoot 'components/rc-pdf-editor'
    $records = @(foreach ($folder in @('src', 'scripts', 'public')) {
        Get-ChildItem -LiteralPath (Join-Path $sourceRoot $folder) -Recurse -File -Force | Where-Object {
            $_.FullName -ne (Join-Path $sourceRoot 'src/token.ts') -and -not $_.FullName.StartsWith($runtimePath + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)
        } | ForEach-Object { [PSCustomObject]@{ path = [IO.Path]::GetRelativePath($workspaceRoot, $_.FullName).Replace('\', '/'); sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant() } }
    })
    return @($records | Sort-Object path)
}
function Get-RuntimeTree([string] $Directory) {
    Assert-TreeNoReparse $Directory
    $files = @(Get-ChildItem -LiteralPath $Directory -Recurse -File -Force | ForEach-Object { [PSCustomObject]@{ path = [IO.Path]::GetRelativePath($Directory, $_.FullName).Replace('\', '/'); bytes = $_.Length; sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant() } } | Sort-Object path)
    $directories = @(Get-ChildItem -LiteralPath $Directory -Recurse -Directory -Force | ForEach-Object { [IO.Path]::GetRelativePath($Directory, $_.FullName).Replace('\', '/') } | Sort-Object)
    return [PSCustomObject]@{ files = $files; directories = $directories }
}
function Assert-NativeResourceValues($Summary, [string] $Stage) {
    $expectedValues = [ordered]@{ RAYON_NUM_THREADS = '2'; TEMP = $env:TEMP; TMP = $env:TMP; TMPDIR = $env:TMPDIR }
    $verified = @()
    foreach ($entry in $expectedValues.GetEnumerator()) {
        $actual = @($Summary.globalCacheInputs.environmentVariables.passthrough | Where-Object { $_ -like ($entry.Key + '=*') })
        $expectedHash = [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes([string]$entry.Value))).ToLowerInvariant()
        if ($actual.Count -ne 1 -or $actual[0] -ne ($entry.Key + '=' + $expectedHash)) { throw "Native passthrough does not match the actual intended resource value: $($entry.Key)" }
        $verified += [PSCustomObject]@{ name = $entry.Key; expectedValueSha256 = $expectedHash; nativeEntry = $actual[0]; matches = $true }
    }
    $state[$Stage + 'ResourceValues'] = $verified
}
Save-State
try {
    if ((Get-Location).Path -ne $workspaceRoot) { throw 'Run from intended workspace root.' }
    $warmResult = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'warm-result.json') -Raw | ConvertFrom-Json
    if ($warmResult.exitCode -ne 0 -or $warmResult.summaries.Count -ne 1) { throw 'Expected one successful native warm summary.' }
    $warmSummary = Get-Content -LiteralPath (Join-Path $PSScriptRoot ('warm-native-' + $warmResult.summaries[0])) -Raw | ConvertFrom-Json
    $warmTask = $warmSummary.tasks | Where-Object taskId -eq '@crab-dev/rc-pdf-editor#build:library'
    $state.warmEnvMode = $warmSummary.envMode
    $state.warmGlobalPassthrough = $warmSummary.globalCacheInputs.environmentVariables
    $requiredPassthrough = @('RAYON_NUM_THREADS', 'TEMP', 'TMP', 'TMPDIR', 'PLAYWRIGHT_BROWSERS_PATH', 'CRAB_TEST_BROWSER_PATH')
    if ($warmSummary.envMode -ne 'strict') { throw 'Final public-chain verification requires normal strict environment mode.' }
    foreach ($name in $requiredPassthrough) { if ($name -notin $state.warmGlobalPassthrough.specified.passThroughEnv) { throw "Missing required native global passthrough declaration: $name" } }
    if ($state.warmGlobalPassthrough.specified.passThroughEnv.Count -ne $requiredPassthrough.Count) { throw 'Unexpected additional global passthrough declarations.' }
    Assert-NativeResourceValues $warmSummary 'warm'
    $actualPassthrough = @($state.warmGlobalPassthrough.passthrough)
    foreach ($name in @('RAYON_NUM_THREADS', 'TEMP', 'TMP', 'TMPDIR')) { if (-not @($actualPassthrough | Where-Object { $_ -like ($name + '=*') }).Count) { throw "Native summary does not record actual passthrough value: $name" } }
    if ($warmTask.execution.exitCode -ne 0 -or 'public/runtime/**' -notin $warmTask.outputs) { throw 'Warm task did not declare/build the runtime output.' }
    $beforeWarm = @(Get-Content -LiteralPath (Join-Path $PSScriptRoot 'pdf-source-before-warm.json') -Raw | ConvertFrom-Json)
    $afterWarm = @(Get-PdfSource)
    $afterWarm | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'pdf-source-after-warm.json')
    $state.pdfSourceStableAfterWarm = (($beforeWarm | ConvertTo-Json -Depth 5 -Compress) -eq ($afterWarm | ConvertTo-Json -Depth 5 -Compress))
    if (-not $state.pdfSourceStableAfterWarm) { throw 'PDF src/scripts/public changed during warm; leave runtime untouched and wait for a freeze.' }
    $before = Get-RuntimeTree $runtimePath
    if ($before.files.Count -eq 0) { throw 'Warm runtime is unexpectedly empty.' }
    $before | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'runtime-before.json')
    $state.warmSummary = 'warm-native-' + $warmResult.summaries[0]
    $state.warmTaskHash = $warmTask.hash
    $state.fileCount = $before.files.Count
    $state.totalBytes = ($before.files | Measure-Object bytes -Sum).Sum
    Save-State
    Move-Checked $runtimePath $backupPath 'Preserve complete generated runtime before testing cold resource restoration'
    if (Test-Path -LiteralPath $runtimePath) { throw 'Runtime must be completely absent before invoking Turbo.' }
    $state.runtimeAbsentBeforeColdRun = $true
    $summaryDirectory = Join-Path $workspaceRoot '.turbo/runs'
    $previousSummaries = @(Get-ChildItem -LiteralPath $summaryDirectory -File | Select-Object -ExpandProperty Name)
    $coldStarted = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    $state.status = 'cold-cache-restoration'
    Save-State
    & yarn @turboArguments *> (Join-Path $PSScriptRoot 'cold.log')
    $state.coldExitCode = $LASTEXITCODE
    $newSummaries = @(Get-ChildItem -LiteralPath $summaryDirectory -File | Where-Object { $_.Name -notin $previousSummaries })
    foreach ($summary in $newSummaries) { Copy-Item -LiteralPath $summary.FullName -Destination (Join-Path $PSScriptRoot ('cold-native-' + $summary.Name)) -ErrorAction Stop }
    $candidates = @($newSummaries | ForEach-Object { $data = Get-Content -LiteralPath $_.FullName -Raw | ConvertFrom-Json; if ($data.execution.startTime -ge $coldStarted -and $data.execution.command -eq $warmSummary.execution.command -and @($data.tasks | Where-Object taskId -eq '@crab-dev/rc-pdf-editor#build:library').Count -eq 1) { [PSCustomObject]@{ file = $_.Name; data = $data } } })
    if ($candidates.Count -ne 1) { throw "Expected one attributable native cold summary; found $($candidates.Count)." }
    $coldSummary = $candidates[0].data
    $coldTask = $coldSummary.tasks | Where-Object taskId -eq '@crab-dev/rc-pdf-editor#build:library'
    $state.coldEnvMode = $coldSummary.envMode
    $state.coldGlobalPassthrough = $coldSummary.globalCacheInputs.environmentVariables
    if ($coldSummary.envMode -ne 'strict') { throw 'Cold invocation unexpectedly changed environment mode.' }
    foreach ($name in $requiredPassthrough) { if ($name -notin $state.coldGlobalPassthrough.specified.passThroughEnv) { throw "Missing cold native global passthrough declaration: $name" } }
    if ($state.coldGlobalPassthrough.specified.passThroughEnv.Count -ne $requiredPassthrough.Count) { throw 'Unexpected additional cold global passthrough declarations.' }
    Assert-NativeResourceValues $coldSummary 'cold'
    $state.coldSummary = 'cold-native-' + $candidates[0].file
    $state.coldTaskHash = $coldTask.hash
    $state.coldCache = $coldTask.cache
    $state.taskHashesEqual = $warmTask.hash -eq $coldTask.hash
    $state.nativeTaskResults = @($coldSummary.tasks | ForEach-Object { [PSCustomObject]@{ taskId = $_.taskId; hash = $_.hash; cache = $_.cache.status; source = $_.cache.source; exitCode = $_.execution.exitCode } })
    $afterSource = @(Get-PdfSource)
    $afterSource | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'pdf-source-after-cold.json')
    $state.pdfSourceStableAfterCold = (($afterWarm | ConvertTo-Json -Depth 5 -Compress) -eq ($afterSource | ConvertTo-Json -Depth 5 -Compress))
    if ($state.coldExitCode -ne 0) { throw 'Cold Turbo invocation failed.' }
    if ($coldTask.cache.status -ne 'HIT' -or $coldTask.cache.local -ne $true -or -not $state.taskHashesEqual) { throw 'Cold restoration was not a real local cache HIT with the same task hash; a rebuild is not acceptance.' }
    if (-not $state.pdfSourceStableAfterCold) { throw 'PDF sources changed during cold restoration; preserve evidence and restore the original.' }
    $after = Get-RuntimeTree $runtimePath
    $after | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'runtime-after.json')
    $state.runtimeTreesEqual = (($before | ConvertTo-Json -Depth 6 -Compress) -eq ($after | ConvertTo-Json -Depth 6 -Compress))
    if (-not $state.runtimeTreesEqual) { throw 'Restored runtime differs in directory/file set, bytes or SHA256.' }
    $state.backupPreserved = Test-Path -LiteralPath $backupPath -PathType Container
    $state.status = 'passed'
    $state.finishedAt = [DateTime]::UtcNow.ToString('o')
    Save-State
    [PSCustomObject]@{ status = $state.status; files = $state.fileCount; bytes = $state.totalBytes; warmHash = $state.warmTaskHash; coldHash = $state.coldTaskHash; cache = $state.coldCache.status; treeEqual = $state.runtimeTreesEqual; backupPreserved = $state.backupPreserved; coldSummary = $state.coldSummary } | ConvertTo-Json -Depth 4
} catch {
    $state.status = 'failed'
    $state.error = $_.Exception.Message
    Save-State
    try {
        if (Test-Path -LiteralPath $backupPath -PathType Container) {
            if (Test-Path -LiteralPath $runtimePath) { Move-Checked $runtimePath $partialPath 'Retain failed or rebuilt restoration attempt without deleting evidence' }
            Move-Checked $backupPath $runtimePath 'Restore original complete runtime after a failed acceptance'
            $state.originalRestored = $true
        }
    } catch { $state.recoveryError = $_.Exception.Message }
    $state.finishedAt = [DateTime]::UtcNow.ToString('o')
    Save-State
    $state | ConvertTo-Json -Depth 15
    exit 1
}
