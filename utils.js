// 学习助手 - 公共JavaScript文件

// 习题解析切换函数
function toggleAnalysis(buttonId, contentId) {
    try {
        const btn = document.getElementById(buttonId);
        const content = document.getElementById(contentId);
        
        if (!btn || !content) {
            console.warn('toggleAnalysis: 找不到指定的元素');
            return;
        }
        
        if (content.classList.contains('show')) {
            content.classList.remove('show');
            btn.classList.remove('active');
        } else {
            content.classList.add('show');
            btn.classList.add('active');
        }
    } catch (error) {
        console.error('toggleAnalysis error:', error);
    }
}

// 打开详情页函数
function openDetailPage(name) {
    try {
        const pageMap = {
            '线性回归': 'linear-regression.html',
            '逻辑回归': 'logistic-regression.html',
            '神经网络': 'neural-network.html',
            '动态规划': 'dynamic-programming.html',
            'KNN': 'knn.html',
            'K-Means': 'kmeans.html',
            '决策树': 'decision-tree.html',
            'SVM': 'svm.html',
            'CNN': 'cnn.html',
            'RNN': 'rnn.html',
            'LSTM': 'lstm.html',
            'GRU': 'gru.html',
            'Attention': 'attention.html',
            'Transformer': 'transformer.html',
            '多项式回归': 'polynomial-regression.html',
            '朴素贝叶斯': 'naive-bayes.html',
            'PCA': 'pca.html',
            '随机森林': 'random-forest.html',
            'Ridge回归': 'ridge-regression.html',
            'Lasso回归': 'lasso-regression.html',
            '深度学习': 'deep-learning.html',
            '栈和队列': 'stack-queue.html',
            '链表': 'linked-list.html',
            '树结构': 'tree-structure.html',
            '排序算法': 'sorting-algorithms.html',
            '查找算法': 'search-algorithms.html',
            '图算法': 'graph-algorithms.html',
            '贪心算法': 'greedy-algorithm.html',
            '复杂度分析': 'complexity-analysis.html',
            '集合论': 'set-theory.html',
            '命题逻辑': 'propositional-logic.html',
            '谓词逻辑': 'predicate-logic.html',
            '图论': 'graph-theory.html',
            '信息表示': 'information-representation.html',
            '浮点数': 'floating-point.html',
            'XGBoost': 'xgboost.html',
            'LightGBM': 'lightgbm.html',
            'AdaBoost': 'adaboost.html',
            'BERT': 'bert.html',
            'SVR': 'svr.html',
            'DBSCAN': 'dbscan.html',
            '回溯算法': 'backtracking.html',
            '分治法': 'divide-and-conquer.html',
            'Softmax回归': 'softmax-regression.html',
            't-SNE': 'tsne.html'
        };
        
        const page = pageMap[name];
        if (page) {
            window.location.href = page;
        } else {
            console.warn(`openDetailPage: 未找到页面映射: ${name}`);
        }
    } catch (error) {
        console.error('openDetailPage error:', error);
    }
}

// 学习笔记功能
const NotesManager = (function() {
    let notes = [];
    
    function loadNotes() {
        try {
            const saved = localStorage.getItem('learningNotes');
            notes = saved ? JSON.parse(saved) : [];
            return notes;
        } catch (error) {
            console.error('loadNotes error:', error);
            return [];
        }
    }
    
    function saveNotes() {
        try {
            localStorage.setItem('learningNotes', JSON.stringify(notes));
        } catch (error) {
            console.error('saveNotes error:', error);
        }
    }
    
    function addNote(title, content) {
        try {
            if (!title.trim()) {
                alert('请输入笔记标题');
                return false;
            }
            
            notes.push({
                id: Date.now(),
                title,
                content,
                time: new Date().toLocaleString()
            });
            
            saveNotes();
            return true;
        } catch (error) {
            console.error('addNote error:', error);
            return false;
        }
    }
    
    function deleteNote(id) {
        try {
            notes = notes.filter(note => note.id !== id);
            saveNotes();
            return true;
        } catch (error) {
            console.error('deleteNote error:', error);
            return false;
        }
    }
    
    function searchNotes(keyword) {
        try {
            if (!keyword) return notes;
            const lowerKeyword = keyword.toLowerCase();
            return notes.filter(note => 
                note.title.toLowerCase().includes(lowerKeyword) || 
                note.content.toLowerCase().includes(lowerKeyword)
            );
        } catch (error) {
            console.error('searchNotes error:', error);
            return notes;
        }
    }
    
    function getNotes() {
        return notes;
    }
    
    return {
        loadNotes,
        saveNotes,
        addNote,
        deleteNote,
        searchNotes,
        getNotes
    };
})();

// AI聊天功能
const AIChat = (function() {
    const replies = [
        '这是一个很好的问题！让我为你详细解答...',
        '我来帮你分析这个概念。首先，我们需要理解...',
        '这个知识点确实很重要，让我从基础开始讲起...',
        '好的，我来为你解释一下这个问题的关键点...',
        '这个问题涉及到多个方面，让我逐一为你说明...',
        '理解这个概念需要从几个角度入手。首先...',
        '这个问题的核心在于...让我详细解释一下。',
        '很好的问题！这个概念的本质是...'
    ];
    
    function getRandomReply() {
        return replies[Math.floor(Math.random() * replies.length)];
    }
    
    function sendMessage(message, containerId) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn('sendMessage: 找不到消息容器');
                return;
            }
            
            // 添加用户消息
            const userMessage = document.createElement('div');
            userMessage.className = 'ai-message ai-message-user';
            userMessage.innerHTML = `<strong>你：</strong>${message}`;
            container.appendChild(userMessage);
            
            // 模拟AI回复
            setTimeout(() => {
                const botMessage = document.createElement('div');
                botMessage.className = 'ai-message ai-message-bot';
                botMessage.innerHTML = `<strong>🤖 AI助手：</strong>${getRandomReply()}`;
                container.appendChild(botMessage);
                container.scrollTop = container.scrollHeight;
            }, 800);
            
            container.scrollTop = container.scrollHeight;
        } catch (error) {
            console.error('sendMessage error:', error);
        }
    }
    
    return {
        sendMessage
    };
})();

// Canvas绘制工具函数
const CanvasUtils = (function() {
    function drawNode(ctx, x, y, width, height, text, color) {
        try {
            ctx.fillStyle = color;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x - width / 2, y - height / 2, width, height, 10);
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Noto Sans SC';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, x, y);
        } catch (error) {
            console.error('drawNode error:', error);
        }
    }
    
    function drawEdge(ctx, x1, y1, x2, y2, color) {
        try {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        } catch (error) {
            console.error('drawEdge error:', error);
        }
    }
    
    function resizeCanvas(canvas) {
        try {
            const parent = canvas.parentElement;
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        } catch (error) {
            console.error('resizeCanvas error:', error);
        }
    }
    
    return {
        drawNode,
        drawEdge,
        resizeCanvas
    };
})();

// DOM工具函数
const DOMUtils = (function() {
    function showModal(modalId) {
        try {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
            }
        } catch (error) {
            console.error('showModal error:', error);
        }
    }
    
    function closeModal(modalId) {
        try {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
            }
        } catch (error) {
            console.error('closeModal error:', error);
        }
    }
    
    function clearInput(inputId) {
        try {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = '';
            }
        } catch (error) {
            console.error('clearInput error:', error);
        }
    }
    
    function addEventListeners(listeners) {
        try {
            listeners.forEach(listener => {
                const element = document.getElementById(listener.id);
                if (element) {
                    element.addEventListener(listener.event, listener.callback);
                }
            });
        } catch (error) {
            console.error('addEventListeners error:', error);
        }
    }
    
    return {
        showModal,
        closeModal,
        clearInput,
        addEventListeners
    };
})();

// 错误边界处理
const ErrorBoundary = (function() {
    function init() {
        // 全局错误处理
        window.addEventListener('error', handleError);
        
        // Promise rejection处理
        window.addEventListener('unhandledrejection', handleRejection);
        
        console.log('ErrorBoundary initialized');
    }
    
    function handleError(event) {
        console.error('Global error:', event.error);
        
        // 显示友好的错误提示
        showErrorMessage(event.error.message);
    }
    
    function handleRejection(event) {
        console.error('Unhandled rejection:', event.reason);
        
        // 显示友好的错误提示
        showErrorMessage(event.reason.message || '未知错误');
    }
    
    function showErrorMessage(message) {
        try {
            const existingToast = document.getElementById('error-toast');
            if (existingToast) {
                existingToast.remove();
            }
            
            const toast = document.createElement('div');
            toast.id = 'error-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(220, 100, 100, 0.9);
                color: #fff;
                padding: 15px 30px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(220, 100, 100, 0.3);
                z-index: 10000;
                font-size: 14px;
                animation: slideUp 0.3s ease-out;
            `;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideDown 0.3s ease-out';
                setTimeout(() => toast.remove(), 300);
            }, 5000);
        } catch (error) {
            console.error('showErrorMessage error:', error);
        }
    }
    
    function wrapFunction(fn, context) {
        return function(...args) {
            try {
                return fn.apply(context, args);
            } catch (error) {
                console.error(`Error in ${fn.name}:`, error);
                showErrorMessage(`执行出错: ${error.message}`);
                return null;
            }
        };
    }
    
    return {
        init,
        handleError,
        handleRejection,
        showErrorMessage,
        wrapFunction
    };
})();

// 添加全局样式
(function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        @keyframes slideDown {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
        }
    `;
    document.head.appendChild(style);
})();

// 页面加载完成后初始化错误边界
document.addEventListener('DOMContentLoaded', function() {
    ErrorBoundary.init();
});
