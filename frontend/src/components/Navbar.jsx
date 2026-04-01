import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, token } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={{
            padding: '1rem 2rem',
            borderBottom: '1px solid var(--border)',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--text)' }}>
                    <Sparkles size={24} color="#a855f7" />
                    <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Research Hub AI</span>
                </Link>

                {/* Desktop Nav */}
                <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <NavLink to="/" active={isActive('/')}>Home</NavLink>
                    <NavLink to="/analyze" active={isActive('/analyze')}>Analyze</NavLink>
                    <NavLink to="/review" active={isActive('/review')}>Peer Review</NavLink>
                    {token && user ? (
                        <Link to="/profile" style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            color: 'var(--text)', textDecoration: 'none', fontWeight: 'bold'
                        }}>
                            <User size={18} />
                            Welcome, {user.name}
                        </Link>
                    ) : (
                        <Link to="/login" style={{
                            padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white',
                            borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'
                        }}>
                            Log In / Sign Up
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', background: 'var(--surface)' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem 2rem', gap: '1rem' }}>
                            <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
                            <MobileNavLink to="/analyze" onClick={() => setIsMobileMenuOpen(false)}>Analyze</MobileNavLink>
                            <MobileNavLink to="/review" onClick={() => setIsMobileMenuOpen(false)}>Peer Review</MobileNavLink>
                            {token && user ? (
                                <MobileNavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile: {user.name}</MobileNavLink>
                            ) : (
                                <MobileNavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>Log In</MobileNavLink>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .mobile-menu-btn { display: block !important; }
                }
                @media (min-width: 769px) {
                    .mobile-menu-btn { display: none !important; }
                }
            `}</style>
        </nav>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link to={to} style={{
        textDecoration: 'none',
        color: active ? 'var(--primary)' : 'var(--text-secondary)',
        fontWeight: '500',
        transition: 'color 0.2s'
    }}>
        {children}
    </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
    <Link to={to} onClick={onClick} style={{
        textDecoration: 'none',
        color: 'var(--text)',
        padding: '0.5rem 0',
        borderBottom: '1px solid var(--border)'
    }}>
        {children}
    </Link>
);

export default Navbar;
