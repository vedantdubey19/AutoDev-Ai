const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://ml-service:8000';

const getRiskPrediction = async (metadata) => {
  // metadata: { files_changed, lines_added, lines_deleted }
  try {
    const url = ML_SERVICE_URL.includes('localhost') ? 'http://localhost:8000/predict' : `${ML_SERVICE_URL}/predict`;
    const response = await axios.post(url, metadata);
    return response.data; // { risk_score, risk_level }
  } catch (err) {
    console.error('Failed to get risk prediction:', err.message);
    return { risk_score: 0, risk_level: 'Unknown' };
  }
};

module.exports = { getRiskPrediction };
