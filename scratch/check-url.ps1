try {
    $resp = Invoke-WebRequest -Uri 'https://mobilart.onrender.com' -UseBasicParsing -TimeoutSec 20
    Write-Output "MOBILART Status: $($resp.StatusCode)"
} catch {
    Write-Output "MOBILART ERROR: $($_.Exception.Message)"
}

try {
    $resp2 = Invoke-WebRequest -Uri 'https://movilart.onrender.com' -UseBasicParsing -TimeoutSec 20
    Write-Output "MOVILART Status: $($resp2.StatusCode)"
} catch {
    Write-Output "MOVILART ERROR: $($_.Exception.Message)"
}
