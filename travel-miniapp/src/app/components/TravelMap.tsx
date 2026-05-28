import { ArrowLeft, MapPin, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import Taro from '@tarojs/taro';

interface TravelMapProps {
  onBack: () => void;
}

export default function TravelMap({ onBack }: TravelMapProps) {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  
  const handleUploadScene = () => {
    Taro.chooseImage({ count: 1, sizeType: ['compressed'], sourceType: ['album', 'camera'] })
      .then(() => {
        Taro.showToast({ title: `${selectedProvince} 足迹已记录`, icon: 'success' });
        setSelectedProvince(null);
      })
      .catch(() => {
        Taro.showToast({ title: '已取消上传', icon: 'none' });
      });
  };

  return (
    <div className="h-full flex flex-col bg-[#FDFCF8] overflow-hidden pb-20 relative z-50 absolute inset-0 text-[#1A1A1A]">
      {/* Header */}
      <div className="flex items-center px-4 pt-16 py-3 border-b border-[#7BBF9E]/30 bg-[#FDFCF8]/90 backdrop-blur-md z-20 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-[#F5E6C8]/40 rounded-full text-[#4A8C6F] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-extrabold text-[#4A8C6F] ml-2">游览足迹</span>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-[#E8F2ED]/30 overflow-hidden flex items-center justify-center">
        {/* Placeholder for actual China SVG Map */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
          <p className="text-[#4A8C6F] font-bold text-lg mb-2 opacity-50">家庭旅行足迹</p>
          <p className="text-xs text-[#4A8C6F]/60 opacity-50">点击城市气泡，上传照片后点亮记忆</p>
        </div>

        {/* Abstract representation of a map with clickable regions */}
        <svg className="w-full h-full max-h-[80%]" viewBox="0 0 400 400" style={{ zIndex: 5 }}>
          <defs>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#7BBF9E" floodOpacity="0.15" />
            </filter>
          </defs>
          
          {/* Base map abstract blob */}
          <path
            d="M 100 150 Q 150 50 250 100 T 350 200 Q 380 300 280 320 T 150 350 Q 50 300 80 200 Z"
            fill="#FDFCF8"
            stroke="#7BBF9E"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            filter="url(#shadow)"
          />
          
          {/* Beijing Area (lit up) */}
          <g onClick={() => setSelectedProvince('北京')} className="cursor-pointer group">
            <circle cx="220" cy="140" r="16" fill="#4A8C6F" className="transition-all duration-300 group-hover:scale-110 group-hover:fill-[#3a755b]" />
            <text x="220" y="144" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">北京</text>
          </g>

          {/* Shaanxi Area (lit up) */}
          <g onClick={() => setSelectedProvince('陕西')} className="cursor-pointer group">
            <circle cx="180" cy="200" r="18" fill="#C8963E" className="transition-all duration-300 group-hover:scale-110 group-hover:fill-[#b08234]" />
            <text x="180" y="204" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">陕西</text>
          </g>

          {/* Shanghai Area (not lit up) */}
          <g onClick={() => setSelectedProvince('上海')} className="cursor-pointer group">
            <circle cx="280" cy="240" r="14" fill="#E8F2ED" stroke="#7BBF9E" strokeWidth="2" className="transition-all duration-300 group-hover:scale-110" />
            <text x="280" y="244" fontSize="9" fill="#4A8C6F" fontWeight="bold" textAnchor="middle">上海</text>
          </g>

          {/* Sichuan Area (not lit up) */}
          <g onClick={() => setSelectedProvince('四川')} className="cursor-pointer group">
            <circle cx="140" cy="250" r="18" fill="#E8F2ED" stroke="#7BBF9E" strokeWidth="2" className="transition-all duration-300 group-hover:scale-110" />
            <text x="140" y="254" fontSize="10" fill="#4A8C6F" fontWeight="bold" textAnchor="middle">四川</text>
          </g>
        </svg>

        {/* Upload Modal (Bottom Sheet) */}
        {selectedProvince && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="w-full bg-[#FDFCF8] rounded-t-3xl p-6 pb-safe shadow-[0_-8px_32px_rgba(0,0,0,0.1)] transform transition-transform">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-xl text-[#1A1A1A] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#4A8C6F]" />
                  {selectedProvince}
                </h3>
                <button onClick={() => setSelectedProvince(null)} className="text-[#1A1A1A]/40 font-bold hover:text-[#1A1A1A]">
                  取消
                </button>
              </div>
              
              <p className="text-sm text-[#1A1A1A]/70 mb-6">
                上传您在 {selectedProvince} 的游览照片，点亮属于您的专属足迹！
              </p>
              
              <button 
                onClick={handleUploadScene}
                className="w-full border-2 border-dashed border-[#7BBF9E]/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-[#4A8C6F] hover:bg-[#7BBF9E]/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#7BBF9E]/20 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="font-bold">点击上传打卡照片</span>
                <span className="text-xs opacity-60">支持常见图片格式</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
