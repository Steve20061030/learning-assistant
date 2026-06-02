#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复 enhanced-ui.js 中的作用域问题
删除 bindDragFunctionality 和 bindResizeFunctionality 函数
"""

file_path = r"c:\Users\Steve\Desktop\日常文件\大一下（一）\个性化学习助手\enhanced-ui.js"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"文件总行数: {len(lines)}")

# 找到需要删除的行范围
start_delete = None
end_delete = None

for i, line in enumerate(lines):
    # 找到 "bindDragFunctionality();" 这一行
    if 'bindDragFunctionality();' in line.strip() and start_delete is None:
        start_delete = i
        print(f"找到开始行 {i+1}: {repr(line)}")
    # 找到 "bindRoleButtons();" 这一行（在 bindEvents 函数内部的）
    if start_delete is not None and line.strip() == 'bindRoleButtons();' and 'function' not in line:
        # 确保这不是 function bindRoleButtons 的那一行
        if i+1 < len(lines) and 'function bindRoleButtons' not in lines[i+1]:
            end_delete = i
            print(f"找到结束行 {i+1}: {repr(line)}")
            break

if start_delete is not None and end_delete is not None:
    print(f"\n删除行 {start_delete+1} 到 {end_delete} (共 {end_delete-start_delete} 行)")
    print(f"\n要删除的代码片段:")
    for i in range(start_delete, end_delete+1):
        print(f"{i+1}: {repr(lines[i])}")
    
    # 构建新内容
    new_lines = []
    for i, line in enumerate(lines):
        if start_delete <= i <= end_delete:
            continue  # 跳过要删除的行
        new_lines.append(line)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"\n✅ 已修复 enhanced-ui.js")
    print(f"删除了 {end_delete - start_delete + 1} 行有问题的代码")
    print(f"新文件总行数: {len(new_lines)}")
else:
    print(f"\n⚠️ 未找到需要删除的代码")
    print(f"start_delete: {start_delete}, end_delete: {end_delete}")
