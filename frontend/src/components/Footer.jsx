import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer style={{
            marginTop: 'auto',
            padding: '2rem',
            borderTop: '1px solid var(--border)',
            background: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}
                >
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                        <a href="https://github.com/CodeWithAyush2710" target='_blank' style={iconLinkStyle}><Github size={20} /></a>
                        <a href="https://twitter.com/iamayush2710" target='_blank' style={iconLinkStyle}><Twitter size={20} /></a>
                        <a href="https://linkedin.com/in/ayush-srivastava-114b58215" target='_blank' style={iconLinkStyle}><Linkedin size={20} /></a>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                        Built with <Heart size={14} color="#ec4899" fill="#ec4899" /> by Research Hub AI
                    </p>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', opacity: 0.7 }}>
                        © {new Date().getFullYear()} Research Hub AI. Open Source for Science.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

const iconLinkStyle = {
    color: 'var(--text-secondary)',
    transition: 'color 0.2s',
    cursor: 'pointer',
    ':hover': {
        color: 'var(--primary)'
    }
};

export default Footer;
