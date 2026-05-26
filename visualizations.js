let vizParams = {};
let currentTopic = null;

function drawVisualization() {
    const canvas = document.getElementById('vizCanvas');
    if (!canvas || !currentTopic) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 350;
    
    const detail = topicDetails[currentTopic];
    if (!detail) return;
    
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    switch(detail.vizType) {
        case 'regression': drawRegression(ctx, canvas.width, canvas.height); break;
        case 'sigmoid': drawSigmoid(ctx, canvas.width, canvas.height); break;
        case 'knn': drawKNN(ctx, canvas.width, canvas.height); break;
        default: drawDefault(ctx, canvas.width, canvas.height);
    }
}

function drawRegression(ctx, w, h) {
    const slope = vizParams['slope'] || 1;
    const intercept = vizParams['intercept'] || 0;
    const noise = vizParams['noise'] || 0.5;
    const samples = Math.floor(vizParams['samples']) || 30;
    
    const points = [];
    for (let i = 0; i < samples; i++) {
        const x = 50 + (i / (samples - 1)) * (w - 100);
        const y_true = h/2 - (x - w/2) * slope * 2 + intercept * 20;
        const y_noise = (Math.random() - 0.5) * noise * 80;
        points.push({ x, y: y_true + y_noise, cls: Math.random() > 0.5 ? 0 : 1 });
    }
    
    ctx.strokeStyle = '#40c0e0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, h/2 - (50 - w/2) * slope * 2 + intercept * 20);
    ctx.lineTo(w-50, h/2 - (w-50 - w/2) * slope * 2 + intercept * 20);
    ctx.stroke();
    
    points.forEach(p => {
        ctx.fillStyle = p.cls === 0 ? '#60c0a0' : '#e060a0';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
    });
    
    updateMetrics({
        1: slope.toFixed(2),
        2: intercept.toFixed(2),
        3: '拟合'
    });
}

function drawSigmoid(ctx, w, h) {
    const weight = vizParams['weight'] || 1;
    const bias = vizParams['bias'] || 0;
    
    ctx.strokeStyle = '#40c0e0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
        const z = (x - w/2) / (w/6) * weight + bias;
        const y = h - h / (1 + Math.exp(-z));
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(100,140,180,0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5,5]);
    ctx.beginPath();
    ctx.moveTo(w/2, 0);
    ctx.lineTo(w/2, h);
    ctx.moveTo(0, h/2);
    ctx.lineTo(w, h/2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    updateMetrics({
        1: '0.50',
        2: weight.toFixed(2),
        3: '分类'
    });
}

function drawKNN(ctx, w, h) {
    const k = Math.floor(vizParams['k']) || 5;
    const n = Math.floor(vizParams['samples']) || 30;
    const classes = Math.floor(vizParams['classes']) || 2;
    const noise = vizParams['noise'] || 0.2;
    
    const points = [];
    for (let i = 0; i < n; i++) {
        points.push({
            x: Math.random() * (w - 100) + 50,
            y: Math.random() * (h - 100) + 50,
            cls: Math.floor(Math.random() * classes)
        });
    }
    
    const targetX = w/2;
    const targetY = h/2;
    
    const distances = points.map(p => ({
        ...p,
        dist: Math.sqrt((p.x - targetX) * (p.x - targetX) + (p.y - targetY) * (p.y - targetY))
    })).sort((a, b) => a.dist - b.dist);
    
    points.forEach(p => {
        const colors = ['#60c0a0', '#e060a0', '#60c0f0', '#a080e0'];
        ctx.fillStyle = colors[p.cls % colors.length];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fill();
    });
    
    distances.slice(0, k).forEach(p => {
        ctx.strokeStyle = '#40c0e0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    });
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#40c0e0';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    updateMetrics({
        1: k,
        2: distances[0]?.dist.toFixed(1) || '-',
        3: '搜索'
    });
}

function drawDefault(ctx, w, h) {
    ctx.fillStyle = '#40c0e0';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('可视化演示区域', w/2, h/2);
    ctx.font = '14px Arial';
    ctx.fillText('调整滑块查看动态效果', w/2, h/2 + 30);
    ctx.textAlign = 'left';
}

function updateMetrics(metrics) {
    const m1 = document.getElementById('metric-1');
    const m2 = document.getElementById('metric-2');
    const m3 = document.getElementById('metric-3');
    if (m1) m1.textContent = metrics[1] || '-';
    if (m2) m2.textContent = metrics[2] || '-';
    if (m3) m3.textContent = metrics[3] || '运行中';
}
