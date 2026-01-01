import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch, isLoading }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%' }}>
            <div style={{
                position: 'relative',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 0 0 1px var(--border), 0 10px 15px -3px rgba(0,0,0,0.1)',
                background: 'var(--surface)'
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter research topic (e.g., 'Generative AI in Medicine')..."
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '1.25rem 1.5rem',
                        paddingRight: '4rem',
                        fontSize: '1.25rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--text)',
                        outline: 'none',
                    }}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    style={{
                        position: 'absolute',
                        right: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'var(--primary)',
                        border: 'none',
                        borderRadius: '0.75rem',
                        padding: '0.75rem',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s'
                    }}
                >
                    <Search size={24} />
                </button>
            </div>

            {/* Decorative glow */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.98, 1.02, 0.98]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                    position: 'absolute',
                    inset: -4,
                    background: 'linear-gradient(to right, #6366f1, #ec4899)',
                    zIndex: -1,
                    filter: 'blur(20px)',
                    borderRadius: '1rem',
                    opacity: 0.5
                }}
            />
        </form>
    );
};

export default SearchBar;
