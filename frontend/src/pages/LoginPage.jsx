import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState(null);
    const { login, fetchUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            if (isRegistering) {
                // Register
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.detail || "Registration failed");
                login(data.access_token);
                await fetchUser();
                navigate('/');
            } else {
                // Login
                const formData = new URLSearchParams();
                formData.append('username', email);
                formData.append('password', password);
                
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData.toString()
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.detail || "Login failed");
                login(data.access_token);
                await fetchUser();
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                <div style={{
                    background: 'var(--surface)',
                    padding: '2rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    width: '100%',
                    maxWidth: '400px'
                }}>
                    <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--primary)' }}>
                        {isRegistering ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    
                    {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {isRegistering && (
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--background)',
                                    color: 'var(--text)'
                                }}
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--background)',
                                color: 'var(--text)'
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--background)',
                                color: 'var(--text)'
                            }}
                        />
                        <button type="submit" style={{
                            padding: '0.75rem',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '0.5rem'
                        }}>
                            {isRegistering ? 'Sign Up' : 'Log In'}
                        </button>
                    </form>
                    
                    <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                        <span 
                            onClick={() => setIsRegistering(!isRegistering)}
                            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            {isRegistering ? 'Log In' : 'Sign Up'}
                        </span>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;
