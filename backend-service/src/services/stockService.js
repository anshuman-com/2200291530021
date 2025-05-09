const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config');

// Cache for storing auth token and stock data
const cache = new NodeCache({ stdTTL: config.cacheTTL });

/**
 * Get authentication token from the API
 */
const getAuthToken = async () => {
    const cachedToken = cache.get('authToken');
    if (cachedToken) {
        return cachedToken;
    }

    try {
        const response = await axios.post(`${config.stockAPIBaseURL}/auth`, config.credentials);
        const token = response.data.access_token;

        // Cache the token
        cache.set('authToken', token);

        return token;
    } catch (error) {
        console.error('Error getting auth token:', error.message);
        throw new Error('Failed to authenticate with the stock API');
    }
};

/**
 * Get list of available stocks
 */
const getStocks = async () => {
    const cachedStocks = cache.get('stocks');
    if (cachedStocks) {
        return cachedStocks;
    }

    try {
        const token = await getAuthToken();

        const response = await axios.get(`${config.stockAPIBaseURL}/stocks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Cache the stocks data
        cache.set('stocks', response.data.stocks);

        return response.data.stocks;
    } catch (error) {
        console.error('Error getting stocks:', error.message);
        throw new Error('Failed to retrieve stocks data');
    }
};

/**
 * Get price history for a specific stock
 */
const getStockPriceHistory = async (ticker, minutes) => {
    const cacheKey = `${ticker}_${minutes}`;
    const cachedHistory = cache.get(cacheKey);

    // Use cached data if available
    if (cachedHistory) {
        return cachedHistory;
    }

    try {
        const token = await getAuthToken();

        let url = `${config.stockAPIBaseURL}/stocks/${ticker}`;
        if (minutes) {
            url += `?minutes=${minutes}`;
        }

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        let priceHistory;

        // API returns different formats based on whether minutes parameter is provided
        if (minutes) {
            priceHistory = response.data;
        } else {
            // Single price point case
            priceHistory = [response.data.stock];
        }

        // Cache the price history data
        const ttl = Math.min(minutes || 60, config.cacheTTL);
        cache.set(cacheKey, priceHistory, ttl);

        return priceHistory;
    } catch (error) {
        console.error(`Error getting price history for ${ticker}:`, error.message);
        throw new Error(`Failed to retrieve price history for ${ticker}`);
    }
};

module.exports = {
    getAuthToken,
    getStocks,
    getStockPriceHistory
};