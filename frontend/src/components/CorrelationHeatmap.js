import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  useMediaQuery,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import stockApi from '../api/stockApi';

// Helper function to get color based on correlation value
const getCorrelationColor = (correlation) => {
  if (correlation === null || correlation === undefined) return '#f5f5f5';
  
  // Strong negative correlation (dark red)
  if (correlation <= -0.7) return '#d32f2f';
  
  // Moderate negative correlation (medium red)
  if (correlation <= -0.3) return '#ef5350';
  
  // Weak negative correlation (light red)
  if (correlation < 0) return '#ffcdd2';
  
  // No correlation (white/light gray)
  if (correlation === 0) return '#f5f5f5';
  
  // Weak positive correlation (light green)
  if (correlation < 0.3) return '#c8e6c9';
  
  // Moderate positive correlation (medium green)
  if (correlation < 0.7) return '#66bb6a';
  
  // Strong positive correlation (dark green)
  return '#388e3c';
};

// Calculate standard deviation
const calculateStandardDeviation = (prices) => {
  if (!prices || prices.length <= 1) return 0;
  
  const mean = prices.reduce((sum, val) => sum + val, 0) / prices.length;
  const variance = prices.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (prices.length - 1);
  return Math.sqrt(variance);
};

const CorrelationHeatmap = ({ stocks, minutes }) => {
  const [correlationMatrix, setCorrelationMatrix] = useState({});
  const [stockStats, setStockStats] = useState({});
  const [hoveredStock, setHoveredStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  

  const TOP_STOCKS = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META'];
  
  const selectedStocks = useMemo(() => {
    if (!stocks || Object.keys(stocks).length === 0) return [];
    
    const availableTickers = Object.values(stocks);
    return TOP_STOCKS.filter(ticker => availableTickers.includes(ticker)).slice(0, 5);
  }, [stocks]);
  
  // Fetch correlation data for all pairs of selected stocks
  useEffect(() => {
    let isMounted = true;
    
    async function fetchCorrelationData() {
      if (selectedStocks.length < 2 || !minutes) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const matrix = {};
        const stats = {};
        
        selectedStocks.forEach(ticker1 => {
          matrix[ticker1] = {};
          stats[ticker1] = { 
            averagePrice: 0, 
            stdDeviation: 0, 
            priceHistory: [] 
          };
          
          matrix[ticker1][ticker1] = 1;
        });
        
        const pairs = [];
        for (let i = 0; i < selectedStocks.length; i++) {
          for (let j = i + 1; j < selectedStocks.length; j++) {
            pairs.push([selectedStocks[i], selectedStocks[j]]);
          }
        }
        
        const batchSize = 2;
        for (let i = 0; i < pairs.length; i += batchSize) {
          const batch = pairs.slice(i, i + batchSize);
          
          const batchPromises = batch.map(([ticker1, ticker2]) => 
            stockApi.getStockCorrelation(ticker1, ticker2, minutes)
          );
          
          const results = await Promise.all(batchPromises);
          
          results.forEach((result, index) => {
            const [ticker1, ticker2] = batch[index];
            
            if (result) {
              matrix[ticker1][ticker2] = result.correlation;
              matrix[ticker2][ticker1] = result.correlation;
              
              if (result.stocks[ticker1]) {
                const priceValues = result.stocks[ticker1].priceHistory.map(p => p.price);
                stats[ticker1].averagePrice = result.stocks[ticker1].averagePrice;
                stats[ticker1].priceHistory = result.stocks[ticker1].priceHistory;
                stats[ticker1].stdDeviation = calculateStandardDeviation(priceValues);
              }
              
              if (result.stocks[ticker2]) {
                const priceValues = result.stocks[ticker2].priceHistory.map(p => p.price);
                stats[ticker2].averagePrice = result.stocks[ticker2].averagePrice;
                stats[ticker2].priceHistory = result.stocks[ticker2].priceHistory;
                stats[ticker2].stdDeviation = calculateStandardDeviation(priceValues);
              }
            }
          });
          
          // Small delay to avoid overwhelming the API
          if (i + batchSize < pairs.length) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
        
        if (isMounted) {
          setCorrelationMatrix(matrix);
          setStockStats(stats);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching correlation data:', error);
        if (isMounted) {
          setError('Failed to fetch correlation data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchCorrelationData();
    
    return () => {
      isMounted = false;
    };
  }, [selectedStocks, minutes]);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Calculating correlations...
        </Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#ffebee' }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }
  
  if (selectedStocks.length < 2) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">
          Not enough stocks available to calculate correlations.
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom>
        Stock Price Correlation Heatmap
      </Typography>
      <Typography variant="body2" gutterBottom color="text.secondary">
        Last {minutes} minutes • Showing {selectedStocks.length} stocks
      </Typography>
      
      {/* Heatmap Grid */}
      <Grid container spacing={1} sx={{ mt: 2 }}>
        {/* Empty top-left cell */}
        <Grid item xs={3} sm={2}>
          <Paper 
            sx={{ 
              p: 1, 
              textAlign: 'center', 
              backgroundColor: theme.palette.grey[100],
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              Stock
            </Typography>
          </Paper>
        </Grid>
        
        {/* Column headers */}
        {selectedStocks.map(ticker => (
          <Grid item xs={true} key={`header-${ticker}`}>
            <Tooltip 
              title={
                <Box sx={{ p: 1 }}>
                  <Typography variant="subtitle2">{ticker}</Typography>
                  {stockStats[ticker] && (
                    <>
                      <Typography variant="body2">
                        Avg: ${stockStats[ticker].averagePrice.toFixed(2)}
                      </Typography>
                      <Typography variant="body2">
                        StdDev: ${stockStats[ticker].stdDeviation.toFixed(2)}
                      </Typography>
                      <Typography variant="body2">
                        Points: {stockStats[ticker].priceHistory.length}
                      </Typography>
                    </>
                  )}
                </Box>
              }
              arrow
              placement="top"
            >
              <Paper 
                sx={{ 
                  p: 1, 
                  textAlign: 'center', 
                  backgroundColor: hoveredStock === ticker 
                    ? theme.palette.secondary.main 
                    : theme.palette.primary.main,
                  color: 'white',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setHoveredStock(ticker)}
                onMouseLeave={() => setHoveredStock(null)}
              >
                <Typography 
                  variant="body2" 
                  fontWeight="bold"
                  sx={{
                    fontSize: isMobile ? '0.7rem' : '0.8rem'
                  }}
                >
                  {ticker}
                </Typography>
              </Paper>
            </Tooltip>
          </Grid>
        ))}
        
        {/* Rows */}
        {selectedStocks.map(rowTicker => (
          <React.Fragment key={`row-${rowTicker}`}>
            {/* Row header */}
            <Grid item xs={3} sm={2}>
              <Tooltip 
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2">{rowTicker}</Typography>
                    {stockStats[rowTicker] && (
                      <>
                        <Typography variant="body2">
                          Avg: ${stockStats[rowTicker].averagePrice.toFixed(2)}
                        </Typography>
                        <Typography variant="body2">
                          StdDev: ${stockStats[rowTicker].stdDeviation.toFixed(2)}
                        </Typography>
                        <Typography variant="body2">
                          Points: {stockStats[rowTicker].priceHistory.length}
                        </Typography>
                      </>
                    )}
                  </Box>
                }
                arrow
                placement="left"
              >
                <Paper 
                  sx={{ 
                    p: 1, 
                    textAlign: 'center', 
                    backgroundColor: hoveredStock === rowTicker 
                      ? theme.palette.secondary.main 
                      : theme.palette.primary.main,
                    color: 'white',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredStock(rowTicker)}
                  onMouseLeave={() => setHoveredStock(null)}
                >
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    sx={{
                      fontSize: isMobile ? '0.7rem' : '0.8rem'
                    }}
                  >
                    {rowTicker}
                  </Typography>
                </Paper>
              </Tooltip>
            </Grid>
            
            {/* Correlation cells */}
            {selectedStocks.map(colTicker => {
              const correlation = correlationMatrix[rowTicker]?.[colTicker] || 0;
              const backgroundColor = getCorrelationColor(correlation);
              const isHighlighted = hoveredStock && (hoveredStock === rowTicker || hoveredStock === colTicker);
              
              return (
                <Grid item xs={true} key={`cell-${rowTicker}-${colTicker}`}>
                  <Tooltip
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2">
                          {rowTicker} to {colTicker}
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          Correlation: {correlation.toFixed(2)}
                        </Typography>
                      </Box>
                    }
                    arrow
                  >
                    <Paper 
                      sx={{ 
                        p: 1, 
                        textAlign: 'center', 
                        backgroundColor,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: isHighlighted ? `2px solid ${theme.palette.secondary.main}` : 'none'
                      }}
                    >
                      <Typography 
                        variant="body2"
                        sx={{
                          fontSize: isMobile ? '0.65rem' : '0.8rem',
                          color: correlation <= -0.3 || correlation >= 0.3 ? 'white' : 'black',
                          fontWeight: isHighlighted ? 'bold' : 'normal'
                        }}
                      >
                        {correlation !== null ? correlation.toFixed(2) : '-'}
                      </Typography>
                    </Paper>
                  </Tooltip>
                </Grid>
              );
            })}
          </React.Fragment>
        ))}
      </Grid>
      
      {/* Color legend */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
        {[
          { value: -1, label: 'Strong Negative' },
          { value: -0.5, label: 'Moderate Negative' },
          { value: -0.1, label: 'Weak Negative' },
          { value: 0, label: 'No Correlation' },
          { value: 0.1, label: 'Weak Positive' },
          { value: 0.5, label: 'Moderate Positive' },
          { value: 1, label: 'Strong Positive' }
        ].map(item => (
          <Box 
            key={item.label} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center' 
            }}
          >
            <Box 
              sx={{ 
                width: 24, 
                height: 24, 
                backgroundColor: getCorrelationColor(item.value),
                border: '1px solid grey'
              }} 
            />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
      
      {/* Stock Details */}
      {hoveredStock && stockStats[hoveredStock] && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {hoveredStock} Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Average Price
                  </Typography>
                  <Typography variant="h5">
                    ${stockStats[hoveredStock].averagePrice.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Standard Deviation
                  </Typography>
                  <Typography variant="h5">
                    ${stockStats[hoveredStock].stdDeviation.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Data Points
                  </Typography>
                  <Typography variant="h5">
                    {stockStats[hoveredStock].priceHistory.length}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            {stockStats[hoveredStock].priceHistory.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Price Range
                </Typography>
                <Typography variant="body1">
                  ${Math.min(...stockStats[hoveredStock].priceHistory.map(p => p.price)).toFixed(2)} - 
                  ${Math.max(...stockStats[hoveredStock].priceHistory.map(p => p.price)).toFixed(2)}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CorrelationHeatmap;