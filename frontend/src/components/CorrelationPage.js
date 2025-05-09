import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import TimeRangeSelector from '../components/TimeRangeSelector';
import CorrelationHeatmap from '../components/CorrelationHeatmap';
import stockApi from '../api/stockApi';

const CorrelationPage = () => {
  const [stocks, setStocks] = useState({});
  const [selectedMinutes, setSelectedMinutes] = useState(30); // Start with 30 minutes for better performance
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const result = await stockApi.getAllStocks();
        if (isMounted) {
          setStocks(result.stocks || {});
          setError('');
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to fetch stocks. Please try again.');
          console.error('Error fetching stocks:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchStocks();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  const handleTimeRangeChange = (newMinutes) => {
    setSelectedMinutes(newMinutes);
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Stock Price Correlation Analysis
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body1">
            Analyze the correlation between stock prices over time
          </Typography>
          <TimeRangeSelector 
            selectedMinutes={selectedMinutes}
            onMinutesChange={handleTimeRangeChange}
          />
        </Box>
      </Paper>
      
      {loading && Object.keys(stocks).length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 3 }}>
          <CorrelationHeatmap 
            stocks={stocks} 
            minutes={selectedMinutes} 
          />
        </Paper>
      )}
    </Box>
  );
};

export default CorrelationPage;