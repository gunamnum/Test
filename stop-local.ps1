$port = 3000
$connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
$processIds = @()

if ($connections) {
  $processIds += $connections | Select-Object -ExpandProperty OwningProcess -Unique
}

if (-not $processIds) {
  $processIds += netstat -ano |
    Select-String ":$port\s+.*LISTENING\s+\d+" |
    ForEach-Object {
      if ($_.Line -match "LISTENING\s+(\d+)") {
        [int]$Matches[1]
      }
    } |
    Select-Object -Unique
}

if (-not $processIds) {
  Write-Host "No local server is running on port $port."
  exit 0
}

$processIds | ForEach-Object {
  Stop-Process -Id $_ -Force
  Write-Host "Stopped local server process $_ on port $port."
}
