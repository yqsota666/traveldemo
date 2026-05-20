import { ArrowLeft, Share, MapPin, ChevronRight, Star, HeadphonesIcon, MessageCircle } from 'lucide-react';

interface ItemDetailProps {
  onBack: () => void;
  itemName: string;
}

export default function ItemDetail({ onBack, itemName }: ItemDetailProps) {
  return (
    <div className="h-screen flex flex-col bg-[#FDFCF8] text-[#1A1A1A]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#7BBF9E]/30 bg-[#FDFCF8]/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-[#F5E6C8]/40 rounded-full text-[#4A8C6F] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-[#4A8C6F]">胜地详览</h1>
        <button className="p-2 hover:bg-[#F5E6C8]/40 rounded-full text-[#4A8C6F] transition-colors">
          <Share className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Hero Image Section */}
        <div className="relative h-64 border-b border-[#7BBF9E]/30 bg-[#F5E6C8]/20 flex items-center justify-center overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1603120527222-33f28c2ce89e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JiaWRkZW4lMjBjaXR5JTIwYmVpamluZ3xlbnwxfHx8fDE3NzkwMzk4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080" 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-90 sepia-[.15]"
          />
          <div className="absolute bottom-4 right-4 bg-[#FDFCF8]/80 backdrop-blur-sm text-[#4A8C6F] text-xs px-3 py-1 rounded-full border border-[#7BBF9E]/40 font-bold">
            1 / 5
          </div>
        </div>

        {/* Title & Info Section */}
        <div className="p-4 border-b border-[#7BBF9E]/30">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">{itemName} (示例：紫禁城)</h2>
          </div>
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className="border border-[#7BBF9E]/50 bg-[#F5E6C8]/30 px-2 py-1 text-xs rounded-sm text-[#4A8C6F]">AAAAA名胜</span>
            <span className="border border-[#7BBF9E]/50 bg-[#F5E6C8]/30 px-2 py-1 text-xs rounded-sm text-[#4A8C6F]">京城必游</span>
            <span className="border border-[#7BBF9E]/50 bg-[#F5E6C8]/30 px-2 py-1 text-xs rounded-sm text-[#4A8C6F]">文化瑰宝</span>
          </div>
          <div className="flex items-center gap-3 text-sm mb-4">
            <span className="font-bold text-lg text-[#C8963E]">4.8 分</span>
            <span className="text-[#4A8C6F]/80 underline decoration-[#4A8C6F]/30 underline-offset-4 cursor-pointer hover:text-[#4A8C6F]">36万+条评价</span>
          </div>
          <p className="text-sm text-[#1A1A1A]/80 leading-relaxed text-justify">
            紫禁城，明清两代之皇家宫阙。飞檐斗拱，红墙黄瓦，历经岁月洗礼，依旧雄伟庄严。乃世上现存规模最宏大之木构古建群。
          </p>
        </div>

        {/* Location Section */}
        <button className="w-full flex items-center justify-between p-4 border-b border-[#7BBF9E]/30 hover:bg-[#F5E6C8]/20 text-left transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F5E6C8]/40 rounded-full text-[#4A8C6F]">
               <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#1A1A1A]">京师东城区景山前街四号</div>
              <div className="text-xs text-[#4A8C6F]/70 mt-1">近皇城根 | 轨道交通直达</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#4A8C6F]/50" />
        </button>

        {/* Reviews Section */}
        <div className="p-4 border-b border-[#7BBF9E]/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1A1A1A]">访客留印</h3>
            <button className="flex items-center text-sm text-[#4A8C6F] hover:underline decoration-[#7BBF9E]/50 underline-offset-4">
              观全卷 <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
            <span className="border border-[#7BBF9E]/40 bg-[#FDFCF8] text-[#4A8C6F] rounded-full px-3 py-1 text-sm whitespace-nowrap shadow-sm">景色绝佳 (1.2w)</span>
            <span className="border border-[#7BBF9E]/40 bg-[#FDFCF8] text-[#4A8C6F] rounded-full px-3 py-1 text-sm whitespace-nowrap shadow-sm">底蕴深厚 (8k)</span>
            <span className="border border-[#7BBF9E]/40 bg-[#FDFCF8] text-[#4A8C6F] rounded-full px-3 py-1 text-sm whitespace-nowrap shadow-sm">留影胜地 (5k)</span>
          </div>

          <div className="border border-[#7BBF9E]/30 p-4 bg-[#FDFCF8] rounded-sm shadow-[2px_2px_8px_rgba(74,140,111,0.05)] relative overflow-hidden">
             {/* decorative water mark */}
             <div className="absolute right-2 top-2 opacity-10 pointer-events-none">
                <svg width="40" height="40" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="#4A8C6F" strokeWidth="4" fill="none"/></svg>
             </div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <div className="w-10 h-10 rounded-full border-2 border-[#F5E6C8] bg-white flex items-center justify-center overflow-hidden shadow-sm">
                 <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar" className="w-full h-full object-cover sepia-[.2]" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#1A1A1A]">李***明</div>
                <div className="flex text-[#C8963E] mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
              <span className="ml-auto text-xs text-[#4A8C6F]/60">甲辰年十月朔日</span>
            </div>
            <p className="text-sm leading-relaxed text-[#1A1A1A]/90 relative z-10 text-justify">
              古建宏伟，气象万千！确为世间文化瑰宝。极力建言提前预约，并租赁讲解之器，方能细细品味历史长河之沉淀。
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FDFCF8] border-t border-[#7BBF9E]/30 max-w-[560px] mx-auto z-30 shadow-[0_-4px_16px_rgba(74,140,111,0.08)]">
        <div className="flex h-16">
          <div className="flex flex-1 items-center justify-around border-r border-[#7BBF9E]/30">
            <button className="flex flex-col items-center justify-center flex-1 h-full hover:bg-[#F5E6C8]/30 text-[#4A8C6F] transition-colors group">
              <Star className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">收藏</span>
            </button>
            <div className="w-px h-8 bg-[#7BBF9E]/30"></div>
            <button className="flex flex-col items-center justify-center flex-1 h-full hover:bg-[#F5E6C8]/30 text-[#4A8C6F] transition-colors group">
              <MessageCircle className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">传书</span>
            </button>
          </div>
          <button className="flex-[1.5] bg-[#4A8C6F] text-white font-bold text-lg hover:bg-[#3b7359] transition-colors flex items-center justify-center gap-2">
            <span>立即缔约</span>
            <ChevronRight className="w-5 h-5 opacity-80" />
          </button>
        </div>
      </div>
    </div>
  );
}