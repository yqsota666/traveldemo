import { ArrowLeft, Star, MapPin } from 'lucide-react';
import { useState } from 'react';

interface HotelListProps {
  onBack: () => void;
}

export default function HotelList({ onBack }: HotelListProps) {
  const [activeTab, setActiveTab] = useState<'北京' | '西安'>('北京');

  // TODO: [Backend Interface] Fetch cooperative hotels based on activeTab (City)
  const hotels = {
    '北京': [
      { id: 1, name: '故宫观景隐居客栈', price: '¥899', rating: 4.9, tags: ['近故宫', '四合院', '文化体验'], img: 'https://images.unsplash.com/photo-1542314831-c6a4d14eff40?w=500&auto=format&fit=crop' },
      { id: 2, name: '南锣鼓巷静谧四合院', price: '¥650', rating: 4.8, tags: ['老北京风情', '交通便利'], img: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=500&auto=format&fit=crop' }
    ],
    '西安': [
      { id: 3, name: '大唐芙蓉园禅意舍', price: '¥580', rating: 4.8, tags: ['近大雁塔', '汉唐风韵'], img: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=500&auto=format&fit=crop' },
      { id: 4, name: '钟鼓楼精品客栈', price: '¥420', rating: 4.7, tags: ['市中心', '美食街旁'], img: 'https://images.unsplash.com/photo-1614765437824-f5433016b7b6?w=500&auto=format&fit=crop' }
    ]
  };

  const currentHotels = hotels[activeTab];

  return (
    <div className="h-screen flex flex-col bg-[#FDFCF8] text-[#1A1A1A] absolute inset-0 z-40 overflow-hidden font-sans">
      <div className="flex items-center px-4 pt-16 py-3 border-b border-[#7BBF9E]/20 bg-[#FDFCF8]/90 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-[#F5E6C8]/40 rounded-full text-[#4A8C6F] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold text-[#4A8C6F] ml-2">精选合作客栈</h1>
      </div>

      <div className="flex border-b border-[#7BBF9E]/10 bg-white/50 backdrop-blur-sm z-10 shrink-0">
        {['北京', '西安'].map((city) => (
          <button
            key={city}
            onClick={() => setActiveTab(city as '北京' | '西安')}
            className={`flex-1 py-3 text-sm font-bold relative transition-colors ${
              activeTab === city ? 'text-[#4A8C6F]' : 'text-[#1A1A1A]/50'
            }`}
          >
            {city}
            {activeTab === city && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#4A8C6F] rounded-t-full shadow-[0_0_8px_rgba(74,140,111,0.5)]"></div>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-5 relative z-0 scrollbar-hide">
        {/* Watercolor Blooms */}
        <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden mix-blend-multiply opacity-40">
          <div className="absolute top-[10%] left-[-20%] w-[80%] h-[40%] rounded-full bg-[#7BBF9E]/20 blur-[90px]"></div>
          <div className="absolute bottom-[20%] right-[-20%] w-[80%] h-[50%] rounded-full bg-[#C8963E]/20 blur-[100px]"></div>
        </div>

        {currentHotels.map(hotel => (
          <div key={hotel.id} className="bg-white/80 rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(74,140,111,0.06)] border border-white group cursor-pointer hover:shadow-[0_8px_24px_rgba(74,140,111,0.15)] transition-all">
            <div className="relative h-40 overflow-hidden">
              <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover sepia-[.15] group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-4 flex items-center gap-1 text-[#F5E6C8] font-bold text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span>{hotel.rating}</span>
              </div>
              <div className="absolute bottom-3 right-4 font-black text-xl text-white drop-shadow-md">
                {hotel.price}<span className="text-xs font-medium opacity-80 ml-0.5">/晚起</span>
              </div>
            </div>
            <div className="p-4 relative">
              <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-bl from-[#7BBF9E]/10 to-transparent rounded-bl-full pointer-events-none"></div>
              <h3 className="font-extrabold text-lg text-[#1A1A1A] mb-2">{hotel.name}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {hotel.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold text-[#4A8C6F] bg-[#7BBF9E]/15 px-2 py-0.5 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-[#1A1A1A]/60 text-xs gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{activeTab}市区</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}