const customerService = require('./customerService');

class AnalyticsService {
  async getDashboardMetrics() {
    const customers = await customerService.getAllForAnalytics();
    const total = customers.length;

    if (total === 0) {
      return {
        totalCustomers: 0,
        churnCount: 0,
        churnRate: 0,
        safeCount: 0,
        avgChurnProbability: 0,
        monthlyRevenueAtRisk: 0,
        totalMonthlyRevenue: 0,
        riskDistribution: { High: 0, Medium: 0, Low: 0 },
        churnByContract: [],
        churnByInternetService: [],
        churnByPaymentMethod: [],
        tenureDistribution: [],
      };
    }

    let churnCount = 0;
    let safeCount = 0;
    let totalProbability = 0;
    let monthlyRevenueAtRisk = 0;
    let totalMonthlyRevenue = 0;

    const riskDistribution = { High: 0, Medium: 0, Low: 0 };
    const contractMap = {};
    const internetMap = {};
    const paymentMap = {};
    const tenureBins = { '0-12': 0, '12-24': 0, '24-48': 0, '48-60': 0, '60+': 0 };

    for (const c of customers) {
      const monthly = Number(c.MonthlyCharges) || 0;
      totalMonthlyRevenue += monthly;
      totalProbability += c.churnProbability;

      if (c.churnPrediction) {
        churnCount++;
        monthlyRevenueAtRisk += monthly;
      } else {
        safeCount++;
      }

      // Risk level
      if (riskDistribution[c.riskLevel] !== undefined) {
        riskDistribution[c.riskLevel]++;
      }

      // Contract
      const contract = c.Contract || 'Unknown';
      if (!contractMap[contract]) contractMap[contract] = { total: 0, churn: 0 };
      contractMap[contract].total++;
      if (c.churnPrediction) contractMap[contract].churn++;

      // Internet Service
      const internet = c.InternetService || 'Unknown';
      if (!internetMap[internet]) internetMap[internet] = { total: 0, churn: 0 };
      internetMap[internet].total++;
      if (c.churnPrediction) internetMap[internet].churn++;

      // Payment Method
      const payment = c.PaymentMethod || 'Unknown';
      if (!paymentMap[payment]) paymentMap[payment] = { total: 0, churn: 0 };
      paymentMap[payment].total++;
      if (c.churnPrediction) paymentMap[payment].churn++;

      // Tenure
      const t = Number(c.tenure) || 0;
      if (t <= 12) tenureBins['0-12']++;
      else if (t <= 24) tenureBins['12-24']++;
      else if (t <= 48) tenureBins['24-48']++;
      else if (t <= 60) tenureBins['48-60']++;
      else tenureBins['60+']++;
    }

    const churnRate = Number(((churnCount / total) * 100).toFixed(2));
    const avgChurnProbability = Number((totalProbability / total).toFixed(4));

    const churnByContract = Object.entries(contractMap).map(([contract, data]) => ({
      contract,
      total: data.total,
      churn: data.churn,
      churnRate: Number(((data.churn / data.total) * 100).toFixed(1)),
    }));

    const churnByInternetService = Object.entries(internetMap).map(([service, data]) => ({
      service,
      total: data.total,
      churn: data.churn,
      churnRate: Number(((data.churn / data.total) * 100).toFixed(1)),
    }));

    const churnByPaymentMethod = Object.entries(paymentMap).map(([method, data]) => ({
      method,
      total: data.total,
      churn: data.churn,
      churnRate: Number(((data.churn / data.total) * 100).toFixed(1)),
    }));

    const tenureDistribution = Object.entries(tenureBins).map(([bin, count]) => ({
      bin,
      count,
    }));

    return {
      totalCustomers: total,
      churnCount,
      safeCount,
      churnRate,
      avgChurnProbability,
      monthlyRevenueAtRisk: Number(monthlyRevenueAtRisk.toFixed(2)),
      totalMonthlyRevenue: Number(totalMonthlyRevenue.toFixed(2)),
      riskDistribution,
      churnByContract,
      churnByInternetService,
      churnByPaymentMethod,
      tenureDistribution,
    };
  }

  async simulateThresholdImpact(newThreshold) {
    const customers = await customerService.getAllForAnalytics();
    const threshold = parseFloat(newThreshold) || 0.4;
    const total = customers.length;

    let flaggedCount = 0;
    let flaggedRevenue = 0;

    for (const c of customers) {
      if (c.churnProbability >= threshold) {
        flaggedCount++;
        flaggedRevenue += Number(c.MonthlyCharges) || 0;
      }
    }

    return {
      threshold,
      totalCustomers: total,
      flaggedCount,
      flaggedPercentage: total > 0 ? Number(((flaggedCount / total) * 100).toFixed(2)) : 0,
      flaggedRevenue: Number(flaggedRevenue.toFixed(2)),
    };
  }
}

module.exports = new AnalyticsService();
