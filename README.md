# Stock Price Aggregation and Visualization

A full-stack application for stock price analysis, providing real-time insights into stock price data and correlation analysis between different stocks.

## Project Structure

The project consists of two main components:

```
2200291530021/
├── backend-service/      # Backend microservice for stock data
└── frontend-app/         # React frontend for visualization
```


## Setup Instructions

### Backend Service

1. Navigate to the backend directory:
```
cd backend-service
```

2. Install dependencies:
```
npm install
```

3. Start the server:
```
npm start
```

The server will run on http://localhost:5000

### Frontend Application

1. Navigate to the frontend directory:
```
cd frontend-app
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

The application will be available at http://localhost:3000

## Technologies Used

### Backend
- Node.js with Express
- RESTful API architecture
- Caching with node-cache
- Axios for HTTP requests

### Frontend
- React
- Material UI for components and styling
- Recharts for data visualization
- React Router for navigation


## Performance Considerations

- The application implements caching to reduce API calls
- Correlation calculations are batched to improve performance
- The frontend uses React's performance optimization features

## Responsive Design

The application is fully responsive and optimized for both desktop and mobile views, using Material UI's responsive design features.
