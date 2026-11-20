/**
 * Interactive Diesel Power Plant Operating Simulator
 * Simulates engine-governor-alternator load responses, thermodynamic outputs and safety interlocks
 */

class PlantSimulator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = {
      ratedPowerKW: 2000,     // 2 MW rated
      loadKW: 1500,           // Current load 75%
      nominalFreq: 50,        // 50 Hz
      targetRPM: 1500,        // 1500 RPM
      ambientTemp: 25,        // 25°C
      boostBar: 2.2,          // 2.2 bar boost
      running: true,
      droopPercent: 4.0,      // 4% governor droop
      
      // Dynamic outputs
      actualRPM: 1500,
      actualFreq: 50.00,
      thermalEfficiency: 42.5,
      bsfc: 198,              // g/kWh
      fuelFlowLitersPerHour: 345,
      exhaustTempC: 485,
      coolingWaterTempC: 84.5,
      lubeOilPressureBar: 4.8,
      status: "NORMAL_RUNNING"
    };

    this.timer = null;
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
    this.calculateOutputs();
    this.startLoop();
  }

  render() {
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-header">
          <div class="sim-title-group">
            <h3><i class="fas fa-sliders-h"></i> 柴油發電機組動態運轉與熱力參數模擬實驗室</h3>
            <p>調控負載、增壓比與環境條件，觀察調速器頻率響應、燃油消耗率 (BSFC) 與熱平衡參數變化</p>
          </div>
          <div class="sim-quick-actions">
            <button class="btn btn-outline" id="sim-btn-step-load"><i class="fas fa-bolt"></i> 突加 400 kW 負載</button>
            <button class="btn btn-outline" id="sim-btn-step-drop"><i class="fas fa-arrow-down"></i> 突卸 400 kW 負載</button>
            <button class="btn btn-danger" id="sim-btn-trip"><i class="fas fa-skull-crossbones"></i> 緊急停機 (E-Trip)</button>
            <button class="btn btn-primary" id="sim-btn-restart"><i class="fas fa-play"></i> 重新啟動</button>
          </div>
        </div>

        <div class="sim-grid">
          <!-- Controls Column -->
          <div class="sim-card controls-card">
            <h4><i class="fas fa-wrench"></i> 運轉輸入參數控制</h4>
            
            <div class="control-group">
              <div class="control-label">
                <span>電網負載需求 (Electrical Load)</span>
                <span class="value-display" id="val-load">1500 kW (75%)</span>
              </div>
              <input type="range" min="0" max="2200" step="50" value="1500" id="slider-load" class="sim-slider">
              <div class="slider-marks">
                <span>0 kW (空載)</span>
                <span>1000 kW (50%)</span>
                <span>2000 kW (額定)</span>
                <span class="text-danger">2200 (超載)</span>
              </div>
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>渦輪增壓壓力 (Boost Pressure)</span>
                <span class="value-display" id="val-boost">2.2 bar</span>
              </div>
              <input type="range" min="1.0" max="3.2" step="0.1" value="2.2" id="slider-boost" class="sim-slider">
              <div class="slider-marks">
                <span>1.0 bar (自然進氣)</span>
                <span>2.0 bar (常用)</span>
                <span>3.2 bar (極限增壓)</span>
              </div>
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>進氣環境溫度 (Ambient Temp)</span>
                <span class="value-display" id="val-ambient">25 °C</span>
              </div>
              <input type="range" min="-10" max="50" step="1" value="25" id="slider-ambient" class="sim-slider">
              <div class="slider-marks">
                <span>-10 °C</span>
                <span>25 °C (標準)</span>
                <span>50 °C (沙漠極端)</span>
              </div>
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>調速器下垂率 (Governor Droop)</span>
                <span class="value-display" id="val-droop">4.0 %</span>
              </div>
              <input type="range" min="0" max="6" step="0.5" value="4.0" id="slider-droop" class="sim-slider">
              <div class="slider-marks">
                <span>0% (等時模式/單機)</span>
                <span>4.0% (電網並聯推薦)</span>
                <span>6.0%</span>
              </div>
            </div>
          </div>

          <!-- Meters & Gauges Column -->
          <div class="sim-card metrics-card">
            <h4><i class="fas fa-tachometer-alt"></i> 即時遙測儀表與熱平衡指標</h4>

            <div class="gauges-grid">
              <!-- Frequency Gauge -->
              <div class="gauge-box">
                <div class="gauge-title">電網頻率 / 轉速</div>
                <div class="gauge-value" id="disp-freq">50.00 <span class="unit">Hz</span></div>
                <div class="gauge-sub" id="disp-rpm">1500 RPM</div>
                <div class="gauge-bar-track">
                  <div class="gauge-bar-fill" id="bar-freq" style="width: 50%;"></div>
                </div>
              </div>

              <!-- Thermal Efficiency Gauge -->
              <div class="gauge-box">
                <div class="gauge-title">發電機組制動熱效率</div>
                <div class="gauge-value text-accent" id="disp-eff">42.5 <span class="unit">%</span></div>
                <div class="gauge-sub" id="disp-bsfc">BSFC: 198 g/kWh</div>
                <div class="gauge-bar-track">
                  <div class="gauge-bar-fill fill-green" id="bar-eff" style="width: 85%;"></div>
                </div>
              </div>

              <!-- Fuel Consumption -->
              <div class="gauge-box">
                <div class="gauge-title">柴油即時消耗量</div>
                <div class="gauge-value" id="disp-fuel">345 <span class="unit">L/h</span></div>
                <div class="gauge-sub" id="disp-fuel-mass">293.2 kg/h</div>
                <div class="gauge-bar-track">
                  <div class="gauge-bar-fill fill-amber" id="bar-fuel" style="width: 68%;"></div>
                </div>
              </div>

              <!-- Exhaust Temperature -->
              <div class="gauge-box">
                <div class="gauge-title">排氣總管溫度</div>
                <div class="gauge-value" id="disp-exhaust">485 <span class="unit">°C</span></div>
                <div class="gauge-sub">安全極限: &lt; 620°C</div>
                <div class="gauge-bar-track">
                  <div class="gauge-bar-fill fill-red" id="bar-exhaust" style="width: 78%;"></div>
                </div>
              </div>

              <!-- Cooling Water Temp -->
              <div class="gauge-box">
                <div class="gauge-title">氣缸套冷卻出水溫度</div>
                <div class="gauge-value" id="disp-water">84.5 <span class="unit">°C</span></div>
                <div class="gauge-sub">恆溫器設定: 82-88°C</div>
                <div class="gauge-bar-track">
                  <div class="gauge-bar-fill fill-cyan" id="bar-water" style="width: 70%;"></div>
                </div>
              </div>

              <!-- Lube Oil Pressure -->
              <div class="gauge-box">
                <div class="gauge-title">主軸承潤滑機油壓力</div>
                <div class="gauge-value" id="disp-oil">4.8 <span class="unit">bar</span></div>
                <div class="gauge-sub">低油壓跳脫警報: &lt; 2.5 bar</div>
                <div class="gauge-bar-track">
                  <div class="gauge-bar-fill fill-green" id="bar-oil" style="width: 80%;"></div>
                </div>
              </div>
            </div>

            <!-- Interlock / Status banner -->
            <div class="sim-status-banner status-normal" id="sim-status-box">
              <i class="fas fa-shield-alt"></i>
              <span id="sim-status-text">機組運轉正常 (Normal Continuous Rating) - 負載率 75.0%</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const sliderLoad = this.container.querySelector("#slider-load");
    const sliderBoost = this.container.querySelector("#slider-boost");
    const sliderAmbient = this.container.querySelector("#slider-ambient");
    const sliderDroop = this.container.querySelector("#slider-droop");

    sliderLoad.addEventListener("input", (e) => {
      this.state.loadKW = parseFloat(e.target.value);
      this.container.querySelector("#val-load").innerText = `${this.state.loadKW} kW (${((this.state.loadKW/this.state.ratedPowerKW)*100).toFixed(0)}%)`;
      this.calculateOutputs();
    });

    sliderBoost.addEventListener("input", (e) => {
      this.state.boostBar = parseFloat(e.target.value);
      this.container.querySelector("#val-boost").innerText = `${this.state.boostBar.toFixed(1)} bar`;
      this.calculateOutputs();
    });

    sliderAmbient.addEventListener("input", (e) => {
      this.state.ambientTemp = parseFloat(e.target.value);
      this.container.querySelector("#val-ambient").innerText = `${this.state.ambientTemp} °C`;
      this.calculateOutputs();
    });

    sliderDroop.addEventListener("input", (e) => {
      this.state.droopPercent = parseFloat(e.target.value);
      this.container.querySelector("#val-droop").innerText = `${this.state.droopPercent.toFixed(1)} %`;
      this.calculateOutputs();
    });

    this.container.querySelector("#sim-btn-step-load").addEventListener("click", () => {
      this.state.loadKW = Math.min(2200, this.state.loadKW + 400);
      sliderLoad.value = this.state.loadKW;
      this.container.querySelector("#val-load").innerText = `${this.state.loadKW} kW (${((this.state.loadKW/this.state.ratedPowerKW)*100).toFixed(0)}%)`;
      this.calculateOutputs();
    });

    this.container.querySelector("#sim-btn-step-drop").addEventListener("click", () => {
      this.state.loadKW = Math.max(0, this.state.loadKW - 400);
      sliderLoad.value = this.state.loadKW;
      this.container.querySelector("#val-load").innerText = `${this.state.loadKW} kW (${((this.state.loadKW/this.state.ratedPowerKW)*100).toFixed(0)}%)`;
      this.calculateOutputs();
    });

    this.container.querySelector("#sim-btn-trip").addEventListener("click", () => {
      this.state.running = false;
      this.calculateOutputs();
    });

    this.container.querySelector("#sim-btn-restart").addEventListener("click", () => {
      this.state.running = true;
      this.calculateOutputs();
    });
  }

  calculateOutputs() {
    if (!this.state.running) {
      this.state.actualRPM = 0;
      this.state.actualFreq = 0;
      this.state.thermalEfficiency = 0;
      this.state.bsfc = 0;
      this.state.fuelFlowLitersPerHour = 0;
      this.state.exhaustTempC = this.state.ambientTemp;
      this.state.coolingWaterTempC = this.state.ambientTemp;
      this.state.lubeOilPressureBar = 0;
      this.state.status = "TRIPPED";
      this.updateUI();
      return;
    }

    const loadRatio = this.state.loadKW / this.state.ratedPowerKW; // 0.0 to 1.1

    // Frequency & RPM calculation with Governor Droop
    // Frequency drops by droopPercent at 100% load
    const freqOffset = (this.state.droopPercent / 100) * (loadRatio - 0.5) * this.state.nominalFreq;
    this.state.actualFreq = parseFloat((this.state.nominalFreq - freqOffset).toFixed(2));
    this.state.actualRPM = Math.round((this.state.actualFreq / this.state.nominalFreq) * this.state.targetRPM);

    // Thermal efficiency: typically peaks around 75-85% load, drops at idle and severe overload
    let baseEff = 43.0;
    if (loadRatio < 0.2) {
      baseEff = 22.0 + loadRatio * 50;
    } else if (loadRatio < 0.8) {
      baseEff = 32.0 + (loadRatio - 0.2) * 18.3;
    } else if (loadRatio <= 1.0) {
      baseEff = 43.0 - (loadRatio - 0.8) * 5.0;
    } else {
      baseEff = 42.0 - (loadRatio - 1.0) * 20.0;
    }

    // Boost effect: insufficient boost at high load reduces efficiency and raises exhaust temp
    const boostDeficit = Math.max(0, (loadRatio * 2.5) - this.state.boostBar);
    baseEff -= boostDeficit * 3.5;

    // Ambient penalty: high ambient reduces air density
    const tempPenalty = Math.max(0, (this.state.ambientTemp - 25) * 0.08);
    baseEff -= tempPenalty;

    this.state.thermalEfficiency = Math.max(15, Math.min(46.5, parseFloat(baseEff.toFixed(1))));

    // BSFC (g/kWh) = 3600 / (Heating Value * eff)
    // Diesel Lower Heating Value ≈ 42.6 MJ/kg = 11.83 kWh/kg
    const dieselLHV = 11.83; // kWh/kg
    if (this.state.loadKW > 0) {
      const kgKWh = 1 / (dieselLHV * (this.state.thermalEfficiency / 100));
      this.state.bsfc = Math.round(kgKWh * 1000);
      const fuelMassPerHour = (this.state.bsfc * this.state.loadKW) / 1000; // kg/h
      // Diesel density ~ 0.84 kg/L
      this.state.fuelFlowLitersPerHour = Math.round(fuelMassPerHour / 0.84);
    } else {
      this.state.bsfc = 0;
      this.state.fuelFlowLitersPerHour = 18; // Idle standby fuel
    }

    // Exhaust Gas Temp (°C)
    let exhaustBase = 200 + (loadRatio * 320) + (boostDeficit * 70) + (this.state.ambientTemp * 0.4);
    this.state.exhaustTempC = Math.round(exhaustBase);

    // Cooling water temp
    let waterTemp = 75 + (loadRatio * 15) + (this.state.ambientTemp > 35 ? (this.state.ambientTemp - 35) * 0.3 : 0);
    this.state.coolingWaterTempC = parseFloat(waterTemp.toFixed(1));

    // Lube oil pressure
    let oilPress = 3.2 + (this.state.actualRPM / 1500) * 1.8;
    this.state.lubeOilPressureBar = parseFloat(oilPress.toFixed(1));

    // Status evaluation
    if (loadRatio > 1.05) {
      this.state.status = "OVERLOAD_WARNING";
    } else if (this.state.exhaustTempC > 580) {
      this.state.status = "HIGH_EXHAUST_TEMP";
    } else {
      this.state.status = "NORMAL_RUNNING";
    }

    this.updateUI();
  }

  updateUI() {
    const dispFreq = this.container.querySelector("#disp-freq");
    const dispRpm = this.container.querySelector("#disp-rpm");
    const dispEff = this.container.querySelector("#disp-eff");
    const dispBsfc = this.container.querySelector("#disp-bsfc");
    const dispFuel = this.container.querySelector("#disp-fuel");
    const dispFuelMass = this.container.querySelector("#disp-fuel-mass");
    const dispExhaust = this.container.querySelector("#disp-exhaust");
    const dispWater = this.container.querySelector("#disp-water");
    const dispOil = this.container.querySelector("#disp-oil");
    const statusBox = this.container.querySelector("#sim-status-box");
    const statusText = this.container.querySelector("#sim-status-text");

    if (!this.state.running) {
      dispFreq.innerHTML = `0.00 <span class="unit">Hz</span>`;
      dispRpm.innerText = `0 RPM (停機中)`;
      dispEff.innerHTML = `0.0 <span class="unit">%</span>`;
      dispBsfc.innerText = `BSFC: 0 g/kWh`;
      dispFuel.innerHTML = `0 <span class="unit">L/h</span>`;
      dispFuelMass.innerText = `0 kg/h`;
      dispExhaust.innerHTML = `${this.state.ambientTemp} <span class="unit">°C</span>`;
      dispWater.innerHTML = `${this.state.ambientTemp} <span class="unit">°C</span>`;
      dispOil.innerHTML = `0.0 <span class="unit">bar</span>`;

      statusBox.className = "sim-status-banner status-danger";
      statusText.innerHTML = `<strong>機組已觸發緊急停機 (E-TRIP)</strong> - 燃油已切斷，進氣阻尼閥關閉`;
      return;
    }

    dispFreq.innerHTML = `${this.state.actualFreq.toFixed(2)} <span class="unit">Hz</span>`;
    dispRpm.innerText = `${this.state.actualRPM} RPM`;
    dispEff.innerHTML = `${this.state.thermalEfficiency.toFixed(1)} <span class="unit">%</span>`;
    dispBsfc.innerText = `BSFC: ${this.state.bsfc} g/kWh`;
    dispFuel.innerHTML = `${this.state.fuelFlowLitersPerHour} <span class="unit">L/h</span>`;
    dispFuelMass.innerText = `${(this.state.fuelFlowLitersPerHour * 0.84).toFixed(1)} kg/h`;
    dispExhaust.innerHTML = `${this.state.exhaustTempC} <span class="unit">°C</span>`;
    dispWater.innerHTML = `${this.state.coolingWaterTempC} <span class="unit">°C</span>`;
    dispOil.innerHTML = `${this.state.lubeOilPressureBar} <span class="unit">bar</span>`;

    // Bar fills
    this.container.querySelector("#bar-freq").style.width = `${Math.min(100, (this.state.actualFreq / 55) * 100)}%`;
    this.container.querySelector("#bar-eff").style.width = `${Math.min(100, (this.state.thermalEfficiency / 50) * 100)}%`;
    this.container.querySelector("#bar-fuel").style.width = `${Math.min(100, (this.state.fuelFlowLitersPerHour / 550) * 100)}%`;
    this.container.querySelector("#bar-exhaust").style.width = `${Math.min(100, (this.state.exhaustTempC / 650) * 100)}%`;
    this.container.querySelector("#bar-water").style.width = `${Math.min(100, (this.state.coolingWaterTempC / 100) * 100)}%`;
    this.container.querySelector("#bar-oil").style.width = `${Math.min(100, (this.state.lubeOilPressureBar / 6) * 100)}%`;

    const loadPct = ((this.state.loadKW / this.state.ratedPowerKW) * 100).toFixed(1);
    if (this.state.status === "OVERLOAD_WARNING") {
      statusBox.className = "sim-status-banner status-warning";
      statusText.innerHTML = `<strong>⚠️ 機組超載警戒 (${loadPct}%)</strong> - 請降負載或啟用輔助備用發電機組`;
    } else if (this.state.status === "HIGH_EXHAUST_TEMP") {
      statusBox.className = "sim-status-banner status-warning";
      statusText.innerHTML = `<strong>⚠️ 排氣總管超溫警報 (${this.state.exhaustTempC}°C)</strong> - 空燃比不足，請提升增壓壓力或檢查中冷器`;
    } else {
      statusBox.className = "sim-status-banner status-normal";
      statusText.innerHTML = `<strong>機組運轉正常 (Continuous Rating)</strong> - 負載率: ${loadPct}% | 轉速穩定性: 優良`;
    }
  }

  startLoop() {
    if (this.timer) clearInterval(this.timer);
    // Subtle real-world fluctuation simulation
    this.timer = setInterval(() => {
      if (this.state.running) {
        // Small random jitter on frequency ±0.03 Hz
        const jitter = (Math.random() - 0.5) * 0.04;
        const currentFreq = parseFloat(this.container.querySelector("#disp-freq").innerText);
        if (!isNaN(currentFreq)) {
          const fluctuated = (this.state.actualFreq + jitter).toFixed(2);
          this.container.querySelector("#disp-freq").innerHTML = `${fluctuated} <span class="unit">Hz</span>`;
        }
      }
    }, 2000);
  }
}
