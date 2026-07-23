'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Code2, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  Copy, 
  ChevronRight,
  Terminal,
  RefreshCw,
  Zap
} from 'lucide-react';

import { EXAMPLES, ExamplePreset } from '@/lib/examples';

interface Issue {
  line: number;
  severity: 'critical' | 'warning' | 'info';
  description: string;
}

interface ReviewResult {
  issues: Issue[];
  suggestions: string[];
  score: number;
  time_complexity?: string;
  space_complexity?: string;
  complexity_analysis?: string;
  refactored_code: string;
}

interface FixState {
  fixed_code?: string;
  explanation?: string;
  loading: boolean;
  copied?: boolean;
}

const CATEGORIES: ExamplePreset['category'][] = [
  'Arrays & Sliding Window',
  'HashMap & Frequency',
  'Graphs & BFS/DFS',
  'Trees',
  'Dynamic Programming',
  'Stack & Queue',
  'Binary Search',
  'Linked Lists',
  'ML & System Design',
  'ML Engineering & LLM Infra',
  'Streaming & Event Processing',
  'Systems Design & Concurrency',
];

export default function Home() {
  const [selectedExampleId, setSelectedExampleId] = useState('c1-max-sum-subarray-k');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(() => EXAMPLES[0]?.code || '');
  const [style, setStyle] = useState<'friendly' | 'strict' | 'complexity' | 'architect'>('complexity');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [fixes, setFixes] = useState<Record<number, FixState>>({});

  const handleSelectExample = (id: string) => {
    const found = EXAMPLES.find(ex => ex.id === id);
    if (found) {
      setSelectedExampleId(found.id);
      setLanguage(found.language);
      setCode(found.code);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const found = EXAMPLES.find(ex => ex.language === newLang);
    if (found) {
      setSelectedExampleId(found.id);
      setCode(found.code);
    }
  };

  const handleReview = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setReviewResult(null);
    setFixes({});
    
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, style }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Review generation failed');
      }
      
      setReviewResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong while compiling the review.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFixThis = async (issue: Issue, index: number) => {
    setFixes(prev => ({
      ...prev,
      [index]: { loading: true }
    }));

    try {
      const response = await fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, issue, style }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate fix');
      }

      setFixes(prev => ({
        ...prev,
        [index]: {
          fixed_code: data.fixed_code,
          explanation: data.explanation,
          loading: false,
          copied: false
        }
      }));
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'unknown error';
      setFixes(prev => ({
        ...prev,
        [index]: {
          explanation: 'Could not generate fix: ' + errMsg,
          loading: false,
          copied: false
        }
      }));
    }
  };

  const copyRefactoredCode = () => {
    if (!reviewResult?.refactored_code) return;
    navigator.clipboard.writeText(reviewResult.refactored_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyFixCode = (fixedCode: string, index: number) => {
    navigator.clipboard.writeText(fixedCode);
    setFixes(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        copied: true
      }
    }));
    setTimeout(() => {
      setFixes(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          copied: false
        }
      }));
    }, 2000);
  };

  // Determine score colors
  const getScoreColorClass = (score: number) => {
    if (score >= 8) return 'score-high';
    if (score >= 5) return 'score-medium';
    return 'score-low';
  };

  return (
    <>
      <header className="app-header">
        <div className="logo">
          <Code2 size={28} />
          <span>AI Code Reviewer</span>
        </div>
        
        <div className="header-actions">
          {/* Review Persona / Focus Selector */}
          <div className="select-wrapper">
            <select 
              className="select-dropdown"
              value={style}
              onChange={(e) => setStyle(e.target.value as 'friendly' | 'strict' | 'complexity' | 'architect')}
              title="Select Review Persona & Focus Mode"
            >
              <option value="complexity">⚡ Big-O Complexity Specialist</option>
              <option value="architect">🛡️ Production System Architect</option>
              <option value="strict">🔥 Strict Senior Dev</option>
              <option value="friendly">🌱 Friendly Technical Mentor</option>
            </select>
          </div>

          <button 
            className="btn" 
            onClick={handleReview}
            disabled={loading || !code.trim()}
          >
            <Play size={16} fill="currentColor" />
            <span>Analyze Code</span>
          </button>
        </div>
      </header>

      <main className="app-container">
        {/* Left Input Editor Panel */}
        <section className="panel left-panel">
          <div className="panel-header">
            <span className="panel-title">
              <Terminal size={16} />
              <span>Source Code Input</span>
            </span>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div className="select-wrapper">
                <select 
                  className="select-dropdown"
                  value={selectedExampleId}
                  onChange={(e) => handleSelectExample(e.target.value)}
                  title="Select Problem Preset"
                >
                  {CATEGORIES.map(category => {
                    const items = EXAMPLES.filter(ex => ex.category === category);
                    if (items.length === 0) return null;
                    return (
                      <optgroup key={category} label={category}>
                        {items.map(ex => (
                          <option key={ex.id} value={ex.id}>{ex.title}</option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>

              <div className="select-wrapper">
                <select 
                  className="select-dropdown"
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  title="Select Language"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="editor-container">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "var(--font-mono)",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 }
              }}
            />
          </div>
        </section>

        {/* Right Output Review Panel */}
        <section className="panel right-panel">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <span className="loading-text">
                {style === 'strict' 
                  ? 'CRITICIZING YOUR CODE...' 
                  : 'PREPARING MENTOR REVIEW...'}
              </span>
            </div>
          )}

          {error && (
            <div style={{ padding: '1.5rem' }}>
              <div className="error-banner">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            </div>
          )}

          {reviewResult ? (
            <div className="results-container">
              {/* Score card */}
              <div className="glass-card score-card">
                <div className="score-details">
                  <h3>
                    {style === 'strict' 
                      ? 'Senior Dev Score' 
                      : style === 'complexity'
                      ? 'Complexity Rating'
                      : style === 'architect'
                      ? 'System Security Score'
                      : 'Code Quality Rating'}
                  </h3>
                  <p>
                    {style === 'strict'
                      ? 'No nonsense appraisal based on industry standards.'
                      : style === 'complexity'
                      ? 'Algorithmic efficiency, time and space lower bounds evaluation.'
                      : style === 'architect'
                      ? 'Enterprise resilience, concurrency, and security appraisal.'
                      : 'Constructive performance and health evaluation.'}
                  </p>
                </div>
                
                <div className="score-badge-wrapper">
                  <svg className="score-ring" width="72" height="72">
                    <circle className="score-ring-circle-bg" cx="36" cy="36" r="30" />
                    <circle 
                      className={`score-ring-circle ${getScoreColorClass(reviewResult.score)}`} 
                      cx="36" 
                      cy="36" 
                      r="30" 
                      strokeDasharray="188.4"
                      strokeDashoffset={188.4 - (188.4 * reviewResult.score) / 10}
                    />
                  </svg>
                  <span className={`score-text ${getScoreColorClass(reviewResult.score)}`}>
                    {reviewResult.score}
                  </span>
                </div>
              </div>

              {/* Big-O Complexity Card */}
              {(reviewResult.time_complexity || reviewResult.space_complexity) && (
                <div className="glass-card" style={{ borderColor: 'rgba(99, 102, 241, 0.35)' }}>
                  <div className="glass-card-header">
                    <span className="glass-card-title">
                      <Zap size={18} style={{ color: 'var(--color-primary-light)' }} />
                      <span>Algorithmic Complexity (Big-O) Analysis</span>
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '0.75rem 0' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>
                        ⏱️ Time Complexity
                      </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                        {reviewResult.time_complexity || 'O(N)'}
                      </span>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>
                        💾 Auxiliary Space
                      </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-success)' }}>
                        {reviewResult.space_complexity || 'O(1)'}
                      </span>
                    </div>
                  </div>

                  {reviewResult.complexity_analysis && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', marginTop: '0.5rem' }}>
                      {reviewResult.complexity_analysis}
                    </p>
                  )}
                </div>
              )}

              {/* Issues Card */}
              <div className="glass-card">
                <div className="glass-card-header">
                  <span className="glass-card-title">
                    <AlertTriangle size={18} style={{ color: 'var(--color-critical)' }} />
                    <span>Identified Issues ({reviewResult.issues.length})</span>
                  </span>
                </div>
                
                <div>
                  {reviewResult.issues.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      No specific issues identified! Exceptional work.
                    </p>
                  ) : (
                    reviewResult.issues.map((issue, idx) => (
                      <div key={idx} className={`issue-item ${issue.severity}`}>
                        <div className="issue-meta">
                          <span className="issue-line">Line {issue.line}</span>
                          <span className={`severity-tag ${issue.severity}`}>
                            {issue.severity}
                          </span>
                        </div>
                        <p className="issue-description">{issue.description}</p>
                        
                        <button 
                          className="fix-button"
                          onClick={() => handleFixThis(issue, idx)}
                          disabled={fixes[idx]?.loading}
                        >
                          {fixes[idx]?.loading ? (
                            <RefreshCw size={12} className="loading-spinner" style={{ border: 'none', animationDuration: '2s' }} />
                          ) : (
                            <Sparkles size={12} />
                          )}
                          <span>{fixes[idx]?.loading ? 'Fixing...' : 'Fix This'}</span>
                        </button>

                        {/* Targeted Fix Drawer */}
                        {fixes[idx] && !fixes[idx].loading && (
                          <div className="fix-drawer">
                            <div className="fix-drawer-header">
                              <span>Targeted Correction</span>
                              {fixes[idx].fixed_code && (
                                <button 
                                  className="fix-button" 
                                  style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem' }} 
                                  onClick={() => copyFixCode(fixes[idx].fixed_code!, idx)}
                                >
                                  {fixes[idx].copied ? <Check size={10} style={{ color: 'var(--color-success)' }} /> : <Copy size={10} />}
                                  <span>{fixes[idx].copied ? 'Copied' : 'Copy'}</span>
                                </button>
                              )}
                            </div>
                            {fixes[idx].fixed_code && (
                              <pre className="fix-code-pre">
                                <code>{fixes[idx].fixed_code}</code>
                              </pre>
                            )}
                            {fixes[idx].explanation && (
                              <div className="fix-explanation">
                                {fixes[idx].explanation}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Suggestions Card */}
              <div className="glass-card">
                <div className="glass-card-header">
                  <span className="glass-card-title">
                    <Sparkles size={18} style={{ color: 'var(--color-secondary)' }} />
                    <span>Improvement Checklist</span>
                  </span>
                </div>
                
                <div className="suggestions-list">
                  {reviewResult.suggestions.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      No high-level recommendations needed.
                    </p>
                  ) : (
                    reviewResult.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="suggestion-item">
                        <ChevronRight size={16} className="suggestion-bullet" />
                        <span>{suggestion}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Refactored Code Card */}
              <div className="glass-card">
                <div className="glass-card-header" style={{ marginBottom: '1.25rem' }}>
                  <span className="glass-card-title">
                    <Terminal size={18} style={{ color: 'var(--color-primary-light)' }} />
                    <span>Refactored Output</span>
                  </span>
                  
                  <button className="fix-button" onClick={copyRefactoredCode}>
                    {copied ? <Check size={12} style={{ color: 'var(--color-success)' }} /> : <Copy size={12} />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                
                {/* Premium read-only Monaco Editor display */}
                <div style={{ height: '350px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                  <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={reviewResult.refactored_code}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      fontFamily: "var(--font-mono)",
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      domReadOnly: true,
                      padding: { top: 12, bottom: 12 }
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Results Placeholder */
            <div className="results-placeholder">
              <Code2 size={48} />
              <div>
                <h4 style={{ marginBottom: '0.25rem', fontWeight: 700 }}>No Analysis Done</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Paste a code snippet and click &quot;Analyze Code&quot; to receive your review.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
