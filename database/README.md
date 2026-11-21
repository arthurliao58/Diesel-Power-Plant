# 柴油機發電廠 46 部影片全文逐字稿資料庫 (Transcripts Database)

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
