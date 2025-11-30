import { useState } from 'react';
import { Sparkles, CheckCircle, Send } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  apiStatus: 'checking' | 'online' | 'offline';
}

export default function ChatModal({ 
  isOpen, 
  onClose, 
  messages, 
  onSendMessage,
  isLoading,
  apiStatus
}: ChatModalProps) {
  const [inputMessage, setInputMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const message = inputMessage.trim();
    setInputMessage('');
    await onSendMessage(message);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 md:p-8">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl h-[90vh] sm:h-[85vh] md:h-[700px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-400 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-t-2xl sm:rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold truncate">Ask BRAVO AI Coach</h2>
              <p className="text-teal-50 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 mt-1">
                <Sparkles size={14} />
                <span className="hidden xs:inline">Powered by RAG •</span> {apiStatus === 'online' ? '🟢 AI Online' : apiStatus === 'checking' ? '🟡 Connecting...' : '🟠 Fallback Mode'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white text-3xl hover:bg-white/20 w-10 h-10 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto space-y-3 sm:space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 max-w-[85%] sm:max-w-[80%] ${
                msg.type === 'user' 
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-400 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                {msg.type === 'bot' && msg.verified && (
                  <span className="text-xs text-green-600 mt-2 inline-flex items-center gap-1">
                    <CheckCircle size={12} />
                    Verified Source • RAG-Powered
                  </span>
                )}
                {msg.type === 'bot' && !msg.verified && (
                  <span className="text-xs text-orange-500 mt-2 inline-flex items-center gap-1">
                    ⚡ General Response
                  </span>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-xl sm:rounded-2xl rounded-tl-none p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <span className="text-sm text-gray-500 ml-2">BRAVO is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Input */}
        <div className="p-3 sm:p-4 md:p-6 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-2 mb-2 sm:mb-3 hidden sm:block">
            <p className="text-xs text-gray-600 px-2 sm:px-3 py-1 sm:py-2">
              💡 <strong>Try asking:</strong> "What can I eat instead of broccoli?" • "Alternatives for push-ups?"
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              placeholder="Ask about nutrition, exercises..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              disabled={isLoading}
              className="flex-1 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-teal-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-teal-500 to-emerald-400 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:shadow-lg transition-shadow flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{isLoading ? 'Sending...' : 'Ask'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
