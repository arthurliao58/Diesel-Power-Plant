/**
 * Interactive Diesel Power Plant Layout & Flow Visualizer
 * Handles SVG interactive schematic, particle animations, component clicks, flows,
 * adjustable font sizes, and mapping to all 46 technical lecture transcripts.
 */

class PlantDiagram {
  constructor(containerId, onSelectComponent) {
    this.container = document.getElementById(containerId);
    this.onSelectComponent = onSelectComponent;
    this.activeFlows = {
      fuel: true,
      air: true,
      cooling: true,
      lube: true,
      power: true
    };
    this.selectedComponentId = "engine";
    this.fontScale = parseInt(localStorage.getItem("diagram_font_scale"), 10) || 100;
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
    this.setFontScale(this.fontScale);
  }

  setFontScale(scalePercent) {
    this.fontScale = Math.max(70, Math.min(180, scalePercent));
    const factor = this.fontScale / 100;
    
    // Set CSS custom property on the SVG
    const svg = this.container.querySelector("#plant-schematic");
    if (svg) {
      svg.style.setProperty("--diagram-font-scale", factor);
    }

    // Update UI controls
    const slider = this.container.querySelector("#diagram-font-scale-slider");
    const valDisplay = this.container.querySelector("#diagram-font-scale-val");
    if (slider) slider.value = this.fontScale;
    if (valDisplay) valDisplay.innerText = `${this.fontScale}%`;

    // Direct font-size adjustment on all SVG text elements for perfect cross-browser compatibility
    if (svg) {
      svg.querySelectorAll("text[data-base-size]").forEach(textEl => {
        const baseSize = parseFloat(textEl.dataset.baseSize);
        textEl.style.fontSize = `${(baseSize * factor).toFixed(1)}px`;
      });
    }

    localStorage.setItem("diagram_font_scale", this.fontScale);
  }

  toggleFlow(flowType) {
    if (this.activeFlows[flowType] !== undefined) {
      this.activeFlows[flowType] = !this.activeFlows[flowType];
      this.updateFlowVisibility();
      return this.activeFlows[flowType];
    }
    return false;
  }

  updateFlowVisibility() {
    for (const [flow, active] of Object.entries(this.activeFlows)) {
      const elements = this.container.querySelectorAll(`.flow-path-${flow}`);
      elements.forEach(el => {
        el.style.opacity = active ? "1" : "0.15";
        if (active) {
          el.classList.add("animating");
        } else {
          el.classList.remove("animating");
        }
      });
    }
  }

  selectComponent(id) {
    this.selectedComponentId = id;
    this.container.querySelectorAll(".plant-node").forEach(node => {
      if (node.dataset.id === id) {
        node.classList.add("selected");
      } else {
        node.classList.remove("selected");
      }
    });
    if (typeof this.onSelectComponent === "function") {
      const comp = PLANT_COMPONENTS.find(c => c.id === id);
      if (comp) this.onSelectComponent(comp);
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="diagram-wrapper">
        <div class="diagram-toolbar">
          <div class="flow-controls">
            <span class="toolbar-label"><i class="fas fa-project-diagram"></i> 動態流向模擬:</span>
            <button class="flow-btn active" data-flow="fuel"><span class="flow-indicator fuel"></span> 燃油流 (Fuel)</button>
            <button class="flow-btn active" data-flow="air"><span class="flow-indicator air"></span> 進/排氣流 (Air/Exhaust)</button>
            <button class="flow-btn active" data-flow="cooling"><span class="flow-indicator cooling"></span> 冷卻水流 (Cooling)</button>
            <button class="flow-btn active" data-flow="lube"><span class="flow-indicator lube"></span> 潤滑機油 (Lube Oil)</button>
            <button class="flow-btn active" data-flow="power"><span class="flow-indicator power"></span> 電能輸出 (Electric)</button>
          </div>

          <!-- Font Size Adjustment Controller -->
          <div class="font-size-control-group">
            <span class="toolbar-label"><i class="fas fa-font"></i> 圖中字型大小:</span>
            <button class="btn-font-scale" id="btn-font-scale-down" title="縮小字體"><i class="fas fa-minus"></i></button>
            <input type="range" min="70" max="180" step="5" value="${this.fontScale}" id="diagram-font-scale-slider" class="font-scale-slider" title="滑動自訂圖中字型大小">
            <button class="btn-font-scale" id="btn-font-scale-up" title="放大字體"><i class="fas fa-plus"></i></button>
            <button class="btn-font-reset" id="btn-font-scale-reset" title="重設為預設大小 (100%)">
              <span id="diagram-font-scale-val">${this.fontScale}%</span>
            </button>
          </div>
        </div>

        <div class="svg-viewport-container">
          <svg viewBox="0 0 1100 680" class="plant-svg" id="plant-schematic" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- Gradients -->
              <linearGradient id="engineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3b4252" />
                <stop offset="50%" stop-color="#2e3440" />
                <stop offset="100%" stop-color="#242933" />
              </linearGradient>

              <linearGradient id="genGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#2d3748" />
                <stop offset="100%" stop-color="#1a202c" />
              </linearGradient>

              <linearGradient id="fuelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#b45309" stop-opacity="0.9" />
              </linearGradient>

              <linearGradient id="coolingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#0284c7" />
              </linearGradient>

              <!-- Glow filter -->
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Grid & Background Frame -->
            <rect x="10" y="10" width="1080" height="660" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="2" />
            <g opacity="0.08" stroke="#94a3b8" stroke-width="1">
              <path d="M 10 100 L 1090 100 M 10 200 L 1090 200 M 10 300 L 1090 300 M 10 400 L 1090 400 M 10 500 L 1090 500 M 10 600 L 1090 600" />
              <path d="M 100 10 L 100 670 M 200 10 L 200 670 M 300 10 L 300 670 M 400 10 L 400 670 M 500 10 L 500 670 M 600 10 L 600 670 M 700 10 L 700 670 M 800 10 L 800 670 M 900 10 L 900 670 M 1000 10 L 1000 670" />
            </g>

            <!-- ================= FLOW PIPES (BACKGROUND) ================= -->
            <g id="flow-pipelines" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <!-- FUEL PIPELINE (Amber) -->
              <path class="pipe-bg" d="M 80 520 L 140 520 L 140 420 L 190 420 L 190 310 L 250 310 L 250 250 L 330 250 L 330 330 L 420 330" stroke="#78350f" stroke-width="6" />
              <path class="flow-path-fuel animating" d="M 80 520 L 140 520 L 140 420 L 190 420 L 190 310 L 250 310 L 250 250 L 330 250 L 330 330 L 420 330" stroke="#f59e0b" stroke-width="3" stroke-dasharray="8 6" />

              <!-- AIR INTAKE PIPELINE (Sky Blue) -->
              <path class="pipe-bg" d="M 280 80 L 370 80 L 370 140 L 460 140 L 460 270" stroke="#0369a1" stroke-width="7" />
              <path class="flow-path-air animating" d="M 280 80 L 370 80 L 370 140 L 460 140 L 460 270" stroke="#38bdf8" stroke-width="4" stroke-dasharray="10 8" />

              <!-- EXHAUST PIPELINE (Crimson/Orange) -->
              <path class="pipe-bg" d="M 520 270 L 520 140 L 620 140 L 620 60" stroke="#991b1b" stroke-width="8" />
              <path class="flow-path-air animating" d="M 520 270 L 520 140 L 620 140 L 620 60" stroke="#ef4444" stroke-width="4" stroke-dasharray="10 6" />

              <!-- COOLING WATER LOOP (Cyan/Teal) -->
              <!-- Hot water out to cooling tower -->
              <path class="pipe-bg" d="M 540 370 L 610 370 L 610 520 L 730 520" stroke="#0e7490" stroke-width="6" />
              <path class="flow-path-cooling animating" d="M 540 370 L 610 370 L 610 520 L 730 520" stroke="#06b6d4" stroke-width="3" stroke-dasharray="8 6" />
              <!-- Cold water returned to engine -->
              <path class="pipe-bg" d="M 730 560 L 510 560 L 510 440" stroke="#0284c7" stroke-width="6" />
              <path class="flow-path-cooling animating" d="M 730 560 L 510 560 L 510 440" stroke="#38bdf8" stroke-width="3" stroke-dasharray="8 6" />

              <!-- LUBRICATION LOOP (Gold/Green) -->
              <path class="pipe-bg" d="M 450 460 L 450 585 L 330 585 L 330 420 L 420 420" stroke="#15803d" stroke-width="5" stroke-linejoin="round" />
              <path class="flow-path-lube animating" d="M 450 460 L 450 585 L 330 585 L 330 420 L 420 420" stroke="#22c55e" stroke-width="3" stroke-dasharray="6 6" stroke-linejoin="round" />

              <!-- STARTING AIR PIPE (Purple) -->
              <path class="pipe-bg" d="M 120 170 L 220 170 L 220 350 L 420 350" stroke="#6d28d9" stroke-width="5" />
              <path class="flow-path-air animating" d="M 120 170 L 220 170 L 220 350 L 420 350" stroke="#a855f7" stroke-width="2.5" stroke-dasharray="6 4" />

              <!-- MECHANICAL SHAFT COUPLING -->
              <rect x="560" y="340" width="80" height="20" fill="#64748b" stroke="#334155" stroke-width="2" rx="3" />
              <line x1="560" y1="350" x2="640" y2="350" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="5 3" />

              <!-- GOVERNOR FEEDBACK LOOP -->
              <path d="M 550 330 L 550 220 L 480 220 L 440 290" fill="none" stroke="#eab308" stroke-width="2" stroke-dasharray="4 4" />

              <!-- ELECTRIC POWER OUTPUT (Yellow/Electric) -->
              <path class="pipe-bg" d="M 790 350 L 890 350 L 890 260 L 980 260" stroke="#854d0e" stroke-width="7" />
              <path class="flow-path-power animating" d="M 790 350 L 890 350 L 890 260 L 980 260" stroke="#facc15" stroke-width="4" stroke-dasharray="10 5" filter="url(#glow)" />
            </g>

            <!-- ================= INTERACTIVE NODES ================= -->

            <!-- 1. DIESEL ENGINE (CORE) - 9 TRANSCRIPTS -->
            <g class="plant-node selected" data-id="engine" id="node-engine">
              <rect x="410" y="270" width="160" height="195" rx="10" fill="url(#engineGrad)" stroke="#38bdf8" stroke-width="3" filter="drop-shadow(0 4px 12px rgba(56,189,248,0.3))" />
              
              <!-- Engine Cylinders Graphic -->
              <rect x="430" y="290" width="30" height="50" rx="4" fill="#1e293b" stroke="#64748b" />
              <rect x="475" y="290" width="30" height="50" rx="4" fill="#1e293b" stroke="#64748b" />
              <rect x="520" y="290" width="30" height="50" rx="4" fill="#1e293b" stroke="#64748b" />
              <line x1="445" y1="315" x2="445" y2="340" stroke="#f59e0b" stroke-width="3" />
              <line x1="490" y1="305" x2="490" y2="340" stroke="#ef4444" stroke-width="3" />
              <line x1="535" y1="325" x2="535" y2="340" stroke="#10b981" stroke-width="3" />
              <!-- Flywheel -->
              <circle cx="560" cy="350" r="28" fill="#475569" stroke="#94a3b8" stroke-width="3" />
              <circle cx="560" cy="350" r="10" fill="#1e293b" stroke="#cbd5e1" stroke-width="2" />
              
              <text x="490" y="375" fill="#f8fafc" data-base-size="14" font-weight="700" text-anchor="middle" class="svg-scalable-text">柴油發電機組引擎</text>
              <text x="490" y="395" fill="#94a3b8" data-base-size="11" text-anchor="middle" class="svg-scalable-text">Diesel Engine (Prime Mover)</text>
              <text x="490" y="418" fill="#38bdf8" data-base-size="11" font-weight="600" text-anchor="middle" class="svg-scalable-text">4-Stroke C.I. 壓燃式</text>

              <!-- Transcript Count Badge -->
              <rect x="445" y="432" width="90" height="22" rx="11" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" stroke-width="1.2" />
              <text x="490" y="447" fill="#38bdf8" data-base-size="10.5" font-weight="700" text-anchor="middle" class="svg-scalable-text">📚 9篇技術逐字稿</text>

              <circle cx="490" cy="270" r="14" fill="#38bdf8" />
              <text x="490" y="275" fill="#0f172a" data-base-size="12" font-weight="900" text-anchor="middle" class="svg-scalable-text">1</text>
            </g>

            <!-- 2. FUEL SYSTEM (TANKS & PUMP) - 7 TRANSCRIPTS -->
            <g class="plant-node" data-id="fuel_system" id="node-fuel">
              <!-- Main Fuel Tank -->
              <rect x="30" y="470" width="90" height="100" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
              <path d="M 30 495 L 120 495" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="2 2" />
              <text x="75" y="525" fill="#fef08a" data-base-size="12" font-weight="700" text-anchor="middle" class="svg-scalable-text">主儲油槽</text>
              <text x="75" y="542" fill="#94a3b8" data-base-size="10" text-anchor="middle" class="svg-scalable-text">Storage Tank</text>

              <!-- Day Tank -->
              <rect x="215" y="195" width="90" height="85" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
              <rect x="225" y="235" width="70" height="30" rx="3" fill="#b45309" opacity="0.6" />
              <text x="260" y="218" fill="#fef08a" data-base-size="11" font-weight="700" text-anchor="middle" class="svg-scalable-text">日用油箱</text>
              <text x="260" y="246" fill="#ffffff" data-base-size="9" text-anchor="middle" class="svg-scalable-text">Day Tank (8h)</text>
              <!-- Badge -->
              <text x="260" y="270" fill="#f59e0b" data-base-size="9.5" font-weight="700" text-anchor="middle" class="svg-scalable-text">📚 7篇逐字稿</text>

              <!-- Fuel Injection Pump -->
              <rect x="320" y="305" width="55" height="45" rx="5" fill="#292524" stroke="#d97706" stroke-width="2" />
              <text x="347" y="328" fill="#fbbf24" data-base-size="10" font-weight="700" text-anchor="middle" class="svg-scalable-text">噴油泵</text>
              <text x="347" y="342" fill="#a8a29e" data-base-size="8" text-anchor="middle" class="svg-scalable-text">HP Pump</text>

              <circle cx="260" cy="190" r="13" fill="#f59e0b" />
              <text x="260" y="195" fill="#0f172a" data-base-size="11" font-weight="900" text-anchor="middle" class="svg-scalable-text">2</text>
            </g>

            <!-- 3. AIR INTAKE & TURBOCHARGER - 5 TRANSCRIPTS -->
            <g class="plant-node" data-id="air_intake" id="node-air">
              <!-- Air Filter -->
              <rect x="180" y="55" width="95" height="55" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
              <path d="M 195 65 L 195 100 M 210 65 L 210 100 M 225 65 L 225 100 M 240 65 L 240 100 M 255 65 L 255 100" stroke="#0284c7" stroke-width="2" />
              <text x="227" y="103" fill="#e0f2fe" data-base-size="10" font-weight="700" text-anchor="middle" class="svg-scalable-text">空氣濾清器 Filter</text>

              <!-- Turbocharger (Compressor & Intercooler) -->
              <circle cx="370" cy="140" r="28" fill="#1e293b" stroke="#0ea5e9" stroke-width="2.5" />
              <path d="M 355 140 A 15 15 0 0 1 385 140" stroke="#38bdf8" stroke-width="3" fill="none" />
              <text x="370" y="180" fill="#38bdf8" data-base-size="11" font-weight="700" text-anchor="middle" class="svg-scalable-text">渦輪增壓器 (壓氣端)</text>
              
              <!-- Intercooler -->
              <rect x="430" y="115" width="60" height="45" rx="5" fill="#1e293b" stroke="#0ea5e9" stroke-width="2" />
              <path d="M 440 125 L 480 125 M 440 135 L 480 135 M 440 145 L 480 145" stroke="#38bdf8" stroke-width="2" />
              <text x="460" y="172" fill="#7dd3fc" data-base-size="9" text-anchor="middle" class="svg-scalable-text">中冷器 Intercooler</text>

              <!-- Badge -->
              <rect x="330" y="188" width="80" height="18" rx="9" fill="rgba(14, 165, 233, 0.25)" stroke="#0ea5e9" stroke-width="1" />
              <text x="370" y="201" fill="#7dd3fc" data-base-size="9.5" font-weight="700" text-anchor="middle" class="svg-scalable-text">📚 5篇逐字稿</text>

              <circle cx="275" cy="55" r="13" fill="#38bdf8" />
              <text x="275" y="60" fill="#0f172a" data-base-size="11" font-weight="900" text-anchor="middle" class="svg-scalable-text">3</text>
            </g>

            <!-- 4. EXHAUST & SILENCER - 2 TRANSCRIPTS -->
            <g class="plant-node" data-id="exhaust_system" id="node-exhaust">
              <!-- Turbocharger Turbine -->
              <circle cx="520" cy="140" r="24" fill="#3f1414" stroke="#ef4444" stroke-width="2" />
              <text x="520" y="144" fill="#fca5a5" data-base-size="9" font-weight="700" text-anchor="middle" class="svg-scalable-text">排氣渦輪</text>

              <!-- Silencer / Muffler -->
              <rect x="585" y="65" width="75" height="95" rx="16" fill="#2d1515" stroke="#ef4444" stroke-width="2.5" />
              <line x1="600" y1="85" x2="640" y2="85" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />
              <line x1="600" y1="110" x2="640" y2="110" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />
              <line x1="600" y1="135" x2="640" y2="135" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />
              <text x="622" y="105" fill="#fecaca" data-base-size="11" font-weight="700" text-anchor="middle" class="svg-scalable-text">消音器</text>
              <text x="622" y="122" fill="#f87171" data-base-size="9" text-anchor="middle" class="svg-scalable-text">Silencer</text>

              <!-- Badge -->
              <rect x="585" y="165" width="75" height="18" rx="9" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" stroke-width="1" />
              <text x="622" y="178" fill="#fca5a5" data-base-size="9.5" font-weight="700" text-anchor="middle" class="svg-scalable-text">📚 2篇逐字稿</text>

              <!-- Stack -->
              <polygon points="615,65 625,65 628,25 612,25" fill="#475569" stroke="#ef4444" stroke-width="1.5" />
              <path d="M 620 20 Q 615 10 630 5" stroke="#94a3b8" stroke-width="2" stroke-dasharray="2 2" fill="none" opacity="0.6" />

              <circle cx="655" cy="65" r="13" fill="#ef4444" />
              <text x="655" y="70" fill="#ffffff" data-base-size="11" font-weight="900" text-anchor="middle" class="svg-scalable-text">4</text>
            </g>

            <!-- 5. COOLING SYSTEM (TOWER & PUMP) - 9 TRANSCRIPTS -->
            <g class="plant-node" data-id="cooling_system" id="node-cooling">
              <!-- Cooling Tower -->
              <polygon points="730,470 760,450 820,450 850,470 860,610 720,610" fill="#152b3c" stroke="#06b6d4" stroke-width="2" />
              <!-- Water fan on top -->
              <ellipse cx="790" cy="455" rx="25" ry="8" fill="#0e7490" stroke="#22d3ee" stroke-width="1.5" />
              <line x1="775" y1="455" x2="805" y2="455" stroke="#ffffff" stroke-width="2" />
              <!-- Packing splash effect -->
              <path d="M 740 500 Q 790 520 840 500 M 745 530 Q 790 550 835 530" stroke="#0891b2" stroke-width="2" fill="none" stroke-dasharray="4 3" />
              <text x="790" y="555" fill="#cffafe" data-base-size="12" font-weight="700" text-anchor="middle" class="svg-scalable-text">冷卻水塔 / 散熱水箱</text>
              <text x="790" y="572" fill="#67e8f9" data-base-size="10" text-anchor="middle" class="svg-scalable-text">Cooling Tower & Pump</text>

              <!-- Badge -->
              <rect x="745" y="583" width="90" height="20" rx="10" fill="rgba(6, 182, 212, 0.25)" stroke="#06b6d4" stroke-width="1.2" />
              <text x="790" y="597" fill="#67e8f9" data-base-size="10" font-weight="700" text-anchor="middle" class="svg-scalable-text">📚 9篇技術逐字稿</text>

              <circle cx="790" cy="435" r="13" fill="#06b6d4" />
              <text x="790" y="440" fill="#0f172a" data-base-size="11" font-weight="900" text-anchor="middle" class="svg-scalable-text">5</text>
            </g>

            <!-- 6. LUBRICATION SYSTEM - 7 TRANSCRIPTS -->
            <g class="plant-node" data-id="lubrication_system" id="node-lube">
              <!-- Oil Sump / Sump Tank -->
              <rect x="280" y="555" width="200" height="75" rx="8" fill="#142e1d" stroke="#22c55e" stroke-width="2" />
              <circle cx="330" cy="585" r="16" fill="#166534" stroke="#4ade80" stroke-width="1.5" />
              <text x="330" y="589" fill="#ffffff" data-base-size="8" text-anchor="middle" class="svg-scalable-text">油泵</text>
              <rect x="365" y="570" width="45" height="30" rx="4" fill="#14532d" stroke="#4ade80" stroke-width="1.5" />
              <text x="387" y="588" fill="#86efac" data-base-size="8" text-anchor="middle" class="svg-scalable-text">油冷器</text>
              <text x="380" y="618" fill="#86efac" data-base-size="10.5" font-weight="700" text-anchor="middle" class="svg-scalable-text">潤滑油槽 (Sump) & 機油泵</text>

              <!-- Badge -->
              <rect x="420" y="572" width="55" height="18" rx="9" fill="rgba(34, 197, 94, 0.25)" stroke="#22c55e" stroke-width="1" />
              <text x="447" y="585" fill="#86efac" data-base-size="8.5" font-weight="700" text-anchor="middle" class="svg-scalable-text">7篇逐字稿</text>

              <circle cx="275" cy="560" r="13" fill="#22c55e" />
              <text x="275" y="565" fill="#0f172a" data-base-size="11" font-weight="900" text-anchor="middle" class="svg-scalable-text">6</text>
            </g>

            <!-- 7. STARTING & STOPPING SYSTEM - 3 TRANSCRIPTS -->
            <g class="plant-node" data-id="starting_system" id="node-start">
              <!-- Air Storage Bottle / Receiver -->
              <rect x="50" y="125" width="70" height="115" rx="18" fill="#2e1065" stroke="#a855f7" stroke-width="2" />
              <circle cx="85" cy="150" r="12" fill="#1e1b4b" stroke="#c084fc" stroke-width="1.5" />
              <line x1="85" y1="150" x2="91" y2="145" stroke="#f43f5e" stroke-width="2" />
              <text x="85" y="185" fill="#f3e8ff" data-base-size="10" font-weight="700" text-anchor="middle" class="svg-scalable-text">高壓儲氣罐</text>
              <text x="85" y="200" fill="#c084fc" data-base-size="9" text-anchor="middle" class="svg-scalable-text">30 bar Air</text>
              <text x="85" y="222" fill="#e9d5ff" data-base-size="9" font-weight="700" text-anchor="middle" class="svg-scalable-text">📚 3篇逐字稿</text>

              <!-- Air Compressor -->
              <rect x="40" y="65" width="90" height="45" rx="5" fill="#1e1b4b" stroke="#a855f7" stroke-width="1.5" />
              <text x="85" y="90" fill="#e9d5ff" data-base-size="9.5" font-weight="600" text-anchor="middle" class="svg-scalable-text">啟動空壓機</text>

              <circle cx="125" cy="125" r="13" fill="#a855f7" />
              <text x="125" y="130" fill="#ffffff" data-base-size="11" font-weight="900" text-anchor="middle" class="svg-scalable-text">7</text>
            </g>

            <!-- 8. GOVERNING SYSTEM - 5 TRANSCRIPTS -->
            <g class="plant-node" data-id="governing_system" id="node-governor">
              <rect x="480" y="185" width="105" height="60" rx="6" fill="#3b2d13" stroke="#eab308" stroke-width="2" />
              <circle cx="515" cy="205" r="7" fill="#ca8a04" />
              <circle cx="550" cy="205" r="7" fill="#ca8a04" />
              <line x1="515" y1="205" x2="550" y2="205" stroke="#fef08a" stroke-width="2" />
              <text x="532" y="224" fill="#fef08a" data-base-size="10" font-weight="700" text-anchor="middle" class="svg-scalable-text">調速器 (Governor)</text>
              <text x="532" y="238" fill="#ca8a04" data-base-size="9" font-weight="700" text-anchor="middle" class="svg-scalable-text">📚 5篇技術逐字稿</text>

              <circle cx="585" cy="190" r="13" fill="#eab308" />
              <text x="585" y="195" fill="#0f172a" data-base-size="11" font-weight="900" text-anchor="middle" class="svg-scalable-text">8</text>
            </g>

            <!-- 9. GENERATOR / ALTERNATOR & GRID - 3 TRANSCRIPTS -->
            <g class="plant-node" data-id="generator" id="node-generator">
              <rect x="640" y="275" width="150" height="175" rx="10" fill="url(#genGrad)" stroke="#facc15" stroke-width="3" filter="drop-shadow(0 4px 12px rgba(250,204,21,0.25))" />
              <circle cx="715" cy="345" r="48" fill="#1e293b" stroke="#e2e8f0" stroke-width="3" />
              <circle cx="715" cy="345" r="28" fill="#334155" stroke="#facc15" stroke-width="2" stroke-dasharray="6 4" />
              <circle cx="715" cy="345" r="10" fill="#facc15" />

              <text x="715" y="410" fill="#fef08a" data-base-size="13" font-weight="700" text-anchor="middle" class="svg-scalable-text">交流同步發電機</text>
              <text x="715" y="426" fill="#cbd5e1" data-base-size="10" text-anchor="middle" class="svg-scalable-text">Alternator / Generator</text>

              <!-- Badge -->
              <rect x="670" y="433" width="90" height="18" rx="9" fill="rgba(250, 204, 21, 0.2)" stroke="#facc15" stroke-width="1" />
              <text x="715" y="445" fill="#fef08a" data-base-size="9.5" font-weight="700" text-anchor="middle" class="svg-scalable-text">📚 3篇技術逐字稿</text>

              <!-- Transformer & Grid -->
              <rect x="910" y="215" width="130" height="90" rx="8" fill="#1e293b" stroke="#eab308" stroke-width="2" />
              <text x="975" y="245" fill="#facc15" data-base-size="12" font-weight="700" text-anchor="middle" class="svg-scalable-text">主變壓器與電網</text>
              <text x="975" y="265" fill="#94a3b8" data-base-size="10" text-anchor="middle" class="svg-scalable-text">Step-up Transformer</text>
              <text x="975" y="285" fill="#38bdf8" data-base-size="10" font-weight="600" text-anchor="middle" class="svg-scalable-text">3-Phase Grid (並網)</text>

              <circle cx="715" cy="275" r="14" fill="#facc15" />
              <text x="715" y="280" fill="#0f172a" data-base-size="12" font-weight="900" text-anchor="middle" class="svg-scalable-text">9</text>
            </g>
          </svg>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Flow toggle buttons
    const flowButtons = this.container.querySelectorAll(".flow-btn");
    flowButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const flow = btn.dataset.flow;
        const isActive = this.toggleFlow(flow);
        if (isActive) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    });

    // Font size controls
    const slider = this.container.querySelector("#diagram-font-scale-slider");
    if (slider) {
      slider.addEventListener("input", (e) => {
        this.setFontScale(parseInt(e.target.value, 10));
      });
    }

    const btnDown = this.container.querySelector("#btn-font-scale-down");
    if (btnDown) {
      btnDown.addEventListener("click", () => {
        this.setFontScale(this.fontScale - 10);
      });
    }

    const btnUp = this.container.querySelector("#btn-font-scale-up");
    if (btnUp) {
      btnUp.addEventListener("click", () => {
        this.setFontScale(this.fontScale + 10);
      });
    }

    const btnReset = this.container.querySelector("#btn-font-scale-reset");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        this.setFontScale(100);
      });
    }

    // Node clicks
    const nodes = this.container.querySelectorAll(".plant-node");
    nodes.forEach(node => {
      node.addEventListener("click", () => {
        const id = node.dataset.id;
        this.selectComponent(id);
      });
    });
  }
}
