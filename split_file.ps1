
# 读取原始HTML文件
$htmlContent = Get-Content -Path "明日方舟学习终端.html" -Raw -Encoding UTF8

# 找到CSS部分的开始和结束
$styleStart = $htmlContent.IndexOf('&lt;style&gt;')
$styleEnd = $htmlContent.IndexOf('&lt;/style&gt;')
$cssContent = $htmlContent.Substring($styleStart + 7, $styleEnd - $styleStart - 7)

# 找到JavaScript部分的开始
$scriptStart = $htmlContent.IndexOf('&lt;script&gt;')
$scriptEnd = $htmlContent.LastIndexOf('&lt;/script&gt;')
$jsContent = $htmlContent.Substring($scriptStart + 8, $scriptEnd - $scriptStart - 8)

# 提取数据部分
$dataPartStart = $jsContent.IndexOf('const docsData=')
$dataPart = $jsContent.Substring($dataPartStart)

# 构建新的HTML
$newHtml = @"
&lt;!DOCTYPE html&gt;
&lt;html lang="zh-CN"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;个性化学习助手&lt;/title&gt;
    &lt;script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"&gt;&lt;/script&gt;
    &lt;link rel="stylesheet" href="styles.css"&gt;
&lt;/head&gt;
&lt;body&gt;
"@

# 添加body内容（从&lt;body&gt;标签到第一个&lt;script&gt;标签之前）
$bodyStart = $htmlContent.IndexOf('&lt;body&gt;') + 6
$bodyEnd = $scriptStart
$newHtml += $htmlContent.Substring($bodyStart, $bodyEnd - $bodyStart)

# 添加script引用
$newHtml += @"

    &lt;script src="data.js"&gt;&lt;/script&gt;
    &lt;script src="app.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
"@

# 保存文件
Set-Content -Path "index.html" -Value $newHtml -Encoding UTF8
Set-Content -Path "styles.css" -Value $cssContent -Encoding UTF8

# 分离data.js和app.js
# 找到主要的函数定义开始位置
$appStart = $jsContent.IndexOf('function init()')
if ($appStart -eq -1) {
    # 尝试找其他入口
    $appStart = $jsContent.IndexOf('let currCourse')
}

# 数据部分到app部分
$dataContent = $jsContent.Substring(0, $appStart)
$appContent = $jsContent.Substring($appStart)

Set-Content -Path "data.js" -Value $dataContent -Encoding UTF8
Set-Content -Path "app.js" -Value $appContent -Encoding UTF8

Write-Host "文件拆分完成！"
Write-Host "创建了：index.html, styles.css, data.js, app.js"
