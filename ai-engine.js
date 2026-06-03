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
    }

    async initialize(topic, level = 'medium') {
        this.learningState.currentTopic = topic;
        this.learningState.difficulty = level;
        this.addSystemMessage(`开始学习「${topic}」，难度：${level}`);
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

    generateLocalResponse(userMessage) {
        const role = this.roles[this.currentRole];
        
        switch(this.currentRole) {
            case 'explainer':
                return `关于「${this.learningState.currentTopic}」：

📚 **核心概念**
这是一个重要的基础知识点...

🔑 **关键要点**
1. 要点一：基本定义和原理
2. 要点二：主要特征和应用场景
3. 要点三：与其他概念的关系

需要我详细展开哪个部分？`;
                
            case 'questioner':
                this.learningState.questionsAsked++;
                return `让我检验你的理解：

**问题1（基础）**：${this.learningState.currentTopic}的定义是什么？

**问题2（应用）**：如何将其应用到实际问题？

**问题3（深入）**：它的局限性是什么？

请逐一回答，我会评估你的掌握程度。`;
                
            case 'corrector':
                this.learningState.errorsMade++;
                return `🔍 **错误诊断**

检测到可能的错误类型，正在分析...

✅ **纠正建议**
1. 回顾基本概念
2. 检查计算步骤
3. 验证方法适用性

让我们一步步分析你的答案...`;
                
            case 'planner':
                return `📋 **个性化学习计划**

**当前状态**：掌握度 ${this.learningState.masteryLevel}%

**建议路径**：
${this.learningState.masteryLevel < 30 ? 
`1️⃣ 夯实基础（20分钟）
2️⃣ 基础练习（15分钟）
3️⃣ 概念巩固（10分钟）` :
this.learningState.masteryLevel < 70 ?
`1️⃣ 进阶训练（25分钟）
2️⃣ 变式练习（20分钟）
3️⃣ 综合应用（15分钟)` :
`1️⃣ 综合突破（30分钟）
2️⃣ 创新应用（20分钟）
3️⃣ 知识迁移（15分钟）`}

准备好开始执行了吗？`;
                
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
        const recent = this.conversationHistory.slice(-15);
        const filtered = recent.filter(m => m.role === 'user' || m.role === 'assistant');
        if (filtered.length === 0) {
            return [{ role: 'user', content: '你好' }];
        }
        return filtered;
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
