# 修复 enhanced-ui.js 中的作用域问题
# 删除 bindDragFunctionality 和 bindResizeFunctionality 函数

$filePath = "c:\Users\Steve\Desktop\日常文件\大一下（一）\个性化学习助手\enhanced-ui.js"
$content = Get-Content $filePath -Raw

# 要删除的模式：从 "bindDragFunctionality();" 到 "bindRoleButtons();"
$pattern = '(bindDragFunctionality\(\);\s*bindResizeFunctionality\(\);\s*function bindDragFunctionality\(\) \{[\s\S]*?\n\s{8}\}\s*function bindResizeFunctionality\(\) \{[\s\S]*?\n\s{8}\}\s*\})'

$newContent = $content -replace $pattern, 'bindRoleButtons();'

if ($newContent -ne $content) {
    Set-Content -Path $filePath -Value $newContent -NoNewline
    Write-Host "✅ 已修复 enhanced-ui.js，删除了有问题的拖动和调整大小功能"
} else {
    Write-Host "⚠️ 未能匹配到目标代码，可能已被修复"
}
