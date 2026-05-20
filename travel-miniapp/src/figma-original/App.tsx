import { useState } from 'react';
import { Home, User, ChevronLeft, ChevronRight, MessageCircle, Check, Info, ShoppingBag } from 'lucide-react';
import CityDetail from './components/CityDetail';
import Profile from './components/Profile';
import Products from './components/Products';

export default function App() {
  const [currentBanner, setCurrentBanner] = useState(2);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
  };

  const handleBackToHome = () => {
    setSelectedCity(null);
  };

  // Show city detail page if a city is selected
  if (selectedCity) {
    return <CityDetail cityName={selectedCity} onBack={handleBackToHome} />;
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
        <span className={`text-[10px] ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>Home</span>
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
        <span className={`text-[10px] ${activeTab === 'products' ? 'font-bold' : 'font-medium'}`}>Products</span>
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
        <span className={`text-[10px] ${activeTab === 'about' ? 'font-bold' : 'font-medium'}`}>About Us</span>
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
        <span className={`text-[10px] ${activeTab === 'profile' ? 'font-bold' : 'font-medium'}`}>My</span>
      </button>
    </div>
  );

  // Show Profile page if activeTab is 'profile'
  if (activeTab === 'profile') {
    return (
      <div className="h-screen flex flex-col bg-[#FDFCF8] max-w-[560px] mx-auto relative text-[#1A1A1A]">
        <Profile />
        {renderBottomNav()}
      </div>
    );
  }

  // Show Products page if activeTab is 'products'
  if (activeTab === 'products') {
    return (
      <div className="h-screen flex flex-col bg-[#FDFCF8] max-w-[560px] mx-auto relative text-[#1A1A1A]">
        <Products />
        {renderBottomNav()}
      </div>
    );
  }

  // Show About Us page if activeTab is 'about'
  if (activeTab === 'about') {
    return (
      <div className="h-screen flex flex-col bg-[#FDFCF8] max-w-[560px] mx-auto relative text-[#1A1A1A]">
        <div className="flex-1 flex items-center justify-center font-bold text-xl text-[#4A8C6F]">
          About Us (开发中)
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

      {/* Status Bar */}
      <div className="relative flex items-center justify-between px-5 py-2.5 text-sm text-[#4A8C6F] font-medium z-10 bg-gradient-to-b from-[#FDFCF8] to-transparent">
        <span>9:41</span>
        <div className="flex gap-1.5 items-center">
          <div className="w-4 h-3 rounded-[2px] border border-[#4A8C6F] relative overflow-hidden">
             <div className="absolute inset-[1px] bg-[#4A8C6F] rounded-[1px] w-[70%]"></div>
          </div>
          <div className="flex items-end gap-[2px] h-3">
             <div className="w-[3px] h-[4px] bg-[#4A8C6F] rounded-sm"></div>
             <div className="w-[3px] h-[7px] bg-[#4A8C6F] rounded-sm"></div>
             <div className="w-[3px] h-[10px] bg-[#4A8C6F] rounded-sm"></div>
             <div className="w-[3px] h-[12px] bg-[#7BBF9E]/40 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-center px-4 py-4 z-10 border-b border-[#7BBF9E]/10 bg-[#FDFCF8]/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(123,191,158,0.06)]">
        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] tracking-wider">
          Home
        </h1>
        {/* Subtle decorative cloud behind title */}
        <svg className="absolute w-24 h-12 text-[#F5E6C8] opacity-30 -z-10" viewBox="0 0 100 50">
          <path fill="currentColor" d="M10,30 Q20,10 40,20 Q60,0 80,20 Q90,10 100,30 L100,50 L0,50 Z"/>
        </svg>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10 scrollbar-hide pb-20">
        {/* Banner Carousel */}
        <div className="relative h-[300px] flex items-center justify-center overflow-hidden mb-2 group">
          {/* Background Image with Rich Overlay */}
          <div className="absolute inset-0">
             <img 
               src="https://images.unsplash.com/photo-1684871430772-569936b1a0ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwd2F0ZXJjb2xvciUyMG1vdW50YWluJTIwbmF0dXJlJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3OTA0MTk0M3ww&ixlib=rb-4.1.0&q=80&w=1080" 
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
            Banner {currentBanner + 1}
          </div>

          <button
            onClick={nextBanner}
            className="absolute right-4 p-2.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-full hover:bg-white/70 z-10 text-[#1A1A1A] shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
            {[0, 1, 2].map((index) => (
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
        <div className="px-4 py-4 relative">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#F5E6C8]/40 border border-white shadow-[0_8px_24px_rgba(200,150,62,0.12)] p-4 flex items-center">
            {/* Decorative floral/cloud element abstract */}
            <div className="absolute -right-4 -top-6 w-24 h-24 bg-gradient-to-br from-[#7BBF9E]/20 to-[#C8963E]/10 rounded-full blur-xl"></div>
            
            <div className="bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] text-white px-3 py-1.5 text-xs font-bold mr-4 shrink-0 rounded-lg shadow-[0_4px_10px_rgba(74,140,111,0.3)] relative z-10">
              Reminder
            </div>
            <div className="flex flex-col relative z-10">
              <div className="flex items-center gap-3 text-[#1A1A1A] mb-1">
                <span className="font-extrabold text-base">Beijing</span>
                <span className="text-sm font-medium text-[#4A8C6F]">Sunny 25°C</span>
              </div>
              <span className="text-[#1A1A1A]/60 text-xs line-clamp-1">Don't forget to pack your passport!</span>
            </div>
          </div>
        </div>

        {/* Hot Cities */}
        <div className="px-5 py-6 relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-6 bg-gradient-to-b from-[#4A8C6F] to-[#7BBF9E] rounded-full shadow-[0_2px_8px_rgba(74,140,111,0.5)]"></div>
            <h2 className="text-xl font-extrabold text-[#1A1A1A] tracking-wide">Hot Cities</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Beijing', 'Xi\'an', 'Shanghai'].map((city, i) => (
              <button
                key={city}
                onClick={() => handleCityClick(city)}
                className="relative group overflow-hidden rounded-xl bg-white border border-white shadow-[0_4px_16px_rgba(123,191,158,0.1)] hover:shadow-[0_8px_24px_rgba(74,140,111,0.2)] transition-all duration-300 h-16 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#7BBF9E]/5 to-[#4A8C6F]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="font-bold text-[#1A1A1A] group-hover:text-[#4A8C6F] transition-colors relative z-10">{city}</span>
                {/* Decorative circle */}
                <div className={`absolute -bottom-4 -right-4 w-12 h-12 rounded-full opacity-20 bg-gradient-to-tr ${i%2===0 ? 'from-[#4A8C6F] to-[#7BBF9E]' : 'from-[#C8963E] to-[#F5E6C8]'}`}></div>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Hotels */}
        <div className="px-5 py-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-6 bg-gradient-to-b from-[#C8963E] to-[#F5E6C8] rounded-full shadow-[0_2px_8px_rgba(200,150,62,0.5)]"></div>
            <h2 className="text-xl font-extrabold text-[#1A1A1A] tracking-wide">Recommended Hotels</h2>
          </div>
          <div className="relative h-48 rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(200,150,62,0.15)] group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1614765437824-f5433016b7b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwdHJhZGl0aW9uYWwlMjBhcmNoaXRlY3R1cmUlMjBwYXZpbGlvbiUyMGdhcmRlbnxlbnwxfHx8fDE3NzkwNDE5NDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Traditional Pavilion"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 sepia-[.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
              <div>
                <div className="text-white/80 text-xs font-bold mb-1 tracking-widest">FEATURED</div>
                <div className="text-white font-extrabold text-lg">Explore Top Stays</div>
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
            <h2 className="text-xl font-extrabold text-[#1A1A1A] tracking-wide">Popular Destinations</h2>
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
                  <span className="text-[#1A1A1A] font-extrabold text-lg group-hover:text-[#4A8C6F] transition-colors">Destination {item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Online Consultation Floating Button */}
      <button className="fixed bottom-24 right-5 flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] text-white shadow-[0_8px_24px_rgba(74,140,111,0.4)] hover:shadow-[0_12px_32px_rgba(74,140,111,0.5)] transition-all z-40 rounded-full font-bold transform hover:-translate-y-1">
        <MessageCircle className="w-5 h-5" />
        <span>Consultation</span>
      </button>

      {/* Refreshing Indicator */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-md text-[#4A8C6F] border border-white rounded-full z-50 shadow-[0_8px_32px_rgba(74,140,111,0.15)] font-bold">
        <div className="w-5 h-5 rounded-full bg-[#4A8C6F] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(74,140,111,0.5)]">
          <Check className="w-3 h-3" strokeWidth={3} />
        </div>
        <span className="text-sm">Refreshing...</span>
      </div>

      {renderBottomNav()}
    </div>
  );
}
