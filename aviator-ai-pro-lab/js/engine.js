/**
 * Aviator AI Pro Lab - Game Simulator Engine
 * Provably fair crash point generation and game simulation
 */

class AviatorEngine {
  constructor(houseEdge = 0.03) {
    this.houseEdge = houseEdge;
    this.history = [];
    this.seed = this._generateSeed();
  }

  _generateSeed() {
    const arr = new Uint32Array(4);
    crypto.getRandomValues(arr);
    return Array.from(arr, v => v.toString(16).padStart(8, '0')).join('');
  }

  /**
   * Generate a provably fair crash point using hash-based RNG
   * Returns multiplier >= 1.00
   */
  generateCrashPoint() {
    const hashInput = this.seed + ':' + this.history.length;
    const hash = this._simpleHash(hashInput);
    const h = parseInt(hash.slice(0, 13), 16);
    const e = Math.pow(2, 52);
    const result = (100 * e - h) / (e - h);
    const crashPoint = Math.max(1.0, Math.floor(result) / 100);
    return crashPoint;
  }

  _simpleHash(str) {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    let h3 = 0x9e3779b9;
    let h4 = 0x12345678;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
      h3 = Math.imul(h3 ^ ch, 2246822519);
      h4 = Math.imul(h4 ^ ch, 3266489917);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    h3 = Math.imul(h3 ^ (h3 >>> 16), 2246822507) ^ Math.imul(h4 ^ (h4 >>> 13), 3266489909);
    h4 = Math.imul(h4 ^ (h4 >>> 16), 2246822507) ^ Math.imul(h3 ^ (h3 >>> 13), 3266489909);
    const hex = (v) => (v >>> 0).toString(16).padStart(8, '0');
    return hex(h1) + hex(h2) + hex(h3) + hex(h4);
  }

  /**
   * Simulate a single round
   */
  simulateRound(betAmount, cashOutAt) {
    const crashPoint = this.generateCrashPoint();
    const won = cashOutAt <= crashPoint;
    const payout = won ? betAmount * cashOutAt : 0;
    const profit = payout - betAmount;

    // BOLT OPTIMIZATION: Use a faster mathematical rounding helper instead of toFixed().
    const round = {
      id: this.history.length + 1,
      crashPoint: this._round(crashPoint),
      betAmount,
      cashOutAt: this._round(cashOutAt),
      won,
      payout: this._round(payout),
      profit: this._round(profit),
      timestamp: Date.now()
    };

    this.history.push(round);
    this.seed = this._generateSeed();
    return round;
  }

  /**
   * Generate batch of crash points for backtesting
   */
  generateCrashHistory(count) {
    const points = [];
    for (let i = 0; i < count; i++) {
      points.push(this.generateCrashPoint());
      this.seed = this._generateSeed();
    }
    return points;
  }

  /**
   * Get statistical analysis of crash history
   */
  getStats() {
    const len = this.history.length;
    if (len === 0) return null;

    // BOLT OPTIMIZATION: Consolidate all metric calculations into a single O(N) loop
    // to avoid redundant array iterations and multiple passes over the history.
    let sumCrash = 0, maxCrash = -Infinity, minCrash = Infinity;
    let sumProfit = 0, winCount = 0;
    let maxWinStreak = 0, currentWinStreak = 0;
    let maxLoseStreak = 0, currentLoseStreak = 0;
    let peak = 0, maxDD = 0, cumulativeProfit = 0;
    let grossWins = 0, grossLosses = 0;
    const crashes = [];

    for (let i = 0; i < len; i++) {
      const r = this.history[i];
      const crash = r.crashPoint;
      const profit = r.profit;
      const won = r.won;

      crashes.push(crash);
      sumCrash += crash;
      if (crash > maxCrash) maxCrash = crash;
      if (crash < minCrash) minCrash = crash;

      sumProfit += profit;
      cumulativeProfit += profit;
      if (cumulativeProfit > peak) peak = cumulativeProfit;
      const dd = peak - cumulativeProfit;
      if (dd > maxDD) maxDD = dd;

      if (won) {
        winCount++;
        currentWinStreak++;
        if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
        currentLoseStreak = 0;
        grossWins += profit;
      } else {
        currentLoseStreak++;
        if (currentLoseStreak > maxLoseStreak) maxLoseStreak = currentLoseStreak;
        currentWinStreak = 0;
        grossLosses += Math.abs(profit);
      }
    }

    const avgProfit = sumProfit / len;
    let varianceSum = 0;
    for (let i = 0; i < len; i++) {
      varianceSum += Math.pow(this.history[i].profit - avgProfit, 2);
    }
    const variance = len < 2 ? 0 : varianceSum / (len - 1);
    const std = Math.sqrt(variance);
    const sharpe = std === 0 ? 0 : (avgProfit / std) * Math.sqrt(252);

    const profitFactor = grossLosses === 0 ? (grossWins > 0 ? 'Infinity' : '0.00') : (grossWins / grossLosses).toFixed(2);

    return {
      totalRounds: len,
      winRate: (winCount / len * 100).toFixed(1),
      totalProfit: sumProfit.toFixed(2),
      avgCrash: (sumCrash / len).toFixed(2),
      maxCrash: maxCrash.toFixed(2),
      minCrash: minCrash.toFixed(2),
      medianCrash: this._median(crashes).toFixed(2),
      longestWinStreak: maxWinStreak,
      longestLoseStreak: maxLoseStreak,
      avgProfit: avgProfit.toFixed(2),
      maxDrawdown: maxDD.toFixed(2),
      sharpeRatio: sharpe.toFixed(3),
      profitFactor: profitFactor
    };
  }

  _round(num, decimals = 2) {
    const p = Math.pow(10, decimals);
    return Math.round(num * p) / p;
  }

  _median(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  reset() {
    this.history = [];
    this.seed = this._generateSeed();
  }
}

window.AviatorEngine = AviatorEngine;
