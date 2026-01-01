import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalyzerPage from './pages/AnalyzerPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/analyze" element={<AnalyzerPage />} />
            </Routes>
        </Router>
    );
}

export default App;
