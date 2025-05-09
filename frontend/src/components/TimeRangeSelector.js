import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box
} from '@mui/material';

const timeRanges = [
    { value: 15, label: 'Last 15 minutes' },
    { value: 30, label: 'Last 30 minutes' },
    { value: 60, label: 'Last 1 hour' },
    { value: 120, label: 'Last 2 hours' },
    { value: 240, label: 'Last 4 hours' },
    { value: 480, label: 'Last 8 hours' }
];

const TimeRangeSelector = ({ selectedMinutes, onMinutesChange }) => {
    return (
        <Box sx={{ minWidth: 180 }}>
            <FormControl fullWidth>
                <InputLabel id="time-range-select-label">Time Range</InputLabel>
                <Select
                    labelId="time-range-select-label"
                    id="time-range-select"
                    value={selectedMinutes}
                    label="Time Range"
                    onChange={(e) => onMinutesChange(e.target.value)}
                >
                    {timeRanges.map((range) => (
                        <MenuItem key={range.value} value={range.value}>
                            {range.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default TimeRangeSelector;