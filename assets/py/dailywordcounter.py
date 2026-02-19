from pathlib import Path
import json
import datetime
import re

POST_DIR_KR = Path("_posts")
POST_DIR_EN = Path("en/_posts")

OUT_KR = Path("../json/dailywordcounter_kr.json")
OUT_EN = Path("../json/dailywordcounter_en.json")

def remove_code_blocks(content):
    # Remove code blocks (```...```)
    content = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
    # Remove inline code (`...`)
    content = re.sub(r'`.*?`', '', content)
    return content

def count_words_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        # Remove YAML front matter
        content = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)
        content = remove_code_blocks(content)
        return len(re.findall(r"\b\w+\b", content))
    
total_word_count_kr = 0
total_word_count_en = 0

for post_file in POST_DIR_KR.glob("*.md"):
    word_count = count_words_in_file(post_file)
    print(f"{post_file.name}: {word_count} words")
    total_word_count_kr += word_count

print(f"Total Korean word count: {total_word_count_kr}")

for post_file in POST_DIR_EN.glob("*.md"):
    word_count = count_words_in_file(post_file)
    print(f"{post_file.name}: {word_count} words")
    total_word_count_en += word_count

print(f"Total English word count: {total_word_count_en}")

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

filtered_kr = {
    date: value
    for date, value in data_kr.items()
    if date < today
}

filtered_en = {
    date: value
    for date, value in data_en.items()
    if date < today
}

data_kr[today] = total_word_count_kr - sum(filtered_kr.values())
data_en[today] = total_word_count_en - sum(filtered_en.values())

# Write updated data back to files
with open(OUT_KR, 'w', encoding='utf-8') as f:
    json.dump(data_kr, f, ensure_ascii=False, indent=2)

with open(OUT_EN, 'w', encoding='utf-8') as f:
    json.dump(data_en, f, ensure_ascii=False, indent=2)
