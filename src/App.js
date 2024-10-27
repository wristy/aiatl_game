import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import ResultsPage from './ResultsPage'; // Example for a secondary page
import { AppProvider } from './AppContext';

function App() {
    return (
        <AppProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/results" element={<ResultsPage />} />
                </Routes>
            </Router>
        </AppProvider>
    );
}

export default App;