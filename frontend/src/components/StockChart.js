import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { format } from 'date-fns';

const StockChart = ({ stockData, ticker }) => {
    const [activePoint, setActivePoint] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!stockData || !ticker) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1">
                    Select a stock to view price chart
                </Typography>
            </Paper>
        );
    }

    const { averageStockPrice, priceHistory } = stockData;

    const chartData = priceHistory.map(item => ({
        time: new Date(item.lastUpdatedAt),
        price: item.price,
        formattedTime: format(new Date(item.lastUpdatedAt), 'MMM dd, HH:mm:ss')
    }));

    chartData.sort((a, b) => a.time - b.time);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            return (
                <Card sx={{ p: 1, boxShadow: 3 }}>
                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                        <Typography variant="body2" color="text.secondary">
                            Time: {dataPoint.formattedTime}
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                            Price: ${dataPoint.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Deviation from Avg:
                            {(dataPoint.price - averageStockPrice).toFixed(2)}
                            ({((dataPoint.price / averageStockPrice - 1) * 100).toFixed(2)}%)
                        </Typography>
                    </CardContent>
                </Card>
            );
        }
        return null;
    };

    return (
        <Box sx={{ width: '100%', height: '400px', mt: 2 }}>
            <Typography variant="h5" gutterBottom>
                {ticker} Stock Price Chart
            </Typography>
            <Typography variant="subtitle1" gutterBottom color="text.secondary">
                Average Price: ${averageStockPrice.toFixed(2)}
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 20,
                        bottom: 30,
                    }}
                    onMouseMove={(e) => {
                        if (e && e.activePayload) {
                            setActivePoint(e.activePayload[0].payload);
                        }
                    }}
                    onMouseLeave={() => setActivePoint(null)}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="formattedTime"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tickFormatter={(value) => {
                            // Shorter date format
                            const date = new Date(value);
                            return format(date, 'MM/dd HH:mm');
                          }}
                    />
                    <YAxis
                        domain={['auto', 'auto']}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <ReferenceLine
                        y={averageStockPrice}
                        stroke="red"
                        strokeDasharray="3 3"
                        label={{
                            position: 'right',
                            value: `Avg: $${averageStockPrice.toFixed(2)}`,
                            fill: 'red',
                            fontSize: 12
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        name={`${ticker} Price`}
                    />
                </LineChart>
            </ResponsiveContainer>

            {activePoint && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="body2">
                        <strong>Time:</strong> {activePoint.formattedTime}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Price:</strong> ${activePoint.price.toFixed(2)}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default StockChart;
