import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  AlertCircle,
  Clock
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'What is this document about?',
  'How much do I need to pay?',
  'When is the deadline?',
  'What should I do next?',
  'Explain this simply.',
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
              }** from **${document.issuer || 'the issuer'}**. Ask any question regarding tax liability, audit discrepancies, payment deadlines, or response guidelines.`,
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
      setError('Unable to reach document AI. Please retry.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0D1117]/90 backdrop-blur-xl flex flex-col h-[750px] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-[#111722]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5B8CFF]/20 flex items-center justify-center text-[#5B8CFF] shadow-glow-blue/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#F5F7FA]">
              ASK DOCUSAATHI
            </h2>
          </div>
          <p className="font-sans text-xs text-[#9BA6B5] pl-10">
            Ask anything about this document. Grounded on extracted values and penalties.
          </p>
        </div>

        <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-white/05 border border-white/05 text-[#9BA6B5] self-start sm:self-auto">
          CONTEXT: {document.document_title || document.documentTitle || 'ACTIVE FILE'}
        </span>
      </div>

      {/* Suggested Questions */}
      <div className="px-6 py-3 border-b border-white/05 bg-[#070A0F]/60 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-mono uppercase text-[#9BA6B5] shrink-0">
          SUGGESTED:
        </span>
        {SUGGESTED_QUESTIONS.map((question, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(question)}
            disabled={sending}
            className="text-xs font-sans text-[#F5F7FA] hover:text-white bg-white/05 hover:bg-white/10 border border-white/08 hover:border-[#5B8CFF]/40 px-3 py-1 rounded-full whitespace-nowrap transition-all disabled:opacity-40"
          >
            {question}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-full font-mono text-xs text-[#9BA6B5]">
            <Sparkles className="w-4 h-4 text-[#5B8CFF] animate-spin mr-2" />
            INITIALIZING DOCUMENT CONTEXT...
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-3 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                      isUser
                        ? 'bg-gradient-to-tr from-[#5B8CFF] to-[#7C5CFF] text-white shadow-glow-blue/20'
                        : 'bg-[#111722] border border-[#5B8CFF]/30 text-[#5B8CFF]'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[80%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#9BA6B5]">
                      <span>{isUser ? 'YOU' : 'DOCUSAATHI INTELLIGENCE'}</span>
                      {!isUser && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#25D9B5] shadow-glow-teal" />
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] text-white shadow-lg'
                          : 'bg-[#111722] border border-white/08 text-[#F5F7FA] shadow-md whitespace-pre-wrap'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* Typing animation with 3 glowing bouncing dots */}
        {sending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-[#111722] border border-[#5B8CFF]/30 text-[#5B8CFF] flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-[#111722] border border-white/08 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5B8CFF] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-[#7C5CFF] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-[#25D9B5] animate-bounce" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="px-6 py-2.5 bg-[#FF5C6C]/10 text-[#FF5C6C] font-mono text-xs border-t border-[#FF5C6C]/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-white/10 bg-[#111722]/80 flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this document..."
          disabled={sending}
          className="flex-1 px-4 py-3 rounded-xl font-sans text-xs sm:text-sm bg-[#070A0F] border border-white/10 text-[#F5F7FA] focus:outline-none focus:border-[#5B8CFF] transition-colors"
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!input.trim() || sending}
          className="bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] text-white px-5 py-3 rounded-xl font-sans text-xs uppercase font-semibold tracking-wider disabled:opacity-40 transition-all flex items-center gap-2 shadow-glow-blue/20"
        >
          <span>SEND</span>
          <Send className="w-3.5 h-3.5" />
        </motion.button>
      </form>

      {/* Disclaimer */}
      <div className="bg-[#070A0F] px-6 py-2 border-t border-white/05 font-mono text-[10px] text-[#9BA6B5] text-center">
        DocuSaathi generates responses directly from document content. Always verify high-stakes tax and legal advice.
      </div>
    </div>
  );
}
