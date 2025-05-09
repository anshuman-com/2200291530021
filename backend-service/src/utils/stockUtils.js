/**
 * Calculates the average of stock prices
 */
const calculateAveragePrice = (priceHistory) => {
    if (!priceHistory || priceHistory.length === 0) {
        return 0;
    }

    const sum = priceHistory.reduce((acc, item) => acc + item.price, 0);
    return sum / priceHistory.length;
};

/**
 * Filters price history based on time range (in minutes)
 */
const filterPriceHistoryByMinutes = (priceHistory, minutes) => {
    if (!priceHistory || priceHistory.length === 0) {
        return [];
    }

    const currentTime = new Date();
    const timeThreshold = new Date(currentTime.getTime() - minutes * 60 * 1000);

    return priceHistory.filter(item => {
        const itemTime = new Date(item.lastUpdatedAt);
        return itemTime >= timeThreshold;
    });
};

module.exports = {
    calculateAveragePrice,
    filterPriceHistoryByMinutes
};