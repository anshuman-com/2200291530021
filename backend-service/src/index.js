const express = require('express');
const cors = require('cors');
const stockRoutes = require('./routes/stockRoutes');
const correlationRoutes = require('./routes/correlationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/stocks', stockRoutes);
app.use('/stockcorrelation', correlationRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ status: 'Service is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});