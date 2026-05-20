import { useState } from 'react';
import { HeartHandshake, MapPin, CalendarHeart, Tent } from 'lucide-react';

interface WishlistFormProps {
  onComplete: () => void;
}

export default function WishlistForm({ onComplete }: WishlistFormProps) {
  const [residence, setResidence] = useState('');
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const seasons = ['春季踏青', '夏季避暑', '秋季赏叶', '冬季玩雪'];
  const interests = ['名胜古迹', '自然风光', '主题乐园', '特色美食', '非遗体验', '博物馆游'];

  const toggleSelection = (item: string, list: string[], setList: (arr: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const isFormValid = residence.trim() !== '' && selectedSeasons.length > 0 && selectedInterests.length > 0;

  return (
    <div className="h-screen flex flex-col bg-[#FDFCF8] text-[#1A1A1A] absolute inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden mix-blend-multiply opacity-50">
        <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[50%] rounded-full bg-[#4A8C6F]/10 blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[-20%] w-[90%] h-[50%] rounded-full bg-[#C8963E]/15 blur-[120px]"></div>
      </div>

      <div className="pt-16 px-6 pb-6 text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#7BBF9E]/20 to-[#C8963E]/20 rounded-full flex items-center justify-center mb-4 shadow-[0_4px_16px_rgba(74,140,111,0.1)]">
          <HeartHandshake className="w-8 h-8 text-[#4A8C6F]" />
        </div>
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] mb-2 tracking-wide">
          出游心愿单
        </h1>
        <p className="text-sm text-[#1A1A1A]/60">初次见面，请填写您的偏好，我们将为您量身定制专属行程</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-8 scrollbar-hide">
        {/* Residence */}
        <div>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#C8963E]" /> 您的常住地
          </h2>
          <input
            type="text"
            value={residence}
            onChange={(e) => setResidence(e.target.value)}
            placeholder="例如：北京 / 上海 / 广州"
            className="w-full px-4 py-3.5 bg-white border border-[#7BBF9E]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A8C6F]/50 text-sm shadow-[0_2px_8px_rgba(74,140,111,0.05)]"
          />
        </div>

        {/* Seasons */}
        <div>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <CalendarHeart className="w-5 h-5 text-[#e88796]" /> 出行偏好 (多选)
          </h2>
          <div className="flex flex-wrap gap-3">
            {seasons.map(season => (
              <button
                key={season}
                onClick={() => toggleSelection(season, selectedSeasons, setSelectedSeasons)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  selectedSeasons.includes(season)
                    ? 'bg-[#4A8C6F] text-white border-[#4A8C6F] shadow-[0_4px_12px_rgba(74,140,111,0.3)]'
                    : 'bg-white text-[#1A1A1A]/70 border-[#7BBF9E]/20 hover:border-[#4A8C6F]/50'
                }`}
              >
                {season}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Tent className="w-5 h-5 text-[#7BBF9E]" /> 游玩兴趣 (多选)
          </h2>
          <div className="flex flex-wrap gap-3">
            {interests.map(interest => (
              <button
                key={interest}
                onClick={() => toggleSelection(interest, selectedInterests, setSelectedInterests)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  selectedInterests.includes(interest)
                    ? 'bg-[#C8963E] text-white border-[#C8963E] shadow-[0_4px_12px_rgba(200,150,62,0.3)]'
                    : 'bg-white text-[#1A1A1A]/70 border-[#C8963E]/20 hover:border-[#C8963E]/50'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 pb-safe bg-white border-t border-[#7BBF9E]/10 shadow-[0_-4px_20px_rgba(74,140,111,0.05)]">
        <button 
          onClick={onComplete}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            isFormValid 
              ? 'bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] text-white shadow-[0_8px_24px_rgba(74,140,111,0.3)] active:scale-95' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          开启奇妙旅程
        </button>
      </div>
    </div>
  );
}