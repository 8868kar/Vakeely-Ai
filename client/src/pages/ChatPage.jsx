import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiPlus, FiMessageSquare, FiClock, FiTrash2 } from 'react-icons/fi';

const ChatPage = () => {
  const { user } = useAuth();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await chatAPI.getHistory();
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const loadChat = async (id) => {
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

  const deleteChat = async (id, e) => {
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
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage({ message: userMessage, chatId });
      setChatId(res.data.chatId);

      const responseData = res.data.response;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: typeof responseData === 'string' ? responseData : responseData.explanation || 'I have processed your request.',
        parsed: typeof responseData === 'object' ? responseData : null 
      }]);
      loadHistory();
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err.response?.data?.message || 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage,
        parsed: { explanation: errorMessage }
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    'My landlord is not returning my security deposit',
    'I received a notice for tax evasion',
    'I want to file for divorce',
    'Someone stole my laptop from office',
    'I need to register a new company',
    'Consumer complaint about defective product',
  ];

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  const renderLegalResponse = (parsed) => {
    if (!parsed) return null;

    return (
      <div className="legal-response">
        {parsed.caseType && (
          <div className="case-type-badge">⚖️ {parsed.caseType}</div>
        )}

        {parsed.summary && (
          <>
            <h4>📋 Summary</h4>
            <p>{parsed.summary}</p>
          </>
        )}

        {parsed.explanation && (
          <>
            <h4>💡 Explanation</h4>
            <p>{parsed.explanation}</p>
          </>
        )}

        {parsed.relevantLaws && parsed.relevantLaws.length > 0 && (
          <>
            <h4>📜 Relevant Laws</h4>
            {parsed.relevantLaws.map((law, i) => (
              <div key={i} className="law-reference">
                <div>
                  <div className="law-act">{law.act}</div>
                  {law.section && <div className="law-section">Section {law.section}</div>}
                  <div className="law-desc">{law.description}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {parsed.recommendations && (
          <>
            <h4>✅ Recommendations</h4>
            <p>{parsed.recommendations}</p>
          </>
        )}

        {parsed.lawyerType && (
          <>
            <h4>👨‍⚖️ Recommended Lawyer</h4>
            <p>{parsed.lawyerType}</p>
          </>
        )}

        {(parsed.complexity || parsed.estimatedTimeline) && (
          <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            {parsed.complexity && <span className="badge badge-warning">Complexity: {parsed.complexity}</span>}
            {parsed.estimatedTimeline && <span className="badge badge-info">Timeline: {parsed.estimatedTimeline}</span>}
          </div>
        )}

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 16, fontStyle: 'italic' }}>
          ⚠️ This is AI-generated guidance and not a substitute for professional legal advice.
        </p>
      </div>
    );
  };

  return (
    <div className="chat-page">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <button className="btn btn-primary btn-block btn-sm" onClick={startNewChat}>
            <FiPlus /> New Chat
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {history.map(chat => (
            <div key={chat._id}
              className={`chat-history-item ${chatId === chat._id ? 'active' : ''}`}
              onClick={() => loadChat(chat._id)}>
              <FiMessageSquare style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4>{chat.title}</h4>
                <div className="chat-date">
                  <FiClock size={10} style={{ marginRight: 4 }} />
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <button onClick={(e) => deleteChat(chat._id, e)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.5, padding: 4 }}>
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
              <div className="chat-welcome-icon">⚖️</div>
              <h2>VAkeely AI Assistant</h2>
              <p>Describe your legal situation and I&apos;ll provide AI-powered guidance with relevant Indian laws and lawyer recommendations.</p>
              <div className="suggestion-chips">
                {suggestions.map((s, i) => (
                  <button key={i} className="suggestion-chip" onClick={() => { setInput(s); textareaRef.current?.focus(); }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? getInitials(user?.name) : '⚖️'}
                </div>
                <div className="message-content">
                  {msg.role === 'assistant' && msg.parsed 
                    ? renderLegalResponse(msg.parsed)
                    : msg.role === 'assistant'
                      ? (() => {
                          try {
                            const parsed = JSON.parse(msg.content);
                            return renderLegalResponse(parsed);
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
              <div className="message-avatar">⚖️</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
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
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your legal situation..."
              rows={1}
              style={{ height: 'auto' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
              }}
            />
            <button className="chat-send-btn" onClick={sendMessage} disabled={!input.trim() || loading}>
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
