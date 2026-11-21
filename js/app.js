/**
 * Main Application Controller for Diesel Power Plant Interactive Learning Platform
 */

class App {
  constructor() {
    this.currentTab = "layout";
    this.currentVideoId = "QDP2PCo0jMM"; // Default to source video
    this.diagram = null;
    this.simulator = null;
    this.quiz = null;
    this.completedVideos = this.loadCompletedVideos();
    this.searchQuery = "";

    this.init();
  }

  loadCompletedVideos() {
    try {
      const saved = localStorage.getItem("diesel_completed_videos");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  saveCompletedVideos() {
    try {
      localStorage.setItem("diesel_completed_videos", JSON.stringify(this.completedVideos));
    } catch (e) {}
  }

  toggleVideoCompleted(videoId) {
    if (this.completedVideos[videoId]) {
      delete this.completedVideos[videoId];
    } else {
      this.completedVideos[videoId] = true;
    }
    this.saveCompletedVideos();
    this.updateVideoProgressStats();
    this.renderVideoCards();
  }

  init() {
    this.initNavigation();
    this.initDiagramView();
    this.initVideoView();
    this.initKnowledgeView();
    this.initTranscriptsView();
    this.initSearch();
    this.initModal();

    // Select default component in drawer
    const initialComp = PLANT_COMPONENTS.find(c => c.id === "engine");
    if (initialComp) {
      this.displayComponentDetails(initialComp);
    }

    this.updateVideoProgressStats();
  }

  initNavigation() {
    const navButtons = document.querySelectorAll(".nav-item");
    navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Handle hash route if any
    const hash = window.location.hash.replace("#", "");
    if (["layout", "videos", "simulator", "knowledge", "transcripts", "quiz"].includes(hash)) {
      this.switchTab(hash);
    }
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    window.location.hash = tabName;

    document.querySelectorAll(".nav-item").forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    document.querySelectorAll(".tab-view").forEach(view => {
      if (view.id === `view-${tabName}`) {
        view.classList.add("active");
      } else {
        view.classList.remove("active");
      }
    });

    // Lazy initialize simulator or quiz if not yet initialized
    if (tabName === "simulator" && !this.simulator) {
      this.simulator = new PlantSimulator("simulator-container");
    } else if (tabName === "quiz" && !this.quiz) {
      this.quiz = new PlantQuiz("quiz-container");
    }
  }

  initDiagramView() {
    this.diagram = new PlantDiagram("diagram-canvas", (comp) => {
      this.displayComponentDetails(comp);
    });

    // Component list items in sidebar
    const compListContainer = document.getElementById("component-quick-list");
    if (compListContainer) {
      compListContainer.innerHTML = PLANT_COMPONENTS.map(c => `
        <button class="comp-list-btn ${c.id === 'engine' ? 'active' : ''}" data-id="${c.id}">
          <i class="fas ${c.icon}"></i>
          <span>${c.nameZh}</span>
        </button>
      `).join('');

      compListContainer.querySelectorAll(".comp-list-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          compListContainer.querySelectorAll(".comp-list-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          const id = btn.dataset.id;
          this.diagram.selectComponent(id);
        });
      });
    }
  }

  getVideoInfo(videoId) {
    if (typeof FULL_TRANSCRIPTS_DATABASE !== "undefined") {
      for (const ch of FULL_TRANSCRIPTS_DATABASE) {
        const v = ch.videos.find(x => x.video_id === videoId);
        if (v) {
          return {
            id: v.video_id,
            titleZh: v.title_zh,
            titleEn: v.title_en,
            duration: v.duration,
            summary: v.summary,
            chapterNum: ch.chapter_num,
            chapterTitle: ch.chapter_title_zh,
            hasTranscript: true
          };
        }
      }
    }
    if (typeof CURRICULUM_CHAPTERS !== "undefined") {
      for (const ch of CURRICULUM_CHAPTERS) {
        const v = ch.videos.find(x => x.id === videoId);
        if (v) {
          return {
            id: v.id,
            titleZh: v.titleZh,
            titleEn: v.titleEn,
            duration: v.duration,
            summary: v.summary,
            chapterNum: ch.number,
            chapterTitle: ch.titleZh,
            hasTranscript: true
          };
        }
      }
    }
    return null;
  }

  getComponentsForVideo(videoId) {
    if (typeof PLANT_COMPONENTS === "undefined") return [];
    return PLANT_COMPONENTS.filter(comp => {
      if (Array.isArray(comp.relatedVideoIds) && comp.relatedVideoIds.includes(videoId)) return true;
      return comp.relatedVideoId === videoId;
    });
  }

  openTranscriptViewForVideo(videoId) {
    this.switchTab("transcripts");
    this.selectedTranscriptVideoId = videoId;
    this.renderTranscriptsTree();
    this.displayTranscript(videoId);
    const readerEl = document.getElementById("transcripts-reader");
    if (readerEl) {
      readerEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  displayComponentDetails(comp) {
    const panel = document.getElementById("component-detail-panel");
    if (!panel) return;

    // Highlight sidebar button if exists
    const btn = document.querySelector(`.comp-list-btn[data-id="${comp.id}"]`);
    if (btn) {
      document.querySelectorAll(".comp-list-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    }

    // Resolve mapped videos
    const vids = (Array.isArray(comp.relatedVideoIds) && comp.relatedVideoIds.length > 0)
      ? comp.relatedVideoIds
      : (comp.relatedVideoId ? [comp.relatedVideoId] : []);

    const mappedVideos = vids.map(vid => this.getVideoInfo(vid)).filter(Boolean);

    panel.innerHTML = `
      <div class="comp-detail-card">
        <div class="comp-detail-header">
          <div class="comp-badge-group">
            <span class="comp-badge">${comp.category}</span>
            <span class="comp-trans-count-badge"><i class="fas fa-book"></i> 收錄 ${mappedVideos.length} 篇逐字稿</span>
          </div>
          <h3><i class="fas ${comp.icon}"></i> ${comp.nameZh}</h3>
          <div class="comp-en-name">${comp.nameEn}</div>
        </div>

        <div class="comp-summary-box">
          <p>${comp.summary}</p>
        </div>

        <div class="comp-section">
          <h4><i class="fas fa-microchip"></i> 工程構造與運作原理</h4>
          <ul class="comp-details-list">
            ${comp.details.map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>

        <div class="comp-section">
          <h4><i class="fas fa-clipboard-check"></i> 典型工業運轉指標</h4>
          <div class="comp-specs-table">
            ${Object.entries(comp.operatingSpecs).map(([key, val]) => `
              <div class="spec-row">
                <span class="spec-key">${key}</span>
                <span class="spec-val">${val}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="comp-section comp-transcripts-section">
          <div class="comp-transcripts-header">
            <h4><i class="fas fa-layer-group text-accent"></i> 對應技術逐字稿與影片 (${mappedVideos.length} 篇)</h4>
          </div>
          <p class="comp-transcripts-hint">本組件在 46 部工程講義中涵蓋下列專題課程，點擊可直接閱讀全文逐字稿或播放動畫：</p>
          <div class="comp-transcripts-scroll-list">
            ${mappedVideos.map((v, idx) => `
              <div class="comp-transcript-item">
                <div class="comp-trans-item-header">
                  <span class="comp-trans-num">#${idx + 1}</span>
                  <span class="comp-trans-chap">${v.chapterNum}</span>
                  <span class="comp-trans-duration"><i class="far fa-clock"></i> ${v.duration}</span>
                </div>
                <div class="comp-trans-title">${v.titleZh}</div>
                <div class="comp-trans-en">${v.titleEn}</div>
                <div class="comp-trans-actions">
                  <button class="btn-comp-action btn-read-transcript" data-video-id="${v.id}">
                    <i class="fas fa-file-alt"></i> 閱讀逐字稿
                  </button>
                  <button class="btn-comp-action btn-play-mapped-video" data-video-id="${v.id}">
                    <i class="fab fa-youtube"></i> 播放影片
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="comp-action-box">
          <button class="btn btn-primary btn-block" id="btn-watch-comp-video" data-video-id="${comp.relatedVideoId || (mappedVideos[0] && mappedVideos[0].id)}">
            <i class="fab fa-youtube"></i> 觀看主系統核心動畫影片
          </button>
        </div>
      </div>
    `;

    // Attach read transcript event
    panel.querySelectorAll(".btn-read-transcript").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const vid = e.currentTarget.dataset.videoId;
        this.openTranscriptViewForVideo(vid);
      });
    });

    // Attach play video event
    panel.querySelectorAll(".btn-play-mapped-video").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const vid = e.currentTarget.dataset.videoId;
        this.playVideo(vid);
      });
    });

    const watchMainBtn = panel.querySelector("#btn-watch-comp-video");
    if (watchMainBtn) {
      watchMainBtn.addEventListener("click", (e) => {
        const vid = e.currentTarget.dataset.videoId;
        if (vid) this.playVideo(vid);
      });
    }
  }

  initVideoView() {
    this.renderChapterNav();
    this.renderVideoCards();
  }

  renderChapterNav() {
    const nav = document.getElementById("chapter-filter-bar");
    if (!nav) return;

    let html = `
      <button class="chap-filter-btn active" data-chapter="all">
        <i class="fas fa-th-large"></i> 全部章節 (46部影片)
      </button>
    `;

    CURRICULUM_CHAPTERS.forEach((ch, idx) => {
      html += `
        <button class="chap-filter-btn" data-chapter="${ch.id}">
          <span class="chap-tag">${ch.number}</span> ${ch.titleZh} (${ch.videos.length})
        </button>
      `;
    });

    nav.innerHTML = html;

    nav.querySelectorAll(".chap-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        nav.querySelectorAll(".chap-filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.selectedChapterFilter = btn.dataset.chapter;
        this.renderVideoCards();
      });
    });
  }

  renderVideoCards() {
    const container = document.getElementById("video-cards-grid");
    if (!container) return;

    let filteredChapters = CURRICULUM_CHAPTERS;
    if (this.selectedChapterFilter && this.selectedChapterFilter !== "all") {
      filteredChapters = CURRICULUM_CHAPTERS.filter(ch => ch.id === this.selectedChapterFilter);
    }

    let cardsHtml = "";
    let totalMatched = 0;

    filteredChapters.forEach(ch => {
      let matchedVideos = ch.videos;
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        matchedVideos = matchedVideos.filter(v => 
          v.titleZh.toLowerCase().includes(q) || 
          v.titleEn.toLowerCase().includes(q) || 
          v.summary.toLowerCase().includes(q)
        );
      }

      if (matchedVideos.length === 0) return;

      totalMatched += matchedVideos.length;

      cardsHtml += `
        <div class="chapter-group-header">
          <div class="chap-num-pill">${ch.number}</div>
          <div class="chap-title-text">
            <h3>${ch.titleZh}</h3>
            <span class="chap-en">${ch.titleEn}</span>
          </div>
          <div class="chap-badge">${ch.badge}</div>
        </div>
        <div class="videos-row">
          ${matchedVideos.map(v => {
            const isCompleted = !!this.completedVideos[v.id];
            const isMain = v.id === "QDP2PCo0jMM";
            return `
              <div class="video-card ${isMain ? 'featured-video' : ''} ${isCompleted ? 'is-completed' : ''}" data-video-id="${v.id}">
                ${isMain ? `<div class="main-source-tag"><i class="fas fa-star"></i> 來源核心影片 (Source Video)</div>` : ''}
                
                <div class="video-thumb-wrap" data-video-id="${v.id}">
                  <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${v.titleZh}" loading="lazy">
                  <div class="play-overlay">
                    <div class="play-btn-circle"><i class="fas fa-play"></i></div>
                  </div>
                  <span class="video-duration-pill">${v.duration}</span>
                </div>

                <div class="video-card-body">
                  <h4 class="video-card-title">${v.titleZh}</h4>
                  <div class="video-card-en">${v.titleEn}</div>
                  <p class="video-card-summary">${v.summary}</p>
                  
                  <div class="video-takeaways">
                    <div class="takeaways-label"><i class="fas fa-lightbulb"></i> 重點技術提煉：</div>
                    <ul>
                      ${v.keyTakeaways.map(t => `<li>${t}</li>`).join('')}
                    </ul>
                  </div>

                  <div class="video-card-footer">
                    <button class="btn btn-sm ${isCompleted ? 'btn-success' : 'btn-outline'} btn-toggle-complete" data-video-id="${v.id}">
                      <i class="fas ${isCompleted ? 'fa-check' : 'fa-check-circle'}"></i>
                      ${isCompleted ? '已完成學習' : '標記為已學'}
                    </button>
                    <button class="btn btn-sm btn-primary btn-play-now" data-video-id="${v.id}">
                      <i class="fab fa-youtube"></i> 播放影片
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    });

    if (totalMatched === 0) {
      cardsHtml = `
        <div class="no-results-box">
          <i class="fas fa-search"></i>
          <p>找不到符合「${this.searchQuery}」的相關章節或影片內容</p>
          <button class="btn btn-outline" id="btn-clear-search">清除搜尋條件</button>
        </div>
      `;
    }

    container.innerHTML = cardsHtml;

    // Attach listeners
    container.querySelectorAll(".btn-play-now, .video-thumb-wrap").forEach(el => {
      el.addEventListener("click", () => {
        const vid = el.dataset.videoId;
        this.playVideo(vid);
      });
    });

    container.querySelectorAll(".btn-toggle-complete").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const vid = btn.dataset.videoId;
        this.toggleVideoCompleted(vid);
      });
    });

    const clearBtn = container.querySelector("#btn-clear-search");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        const searchInput = document.getElementById("search-input");
        if (searchInput) searchInput.value = "";
        this.searchQuery = "";
        this.renderVideoCards();
      });
    }
  }

  updateVideoProgressStats() {
    let totalVideos = 0;
    CURRICULUM_CHAPTERS.forEach(ch => totalVideos += ch.videos.length);
    const completedCount = Object.keys(this.completedVideos).length;
    const pct = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

    const statCountEl = document.getElementById("stat-completed-count");
    const statPctEl = document.getElementById("stat-completed-pct");
    const statBarEl = document.getElementById("stat-progress-bar");

    if (statCountEl) statCountEl.innerText = `${completedCount} / ${totalVideos} 部`;
    if (statPctEl) statPctEl.innerText = `${pct}%`;
    if (statBarEl) statBarEl.style.width = `${pct}%`;
  }

  initSearch() {
    const input = document.getElementById("search-input");
    if (!input) return;

    input.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.trim();
      this.renderVideoCards();
    });
  }

  initModal() {
    const modal = document.getElementById("video-modal");
    const backdrop = document.getElementById("modal-backdrop");
    const closeBtn = document.getElementById("modal-close-btn");

    const closeModal = () => {
      modal.classList.remove("open");
      const iframeWrap = document.getElementById("modal-iframe-container");
      if (iframeWrap) iframeWrap.innerHTML = "";
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
      }
    });
  }

  playVideo(videoId) {
    this.currentVideoId = videoId;
    const modal = document.getElementById("video-modal");
    const iframeWrap = document.getElementById("modal-iframe-container");
    const titleEl = document.getElementById("modal-video-title");
    const descEl = document.getElementById("modal-video-desc");

    // Find video details
    let videoData = null;
    let parentChapter = null;
    for (const ch of CURRICULUM_CHAPTERS) {
      const v = ch.videos.find(x => x.id === videoId);
      if (v) {
        videoData = v;
        parentChapter = ch;
        break;
      }
    }

    if (!videoData) return;

    if (titleEl) {
      titleEl.innerHTML = `
        <span class="modal-chap-tag">${parentChapter.number}</span>
        ${videoData.titleZh}
      `;
    }

    if (descEl) {
      descEl.innerHTML = `
        <p class="modal-video-en">${videoData.titleEn}</p>
        <p class="modal-video-summary">${videoData.summary}</p>
        <div class="modal-keypoints">
          <strong><i class="fas fa-check-circle text-accent"></i> 核心技術精要：</strong>
          <ul>
            ${videoData.keyTakeaways.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    if (iframeWrap) {
      iframeWrap.innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1" 
          title="${videoData.titleZh}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen>
        </iframe>
      `;
    }

    modal.classList.add("open");
  }

  initKnowledgeView() {
    const kbContainer = document.getElementById("knowledge-accordion");
    if (!kbContainer) return;

    const sections = [
      {
        title: "柴油機發電廠工作原理與柴油循環 (Diesel Cycle)",
        icon: "fa-fire",
        content: `
          <p>柴油發電機組本質上是利用<strong>狄塞爾熱力循環 (Diesel Cycle)</strong>，其核心特色為「定壓燃燒」：</p>
          <ol>
            <li><strong>進氣行程 (1-2)：</strong>活塞自上死點 (TDC) 移向下死點 (BDC)，純空氣被吸入氣缸，進氣歧管不設阻礙氣流的節氣門。</li>
            <li><strong>壓縮行程 (2-3)：</strong>進排氣門全關，活塞向上將空氣壓縮至原體積的 $\\frac{1}{14}$ 至 $\\frac{1}{22}$，缸內壓縮空氣溫度急升至 600°C~700°C，壓力高達 35~50 bar。</li>
            <li><strong>噴油燃燒與膨脹做功行程 (3-4)：</strong>高壓噴油泵將微米級霧化柴油噴入高溫空氣中自發著火，活塞受燃氣推動做功，推動曲軸旋轉。</li>
            <li><strong>排氣行程 (4-1)：</strong>排氣門開啟，活塞上行將燃燒後的廢氣排出氣缸，導向渦輪增壓器與消音器。</li>
          </ol>
        `
      },
      {
        title: "柴油噴射系統：從機械列型泵到現代高壓共軌 (Common Rail)",
        icon: "fa-tint",
        content: `
          <p>柴油發電機組燃燒效率的靈魂在於<strong>霧化粒徑與噴射壓力</strong>：</p>
          <ul>
            <li><strong>傳統柱塞式噴射泵：</strong>凸輪軸驅動各缸柱塞，噴射壓力約 200 - 800 bar，噴射壓力隨引擎轉速變化。</li>
            <li><strong>高壓共軌電控噴射 (CRDI)：</strong>由高壓泵維持共軌管內高達 1,600 - 2,500 bar 的恆定超高壓，ECU 控制高速電磁閥或壓電晶體噴油嘴，可達成每循環 5-7 次精密微噴射（預噴射、主噴射、後噴射），徹底消除柴油敲缸聲 (Knock) 並大幅降低黑煙與 NOx 排放。</li>
          </ul>
        `
      },
      {
        title: "調速器 (Governor) 運作原理與下垂控制 (Droop Control)",
        icon: "fa-tachometer-alt",
        content: `
          <p>為了使發電機在 50Hz (1500 RPM) 或 60Hz (1800 RPM) 恆定頻率運轉，調速器承擔關鍵調節任務：</p>
          <ul>
            <li><strong>品質調節 (Quality Governing)：</strong>柴油機無節氣門，調速器純粹改變噴油齒條位置（供油量），而進氣量始終保持最大，因此部分負載熱效率依然極為優異。</li>
            <li><strong>速度下垂率 (Speed Droop)：</strong>公式為 $Droop\\% = \\frac{n_{NL} - n_{FL}}{n_{FL}} \\times 100\\%$。在多台發電機組並聯於同一電網時，若無下垂率（純等時模式），各機組間會發生嚴重的無功/有功振盪奪載；設定 3%~5% 下垂率可確保各機組精確按自身額定容量比例穩定分攤負載。</li>
          </ul>
        `
      },
      {
        title: "發電廠冷卻與熱平衡分配 (Thermal Balance)",
        icon: "fa-thermometer-half",
        content: `
          <p>在柴油燃燒釋放的 100% 燃料化學能中，其典型能量平衡分佈如下：</p>
          <ul>
            <li><strong>有效軸功率 (Shaft Power / Electricity)：</strong>約 <strong>40% ~ 45%</strong>。</li>
            <li><strong>排氣帶走熱量 (Exhaust Gas Losses)：</strong>約 <strong>28% ~ 32%</strong>（可利用廢熱鍋爐 WHRB 進行汽電共生回收）。</li>
            <li><strong>冷卻水套帶走熱量 (Cooling Jacket Losses)：</strong>約 <strong>18% ~ 22%</strong>。</li>
            <li><strong>機油冷卻器與輻射散熱 (Lube & Radiation)：</strong>約 <strong>5% ~ 8%</strong>。</li>
          </ul>
        `
      }
    ];

    kbContainer.innerHTML = sections.map((sec, idx) => `
      <div class="kb-item ${idx === 0 ? 'open' : ''}">
        <div class="kb-title">
          <span><i class="fas ${sec.icon}"></i> ${sec.title}</span>
          <i class="fas fa-chevron-down kb-arrow"></i>
        </div>
        <div class="kb-body">${sec.content}</div>
      </div>
    `).join('');

    kbContainer.querySelectorAll(".kb-title").forEach(title => {
      title.addEventListener("click", () => {
        const item = title.parentElement;
        item.classList.toggle("open");
      });
    });
  }

  /* ==========================================================================
     TRANSCRIPTS DATABASE METHODS
     ========================================================================== */

  initTranscriptsView() {
    this.selectedTranscriptVideoId = "QDP2PCo0jMM";
    this.renderTranscriptsTree();
    this.displayTranscript(this.selectedTranscriptVideoId);

    const searchInput = document.getElementById("transcript-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        this.renderTranscriptsTree(query);
      });
    }
  }

  renderTranscriptsTree(filterText = "") {
    const treeContainer = document.getElementById("transcripts-tree");
    if (!treeContainer || typeof FULL_TRANSCRIPTS_DATABASE === "undefined") return;

    let html = "";
    let matchCount = 0;

    FULL_TRANSCRIPTS_DATABASE.forEach(ch => {
      const filteredVideos = ch.videos.filter(v => {
        if (!filterText) return true;
        return v.title_zh.toLowerCase().includes(filterText) ||
               v.title_en.toLowerCase().includes(filterText) ||
               v.summary.toLowerCase().includes(filterText) ||
               v.transcript_zh.toLowerCase().includes(filterText);
      });

      if (filteredVideos.length === 0) return;
      matchCount += filteredVideos.length;

      const hasSelected = filteredVideos.some(v => v.video_id === this.selectedTranscriptVideoId);

      html += `
        <div class="tree-chapter-group ${filterText || hasSelected ? 'open' : ''}">
          <div class="tree-chapter-header">
            <span class="tree-chap-badge">${ch.chapter_num}</span>
            <span class="tree-chap-title">${ch.chapter_title_zh}</span>
            <span class="tree-count">${filteredVideos.length}</span>
            <i class="fas fa-chevron-down tree-chevron"></i>
          </div>
          <div class="tree-videos-list">
            ${filteredVideos.map(v => `
              <button class="tree-video-btn ${v.video_id === this.selectedTranscriptVideoId ? 'active' : ''}" data-video-id="${v.video_id}">
                <i class="fab fa-youtube tree-vid-icon"></i>
                <div class="tree-vid-meta">
                  <span class="tree-vid-title">${v.title_zh}</span>
                  <span class="tree-vid-sub">${v.duration} · ${v.video_id}</span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    });

    if (matchCount === 0) {
      html = `
        <div class="tree-no-match">
          <i class="fas fa-search-minus"></i>
          <p>無符合「${filterText}」的逐字稿</p>
        </div>
      `;
    }

    treeContainer.innerHTML = html;

    // Attach tree chapter accordion toggles
    treeContainer.querySelectorAll(".tree-chapter-header").forEach(hdr => {
      hdr.addEventListener("click", () => {
        const group = hdr.parentElement;
        group.classList.toggle("open");
      });
    });

    // Attach tree video selection buttons
    treeContainer.querySelectorAll(".tree-video-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        treeContainer.querySelectorAll(".tree-video-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const vid = btn.dataset.videoId;
        this.selectedTranscriptVideoId = vid;
        this.displayTranscript(vid);
      });
    });
  }

  displayTranscript(videoId) {
    const reader = document.getElementById("transcripts-reader");
    if (!reader || typeof FULL_TRANSCRIPTS_DATABASE === "undefined") return;

    let targetVideo = null;
    let targetChapter = null;

    for (const ch of FULL_TRANSCRIPTS_DATABASE) {
      const v = ch.videos.find(x => x.video_id === videoId);
      if (v) {
        targetVideo = v;
        targetChapter = ch;
        break;
      }
    }

    if (!targetVideo) return;

    // Find linked plant diagram components
    const linkedComponents = this.getComponentsForVideo(videoId);

    // Format transcript text into styled sections
    const rawText = targetVideo.transcript_zh;
    // Highlight headers like 【...】 into styled block headers
    const formattedHtml = rawText.split("\n\n").map(para => {
      para = para.trim();
      if (!para) return "";
      if (para.startsWith("【") && para.includes("】")) {
        const titleEnd = para.indexOf("】") + 1;
        const head = para.substring(0, titleEnd);
        const body = para.substring(titleEnd).trim();
        return `
          <div class="transcript-section-block">
            <h4 class="transcript-section-heading"><i class="fas fa-bookmark text-accent"></i> ${head}</h4>
            <p class="transcript-paragraph">${body}</p>
          </div>
        `;
      }
      return `<p class="transcript-paragraph">${para}</p>`;
    }).join("");

    reader.innerHTML = `
      <div class="reader-header-card">
        <div class="reader-meta-row">
          <span class="chap-badge">${targetChapter.chapter_num}：${targetChapter.chapter_title_zh}</span>
          <span class="reader-duration"><i class="far fa-clock"></i> 影片長度：${targetVideo.duration}</span>
        </div>

        <h2 class="reader-video-title">${targetVideo.title_zh}</h2>
        <div class="reader-en-title">${targetVideo.title_en}</div>

        ${linkedComponents.length > 0 ? `
          <div class="reader-diagram-link-banner">
            <span class="link-banner-label"><i class="fas fa-project-diagram text-accent"></i> 技術詳解圖對應組件：</span>
            <div class="link-banner-tags">
              ${linkedComponents.map(comp => `
                <button class="btn-locate-diagram-comp" data-comp-id="${comp.id}" title="點擊切換至技術架構圖並定位此組件">
                  <span class="comp-idx-pill">#${comp.number || (PLANT_COMPONENTS.findIndex(c => c.id === comp.id) + 1)}</span>
                  <span class="comp-name-pill">${comp.nameZh}</span>
                  <i class="fas fa-crosshairs locate-icon"></i>
                  <span class="locate-tip">在架構圖中定位</span>
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="reader-toolbar">
          <button class="btn btn-primary btn-sm" id="btn-reader-play" data-video-id="${targetVideo.video_id}">
            <i class="fab fa-youtube"></i> 彈窗播放對應影片
          </button>
          <a href="${targetVideo.youtube_url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            <i class="fas fa-external-link-alt"></i> 前往 YouTube 觀看
          </a>
          <button class="btn btn-outline btn-sm" id="btn-reader-copy">
            <i class="fas fa-copy"></i> 複製全文逐字稿
          </button>
          <span class="copy-toast" id="copy-toast"><i class="fas fa-check"></i> 已成功複製講義內容！</span>
        </div>
      </div>

      <div class="reader-summary-box">
        <h4><i class="fas fa-info-circle text-accent"></i> 課程內容綱要</h4>
        <p>${targetVideo.summary}</p>
      </div>

      <div class="reader-keypoints-box">
        <h4><i class="fas fa-lightbulb text-amber"></i> 核心工程技術提煉</h4>
        <ul>
          ${targetVideo.key_points.map(pt => `<li>${pt}</li>`).join("")}
        </ul>
      </div>

      <div class="reader-transcript-content">
        <div class="transcript-content-header">
          <h3><i class="fas fa-stream"></i> 中文完整技術演講逐字稿與講義</h3>
          <span class="text-muted">字數：${targetVideo.transcript_zh.length} 字</span>
        </div>
        <div class="transcript-body-text">
          ${formattedHtml}
        </div>
      </div>
    `;

    // Attach play event
    reader.querySelector("#btn-reader-play").addEventListener("click", () => {
      this.playVideo(targetVideo.video_id);
    });

    // Attach locate in diagram event
    reader.querySelectorAll(".btn-locate-diagram-comp").forEach(btn => {
      btn.addEventListener("click", () => {
        const compId = btn.dataset.compId;
        this.switchTab("layout");
        if (this.diagram) {
          this.diagram.selectComponent(compId);
          const schematic = document.getElementById("plant-schematic");
          if (schematic) {
            schematic.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      });
    });

    // Attach copy event
    reader.querySelector("#btn-reader-copy").addEventListener("click", () => {
      const fullTextToCopy = `=== ${targetVideo.title_zh} (${targetVideo.title_en}) ===\n章節：${targetChapter.chapter_num} ${targetChapter.chapter_title_zh}\n影片網址：${targetVideo.youtube_url}\n\n【課程概要】\n${targetVideo.summary}\n\n【核心技術要點】\n` + targetVideo.key_points.map((p, i) => `${i+1}. ${p}`).join("\n") + `\n\n【中文完整逐字稿】\n${targetVideo.transcript_zh}`;
      
      navigator.clipboard.writeText(fullTextToCopy).then(() => {
        const toast = document.getElementById("copy-toast");
        if (toast) {
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 2500);
        }
      }).catch(err => {
        console.error("Copy failed", err);
      });
    });
  }
}

// Global bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.plantApp = new App();
});
