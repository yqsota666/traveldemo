import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import ItemDetail from './ItemDetail';

interface CityDetailProps {
  cityName: string;
  onBack: () => void;
}

export default function CityDetail({ cityName, onBack }: CityDetailProps) {
  const [activeCategory, setActiveCategory] = useState('经典景点');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const categories = ['名胜古迹', '雅集茶会', '特色车马', '游园向导', '居所推荐', '传统妆造'];

  if (selectedItem !== null) {
    return <ItemDetail itemName={`内容 ${selectedItem}`} onBack={() => setSelectedItem(null)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#FDFCF8] text-[#1A1A1A]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#7BBF9E]/30 bg-[#FDFCF8] shadow-sm z-10">
        <button onClick={onBack} className="p-2 hover:bg-[#F5E6C8]/40 rounded-full text-[#4A8C6F] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-[#4A8C6F]">{cityName}</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
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

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="p-4 border-b border-[#7BBF9E]/30 bg-[#FDFCF8]">
            <div className="relative">
              <input
                type="text"
                placeholder="寻觅佳处"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-[#7BBF9E]/40 rounded-sm bg-[#F5E6C8]/20 focus:outline-none focus:ring-1 focus:ring-[#4A8C6F] focus:bg-[#FDFCF8] transition-colors placeholder-[#4A8C6F]/60"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A8C6F]/70" />
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#FDFCF8]">
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  onClick={() => setSelectedItem(item)}
                  className="relative h-48 border border-[#7BBF9E]/30 rounded-sm bg-[#F5E6C8]/20 flex items-center justify-center hover:shadow-[4px_4px_16px_rgba(74,140,111,0.15)] transition-shadow cursor-pointer overflow-hidden group"
                >
                  {/* Diagonal decoration */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="#7BBF9E" strokeWidth="1" />
                    <line x1="0" y1="100%" x2="100%" y2="0" stroke="#7BBF9E" strokeWidth="1" />
                  </svg>
                  <span className="text-[#4A8C6F] font-bold z-10 group-hover:scale-110 transition-transform">雅集 {item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}