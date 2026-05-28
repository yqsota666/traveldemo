import { useState } from 'react';
import Taro from '@tarojs/taro';
import TravelMap from './TravelMap';
import FamilyProfile from './FamilyProfile';
import { Bell } from 'lucide-react';

interface ProfileProps {
  onLogout: () => void;
}

export default function Profile({ onLogout }: ProfileProps) {
  const [showMap, setShowMap] = useState(false);
  const [showFamily, setShowFamily] = useState(false);

  const showComingSoon = (title: string) => {
    Taro.showToast({ title: `${title}即将开放`, icon: 'none' });
  };

  if (showMap) {
    return <TravelMap onBack={() => setShowMap(false)} />;
  }

  if (showFamily) {
    return <FamilyProfile onBack={() => setShowFamily(false)} />;
  }

  return (
    <div className="h-full flex flex-col bg-[#FDFCF8] p-5 pt-16 pb-32 relative text-[#1A1A1A] overflow-hidden font-sans z-0">
      {/* Messages Icon */}
      <button className="absolute top-14 right-5 z-20 p-2 bg-white/60 backdrop-blur-md rounded-full border border-white shadow-[0_4px_12px_rgba(74,140,111,0.1)] hover:bg-white text-[#4A8C6F] transition-all">
        <div className="relative">
          <Bell className="w-6 h-6" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#e88796] border-2 border-white rounded-full"></div>
        </div>
      </button>

      {/* Global Watercolor Background Blooms */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply opacity-60">
        <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[50%] rounded-full bg-[#4A8C6F]/10 blur-[100px]"></div>
        <div className="absolute bottom-[20%] left-[-30%] w-[70%] h-[60%] rounded-full bg-[#C8963E]/15 blur-[120px]"></div>
      </div>

      {/* Top Box: Points and Avatar */}
      <div className="bg-gradient-to-br from-[#7BBF9E]/20 to-[#F5E6C8]/30 border border-white p-5 flex justify-between items-center mt-6 mb-8 rounded-2xl shadow-[0_8px_32px_rgba(74,140,111,0.12)] relative overflow-hidden backdrop-blur-sm z-10">
        {/* Background decorative elements */}
        <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none mix-blend-color-burn">
           <svg width="120" height="120" viewBox="0 0 100 100">
             <path fill="#4A8C6F" d="M10,90 Q30,50 90,70 Q70,90 10,90 Z" />
           </svg>
        </div>
        
        <div className="flex flex-col z-10">
          <span className="text-[#1A1A1A] font-extrabold text-xl mb-3">游园雅客</span>
          <span className="text-[#4A8C6F] font-bold text-sm mb-1">我的积分</span>
          <div className="bg-gradient-to-r from-[#C8963E] to-[#E6B964] text-transparent bg-clip-text text-3xl font-black drop-shadow-sm">
            2,450
          </div>
        </div>
        
        <div className="w-20 h-20 rounded-full border-[3px] border-white overflow-hidden bg-[#FDFCF8] shrink-0 z-10 shadow-[0_8px_16px_rgba(74,140,111,0.2)]">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc4OTcwNTI4fDA&ixlib=rb-4.1.0&q=80&w=1080" 
            alt="Avatar" 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 sepia-[.1]"
          />
        </div>
      </div>

      {/* 4 Main Buttons */}
      <div className="flex flex-col gap-4 flex-1 z-10">
        <button
          onClick={() => showComingSoon('我的收藏')}
          className="bg-white/80 backdrop-blur-sm border border-white py-5 px-6 flex items-center justify-between font-bold text-lg text-[#1A1A1A] hover:shadow-[0_8px_24px_rgba(74,140,111,0.15)] transition-all duration-300 rounded-2xl shadow-[0_4px_12px_rgba(74,140,111,0.06)] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7BBF9E]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <span className="relative z-10 group-hover:text-[#4A8C6F] transition-colors">我的收藏</span>
          <div className="w-10 h-10 rounded-full bg-[#F5E6C8]/50 flex items-center justify-center text-[#C8963E] group-hover:bg-[#C8963E] group-hover:text-white transition-colors relative z-10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </button>
        <button 
          onClick={() => setShowMap(true)}
          className="bg-white/80 backdrop-blur-sm border border-white py-5 px-6 flex items-center justify-between font-bold text-lg text-[#1A1A1A] hover:shadow-[0_8px_24px_rgba(74,140,111,0.15)] transition-all duration-300 rounded-2xl shadow-[0_4px_12px_rgba(74,140,111,0.06)] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7BBF9E]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <span className="relative z-10 group-hover:text-[#4A8C6F] transition-colors">游览足迹</span>
          <div className="w-10 h-10 rounded-full bg-[#7BBF9E]/20 flex items-center justify-center text-[#4A8C6F] group-hover:bg-[#4A8C6F] group-hover:text-white transition-colors relative z-10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </button>
        <button
          onClick={() => showComingSoon('我的订单')}
          className="bg-white/80 backdrop-blur-sm border border-white py-5 px-6 flex items-center justify-between font-bold text-lg text-[#1A1A1A] hover:shadow-[0_8px_24px_rgba(74,140,111,0.15)] transition-all duration-300 rounded-2xl shadow-[0_4px_12px_rgba(74,140,111,0.06)] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7BBF9E]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <span className="relative z-10 group-hover:text-[#4A8C6F] transition-colors">我的订单</span>
          <div className="w-10 h-10 rounded-full bg-[#F7C7CF]/30 flex items-center justify-center text-[#e88796] group-hover:bg-[#e88796] group-hover:text-white transition-colors relative z-10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </button>
        {/* New Family Profile Button */}
        <button 
          onClick={() => setShowFamily(true)}
          className="bg-white/80 backdrop-blur-sm border border-[#C8963E]/30 py-5 px-6 flex items-center justify-between font-bold text-lg text-[#1A1A1A] hover:shadow-[0_8px_24px_rgba(200,150,62,0.15)] transition-all duration-300 rounded-2xl shadow-[0_4px_12px_rgba(200,150,62,0.06)] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C8963E]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <span className="relative z-10 group-hover:text-[#C8963E] transition-colors flex items-center gap-2">
            家庭档案
            <span className="text-[10px] bg-gradient-to-r from-[#C8963E] to-[#E6B964] text-white px-2 py-0.5 rounded-full shadow-sm">亲子专属</span>
          </span>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F5E6C8] to-white border border-[#C8963E]/30 flex items-center justify-center text-[#C8963E] group-hover:bg-[#C8963E] group-hover:text-white transition-colors relative z-10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </button>
      </div>

      {/* Logout Button */}
      <div className="flex justify-center mt-8 mb-8 z-10 relative">
        <button 
          onClick={onLogout}
          className="bg-white text-[#1A1A1A] px-12 py-3.5 rounded-full font-bold hover:text-white hover:bg-gradient-to-r hover:from-[#e88796] hover:to-[#F7C7CF] transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-[#F7C7CF]/50"
        >
          退出登录
        </button>
      </div>
    </div>
  );
}
