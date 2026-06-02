(function() {
    'use strict';
    
    let aiInstance = null;
    let isInitialized = false;
    
    function init() {
        try {
            enhanceUI();
            loadAISystem();
        } catch(e) {
            console.error('❌ AI初始化失败:', e);
        }
    }

    function enhanceUI() {
        try { transformLevelBadges(); } catch(e) {}
        try { addDecorations(); } catch(e) {}
    }

    function transformLevelBadges() {
        const badges = document.querySelectorAll('.level-badge');
        badges.forEach(badge => {
            if (badge.dataset.enhanced) return;
            badge.dataset.enhanced = 'true';
            
            const text = badge.textContent || '';
            let level = 1;
            if (text.match(/5|高|专家/)) level = 5;
            else if (text.includes('4')) level = 4;
            else if (text.match(/3|进/)) level = 3;
            else if (text.includes('2')) level = 2;

            const wrapper = document.createElement('div');
            wrapper.className = `level-indicator level-${level}`;
            
            let icons = '<div class="level-icons">';
            for (let i = 1; i <= 5; i++) {
                icons += `<div class="level-icon ${i <= level ? 'filled' : ''}"></div>`;
            }
            icons += '</div>';
            
            const labels = ['入门', '基础', '进阶', '高级', '专家'];
            wrapper.innerHTML = `${icons}<span class="level-text">${labels[level-1] || 'Lv.' + level}</span>`;
            
            badge.replaceWith(wrapper);
        });
    }

    function addDecorations() {
        const headers = document.querySelectorAll('.page-header');
        headers.forEach(header => {
            if (!header.querySelector('.page-bg-logo')) {
                const logo = document.createElement('div');
                logo.className = 'page-bg-logo';
                const titleEl = header.querySelector('.page-title');
                logo.textContent = titleEl ? titleEl.textContent.trim().substring(0, 2) : 'AI';
                header.appendChild(logo);
            }
            if (!header.querySelector('.page-dots-decoration')) {
                const dots = document.createElement('div');
                dots.className = 'page-dots-decoration';
                header.appendChild(dots);
            }
        });

        document.querySelectorAll('.section').forEach(sec => {
            if (!sec.querySelector('.section-dots-decoration')) {
                const d = document.createElement('div');
                d.className = 'section-dots-decoration';
                sec.appendChild(d);
            }
        });
    }

    function loadAISystem() {
        if (document.getElementById('ai-assistant-container') || isInitialized) return;
        isInitialized = true;

        console.log('[AI] 开始加载系统...');

        injectStyles();
        injectEngine();
    }

    function injectStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'ai-assistant.css';
        link.onerror = () => console.error('[AI] CSS加载失败');
        document.head.appendChild(link);
    }

    function injectEngine() {
        const script = document.createElement('script');
        script.src = 'ai-engine.js';
        
        script.onload = () => {
            console.log('[AI] 引擎就绪，注入界面...');
            setTimeout(injectInterface, 100);
        };
        
        script.onerror = () => {
            console.warn('[AI] 引擎加载失败，使用简化模式');
            setTimeout(injectInterface, 100);
        };
        
        document.head.appendChild(script);
    }

    function injectInterface() {
        fetch('ai-assistant.html')
            .then(r => {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.text();
            })
            .then(html => {
                const div = document.createElement('div');
                div.innerHTML = html;
                document.body.appendChild(div);
                
                setTimeout(initController, 200);
                console.log('[AI] ✅ 系统就绪');
            })
            .catch(err => {
                console.error('[AI] 界面加载失败:', err);
                showFallbackButton();
            });
    }

    function showFallbackButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '🤖 AI';
        btn.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            width: 56px; height: 56px; border-radius: 50%;
            background: linear-gradient(135deg, #2a2e32, #1e2228);
            border: 2px solid #484c50; color: #90b0c0;
            font-size: 22px; cursor: pointer; z-index: 9999;
            box-shadow: 0 4px 16px rgba(0,0,0,0.5);
        `;
        btn.onclick = () => alert('AI系统加载失败，请刷新页面重试');
        document.body.appendChild(btn);
    }

    function initController() {
        const container = document.getElementById('ai-assistant') || 
                         document.getElementById('ai-assistant-container');
        
        if (!container) {
            console.error('[AI] 找不到容器元素');
            return;
        }

        const toggleBtn = container.querySelector('#ai-toggle');
        const panel = container.querySelector('#ai-panel');
        const closeBtn = container.querySelector('#ai-close');

        if (!toggleBtn || !panel) {
            console.error('[AI] 核心元素缺失');
            return;
        }

        createAssistant();
        bindEvents();

        function createAssistant() {
            try {
                if (typeof AILearningAssistant !== 'undefined') {
                    const savedKey = localStorage.getItem('ai_api_key') || '';
                    const savedUrl = localStorage.getItem('ai_api_url') || 'https://api.deepseek.com/v1/chat/completions';
                    const savedModel = localStorage.getItem('ai_api_model') || 'deepseek-chat';
                    
                    aiInstance = new AILearningAssistant({
                        apiKey: savedKey,
                        apiUrl: savedUrl,
                        model: savedModel
                    });
                    
                    console.log('[AI] 助手实例已创建', { url: savedUrl, model: savedModel });
                } else {
                    console.warn('[AI] 使用本地模式（无引擎）');
                }
            } catch(e) {
                console.error('[AI] 创建实例失败:', e);
            }
        }

        function bindEvents() {
            toggleBtn.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                panel.classList.toggle('active');
                toggleBtn.style.display = panel.classList.contains('active') ? 'none' : '';
                
                if (panel.classList.contains('active')) {
                    const input = panel.querySelector('#ai-input');
                    if (input) setTimeout(() => input.focus(), 150);
                }
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', e => {
                    e.preventDefault();
                    panel.classList.remove('active');
                    toggleBtn.style.display = '';
                });
            }

            bindDragFunctionality();
            bindResizeFunctionality();

            function bindDragFunctionality() {
                let isDragging = false;
                let startX, startY;
                let panelX = 0, panelY = 0;
                let panelStartWidth, panelStartHeight;

                panel.addEventListener('mousedown', e => {
                    if (e.target.closest('button, input, textarea, select, #ai-input, .ai-role-btn, .ai-tool-btn')) {
                        return;
                    }
                    isDragging = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    
                    const rect = panel.getBoundingClientRect();
                    panelX = rect.left;
                    panelY = rect.top;
                    panelStartWidth = panel.offsetWidth;
                    panelStartHeight = panel.offsetHeight;
                    
                    panel.style.transition = 'none';
                    document.addEventListener('mousemove', onDrag);
                    document.addEventListener('mouseup', onDragEnd);
                    document.addEventListener('mouseleave', onDragEnd);
                });

                function onDrag(e) {
                    if (!isDragging) return;
                    
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    
                    let newX = panelX + dx;
                    let newY = panelY + dy;
                    
                    const maxX = window.innerWidth - panelStartWidth;
                    const maxY = window.innerHeight - panelStartHeight;
                    
                    newX = Math.max(0, Math.min(newX, maxX));
                    newY = Math.max(0, Math.min(newY, maxY));
                    
                    panel.style.left = newX + 'px';
                    panel.style.right = 'auto';
                    panel.style.top = newY + 'px';
                    panel.style.bottom = 'auto';
                    panel.style.position = 'fixed';
                }

                function onDragEnd() {
                    isDragging = false;
                    panel.style.transition = '';
                    document.removeEventListener('mousemove', onDrag);
                    document.removeEventListener('mouseup', onDragEnd);
                    document.removeEventListener('mouseleave', onDragEnd);
                }
            }

            function bindResizeFunctionality() {
                let isResizing = false;
                let resizeEdge = '';
                let startWidth, startHeight;
                let startX, startY;
                let startPanelX, startPanelY;

                panel.addEventListener('mousedown', e => {
                    if (isDragging || e.target.closest('button, input, textarea, select')) {
                        return;
                    }

                    const rect = panel.getBoundingClientRect();
                    const edgeSize = 8;
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    if (x < edgeSize && y < edgeSize) {
                        resizeEdge = 'top-left';
                    } else if (x > rect.width - edgeSize && y < edgeSize) {
                        resizeEdge = 'top-right';
                    } else if (x < edgeSize && y > rect.height - edgeSize) {
                        resizeEdge = 'bottom-left';
                    } else if (x > rect.width - edgeSize && y > rect.height - edgeSize) {
                        resizeEdge = 'bottom-right';
                    } else if (x < edgeSize) {
                        resizeEdge = 'left';
                    } else if (x > rect.width - edgeSize) {
                        resizeEdge = 'right';
                    } else if (y < edgeSize) {
                        resizeEdge = 'top';
                    } else if (y > rect.height - edgeSize) {
                        resizeEdge = 'bottom';
                    } else {
                        return;
                    }

                    isResizing = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    startWidth = rect.width;
                    startHeight = rect.height;
                    startPanelX = rect.left;
                    startPanelY = rect.top;

                    panel.style.transition = 'none';
                    document.addEventListener('mousemove', onResize);
                    document.addEventListener('mouseup', onResizeEnd);
                    document.addEventListener('mouseleave', onResizeEnd);
                });

                panel.addEventListener('mousemove', e => {
                    if (isResizing) return;
                    
                    const rect = panel.getBoundingClientRect();
                    const edgeSize = 8;
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    let cursor = 'default';
                    if (x < edgeSize && y < edgeSize) {
                        cursor = 'nwse-resize';
                    } else if (x > rect.width - edgeSize && y < edgeSize) {
                        cursor = 'nesw-resize';
                    } else if (x < edgeSize && y > rect.height - edgeSize) {
                        cursor = 'nesw-resize';
                    } else if (x > rect.width - edgeSize && y > rect.height - edgeSize) {
                        cursor = 'nwse-resize';
                    } else if (x < edgeSize || x > rect.width - edgeSize) {
                        cursor = 'ew-resize';
                    } else if (y < edgeSize || y > rect.height - edgeSize) {
                        cursor = 'ns-resize';
                    }
                    
                    panel.style.cursor = cursor;
                });

                function onResize(e) {
                    if (!isResizing) return;

                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;

                    let newWidth = startWidth;
                    let newHeight = startHeight;
                    let newX = startPanelX;
                    let newY = startPanelY;

                    const minWidth = 320;
                    const minHeight = 400;
                    const maxWidth = window.innerWidth - 20;
                    const maxHeight = window.innerHeight - 100;

                    if (resizeEdge.includes('right')) {
                        newWidth = startWidth + dx;
                    }
                    if (resizeEdge.includes('bottom')) {
                        newHeight = startHeight + dy;
                    }
                    if (resizeEdge.includes('left')) {
                        newWidth = startWidth - dx;
                        newX = startPanelX + dx;
                    }
                    if (resizeEdge.includes('top')) {
                        newHeight = startHeight - dy;
                        newY = startPanelY + dy;
                    }

                    newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
                    newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));

                    panel.style.width = newWidth + 'px';
                    panel.style.height = newHeight + 'px';
                    
                    if (resizeEdge.includes('left') || resizeEdge.includes('top')) {
                        panel.style.left = newX + 'px';
                        panel.style.top = newY + 'px';
                    }
                }

                function onResizeEnd() {
                    isResizing = false;
                    resizeEdge = '';
                    panel.style.transition = '';
                    document.removeEventListener('mousemove', onResize);
                    document.removeEventListener('mouseup', onResizeEnd);
                    document.removeEventListener('mouseleave', onResizeEnd);
                }
            }

            bindRoleButtons();
            bindToolButtons();
            bindAPIConfig();
            bindSendMessage();
        }

        function bindRoleButtons() {
            panel.querySelectorAll('.ai-role-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const role = btn.dataset.role;
                    
                    panel.querySelectorAll('.ai-role-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    if (aiInstance && role) {
                        try {
                            await aiInstance.switchRole(role);
                            addSystemMessage(`切换为${btn.textContent.trim()}模式`);
                        } catch(err) {
                            console.warn('[AI] 切换角色失败:', err);
                        }
                    }
                });
            });
        }

        function bindToolButtons() {
            panel.querySelectorAll('.ai-tool-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    const actions = {
                        explain: '请详细解释这个知识点的核心概念',
                        question: '请出题检验我的理解',
                        correct: '请帮我检查可能的错误',
                        plan: '请制定学习计划',
                        hint: '给我一个学习提示'
                    };
                    
                    const msg = actions[action];
                    if (msg) {
                        const input = panel.querySelector('#ai-input');
                        if (input) {
                            input.value = msg;
                            handleSend();
                        }
                    }
                });
            });
        }

        function bindAPIConfig() {
            const settingsBtn = panel.querySelector('#ai-settings-btn');
            const configPanel = panel.querySelector('#ai-api-config');
            const configToggle = panel.querySelector('#api-config-toggle');
            const configBody = panel.querySelector('#api-config-body');
            
            if (settingsBtn && configPanel) {
                settingsBtn.addEventListener('click', () => {
                    if (configBody) {
                        configBody.classList.toggle('collapsed');
                        if (configToggle) {
                            configToggle.textContent = configBody.classList.contains('collapsed') ? '+' : '−';
                        }
                    }
                });
            }
            
            if (configToggle && configBody) {
                configToggle.addEventListener('click', () => {
                    configBody.classList.toggle('collapsed');
                    configToggle.textContent = configBody.classList.contains('collapsed') ? '+' : '−';
                });
            }

            const providerSelect = panel.querySelector('#api-provider');
            const apiKeyInput = panel.querySelector('#api-key-input');
            const apiUrlInput = panel.querySelector('#api-url-input');
            const modelSelect = panel.querySelector('#api-model');
            const testBtn = panel.querySelector('#test-api-btn');
            const saveBtn = panel.querySelector('#save-api-btn');
            const clearBtn = panel.querySelector('#clear-api-btn');
            const testResult = panel.querySelector('#api-test-result');
            const togglePwd = panel.querySelector('#toggle-pwd');

            const presets = {
                deepseek: {
                    url: 'https://api.deepseek.com/v1/chat/completions',
                    models: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner']
                },
                openai: {
                    url: 'https://api.openai.com/v1/chat/completions',
                    models: ['gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-3.5-turbo']
                },
                azure: {
                    url: 'https://{resource}.openai.azure.com/openai/deployments/{deployment}/chat/completions?api-version=2024-02-01',
                    models: ['gpt-4', 'gpt-35-turbo']
                },
                anthropic: {
                    url: 'https://api.anthropic.com/v1/messages',
                    models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307']
                },
                ollama: {
                    url: 'http://localhost:11434/api/chat',
                    models: ['llama2', 'mistral', 'codellama', 'neural-chat']
                },
                custom: { url: '', models: [] }
            };

            if (providerSelect) {
                providerSelect.addEventListener('change', () => {
                    const p = providerSelect.value;
                    const preset = presets[p];
                    
                    if (preset && apiUrlInput) {
                        apiUrlInput.value = preset.url;
                        apiUrlInput.placeholder = preset.url;
                    }
                    
                    if (preset && modelSelect) {
                        modelSelect.innerHTML = '';
                        preset.models.forEach(m => {
                            const opt = document.createElement('option');
                            opt.value = m;
                            opt.textContent = m;
                            modelSelect.appendChild(opt);
                        });
                    }
                    
                    updateStatus(p);
                });
            }

            if (togglePwd && apiKeyInput) {
                togglePwd.addEventListener('click', () => {
                    const type = apiKeyInput.type === 'password' ? 'text' : 'password';
                    apiKeyInput.type = type;
                    togglePwd.textContent = type === 'password' ? '👁️' : '🙈';
                });
            }

            if (testBtn) {
                testBtn.addEventListener('click', async () => {
                    await testConnection();
                });
            }

            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    saveConfig();
                });
            }

            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    clearConfig();
                });
            }

            async function testConnection() {
                const key = apiKeyInput ? apiKeyInput.value.trim() : '';
                const url = apiUrlInput ? apiUrlInput.value.trim() : '';
                const provider = providerSelect ? providerSelect.value : 'deepseek';
                const model = modelSelect ? modelSelect.value : 'deepseek-chat';

                if (!key) {
                    showResult('error', '请输入API密钥');
                    return;
                }

                showResult('loading', '正在测试连接...');

                try {
                    let testUrl = url || presets[provider]?.url;
                    let headers = {};
                    let body = {};

                    if (provider === 'anthropic') {
                        headers = {
                            'Content-Type': 'application/json',
                            'x-api-key': key,
                            'anthropic-version': '2023-06-01'
                        };
                        body = { model, max_tokens: 10, messages: [{ role: 'user', content: 'Hi' }] };
                    } else if (provider === 'ollama') {
                        headers = { 'Content-Type': 'application/json' };
                        body = { model: model || 'llama2', stream: false, messages: [{ role: 'user', content: 'Hi' }] };
                        testUrl = url || 'http://localhost:11434/api/chat';
                    } else {
                        headers = {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${key}`
                        };
                        body = { model, max_tokens: 10, messages: [{ role: 'user', content: 'Hi' }] };
                    }

                    const res = await fetch(testUrl, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(body)
                    });

                    if (res.ok) {
                        applyConfig(key, url || presets[provider]?.url, model);
                        saveToStorage(key, url, model);
                        showResult('success', `✅ 连接成功！\n模型：${model}\n\n配置面板将在3秒后收起...`);
                        
                        setTimeout(() => collapseConfig(), 3000);
                    } else {
                        const err = await res.json().catch(() => ({}));
                        throw new Error(`${res.status}: ${err.error?.message || res.statusText}`);
                    }
                } catch(e) {
                    showResult('error', `连接失败\n${e.message}`);
                }
            }

            function saveConfig() {
                const key = apiKeyInput ? apiKeyInput.value.trim() : '';
                const url = apiUrlInput ? apiUrlInput.value.trim() : '';
                const model = modelSelect ? modelSelect.value : 'deepseek-chat';
                const provider = providerSelect ? providerSelect.value : 'deepseek';

                if (!key) {
                    showResult('error', '请输入API密钥');
                    return;
                }

                applyConfig(key, url || presets[provider]?.url, model);
                saveToStorage(key, url, model);
                showResult('success', '✅ 配置已保存\n\n面板将在2秒后收起...');
                
                setTimeout(() => collapseConfig(), 2000);
            }

            function clearConfig() {
                if (apiKeyInput) apiKeyInput.value = '';
                if (apiUrlInput) apiUrlInput.value = '';
                
                localStorage.removeItem('ai_api_key');
                localStorage.removeItem('ai_api_url');
                localStorage.removeItem('ai_api_model');
                
                if (aiInstance) aiInstance.setAPIKey('');
                updateStatus('local');
                showResult('success', '已清除，使用本地模式');
            }

            function collapseConfig() {
                if (configBody && !configBody.classList.contains('collapsed')) {
                    configBody.classList.add('collapsed');
                    if (configToggle) configToggle.textContent = '+';
                    
                    if (settingsBtn) {
                        settingsBtn.innerHTML = '✅';
                        settingsBtn.title = 'API已配置';
                        
                        setTimeout(() => {
                            settingsBtn.innerHTML = '⚙️';
                            settingsBtn.title = 'API设置';
                        }, 3000);
                    }
                }
            }

            function applyConfig(key, url, model) {
                window.AI_API_KEY = key;
                window.AI_API_URL = url;
                window.AI_MODEL = model;

                if (aiInstance) {
                    aiInstance.setAPIKey(key);
                    aiInstance.setApiUrl(url);
                    aiInstance.setModel(model);
                }
            }

            function saveToStorage(key, url, model) {
                try {
                    localStorage.setItem('ai_api_key', key);
                    if (url) localStorage.setItem('ai_api_url', url);
                    localStorage.setItem('ai_api_model', model);
                } catch(e) {
                    console.warn('[AI] 保存失败:', e);
                }
            }

            function loadSavedConfig() {
                try {
                    const key = localStorage.getItem('ai_api_key');
                    const url = localStorage.getItem('ai_api_url');
                    const model = localStorage.getItem('ai_api_model') || 'deepseek-chat';

                    if (key && apiKeyInput) apiKeyInput.value = key;
                    if (url && apiUrlInput) apiUrlInput.value = url;
                    if (model && modelSelect) modelSelect.value = model;

                    if (key) {
                        applyConfig(key, url || presets[providerSelect?.value]?.url, model);
                        console.log('[AI] 已加载保存的配置');
                        
                        setTimeout(() => collapseConfig(), 500);
                    }
                } catch(e) {
                    console.warn('[AI] 加载配置失败:', e);
                }
            }

            function showResult(type, msg) {
                if (!testResult) return;
                testResult.className = `api-test-result show ${type}`;
                testResult.innerHTML = msg.replace(/\n/g, '<br>');
                setTimeout(() => testResult.classList.remove('show'), 4000);
            }

            function updateStatus(provider) {
                const el = panel.querySelector('.status-text');
                if (!el) return;
                const names = { deepseek: 'DeepSeek', openai: 'OpenAI', azure: 'Azure', 
                              anthropic: 'Claude', ollama: '本地', custom: '自定义' };
                el.textContent = names[provider] || '就绪';
            }

            setTimeout(() => { try { loadSavedConfig(); } catch(e) {} }, 500);
        }

        function bindSendMessage() {
            const sendBtn = panel.querySelector('#ai-send');
            const inputField = panel.querySelector('#ai-input');
            
            if (sendBtn && inputField) {
                sendBtn.addEventListener('click', handleSend);
                
                inputField.addEventListener('keydown', e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                });
            }
        }

        function handleSend() {
            const input = panel.querySelector('#ai-input');
            if (!input) return;

            const msg = input.value.trim();
            if (!msg) return;

            input.value = '';

            if (aiInstance) {
                aiInstance.sendMessage(msg).catch(err => {
                    console.error('[AI] 发送失败:', err);
                });
            } else {
                simulateResponse(msg);
            }
        }

        function addSystemMessage(text) {
            const container = panel.querySelector('#ai-messages');
            if (!container) return;

            const div = document.createElement('div');
            div.className = 'ai-message system';
            div.textContent = text;
            container.appendChild(div);
            scrollToBottom(container);
        }

        function simulateResponse(msg) {
            const typingEl = panel.querySelector('#ai-typing');
            if (typingEl) typingEl.classList.add('active');
            
            setTimeout(() => {
                if (typingEl) typingEl.classList.remove('active');
                
                const responses = [
                    `关于这个知识点：\n\n📚 **核心要点**\n这是一个重要的基础概念...\n\n需要我详细展开吗？`,
                    
                    `让我来检验你的理解：\n\n**问题**：${msg.substring(0, 20)}...\n\n请回答这个问题，我会评估你的掌握程度。`,

                    `收到你的问题。作为AI学习助手，我可以：\n• 📖 详细讲解概念\n• ❓ 出题检验理解\n• ✨ 分析错误原因\n• 🎯 制定学习计划\n\n你想尝试哪个功能？`
                ];
                
                const reply = responses[Math.floor(Math.random() * responses.length)];
                
                const container = panel.querySelector('#ai-messages');
                if (container) {
                    const div = document.createElement('div');
                    div.className = 'ai-message ai';
                    div.innerHTML = `<span class="ai-message-role explainer">📖 讲解者</span><div class="ai-message-text">${formatText(reply)}</div>`;
                    container.appendChild(div);
                    scrollToBottom(container);
                }
            }, 800 + Math.random() * 700);
        }

        function formatText(text) {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/`(.*?)`/g, '<code>$1</code>')
                .replace(/\n/g, '<br>');
        }

        function scrollToBottom(el) {
            setTimeout(() => { el.scrollTop = el.scrollHeight; }, 10);
        }

        window.getAIAssistant = () => aiInstance;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
