import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

const SUGGESTED_QUESTIONS = [
  'WHAT IS THIS DOCUMENT ABOUT?',
  'WHAT DO I NEED TO PAY?',
  'WHEN IS THE DEADLINE?',
  'WHAT SHOULD I DO NEXT?',
  'EXPLAIN THIS SIMPLY.',
];

export default function DocumentChatPage({ document }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const documentId = document.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    async function loadChat() {
      try {
        setLoadingHistory(true);
        const history = await api.getChatHistory(documentId);
        if (history && history.length > 0) {
          setMessages(history);
        } else {
          setMessages([
            {
              role: 'assistant',
              message: `Context established for **${
                document.document_title || document.documentTitle || 'your document'
              }** from **${document.issuer || 'the issuer'}**. Ask any question regarding the tax liability, audit discrepancies, payment deadlines, or response guidelines.`,
              created_at: new Date().toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.warn('Failed to load chat history:', err);
      } finally {
        setLoadingHistory(false);
      }
    }

    loadChat();
  }, [documentId, document]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || sending) return;

    setInput('');
    setError('');

    // Append user message
    const tempUserMsg = {
      role: 'user',
      message: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setSending(true);

    try {
      const response = await api.sendMessage(documentId, text);
      if (response && response.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            message: response.reply,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Unable to fetch answer from document AI. Please retry.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border border-[#D5CEC1] bg-[#FAF8F2] flex flex-col h-[750px]">
      {/* 13 — ASK DOCUSAATHI Header */}
      <div className="p-6 border-b border-[#D5CEC1] bg-[#F1EBDD]/60 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <span className="font-mono text-[11px] text-[#3158A8] uppercase tracking-widest block mb-1">
            13 — ASK DOCUSAATHI
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B2D]">
            Ask the document.
          </h2>
        </div>
        <span className="font-mono text-[11px] text-[#70716D] uppercase">
          GROUNDED ON: {document.document_title || document.documentTitle || 'ACTIVE FILE'}
        </span>
      </div>

      {/* Suggested Questions */}
      <div className="px-6 py-3 border-b border-[#D5CEC1] bg-[#FAF8F2] flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((question, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(question)}
            disabled={sending}
            className="font-mono text-[10px] uppercase tracking-wider text-[#101B2D] border border-[#D5CEC1] hover:border-[#3158A8] hover:text-[#3158A8] bg-[#FAF8F2] px-3 py-1 transition-colors disabled:opacity-40"
          >
            {question}
          </button>
        ))}
      </div>

      {/* Messages Thread: Thin separators instead of bulky bubbles */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-[#D5CEC1]">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-full font-mono text-xs text-[#70716D] uppercase tracking-widest">
            INITIALIZING DOCUMENT CONTEXT...
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={index}
                className={`pt-6 first:pt-0 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#70716D] mb-1.5 flex items-center gap-2">
                  <span>{isUser ? 'YOU' : 'DOCUSAATHI INTELLIGENCE'}</span>
                  <span>•</span>
                  <span>{new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div
                  className={`max-w-[85%] text-xs sm:text-sm leading-relaxed p-4 border ${
                    isUser
                      ? 'border-[#101B2D] bg-[#101B2D] text-[#F1EBDD] font-mono'
                      : 'border-[#D5CEC1] border-l-4 border-l-[#3158A8] bg-[#F1EBDD] text-[#101B2D] font-serif whitespace-pre-wrap'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}

        {sending && (
          <div className="pt-6 flex flex-col items-start space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#3158A8]">
              QUERYING DOCUMENT VIA GEMINI MULTIMODAL...
            </div>
            <div className="p-3 border border-[#D5CEC1] border-l-4 border-l-[#3158A8] bg-[#F1EBDD] font-mono text-xs text-[#70716D]">
              Cross-referencing entities, dates, and amounts...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="px-6 py-2.5 bg-[#8B2626]/10 text-[#8B2626] font-mono text-xs border-t border-[#8B2626]/20">
          {error}
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-[#D5CEC1] bg-[#FAF8F2] flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this document..."
          disabled={sending}
          className="flex-1 px-4 py-2.5 font-mono text-xs sm:text-sm bg-[#FAF8F2] border border-[#D5CEC1] text-[#101B2D] focus:outline-none focus:border-[#3158A8]"
        />

        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="bg-[#101B2D] text-[#F1EBDD] hover:bg-[#1B2C47] px-6 py-2.5 font-mono text-xs uppercase tracking-widest disabled:opacity-40 transition-colors"
        >
          [ SEND ]
        </button>
      </form>

      {/* Editorial Required Disclaimer */}
      <div className="bg-[#FAF8F2] px-6 py-2.5 border-t border-[#D5CEC1] font-mono text-[10px] text-[#70716D] text-center">
        AI-generated information. Verify important legal, tax, financial or medical decisions with a qualified professional.
      </div>
    </div>
  );
}

