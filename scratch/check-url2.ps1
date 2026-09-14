Write-Output "=== Verificando URLs ==="
Write-Output ""

Write-Output "1. Probando https://mobilart.onrender.com (con B)..."
try {
    $resp = Invoke-WebRequest -Uri 'https://mobilart.onrender.com' -UseBasicParsing -TimeoutSec 30
    Write-Output "   RESULTADO: Status $($resp.StatusCode) - FUNCIONA!"
} catch {
    Write-Output "   RESULTADO: ERROR - $($_.Exception.Message)"
}

Write-Output ""
Write-Output "2. Probando https://movilart.onrender.com (con V)..."
try {
    $resp2 = Invoke-WebRequest -Uri 'https://movilart.onrender.com' -UseBasicParsing -TimeoutSec 30
    Write-Output "   RESULTADO: Status $($resp2.StatusCode) - FUNCIONA!"
} catch {
    Write-Output "   RESULTADO: ERROR - $($_.Exception.Message)"
}
