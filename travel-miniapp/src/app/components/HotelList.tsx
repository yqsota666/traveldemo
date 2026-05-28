import { ArrowLeft, Star, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { contentApi, resolveMediaUrl } from '../../api/content/travelContentClient';

interface HotelListProps {
  onBack: () => void;
}

type HotelItem = { id: number; name: string; price: string; rating: number; tags: string[]; img: string };

export default function HotelList({ onBack }: HotelListProps) {
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [activeCityId, setActiveCityId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('');
  const [hotels, setHotels] = useState<HotelItem[]>([]);

  useEffect(() => {
    contentApi.cities().then((res) => {
      const list = res.records.map((c) => ({ id: Number(c.id), name: String(c.name) }));
      if (list.length) {
        setCities(list);
        setActiveCityId(list[0].id);
        setActiveTab(list[0].name);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeCityId) return;
    contentApi.hotels({ cityId: activeCityId, pageSize: 20 }).then((res) => {
      setHotels(res.records.map((h) => ({
        id: Number(h.id),
        name: String(h.title || '客栈'),
        price: String(h.priceLabel || '¥0'),
        rating: 4.8,
        tags: String(h.tags || '').split(',').filter(Boolean),
        img: resolveMediaUrl(String(h.coverImage || '')),
      })));
    }).catch(() => setHotels([]));
  }, [activeCityId]);

  return (
    <div className="h-screen flex flex-col bg-[#FDFCF8] text-[#1A1A1A] absolute inset-0 z-40 overflow-hidden font-sans">
      <div className="flex items-center px-4 pt-16 py-3 border-b border-[#7BBF9E]/20 bg-[#FDFCF8]/90 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-[#F5E6C8]/40 rounded-full text-[#4A8C6F] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold text-[#4A8C6F] ml-2">精选合作客栈</h1>
      </div>

      <div className="flex border-b border-[#7BBF9E]/10 bg-white/50 backdrop-blur-sm z-10 shrink-0">
        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => { setActiveCityId(city.id); setActiveTab(city.name); }}
            className={`flex-1 py-3 text-sm font-bold relative transition-colors ${
              activeCityId === city.id ? 'text-[#4A8C6F]' : 'text-[#1A1A1A]/50'
            }`}
          >
            {activeTab === city.name && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#4A8C6F] rounded-full"></div>
            )}
            {city.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white/80 rounded-2xl overflow-hidden border border-white shadow-sm flex gap-4 p-3">
            <img src={hotel.img || 'https://images.unsplash.com/photo-1614765437824-f5433016b7b6?w=500'} alt={hotel.name} className="w-28 h-28 rounded-xl object-cover shrink-0" />
            <div className="flex flex-col justify-center flex-1">
              <h3 className="font-bold text-base mb-1">{hotel.name}</h3>
              <div className="flex items-center gap-1 text-[#C8963E] text-sm font-bold mb-2">
                <Star className="w-3.5 h-3.5 fill-current" /> {hotel.rating}
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {hotel.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 bg-[#7BBF9E]/10 text-[#4A8C6F] rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#4A8C6F] font-extrabold">{hotel.price}</span>
                <MapPin className="w-4 h-4 text-[#4A8C6F]/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
