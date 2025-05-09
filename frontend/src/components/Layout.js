import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    Tab,
    Tabs,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const Layout = ({ children }) => {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getTabValue = () => {
        if (location.pathname === '/correlation') {
            return 1;
        }
        return 0;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <ShowChartIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Stock Price Analytics
                    </Typography>
                    <Tabs
                        value={getTabValue()}
                        textColor="inherit"
                        indicatorColor="secondary"
                        aria-label="navigation tabs"
                    >
                        <Tab label="Stock Chart" component={RouterLink} to="/" />
                        <Tab label="Correlation" component={RouterLink} to="/correlation" />
                    </Tabs>
                </Toolbar>
            </AppBar>
            <Container
                component="main"
                maxWidth="lg"
                sx={{
                    mt: 4,
                    mb: 4,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {children}
            </Container>
            <Box
                component="footer"
                sx={{
                    py: 2,
                    textAlign: 'center',
                    backgroundColor: theme.palette.grey[100]
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    Stock Price Visualization Application
                </Typography>
            </Box>
        </Box>
    );
};

export default Layout;