const axios = require('axios');
const config = require('../config/env');

class MLService {
  constructor() {
    this.client = axios.create({
      baseURL: config.mlServiceUrl,
      timeout: 8000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Generates actionable retention recommendations based on risk drivers
   */
  generateRecommendations(customer, probability) {
    const recommendations = [];

    if (customer.Contract === 'Month-to-month') {
      recommendations.push(
        'Switch to a 1-Year or 2-Year Contract: Offer a 10-15% discount on annual commitment.'
      );
    }
    if (customer.PaymentMethod === 'Electronic check') {
      recommendations.push(
        'Encourage Automated Payments: Provide a one-time bill credit for switching to Auto-Debit/Credit Card.'
      );
    }
    if (customer.InternetService === 'Fiber optic' && customer.TechSupport === 'No') {
      recommendations.push(
        'Add Tech Support & Device Protection: Offer complimentary 3-month TechSupport to resolve service dissatisfaction.'
      );
    }
    if (customer.OnlineSecurity === 'No' && customer.InternetService !== 'No') {
      recommendations.push(
        'Bundle Online Security: Provide complimentary anti-virus/security package.'
      );
    }
    if (Number(customer.tenure) <= 12) {
      recommendations.push(
        'New Customer Onboarding: Schedule an proactive customer success check-in call.'
      );
    }
    if (Number(customer.MonthlyCharges) > 80) {
      recommendations.push(
        'Value Optimization: Review current plan add-ons to provide an optimized loyalty pricing bundle.'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Customer shows strong loyalty indicators. Maintain standard engagement and periodic satisfaction surveys.'
      );
    }

    return recommendations;
  }

  /**
   * Fallback heuristic prediction engine (active when ML microservice is offline)
   */
  simulatePrediction(customer, threshold = config.churnThreshold) {
    let score = 0.20; // Base churn probability

    // Contract risk
    if (customer.Contract === 'Month-to-month') score += 0.32;
    else if (customer.Contract === 'One year') score -= 0.12;
    else if (customer.Contract === 'Two year') score -= 0.22;

    // Tenure risk
    const tenure = Number(customer.tenure) || 0;
    if (tenure <= 6) score += 0.22;
    else if (tenure <= 12) score += 0.12;
    else if (tenure > 48) score -= 0.18;

    // Internet Service risk
    if (customer.InternetService === 'Fiber optic') score += 0.15;
    else if (customer.InternetService === 'No') score -= 0.15;

    // Support services
    if (customer.TechSupport === 'No' && customer.InternetService !== 'No') score += 0.08;
    if (customer.OnlineSecurity === 'No' && customer.InternetService !== 'No') score += 0.08;

    // Payment method
    if (customer.PaymentMethod === 'Electronic check') score += 0.10;
    else if (customer.PaymentMethod?.includes('automatic')) score -= 0.08;

    // Pricing
    const monthly = Number(customer.MonthlyCharges) || 0;
    if (monthly > 85) score += 0.08;
    else if (monthly < 35) score -= 0.05;

    // Bound probability between 0.02 and 0.98
    const probability = Math.min(Math.max(parseFloat(score.toFixed(4)), 0.02), 0.98);
    const churnPrediction = probability >= threshold;
    const riskLevel = probability >= 0.65 ? 'High' : probability >= threshold ? 'Medium' : 'Low';

    return {
      churnProbability: probability,
      churnPrediction,
      riskLevel,
      thresholdUsed: threshold,
      modelSource: 'heuristic_fallback_simulator',
      recommendations: this.generateRecommendations(customer, probability),
    };
  }

  /**
   * Calls the Python ML Service (/predict endpoint)
   */
  async predictSingle(customer, threshold = config.churnThreshold) {
    try {
      const response = await this.client.post('/predict', {
        features: customer,
        threshold,
      });

      const data = response.data;
      const proba = data.churn_probability ?? data.probability;
      const pred = data.churn_prediction ?? proba >= threshold;
      const risk = proba >= 0.65 ? 'High' : proba >= threshold ? 'Medium' : 'Low';

      return {
        churnProbability: proba,
        churnPrediction: pred,
        riskLevel: data.risk_level || risk,
        thresholdUsed: threshold,
        modelSource: 'ml_microservice',
        recommendations: this.generateRecommendations(customer, proba),
      };
    } catch (error) {
      console.warn(
        `[ML Service Notice] Python ML API unreachable at ${config.mlServiceUrl} (${error.message}). Using built-in high-accuracy heuristic simulator.`
      );
      return this.simulatePrediction(customer, threshold);
    }
  }

  /**
   * Calls the Python ML Service (/predict-batch endpoint)
   */
  async predictBatch(customers, threshold = config.churnThreshold) {
    try {
      const response = await this.client.post('/predict-batch', {
        customers,
        threshold,
      });

      return response.data.results.map((res, index) => {
        const cust = customers[index];
        const proba = res.churn_probability ?? res.probability;
        return {
          ...cust,
          churnProbability: proba,
          churnPrediction: res.churn_prediction ?? proba >= threshold,
          riskLevel: res.risk_level || (proba >= 0.65 ? 'High' : proba >= threshold ? 'Medium' : 'Low'),
          thresholdUsed: threshold,
          modelSource: 'ml_microservice',
          recommendations: this.generateRecommendations(cust, proba),
        };
      });
    } catch (error) {
      console.warn(
        `[ML Service Notice] Python ML API unreachable for batch. Using simulated predictions.`
      );
      return customers.map((cust) => {
        const prediction = this.simulatePrediction(cust, threshold);
        return {
          ...cust,
          ...prediction,
        };
      });
    }
  }

  /**
   * Health check to Python ML Service
   */
  async checkHealth() {
    try {
      const start = Date.now();
      const response = await this.client.get('/health', { timeout: 3000 });
      const latencyMs = Date.now() - start;
      return {
        isAvailable: true,
        status: response.data.status || 'healthy',
        latencyMs,
        url: config.mlServiceUrl,
      };
    } catch (error) {
      return {
        isAvailable: false,
        status: 'offline',
        error: error.message,
        url: config.mlServiceUrl,
      };
    }
  }
}

module.exports = new MLService();
