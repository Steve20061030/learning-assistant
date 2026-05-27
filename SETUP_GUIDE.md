
# 个性化学习助手 - 开发环境搭建指南

## 环境要求

### 最低环境要求
- **操作系统**: Windows 10+ / macOS 10.14+ / Ubuntu 18.04+
- **内存**: 4GB RAM
- **磁盘空间**: 500MB
- **浏览器**: Chrome 90+ / Firefox 88+ / Safari 14+

### 推荐环境要求
- **操作系统**: Windows 11 / macOS 12+ / Ubuntu 20.04+
- **内存**: 8GB RAM
- **磁盘空间**: 1GB
- **浏览器**: Chrome 最新版

---

## 前端开发环境

### 1. 代码编辑器
**推荐**: Visual Studio Code

**下载地址**: https://code.visualstudio.com/

**推荐插件**:
- Live Server - 本地开发服务器
- Prettier - 代码格式化
- ESLint - JavaScript代码检查
- HTML CSS Support - CSS智能提示
- JavaScript (ES6) code snippets - ES6代码片段

### 2. 浏览器
**推荐**: Chrome DevTools（内置于Chrome）

**功能**:
- Elements面板：检查和修改HTML/CSS
- Console面板：JavaScript调试
- Network面板：网络请求分析
- Performance面板：性能分析

### 3. 运行方式
前端无需编译，直接打开文件即可：
```bash
# Windows
双击 index.html 文件

# 或使用VS Code的Live Server插件
右键 index.html → "Open with Live Server"
```

---

## 后端开发环境

### 1. Python环境
**要求**: Python 3.11+

**下载地址**: https://www.python.org/downloads/

**验证安装**:
```bash
python --version
# 应显示 Python 3.11.x 或更高版本
```

### 2. 安装依赖
```bash
# 进入项目目录
cd 个性化学习助手

# 安装Python依赖
pip install -r requirements.txt

# 验证安装
pip list | grep flask
# 应显示 flask, werkzeug, jinja2
```

### 3. 运行后端服务
```bash
# 进入后端目录
cd backend

# 运行Flask应用
python web_app.py

# 服务将在 http://127.0.0.1:5000 启动
```

### 4. 测试API
```bash
# 测试获取学习路径API
curl http://127.0.0.1:5000/api/learning-path

# 测试获取课程列表API
curl http://127.0.0.1:5000/api/courses
```

---

## Git版本控制

### 1. 安装Git
**下载地址**: https://git-scm.com/downloads

**验证安装**:
```bash
git --version
# 应显示 git version 2.x.x
```

### 2. 初始化仓库
```bash
# 进入项目目录
cd 个性化学习助手

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"
```

### 3. 常用Git命令
```bash
# 查看状态
git status

# 查看差异
git diff

# 添加修改
git add <文件名>

# 提交
git commit -m "提交信息"

# 查看提交历史
git log
```

---

## 开发工具配置

### VS Code设置
创建 `.vscode/settings.json` 文件：
```json
{
  "editor.formatOnSave": true,
  "editor.tabSize": 4,
  "editor.detectIndentation": false,
  "liveServer.settings.port": 5500,
  "files.autoSave": "afterDelay",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### Python环境配置
创建 `backend/.env` 文件（可选）：
```env
FLASK_APP=web_app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
```

---

## 快速开始

### 方式一：仅前端开发
1. 安装VS Code
2. 安装Live Server插件
3. 打开项目目录
4. 右键 `index.html` → "Open with Live Server"
5. 开始开发！

### 方式二：全栈开发
1. 安装VS Code
2. 安装Python 3.11+
3. 安装Git
4. 克隆项目（如果使用远程仓库）
5. 安装Python依赖
6. 启动后端服务
7. 启动前端服务
8. 开始开发！

---

## 常见问题

### Q1: pip install失败
**解决方案**:
```bash
# 升级pip
python -m pip install --upgrade pip

# 使用国内镜像
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### Q2: Flask启动失败
**解决方案**:
```bash
# 检查Flask是否安装
pip list | grep flask

# 重新安装
pip uninstall flask
pip install flask>=2.0.0
```

### Q3: 前端页面无法加载
**解决方案**:
- 确保使用HTTP服务器而非直接打开文件
- 使用Live Server或Python的http.server
- 检查浏览器控制台是否有错误

### Q4: CORS跨域问题
**解决方案**:
- 后端已配置flask-cors，确保已安装依赖
- 前端使用fetch API时注意跨域限制

---

## 下一步

环境搭建完成后，建议按以下顺序开始开发：

1. **阅读文档**
   - README.md - 项目说明
   - PROJECT_STRUCTURE.md - 项目结构
   - TECH_STACK.md - 技术选型
   - PRD文档.md - 产品需求

2. **查看代码**
   - index.html - 主入口
   - styles.css - 样式
   - data.js - 数据
   - visualizations.js - 可视化

3. **运行测试**
   - 启动前端服务
   - 测试基本功能
   - 检查浏览器控制台

4. **开始开发**
   - 选择任务（T6-T12任一任务）
   - 按任务清单逐步实现

---

**文档结束**
