import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PaperCard from '../components/PaperCard';
import Footer from '../components/Footer';

import Navbar from '../components/Navbar';

function AnalyzerPage() {
    const [query, setQuery] = useState('');
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (searchQuery) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(null);
        setPapers([]);

        try {
            // Use env variable for production, or relative path (proxy) for dev
            const API_BASE = import.meta.env.VITE_API_URL || '';
            const response = await axios.post(`${API_BASE}/api/analyze`, { query: searchQuery });
            setPapers(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch papers. Please try again.');
        } finally {
            setLoading(false);
        }
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
                    <SearchBar onSearch={handleSearch} isLoading={loading} />
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
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '4rem 0' }}
                        >
                            <Loader2 className="spin" size={48} color="var(--primary)" />
                            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Analyzing papers... This may take a minute.</p>
                        </motion.div>
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
