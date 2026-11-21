# 柴油機發電廠技術互動學習平台 (Diesel Power Plant Interactive Learning Hub)

本專案是一個現代化、模組化、高互動性的柴油發電廠工程技術學習平台。內容全數源自並完整擴充 YouTube 權威機械工程教學影片 **《Essential Components of Diesel Power Plant / Layout of Diesel Power Plant》**（影片來源：[https://www.youtube.com/watch?v=QDP2PCo0jMM](https://www.youtube.com/watch?v=QDP2PCo0jMM)），並完整整合其描述欄所屬的 **6 大核心章節與 46 部工程影片**。

---

## 🌟 核心功能特色

### 1. 互動式電廠系統佈局與管路流向模擬圖 (Interactive Plant Layout Explorer)
- **視覺化 SVG 動態架構**：精準呈現電廠 9 大系統（柴油引擎主機、燃油供應系統、進氣與增壓系統、排氣與消音系統、水套冷卻塔系統、機油潤滑系統、壓縮空氣啟停系統、調速器系統、交流同步發電機與主變壓電網）。
- **9 大子系統滑鼠自由拖曳**：支援使用滑鼠/觸控任意拖曳改變圖中任一設備位置，所有關聯的動態管路（燃油、進氣、排氣、冷卻水、機油、啟動氣、發電機聯軸器）會實時自動彈性動態追蹤拉伸！支援點擊「重設佈局位置」一鍵平滑復原，並可自動儲存自訂佈局位置。
- **圖中字型大小自行調整**：工具列內建字型縮放滑桿（70% 至 180%）、`+` / `-` 微調按鈕與 `100%` 快速重設按鈕，所有 SVG 文字即時等比縮放，並自動保存至瀏覽器 `localStorage`。
- **46 篇逐字稿全面對應**：每個電廠組件節點均標記對應的逐字稿篇數標籤（如 `📚 9篇技術逐字稿`）。點擊任一設備組件，右側詳解抽屜立即列出所有關聯的專題課程，提供「📜 閱讀逐字稿」與「▶️ 播放影片」快捷按鈕。
- **粒子流動動畫切換**：可即時開啟/關閉燃油流、進/排氣流、冷卻水循環流、潤滑油循環流以及電能輸出流的動畫路徑。
- **點擊探勘工程詳解**：點擊圖中任意設備組件，立即展開設備工程原理、典型工業運轉指標（如噴射壓力、壓縮比、水溫、油壓等），並可直接點擊按鈕彈窗播放對應的 3D 動畫教學影片。

### 2. 完整章節與 46 部影片學習中心 (Complete 6-Chapter Video Library)
完整收錄並中英雙語對照來源影片所屬課程體系的全部 46 部 YouTube 影片：
1. **Chapter 1: 柴油發電廠總體佈局與廠址選擇** (包含核心影片 `QDP2PCo0jMM` 與廠址選定分析)
2. **Chapter 2: 內燃機基礎原理、分類與循環時序** (12 部影片，涵蓋四衝程/二衝程、S.I. vs C.I.、氣門時序圖等)
3. **Chapter 3: 潤滑與冷卻系統工程深度解析** (16 部影片，涵蓋乾式/濕式油底殼、熱虹吸、恆溫器強制循環、加壓冷卻等)
4. **Chapter 4: 調速機制與點火控制系統** (8 部影片，涵蓋品質調節、數量調節、飛輪 vs 調速器、發火順序等)
5. **Chapter 5: 內燃機燃燒過程與燃燒室設計** (4 部影片，涵蓋壓燃四階段、直噴 DI vs 間接噴射 IDI)
6. **Chapter 6: 機械增壓與渦輪增壓系統技術** (4 部影片，涵蓋廢氣渦輪增壓、中冷器、增壓目標與排氣回收)
- 具備即時關鍵字搜尋過濾功能。
- 支援「標記為已學」進度保存（存於瀏覽器 LocalStorage）。
- 內建響應式 YouTube 播放彈窗，免跳轉直接學習。

### 3. 機組運轉與熱平衡動態模擬實驗室 (Operating Parameters Simulation Lab)
- **多變數動態調控**：即時滑動調整電網負載需求 (kW)、渦輪增壓壓力 (bar)、進氣環境溫度 (°C) 及調速器下垂率 (Droop %)。
- **熱力學即時解算儀表**：
  - 電網頻率 (Hz) 與實際轉速 (RPM)（受下垂率與負載反饋影響）
  - 發電機組制動熱效率 (%) 與比燃油消耗率 BSFC (g/kWh)
  - 柴油每小時消耗量 (L/h 及 kg/h)
  - 排氣總管廢氣溫度 (°C)
  - 氣缸套冷卻水出水溫度 (°C)
  - 主軸承潤滑機油壓力 (bar)
- **突發事件模擬**：提供「突加 400 kW 負載」、「突卸 400 kW 負載」及「緊急跳脫停機 (E-Trip)」演練。

### 4. 核心工程技術手冊 (Engineering Knowledge Base)
- 手風琴式技術專題，詳細說明狄塞爾定壓燃燒循環、高壓共軌 CRDI 噴射技術、速度下垂率公式及電廠能量熱平衡分配。

### 5. 課後自我評測模組 (Interactive Quiz & Assessment)
- 涵蓋各章節關鍵工程觀念的多選測驗。
- 即時判定對錯並附帶詳盡工程原理回饋解析，隨時重測。

---

## 🚀 快速啟動方式

### 方法 A：直接透過瀏覽器開啟（最簡單）
直接使用任何現代瀏覽器（Google Chrome, Microsoft Edge, Safari, Firefox）雙擊打開專案目錄下的：
```
index.html
```

### 方法 B：透過內建 Python 伺服器啟動（推薦）
1. 在 Windows 檔案總管中雙擊執行 `start_server.bat`，或在終端機中執行：
```bash
python server.py
```
2. 系統將自動在瀏覽器中開啟：[http://localhost:8000/index.html](http://localhost:8000/index.html)

---

## 📁 專案檔案結構

```
c:\Project\Diesel Power Plant\
│
├── index.html            # 主學習平台頁面 (Single Page Application)
├── server.py             # 本地輕量化 Python HTTP 伺服器
├── start_server.bat      # Windows 雙擊啟動腳本
├── README.md             # 專案詳細說明與架構手冊
│
├── css\
│   └── style.css         # 工業科技深色樣式、圖表字型縮放、雙向導航與響應式佈局
│
├── js\
│   ├── data.js           # 9大組件與46部影片雙向關聯、測驗題目
│   ├── diagram.js        # 互動式 SVG 電廠圖、字型等比縮放滑桿、管路粒子與節點
│   ├── transcripts_data.js # 46篇完整中文逐字稿資料庫 (FULL_TRANSCRIPTS_DATABASE)
│   ├── simulator.js      # 機組運轉與熱平衡動態模擬器邏輯
│   ├── quiz.js           # 課後評測模組與答題評分邏輯
│   └── app.js            # 主控制器、圖文雙向定位、影片播放與搜尋管理
│
├── database\
│   ├── transcripts.db    # SQLite 關聯資料庫（包含 chapters 與 videos 兩張資料表）
│   └── transcripts.json  # 結構化 JSON 逐字稿資料庫
│
└── transcripts\          # 依章節分類的 6 大 Markdown 講義全文檔案
```
