
# 个性化学习助手 - 项目结构

## 项目目录结构

```
个性化学习助手/
│
├── 📂 前端文件 (根目录)
│   ├── index.html                    # 主入口文件
│   ├── styles.css                    # 全局样式
│   ├── data.js                      # 数据定义（知识节点、题目等）
│   ├── visualizations.js            # 可视化函数库
│   └── README.md                    # 项目说明
│
├── 📂 src/                          # 源代码目录（模块化开发）
│   ├── css/                         # CSS样式
│   │   └── styles.css              # 全局样式
│   ├── js/                         # JavaScript脚本
│   │   ├── data/                   # 数据模块
│   │   │   └── knowledge.js        # 知识图谱数据
│   │   ├── components/             # 组件模块
│   │   │   ├── profile.js         # 档案模块
│   │   │   ├── analytics.js       # 学习分析模块
│   │   │   ├── notes.js          # 笔记模块
│   │   │   └── visualization.js   # 可视化模块
│   │   └── utils/                 # 工具函数
│   │       └── helpers.js          # 辅助函数
│   └── assets/                     # 静态资源
│       └── images/                 # 图片资源
│
├── 📂 backend/                     # 后端代码
│   ├── core/                       # 核心引擎
│   │   ├── adaptive_learning_engine.py  # 自适应学习引擎
│   │   ├── ai_content_generator.py     # AI内容生成
│   │   ├── learning_style_analyzer.py   # 学习风格分析
│   │   └── feedback_optimizer.py        # 反馈优化
│   ├── models/                     # 数据模型
│   │   └── data_models.py         # 数据结构定义
│   ├── api/                       # API接口
│   │   └── routes.py             # Flask路由
│   ├── utils/                     # 工具函数
│   │   └── helpers.py            # 辅助函数
│   ├── web_app.py                # Flask应用入口
│   ├── main.py                   # 主程序
│   └── requirements.txt           # Python依赖
│
├── 📂 docs/                       # 项目文档
│   ├── PRD文档.md                # 产品需求文档
│   ├── 任务执行清单.md           # 任务执行计划
│   ├── 测试计划.md               # 测试计划
│   └── 设计文档.md               # 设计文档
│
├── 📂 tests/                      # 测试文件
│   ├── test_api.py               # API测试
│   └── test_integration.py       # 集成测试
│
└── 📄 README.md                   # 项目总说明
```

## 技术栈

### 前端技术
- **HTML5**: 页面结构
- **CSS3**: 样式设计，明日方舟科技风格
- **JavaScript (ES6+)**: 交互逻辑
- **Canvas API**: 算法可视化
- **LocalStorage**: 数据持久化

### 后端技术
- **Python 3.11+**: 后端开发
- **Flask**: Web框架
- **JSON**: 数据交换格式

### 开发工具
- **VS Code**: 代码编辑器
- **Git**: 版本控制
- **Chrome DevTools**: 调试工具

## 启动方式

### 前端开发（无需后端）
直接打开 `index.html` 文件即可运行

### 后端开发
```bash
cd backend
pip install -r requirements.txt
python web_app.py
```

## 目录说明

### 前端文件说明
- **index.html**: 主入口，包含完整功能
- **styles.css**: 明日方舟科技风格样式
- **data.js**: 知识节点、题目等数据定义
- **visualizations.js**: 算法可视化Canvas绘制

### 后端模块说明
- **adaptive_learning_engine.py**: 自适应学习引擎，根据学习风格推荐内容
- **ai_content_generator.py**: AI内容生成器
- **learning_style_analyzer.py**: 学习风格分析器
- **data_models.py**: 数据模型定义

## 开发规范

### 命名规范
- 文件名：小写下划线命名法 (snake_case)
- 函数名：小写下划线命名法
- 变量名：小写下划线命名法
- 常量：大写下划线命名法

### 代码规范
- 缩进：4个空格
- 注释：中文注释
- 提交信息：清晰的描述性信息

## 未来扩展
- 模块化拆分：将现有单文件拆分为多模块
- 组件化：创建可复用组件
- 状态管理：引入状态管理库
- 路由系统：支持多页面导航
