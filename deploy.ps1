$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $false

function Info([string]$Message) {
  Write-Host "[INFO]  $Message"
}

function Warn([string]$Message) {
  Write-Host "[WARN]  $Message"
}

function ErrorLog([string]$Message) {
  Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Ensure-FileFromExample([string]$Path, [string]$ExamplePath) {
  if (Test-Path -LiteralPath $Path) {
    Info "$Path already exists."
    return
  }

  if (-not (Test-Path -LiteralPath $ExamplePath)) {
    Warn "$ExamplePath not found; skipped creating $Path."
    return
  }

  Copy-Item -LiteralPath $ExamplePath -Destination $Path
  Warn "$Path created from $ExamplePath."
}

function Get-DotEnvValues([string]$Path) {
  $values = @{}

  if (-not (Test-Path -LiteralPath $Path)) {
    return $values
  }

  foreach ($line in Get-Content -LiteralPath $Path) {
    if ([string]::IsNullOrWhiteSpace($line) -or $line.TrimStart().StartsWith('#')) {
      continue
    }

    $parts = $line -split '=', 2
    if ($parts.Count -ne 2) {
      continue
    }

    $values[$parts[0].Trim()] = $parts[1].Trim()
  }

  return $values
}

function Get-SettingValue([hashtable]$DotEnvValues, [string]$Name, [string]$DefaultValue) {
  $envValue = [Environment]::GetEnvironmentVariable($Name)
  if (-not [string]::IsNullOrWhiteSpace($envValue)) {
    return $envValue
  }

  if ($DotEnvValues.ContainsKey($Name) -and -not [string]::IsNullOrWhiteSpace($DotEnvValues[$Name])) {
    return $DotEnvValues[$Name]
  }

  return $DefaultValue
}

function Get-LocalUrl([string]$Port, [string]$Path = '') {
  $suffix = $Path
  if ([string]::IsNullOrWhiteSpace($suffix)) {
    $suffix = ''
  }

  if ($Port -eq '80') {
    return "http://localhost$suffix"
  }

  return "http://localhost:$Port$suffix"
}

function Invoke-Compose([string[]]$Arguments) {
  & docker compose @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "docker compose $($Arguments -join ' ') failed with exit code $LASTEXITCODE"
  }
}

function Wait-Healthy([string]$Service, [int]$TimeoutSeconds) {
  $elapsed = 0
  Info "Waiting for service '$Service' to become healthy (max ${TimeoutSeconds}s)..."

  while ($true) {
    $containerId = (& docker compose ps -q $Service 2>$null)
    $status = 'unknown'

    if ($containerId) {
      try {
        $status = (& docker inspect --format='{{.State.Health.Status}}' $containerId 2>$null).Trim()
      } catch {
        $status = 'unknown'
      }
    }

    if ($status -eq 'healthy') {
      Info "Service '$Service' is healthy."
      return
    }

    if ($elapsed -ge $TimeoutSeconds) {
      throw "Timed out waiting for '$Service' (last status: $status)"
    }

    Start-Sleep -Seconds 5
    $elapsed += 5
    Info "  ... still waiting for '$Service' (${elapsed}s, status=$status)"
  }
}

function Test-Endpoint([string]$Url, [string]$Label) {
  try {
    $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 8 -UseBasicParsing
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
      Info "$Label is reachable"
      return
    }
    throw "StatusCode: $($response.StatusCode)"
  } catch {
    throw "$Label is not reachable: $($_.Exception.Message)"
  }
}

try {
  Info "Preparing environment files"
  Ensure-FileFromExample -Path '.env' -ExamplePath '.env.example'
  Ensure-FileFromExample -Path 'docker.env' -ExamplePath 'docker.env.example'

  $dotEnvValues = Get-DotEnvValues -Path '.env'
  $httpPort = Get-SettingValue -DotEnvValues $dotEnvValues -Name 'HTTP_PORT' -DefaultValue '80'
  $webPort = Get-SettingValue -DotEnvValues $dotEnvValues -Name 'WEB_HOST_PORT' -DefaultValue '3000'
  $apiPort = Get-SettingValue -DotEnvValues $dotEnvValues -Name 'API_HOST_PORT' -DefaultValue '4000'
  $webUrl = Get-LocalUrl -Port $httpPort
  $apiUrl = Get-LocalUrl -Port $httpPort -Path '/api/health'
  $directWebUrl = Get-LocalUrl -Port $webPort
  $directApiUrl = Get-LocalUrl -Port $apiPort -Path '/api/health'

  Info 'Building and starting all services'
  Invoke-Compose -Arguments @('up', '--build', '-d')

  Wait-Healthy -Service 'postgres' -TimeoutSeconds 90
  Wait-Healthy -Service 'redis' -TimeoutSeconds 60
  Wait-Healthy -Service 'backend' -TimeoutSeconds 120
  Wait-Healthy -Service 'web' -TimeoutSeconds 120
  Wait-Healthy -Service 'nginx' -TimeoutSeconds 120

  Info 'Running runtime endpoint check'
  Test-Endpoint -Url $webUrl -Label "Web ($webUrl)"
  Test-Endpoint -Url $apiUrl -Label "API ($apiUrl)"

  Info '========================================'
  Info 'Deployment completed successfully'
  Info "  Web frontend : $webUrl"
  Info "  Backend API  : $(Get-LocalUrl -Port $httpPort -Path '/api')"
  Info "  Direct web   : $directWebUrl"
  Info "  Direct API   : $directApiUrl"
  Info '========================================'
} catch {
  ErrorLog $_.Exception.Message
  Warn 'Collecting recent container status for diagnostics...'
  & docker compose ps
  exit 1
}
