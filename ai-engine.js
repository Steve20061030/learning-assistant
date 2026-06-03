class AILearningAssistant {
    constructor(options = {}) {
        // 优先级：options > window.AI_CONFIG > 硬编码默认值
        const config = window.AI_CONFIG?.api || {};
        
        this.apiKey = options.apiKey || config.apiKey || '';
        this.apiUrl = options.apiUrl || config.apiUrl || 'https://api.deepseek.com/v1/chat/completions';
        this.model = options.model || config.model || 'deepseek-chat';
        
        this.currentRole = 'explainer';
        this.conversationHistory = [];
        this.learningState = {
            currentTopic: '',
            difficulty: 'medium',
            errorPattern: [],
            masteryLevel: 0,
            sessionStart: Date.now(),
            questionsAsked: 0,
            errorsMade: 0,
            hintsUsed: 0
        };
        
        this.roles = {
            explainer: { name: '讲解者', icon: '📖', color: '#7090a0' },
            questioner: { name: '提问者', icon: '❓', color: '#c0a040' },
            corrector: { name: '纠错者', icon: '✨', color: '#b05848' },
            planner: { name: '规划者', icon: '🎯', color: '#9070b0' }
        };
        
        this.pageContext = {};
    }

    capturePageContext() {
        const context = {};
        
        const pageTitle = document.querySelector('h1.page-title, h1, .hero-title');
        if (pageTitle) context.title = pageTitle.textContent.trim();
        
        const pageSubtitle = document.querySelector('p.page-subtitle, .hero-subtitle');
        if (pageSubtitle) context.subtitle = pageSubtitle.textContent.trim();
        
        const definitions = document.querySelectorAll('.definition-text, .section-content, p');
        if (definitions.length > 0) {
            context.content = Array.from(definitions)
                .map(el => el.textContent.trim())
                .filter(text => text.length > 20)
                .slice(0, 5)
                .join('\n\n');
        }
        
        const formulas = document.querySelectorAll('.formula-content, .katex');
        if (formulas.length > 0) {
            context.formulas = Array.from(formulas)
                .map(el => el.textContent.trim())
                .slice(0, 5);
        }
        
        const keyPoints = document.querySelectorAll('li, .scenario-name, .related-card-title');
        if (keyPoints.length > 0) {
            context.keyPoints = Array.from(keyPoints)
                .map(el => el.textContent.trim())
                .filter(text => text.length > 5)
                .slice(0, 10);
        }
        
        this.pageContext = context;
        console.log('[AI] 捕获页面上下文:', context);
    }

    async initialize(topic, level = 'medium') {
        this.capturePageContext();
        this.learningState.currentTopic = topic || this.pageContext.title || '未知知识点';
        this.learningState.difficulty = level;
        this.addSystemMessage(`开始学习「${this.learningState.currentTopic}」，难度：${level}`);
        await this.switchRole('explainer');
        setTimeout(() => this.sendMessage('请为我介绍这个知识点的核心内容', true), 500);
    }

    async switchRole(roleName) {
        if (!this.roles[roleName]) return;
        this.currentRole = roleName;
        const role = this.roles[roleName];
        this.updateUI('role', roleName);
        this.addSystemMessage(`切换为${role.name}模式 ${role.icon}`);
    }

    async sendMessage(content, isAuto = false) {
        if (!content.trim()) return;
        
        this.displayMessage(content, 'user');
        this.addToHistory({ role: 'user', content });
        this.showTypingIndicator();
        
        try {
            let response;
            
            if (this.apiKey && this.apiKey.length > 5) {
                response = await this.callAPI(content);
            } else {
                response = this.generateLocalResponse(content);
            }
            
            this.hideTypingIndicator();
            
            const analyzedResponse = this.analyzeAndEnhanceResponse(response);
            this.displayMessage(analyzedResponse.text, 'ai', analyzedResponse.meta);
            this.addToHistory({ role: 'assistant', content: analyzedResponse.text });
            
            this.updateLearningMetrics(analyzedResponse);
            
        } catch (error) {
            this.hideTypingIndicator();
            console.error('AI Error:', error);
            this.displayMessage('抱歉，我暂时无法响应。请稍后重试。', 'ai');
        }
    }

    async callAPI(userMessage) {
        let url = this.apiUrl;
        let headers = {};
        let body = {};

        const provider = this.detectProvider(url);

        if (provider === 'anthropic') {
            headers = {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            };
            body = {
                model: this.model,
                max_tokens: 4000,
                messages: [{ role: 'user', content: userMessage }]
            };
        } else if (provider === 'ollama') {
            headers = { 'Content-Type': 'application/json' };
            body = {
                model: this.model,
                stream: false,
                messages: [{ role: 'user', content: userMessage }]
            };
            url = url || 'http://localhost:11434/api/chat';
        } else {
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            };
            body = {
                model: this.model,
                messages: this.getConversationForAPI(),
                temperature: 0.7,
                max_tokens: 4000
            };
        }

        console.log('[AI] 发送请求:', { url, model: this.model, messages: body.messages?.length });
        
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            let errorMsg = `API Error: ${response.status}`;
            try {
                const errData = await response.json();
                errorMsg += ` - ${errData.error?.message || JSON.stringify(errData)}`;
            } catch (e) {
                const errText = await response.text();
                errorMsg += ` - ${errText}`;
            }
            console.error('[AI] 请求失败:', errorMsg);
            throw new Error(errorMsg);
        }
        
        const data = await response.json();
        console.log('[AI] 响应数据:', data);
        
        if (provider === 'anthropic') {
            return data.content[0].text;
        } else if (provider === 'ollama') {
            return data.message.content;
        } else {
            if (!data.choices || !data.choices[0]) {
                throw new Error('Invalid API response');
            }
            return data.choices[0].message.content;
        }
    }

    detectProvider(url) {
        if (url.includes('anthropic')) return 'anthropic';
        if (url.includes('ollama') || url.includes('localhost')) return 'ollama';
        if (url.includes('azure')) return 'azure';
        if (url.includes('deepseek')) return 'openai';
        return 'openai';
    }

    generateSystemPrompt() {
        const context = this.pageContext;
        let prompt = `你是一个专业的AI学习助手，现在正在讲解「${this.learningState.currentTopic}」这个知识点。

`;
        
        if (context.title) {
            prompt += `## 当前学习内容：${context.title}\n`;
        }
        
        if (context.subtitle) {
            prompt += `### 简介：${context.subtitle}\n`;
        }
        
        if (context.content) {
            prompt += `### 核心内容：\n${context.content.slice(0, 500)}...\n`;
        }
        
        if (context.formulas && context.formulas.length > 0) {
            prompt += `### 关键公式：\n${context.formulas.join('\n')}\n`;
        }
        
        if (context.keyPoints && context.keyPoints.length > 0) {
            prompt += `### 要点列表：\n${context.keyPoints.slice(0, 5).map((p, i) => `${i + 1}. ${p}`).join('\n')}\n`;
        }
        
        prompt += `

你的角色是：${this.roles[this.currentRole].name}（${this.roles[this.currentRole].icon}）

角色说明：
- 📖 讲解者：深入讲解当前知识点的核心概念、原理和应用
- ❓ 提问者：根据页面内容提出针对性问题，检验学习效果
- ✨ 纠错者：分析用户回答中的错误，提供针对性纠正和解释
- 🎯 规划者：根据用户的掌握情况，制定个性化学习计划

请根据当前页面内容进行针对性对话，引用页面中的具体内容进行讲解和提问。难度级别：${this.learningState.difficulty}。
`;
        
        return prompt;
    }

    generateLocalResponse(userMessage) {
        const role = this.roles[this.currentRole];
        const context = this.pageContext;
        
        switch(this.currentRole) {
            case 'explainer': {
                const keyContent = context.content ? context.content.slice(0, 300) : '这是一个重要的知识点';
                const keyPoints = context.keyPoints ? context.keyPoints.slice(0, 3) : ['基本定义和原理', '主要特征', '应用场景'];
                
                return `📖 **${role.name}模式** - 关于「${this.learningState.currentTopic}」：

${context.subtitle ? `> ${context.subtitle}` : ''}

📚 **核心概念**
${keyContent}

🔑 **关键要点**
${keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

${context.formulas && context.formulas.length > 0 ? `📐 **关键公式**\n${context.formulas[0]}` : ''}

需要我详细展开哪个部分？`;
            }
                
            case 'questioner': {
                this.learningState.questionsAsked++;
                const keyPoints = context.keyPoints ? context.keyPoints.slice(0, 3) : [];
                
                let questions = [];
                if (keyPoints.length > 0) {
                    questions.push(`**问题1（基础）**：如何理解「${keyPoints[0]}」？`);
                    if (keyPoints.length > 1) {
                        questions.push(`**问题2（应用）**：${keyPoints[1]} 在实际场景中如何应用？`);
                    }
                } else {
                    questions.push(`**问题1（基础）**：${this.learningState.currentTopic}的核心定义是什么？`);
                    questions.push(`**问题2（应用）**：如何将${this.learningState.currentTopic}应用到实际问题中？`);
                }
                questions.push(`**问题3（深入）**：${this.learningState.currentTopic}的局限性或适用边界是什么？`);
                
                return `❓ **${role.name}模式** - 让我检验你的理解：

${questions.join('\n\n')}

请逐一回答，我会评估你的掌握程度。`;
            }
                
            case 'corrector': {
                this.learningState.errorsMade++;
                return `✨ **${role.name}模式** - 🔍 错误诊断

根据当前学习内容「${this.learningState.currentTopic}」，我来分析你的回答...

请告诉我你的答案或思路，我会：
1. 识别错误类型（计算错误/理解错误/方法错误）
2. 指出具体问题所在
3. 提供正确的思路和解释

请输入你想分析的答案：`;
            }
                
            case 'planner': {
                const topic = this.learningState.currentTopic;
                const level = this.learningState.masteryLevel;
                
                let plan = '';
                if (level < 30) {
                    plan = `1️⃣ **夯实基础**（20分钟）
   - 复习${topic}的核心定义和基本原理
   - 理解关键公式的含义
   - 完成基础概念测试

2️⃣ **基础练习**（15分钟）
   - 尝试简单的应用案例
   - 验证核心公式的计算过程

3️⃣ **概念巩固**（10分钟）
   - 总结学习要点
   - 与相关知识点建立联系`;
                } else if (level < 70) {
                    plan = `1️⃣ **进阶训练**（25分钟）
   - 深入理解${topic}的数学原理
   - 分析复杂应用场景

2️⃣ **变式练习**（20分钟）
   - 尝试不同条件下的应用
   - 分析边界情况

3️⃣ **综合应用**（15分钟）
   - 结合实际问题进行建模
   - 验证解决方案的有效性`;
                } else {
                    plan = `1️⃣ **综合突破**（30分钟）
   - 探索${topic}的前沿应用
   - 分析最新研究进展

2️⃣ **创新应用**（20分钟）
   - 尝试跨领域应用
   - 提出改进思路

3️⃣ **知识迁移**（15分钟）
   - 总结学习经验
   - 指导其他学习者`;
                }
                
                return `🎯 **${role.name}模式** - 📋 个性化学习计划

**当前学习内容**：${topic}
**当前掌握度**：${level}%

**建议学习路径**：
${plan}

准备好开始执行了吗？需要我为你详细讲解某个环节吗？`;
            }
                
            default:
                return '我理解了，让我为你解答...';
        }
    }

    analyzeAndEnhanceResponse(responseText) {
        const meta = { role: this.currentRole, errorType: null };
        if (this.currentRole === 'corrector') {
            meta.errorType = this.classifyError(responseText);
        }
        return { text: responseText, meta };
    }

    classifyError(text) {
        if (text.includes('计算') || text.includes('算')) return 'calculation';
        if (text.includes('理解') || text.includes('概念')) return 'understanding';
        if (text.includes('方法') || text.includes('思路')) return 'method';
        return null;
    }

    updateLearningMetrics(meta) {
        if (this.currentRole === 'questioner') {
            this.learningState.questionsAsked++;
            this.learningState.masteryLevel = Math.min(100, 
                this.learningState.masteryLevel + 5);
        }
        if (meta.errorType) {
            this.learningState.masteryLevel = Math.max(0, 
                this.learningState.masteryLevel - 3);
        }
        this.updateUI('metrics', this.learningState);
    }

    displayMessage(content, type, meta = {}) {
        const container = document.getElementById('ai-messages');
        if (!container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-message ${type}`;
        
        let html = '';
        if (type === 'ai' && meta.role && this.roles[meta.role]) {
            html += `<span class="ai-message-role ${meta.role}">${this.roles[meta.role].icon} ${this.roles[meta.role].name}</span>`;
        }
        if (meta.errorType) {
            const labels = { calculation: '计算错误', understanding: '理解错误', method: '方法错误' };
            html += `<div class="ai-error-type ${meta.errorType}">⚠️ ${labels[meta.errorType]}</div>`;
        }
        html += `<div class="ai-message-text">${this.formatMessage(content)}</div>`;
        
        msgDiv.innerHTML = html;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    formatMessage(text) {
        if (!text) return '';
        
        let result = text;
        
        // 先转义HTML特殊字符，防止XSS
        result = result
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // 处理Markdown格式
        result = result
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
        
        return result;
    }

    addSystemMessage(text) {
        const container = document.getElementById('ai-messages');
        if (!container) return;
        const div = document.createElement('div');
        div.className = 'ai-message system';
        div.textContent = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        this.addToHistory({ role: 'assistant', content: text });
    }

    addToHistory(msg) {
        this.conversationHistory.push(msg);
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-40);
        }
    }

    getConversationForAPI() {
        const systemPrompt = this.generateSystemPrompt();
        const recent = this.conversationHistory.slice(-15);
        const filtered = recent.filter(m => m.role === 'user' || m.role === 'assistant');
        
        const messages = [{ role: 'system', content: systemPrompt }];
        
        if (filtered.length > 0) {
            messages.push(...filtered);
        } else {
            messages.push({ role: 'user', content: '请为我介绍当前页面的知识点内容' });
        }
        
        return messages;
    }

    showTypingIndicator() {
        const el = document.getElementById('ai-typing');
        if (el) el.classList.add('active');
    }

    hideTypingIndicator() {
        const el = document.getElementById('ai-typing');
        if (el) el.classList.remove('active');
    }

    updateUI(type, data) {
        if (type === 'role') {
            document.querySelectorAll('.ai-role-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.role === data);
            });
        }
        if (type === 'metrics') {
            const els = {
                mastery: document.querySelector('.ai-metric-value[data-type="mastery"]'),
                questions: document.querySelector('.ai-metric-value[data-type="questions"]'),
                errors: document.querySelector('.ai-metric-value[data-type="errors"]')
            };
            if (els.mastery) els.mastery.textContent = `${data.masteryLevel}%`;
            if (els.questions) els.questions.textContent = data.questionsAsked;
            if (els.errors) els.errors.textContent = data.errorsMade;
        }
    }

    setAPIKey(key) { this.apiKey = key; }
    setModel(model) { this.model = model; }
    setApiUrl(url) { this.apiUrl = url; }
}

window.AILearningAssistant = AILearningAssistant;
