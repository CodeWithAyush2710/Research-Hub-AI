import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Loader2, ArrowLeft, Upload, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import PaperCard from '../components/PaperCard';
import Footer from '../components/Footer';

import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

function AnalyzerPage() {
    const [searchInput, setSearchInput] = useState('');
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // Default config local for development
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const getHeaders = () => {
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleUnifiedSubmit = async () => {
        if (selectedFile) {
            
            if (!token) {
                alert("Please log in to analyze your own PDFs.");
                navigate('/login');
                return;
            }

            setLoading(true);
            setError(null);
            setPapers([]);

            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await axios.post(`${API_BASE}/api/analyze/pdf`, formData, {
                    headers: {
                        ...getHeaders(),
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setPapers([response.data]);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    navigate('/login');
                } else {
                    setError('Failed to analyze the PDF. Ensure it is a valid text-based PDF.');
                }
            } finally {
                setLoading(false);
                setSelectedFile(null);
                if(fileInputRef.current) fileInputRef.current.value = '';
            }
        } else if (searchInput.trim()) {
            setLoading(true);
            setError(null);
            setPapers([]);

            try {
                const response = await axios.post(`${API_BASE}/api/analyze`, { query: searchInput }, { headers: getHeaders() });
                setPapers(response.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    alert("You have reached your guest limit. Please log in to continue searching.");
                    navigate('/login');
                } else {
                    setError('Failed to fetch papers. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        } else {
            setError('Please enter a research topic or select a PDF to analyze.');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setError('Only PDF files are supported.');
            return;
        }
        setSelectedFile(file);
        // Clear text input to avoid confusion since PDF takes priority
        setSearchInput('');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, padding: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ maxWidth: '800px', margin: '0 auto 4rem auto', textAlign: 'center' }}
                >
                    <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: '800' }}>Search Papers</h1>
                    
                    <div style={{
                        display: 'flex', flexDirection: 'column', gap: '1.5rem',
                        background: 'var(--surface)', padding: '2rem', borderRadius: '1rem',
                        border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => { setSearchInput(e.target.value); setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                                placeholder="Enter research topic..."
                                disabled={loading}
                                style={{
                                    flex: 1, minWidth: '200px', padding: '1rem', fontSize: '1.1rem',
                                    borderRadius: '0.5rem', border: '1px solid var(--border)',
                                    background: 'var(--background)', color: 'var(--text)', outline: 'none'
                                }}
                            />
                            
                            <input 
                                type="file" 
                                accept="application/pdf" 
                                onChange={handleFileSelect}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                id="pdf-upload"
                            />
                            <label htmlFor="pdf-upload" style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '1rem 1.5rem', background: selectedFile ? 'rgba(99, 102, 241, 0.2)' : 'var(--background)',
                                border: `1px solid ${selectedFile ? 'var(--primary)' : 'var(--border)'}`, 
                                borderRadius: '0.5rem', color: selectedFile ? 'var(--primary)' : 'var(--text)', 
                                fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap'
                            }}>
                                <FileText size={20} />
                                {selectedFile ? 'PDF Selected' : 'Attach PDF'}
                            </label>
                        </div>
                        
                        {selectedFile && (
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'left' }}>
                                Selected: <strong>{selectedFile.name}</strong>
                            </div>
                        )}

                        <button 
                            onClick={handleUnifiedSubmit}
                            disabled={loading || (!searchInput.trim() && !selectedFile)}
                            style={{
                                width: '100%', padding: '1rem', background: 'var(--primary)',
                                color: 'white', border: 'none', borderRadius: '0.5rem',
                                fontSize: '1.2rem', fontWeight: 'bold', cursor: loading || (!searchInput.trim() && !selectedFile) ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s', opacity: loading || (!searchInput.trim() && !selectedFile) ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Processing...' : 'Search / Analyze'}
                        </button>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ maxWidth: '800px', margin: '0 auto 2rem auto', padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#ef444420', border: '1px solid #ef4444', color: '#fca5a5', textAlign: 'center' }}
                        >
                            {error}
                        </motion.div>
                    )}

                    {loading && (
                        <Loader text="Gathering and comprehending the latest research papers related to your topic. This may take a moment." />
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                        {papers.map((paper, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <PaperCard paper={paper} />
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            </main>

            <Footer />

            <style>{`
        .spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

export default AnalyzerPage;
