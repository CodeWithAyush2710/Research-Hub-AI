import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Link as LinkIcon, Download, ChevronRight, BookOpen, Lightbulb, TrendingUp, AlertTriangle, GitBranch, Code, Quote, Compass, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const tabs = [
    { id: 'summary', label: 'Summary', icon: BookOpen },
    { id: 'key_findings', label: 'Key Findings', icon: Lightbulb },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'advantages_disadvantages', label: 'Pros/Cons', icon: AlertTriangle },
    { id: 'related_work', label: 'Related', icon: GitBranch },
    { id: 'code_implementations', label: 'Code', icon: Code },
    { id: 'citations_references', label: 'Citations', icon: Quote },
    { id: 'future_work', label: 'Future', icon: Compass },
];

const PaperCard = ({ paper }) => {
    const [activeTab, setActiveTab] = useState('summary');

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                        {paper.title || 'Untitled Paper'}
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {paper.link && (
                            <a href={paper.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                                <LinkIcon size={16} /> Read Paper
                            </a>
                        )}
                        {/* PDF link usually deduced or provided, if not capable of deducing we skip */}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                background: isActive ? 'var(--surface-hover)' : 'transparent',
                                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div style={{ minHeight: '150px' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ContentRenderer content={paper[activeTab]} type={activeTab} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const ContentRenderer = ({ content, type }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!content) return <p style={{ fontStyle: 'italic', opacity: 0.5 }}>No information available.</p>;

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={handleCopy}
                style={{
                    position: 'absolute',
                    top: '-2.5rem',
                    right: 0,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    borderRadius: '0.25rem',
                    padding: '0.35rem 0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    zIndex: 10,
                    transition: 'all 0.2s'
                }}
                title="Copy to clipboard"
            >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                {copied ? <span style={{color: '#10b981'}}>Copied</span> : 'Copy'}
            </button>
            <div className="markdown-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.7, width: '100%', overflowX: 'auto', wordWrap: 'break-word' }}>
                <ReactMarkdown
                   components={{
                       h1: ({node, ...props}) => <h3 style={{color: 'var(--text)', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem'}} {...props} />,
                       h2: ({node, ...props}) => <h4 style={{color: 'var(--text)', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem'}} {...props} />,
                       h3: ({node, ...props}) => <h5 style={{color: 'var(--text)', fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.5rem'}} {...props} />,
                       p: ({node, ...props}) => <p style={{marginBottom: '0.75rem', maxWidth: '100%'}} {...props} />,
                       strong: ({node, ...props}) => <strong style={{color: 'var(--text)', fontWeight: '600'}} {...props} />,
                       em: ({node, ...props}) => <em style={{color: 'var(--primary)', fontStyle: 'italic'}} {...props} />,
                       code: ({node, inline, ...props}) => 
                           inline ? 
                           <code style={{background: 'rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '0.1rem 0.3rem', borderRadius: '0.25rem'}} {...props} /> :
                           <div style={{ maxWidth: '100%', overflow: 'hidden', margin: '1rem 0' }}>
                               <pre style={{
                                   background: '#0a0a0a',
                                   border: '1px solid var(--border)',
                                   padding: '1.25rem',
                                   borderRadius: '0.5rem',
                                   overflowX: 'auto',
                                   fontSize: '0.9rem',
                                   color: '#a5f3fc',
                                   maxWidth: '100%',
                                   whiteSpace: 'pre-wrap',
                                   wordBreak: 'break-word'
                               }}>
                                   <code {...props} />
                               </pre>
                           </div>,
                       ul: ({node, ...props}) => <ul style={{marginBottom: '1rem', paddingLeft: '1.5rem'}} {...props} />,
                       ol: ({node, ...props}) => <ol style={{marginBottom: '1rem', paddingLeft: '1.5rem'}} {...props} />,
                       li: ({node, ...props}) => <li style={{marginBottom: '0.5rem'}} {...props} />
                   }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default PaperCard;
