import { ArrowLeft } from 'lucide-react';

interface TravelMapProps {
  onBack: () => void;
}

export default function TravelMap({ onBack }: TravelMapProps) {
  return (
    <div className="h-full flex flex-col bg-[#FDFCF8] overflow-hidden pb-20 relative z-50 absolute inset-0 text-[#1A1A1A]">
      {/* Header - Title Removed */}
      <div className="flex items-center px-4 py-3 border-b border-[#7BBF9E]/30 bg-[#FDFCF8] z-20 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-[#F5E6C8]/40 rounded-full text-[#4A8C6F] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-[#F5E6C8]/10 overflow-hidden border-b border-[#7BBF9E]/30">
        {/* Map Background */}
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMG1hcHxlbnwxfHx8fDE3Nzg5ODc3OTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Map"
          className="absolute inset-0 w-full h-full object-cover opacity-15 sepia-[.5] hue-rotate-15"
        />

        {/* Nationwide Map Button */}
        <button className="absolute top-4 right-4 bg-[#FDFCF8]/90 backdrop-blur-sm border border-[#7BBF9E]/40 px-4 py-1.5 text-sm shadow-sm hover:bg-[#F5E6C8]/50 z-10 text-[#4A8C6F] font-bold rounded-sm">
          神州全景
        </button>

        {/* Map Route/Markers SVG */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
          <path
            d="M 120 180 Q 200 160 260 220"
            fill="none"
            stroke="#4A8C6F"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <circle cx="120" cy="180" r="4" fill="#C8963E" />
          <text x="100" y="205" fontSize="14" fill="#1A1A1A" fontWeight="bold" style={{textShadow: '1px 1px 2px rgba(253,252,248,0.8)'}}>长安</text>
          <circle cx="260" cy="220" r="4" fill="#C8963E" />
        </svg>

        {/* Shanghai Tooltip */}
        <div className="absolute z-10" style={{ top: '190px', left: '250px' }}>
          <div className="bg-[#FDFCF8] border border-[#C8963E]/40 px-3 py-1 text-xs whitespace-nowrap relative font-bold text-[#C8963E] shadow-[2px_2px_8px_rgba(200,150,62,0.15)] rounded-sm">
            沪上
            <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FDFCF8] border-b border-r border-[#C8963E]/40 transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Bottom Card - Stats Removed as requested */}
      <div className="bg-[#FDFCF8] px-4 py-6 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-[#4A8C6F]/30 overflow-hidden bg-[#F5E6C8]/30 flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc4OTcwNTI4fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Avatar"
              className="w-full h-full object-cover sepia-[.2]"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1 text-[#1A1A1A]">游园雅客</h2>
            <p className="text-sm text-[#4A8C6F]/80">足迹遍布 1 国 2 城</p>
          </div>
        </div>
      </div>
    </div>
  );
}