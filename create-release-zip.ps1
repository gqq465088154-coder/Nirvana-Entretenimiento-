$ErrorActionPreference = 'Stop'

$ProjectName = 'Nirvana-Entretenimiento'
$PackageJson = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'package.json') -Raw | ConvertFrom-Json
$ProjectVersion = $PackageJson.version
$BranchName = (& git -C $PSScriptRoot rev-parse --abbrev-ref HEAD 2>$null)
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($BranchName)) {
  $BranchName = 'detached-head'
}
$BranchSlug = ($BranchName.ToLower() -replace '[^a-z0-9]+', '-').Trim('-')
$Timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$OutputDir = Join-Path $PSScriptRoot 'release'
$OutputFile = Join-Path $OutputDir ("{0}-v{1}-{2}-{3}.zip" -f $ProjectName, $ProjectVersion, $BranchSlug, $Timestamp)
$StageDir = Join-Path $env:TEMP ("{0}-stage-{1}" -f $ProjectName, [guid]::NewGuid().ToString())

function Info([string]$Message) {
  Write-Host "[INFO]  $Message"
}

function Copy-IfExists([string]$Source, [string]$Destination) {
  if (-not (Test-Path -LiteralPath $Source)) {
    return
  }

  $targetParent = Split-Path -Parent $Destination
  if ($targetParent -and -not (Test-Path -LiteralPath $targetParent)) {
    New-Item -ItemType Directory -Path $targetParent | Out-Null
  }

  Copy-Item -LiteralPath $Source -Destination $Destination -Recurse -Force
}

function Main {
  New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
  New-Item -ItemType Directory -Path $StageDir -Force | Out-Null

  try {
    Info "Preparing staged release contents"

    $includePaths = @(
      '.dockerignore',
      '.env.example',
      'apps',
      'backend',
      'check.sh',
      'create-release-zip.ps1',
      'create-release-zip.sh',
      'DEPLOYMENT.md',
      'deploy.ps1',
      'deploy.sh',
      'docker-compose.yml',
      'docker.env.example',
      'Dockerfile',
      'infra',
      'install.sh',
      'LICENSE',
      'package-lock.json',
      'package.json',
      'pair.sh',
      'README.md',
      'runtime-check.sh'
    )

    foreach ($relativePath in $includePaths) {
      $sourcePath = Join-Path $PSScriptRoot $relativePath
      $destinationPath = Join-Path $StageDir $relativePath
      Copy-IfExists -Source $sourcePath -Destination $destinationPath
    }

    if (Test-Path -LiteralPath $OutputFile) {
      Remove-Item -LiteralPath $OutputFile -Force
    }

    Info "Creating release archive: $OutputFile"
    Compress-Archive -Path (Join-Path $StageDir '*') -DestinationPath $OutputFile -CompressionLevel Optimal

    Info 'Release package created successfully'
    Info "Output: $OutputFile"
  }
  finally {
    if (Test-Path -LiteralPath $StageDir) {
      Remove-Item -LiteralPath $StageDir -Recurse -Force
    }
  }
}

Main