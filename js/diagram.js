/**
 * Interactive Diesel Power Plant Layout & Flow Visualizer
 * Handles SVG interactive schematic, particle animations, component clicks, and flows
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
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
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
            <span class="toolbar-label"><i class="fas fa-project-diagram"></i> 動態流動模擬:</span>
            <button class="flow-btn active" data-flow="fuel"><span class="flow-indicator fuel"></span> 燃油流 (Fuel)</button>
            <button class="flow-btn active" data-flow="air"><span class="flow-indicator air"></span> 進/排氣流 (Air/Exhaust)</button>
            <button class="flow-btn active" data-flow="cooling"><span class="flow-indicator cooling"></span> 冷卻水流 (Cooling)</button>
            <button class="flow-btn active" data-flow="lube"><span class="flow-indicator lube"></span> 潤滑機油 (Lube Oil)</button>
            <button class="flow-btn active" data-flow="power"><span class="flow-indicator power"></span> 電能輸出 (Electric)</button>
          </div>
          <div class="diagram-hint">
            <i class="fas fa-mouse-pointer"></i> 點選圖中任意組件檢視工程技術詳解
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
              <path class="pipe-bg" d="M 450 460 L 450 590 L 320 590 L 320 460" stroke="#15803d" stroke-width="5" />
              <path class="flow-path-lube animating" d="M 450 460 L 450 590 L 320 590 L 320 460" stroke="#22c55e" stroke-width="3" stroke-dasharray="6 6" />

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

            <!-- 1. DIESEL ENGINE (CORE) -->
            <g class="plant-node selected" data-id="engine" id="node-engine">
              <rect x="410" y="270" width="160" height="180" rx="10" fill="url(#engineGrad)" stroke="#38bdf8" stroke-width="3" filter="drop-shadow(0 4px 12px rgba(56,189,248,0.3))" />
              <!-- Engine Cylinders Graphic -->
              <rect x="430" y="290" width="30" height="50" rx="4" fill="#1e293b" stroke="#64748b" />
              <rect x="475" y="290" width="30" height="50" rx="4" fill="#1e293b" stroke="#64748b" />
              <rect x="520" y="290" width="30" height="50" rx="4" fill="#1e293b" stroke="#64748b" />
              <!-- Pistons and valves indication -->
              <line x1="445" y1="315" x2="445" y2="340" stroke="#f59e0b" stroke-width="3" />
              <line x1="490" y1="305" x2="490" y2="340" stroke="#ef4444" stroke-width="3" />
              <line x1="535" y1="325" x2="535" y2="340" stroke="#10b981" stroke-width="3" />
              <!-- Flywheel -->
              <circle cx="560" cy="350" r="28" fill="#475569" stroke="#94a3b8" stroke-width="3" />
              <circle cx="560" cy="350" r="10" fill="#1e293b" stroke="#cbd5e1" stroke-width="2" />
              
              <text x="490" y="380" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle">柴油發電機組引擎</text>
              <text x="490" y="400" fill="#94a3b8" font-size="11" text-anchor="middle">Diesel Engine (Prime Mover)</text>
              <text x="490" y="425" fill="#38bdf8" font-size="11" font-weight="600" text-anchor="middle">4-Stroke C.I. 壓燃式</text>
              <circle cx="490" cy="270" r="14" fill="#38bdf8" />
              <text x="490" y="275" fill="#0f172a" font-size="12" font-weight="900" text-anchor="middle">1</text>
            </g>

            <!-- 2. FUEL SYSTEM (TANKS & PUMP) -->
            <g class="plant-node" data-id="fuel_system" id="node-fuel">
              <!-- Main Fuel Tank -->
              <rect x="30" y="470" width="90" height="100" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
              <path d="M 30 495 L 120 495" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="2 2" />
              <text x="75" y="525" fill="#fef08a" font-size="12" font-weight="700" text-anchor="middle">主儲油槽</text>
              <text x="75" y="542" fill="#94a3b8" font-size="10" text-anchor="middle">Storage Tank</text>

              <!-- Day Tank -->
              <rect x="220" y="200" width="80" height="75" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
              <rect x="230" y="235" width="60" height="30" rx="3" fill="#b45309" opacity="0.6" />
              <text x="260" y="222" fill="#fef08a" font-size="11" font-weight="700" text-anchor="middle">日用油箱</text>
              <text x="260" y="248" fill="#ffffff" font-size="9" text-anchor="middle">Day Tank (8h)</text>

              <!-- Fuel Injection Pump -->
              <rect x="320" y="305" width="55" height="45" rx="5" fill="#292524" stroke="#d97706" stroke-width="2" />
              <text x="347" y="328" fill="#fbbf24" font-size="10" font-weight="700" text-anchor="middle">噴油泵</text>
              <text x="347" y="342" fill="#a8a29e" font-size="8" text-anchor="middle">HP Pump</text>

              <circle cx="260" cy="195" r="13" fill="#f59e0b" />
              <text x="260" y="200" fill="#0f172a" font-size="11" font-weight="900" text-anchor="middle">2</text>
            </g>

            <!-- 3. AIR INTAKE & TURBOCHARGER -->
            <g class="plant-node" data-id="air_intake" id="node-air">
              <!-- Air Filter -->
              <rect x="180" y="55" width="95" height="55" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
              <path d="M 195 65 L 195 100 M 210 65 L 210 100 M 225 65 L 225 100 M 240 65 L 240 100 M 255 65 L 255 100" stroke="#0284c7" stroke-width="2" />
              <text x="227" y="103" fill="#e0f2fe" font-size="10" font-weight="700" text-anchor="middle">空氣濾清器 Filter</text>

              <!-- Turbocharger (Compressor & Intercooler) -->
              <circle cx="370" cy="140" r="28" fill="#1e293b" stroke="#0ea5e9" stroke-width="2.5" />
              <path d="M 355 140 A 15 15 0 0 1 385 140" stroke="#38bdf8" stroke-width="3" fill="none" />
              <text x="370" y="180" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">渦輪增壓器 (壓氣端)</text>
              
              <!-- Intercooler -->
              <rect x="430" y="115" width="60" height="45" rx="5" fill="#1e293b" stroke="#0ea5e9" stroke-width="2" />
              <path d="M 440 125 L 480 125 M 440 135 L 480 135 M 440 145 L 480 145" stroke="#38bdf8" stroke-width="2" />
              <text x="460" y="172" fill="#7dd3fc" font-size="9" text-anchor="middle">中冷器 Intercooler</text>

              <circle cx="275" cy="55" r="13" fill="#38bdf8" />
              <text x="275" y="60" fill="#0f172a" font-size="11" font-weight="900" text-anchor="middle">3</text>
            </g>

            <!-- 4. EXHAUST & SILENCER -->
            <g class="plant-node" data-id="exhaust_system" id="node-exhaust">
              <!-- Turbocharger Turbine -->
              <circle cx="520" cy="140" r="24" fill="#3f1414" stroke="#ef4444" stroke-width="2" />
              <text x="520" y="144" fill="#fca5a5" font-size="9" font-weight="700" text-anchor="middle">排氣渦輪</text>

              <!-- Silencer / Muffler -->
              <rect x="585" y="65" width="70" height="90" rx="16" fill="#2d1515" stroke="#ef4444" stroke-width="2.5" />
              <line x1="600" y1="85" x2="640" y2="85" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />
              <line x1="600" y1="110" x2="640" y2="110" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />
              <line x1="600" y1="135" x2="640" y2="135" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />
              <text x="620" y="105" fill="#fecaca" font-size="11" font-weight="700" text-anchor="middle">消音器</text>
              <text x="620" y="122" fill="#f87171" font-size="9" text-anchor="middle">Silencer</text>

              <!-- Stack -->
              <polygon points="615,65 625,65 628,25 612,25" fill="#475569" stroke="#ef4444" stroke-width="1.5" />
              <path d="M 620 20 Q 615 10 630 5" stroke="#94a3b8" stroke-width="2" stroke-dasharray="2 2" fill="none" opacity="0.6" />

              <circle cx="655" cy="65" r="13" fill="#ef4444" />
              <text x="655" y="70" fill="#ffffff" font-size="11" font-weight="900" text-anchor="middle">4</text>
            </g>

            <!-- 5. COOLING SYSTEM (TOWER & PUMP) -->
            <g class="plant-node" data-id="cooling_system" id="node-cooling">
              <!-- Cooling Tower -->
              <polygon points="730,470 760,450 820,450 850,470 860,600 720,600" fill="#152b3c" stroke="#06b6d4" stroke-width="2" />
              <!-- Water fan on top -->
              <ellipse cx="790" cy="455" rx="25" ry="8" fill="#0e7490" stroke="#22d3ee" stroke-width="1.5" />
              <line x1="775" y1="455" x2="805" y2="455" stroke="#ffffff" stroke-width="2" />
              <!-- Packing splash effect -->
              <path d="M 740 500 Q 790 520 840 500 M 745 530 Q 790 550 835 530" stroke="#0891b2" stroke-width="2" fill="none" stroke-dasharray="4 3" />
              <text x="790" y="565" fill="#cffafe" font-size="12" font-weight="700" text-anchor="middle">冷卻水塔 / 散熱水箱</text>
              <text x="790" y="582" fill="#67e8f9" font-size="10" text-anchor="middle">Cooling Tower & Pump</text>

              <circle cx="790" cy="435" r="13" fill="#06b6d4" />
              <text x="790" y="440" fill="#0f172a" font-size="11" font-weight="900" text-anchor="middle">5</text>
            </g>

            <!-- 6. LUBRICATION SYSTEM -->
            <g class="plant-node" data-id="lubrication_system" id="node-lube">
              <!-- Oil Sump / Sump Tank -->
              <rect x="290" y="560" width="180" height="65" rx="8" fill="#142e1d" stroke="#22c55e" stroke-width="2" />
              <circle cx="340" cy="592" r="16" fill="#166534" stroke="#4ade80" stroke-width="1.5" />
              <text x="340" y="596" fill="#ffffff" font-size="8" text-anchor="middle">油泵</text>
              <rect x="380" y="575" width="45" height="35" rx="4" fill="#14532d" stroke="#4ade80" stroke-width="1.5" />
              <text x="402" y="595" fill="#86efac" font-size="8" text-anchor="middle">油冷器</text>
              <text x="390" y="640" fill="#86efac" font-size="11" font-weight="700" text-anchor="middle">潤滑油槽 (Sump / Tank) & 機油泵</text>

              <circle cx="285" cy="565" r="13" fill="#22c55e" />
              <text x="285" y="570" fill="#0f172a" font-size="11" font-weight="900" text-anchor="middle">6</text>
            </g>

            <!-- 7. STARTING & STOPPING SYSTEM -->
            <g class="plant-node" data-id="starting_system" id="node-start">
              <!-- Air Storage Bottle / Receiver -->
              <rect x="50" y="130" width="65" height="110" rx="18" fill="#2e1065" stroke="#a855f7" stroke-width="2" />
              <!-- Gauge -->
              <circle cx="82" cy="155" r="12" fill="#1e1b4b" stroke="#c084fc" stroke-width="1.5" />
              <line x1="82" y1="155" x2="88" y2="150" stroke="#f43f5e" stroke-width="2" />
              <text x="82" y="195" fill="#f3e8ff" font-size="10" font-weight="700" text-anchor="middle">高壓儲氣罐</text>
              <text x="82" y="210" fill="#c084fc" font-size="9" text-anchor="middle">30 bar Air</text>
              <!-- Air Compressor -->
              <rect x="40" y="70" width="85" height="42" rx="5" fill="#1e1b4b" stroke="#a855f7" stroke-width="1.5" />
              <text x="82" y="94" fill="#e9d5ff" font-size="9" font-weight="600" text-anchor="middle">啟動空壓機</text>

              <circle cx="120" cy="130" r="13" fill="#a855f7" />
              <text x="120" y="135" fill="#ffffff" font-size="11" font-weight="900" text-anchor="middle">7</text>
            </g>

            <!-- 8. GOVERNING SYSTEM -->
            <g class="plant-node" data-id="governing_system" id="node-governor">
              <rect x="490" y="195" width="85" height="50" rx="6" fill="#3b2d13" stroke="#eab308" stroke-width="2" />
              <!-- Flyball / Sensor icon -->
              <circle cx="515" cy="215" r="7" fill="#ca8a04" />
              <circle cx="545" cy="215" r="7" fill="#ca8a04" />
              <line x1="515" y1="215" x2="545" y2="215" stroke="#fef08a" stroke-width="2" />
              <text x="532" y="235" fill="#fef08a" font-size="10" font-weight="700" text-anchor="middle">調速器 (Governor)</text>

              <circle cx="580" cy="200" r="13" fill="#eab308" />
              <text x="580" y="205" fill="#0f172a" font-size="11" font-weight="900" text-anchor="middle">8</text>
            </g>

            <!-- 9. GENERATOR / ALTERNATOR -->
            <g class="plant-node" data-id="generator" id="node-generator">
              <rect x="640" y="280" width="150" height="160" rx="10" fill="url(#genGrad)" stroke="#facc15" stroke-width="3" filter="drop-shadow(0 4px 12px rgba(250,204,21,0.25))" />
              <!-- Stator/Rotor graphic -->
              <circle cx="715" cy="350" r="50" fill="#1e293b" stroke="#e2e8f0" stroke-width="3" />
              <circle cx="715" cy="350" r="30" fill="#334155" stroke="#facc15" stroke-width="2" stroke-dasharray="6 4" />
              <circle cx="715" cy="350" r="10" fill="#facc15" />

              <text x="715" y="415" fill="#fef08a" font-size="13" font-weight="700" text-anchor="middle">交流同步發電機</text>
              <text x="715" y="430" fill="#cbd5e1" font-size="10" text-anchor="middle">Alternator / Generator</text>

              <!-- Transformer & Grid -->
              <rect x="910" y="220" width="130" height="85" rx="8" fill="#1e293b" stroke="#eab308" stroke-width="2" />
              <text x="975" y="250" fill="#facc15" font-size="12" font-weight="700" text-anchor="middle">主變壓器與電網</text>
              <text x="975" y="270" fill="#94a3b8" font-size="10" text-anchor="middle">Step-up Transformer</text>
              <text x="975" y="290" fill="#38bdf8" font-size="10" font-weight="600" text-anchor="middle">3-Phase Grid (並網)</text>

              <circle cx="715" cy="280" r="14" fill="#facc15" />
              <text x="715" y="285" fill="#0f172a" font-size="12" font-weight="900" text-anchor="middle">9</text>
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
