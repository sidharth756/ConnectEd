import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  UserPlus, 
  Target
} from 'lucide-react';
import { aiAssistantApi } from '../services/api';

export default function AINetworkingAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Hello Alex! I am your ConnectEd Career Copilot. I can draft outreach notes to alumni, analyze your skill gaps, or recommend relevant mentors for your target goal at Google DeepMind. How can I assist you today?',
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'Draft Outreach to Google DeepMind Alum', icon: UserPlus, query: 'Draft a referral request to Dr. Sarah Chen at Google DeepMind' },
    { label: 'Analyze Top Skill Gap for AI Role', icon: Target, query: 'What is my top skill gap for Senior AI Engineer?' },
    { label: 'Recommend Top 3 Alumni Mentors', icon: Sparkles, query: 'Who are my top 3 alumni mentor matches?' },
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const botResponse = await aiAssistantApi.sendMessage(query);
      setMessages(prev => [...prev, botResponse]);
    } catch (e) {
      setMessages(prev => [...prev, {
        id: 'err_' + Date.now(),
        sender: 'assistant',
        text: 'Sorry, I ran into an error connecting to the AI service. Please try again.',
        timestamp: 'Now'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between transition-all duration-300">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900 flex items-center">
              ConnectEd Career Copilot
            </h3>
            <p className="text-[11px] text-slate-500">Mentorship & Outreach Guidance Assistant</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Prompt Chips */}
      <div className="px-4 py-2 bg-slate-50/60 border-b border-slate-200 overflow-x-auto flex space-x-2 scrollbar-none">
        {quickPrompts.map((qp, idx) => {
          const Icon = qp.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(qp.query)}
              className="flex-none flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] shadow-sm transition"
            >
              <Icon className="w-3 h-3 text-brand-600" />
              <span>{qp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-1 text-[10px] text-slate-400 mb-1 px-1">
              <span>{msg.sender === 'user' ? 'You' : 'ConnectEd Copilot'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>
            <div className={`relative max-w-[90%] p-3 rounded-xl text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-brand-600 text-white rounded-br-none shadow-sm'
                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              {msg.sender === 'assistant' && (
                <button 
                  onClick={() => handleCopy(msg.id, msg.text)}
                  className="mt-2 pt-2 border-t border-slate-200 w-full flex items-center justify-end text-[11px] text-brand-600 hover:text-brand-700 font-medium transition"
                >
                  {copiedId === msg.id ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-emerald-600" />
                      <span className="text-emerald-700">Copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      <span>Copy outreach draft</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 w-fit shadow-sm">
            <Bot className="w-4 h-4 text-brand-600 animate-spin" />
            <span>Formulating career insight...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3.5 border-t border-slate-200 bg-white">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center space-x-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI for outreach notes or skill gap advice..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus-ring"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50 transition shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
