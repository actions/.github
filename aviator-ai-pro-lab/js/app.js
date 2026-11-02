/**
 * Aviator AI Pro Lab - Main Application Controller
 */

class AviatorApp {
  constructor() {
    this.engine = new AviatorEngine(0.03);
    this.strategyEngine = new StrategyEngine();
    this.bankroll = 1000;
    this.initialBankroll = 1000;
    this.isSimulating = false;
    this.simSpeed = 100;
    this.simTimer = null;
    this.currentMultiplier = 1.0;
    this.crashPoints = [];
    this.bankrollHistory = [1000];
    this.profitChart = null;
    this.crashChart = null;
    this.distributionChart = null;
    this.distributionBuckets = [0, 0, 0, 0, 0, 0];
    this.comparisonChart = null;
    this.selectedStrategy = 'fixed';
    this.backtestRounds = 500;

    this.init();
  }

  init() {
    this._setupEventListeners();
    this._populateStrategyCards();
    this._initCharts();
    this._generateInitialCrashData();
    this._updateDisplay();
  }

  _setupEventListeners() {
    document.getElementById('startSim').addEventListener('click', () => this.startLiveSimulation());
    document.getElementById('stopSim').addEventListener('click', () => this.stopSimulation());
    document.getElementById('resetSim').addEventListener('click', () => this.resetSimulation());
    document.getElementById('runBacktest').addEventListener('click', () => this.runBacktest());
    document.getElementById('optimizeStrategy').addEventListener('click', () => this.optimizeStrategy());
    document.getElementById('runComparison').addEventListener('click', () => this.runComparison());
    document.getElementById('simSpeed').addEventListener('input', (e) => {
      this.simSpeed = parseInt(e.target.value);
      document.getElementById('speedValue').textContent = this.simSpeed + 'ms';
    });
    document.getElementById('bankrollInput').addEventListener('change', (e) => {
      this.bankroll = parseFloat(e.target.value) || 1000;
      this.initialBankroll = this.bankroll;
      this.bankrollHistory = [this.bankroll];
    });
    document.getElementById('backtestRounds').addEventListener('change', (e) => {
      this.backtestRounds = parseInt(e.target.value) || 500;
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabGroup = e.target.closest('.tab-group');
        tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const target = e.target.dataset.tab;
        const container = tabGroup.nextElementSibling || tabGroup.parentElement;
        container.querySelectorAll('.tab-content').forEach(tc => {
          tc.classList.toggle('active', tc.id === target);
        });
      });
    });
  }

  _populateStrategyCards() {
    const grid = document.getElementById('strategyGrid');
    const strategies = this.strategyEngine.getStrategyList();

    grid.innerHTML = strategies.map(s => `
      <div class="strategy-card ${s.key === this.selectedStrategy ? 'selected' : ''}"
           data-strategy="${s.key}" onclick="app.selectStrategy('${s.key}')">
        <div class="strategy-icon">${s.icon}</div>
        <div class="strategy-name">${s.name}</div>
        <div class="strategy-desc">${s.description}</div>
        <div class="strategy-color" style="background: ${s.color}"></div>
      </div>
    `).join('');
  }

  selectStrategy(key) {
    this.selectedStrategy = key;
    document.querySelectorAll('.strategy-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.strategy === key);
    });
    this._updateParamPanel(key);
  }

  _updateParamPanel(key) {
    const strategy = this.strategyEngine.strategies[key];
    const panel = document.getElementById('strategyParams');
    if (!strategy) return;

    const paramHTML = Object.entries(strategy.params).map(([k, v]) => {
      if (Array.isArray(v)) return '';
      return `
        <div class="param-row">
          <label>${this._formatParamName(k)}</label>
          <input type="number" class="param-input" data-param="${k}"
                 value="${v}" step="${typeof v === 'number' && v < 1 ? '0.01' : '1'}"
                 onchange="app.updateParam('${key}', '${k}', this.value)">
        </div>
      `;
    }).join('');

    panel.innerHTML = `<h4>${strategy.icon} ${strategy.name} Parameters</h4>${paramHTML}`;
  }

  _formatParamName(name) {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }

  updateParam(strategyKey, param, value) {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      this.strategyEngine.strategies[strategyKey].params[param] = num;
    }
  }

  _initCharts() {
    const chartDefaults = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 }
    };

    this.profitChart = new Chart(document.getElementById('profitChart'), {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Bankroll',
          data: [],
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 2
        }]
      },
      options: {
        ...chartDefaults,
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
        },
        plugins: { legend: { labels: { color: '#ccc' } } }
      }
    });

    this.crashChart = new Chart(document.getElementById('crashChart'), {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Crash Point',
          data: [],
          backgroundColor: [],
          borderWidth: 0,
          borderRadius: 2
        }]
      },
      options: {
        ...chartDefaults,
        scales: {
          x: { grid: { display: false }, ticks: { color: '#8899aa', maxTicksLimit: 30 } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
        },
        plugins: { legend: { labels: { color: '#ccc' } } }
      }
    });

    this.distributionChart = new Chart(document.getElementById('distributionChart'), {
      type: 'doughnut',
      data: {
        labels: ['< 1.5x', '1.5-2x', '2-3x', '3-5x', '5-10x', '10x+'],
        datasets: [{
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'],
          borderWidth: 2,
          borderColor: '#0a0f1c'
        }]
      },
      options: {
        ...chartDefaults,
        plugins: {
          legend: { position: 'right', labels: { color: '#ccc', padding: 12 } }
        }
      }
    });

    this.comparisonChart = new Chart(document.getElementById('comparisonChart'), {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: {
        ...chartDefaults,
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa', maxTicksLimit: 20 } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
        },
        plugins: { legend: { labels: { color: '#ccc' } } }
      }
    });
  }

  _generateInitialCrashData() {
    this.crashPoints = this.engine.generateCrashHistory(100);
    this._updateCrashChart();

    // BOLT OPTIMIZATION: Initialize distribution buckets once
    this.distributionBuckets = [0, 0, 0, 0, 0, 0];
    this.crashPoints.forEach(c => this._incrementBucket(c));
    this._updateDistributionChart();
  }

  startLiveSimulation() {
    if (this.isSimulating) return;
    this.isSimulating = true;
    document.getElementById('startSim').disabled = true;
    document.getElementById('stopSim').disabled = false;
    document.getElementById('simStatus').textContent = 'LIVE';
    document.getElementById('simStatus').className = 'status-badge live';

    this._runSimulationStep();
  }

  _runSimulationStep() {
    if (!this.isSimulating) return;

    const strategy = this.strategyEngine.strategies[this.selectedStrategy];
    const params = strategy.params;

    const crashPoint = this.engine.generateCrashPoint();
    this.crashPoints.push(crashPoint);

    // BOLT OPTIMIZATION: Increment distribution bucket incrementally (O(1))
    this._incrementBucket(crashPoint);

    const cashOut = params.cashOut || 2.0;
    const betAmount = Math.min(params.baseBet || 10, this.bankroll);

    if (betAmount <= 0 || this.bankroll <= 0) {
      this.stopSimulation();
      document.getElementById('simStatus').textContent = 'BUST';
      document.getElementById('simStatus').className = 'status-badge bust';
      return;
    }

    const round = this.engine.simulateRound(betAmount, cashOut);
    this.bankroll += round.profit;
    this.bankrollHistory.push(parseFloat(this.bankroll.toFixed(2)));

    this._animateMultiplier(crashPoint, round);
    this._updateDisplay();
    this._updateCharts();
    this._addToHistory(round);

    this.simTimer = setTimeout(() => this._runSimulationStep(), this.simSpeed);
  }

  _animateMultiplier(crashPoint, round) {
    const display = document.getElementById('multiplierDisplay');
    const value = document.getElementById('multiplierValue');

    if (round.won) {
      display.className = 'multiplier-display win';
      value.textContent = round.cashOutAt.toFixed(2) + 'x';
    } else {
      display.className = 'multiplier-display crash';
      value.textContent = crashPoint.toFixed(2) + 'x';
    }

    setTimeout(() => { display.className = 'multiplier-display'; }, this.simSpeed * 0.8);
  }

  stopSimulation() {
    this.isSimulating = false;
    clearTimeout(this.simTimer);
    document.getElementById('startSim').disabled = false;
    document.getElementById('stopSim').disabled = true;
    document.getElementById('simStatus').textContent = 'STOPPED';
    document.getElementById('simStatus').className = 'status-badge stopped';
  }

  resetSimulation() {
    this.stopSimulation();
    this.engine.reset();
    this.bankroll = this.initialBankroll;
    this.bankrollHistory = [this.initialBankroll];
    this.crashPoints = [];
    this.distributionBuckets = [0, 0, 0, 0, 0, 0];
    this._generateInitialCrashData();
    this._updateDisplay();
    this._clearHistory();
    document.getElementById('multiplierValue').textContent = '1.00x';
    document.getElementById('multiplierDisplay').className = 'multiplier-display';
    document.getElementById('simStatus').textContent = 'READY';
    document.getElementById('simStatus').className = 'status-badge';
  }

  runBacktest() {
    const loading = document.getElementById('backtestLoading');
    loading.style.display = 'flex';

    setTimeout(() => {
      const crashData = this.engine.generateCrashHistory(this.backtestRounds);
      const result = this.strategyEngine.backtest(this.selectedStrategy, crashData, this.initialBankroll);

      this._displayBacktestResults(result);
      this._updateProfitChartFromBacktest(result);
      loading.style.display = 'none';
    }, 100);
  }

  _displayBacktestResults(result) {
    const el = document.getElementById('backtestResults');
    const profitClass = result.totalProfit >= 0 ? 'positive' : 'negative';

    el.innerHTML = `
      <div class="results-header">
        <h4>${result.strategy} - Backtest Results</h4>
        <span class="badge ${profitClass}">${result.totalProfit >= 0 ? '+' : ''}${result.totalProfit.toFixed(2)}</span>
      </div>
      <div class="results-grid">
        <div class="result-item">
          <div class="result-label">Rounds</div>
          <div class="result-value">${result.totalRounds}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Win Rate</div>
          <div class="result-value">${result.winRate}%</div>
        </div>
        <div class="result-item">
          <div class="result-label">ROI</div>
          <div class="result-value ${profitClass}">${result.roi > 0 ? '+' : ''}${result.roi}%</div>
        </div>
        <div class="result-item">
          <div class="result-label">Final Bankroll</div>
          <div class="result-value">$${result.finalBankroll.toFixed(2)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Peak Bankroll</div>
          <div class="result-value">$${result.peakBankroll}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Max Drawdown</div>
          <div class="result-value negative">$${result.maxDrawdown.toFixed(2)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Wins / Losses</div>
          <div class="result-value">${result.wins} / ${result.losses}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Survival Rate</div>
          <div class="result-value">${((result.totalRounds / this.backtestRounds) * 100).toFixed(1)}%</div>
        </div>
      </div>
    `;
  }

  _updateProfitChartFromBacktest(result) {
    const labels = result.results.map(r => r.round);
    const data = result.results.map(r => r.bankroll);
    const strategy = this.strategyEngine.strategies[this.selectedStrategy];

    this.profitChart.data.labels = labels;
    this.profitChart.data.datasets = [{
      label: `${strategy.name} Bankroll`,
      data: data,
      borderColor: strategy.color,
      backgroundColor: strategy.color + '20',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      borderWidth: 2
    }];
    this.profitChart.update();
  }

  optimizeStrategy() {
    const loading = document.getElementById('optimizerLoading');
    loading.style.display = 'flex';
    document.getElementById('optimizeStrategy').disabled = true;

    setTimeout(() => {
      const crashData = this.engine.generateCrashHistory(this.backtestRounds);
      const result = this.strategyEngine.optimize(this.selectedStrategy, crashData, this.initialBankroll, 80);

      this._displayOptimizationResults(result);
      loading.style.display = 'none';
      document.getElementById('optimizeStrategy').disabled = false;
    }, 200);
  }

  _displayOptimizationResults(result) {
    if (!result || !result.bestResult) {
      document.getElementById('optimizerResults').innerHTML = '<p class="no-data">Optimization could not find valid parameters.</p>';
      return;
    }

    const el = document.getElementById('optimizerResults');
    const profitClass = result.bestResult.totalProfit >= 0 ? 'positive' : 'negative';

    const paramsHTML = Object.entries(result.bestParams)
      .filter(([k, v]) => typeof v === 'number' || typeof v === 'string')
      .map(([k, v]) => `
        <div class="param-result">
          <span class="param-name">${this._formatParamName(k)}</span>
          <span class="param-val">${typeof v === 'number' ? v.toFixed ? v.toFixed(2) : v : v}</span>
        </div>
      `).join('');

    el.innerHTML = `
      <div class="results-header">
        <h4>Optimal Parameters Found</h4>
        <span class="badge ${profitClass}">ROI: ${result.bestResult.roi > 0 ? '+' : ''}${result.bestResult.roi}%</span>
      </div>
      <div class="optimizer-params">${paramsHTML}</div>
      <div class="results-grid">
        <div class="result-item">
          <div class="result-label">Optimized Profit</div>
          <div class="result-value ${profitClass}">$${result.bestResult.totalProfit.toFixed(2)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Win Rate</div>
          <div class="result-value">${result.bestResult.winRate}%</div>
        </div>
        <div class="result-item">
          <div class="result-label">Max Drawdown</div>
          <div class="result-value negative">$${result.bestResult.maxDrawdown.toFixed(2)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Iterations</div>
          <div class="result-value">${result.optimizationRuns}</div>
        </div>
      </div>
      <button class="btn btn-secondary" onclick="app.applyOptimizedParams()">Apply These Parameters</button>
    `;

    this._optimizedParams = result.bestParams;
  }

  applyOptimizedParams() {
    if (!this._optimizedParams) return;
    const strategy = this.strategyEngine.strategies[this.selectedStrategy];
    Object.assign(strategy.params, this._optimizedParams);
    this._updateParamPanel(this.selectedStrategy);
  }

  runComparison() {
    const loading = document.getElementById('comparisonLoading');
    loading.style.display = 'flex';

    setTimeout(() => {
      const crashData = this.engine.generateCrashHistory(this.backtestRounds);
      const strategies = Object.keys(this.strategyEngine.strategies);
      const datasets = [];
      const summaryRows = [];

      strategies.forEach(key => {
        const s = this.strategyEngine.strategies[key];
        const result = this.strategyEngine.backtest(key, crashData, this.initialBankroll);

        datasets.push({
          label: s.name,
          data: result.results.map(r => r.bankroll),
          borderColor: s.color,
          backgroundColor: 'transparent',
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 2
        });

        const profitClass = result.totalProfit >= 0 ? 'positive' : 'negative';
        summaryRows.push(`
          <tr>
            <td><span class="strategy-dot" style="background:${s.color}"></span>${s.icon} ${s.name}</td>
            <td class="${profitClass}">${result.totalProfit >= 0 ? '+' : ''}$${result.totalProfit.toFixed(2)}</td>
            <td>${result.winRate}%</td>
            <td class="${profitClass}">${result.roi > 0 ? '+' : ''}${result.roi}%</td>
            <td>$${result.maxDrawdown.toFixed(2)}</td>
            <td>${result.totalRounds}</td>
          </tr>
        `);
      });

      const maxLen = Math.max(...datasets.map(d => d.data.length));
      this.comparisonChart.data.labels = Array.from({ length: maxLen }, (_, i) => i + 1);
      this.comparisonChart.data.datasets = datasets;
      this.comparisonChart.update();

      document.getElementById('comparisonTable').innerHTML = `
        <table class="comparison-table">
          <thead>
            <tr><th>Strategy</th><th>Profit</th><th>Win Rate</th><th>ROI</th><th>Max DD</th><th>Rounds</th></tr>
          </thead>
          <tbody>${summaryRows.join('')}</tbody>
        </table>
      `;

      loading.style.display = 'none';
    }, 200);
  }

  _updateDisplay() {
    document.getElementById('currentBankroll').textContent = '$' + this.bankroll.toFixed(2);
    document.getElementById('totalRounds').textContent = this.engine.history.length;

    const profit = this.bankroll - this.initialBankroll;
    const profitEl = document.getElementById('totalProfit');
    profitEl.textContent = (profit >= 0 ? '+$' : '-$') + Math.abs(profit).toFixed(2);
    profitEl.className = 'stat-value ' + (profit >= 0 ? 'positive' : 'negative');

    const winRate = this.engine.history.length > 0
      ? (this.engine.history.filter(r => r.won).length / this.engine.history.length * 100).toFixed(1)
      : '0.0';
    document.getElementById('winRate').textContent = winRate + '%';
  }

  _updateCharts() {
    // Update crash history chart
    const last50 = this.crashPoints.slice(-50);
    this.crashChart.data.labels = last50.map((_, i) => this.crashPoints.length - 50 + i + 1);
    this.crashChart.data.datasets[0].data = last50;
    this.crashChart.data.datasets[0].backgroundColor = last50.map(c =>
      c < 1.5 ? '#e74c3c' : c < 2 ? '#e67e22' : c < 3 ? '#f1c40f' : c < 5 ? '#2ecc71' : '#3498db'
    );
    this.crashChart.update('none');

    // Update bankroll chart
    const bankrollSlice = this.bankrollHistory.slice(-200);
    this.profitChart.data.labels = bankrollSlice.map((_, i) => i + 1);
    this.profitChart.data.datasets = [{
      label: 'Bankroll',
      data: bankrollSlice,
      borderColor: this.bankroll >= this.initialBankroll ? '#00d4ff' : '#e74c3c',
      backgroundColor: (this.bankroll >= this.initialBankroll ? 'rgba(0,212,255,' : 'rgba(231,76,60,') + '0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      borderWidth: 2
    }];
    this.profitChart.update('none');

    this._updateDistributionChart();
  }

  _incrementBucket(c) {
    if (c < 1.5) this.distributionBuckets[0]++;
    else if (c < 2) this.distributionBuckets[1]++;
    else if (c < 3) this.distributionBuckets[2]++;
    else if (c < 5) this.distributionBuckets[3]++;
    else if (c < 10) this.distributionBuckets[4]++;
    else this.distributionBuckets[5]++;
  }

  _updateDistributionChart() {
    // BOLT OPTIMIZATION: Use pre-calculated incremental buckets (O(1) update)
    // instead of O(N) re-calculation from the full history.
    this.distributionChart.data.datasets[0].data = [...this.distributionBuckets];
    this.distributionChart.update('none');
  }

  _addToHistory(round) {
    const tbody = document.getElementById('historyBody');
    const row = document.createElement('tr');
    row.className = round.won ? 'win-row' : 'loss-row';
    row.innerHTML = `
      <td>#${round.id}</td>
      <td class="${round.crashPoint < 2 ? 'negative' : 'positive'}">${round.crashPoint}x</td>
      <td>$${round.betAmount.toFixed(2)}</td>
      <td>${round.cashOutAt}x</td>
      <td class="${round.won ? 'positive' : 'negative'}">${round.won ? 'WIN' : 'LOSS'}</td>
      <td class="${round.profit >= 0 ? 'positive' : 'negative'}">${round.profit >= 0 ? '+' : ''}$${round.profit.toFixed(2)}</td>
    `;
    tbody.insertBefore(row, tbody.firstChild);
    if (tbody.children.length > 100) tbody.removeChild(tbody.lastChild);
  }

  _clearHistory() {
    document.getElementById('historyBody').innerHTML = '';
  }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new AviatorApp();
});
