import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Loader2 } from 'lucide-react';

const Loader = ({ text = "Analyzing papers... This may take a minute." }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '4rem auto',
        padding: '3rem',
        borderRadius: '1.5rem',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        maxWidth: '500px',
      }}
    >
      <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '2rem' }}>
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            inset: 0,
            border: '3px solid transparent',
            borderTopColor: 'var(--primary, #3b82f6)',
            borderRightColor: 'var(--primary, #3b82f6)',
            borderRadius: '50%',
            opacity: 0.8
          }}
        />
        {/* Inner rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            inset: '12px',
            border: '3px solid transparent',
            borderBottomColor: '#a855f7',
            borderLeftColor: '#a855f7',
            borderRadius: '50%',
            opacity: 0.8
          }}
        />
        {/* Center icon */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain size={40} color="var(--primary, #3b82f6)" />
          </motion.div>
        </div>
      </div>
      
      <motion.div
         animate={{ opacity: [0.7, 1, 0.7] }}
         transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
         style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}
      >
        <Sparkles size={20} color="#a855f7" />
        <h3 style={{
          margin: 0,
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--text-primary, #fff)',
          letterSpacing: '0.5px'
        }}>
          AI is analyzing your topic
        </h3>
        <Sparkles size={20} color="#a855f7" />
      </motion.div>
      
      <p style={{
        marginTop: 0,
        color: 'var(--text-secondary, #9ca3af)',
        textAlign: 'center',
        fontSize: '0.95rem',
        lineHeight: 1.6,
        maxWidth: '80%'
      }}>
        {text}
      </p>

      <div style={{
        marginTop: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--primary, #3b82f6)',
        fontSize: '0.875rem',
        fontWeight: 500
      }}>
        <Loader2 className="spin" size={16} />
        <span>Fetching recent publications...</span>
      </div>

      <style>{`
        .spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default Loader;
