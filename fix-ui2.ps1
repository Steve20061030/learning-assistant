# 修复 enhanced-ui.js - 删除第210-398行

$filePath = "c:\Users\Steve\Desktop\日常文件\大一下（一）\个性化学习助手\enhanced-ui.js"

# 读取所有行
$lines = Get-Content $filePath

# 删除第210-398行（索引189-397）
$newLines = @()
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($i -ge 189 -and $i -le 397) {
        # 跳过这些行
        continue
    }
    $newLines += $lines[$i]
}

# 在第209行后添加 "bindRoleButtons();"
$result = @()
for ($i = 0; $i -lt 209; $i++) {
    $result += $newLines[$i]
}
$result += "            bindRoleButtons();"
for ($i = 209; $i -lt $newLines.Count; $i++) {
    $result += $newLines[$i]
}

# 写入文件
$result | Set-Content -Path $filePath -NoNewline

Write-Host "✅ 已修复 enhanced-ui.js"
Write-Host "删除了 bindDragFunctionality 和 bindResizeFunctionality 函数"
