import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const StockSelector = ({
                           stocks,
                           selectedStock,
                           onStockChange,
                           label = "Select Stock",
                           fullWidth = false
                       }) => {
    return (
        <Box sx={{ minWidth: 120, width: fullWidth ? '100%' : 'auto' }}>
            <FormControl fullWidth>
                <InputLabel id="stock-select-label">{label}</InputLabel>
                <Select
                    labelId="stock-select-label"
                    id="stock-select"
                    value={selectedStock || ''}
                    label={label}
                    onChange={(e) => onStockChange(e.target.value)}
                >
                    {Object.entries(stocks || {}).map(([name, ticker]) => (
                        <MenuItem key={ticker} value={ticker}>
                            {name} ({ticker})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default StockSelector;