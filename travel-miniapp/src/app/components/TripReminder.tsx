import { useState } from 'react';
import { ArrowLeft, CloudSun, Shirt, AlertCircle, Map as MapIcon, BookOpen, MapPin, Utensils, ClipboardList, Clock } from 'lucide-react';

interface TripReminderProps {
  onBack: () => void;
}

export default function TripReminder({ onBack }: TripReminderProps) {
  return (
    <div className="h-screen flex flex-col bg-[#FDFCF8] text-[#1A1A1A] absolute inset-0 z-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-[#7BBF9E]/30 bg-[#FDFCF8]/90 backdrop-blur-md sticky top-0 z-20 shadow-sm shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-[#F5E6C8]/40 rounded-full text-[#4A8C6F] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold text-[#4A8C6F] ml-2">行程贴士与安排</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 p-5 space-y-5 relative z-10 scrollbar-hide">
        {/* Global Watercolor Background Blooms */}
        <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden mix-blend-multiply opacity-50">
          <div className="absolute top-[-5%] left-[-20%] w-[80%] h-[40%] rounded-full bg-[#7BBF9E]/20 blur-[100px]"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[90%] h-[50%] rounded-full bg-[#F5E6C8]/30 blur-[90px]"></div>
        </div>

        {/* Weather Card */}
        <div className="bg-gradient-to-br from-[#7BBF9E]/20 to-[#F5E6C8]/30 rounded-2xl p-5 border border-white shadow-sm relative overflow-hidden">
           <div className="absolute -right-4 -top-4 text-[#4A8C6F] opacity-10">
              <CloudSun className="w-32 h-32" />
           </div>
           <div className="flex items-center gap-3 mb-2 relative z-10">
             <div className="p-1.5 bg-white/50 rounded-lg backdrop-blur-sm">
                <CloudSun className="w-5 h-5 text-[#4A8C6F]" />
             </div>
             <h2 className="font-extrabold text-lg text-[#1A1A1A]">实时天气 (北京)</h2>
           </div>
           <div className="relative z-10 mt-3">
             <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] mb-2 drop-shadow-sm">25°C <span className="text-2xl ml-1 text-[#4A8C6F]/80">晴</span></div>
             <p className="text-sm font-medium text-[#1A1A1A]/70">微风 2级 | 湿度 45% | 紫外线强</p>
           </div>
        </div>

        {/* Packing List (出行清单) */}
        <div className="bg-white/80 rounded-2xl p-5 border border-[#7BBF9E]/10 shadow-[0_4px_16px_rgba(74,140,111,0.04)]">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-1.5 bg-[#F7C7CF]/30 rounded-lg text-[#e88796]">
               <ClipboardList className="w-5 h-5" />
             </div>
             <h2 className="font-bold text-lg text-[#1A1A1A]">出行清单</h2>
           </div>
           
           <div className="space-y-4">
             <div>
                <h3 className="text-sm font-bold text-[#4A8C6F] mb-2 flex items-center gap-1.5"><span className="w-1 h-3 bg-[#4A8C6F] rounded-full"></span>证件类</h3>
                <ul className="text-sm leading-relaxed text-[#1A1A1A]/80 space-y-1 pl-2.5 border-l-2 border-[#7BBF9E]/20 ml-0.5">
                  <li>居民身份证（大人及儿童）、学生证（如有优惠）</li>
                </ul>
             </div>
             <div>
                <h3 className="text-sm font-bold text-[#C8963E] mb-2 flex items-center gap-1.5"><span className="w-1 h-3 bg-[#C8963E] rounded-full"></span>衣物类</h3>
                <ul className="text-sm leading-relaxed text-[#1A1A1A]/80 space-y-1 pl-2.5 border-l-2 border-[#C8963E]/20 ml-0.5 text-justify">
                  <li>棉麻短袖、薄长裙，早晚温差备薄外衣。</li>
                  <li>舒适的平底鞋或运动鞋（日均步数可能过万）。</li>
                </ul>
             </div>
             <div>
                <h3 className="text-sm font-bold text-[#e88796] mb-2 flex items-center gap-1.5"><span className="w-1 h-3 bg-[#e88796] rounded-full"></span>药品类</h3>
                <ul className="text-sm leading-relaxed text-[#1A1A1A]/80 space-y-1 pl-2.5 border-l-2 border-[#e88796]/20 ml-0.5">
                  <li>创可贴、肠胃药、防蚊虫叮咬喷雾、儿童常用感冒药。</li>
                </ul>
             </div>
             <div>
                <h3 className="text-sm font-bold text-[#4A8C6F] mb-2 flex items-center gap-1.5"><span className="w-1 h-3 bg-[#4A8C6F] rounded-full"></span>孩子专属物品</h3>
                <ul className="text-sm leading-relaxed text-[#1A1A1A]/80 space-y-1 pl-2.5 border-l-2 border-[#7BBF9E]/20 ml-0.5 text-justify">
                  <li>儿童水壶、安抚玩具、汗巾、轻便推车或腰凳（视孩子年龄）。</li>
                </ul>
             </div>
           </div>
        </div>

        {/* Itinerary Card */}
        <div className="bg-white/80 rounded-2xl p-5 border border-[#7BBF9E]/10 shadow-[0_4px_16px_rgba(74,140,111,0.04)] relative">
           <div className="absolute left-[33px] top-[72px] bottom-[32px] w-0.5 bg-gradient-to-b from-[#4A8C6F]/30 via-[#C8963E]/30 to-transparent"></div>
           
           <div className="flex items-center gap-3 mb-5">
             <div className="p-1.5 bg-[#7BBF9E]/20 rounded-lg text-[#4A8C6F]">
               <MapIcon className="w-5 h-5" />
             </div>
             <h2 className="font-bold text-lg text-[#1A1A1A]">今日行程</h2>
           </div>
           
           <div className="space-y-5">
             <div className="flex gap-4 relative z-10">
                <div className="w-10 text-xs font-bold text-[#4A8C6F] pt-1">09:00</div>
                <div className="flex-1 bg-gradient-to-br from-[#F5E6C8]/30 to-transparent p-3.5 rounded-xl border border-[#7BBF9E]/10 shadow-sm">
                   <div className="font-extrabold text-[15px] text-[#1A1A1A] mb-1">午门集合</div>
                   <div className="text-[13px] text-[#1A1A1A]/70 leading-relaxed">向导查验身份信息，并派发专属文化讲解器。</div>
                </div>
                <div className="absolute left-[11px] top-[7px] w-2.5 h-2.5 rounded-full bg-[#4A8C6F] shadow-[0_0_0_3px_rgba(74,140,111,0.2)]"></div>
             </div>

             <div className="flex gap-4 relative z-10">
                <div className="w-10 text-xs font-bold text-[#C8963E] pt-1">10:00</div>
                <div className="flex-1 bg-gradient-to-br from-[#F5E6C8]/30 to-transparent p-3.5 rounded-xl border border-[#7BBF9E]/10 shadow-sm">
                   <div className="font-extrabold text-[15px] text-[#1A1A1A] mb-1">游览前三殿</div>
                   <div className="text-[13px] text-[#1A1A1A]/70 leading-relaxed">依次穿行太和殿、中和殿、保和殿，感受皇城气象。</div>
                </div>
                <div className="absolute left-[11px] top-[7px] w-2.5 h-2.5 rounded-full bg-[#C8963E] shadow-[0_0_0_3px_rgba(200,150,62,0.2)]"></div>
             </div>

             <div className="flex gap-4 relative z-10">
                <div className="w-10 text-xs font-bold text-[#e88796] pt-1">12:30</div>
                <div className="flex-1 bg-gradient-to-br from-[#F5E6C8]/30 to-transparent p-3.5 rounded-xl border border-[#7BBF9E]/10 shadow-sm">
                   <div className="font-extrabold text-[15px] text-[#1A1A1A] mb-1">御膳房简餐</div>
                   <div className="text-[13px] text-[#1A1A1A]/70 leading-relaxed">于指定区域稍作歇息，品尝宫廷风味糕点与简餐。</div>
                </div>
                <div className="absolute left-[11px] top-[7px] w-2.5 h-2.5 rounded-full bg-[#e88796] shadow-[0_0_0_3px_rgba(232,135,150,0.2)]"></div>
             </div>
           </div>
        </div>

        {/* Backend Placeholder Sections */}
        <div className="grid grid-cols-2 gap-4">
          {/* Study Manual */}
          <div className="bg-white/80 rounded-2xl p-4 border border-[#7BBF9E]/10 shadow-[0_4px_12px_rgba(74,140,111,0.04)] flex flex-col items-center justify-center text-center gap-2 group cursor-pointer hover:bg-white transition-colors">
            <div className="w-12 h-12 bg-[#F5E6C8]/40 rounded-full flex items-center justify-center text-[#C8963E] group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#1A1A1A]">研学手册</div>
              <div className="text-[10px] text-[#4A8C6F] bg-[#7BBF9E]/10 px-2 py-0.5 rounded-sm mt-1">云端拉取中...</div>
            </div>
          </div>

          {/* Attraction Guides */}
          <div className="bg-white/80 rounded-2xl p-4 border border-[#7BBF9E]/10 shadow-[0_4px_12px_rgba(74,140,111,0.04)] flex flex-col items-center justify-center text-center gap-2 group cursor-pointer hover:bg-white transition-colors">
            <div className="w-12 h-12 bg-[#7BBF9E]/20 rounded-full flex items-center justify-center text-[#4A8C6F] group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#1A1A1A]">景点攻略</div>
              <div className="text-[10px] text-[#4A8C6F] bg-[#7BBF9E]/10 px-2 py-0.5 rounded-sm mt-1">云端拉取中...</div>
            </div>
          </div>

          {/* Food Recs */}
          <div className="bg-white/80 rounded-2xl p-4 border border-[#7BBF9E]/10 shadow-[0_4px_12px_rgba(74,140,111,0.04)] flex flex-col items-center justify-center text-center gap-2 group cursor-pointer hover:bg-white transition-colors col-span-2">
            <div className="w-12 h-12 bg-[#F7C7CF]/30 rounded-full flex items-center justify-center text-[#e88796] group-hover:scale-110 transition-transform">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#1A1A1A]">美食推荐指南</div>
              <div className="text-[10px] text-[#4A8C6F] bg-[#7BBF9E]/10 px-2 py-0.5 rounded-sm mt-1 inline-block">等待后端上传接入</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}