import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Loading profile or you need to log in...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <main style={{ flex: 1, padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <div style={{
                    background: 'var(--surface)',
                    padding: '2rem',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    marginBottom: '2rem'
                }}>
                    <h1 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>My Profile</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>View your details and history.</p>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>Name:</span> <span style={{ color: 'var(--text-secondary)' }}>{user.name}</span>
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>Email:</span> <span style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
                    </div>
                    
                    <button onClick={handleLogout} style={{
                        padding: '0.75rem 1.5rem',
                        background: 'transparent',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>
                        Log Out
                    </button>
                </div>

                <div style={{
                    background: 'var(--surface)',
                    padding: '2rem',
                    borderRadius: '16px',
                    border: '1px solid var(--border)'
                }}>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Analyzed & Uploaded Papers</h2>
                    
                    {user.uploaded_papers && user.uploaded_papers.length > 0 ? (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {user.uploaded_papers.map((paper, index) => (
                                <li key={index} style={{
                                    padding: '1rem',
                                    borderBottom: index === user.uploaded_papers.length - 1 ? 'none' : '1px solid var(--border)',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    📄 {paper}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>You haven't analyzed any papers yet.</p>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default Profile;
