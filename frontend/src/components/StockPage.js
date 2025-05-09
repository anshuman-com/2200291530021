import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import StockSelector from '../components/StockSelector';
import TimeRangeSelector from '../components/TimeRangeSelector';
import StockChart from '../components/StockChart';
import stockApi from '../api/stockApi';

const StockPage = () => {
    const [stocks, setStocks] = useState({});
    const [selectedStock, setSelectedStock] = useState('');
    const [selectedMinutes, setSelectedMinutes] = useState(60);
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch all available stocks
    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const result = await stockApi.getAllStocks();
                setStocks(result.stocks);
            } catch (error) {
                setError('Failed to fetch stocks. Please try again.');
                console.error('Error fetching stocks:', error);
            }
        };

        fetchStocks();
    }, []);

    useEffect(() => {
        const fetchStockData = async () => {
            if (!selectedStock) return;

            setLoading(true);
            setError('');

            try {
                const result = await stockApi.getStockPriceAverage(selectedStock, selectedMinutes);
                setStockData(result);
            } catch (error) {
                setError(`Failed to fetch data for ${selectedStock}. Please try again.`);
                console.error(`Error fetching data for ${selectedStock}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, [selectedStock, selectedMinutes]);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Stock Price Analysis
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <StockSelector
                            stocks={stocks}
                            selectedStock={selectedStock}
                            onStockChange={setSelectedStock}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TimeRangeSelector
                            selectedMinutes={selectedMinutes}
                            onMinutesChange={setSelectedMinutes}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#ffebee' }}>
                    <Typography color="error">{error}</Typography>
                </Paper>
            ) : (
                <Paper sx={{ p: 3 }}>
                    <StockChart stockData={stockData} ticker={selectedStock} />
                </Paper>
            )}
        </Box>
    );
};

export default StockPage;