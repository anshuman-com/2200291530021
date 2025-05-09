/**
 * Calculates the Pearson correlation coefficient between two arrays of prices
 */
const calculateCorrelation = (prices1, prices2) => {
    if (!prices1 || !prices2 || prices1.length === 0 || prices2.length === 0) {
        return 0;
    }

    const n = Math.min(prices1.length, prices2.length);

    if (n <= 1) {
        return 0;
    }

    const mean1 = prices1.reduce((sum, val) => sum + val, 0) / n;
    const mean2 = prices2.reduce((sum, val) => sum + val, 0) / n;

    let covariance = 0;
    let variance1 = 0;
    let variance2 = 0;

    for (let i = 0; i < n; i++) {
        const diff1 = prices1[i] - mean1;
        const diff2 = prices2[i] - mean2;

        covariance += diff1 * diff2;
        variance1 += diff1 * diff1;
        variance2 += diff2 * diff2;
    }

    covariance /= (n - 1);
    variance1 /= (n - 1);
    variance2 /= (n - 1);

    const stdDev1 = Math.sqrt(variance1);
    const stdDev2 = Math.sqrt(variance2);

    if (stdDev1 === 0 || stdDev2 === 0) {
        return 0;
    }

    const correlation = covariance / (stdDev1 * stdDev2);

    return parseFloat(correlation.toFixed(4));
};

/**
 * Extracts price values from price history objects
 */
const extractPriceValues = (priceHistory) => {
    return priceHistory.map(item => item.price);
};

module.exports = {
    calculateCorrelation,
    extractPriceValues
};