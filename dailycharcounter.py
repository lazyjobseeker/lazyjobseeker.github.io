from pathlib import Path
import json
import datetime
import re

POST_DIR_KR = Path("_posts")
POST_DIR_EN = Path("en/_posts")

OUT_KR = Path("dailycharcounter_kr.json")
OUT_EN = Path("dailycharcounter_en.json")

def remove_code_blocks(content):
    # Remove code blocks (```...```)
    content = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
    # Remove inline code (`...`)
    content = re.sub(r'`.*?`', '', content)
    return content

def count_characters_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        # Remove YAML front matter
        content = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)
        content = remove_code_blocks(content)
        return len(content)
    
total_char_count_kr = 0
total_char_count_en = 0

for post_file in POST_DIR_KR.glob("*.md"):
    char_count = count_characters_in_file(post_file)
    total_char_count_kr += char_count

for post_file in POST_DIR_EN.glob("*.md"):
    char_count = count_characters_in_file(post_file)
    total_char_count_en += char_count

data_kr = {}
if OUT_KR.exists():
    with open(OUT_KR, 'r', encoding='utf-8') as f:
        data_kr = json.loads(OUT_KR.read_text(encoding='utf-8'))

data_en = {}
if OUT_EN.exists():
    with open(OUT_EN, 'r', encoding='utf-8') as f:
        data_en = json.loads(OUT_EN.read_text(encoding='utf-8'))

# Update the data with today's counts
today = datetime.date.today().isoformat()
data_kr[today] = total_char_count_kr
data_en[today] = total_char_count_en

# Write updated data back to files
with open(OUT_KR, 'w', encoding='utf-8') as f:
    json.dump(data_kr, f, ensure_ascii=False, indent=2)

with open(OUT_EN, 'w', encoding='utf-8') as f:
    json.dump(data_en, f, ensure_ascii=False, indent=2)
