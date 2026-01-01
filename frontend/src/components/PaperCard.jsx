import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Link as LinkIcon, Download, ChevronRight, BookOpen, Lightbulb, TrendingUp, AlertTriangle, GitBranch, Code, Quote, Compass } from 'lucide-react';

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
    if (!content) return <p style={{ fontStyle: 'italic', opacity: 0.5 }}>No information available.</p>;

    if (type === 'code_implementations') {
        return (
            <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
                <pre style={{
                    background: '#000',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    overflowX: 'auto',
                    fontSize: '0.9rem',
                    color: '#a5f3fc',
                    maxWidth: '100%',
                    whiteSpace: 'pre-wrap',       /* Wrap text so it doesn't force scroll if not needed */
                    wordBreak: 'break-word'       /* Break long words */
                }}>
                    <code>{content}</code>
                </pre>
            </div>
        )
    }

    // Basic markdown-like parsing for bullet points
    const lines = content.split('\n');
    return (
        <div style={{
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            width: '100%',
            overflowX: 'auto',
            wordWrap: 'break-word'
        }}>
            {lines.map((line, i) => (
                <p key={i} style={{ marginBottom: '0.5rem', maxWidth: '100%' }}>
                    {line}
                </p>
            ))}
        </div>
    );
}

export default PaperCard;
