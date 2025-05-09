import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const stockApi = {
    // Get all available stocks
    getAllStocks: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/stocks`);
            return response.data;
        } catch (error) {
            console.error('Error fetching stocks:', error);
            throw error;
        }
    },

    // Get stock price with average calculation
    getStockPriceAverage: async (ticker, minutes) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/stocks/${ticker}?minutes=${minutes}&aggregation=average`
            );
            return response.data;
        } catch (error) {
            console.error(`Error fetching average price for ${ticker}:`, error);
            throw error;
        }
    },

    // Get correlation between two stocks
    getStockCorrelation: async (ticker1, ticker2, minutes) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/stockcorrelation?minutes=${minutes}&ticker=${ticker1}&ticker=${ticker2}`
            );
            return response.data;
        } catch (error) {
            console.error(`Error fetching correlation between ${ticker1} and ${ticker2}:`, error);
            throw error;
        }
    }
};

export default stockApi;