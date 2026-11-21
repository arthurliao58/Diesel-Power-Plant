/**
 * Diesel Power Plant Interactive Learning Platform
 * Master Data: Chapters, Videos, Technical Components & Quiz Questions
 */

const PLANT_COMPONENTS = [
  {
    id: "engine",
    nameZh: "柴油引擎 (主驅動機)",
    nameEn: "Diesel Engine (Prime Mover)",
    category: "動力核心",
    icon: "fa-cogs",
    summary: "柴油發電廠的心臟，將柴油燃料的化學能轉化為高壓高溫燃燒氣體，推動活塞作功轉化為機械旋轉動力。",
    details: [
      "採用壓燃式循環（Compression Ignition, C.I.），無需火星塞，靠高壓縮比（通常在 14:1 至 22:1）使缸內空氣升溫至燃點以上。",
      "發電廠多採用四衝程中速或大型二衝程低速重型柴油機，具備熱效率高（可達 40%~45% 以上）、啟動迅速（數分鐘內可併網運轉）等優勢。",
      "缸體由氣缸套、活塞、連桿、曲軸、進排氣閥門及飛輪等精密部件構成。"
    ],
    operatingSpecs: {
      "常用熱效率": "40% - 46%",
      "壓縮比": "14:1 - 20:1",
      "常用轉速 (中速機)": "750 - 1500 RPM",
      "啟動至滿載時間": "5 - 15 分鐘"
    },
    relatedVideoId: "QDP2PCo0jMM",
    relatedVideoIds: [
      "QDP2PCo0jMM", "G9vjrVszunc", "0x67uVtqFqw", "9rTYXPJULkQ",
      "RM0A1kQuXI4", "4XJbaurVizs", "orcm9bfs88w", "EuC0qQCI6Uc",
      "31lrsp77ym0"
    ]
  },
  {
    id: "fuel_system",
    nameZh: "燃油供應系統",
    nameEn: "Fuel Supply & Injection Combustion System",
    category: "燃燒介質",
    icon: "fa-gas-pump",
    summary: "儲存、淨化、加壓並以極高精度將柴油霧化噴入氣缸燃燒室。",
    details: [
      "主流程：主儲油槽 (Main Storage Tank) ➔ 燃油輸送泵 (Transfer Pump) ➔ 初級/精細過濾器 (Strainers & Filters) ➔ 日用油箱 (Day Tank, 提供 6-8 小時緩衝容量) ➔ 高壓噴油泵 (Injection Pump) ➔ 噴油嘴 (Fuel Injector)。",
      "噴射壓力高達數百至上千 bar，確保微米級霧化顆粒與高溫壓縮空氣充分均勻混合，達成完全燃燒。",
      "系統配備溢流回油管路，將未噴射的多餘柴油與冷卻油導回日用油箱。"
    ],
    operatingSpecs: {
      "噴射壓力": "200 - 2000 bar",
      "日用油箱儲量": "連續全載 8 小時",
      "過濾精度": "5 - 10 微米 (μm)",
      "燃料消耗率 (SFC)": "約 190 - 215 g/kWh"
    },
    relatedVideoId: "QDP2PCo0jMM",
    relatedVideoIds: [
      "QDP2PCo0jMM", "E_fR6jOpxN4", "8iBLAAJR298", "_Ko0jJsQWxA",
      "ce20BQvNIZw", "tXILRLLgVwo", "GR0oI5sDCww"
    ]
  },
  {
    id: "air_intake",
    nameZh: "進氣與增壓系統",
    nameEn: "Air Intake & Supercharging System",
    category: "助燃系統",
    icon: "fa-wind",
    summary: "提供大量潔淨、低溫且高密度的氧氣給氣缸，是決定發電廠燃燒效率與功率密度的關鍵。",
    details: [
      "空氣濾清器 (Air Filter)：過濾環境塵埃與懸浮顆粒，防止氣缸套、活塞環磨損（常採乾式或油浸式過濾器）。",
      "渦輪增壓器 (Turbocharger) 或機械增壓器 (Supercharger)：利用排氣廢氣驅動渦輪帶動壓氣機，大幅提升進氣歧管壓力。",
      "中冷器 (Intercooler / Aftercooler)：降低增壓後壓縮空氣溫度，提高空氣密度與充氣效率（充量係數），降低爆震風險與排氣溫度。"
    ],
    operatingSpecs: {
      "增壓比": "1.5 - 3.5 bar",
      "進氣濾清效率": "> 99.5%",
      "中冷後溫度": "40°C - 55°C",
      "功率增益": "+30% 至 +60%"
    },
    relatedVideoId: "Fg_-XDKppg4",
    relatedVideoIds: [
      "Fg_-XDKppg4", "Q2axT3wAXv4", "nXnH_DzO53Y", "FSbydOPAAF4", "hfKTh7GkVME"
    ]
  },
  {
    id: "exhaust_system",
    nameZh: "排氣與消音系統",
    nameEn: "Exhaust & Silencer System",
    category: "排放控制",
    icon: "fa-smog",
    summary: "將高溫燃燒廢氣安全、低阻力、低噪音地導向大氣，並通常配備廢熱回收裝置。",
    details: [
      "排氣歧管 (Manifold)：收集各氣缸燃燒後的廢氣，導向渦輪增壓器渦輪端。",
      "消音器 (Silencer/Muffler)：柴油機排氣脈衝極具破壞性，消音器可有效降低聲壓級（降噪 20-30 dB 以上）。",
      "煙囪與排氣管 (Exhaust Stack)：具有足夠高度以利擴散，並加裝膨脹節 (Expansion Bellows) 吸收熱膨脹。",
      "廢熱回收鍋爐 (WHRB)：在汽電共生 (CHP) 電廠中回收排氣廢熱產生蒸汽或熱水，提升總熱效率至 80% 以上。"
    ],
    operatingSpecs: {
      "排氣溫度 (渦輪前)": "500°C - 650°C",
      "消音降噪量": "25 - 35 dB(A)",
      "背壓限制": "< 300 - 500 mm H2O",
      "廢熱可回收比例": "約投入熱量的 25% - 30%"
    },
    relatedVideoId: "QDP2PCo0jMM",
    relatedVideoIds: [
      "QDP2PCo0jMM", "XDsUqCgAUHk"
    ]
  },
  {
    id: "cooling_system",
    nameZh: "冷卻系統",
    nameEn: "Cooling System",
    category: "熱平衡保障",
    icon: "fa-temperature-low",
    summary: "吸收並帶走燃燒產生的大量過剩熱量，保護缸壁、缸頭與活塞不因高溫變形卡死或熱疲勞裂損。",
    details: [
      "循環方式：通常為閉式強制循環（高溫迴路冷卻缸套/缸頭，低溫迴路冷卻中冷器與潤滑油）。",
      "冷卻水套 (Water Jacket)：環繞氣缸套與氣缸蓋，冷卻水帶走燃燒室金屬熱量。",
      "冷卻塔 (Cooling Tower) 或 大型水箱散熱風扇 (Radiator)：將二次迴路中的水冷卻降溫。",
      "恆溫器 (Thermostat) 與 旁通閥 (Bypass Valve)：控制水溫在最佳工作區間（通常 80-90°C），避免低溫腐蝕磨損或高溫開鍋。"
    ],
    operatingSpecs: {
      "引擎出水溫度": "80°C - 90°C",
      "循環流量": "30 - 60 m³/h (依機組容量)",
      "冷卻帶走熱量": "約燃油總熱值的 25% - 30%",
      "冷卻介質": "去離子軟水 + 防蝕防垢添加劑"
    },
    relatedVideoId: "PBJ40EYqxn0",
    relatedVideoIds: [
      "PBJ40EYqxn0", "saJgOYoevP0", "8KLNPCT9uLY", "jf_BZb7Ekyo",
      "tztuhXV4JJ4", "sNgr0H-okcM", "KAB33TH5etY", "0J0VrlWe1eo", "hCNViacVAXY"
    ]
  },
  {
    id: "lubrication_system",
    nameZh: "潤滑系統",
    nameEn: "Lubrication System",
    category: "抗磨降損",
    icon: "fa-oil-can",
    summary: "在金屬運動接觸表面建立耐壓流體油膜，減少摩擦磨損、輔助散熱冷卻、清潔積碳並提升密封性。",
    details: [
      "形式分類：濕式油底殼 (Wet Sump) 用於中小型機組；乾式油底殼 (Dry Sump) 用於大型發電廠機組（配備獨立潤滑油槽與回油泵/供油泵）。",
      "主機件：機油泵 (Lube Oil Pump)、機油冷卻器 (Oil Cooler)、全流式過濾器與離心式淨油機 (Centrifugal Purifier)。",
      "潤滑點涵蓋：主軸承、曲柄銷軸承、活塞銷襯套、活塞下噴油冷卻噴嘴、凸輪軸軸承及氣門搖臂機構。"
    ],
    operatingSpecs: {
      "主油道壓力": "3.5 - 6.0 bar",
      "機油工作溫度": "75°C - 85°C",
      "油膜厚度": "數微米 (水力動態油膜)",
      "換油週期/監控": "定期光譜油品化驗 (鐵、銅、黏度、鹼值 TBN)"
    },
    relatedVideoId: "Nq41vK-tmkE",
    relatedVideoIds: [
      "ZQUO0Jrz8zs", "A291cuS8ifo", "tzJd8aHj-vg", "Nq41vK-tmkE",
      "Cr4L37v8cQI", "0RcyfmksG_E", "Nqjn_K6hYOo"
    ]
  },
  {
    id: "starting_system",
    nameZh: "啟動與停機系統",
    nameEn: "Starting & Stopping System",
    category: "運轉控制",
    icon: "fa-bolt",
    summary: "在柴油機自發著火運轉前，提供外力克服靜摩擦力與壓縮阻力，驅動曲軸達到點火轉速。",
    details: [
      "壓縮空氣啟動 (Compressed Air Starting)：大型電廠標準配備。由空壓機加壓至 20-30 bar 儲存於高壓儲氣罐，啟動時經由空氣分配器 (Air Distributor) 依發火順序直接噴入氣缸推動活塞。",
      "電瓶啟動馬達 (Electric Starter)：中小型應急柴油發電機組使用 24V 直流啟動馬達與鉛酸/鋰蓄電池。",
      "停機機制：透過切斷噴油泵齒條 (Rack) 燃油供應、關閉緊急切斷進氣阻尼閥 (Air Shutoff Flap) 以達成正常停機或超速緊急停機。"
    ],
    operatingSpecs: {
      "啟動氣罐壓力": "20 - 30 bar",
      "啟動點火轉速": "約 100 - 200 RPM",
      "氣罐儲備容量": "連續提供 3-5 次成功啟動",
      "緊急停機響應時間": "< 1 - 2 秒 (切斷燃油與進氣)"
    },
    relatedVideoId: "QDP2PCo0jMM",
    relatedVideoIds: [
      "QDP2PCo0jMM", "cC2Yo5CT_jo", "GBarpxSZR9Y"
    ]
  },
  {
    id: "governing_system",
    nameZh: "調速系統",
    nameEn: "Governing System",
    category: "頻率與負載調節",
    icon: "fa-tachometer-alt",
    summary: "依據電網負載變化自動調節燃油供油量，保持引擎轉速與電網交流頻率（50Hz / 60Hz）嚴格恆定。",
    details: [
      "原理：當電氣負載突然增加，發電機反電磁轉矩增大，轉速短暫下降；調速器感測到轉速偏差後，立即驅動致動器推動噴油齒條加大供油量，恢復額定轉速。",
      "機械離心式 (Flyweight) ➔ 液壓輔助式 (Hydraulic Governor) ➔ 現代微電腦數位電子調速器 (Electronic Digital Governor / ECU)。",
      "具備下垂特性 (Droop Characteristic, 常用 3%~5%)，使多台發電機組並聯運轉時能自動且穩定地按容量比例分配負載。"
    ],
    operatingSpecs: {
      "轉速穩定精度": "±0.25% - ±0.5%",
      "頻率調節標準": "50 Hz (1500 RPM) / 60 Hz (1800 RPM)",
      "速度下垂率 (Droop)": "0% (等時模式) 或 3% - 5% (並網模式)",
      "瞬態負載響應時間": "< 1 秒恢復穩態"
    },
    relatedVideoId: "sOIYOCZPcUM",
    relatedVideoIds: [
      "sOIYOCZPcUM", "CBEBt-9mRmQ", "6A-p4C-Z7Ao", "qbma8W4f-EI", "kYIkyd_Fw4o"
    ]
  },
  {
    id: "generator",
    nameZh: "發電機與電網",
    nameEn: "Generator / Alternator & Grid",
    category: "電能轉換",
    icon: "fa-plug",
    summary: "透過剛性或彈性聯軸器與柴油機曲軸同軸相連，將機械旋轉動能轉化為三相交流電能。",
    details: [
      "定子 (Stator)：裝有三相對稱電樞繞組，輸出高壓或中低壓三相交流電 (如 400V, 3.3kV, 11kV)。",
      "轉子 (Rotor)：凸極或隱極式旋轉磁場結構，由直流勵磁機供電。",
      "自動電壓調節器 (AVR, Automatic Voltage Regulator)：即時偵測輸出電壓，自動調控勵磁電流，確保負載劇烈波動時端電壓恆定在額定值內。",
      "保護繼電器：具備過電流、反向功率 (逆功率保護，防止發電機變馬達倒拖引擎)、過電壓、接地故障等保護。"
    ],
    operatingSpecs: {
      "發電效率": "94% - 97.5%",
      "輸出電壓等級": "0.4 kV, 3.3 kV, 6.6 kV, 11 kV",
      "功率因數 (cos φ)": "0.8 (滯後) - 1.0",
      "勵磁方式": "無刷旋轉整流勵磁 (Brushless Excitation)"
    },
    relatedVideoId: "QDP2PCo0jMM",
    relatedVideoIds: [
      "QDP2PCo0jMM", "bvNQP95j1XA", "FFoaZQ85zbU"
    ]
  }
];

const CURRICULUM_CHAPTERS = [
  {
    id: "chap-layout",
    number: "Chapter 1",
    titleZh: "柴油發電廠總體佈局與廠址選擇",
    titleEn: "Diesel Power Plant Layout & Site Selection",
    badge: "核心系統概論",
    description: "全面剖析柴油發電廠的 9 大基礎組件結構、運轉流程、輔助設備及電廠選址考量要素。",
    videos: [
      {
        id: "QDP2PCo0jMM",
        titleZh: "柴油發電廠核心組件與系統佈局動畫解析",
        titleEn: "Essential Components of Diesel Power Plant Layout of Diesel Power Plant",
        duration: "動畫詳解",
        isMain: true,
        summary: "專案核心影片！以 3D 動畫拆解柴油發電廠 9 大系統（引擎、燃油、進氣、排氣、冷卻、潤滑、啟停、調速、發電機）的連結關係與運轉機制。",
        keyTakeaways: [
          "柴油引擎作為原動力帶動交流同步發電機。",
          "9 大子系統環環相扣，任何輔助系統失效都會觸發保護停機。",
          "日用油箱提供緩衝儲油，確保供油壓力穩定與安全。"
        ]
      },
      {
        id: "bvNQP95j1XA",
        titleZh: "柴油發電廠廠址選擇準則與評估考量",
        titleEn: "Site Selection of Diesel Power Plant",
        duration: "工程規劃",
        isMain: false,
        summary: "深入探討新建柴油電廠在地理、燃料物流、供水、環境噪音防制及負載中心鄰近度等維度的選址原則。",
        keyTakeaways: [
          "靠近用電負載中心：大幅降低輸電線路損耗與初設基礎建設投資。",
          "燃料運輸便利度：柴油需大量公路槽車或鐵路/水路運送，交通路網不可或缺。",
          "水源與環境限制：冷卻補給水取得容易度，以及遠離高密度住宅區以減少噪音廢氣投訴。"
        ]
      }
    ]
  },
  {
    id: "chap-engine-basics",
    number: "Chapter 2",
    titleZh: "內燃機基礎原理、分類與循環時序",
    titleEn: "Internal Combustion Engine Fundamentals & Cycles",
    badge: "熱力學基礎",
    description: "從熱機原理出發，徹底釐清內燃機與外燃機差異、二衝程與四衝程特點、汽柴油循環差異及氣門時序圖。",
    videos: [
      {
        id: "G9vjrVszunc",
        titleZh: "四衝程汽油引擎運轉 3D 動畫示範",
        titleEn: "Animation of Four Stroke Petrol Engine",
        duration: "動畫演示",
        isMain: false,
        summary: "展示進氣、壓縮、膨脹做功、排氣四個行程的活塞與氣門連鎖動作。",
        keyTakeaways: ["四個活塞行程等於曲軸轉動 720 度（兩整圈）。", "曲軸每轉兩圈，凸輪軸旋轉一圈。"]
      },
      {
        id: "0x67uVtqFqw",
        titleZh: "內燃機的完整分類法",
        titleEn: "Classification of Internal Combustion Engine",
        duration: "分類體系",
        isMain: false,
        summary: "依照衝程數、點火方式（點燃 SI / 壓燃 CI）、冷卻方式、氣缸排列方式等標準對內燃機進行系統化分類。",
        keyTakeaways: ["按點火方式：S.I.（火星塞點火）與 C.I.（壓縮著火）。", "按氣缸排列：直列式 (In-line)、V型、水平對臥式 (Opposed)。"]
      },
      {
        id: "9rTYXPJULkQ",
        titleZh: "內燃機 (I.C.) 與 外燃機 (E.C.) 的本質差異",
        titleEn: "Difference Between Internal And External Combustion Engine",
        duration: "熱力比較",
        isMain: false,
        summary: "比較柴油機/汽油機等內燃機與蒸氣渦輪機/斯特林發動機等外燃機在體積重量、啟動速度、熱效率及工質特點。",
        keyTakeaways: ["內燃機工質即燃燒產物，啟動極快、體積緊湊。", "外燃機工質與燃料分開，熱效率受限於熱交換器傳熱溫差。"]
      },
      {
        id: "RM0A1kQuXI4",
        titleZh: "內燃機核心機械零組件構造",
        titleEn: "Basic Components of Internal Combustion Engine",
        duration: "機械構造",
        isMain: false,
        summary: "拆解汽缸體、氣缸蓋、活塞、活塞銷、活塞環、連桿、曲軸、飛輪與進排氣閥門機構。",
        keyTakeaways: ["活塞環分為氣環（保持氣密）與油環（刮油潤滑）。", "飛輪儲存做功行程能量，克服輔助衝程阻力並平抑轉速波動。"]
      },
      {
        id: "4XJbaurVizs",
        titleZh: "內燃機重要工程術語與幾何參數",
        titleEn: "Terminology of Internal Combustion Engine",
        duration: "計算參數",
        isMain: false,
        summary: "精闢定義上死點 (TDC)、下死點 (BDC)、衝程 (Stroke)、缸徑 (Bore)、排量 (Swept Volume)、燃燒室容積 (Clearance Volume) 及壓縮比 (Compression Ratio)。",
        keyTakeaways: ["壓縮比 $r = \\frac{V_s + V_c}{V_c}$。", "柴油機壓縮比遠高於汽油機，因而擁有更高的理想熱效率。"]
      },
      {
        id: "orcm9bfs88w",
        titleZh: "汽油機 (S.I.) 與 柴油機 (C.I.) 關鍵性能對比",
        titleEn: "Difference Between Petrol (S.I) Engine And Diesel (C.I) Engine",
        duration: "關鍵對比",
        isMain: false,
        summary: "從吸入介質、點火機制、壓縮比、空燃比調節方式、熱效率、扭矩特性到排放物深入對照。",
        keyTakeaways: ["汽油機吸入油氣混合氣，柴油機單純吸入空氣並高壓噴油。", "柴油機在低轉速下具備巨大扭矩，極度適合驅動大型重型發電機。"]
      },
      {
        id: "EuC0qQCI6Uc",
        titleZh: "四衝程引擎與二衝程引擎的比較分析",
        titleEn: "Difference Between Four Stroke and Two Stroke Engines",
        duration: "衝程架構",
        isMain: false,
        summary: "比較兩種架構在做功頻率、功率重量比、掃氣過程、機械複雜度及熱負荷維護性。",
        keyTakeaways: ["二衝程曲軸每轉一圈做功一次，同排量理論功率較大，但掃氣損失與熱負荷高。", "四衝程進排氣徹底，燃燒效率高且機油消耗量低。"]
      },
      {
        id: "E_fR6jOpxN4",
        titleZh: "四衝程火星塞點火 (S.I.) 引擎運作機制",
        titleEn: "Working of Four Stroke Petrol Engine Four Stroke S I Engine",
        duration: "原理剖析",
        isMain: false,
        summary: "以動畫逐步解說奧圖循環 (Otto Cycle) 下四衝程汽油機的各階段動態變化。",
        keyTakeaways: ["進氣閥開閉時機與火星塞點火時間之精密配合。", "定容燃燒模型與壓力-容積 (P-V) 線圖的關係。"]
      },
      {
        id: "hfKTh7GkVME",
        titleZh: "四衝程汽油機氣門時序圖 (Valve Timing Diagram)",
        titleEn: "Valve Timing Diagram For Four Stroke Petrol Engine",
        duration: "時序圖解",
        isMain: false,
        summary: "解析氣門早開 (Lead)、遲關 (Lag) 與氣門重疊角 (Valve Overlap) 帶來的慣性充氣效果。",
        keyTakeaways: ["利用進排氣氣流慣性提高充氣效率。", "氣門重疊角在排氣衝程末期與進氣衝程初期發揮清氣效應。"]
      },
      {
        id: "31lrsp77ym0",
        titleZh: "四衝程柴油機 (C.I.) 運作機制與動畫",
        titleEn: "Four Stroke Diesel Engine OR Four Stroke C I Engine with animation",
        duration: "柴油核心",
        isMain: true,
        summary: "專題展示狄塞爾循環 (Diesel Cycle) 四衝程柴油機：純空氣壓縮加熱、高壓噴油定壓燃燒做功全過程。",
        keyTakeaways: ["純空氣壓縮避免早燃爆震，允許採用極高壓縮比。", "高壓柴油在壓縮末期噴入後自發著火並推動活塞向下做功。"]
      },
      {
        id: "XDsUqCgAUHk",
        titleZh: "四衝程柴油機氣門時序圖與噴油提前角",
        titleEn: "Valve Timing Diagram For Four Stroke Diesel Engine",
        duration: "時序圖解",
        isMain: false,
        summary: "詳解柴油機的進排氣閥門開閉時序，以及燃油噴射提前角 (Fuel Injection Advance) 的設定意義。",
        keyTakeaways: ["因柴油燃燒存在著火延遲期 (Ignition Delay)，必須提早數度曲軸角開始噴油。", "噴油過早會引起劇烈爆壓噪音，過遲會導致後燃排氣過熱。"]
      },
      {
        id: "FFoaZQ85zbU",
        titleZh: "內燃機性能參數與熱效率計算指標",
        titleEn: "Engine Performance Parameter",
        duration: "性能計算",
        isMain: false,
        summary: "詳解指示功率 (IP)、煞車制動功率 (BP)、摩擦功率 (FP)、機械效率、指示熱效率、制動熱效率與比燃油消耗率 (BSFC)。",
        keyTakeaways: ["煞車功率 $BP = IP - FP$。", "機械效率 $\\eta_m = \\frac{BP}{IP}$，通常在 80%~90% 區間。"]
      }
    ]
  },
  {
    id: "chap-lub-cool",
    number: "Chapter 3",
    titleZh: "潤滑與冷卻系統工程深度解析",
    titleEn: "Engine Lubrication & Cooling Systems",
    badge: "維運與可靠度",
    description: "發電機組能否長期不間斷高負載運轉，取決於潤滑油油膜保護與冷卻系統的熱平衡控制。",
    videos: [
      {
        id: "ZQUO0Jrz8zs",
        titleZh: "引擎潤滑系統的主要功能與原理",
        titleEn: "Function of Lubrication System",
        duration: "潤滑基礎",
        isMain: false,
        summary: "剖析潤滑系統的五大天職：減摩抗磨、散熱冷卻、清潔除污、密封防漏與抗震防蝕。",
        keyTakeaways: ["流體動力潤滑在曲軸頸與軸承合金間隔開金屬接觸。", "油流不斷帶走活塞與軸承處產生的摩擦熱量。"]
      },
      {
        id: "A291cuS8ifo",
        titleZh: "引擎潤滑油的關鍵物化特性",
        titleEn: "Properties of Lubricants",
        duration: "油品技術",
        isMain: false,
        summary: "深入探討黏度 (Viscosity)、黏度指數 (VI)、閃點、燃點、傾點、總鹼值 (TBN) 以及抗氧化性能。",
        keyTakeaways: ["黏度過高增加流動阻力與冷啟動磨損；過低無法承受高負載造成油膜破裂。", "高硫燃料柴油機需要高 TBN 機油以中和酸性燃燒產物。"]
      },
      {
        id: "tzJd8aHj-vg",
        titleZh: "油霧潤滑系統 (Mist Lubrication System)",
        titleEn: "Types of lubrication system_ Mist Lubrication system",
        duration: "潤滑類型",
        isMain: false,
        summary: "介紹將潤滑油預混入燃料或以氣流霧化懸浮的潤滑形式，主要應用於小型二衝程發動機。",
        keyTakeaways: ["無專用機油底殼與油泵，構造極為輕巧。", "機油直接參與燃燒，廢氣排放與積碳較多。"]
      },
      {
        id: "Nq41vK-tmkE",
        titleZh: "濕式油底殼潤滑系統 (Wet Sump)",
        titleEn: "Wet Sump Lubrication System",
        duration: "標準潤滑",
        isMain: false,
        summary: "解說機油直接儲存於引擎底部油底殼的標準配置，涵蓋集濾器、油泵、調壓閥及主油道循環。",
        keyTakeaways: ["結構精簡成本低，廣泛用於各類標準中小型柴油發電機組。", "液位受機組傾角晃動影響，機油容積相對受限。"]
      },
      {
        id: "Cr4L37v8cQI",
        titleZh: "飛濺式、半壓力式與全壓力式潤滑系統比較",
        titleEn: "Splash, Semi Pressure and Full Pressure Lubrication System",
        duration: "加壓分類",
        isMain: false,
        summary: "從曲軸打油杓飛濺潤滑演進到依靠高壓齒輪泵/轉子泵強制泵送油液至所有主要摩擦點的全壓力系統。",
        keyTakeaways: ["發電廠大型柴油機必須採用全壓力潤滑系統 (Full Pressure System)。", "連桿內部鑽有細長油孔，將主軸頸壓力油引導至活塞銷及活塞頂內側冷卻噴嘴。"]
      },
      {
        id: "0RcyfmksG_E",
        titleZh: "乾式油底殼潤滑系統 (Dry Sump)",
        titleEn: "Dry Sump Lubrication System",
        duration: "高端潤滑",
        isMain: true,
        summary: "剖析大型工業發電廠與船舶大型柴油機專用乾式系統：油底殼僅作集油，由清道夫回油泵 (Scavenge Pump) 抽至外部大容量獨立儲油箱。",
        keyTakeaways: ["大幅增加機油循環總量，油品散熱與沉澱消泡效果極佳。", "降低引擎安裝重心高度，避免曲軸攪油阻力損失與油液發泡。"]
      },
      {
        id: "Nqjn_K6hYOo",
        titleZh: "乾式油底殼與濕式油底殼全方位對比",
        titleEn: "Difference Between Wet Sump and Dry Sump Lubrication System",
        duration: "對比分析",
        isMain: false,
        summary: "雙方在成本、機械複雜度、油量容量、供油可靠性及散熱能力上的完整優缺點權衡表格分析。",
        keyTakeaways: ["濕式：經濟、緊湊、維護簡單，適合常規中小型發電機組。", "乾式：極高可靠度、超大儲油量、適合 24 小時不間斷基載電廠。"]
      },
      {
        id: "hCNViacVAXY",
        titleZh: "為什麼引擎必須進行冷卻？熱平衡剖析",
        titleEn: "Why Engine Cooling is required?",
        duration: "熱力挑戰",
        isMain: false,
        summary: "分析燃燒高溫（燃燒瞬間超過 2000°C）對金屬材料強度、熱應力變形、潤滑油裂解炭化及爆震的毀滅性後果。",
        keyTakeaways: ["投入柴油燃燒的總熱量中，僅約 40% 轉為軸功率，約 30% 必須由冷卻介質帶走。", "過度冷卻亦不可取，會降低熱效率並造成低溫酸蝕磨損。"]
      },
      {
        id: "saJgOYoevP0",
        titleZh: "氣冷式冷卻系統原理與散熱鰭片",
        titleEn: "Air Cooling System",
        duration: "氣冷技術",
        isMain: false,
        summary: "藉由氣缸體外的鋁合金散熱鰭片 (Cooling Fins) 與導風罩風扇將熱量直接傳遞給空氣。",
        keyTakeaways: ["無水箱、水泵、水垢問題，低溫無凍結疑慮。", "散熱能力有限且噪音較大，僅適用於小型便攜式應急發電機。"]
      },
      {
        id: "PBJ40EYqxn0",
        titleZh: "水冷式冷卻系統核心佈局與工作原理",
        titleEn: "Water Cooling System of Engine",
        duration: "水冷核心",
        isMain: true,
        summary: "柴油發電廠的絕對主力散熱形式：水套包覆燃燒室，由水泵泵送循環，經熱交換器或散熱冷卻塔散熱。",
        keyTakeaways: ["水的比熱容遠高於空氣，控溫均勻且熱傳遞效率卓越。", "發電廠機組幾乎 100% 採用水冷式設計。"]
      },
      {
        id: "8KLNPCT9uLY",
        titleZh: "熱虹吸式冷卻系統 (Thermo-Syphon)",
        titleEn: "Thermo-Syphon Cooling System",
        duration: "自然對流",
        isMain: false,
        summary: "利用水受熱密度變小上升、散熱後密度變大下沉的自然對流重力差原理進行循環，無機械水泵。",
        keyTakeaways: ["無水泵運動零件，但循環流動緩慢。", "水箱散熱器安裝高度必須顯著高於氣缸體。"]
      },
      {
        id: "jf_BZb7Ekyo",
        titleZh: "強制循環與恆溫器 (Thermostat) 調控系統",
        titleEn: "Forced circulation thermostat cooling",
        duration: "現代溫控",
        isMain: true,
        summary: "由水泵強制推動冷卻液流動，並利用石蠟式恆溫閥 (Thermostat) 在冷啟動時進行小循環、達到工作溫度後切換大循環。",
        keyTakeaways: ["大幅縮短柴油機暖機時間，迅速進入最佳燃燒溫度區間。", "避免缸套壁面冷凝低溫硫酸，延長氣缸套壽命數倍。"]
      },
      {
        id: "tztuhXV4JJ4",
        titleZh: "加壓式水冷系統 (Pressurized Water Cooling)",
        titleEn: "Pressurized Water Cooling System",
        duration: "增壓散熱",
        isMain: false,
        summary: "藉由壓力水箱蓋 (Pressure Cap) 密封維持 1-2 bar 系統表壓，使水沸點提升至 110-120°C，防止高溫氣蝕開鍋。",
        keyTakeaways: ["提高冷卻液與環境空氣的傳熱溫差 $\\Delta T$，可大幅縮小散熱水箱面積。", "設有真空閥防止冷卻系統降溫時大氣壓壓癟水管。"]
      },
      {
        id: "sNgr0H-okcM",
        titleZh: "蒸發或蒸汽冷卻系統 (Evaporative Cooling System)",
        titleEn: "Steam or Evaporative Cooling System",
        duration: "相變散熱",
        isMain: false,
        summary: "利用水蒸發汽化潛熱（約 2260 kJ/kg）帶走極高熱流密度的特殊冷卻方式。",
        keyTakeaways: ["利用相變潛熱，每單位冷卻水所需循環質量大幅減少。", "需嚴格的冷凝回流收集與防乾燒控制。"]
      },
      {
        id: "KAB33TH5etY",
        titleZh: "旁通冷卻系統 (Bypass Cooling System)",
        titleEn: "Bypass Cooling System",
        duration: "流量調控",
        isMain: false,
        summary: "解析恆溫閥在不同開度下的旁通回流管路設計，維持水泵吸入端壓頭穩定。",
        keyTakeaways: ["防止恆溫閥全閉時水泵出現打空轉或水錘震動現象。", "確保水套內部水流持續沖刷，消除局域熱點死角。"]
      },
      {
        id: "0J0VrlWe1eo",
        titleZh: "氣冷與水冷式引擎的全面技術對照總結",
        titleEn: "Difference between Air cool and water cool engine",
        duration: "對照總結",
        isMain: false,
        summary: "統整成本、維護量、散熱能力、噪音水準、氣候適應性與大型化潛力等指標。",
        keyTakeaways: ["大型連續運轉發電廠無一例外選用水冷強制循環架構。", "小型應急或沙漠缺水乾燥地區可評估氣冷機型。"]
      }
    ]
  },
  {
    id: "chap-gov-ign",
    number: "Chapter 4",
    titleZh: "調速機制與點火控制系統",
    titleEn: "Governing & Ignition Systems",
    badge: "頻率與電網並聯",
    description: "發電機頻率與電網穩定性的核心守護者——調速系統控制邏輯，以及內燃機點火機制對照。",
    videos: [
      {
        id: "8iBLAAJR298",
        titleZh: "蓄電池與點火線圈點火系統",
        titleEn: "Battery And Coil Ignition System",
        duration: "點火原理",
        isMain: false,
        summary: "解析汽油機點火線圈利用電磁感應產生 15,000V 以上高壓電產生跳火的完整電路。",
        keyTakeaways: ["斷電器接點 (Breaker Points) 與電容器 (Condenser) 的消火花功能。", "柴油機無需此系統，因其採用壓縮著火 (C.I.)。"]
      },
      {
        id: "cC2Yo5CT_jo",
        titleZh: "磁電機點火系統 (Magneto Ignition System)",
        titleEn: "Magneto Ignition System",
        duration: "無電池點火",
        isMain: false,
        summary: "自發電式旋轉磁鐵點火系統，無需外接蓄電池即可在運轉時持續供應高壓點火火花。",
        keyTakeaways: ["廣泛用於航空活塞引擎、賽車及戶外動力工具。", "高速時點火火花更強烈，但低速啟動點火較弱。"]
      },
      {
        id: "GBarpxSZR9Y",
        titleZh: "蓄電池點火與磁電機點火的全面比較",
        titleEn: "Comparison between Battery and Magneto Ignition System",
        duration: "點火對照",
        isMain: false,
        summary: "從可靠度、依賴外部電源程度、低速啟動能力及維護成本進行優劣點對比。",
        keyTakeaways: ["蓄電池點火系統在極低轉速下即能產生最強跳火能量。", "磁電機不依賴蓄電池健康度，具備高安全性獨立優勢。"]
      },
      {
        id: "kYIkyd_Fw4o",
        titleZh: "多缸內燃機發火順序 (Firing Order) 設定學問",
        titleEn: "Firing Order of I.C. Engine",
        duration: "震動平衡",
        isMain: true,
        summary: "揭密多缸柴油發電機組（如直列 6 缸 1-5-3-6-2-4、V12 機組）發火順序的排列法則與曲軸動態平衡。",
        keyTakeaways: ["目的在使曲軸扭矩輸出均勻平順，並消除一階/二階慣性不平衡力矩。", "使相鄰氣缸進排氣干擾減至最低，避免熱量集中於單一缸段。"]
      },
      {
        id: "sOIYOCZPcUM",
        titleZh: "飛輪 (Flywheel) 與調速器 (Governor) 的本質差別",
        titleEn: "Governing of Engine: Flywheel vs Governor",
        duration: "控制本質",
        isMain: true,
        summary: "非常經典的熱工控制概念！徹底釐清「飛輪控制一個工作循環內的週期性波動」與「調速器控制不同負載下的平均轉速」之差異。",
        keyTakeaways: ["飛輪：被動儲存/釋放動能，抑制單衝程做功/壓縮造成的短瞬波動，不改變供油量。", "調速器：主動偵測轉速偏差，根據負載大小調節噴油量以維持平均轉速恆定。"]
      },
      {
        id: "CBEBt-9mRmQ",
        titleZh: "柴油機的品質調節 (Quality Governing)",
        titleEn: "Quality governing of internal combustion engine",
        duration: "柴油調速核心",
        isMain: true,
        summary: "柴油機獨有的調節方式：進氣量基本恆定（進氣歧管不設節流閥），純粹透過改變每行程噴射的柴油量改變空燃比混合氣「品質」。",
        keyTakeaways: ["負載重時加大供油（濃混合），負載輕時減少供油（稀混合）。", "無節流閥節流阻力損失 (Pumping Loss)，在部分負載下仍保有極高燃燒熱效率。"]
      },
      {
        id: "6A-p4C-Z7Ao",
        titleZh: "汽油機的數量調節 (Quantity Governing)",
        titleEn: "Quantity governing of internal combustion engine",
        duration: "汽油調速機制",
        isMain: false,
        summary: "汽油機透過節氣門開度改變吸入氣缸的混合氣「總量」，而混合氣成分比例（空燃比理論值約 14.7:1）基本保持不變。",
        keyTakeaways: ["小負載時節氣門微開，造成嚴重的泵氣節流損失，導致低負載熱效率大幅跌落。", "與柴油機品質調節形成強烈對比。"]
      },
      {
        id: "qbma8W4f-EI",
        titleZh: "撞擊式/斷續調速 (Hit And Miss Governing)",
        titleEn: "Hit And Miss Governing",
        duration: "經典調速法",
        isMain: false,
        summary: "早期單缸定速工業發動機使用的傳統調速機制：轉速過高時直接跳過做功行程（不噴油或頂開排氣閥），轉速低時才正常發火。",
        keyTakeaways: ["做功時始終處於最佳燃燒狀態，但轉速波動較大。", "現代大型發電機組已被高精度電子液壓調速器取代。"]
      }
    ]
  },
  {
    id: "chap-combustion",
    number: "Chapter 5",
    titleZh: "內燃機燃燒過程與燃燒室設計",
    titleEn: "Combustion in SI & CI Engines",
    badge: "燃燒動力學",
    description: "揭開柴油機壓燃四階段（滯燃期、急燃期、緩燃期、後燃期）微觀燃燒歷程與不同燃燒室幾何形狀。",
    videos: [
      {
        id: "_Ko0jJsQWxA",
        titleZh: "火星塞點火 (S.I.) 引擎燃燒三大階段",
        titleEn: "Stages of Combustion In S I Engine",
        duration: "點火火焰傳播",
        isMain: false,
        summary: "火焰核心形成期、主火焰均勻傳播期以及氣缸壁面淬熄後期過程及爆震產生機制。",
        keyTakeaways: ["均勻混合氣中火焰以一定速度向外推移擴展。", "末端未燃氣體自燃將引發爆震 (Knocking)。"]
      },
      {
        id: "ce20BQvNIZw",
        titleZh: "壓燃式 (C.I.) 柴油機燃燒四階段深度解析",
        titleEn: "Stages of Combustion In C I Engine",
        duration: "柴油燃燒精髓",
        isMain: true,
        summary: "柴油燃燒學核心：著火延遲期 (Ignition Delay) ➔ 預混快速燃燒期 (Rapid/Uncontrolled Combustion) ➔ 擴散受控燃燒期 (Controlled Combustion) ➔ 後燃期 (After Burning)。",
        keyTakeaways: ["延遲期越長，積聚未燃柴油越多，急燃期壓力上升率 $dp/d\\theta$ 越陡峭，造成敲缸柴油敲擊音 (Diesel Knock)。", "採用十六烷值 (Cetane Number) 較高的柴油可縮短滯燃期，運轉平穩。"]
      },
      {
        id: "tXILRLLgVwo",
        titleZh: "汽油機燃燒室幾何設計原則",
        titleEn: "Design of Combustion Chamber For SI Engine",
        duration: "燃燒室造型",
        isMain: false,
        summary: "半球形、浴盆形、楔形及多氣門燃燒室的氣流滾流與擠氣效應設計重點。",
        keyTakeaways: ["縮短火焰傳播距離，增強燃燒室末端散熱抑制自燃爆震。", "加大進排氣閥面積以改善高速通氣流動。"]
      },
      {
        id: "GR0oI5sDCww",
        titleZh: "內燃機燃燒室類型全覽 (直噴式 DI vs 間接噴射 IDI)",
        titleEn: "Types of Combustion Chamber for SI & CI Engine",
        duration: "噴射室分類",
        isMain: true,
        summary: "比較柴油機開式/半開式直接噴射燃燒室（如活塞頂碗狀燃燒室）與預燃室 (Pre-combustion Chamber)、渦流室 (Swirl Chamber) 的動力與油耗表現。",
        keyTakeaways: ["直接噴射 (DI)：熱損失小、熱效率極高、冷啟動性能極佳，現代大型柴油發電廠皆為 DI 架構。", "間接噴射 (IDI)：旋流強、噴油壓力要求低、運轉安靜，但節流傳熱損失高。"]
      }
    ]
  },
  {
    id: "chap-supercharger",
    number: "Chapter 6",
    titleZh: "機械增壓與渦輪增壓系統技術",
    titleEn: "Supercharging & Turbocharging",
    badge: "升功率倍增技術",
    description: "如何在不增加氣缸排氣量與引擎自重的前提下，將發電機組發電功率提升 30%~60% 以上的關鍵技術。",
    videos: [
      {
        id: "Fg_-XDKppg4",
        titleZh: "機械增壓器 (Supercharger) 構造與運作原理",
        titleEn: "Supercharger Working and Animation",
        duration: "增壓入門",
        isMain: false,
        summary: "介紹由引擎曲軸透過皮帶或齒輪直接驅動的魯式 (Roots)、螺桿式 (Twin-Screw) 及離心式機械增壓裝置。",
        keyTakeaways: ["低轉速響應極快，無排氣渦輪延遲 (Turbo Lag)。", "需消耗部分曲軸軸功率作為機械驅動代價（約耗損引擎 10%~15% 動力）。"]
      },
      {
        id: "Q2axT3wAXv4",
        titleZh: "引擎進行增壓的核心目標與工程效益",
        titleEn: "Objectives of Supercharging",
        duration: "增壓效益",
        isMain: true,
        summary: "解析增壓的三大工程目標：提高每升功率輸出（體積功比）、補償高海拔地區大氣稀薄導致的功率減額 (De-rating)、以及提升高負載燃燒效率。",
        keyTakeaways: ["高海拔發電廠必備增壓補償，否則功率會隨海拔高度每升 1000 米遞減約 10%。", "增壓後缸內進氣質量大幅增加，容許噴射更多柴油並維持足夠的空氣過量係數。"]
      },
      {
        id: "nXnH_DzO53Y",
        titleZh: "增壓系統的佈局管路與工程配置方式",
        titleEn: "Method or Arrangement of Supercharging",
        duration: "佈局管路",
        isMain: false,
        summary: "分析增壓器位於進氣管路不同位置時與化油器/噴油系統、中冷器之間的管路銜接與旁通安全閥配置。",
        keyTakeaways: ["增壓後空氣溫度因絕熱壓縮而大幅升高，必須串聯中冷器 (Intercooler)。", "配置增壓壓力旁通放氣閥 (Wastegate/Blow-off) 保護管路與壓氣機。"]
      },
      {
        id: "FSbydOPAAF4",
        titleZh: "機械增壓 (Supercharging) 與 渦輪增壓 (Turbocharging) 的巔峰對決",
        titleEn: "Comparison Between Supercharging And Turbocharging",
        duration: "增壓終極對決",
        isMain: true,
        summary: "從驅動源（曲軸機械連接 vs 排氣廢氣動能廢熱）、整體熱效率、動力延遲、高溫耐用度全面評比。",
        keyTakeaways: ["渦輪增壓器回收本將排入大氣的廢氣能量驅動壓氣機，不掠奪曲軸有效輸出功，總熱效率最高。", "現代中大型柴油發電機組 100% 標配廢氣渦輪增壓 (Turbocharged) + 進氣中冷 (Aftercooled, T/A)。"]
      }
    ]
  }
];

const QUIZ_QUESTIONS = [
  {
    chapterId: "chap-layout",
    question: "在柴油發電廠的燃油供應系統中，「日用油箱」(Day Tank) 的主要作用是什麼？",
    options: [
      "單純作為備用裝飾，無實際管路相連",
      "提供引擎約 6-8 小時的全載燃料緩衝儲備，並使重力與供油壓力維持穩定",
      "在高溫下直接加熱柴油使其汽化成氣體",
      "存放廢機油與沉澱雜質，不具備供油功能"
    ],
    answer: 1,
    explanation: "日用油箱由主儲油槽經油泵供油，通常安裝於高於引擎噴油泵的適當高度，儲備約 6-8 小時全載用量，確保供油壓力穩定，並為燃油沉澱雜質與回油提供緩衝。"
  },
  {
    chapterId: "chap-layout",
    question: "大型柴油發電廠在啟動引擎時，通常採用哪種啟動方式？",
    options: [
      "手拉式繩索啟動",
      "以人力搖桿轉動飛輪",
      "20 - 30 bar 的高壓壓縮空氣噴入氣缸推動活塞",
      "直接利用發電機當作電動機全速旋轉"
    ],
    answer: 2,
    explanation: "大型工業及電廠級柴油機因排量巨大且壓縮比高達 16:1 以上，需要極大的啟動轉矩，標準配備為 20~30 bar 高壓空氣系統，依發火順序直接噴入氣缸推動活塞。"
  },
  {
    chapterId: "chap-engine-basics",
    question: "為什麼柴油引擎（C.I. 壓燃式）不需要火星塞即可引燃燃料？",
    options: [
      "因為柴油本身具有自燃化學催化劑",
      "柴油機具有極高壓縮比，將空氣壓縮至高溫高壓，達到並超過柴油自燃點，噴入即自燃",
      "利用氣缸壁摩擦產生的電火花引燃",
      "柴油機排氣管內的廢氣倒流引燃"
    ],
    answer: 1,
    explanation: "柴油機壓縮比高達 14:1 至 22:1，純空氣被壓縮後溫度可達 500°C~700°C，遠高於柴油自燃點（約 210°C~250°C），柴油霧化噴入後立即自發著火。"
  },
  {
    chapterId: "chap-lub-cool",
    question: "大型連續基載柴油發電廠為何更傾向採用「乾式油底殼」(Dry Sump) 潤滑系統？",
    options: [
      "因為乾式油底殼不需要使用潤滑油",
      "乾式配備獨立外部大容量油箱與回油泵，油量大、散熱好、且避免曲軸劇烈攪油起泡",
      "因為乾式系統製造成本最為低廉且結構最簡單",
      "乾式油底殼只能使用在小型割草機上"
    ],
    answer: 1,
    explanation: "乾式油底殼能容納數倍於機體底部的機油儲量，外部油箱便於油氣分離、冷卻沉澱與持續過濾淨化，無曲軸攪油阻力，適合大型電廠不間斷運轉。"
  },
  {
    chapterId: "chap-gov-ign",
    question: "在內燃機工程中，「飛輪」(Flywheel) 與「調速器」(Governor) 的根本職責差異為何？",
    options: [
      "飛輪負責調節供油量，調速器負責儲存做功衝程動能",
      "飛輪平抑一個工作循環內的週期性轉速脈動；調速器則依據電網負載變動主動調節供油量以維持平均額定轉速",
      "兩者功能完全相同，純粹名稱不同",
      "飛輪只能用在汽油機，調速器只能用在柴油機"
    ],
    answer: 1,
    explanation: "飛輪是純慣性被動元件，儲存做功行程能量並補償壓縮行程阻力，減少一週期內的脈動；調速器是負載反饋調節元件，隨電氣負載改變噴油泵齒條供油量，維持頻率穩定。"
  },
  {
    chapterId: "chap-supercharger",
    question: "廢氣渦輪增壓器 (Turbocharger) 相較於曲軸機械增壓器 (Supercharger)，在發電廠中最大的優勢是什麼？",
    options: [
      "渦輪增壓器不需要排氣管",
      "渦輪增壓器利用本將排放至大氣的廢氣廢熱動能驅動壓氣機，不消耗引擎曲軸的有效輸出功，電廠總熱效率更高",
      "渦輪增壓器在轉速為零時就能提供最大增壓壓力",
      "渦輪增壓器構造比一般風扇更簡單且無高溫問題"
    ],
    answer: 1,
    explanation: "機械增壓器直接消耗曲軸約 10%~15% 的有用機械功；而渦輪增壓器利用排氣高溫高壓廢能驅動渦輪，把廢能轉化為高壓充氣，大幅提高電廠發電熱效率。"
  }
];
