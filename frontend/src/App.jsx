import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalyzerPage from './pages/AnalyzerPage';
import ReviewPage from './pages/ReviewPage';
import LoginPage from './pages/LoginPage';
import Profile from './pages/Profile';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/analyze" element={<AnalyzerPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App;
