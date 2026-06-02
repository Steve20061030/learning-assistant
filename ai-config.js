window.AI_CONFIG = {
    api: {
        provider: 'openai',
        apiKey: '',
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4'
    }
};

function configureAI(options = {}) {
    if (options.apiKey) window.AI_CONFIG.api.apiKey = options.apiKey;
    if (options.provider) window.AI_CONFIG.api.provider = options.provider;
    if (options.model) window.AI_CONFIG.api.model = options.model;
    if (options.apiUrl) window.AI_CONFIG.api.apiUrl = options.apiUrl;
    
    window.AI_API_KEY = window.AI_CONFIG.api.apiKey;
    window.AI_API_URL = window.AI_CONFIG.api.apiUrl;
    window.AI_MODEL = window.AI_CONFIG.api.model;

    console.log('✅ AI配置已更新:', { provider: options.provider, model: options.model });
}

console.log('📋 AI学习助手配置已加载');
console.log('💡 使用 configureAI({apiKey: "your-key"}) 设置API密钥');
