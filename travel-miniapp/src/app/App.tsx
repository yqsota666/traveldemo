import { useState } from 'react';
import { Home, User, ChevronLeft, ChevronRight, Check, Info, ShoppingBag } from 'lucide-react';
import CityDetail from './components/CityDetail';
import Profile from './components/Profile';
import Products from './components/Products';
import TripReminder from './components/TripReminder';
import Consultation from './components/Consultation';
import WishlistForm from './components/WishlistForm';
import HotelList from './components/HotelList';

export default function App() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(2);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showTripReminder, setShowTripReminder] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const [showHotels, setShowHotels] = useState(false);

  // TODO: [Backend Interface] Fetch banner images and configure via API
  const banners = [
    "https://images.unsplash.com/photo-1684871430772-569936b1a0ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwd2F0ZXJjb2xvciUyMG1vdW50YWluJTIwbmF0dXJlJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3OTA0MTk0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1542314831-c6a4d14eff40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3OTA0MTk0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhhc2lhbiUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8MTc3OTA0MTk0M3ww&ixlib=rb-4.1.0&q=80&w=1080"
  ];

  // TODO: [Backend Interface] Fetch hot cities data from API
  const hotCitiesData = [
    { name: '北京', num: '01', img: 'https://images.unsplash.com/photo-1599813876020-0082ea5743fb?q=80&w=600&auto=format&fit=crop' },
    { name: '西安', num: '02', img: 'https://images.unsplash.com/photo-1584680238861-1250325d7c86?q=80&w=600&auto=format&fit=crop' }
  ];

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
  };

  const handleBackToHome = () => {
    setSelectedCity(null);
  };

  if (isLoggedOut) {
    return <WishlistForm onComplete={() => setIsLoggedOut(false)} />;
  }

  if (selectedCity) {
    return <CityDetail cityName={selectedCity} onBack={handleBackToHome} />;
  }

  if (showTripReminder) {
    return <TripReminder onBack={() => setShowTripReminder(false)} />;
  }
  
  if (showHotels) {
    return <HotelList onBack={() => setShowHotels(false)} />;
  }

  const renderBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-[#FDFCF8]/95 backdrop-blur-md border-t border-[#7BBF9E]/20 shadow-[0_-4px_20px_rgba(74,140,111,0.08)] grid grid-cols-4 max-w-[560px] mx-auto z-30 pb-safe">
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center py-3 px-2 transition-all duration-300 relative ${
          activeTab === 'home' ? 'text-[#4A8C6F]' : 'text-[#7BBF9E] hover:text-[#4A8C6F]'
        }`}
      >
        {activeTab === 'home' && (
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-[#7BBF9E] to-[#4A8C6F] rounded-b-md shadow-[0_2px_4px_rgba(74,140,111,0.4)]"></span>
        )}
        <div className={`p-1 rounded-xl transition-all duration-300 ${activeTab === 'home' ? 'bg-[#E8F2ED]' : ''}`}>
          <Home className="w-6 h-6 mb-1" strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        </div>
        <span className={`text-[10px] ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>首页</span>
      </button>
      <button
        onClick={() => setActiveTab('products')}
        className={`flex flex-col items-center py-3 px-2 transition-all duration-300 relative ${
          activeTab === 'products' ? 'text-[#4A8C6F]' : 'text-[#7BBF9E] hover:text-[#4A8C6F]'
        }`}
      >
        {activeTab === 'products' && (
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-[#7BBF9E] to-[#4A8C6F] rounded-b-md shadow-[0_2px_4px_rgba(74,140,111,0.4)]"></span>
        )}
        <div className={`p-1 rounded-xl transition-all duration-300 ${activeTab === 'products' ? 'bg-[#E8F2ED]' : ''}`}>
          <ShoppingBag className="w-6 h-6 mb-1" strokeWidth={activeTab === 'products' ? 2.5 : 2} />
        </div>
        <span className={`text-[10px] ${activeTab === 'products' ? 'font-bold' : 'font-medium'}`}>文创</span>
      </button>
      <button
        onClick={() => setActiveTab('about')}
        className={`flex flex-col items-center py-3 px-2 transition-all duration-300 relative ${
          activeTab === 'about' ? 'text-[#4A8C6F]' : 'text-[#7BBF9E] hover:text-[#4A8C6F]'
        }`}
      >
        {activeTab === 'about' && (
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-[#7BBF9E] to-[#4A8C6F] rounded-b-md shadow-[0_2px_4px_rgba(74,140,111,0.4)]"></span>
        )}
        <div className={`p-1 rounded-xl transition-all duration-300 ${activeTab === 'about' ? 'bg-[#E8F2ED]' : ''}`}>
          <Info className="w-6 h-6 mb-1" strokeWidth={activeTab === 'about' ? 2.5 : 2} />
        </div>
        <span className={`text-[10px] ${activeTab === 'about' ? 'font-bold' : 'font-medium'}`}>关于我们</span>
      </button>
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center py-3 px-2 transition-all duration-300 relative ${
          activeTab === 'profile' ? 'text-[#4A8C6F]' : 'text-[#7BBF9E] hover:text-[#4A8C6F]'
        }`}
      >
        {activeTab === 'profile' && (
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-[#7BBF9E] to-[#4A8C6F] rounded-b-md shadow-[0_2px_4px_rgba(74,140,111,0.4)]"></span>
        )}
        <div className={`p-1 rounded-xl transition-all duration-300 ${activeTab === 'profile' ? 'bg-[#E8F2ED]' : ''}`}>
          <User className="w-6 h-6 mb-1" strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
        </div>
        <span className={`text-[10px] ${activeTab === 'profile' ? 'font-bold' : 'font-medium'}`}>我的</span>
      </button>
    </div>
  );

  if (activeTab === 'profile') {
    return (
      <div className="h-screen flex flex-col bg-[#FDFCF8] max-w-[560px] mx-auto relative text-[#1A1A1A]">
        <Profile onLogout={() => setIsLoggedOut(true)} />
        {renderBottomNav()}
      </div>
    );
  }

  if (activeTab === 'products') {
    return (
      <div className="h-screen flex flex-col bg-[#FDFCF8] max-w-[560px] mx-auto relative text-[#1A1A1A]">
        <Products />
        {renderBottomNav()}
      </div>
    );
  }

  if (activeTab === 'about') {
    return (
      <div className="h-screen flex flex-col bg-[#FDFCF8] max-w-[560px] mx-auto relative text-[#1A1A1A] overflow-hidden">
        {/* Global Watercolor Background Blooms */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply opacity-60">
          <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[50%] rounded-full bg-[#7BBF9E]/20 blur-[100px]"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[90%] h-[50%] rounded-full bg-[#F5E6C8]/30 blur-[90px]"></div>
        </div>

        {/* Header with pt-16 for status bar spacing */}
        <div className="relative flex items-center justify-center px-4 pt-16 py-4 z-10 border-b border-[#7BBF9E]/10 bg-[#FDFCF8]/60 backdrop-blur-sm">
          <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] tracking-wider">
            关于我们
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide pb-24 p-5 space-y-6 relative z-10">
          {/* Company Intro */}
          <div className="bg-white/80 p-5 rounded-2xl shadow-sm border border-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-[#7BBF9E]/10 to-transparent rounded-bl-full"></div>
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-3 flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-4 bg-gradient-to-b from-[#4A8C6F] to-[#7BBF9E] rounded-full"></span>
              公司简介
            </h2>
            <p className="text-sm text-[#1A1A1A]/80 leading-relaxed text-justify relative z-10">
              我们致力于为您提供最地道的国风文旅体验。深入挖掘华夏大地深厚的历史文化底蕴，将传统之美与现代出行完美结合，为您打造独一无二的游园记忆。无论是千年古刹的静谧，还是市井弄堂的烟火，我们都用心为您呈现。
            </p>
          </div>
          
          {/* Guide Intro */}
          <div className="bg-white/80 p-5 rounded-2xl shadow-sm border border-white">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-gradient-to-b from-[#C8963E] to-[#F5E6C8] rounded-full"></span>
              金牌向导
            </h2>
            <div className="flex items-center gap-4 bg-[#F5E6C8]/20 p-4 rounded-xl border border-[#C8963E]/10">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" className="w-16 h-16 rounded-full object-cover border-2 border-[#4A8C6F]/30 sepia-[.2]" alt="向导头像" />
              <div>
                <div className="font-bold text-[#1A1A1A] text-base">苏向导</div>
                <div className="text-xs text-[#4A8C6F] mt-1 font-medium bg-[#7BBF9E]/10 px-2 py-0.5 rounded-sm inline-block">从业 8 年 | 历史学硕士</div>
                <p className="text-xs text-[#1A1A1A]/60 mt-2 italic">“让每一块青砖黛瓦，都为您讲述千年的故事。”</p>
              </div>
            </div>
          </div>

          {/* Screenshots */}
          <div className="bg-white/80 p-5 rounded-2xl shadow-sm border border-white">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-gradient-to-b from-[#e88796] to-[#F7C7CF] rounded-full"></span>
              好评如潮
            </h2>
            <div className="space-y-4">
              <div className="group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-[#1A1A1A]">小红书精选游记</span>
                  <span className="text-xs text-[#4A8C6F]">查看更多 <ChevronRight className="w-3 h-3 inline" /></span>
                </div>
                <div className="overflow-hidden rounded-xl border border-[#7BBF9E]/10">
                  <img src="https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=400" className="w-full h-32 object-cover sepia-[.1] group-hover:scale-105 transition-transform duration-500" alt="小红书截图" />
                </div>
              </div>
              <div className="group cursor-pointer pt-2 border-t border-[#7BBF9E]/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-[#1A1A1A]">微信客户反馈</span>
                  <span className="text-xs text-[#4A8C6F]">查看更多 <ChevronRight className="w-3 h-3 inline" /></span>
                </div>
                <div className="overflow-hidden rounded-xl border border-[#7BBF9E]/10">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400" className="w-full h-32 object-cover sepia-[.1] group-hover:scale-105 transition-transform duration-500" alt="微信截图" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {renderBottomNav()}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#FDFCF8] max-w-[560px] mx-auto text-[#1A1A1A] relative overflow-hidden font-sans">
      
      {/* Global Watercolor Background Blooms */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply opacity-60">
        <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[50%] rounded-full bg-[#7BBF9E]/20 blur-[100px]"></div>
        <div className="absolute top-[20%] right-[-30%] w-[70%] h-[60%] rounded-full bg-[#F5E6C8]/40 blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[90%] h-[50%] rounded-full bg-[#F7C7CF]/15 blur-[90px]"></div>
      </div>

      {/* Kept top spacing for Mini Program compatibility (Status Bar & Native Header Area) */}
      <div className="relative pt-16 z-10"></div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10 scrollbar-hide pb-20">
        {/* Banner Carousel */}
        <div className="relative h-[300px] flex items-center justify-center overflow-hidden mb-2 group">
          {/* Background Image with Rich Overlay */}
          <div className="absolute inset-0">
             <img 
               src={banners[currentBanner]} 
               alt="Banner Background" 
               className="w-full h-full object-cover sepia-[.3] saturate-150 hue-rotate-15 transition-transform duration-1000 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCF8] via-transparent to-black/10"></div>
             <div className="absolute inset-0 bg-[#7BBF9E]/10 mix-blend-color"></div>
          </div>

          <button
            onClick={prevBanner}
            className="absolute left-4 p-2.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-full hover:bg-white/70 z-10 text-[#1A1A1A] shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="px-8 py-3 bg-white/60 backdrop-blur-md border border-white/50 rounded-lg z-10 shadow-[0_8px_32px_rgba(74,140,111,0.2)] text-[#1A1A1A] font-bold tracking-wide transform transition-all group-hover:scale-105">
            轮播图 {currentBanner + 1}
          </div>

          <button
            onClick={nextBanner}
            className="absolute right-4 p-2.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-full hover:bg-white/70 z-10 text-[#1A1A1A] shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.2)] ${
                  currentBanner === index ? 'bg-white w-6' : 'bg-white/50 border border-white/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Pre-trip Reminder */}
        <div className="px-4 py-4 relative cursor-pointer" onClick={() => setShowTripReminder(true)}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#F5E6C8]/40 border border-[#7BBF9E]/20 shadow-[0_8px_24px_rgba(200,150,62,0.12)] p-4 flex items-center hover:shadow-[0_12px_32px_rgba(200,150,62,0.2)] transition-all duration-300 transform hover:-translate-y-1">
            {/* Decorative floral/cloud element abstract */}
            <div className="absolute -right-4 -top-6 w-24 h-24 bg-gradient-to-br from-[#7BBF9E]/20 to-[#C8963E]/10 rounded-full blur-xl"></div>
            
            <div className="bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] text-white px-3 py-1.5 text-xs font-bold mr-4 shrink-0 rounded-lg shadow-[0_4px_10px_rgba(74,140,111,0.3)] relative z-10">
              行程提醒
            </div>
            <div className="flex flex-col relative z-10 flex-1">
              <div className="flex items-center gap-3 text-[#1A1A1A] mb-1">
                <span className="font-extrabold text-base">北京</span>
                <span className="text-sm font-medium text-[#4A8C6F]">晴 25°C</span>
              </div>
              <span className="text-[#1A1A1A]/60 text-xs line-clamp-1">点击查看天气、穿衣建议及行程安排</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#4A8C6F]/50 relative z-10" />
          </div>
        </div>

        {/* Hot Cities */}
        <div className="px-5 py-6 relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-6 bg-gradient-to-b from-[#4A8C6F] to-[#7BBF9E] rounded-full shadow-[0_2px_8px_rgba(74,140,111,0.5)]"></div>
            <h2 className="text-xl font-extrabold text-[#1A1A1A] tracking-wide">热门城市</h2>
          </div>
          <div className="flex flex-col gap-4">
            {hotCitiesData.map((city) => (
              <button
                key={city.name}
                onClick={() => handleCityClick(city.name)}
                className="relative h-28 w-full rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(123,191,158,0.15)] group transition-all duration-300 border border-white"
              >
                <img 
                  src={city.img} 
                  className="absolute inset-0 w-full h-full object-cover sepia-[.2] group-hover:scale-105 transition-transform duration-700" 
                  alt={city.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/80 via-[#1A1A1A]/40 to-transparent"></div>
                <div className="absolute inset-0 bg-[#7BBF9E]/10 mix-blend-multiply"></div>
                
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                   <span className="text-white/40 font-black text-4xl italic tracking-tighter">{city.num}</span>
                   <span className="text-white font-extrabold text-2xl tracking-widest drop-shadow-md">{city.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Hotels */}
        <div className="px-5 py-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-6 bg-gradient-to-b from-[#C8963E] to-[#F5E6C8] rounded-full shadow-[0_2px_8px_rgba(200,150,62,0.5)]"></div>
            <h2 className="text-xl font-extrabold text-[#1A1A1A] tracking-wide">精选客栈</h2>
          </div>
          <div 
            className="relative h-48 rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(200,150,62,0.15)] group cursor-pointer"
            onClick={() => setShowHotels(true)}
          >
            <img 
              src="https://images.unsplash.com/photo-1614765437824-f5433016b7b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwdHJhZGl0aW9uYWwlMjBhcmNoaXRlY3R1cmUlMjBwYXZpbGlvbiUyMGdhcmRlbnxlbnwxfHx8fDE3NzkwNDE5NDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Traditional Pavilion"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 sepia-[.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
              <div>
                <div className="text-white/80 text-xs font-bold mb-1 tracking-widest">推荐</div>
                <div className="text-white font-extrabold text-lg">探索绝佳住所</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:bg-[#C8963E] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Attractions */}
        <div className="px-5 py-8 pb-32">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-6 bg-gradient-to-b from-[#F7C7CF] to-white rounded-full shadow-[0_2px_8px_rgba(247,199,207,0.5)]"></div>
            <h2 className="text-xl font-extrabold text-[#1A1A1A] tracking-wide">热门景点</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="relative h-40 rounded-2xl overflow-hidden shadow-[0_8px_20px_rgba(74,140,111,0.12)] group cursor-pointer bg-white border border-white"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#7BBF9E]/20 to-[#F5E6C8]/30"></div>
                {/* Abstract Mountain SVG */}
                <svg className="absolute bottom-0 left-0 w-full text-[#4A8C6F] opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-20" viewBox="0 0 100 50" preserveAspectRatio="none">
                  <path fill="currentColor" d="M0,50 L20,20 L40,40 L70,10 L100,50 Z"/>
                </svg>
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center text-[#4A8C6F] shadow-sm">
                    <span className="font-bold text-sm">0{item}</span>
                  </div>
                  <span className="text-[#1A1A1A] font-extrabold text-lg group-hover:text-[#4A8C6F] transition-colors">景点 {item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Online Consultation Floating Button (hidden if showConsultation is true) */}
      {!showConsultation && (
        <button 
          onClick={() => setShowConsultation(true)}
          className="fixed bottom-24 right-5 flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] text-white shadow-[0_8px_24px_rgba(74,140,111,0.4)] hover:shadow-[0_12px_32px_rgba(74,140,111,0.5)] transition-all z-40 rounded-full font-bold transform hover:-translate-y-1"
        >
          <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center">
            <span className="text-xs leading-none">?</span>
          </div>
          <span>在线咨询</span>
        </button>
      )}

      {/* Refreshing Indicator */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-md text-[#4A8C6F] border border-white rounded-full z-50 shadow-[0_8px_32px_rgba(74,140,111,0.15)] font-bold opacity-0">
        <div className="w-5 h-5 rounded-full bg-[#4A8C6F] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(74,140,111,0.5)]">
          <Check className="w-3 h-3" strokeWidth={3} />
        </div>
        <span className="text-sm">正在刷新...</span>
      </div>

      {renderBottomNav()}
      
      {/* Consultation Popup Overlay */}
      {showConsultation && <Consultation onClose={() => setShowConsultation(false)} />}
    </div>
  );
}