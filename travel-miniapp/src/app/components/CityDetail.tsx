import { useEffect, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import ItemDetail from './ItemDetail';
import { contentApi } from '../../api/content/travelContentClient';

interface CityDetailProps {
  cityName: string;
  onBack: () => void;
}

const categories = ['名胜古迹', '雅集茶会', '特色车马', '游园向导', '居所推荐', '传统妆造'];

function categoryResource(category: string): 'scenics' | 'hotels' | 'car-rentals' | 'guides' {
  if (category === '居所推荐') return 'hotels';
  if (category === '特色车马') return 'car-rentals';
  if (category === '游园向导') return 'guides';
  return 'scenics';
}

export default function CityDetail({ cityName, onBack }: CityDetailProps) {
  const [activeCategory, setActiveCategory] = useState('名胜古迹');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityId, setCityId] = useState<number | null>(null);
  const [items, setItems] = useState<{ id: number; title: string }[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  useEffect(() => {
    contentApi.cityByName(cityName).then((c) => setCityId(Number(c.id))).catch(() => {});
  }, [cityName]);

  useEffect(() => {
    if (!cityId) return;
    const load = async () => {
      const resource = categoryResource(activeCategory);
      const params = { cityId, keyword: searchQuery || undefined, pageSize: 30 };
      let records: Record<string, unknown>[] = [];
      if (resource === 'scenics') records = (await contentApi.scenics(params)).records;
      else if (resource === 'hotels') records = (await contentApi.hotels(params)).records;
      else if (resource === 'car-rentals') records = (await contentApi.carRentals(params)).records;
      else records = (await contentApi.guides(params)).records;
      setItems(records.map((r) => ({
        id: Number(r.id),
        title: String(r.title || r.name || '内容'),
      })));
    };
    load().catch(() => setItems([]));
  }, [cityId, activeCategory, searchQuery]);

  if (selectedItem !== null) {
    const item = items.find((i) => i.id === selectedItem);
    return <ItemDetail itemName={item?.title || `内容 ${selectedItem}`} onBack={() => setSelectedItem(null)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#FDFCF8] text-[#1A1A1A]">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#7BBF9E]/30 bg-[#FDFCF8] shadow-sm z-10">
        <button onClick={onBack} className="p-2 hover:bg-[#F5E6C8]/40 rounded-full text-[#4A8C6F] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-[#4A8C6F]">{cityName}</h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-28 border-r border-[#7BBF9E]/30 overflow-y-auto bg-[#F5E6C8]/10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`w-full py-6 px-2 text-center border-b border-[#7BBF9E]/20 transition-colors text-sm font-medium ${
                activeCategory === category
                  ? 'bg-[#4A8C6F] text-white shadow-md'
                  : 'text-[#4A8C6F] hover:bg-[#F5E6C8]/40'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#7BBF9E]/30 bg-[#FDFCF8]">
            <div className="relative">
              <input
                type="text"
                placeholder="寻觅佳处"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-[#7BBF9E]/40 rounded-sm bg-[#F5E6C8]/20 focus:outline-none focus:ring-1 focus:ring-[#4A8C6F] focus:bg-[#FDFCF8] transition-colors placeholder-[#4A8C6F]/60"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A8C6F]" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className="aspect-[4/5] bg-gradient-to-br from-[#7BBF9E]/20 to-[#F5E6C8]/40 rounded-sm border border-[#7BBF9E]/30 flex items-end p-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <span className="text-sm font-medium text-[#4A8C6F] bg-[#FDFCF8]/80 px-2 py-1 rounded-sm">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
