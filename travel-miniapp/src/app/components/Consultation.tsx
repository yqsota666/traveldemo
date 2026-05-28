import { useEffect, useState } from 'react';
import { contentApi } from '../../api/content/travelContentClient';
import { ArrowLeft, Send, User, MessageCircle, X } from 'lucide-react';

interface ConsultationProps {
  onClose: () => void;
}

export default function Consultation({ onClose }: ConsultationProps) {
  const [submitted, setSubmitted] = useState(false);
  const [demand, setDemand] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, type: 'system', text: '您好，您的专属旅行管家正在为您服务！请问有什么可以帮您？' }
  ]);
  const [inputText, setInputText] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  useEffect(() => {
    contentApi.consultation().then((c) => {
      if (c.contactPhone) setContactPhone(String(c.contactPhone));
    }).catch(() => {});
  }, []);

  const handleSubmitDemand = () => {
    if (!demand.trim()) return;
    setMessages([
      { id: 1, type: 'system', text: '您好，您的专属旅行管家正在为您服务！请问有什么可以帮您？' },
      { id: 2, type: 'user', text: `我的诉求：${demand}` },
      { id: 3, type: 'system', text: '收到您的诉求！我们已为您匹配了最专业的向导，稍后将为您提供详细解答。' }
    ]);
    setSubmitted(true);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now(), type: 'user', text: inputText }]);
    setInputText('');
    
    // Simulate auto-reply
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'system', text: '客服代表已收到您的消息，正在为您查询相关资料，请稍候...' }]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4 transition-opacity">
      <div className="w-full max-w-[560px] h-[85vh] sm:h-[600px] bg-[#FDFCF8] rounded-t-3xl sm:rounded-3xl shadow-[0_-8px_32px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden transform transition-transform">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#7BBF9E]/20 bg-[#FDFCF8]/95 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#7BBF9E]/20 rounded-lg text-[#4A8C6F]">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-[#1A1A1A]">在线咨询</h2>
              {contactPhone && <p className="text-xs text-[#4A8C6F] mt-0.5">联系电话：{contactPhone}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#F5E6C8]/40 rounded-full text-[#1A1A1A]/40 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted ? (
          // Demand Form
          <div className="flex-1 overflow-y-auto p-5 relative z-10 flex flex-col">
            <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden mix-blend-multiply opacity-50">
              <div className="absolute top-[-5%] left-[-20%] w-[80%] h-[40%] rounded-full bg-[#7BBF9E]/10 blur-[80px]"></div>
            </div>
            
            <div className="bg-white/80 rounded-2xl p-5 border border-white shadow-[0_4px_16px_rgba(74,140,111,0.05)]">
              <h3 className="font-bold text-[#1A1A1A] mb-2">填写咨询诉求</h3>
              <p className="text-xs text-[#1A1A1A]/60 mb-4">简单描述您的需求，我们将为您匹配专属管家</p>
              
              <textarea
                value={demand}
                onChange={(e) => setDemand(e.target.value)}
                placeholder="例如：我们一家四口（包含两名6岁儿童），想在暑假去北京游玩5天..."
                className="w-full h-32 p-3 bg-[#F5E6C8]/20 border border-[#7BBF9E]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A8C6F]/50 resize-none text-sm leading-relaxed text-[#1A1A1A] placeholder-[#1A1A1A]/40 mb-5 transition-all"
              />
              
              <button 
                onClick={handleSubmitDemand}
                className="w-full py-3 bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(74,140,111,0.3)] hover:shadow-[0_6px_16px_rgba(74,140,111,0.4)] transition-all active:scale-[0.98]"
              >
                提交并联系专属管家
              </button>
            </div>
          </div>
        ) : (
          // Chat UI
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5E6C8]/10">
              <div className="text-center">
                <span className="text-xs bg-black/5 text-[#1A1A1A]/40 px-3 py-1 rounded-full">今天 10:24</span>
              </div>
              
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} gap-2.5`}>
                  {msg.type === 'system' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A8C6F] to-[#7BBF9E] flex items-center justify-center text-white shrink-0 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] p-3 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-sm leading-relaxed ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-br from-[#4A8C6F] to-[#7BBF9E] text-white rounded-tr-sm' 
                      : 'bg-white border border-[#7BBF9E]/10 text-[#1A1A1A] rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-white border-t border-[#7BBF9E]/10 pb-safe">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="发送消息..."
                  className="flex-1 px-4 py-2.5 bg-[#FDFCF8] border border-[#7BBF9E]/30 rounded-full focus:outline-none focus:border-[#4A8C6F] text-sm"
                />
                <button 
                  onClick={handleSendMessage}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] flex items-center justify-center text-white shadow-sm shrink-0 active:scale-95 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}