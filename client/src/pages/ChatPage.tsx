import React, { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { chatAPI } from '../services/api.js';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import {
  FiSend, FiPlus, FiMessageSquare, FiClock, FiTrash2,
  FiShield, FiFileText, FiInfo, FiBook, FiCheckCircle,
  FiUser, FiAlertTriangle, FiDatabase, FiZap, FiLayers
} from 'react-icons/fi';
import { IChatMessage, IChat, IAIStatus, IAIResponse } from '../types/index.js';

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<Partial<IChat>[]>([]);
  const [aiStatus, setAiStatus] = useState<IAIStatus | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHARS = 2000;

  useEffect(() => {
    loadHistory();
    fetchAIStatus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAIStatus = async () => {
    try {
      const res = await api.get('/chat/status');
      setAiStatus(res.data);
    } catch {
      // status fetch is non-critical
    }
  };

  const loadHistory = async () => {
    try {
      const res = await chatAPI.getHistory();
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const loadChat = async (id: string) => {
    try {
      const res = await chatAPI.getChat(id);
      setChatId(id);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Failed to load chat:', err);
    }
  };

  const startNewChat = () => {
    setChatId(null);
    setMessages([]);
    setInput('');
  };

  const deleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await chatAPI.deleteChat(id);
      setHistory(prev => prev.filter(c => c._id !== id));
      if (chatId === id) startNewChat();
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || input.length > MAX_CHARS) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage({ message: userMessage, chatId: chatId || undefined });
      setChatId(res.data.chatId);

      const responseData = res.data.response;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: typeof responseData === 'string' ? responseData : responseData.explanation || '',
        parsed: typeof responseData === 'object' ? responseData : undefined,
        isRAG: res.data.isRAG || false,
        model: res.data.model || null,
        isFallback: res.data.isFallback || false
      }]);
      loadHistory();
    } catch (err: any) {
      console.error('Chat error:', err);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (err.response?.status === 429) {
        const data = err.response.data;
        errorMessage = `Rate limit reached. You can send 20 messages per hour. ${data?.retryAfter ? `Try again in ${Math.ceil(data.retryAfter / 60)} minutes.` : ''}`;
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'Invalid message. Please check your input.';
      }
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage,
        parsed: { explanation: errorMessage } as IAIResponse,
        isFallback: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    'My landlord is not returning my security deposit',
    'I received a notice for tax evasion from Income Tax dept',
    'I want to file for divorce by mutual consent',
    'Someone stole my laptop and filed a false police complaint against me',
    'My employer terminated me without notice or severance pay',
    'Consumer complaint about a defective product that caused injury',
    'I received a bank notice under SARFAESI Act',
    'My tenant is refusing to vacate even after lease expiry'
  ];

  const getInitials = (name?: string) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  const renderLegalResponse = (parsed: IAIResponse, meta: { isRAG?: boolean; model?: string | null; isFallback?: boolean } = {}) => {
    if (!parsed) return null;

    return (
      <div className="legal-response">
        {/* AI Engine Badge */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {parsed.caseType && (
            <div className="case-type-badge">
              <FiShield size={13} style={{ marginRight: 5 }} />
              {parsed.caseType}
            </div>
          )}
          {meta.isRAG && (
            <div className="case-type-badge" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}>
              <FiDatabase size={12} style={{ marginRight: 5 }} />
              Law DB Grounded
            </div>
          )}
          {meta.model && !meta.isFallback && (
            <div className="case-type-badge" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)' }}>
              <FiZap size={12} style={{ marginRight: 5 }} />
              {meta.model}
            </div>
          )}
          {meta.isFallback && (
            <div className="case-type-badge" style={{ background: 'rgba(234,179,8,0.12)', color: '#eab308', border: '1px solid rgba(234,179,8,0.25)' }}>
              <FiLayers size={12} style={{ marginRight: 5 }} />
              Fallback Mode
            </div>
          )}
        </div>

        {parsed.summary && (
          <div style={{ background: 'rgba(59, 130, 246, 0.04)', border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', marginBottom: 8, fontSize: '1rem', fontWeight: 600 }}><FiFileText />Case Summary</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{parsed.summary}</p>
          </div>
        )}

        {parsed.explanation && (
          <div style={{ background: 'rgba(139, 92, 246, 0.04)', border: '1px solid rgba(139, 92, 246, 0.1)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)', marginBottom: 8, fontSize: '1rem', fontWeight: 600 }}><FiInfo />Legal Analysis</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{parsed.explanation}</p>
          </div>
        )}

        {parsed.relevantLaws && parsed.relevantLaws.length > 0 && (
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', marginBottom: 12, fontSize: '1rem', fontWeight: 600 }}><FiBook style={{ color: 'var(--primary)' }} />Relevant Laws</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {parsed.relevantLaws.map((law, i) => (
                <div key={i} className="law-reference" style={{ background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
                  <div>
                    <div className="law-act" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{law.act}</div>
                    {law.section && <div className="law-section" style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: 4 }}>§ {law.section}</div>}
                    <div className="law-desc" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{law.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {parsed.precedents && parsed.precedents.length > 0 && (
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', marginBottom: 12, fontSize: '1rem', fontWeight: 600 }}><FiLayers style={{ color: '#6366f1' }} />Supreme Court Precedents</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {parsed.precedents.map((prec: any, i: number) => (
                <div key={i} className="law-reference" style={{ background: 'rgba(99,102,241,0.06)', borderLeft: '3px solid #6366f1', padding: '12px 16px', borderRadius: 8 }}>
                  <div>
                    <div className="law-act" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prec.title}</div>
                    <div className="law-section" style={{ fontSize: '0.85rem', color: '#6366f1', marginBottom: 4 }}>{prec.date !== 'N/A' ? new Date(prec.date).toLocaleDateString() : 'Date N/A'} • {prec.bench}</div>
                    {prec.summary && <div className="law-desc" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{prec.summary}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {parsed.recommendations && (
          <div style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981', marginBottom: 8, fontSize: '1rem', fontWeight: 600 }}><FiCheckCircle />Recommended Actions</h4>
            <p style={{ whiteSpace: 'pre-line', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{parsed.recommendations}</p>
          </div>
        )}

        {parsed.lawyerType && (
          <div style={{ background: 'rgba(0, 0, 0, 0.02)', border: '1px dashed var(--border)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', marginBottom: 8, fontSize: '1rem', fontWeight: 600 }}><FiUser style={{ color: 'var(--primary)' }} />Lawyer Type Required</h4>
            <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{parsed.lawyerType}</p>
          </div>
        )}

        {parsed.matchedLawyers && parsed.matchedLawyers.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <h4><FiUser size={15} style={{ marginRight: 8, verticalAlign: 'middle' }} />Recommended Lawyers</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
              {parsed.matchedLawyers.map((lawyer: any, i: number) => (
                <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 4 }}>
                    {lawyer.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    {lawyer.specializations && lawyer.specializations.join(', ')} • {lawyer.experience} yrs exp.
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>📍 {lawyer.location}</span>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{lawyer.consultationFee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Law DB Sources — shown only when RAG found results */}
        {parsed.legalDBSources && parsed.legalDBSources.length > 0 && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(34,197,94,0.06)', borderRadius: 8, border: '1px solid rgba(34,197,94,0.15)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#22c55e', letterSpacing: '0.05em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
              <FiDatabase size={11} /> SOURCES FROM VAKEELY LAW DATABASE
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {parsed.legalDBSources.map((src, i) => (
                <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(34,197,94,0.1)', color: '#4ade80', padding: '2px 10px', borderRadius: 20, fontFamily: 'monospace' }}>
                  {src}
                </span>
              ))}
            </div>
          </div>
        )}

        {(parsed.complexity || parsed.estimatedTimeline) && (
          <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
            {parsed.complexity && <span className="badge badge-warning">Complexity: {parsed.complexity}</span>}
            {parsed.estimatedTimeline && <span className="badge badge-info">Timeline: {parsed.estimatedTimeline}</span>}
          </div>
        )}

        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 14, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 5 }}>
          <FiAlertTriangle size={11} />
          AI-generated guidance only — consult a qualified advocate registered with the Bar Council of India.
        </p>
      </div>
    );
  };

  const charCount = input.length;
  const charWarning = charCount > MAX_CHARS * 0.85;

  return (
    <div className="chat-page">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <button className="btn btn-primary btn-block btn-sm" onClick={startNewChat}>
            <FiPlus /> New Chat
          </button>

          {/* AI Status Badge */}
          {aiStatus && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: aiStatus.available ? '#22c55e' : '#eab308', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontWeight: 600, color: aiStatus.available ? '#22c55e' : '#eab308' }}>
                  {aiStatus.available ? aiStatus.model : 'Fallback Mode'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <FiDatabase size={10} />
                <span>Law DB Active</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {history.map(chat => (
            <div
              key={chat._id}
              className={`chat-history-item ${chatId === chat._id ? 'active' : ''}`}
              onClick={() => chat._id && loadChat(chat._id)}
            >
              <FiMessageSquare style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4>{chat.title}</h4>
                <div className="chat-date">
                  <FiClock size={10} style={{ marginRight: 4 }} />
                  {chat.updatedAt ? new Date(chat.updatedAt).toLocaleDateString() : 'Recent'}
                </div>
              </div>
              <button
                onClick={(e) => chat._id && deleteChat(chat._id, e)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.5, padding: 4 }}
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="chat-main">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-welcome">
              <div className="chat-welcome-icon">
                <FiShield size={32} />
              </div>
              <h2>VAkeely AI Legal Assistant</h2>
              <p>
                Powered by GPT-4o-mini + VAkeely&apos;s verified Indian law database.
                Describe your legal situation for grounded, precise guidance.
              </p>

              {/* Suggestion chips */}
              <div className="suggestion-chips">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="suggestion-chip"
                    onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? getInitials(user?.name) : <FiShield size={18} />}
                </div>
                <div className="message-content">
                  {msg.role === 'assistant' && msg.parsed
                    ? renderLegalResponse(msg.parsed, { isRAG: msg.isRAG, model: msg.model, isFallback: msg.isFallback })
                    : msg.role === 'assistant'
                      ? (() => {
                          try {
                            const parsed = JSON.parse(msg.content);
                            return renderLegalResponse(parsed, {});
                          } catch {
                            return <p>{msg.content}</p>;
                          }
                        })()
                      : <p>{msg.content}</p>
                  }
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="message assistant">
              <div className="message-avatar"><FiShield size={18} /></div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                  Searching law database and generating response...
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your legal situation in detail..."
              rows={1}
              style={{ height: 'auto' }}
              onInput={(e: any) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
              }}
            />
            <button className="chat-send-btn" onClick={sendMessage} disabled={!input.trim() || loading || charCount > MAX_CHARS}>
              <FiSend />
            </button>
          </div>
          {/* Character counter */}
          {charCount > 0 && (
            <div style={{ textAlign: 'right', fontSize: '0.72rem', marginTop: 4, color: charWarning ? (charCount > MAX_CHARS ? 'var(--error)' : '#eab308') : 'var(--text-muted)' }}>
              {charCount}/{MAX_CHARS}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
