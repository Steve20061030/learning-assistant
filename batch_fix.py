#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量修复所有详情页，添加 ai-engine.js 引用
"""

import os
import re

# 获取文件所在目录
base_dir = r"c:\Users\Steve\Desktop\日常文件\大一下（一）\个性化学习助手"

# 需要修改的HTML文件列表
html_files = [
    "ai-assistant.html",
    "course_details.html",
    "index.html",
    "adaboost.html",
    "attention.html",
    "backtracking.html",
    "bert.html",
    "cnn.html",
    "complexity-analysis.html",
    "dbscan.html",
    "decision-tree.html",
    "deep-learning.html",
    "divide-and-conquer.html",
    "dynamic-programming.html",
    "floating-point.html",
    "graph-algorithms.html",
    "graph-theory.html",
    "greedy-algorithm.html",
    "gru.html",
    "information-representation.html",
    "kmeans.html",
    "knn.html",
    "knowledge_graph.html",
    "lasso-regression.html",
    "lightgbm.html",
    "linear-regression.html",
    "linked-list.html",
    "logistic-regression.html",
    "lstm.html",
    "naive-bayes.html",
    "neural-network.html",
    "pca.html",
    "polynomial-regression.html",
    "predicate-logic.html",
    "propositional-logic.html",
    "random-forest.html",
    "ridge-regression.html",
    "rnn.html",
    "search-algorithms.html",
    "set-theory.html",
    "softmax-regression.html",
    "sorting-algorithms.html",
    "stack-queue.html",
    "svm.html",
    "svr.html",
    "transformer.html",
    "tree-structure.html",
    "tsne.html",
    "xgboost.html",
]

# 计数
modified_count = 0
error_count = 0

for filename in html_files:
    filepath = os.path.join(base_dir, filename)
    
    if not os.path.exists(filepath):
        continue
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否已经有 ai-engine.js 引用
        if 'ai-engine.js' in content:
            print(f"✅ {filename} - 已有 ai-engine.js")
            continue
        
        # 检查是否有 enhanced-ui.js
        if 'enhanced-ui.js' in content:
            # 在 enhanced-ui.js 之前添加 ai-engine.js
            new_content = content.replace(
                '<script src="ai-config.js"></script>\n    <script src="enhanced-ui.js"></script>',
                '<script src="ai-config.js"></script>\n    <script src="ai-engine.js"></script>\n    <script src="enhanced-ui.js"></script>'
            )
            
            # 如果上面的模式不匹配，尝试另一种
            if new_content == content:
                new_content = content.replace(
                    '<script src="enhanced-ui.js"></script>',
                    '<script src="ai-engine.js"></script>\n    <script src="enhanced-ui.js"></script>'
                )
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"✅ {filename} - 已添加 ai-engine.js")
                modified_count += 1
            else:
                print(f"⚠️ {filename} - 未能匹配模式")
        else:
            print(f"⚠️ {filename} - 没有 enhanced-ui.js")
            
    except Exception as e:
        print(f"❌ {filename} - 错误: {e}")
        error_count += 1

print(f"\n✅ 完成！修改了 {modified_count} 个文件，{error_count} 个错误")
