const knowledgeNodes = [
    { name: '线性回归', level: 1, category: 'ai' },
    { name: '逻辑回归', level: 1, category: 'ai' },
    { name: 'KNN', level: 1, category: 'ai' },
    { name: '机器学习基础', level: 2, category: 'ai' },
    { name: '决策树', level: 2, category: 'ai' },
    { name: '神经网络', level: 3, category: 'ai' },
    { name: 'SVM', level: 3, category: 'ai' },
    { name: '随机森林', level: 3, category: 'ai' },
    { name: '深度学习', level: 4, category: 'ai' },
    { name: '卷积神经网络', level: 4, category: 'ai' },
    { name: '栈和队列', level: 1, category: 'ds' },
    { name: '链表', level: 1, category: 'ds' },
    { name: '树结构', level: 2, category: 'ds' },
    { name: '排序算法', level: 2, category: 'ds' },
    { name: '查找算法', level: 2, category: 'ds' },
    { name: '图算法', level: 3, category: 'ds' },
    { name: '集合论', level: 1, category: 'math' },
    { name: '命题逻辑', level: 1, category: 'math' },
    { name: '谓词逻辑', level: 2, category: 'math' },
    { name: '图论', level: 2, category: 'math' },
    { name: '信息表示', level: 1, category: 'sys' },
    { name: '浮点数', level: 2, category: 'sys' },
    { name: '动态规划', level: 3, category: 'algo' },
    { name: '贪心算法', level: 3, category: 'algo' },
    { name: '复杂度分析', level: 2, category: 'algo' }
];

const topicDetails = {
    '线性回归': {
        level: 1,
        definition: '线性回归是最基础的机器学习算法之一。它的目标是找到一条最佳直线（或超平面），用来描述因变量和自变量之间的线性关系。通过最小化预测值与实际值之间的均方误差来训练模型。',
        intuition: '想象你在散点图中画一条线，让所有点到这条线的距离平方和最小。这条线就是最佳拟合线，能够最好地代表数据的趋势。',
        formula: 'ŷ = w₁x₁ + w₂x₂ + ... + wₙxₙ + b\n= Σwᵢxᵢ + b',
        loss: '均方误差: J(w,b) = (1/(2n)) Σ(yᵢ - ŷᵢ)²',
        scenarios: ['房价预测', '销量预测', '成绩预测', '温度预测'],
        related: ['逻辑回归', '岭回归', 'SVM', '多元线性回归'],
        hasVisualization: true,
        vizType: 'regression',
        history: '线性回归由弗朗西斯·高尔顿在19世纪末提出，用于研究父子身高关系。后来被卡尔·皮尔逊发展完善，成为统计学的核心方法。',
        limitations: '只能捕捉线性关系，对异常值敏感，需要假设数据服从正态分布，无法处理非线性问题。',
        stats: { accuracy: 92, complexity: 'O(n)', usage: '广泛' },
        vizControls: [
            { name: '斜率', key: 'slope', min: -2, max: 2, step: 0.1, default: 1.0 },
            { name: '截距', key: 'intercept', min: -5, max: 5, step: 0.1, default: 0.0 },
            { name: '噪声水平', key: 'noise', min: 0, max: 1, step: 0.05, default: 0.5 },
            { name: '样本数量', key: 'samples', min: 10, max: 100, step: 5, default: 30 }
        ],
        tryItems: [
            '调整斜率观察回归线的变化',
            '增加噪声观察数据的分散程度',
            '改变样本数观察拟合的稳定性'
        ]
    },
    '逻辑回归': {
        level: 1,
        definition: '逻辑回归是一种用于二分类问题的监督学习算法，输出概率值表示样本属于某一类的可能性。通过sigmoid函数将线性组合映射到0-1区间。',
        intuition: '在线性回归的基础上，使用sigmoid函数将输出压缩到0-1之间，表示样本属于正类的概率。概率大于0.5则预测为正类，否则为负类。',
        formula: 'σ(z) = 1 / (1 + e^(-z))\n其中 z = w·x + b',
        loss: '交叉熵损失: L = -[y·log(ŷ) + (1-y)·log(1-ŷ)]',
        scenarios: ['垃圾邮件检测', '疾病诊断', '信用评分', '欺诈检测'],
        related: ['线性回归', 'SVM', '神经网络', 'Softmax回归'],
        hasVisualization: true,
        vizType: 'sigmoid',
        history: '逻辑回归由统计学家大卫·考克斯在1958年提出，最初用于生物统计分析，现已成为分类问题的标准方法。',
        limitations: '只能处理二分类问题，对特征线性可分假设较强，无法直接处理多分类问题（需扩展为Softmax回归）。',
        stats: { accuracy: 88, complexity: 'O(n)', usage: '广泛' },
        vizControls: [
            { name: '权重', key: 'weight', min: -3, max: 3, step: 0.1, default: 1.0 },
            { name: '偏置', key: 'bias', min: -5, max: 5, step: 0.1, default: 0.0 },
            { name: '样本数量', key: 'samples', min: 20, max: 100, step: 10, default: 50 },
            { name: '类别比例', key: 'ratio', min: 0.2, max: 0.8, step: 0.1, default: 0.5 }
        ],
        tryItems: [
            '调整权重观察决策边界的陡峭程度',
            '改变偏置观察决策边界的平移',
            '理解sigmoid函数如何将输出压缩到0-1之间'
        ]
    },
    'KNN': {
        level: 1,
        definition: 'K近邻算法是一种简单的监督学习算法，通过找到最近的K个邻居来进行分类或回归。分类时采用多数投票，回归时采用平均。',
        intuition: '物以类聚，人以群分。一个样本的类别由它周围最近的K个邻居投票决定，距离越近的邻居权重越高。',
        formula: '欧氏距离: d(x,y) = √Σ(xᵢ - yᵢ)²\n曼哈顿距离: d(x,y) = Σ|xᵢ - yᵢ|',
        scenarios: ['推荐系统', '图像分类', '异常检测', '手写识别'],
        related: ['决策树', 'K-Means', 'SVM', '距离度量学习'],
        hasVisualization: true,
        vizType: 'knn',
        history: 'KNN算法由Cover和Hart在1967年正式提出，是最经典的机器学习算法之一，因其简单直观而被广泛应用。',
        limitations: '计算复杂度高（预测时需遍历所有样本），需要大量内存，K值选择敏感，对高维数据效果差。',
        stats: { accuracy: 85, complexity: 'O(n)', usage: '中等' },
        vizControls: [
            { name: 'K值', key: 'k', min: 1, max: 20, step: 1, default: 5 },
            { name: '样本数量', key: 'samples', min: 20, max: 80, step: 10, default: 50 },
            { name: '类别数', key: 'classes', min: 2, max: 4, step: 1, default: 2 },
            { name: '噪声水平', key: 'noise', min: 0, max: 0.5, step: 0.05, default: 0.2 }
        ],
        tryItems: [
            '观察K值变化对分类结果的影响',
            'K=1时分类最精细但噪声敏感',
            '理解K值如何权衡偏差和方差'
        ]
    }
};
