# -*- coding: utf-8 -*-
"""
Main Builder Script:
Assembles Chapters 1-6 data, builds SQLite database (database/transcripts.db),
exports JSON (database/transcripts.json), creates Markdown documents in transcripts/,
and generates js/transcripts_data.js for the interactive Web Platform.
"""

import os
import sys
import sqlite3
import json
import time

# Ensure scripts dir is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
sys.path.insert(0, CURRENT_DIR)

from chapter1_data import CHAPTER_1
from chapter2_data import CHAPTER_2
from chapter3_data import CHAPTER_3
from chapter4_data import CHAPTER_4
from chapter5_data import CHAPTER_5
from chapter6_data import CHAPTER_6

ALL_CHAPTERS = [CHAPTER_1, CHAPTER_2, CHAPTER_3, CHAPTER_4, CHAPTER_5, CHAPTER_6]

def build_sqlite_db():
    db_path = os.path.join(PROJECT_ROOT, "database", "transcripts.db")
    print(f"Building SQLite database: {db_path}...")
    
    if os.path.exists(db_path):
        os.remove(db_path)
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create chapters table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chapters (
        chapter_id TEXT PRIMARY KEY,
        chapter_num TEXT NOT NULL,
        chapter_title_zh TEXT NOT NULL,
        chapter_title_en TEXT NOT NULL,
        video_count INTEGER NOT NULL
    );
    """)
    
    # Create transcripts table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transcripts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id TEXT UNIQUE NOT NULL,
        chapter_id TEXT NOT NULL,
        chapter_num TEXT NOT NULL,
        chapter_title_zh TEXT NOT NULL,
        chapter_title_en TEXT NOT NULL,
        title_zh TEXT NOT NULL,
        title_en TEXT NOT NULL,
        youtube_url TEXT NOT NULL,
        duration TEXT,
        summary TEXT NOT NULL,
        key_points_json TEXT NOT NULL,
        transcript_zh TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chapter_id) REFERENCES chapters (chapter_id)
    );
    """)
    
    # Create Full-Text Search (FTS5) table for fast searching
    cursor.execute("""
    CREATE VIRTUAL TABLE IF NOT EXISTS transcripts_fts USING fts5(
        video_id,
        title_zh,
        title_en,
        summary,
        transcript_zh,
        content=transcripts,
        content_rowid=id
    );
    """)
    
    total_videos = 0
    for ch in ALL_CHAPTERS:
        cursor.execute("""
        INSERT INTO chapters (chapter_id, chapter_num, chapter_title_zh, chapter_title_en, video_count)
        VALUES (?, ?, ?, ?, ?);
        """, (ch["chapter_id"], ch["chapter_num"], ch["chapter_title_zh"], ch["chapter_title_en"], len(ch["videos"])))
        
        for v in ch["videos"]:
            total_videos += 1
            key_points_str = json.dumps(v["key_points"], ensure_ascii=False)
            cursor.execute("""
            INSERT INTO transcripts (
                video_id, chapter_id, chapter_num, chapter_title_zh, chapter_title_en,
                title_zh, title_en, youtube_url, duration, summary, key_points_json, transcript_zh
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                v["video_id"], ch["chapter_id"], ch["chapter_num"], ch["chapter_title_zh"], ch["chapter_title_en"],
                v["title_zh"], v["title_en"], v["youtube_url"], v["duration"], v["summary"], key_points_str, v["transcript_zh"]
            ))
            
            # Insert into FTS
            cursor.execute("""
            INSERT INTO transcripts_fts (rowid, video_id, title_zh, title_en, summary, transcript_zh)
            VALUES (last_insert_rowid(), ?, ?, ?, ?, ?);
            """, (v["video_id"], v["title_zh"], v["title_en"], v["summary"], v["transcript_zh"]))
            
    conn.commit()
    conn.close()
    print(f"SQLite database built successfully! Total videos inserted: {total_videos}")

def export_json_db():
    json_path = os.path.join(PROJECT_ROOT, "database", "transcripts.json")
    print(f"Exporting JSON database: {json_path}...")
    
    payload = {
        "metadata": {
            "title": "柴油機發電廠技術 46 部工程影片全文逐字稿資料庫",
            "source_video_url": "https://www.youtube.com/watch?v=QDP2PCo0jMM",
            "total_chapters": len(ALL_CHAPTERS),
            "total_videos": sum(len(c["videos"]) for c in ALL_CHAPTERS),
            "exported_at": time.strftime("%Y-%m-%d %H:%M:%S")
        },
        "chapters": ALL_CHAPTERS
    }
    
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(f"JSON database exported successfully! ({os.path.getsize(json_path)} bytes)")

def generate_markdown_transcripts():
    output_dir = os.path.join(PROJECT_ROOT, "transcripts")
    os.makedirs(output_dir, exist_ok=True)
    print(f"Generating Markdown transcripts in: {output_dir}...")
    
    file_map = {
        "chap-layout": "Chapter_1_Diesel_Power_Plant.md",
        "chap-engine-basics": "Chapter_2_Engine_Basics.md",
        "chap-lub-cool": "Chapter_3_Lubrication_and_Cooling.md",
        "chap-gov-ign": "Chapter_4_Ignition_and_Governing.md",
        "chap-combustion": "Chapter_5_Combustion_SI_CI.md",
        "chap-supercharger": "Chapter_6_Supercharging_Turbocharging.md"
    }
    
    for ch in ALL_CHAPTERS:
        filename = file_map.get(ch["chapter_id"], f"{ch['chapter_id']}.md")
        filepath = os.path.join(output_dir, filename)
        
        lines = []
        lines.append(f"# {ch['chapter_num']}: {ch['chapter_title_zh']}")
        lines.append(f"**English Title:** {ch['chapter_title_en']}  ")
        lines.append(f"**收錄影片總數:** {len(ch['videos'])} 部  ")
        lines.append(f"**課程來源:** [https://www.youtube.com/watch?v=QDP2PCo0jMM](https://www.youtube.com/watch?v=QDP2PCo0jMM)\n")
        lines.append("---\n")
        
        for idx, v in enumerate(ch["videos"], 1):
            lines.append(f"## 【第 {idx} 部】{v['title_zh']}")
            lines.append(f"**英文原名:** {v['title_en']}  ")
            lines.append(f"**YouTube 連結:** [{v['youtube_url']}]({v['youtube_url']})  ")
            lines.append(f"**影片時長:** {v['duration']}  \n")
            
            lines.append(f"### 📋 內容概要")
            lines.append(f"{v['summary']}\n")
            
            lines.append(f"### 💡 核心工程技術要點")
            for kp in v["key_points"]:
                lines.append(f"- {kp}")
            lines.append("")
            
            lines.append(f"### 📜 中文全文逐字講義與詳細解說")
            lines.append(f"```text\n{v['transcript_zh']}\n```\n")
            lines.append("---\n")
            
        with open(filepath, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
        print(f"Generated Markdown: {filename}")
        
    # Generate README for database folder
    db_readme = os.path.join(PROJECT_ROOT, "database", "README.md")
    with open(db_readme, "w", encoding="utf-8") as f:
        f.write(f"""# 柴油機發電廠 46 部影片全文逐字稿資料庫 (Transcripts Database)

本資料庫收錄來源影片《Essential Components of Diesel Power Plant》（[https://www.youtube.com/watch?v=QDP2PCo0jMM](https://www.youtube.com/watch?v=QDP2PCo0jMM)）內涵蓋的全部 6 大章節、46 部技術教學影片之完整中文逐字稿講義。

## 檔案說明
- `transcripts.db`: SQLite 3 關係型資料庫，包含 `chapters` 表、`transcripts` 主表，以及 `transcripts_fts` 全文檢索虛擬表（FTS5），支援毫秒級全文檢索。
- `transcripts.json`: 完整的 JSON 格式資料庫，方便前端 Web、Python、Node.js 快速載入。

## 章節分布統計
- **Chapter 1: 柴油發電廠總體佈局與廠址選擇** (2 部影片)
- **Chapter 2: 內燃機基礎原理、分類與循環時序** (12 部影片)
- **Chapter 3: 潤滑與冷卻系統工程深度解析** (16 部影片)
- **Chapter 4: 調速機制與點火控制系統** (8 部影片)
- **Chapter 5: 內燃機燃燒過程與燃燒室設計** (4 部影片)
- **Chapter 6: 機械增壓與渦輪增壓系統技術** (4 部影片)
- **總計：46 部影片全文逐字稿**
""")

def export_js_transcripts():
    js_path = os.path.join(PROJECT_ROOT, "js", "transcripts_data.js")
    print(f"Exporting JS database for Web App: {js_path}...")
    
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("/**\n * Diesel Power Plant 46 Video Full Transcripts Database\n * Auto-generated by scripts/build_all.py\n */\n\n")
        f.write("const FULL_TRANSCRIPTS_DATABASE = ")
        json.dump(ALL_CHAPTERS, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    print(f"JS database exported successfully! ({os.path.getsize(js_path)} bytes)")

if __name__ == "__main__":
    print("=" * 60)
    print("Starting Diesel Power Plant Transcripts Database Build...")
    print("=" * 60)
    build_sqlite_db()
    export_json_db()
    generate_markdown_transcripts()
    export_js_transcripts()
    print("=" * 60)
    print("All tasks finished successfully!")
    print("=" * 60)
