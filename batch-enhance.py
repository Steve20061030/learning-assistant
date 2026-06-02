import os
import re

def add_enhanced_scripts_to_html(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'enhanced-ui.js' in content:
            return False
        
        if '<link rel="stylesheet" href="detail-styles.css">' in content:
            new_lines = '''    <link rel="stylesheet" href="detail-styles.css">
    <script src="ai-config.js"></script>
    <script src="enhanced-ui.js"></script>'''
            
            content = content.replace(
                '    <link rel="stylesheet" href="detail-styles.css">',
                new_lines
            )
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f'✅ 已更新: {os.path.basename(file_path)}')
            return True
        else:
            return False
            
    except Exception as e:
        print(f'❌ 错误 {file_path}: {e}')
        return False

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    html_files = [f for f in os.listdir(current_dir) if f.endswith('.html')]
    
    exclude_files = [
        'index.html',
        'ai-assistant.html',
        'templates/index.html'
    ]
    
    updated_count = 0
    for html_file in html_files:
        if html_file not in exclude_files:
            file_path = os.path.join(current_dir, html_file)
            if add_enhanced_scripts_to_html(file_path):
                updated_count += 1
    
    print(f'\n🎉 完成！共更新 {updated_count} 个文件')

if __name__ == '__main__':
    main()
