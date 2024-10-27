import logo from './logo.svg';
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import ResultsPage from './ResultsPage';
// import { useEffect } from 'react';

function App() {
  
  return (
    <div className="App">
      <Router>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/results" element={<ResultsPage />} />
          </Routes>
      </Router>
    </div>
    
  );
}

export default App;
