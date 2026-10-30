$ErrorActionPreference = 'Stop'
$workspaceRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
if ((Get-Location).Path -ne $workspaceRoot) { throw 'Run from the intended workspace root.' }
$verificationTemp = (Resolve-Path -LiteralPath (Join-Path $workspaceRoot '.tmp/verification-temp')).ProviderPath
$env:TEMP = $verificationTemp
$env:TMP = $verificationTemp
$env:TMPDIR = $verificationTemp
$env:RAYON_NUM_THREADS = '2'
$turboArguments = @('exec', 'turbo', 'run', 'build:library', '--filter=@crab-dev/rc-pdf-editor', '--concurrency=2', '--summarize')
$summaryDirectory = Join-Path $workspaceRoot '.turbo/runs'
$previousSummaries = @(Get-ChildItem -LiteralPath $summaryDirectory -File -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name)
$sourceRoot = Join-Path $workspaceRoot 'components/rc-pdf-editor'
$sourceRecords = @(foreach ($folder in @('src', 'scripts', 'public')) {
    Get-ChildItem -LiteralPath (Join-Path $sourceRoot $folder) -Recurse -File -Force | Where-Object {
        $_.FullName -ne (Join-Path $sourceRoot 'src/token.ts') -and -not $_.FullName.StartsWith((Join-Path $sourceRoot 'public/runtime') + [System.IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)
    } | ForEach-Object { [PSCustomObject]@{ path = [System.IO.Path]::GetRelativePath($workspaceRoot, $_.FullName).Replace('\', '/'); sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant() } }
})
$sourceRecords | Sort-Object path | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'pdf-source-before-warm.json')
[PSCustomObject]@{ workspace = $workspaceRoot; temp = $verificationTemp; tmpdir = $env:TMPDIR; rayon = $env:RAYON_NUM_THREADS; command = @('yarn') + $turboArguments; startedAt = [DateTime]::UtcNow.ToString('o') } | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'warm-command.json')
& yarn @turboArguments *> (Join-Path $PSScriptRoot 'warm.log')
$warmExit = $LASTEXITCODE
$newSummaries = @(Get-ChildItem -LiteralPath $summaryDirectory -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -notin $previousSummaries })
foreach ($summary in $newSummaries) { Copy-Item -LiteralPath $summary.FullName -Destination (Join-Path $PSScriptRoot ('warm-native-' + $summary.Name)) -ErrorAction Stop }
[PSCustomObject]@{ exitCode = $warmExit; summaries = @($newSummaries.Name); finishedAt = [DateTime]::UtcNow.ToString('o') } | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'warm-result.json')
Get-Content -LiteralPath (Join-Path $PSScriptRoot 'warm-result.json')
exit $warmExit
