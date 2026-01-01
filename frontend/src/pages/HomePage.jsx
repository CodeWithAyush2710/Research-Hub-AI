import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Zap, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const HomePage = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ maxWidth: '800px', margin: '4rem auto' }}
                >
                    <h1 style={{
                        fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                        fontWeight: '800',
                        lineHeight: 1.1,
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Unlock Scientific Knowledge
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: 1.6 }}>
                        Navigate the world of research with AI-powered summaries, key insights, and trend analysis.
                    </p>

                    <Link to="/analyze" style={{ ...largeButtonStyle, display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                        Start Researching <ArrowRight size={20} />
                    </Link>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', width: '100%', padding: '4rem 0' }}>
                    <FeatureCard
                        icon={<Brain color="#6366f1" />}
                        title="AI Summaries"
                        text="Get concise, accurate summaries of complex papers in seconds."
                    />
                    <FeatureCard
                        icon={<Zap color="#ec4899" />}
                        title="Key Findings"
                        text="Instantly extract the most important results and methodologies."
                    />
                    <FeatureCard
                        icon={<Globe color="#a855f7" />}
                        title="Global Search"
                        text="Access millions of papers from ArXiv directly from one interface."
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
};

const FeatureCard = ({ icon, title, text }) => (
    <motion.div
        whileHover={{ y: -5 }}
        style={{
            padding: '2rem',
            borderRadius: '1rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            textAlign: 'left'
        }}
    >
        <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', display: 'inline-block' }}>
            {React.cloneElement(icon, { size: 32 })}
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: '600' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{text}</p>
    </motion.div>
);

const buttonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    background: 'var(--surface)',
    color: 'white',
    fontWeight: '600',
    textDecoration: 'none',
    border: '1px solid var(--border)',
    transition: 'all 0.2s'
};

const largeButtonStyle = {
    padding: '1rem 2.5rem',
    borderRadius: '9999px',
    background: 'linear-gradient(to right, #6366f1, #a855f7)',
    color: 'white',
    fontWeight: '600',
    fontSize: '1.1rem',
    textDecoration: 'none',
    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
    transition: 'transform 0.2s',
};

export default HomePage;
