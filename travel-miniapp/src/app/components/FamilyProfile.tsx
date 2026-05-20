import { ArrowLeft, Plus, Calendar, MapPin } from 'lucide-react';

interface FamilyProfileProps {
  onBack: () => void;
}

export default function FamilyProfile({ onBack }: FamilyProfileProps) {
  const familyMembers = [
    { name: '大宝 (儿子)', birthday: '2016-08-15', places: ['北京故宫', '西安兵马俑', '上海迪士尼'] },
    { name: '二宝 (女儿)', birthday: '2020-03-22', places: ['上海迪士尼', '广州长隆'] },
    { name: '妈妈', birthday: '1990-11-05', places: ['北京', '西安', '上海', '广州', '成都', '杭州'] },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#FDFCF8] text-[#1A1A1A] absolute inset-0 z-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#7BBF9E]/30 bg-[#FDFCF8]/90 backdrop-blur-md sticky top-0 z-20 shadow-sm shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-[#F5E6C8]/40 rounded-full text-[#4A8C6F] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold text-[#4A8C6F]">家庭档案</h1>
        <button className="p-2 hover:bg-[#F5E6C8]/40 rounded-full text-[#4A8C6F] transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 relative z-10 scrollbar-hide space-y-4">
        {/* Global Watercolor Background Blooms */}
        <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden mix-blend-multiply opacity-50">
          <div className="absolute top-[-5%] left-[-20%] w-[80%] h-[40%] rounded-full bg-[#7BBF9E]/20 blur-[100px]"></div>
        </div>

        <div className="bg-gradient-to-r from-[#F5E6C8]/40 to-transparent p-4 rounded-xl border border-[#C8963E]/20 mb-2">
          <p className="text-sm text-[#1A1A1A]/80 font-medium">
            记录每个家庭成员的成长足迹，定制专属亲子游方案。
          </p>
        </div>

        {familyMembers.map((member, idx) => (
          <div key={idx} className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-white shadow-[0_4px_16px_rgba(74,140,111,0.06)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#7BBF9E]/10 to-transparent rounded-bl-full"></div>
            
            <h2 className="font-extrabold text-lg text-[#1A1A1A] mb-4 relative z-10 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-gradient-to-b from-[#4A8C6F] to-[#7BBF9E] rounded-full"></span>
              {member.name}
            </h2>
            
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 bg-[#F5E6C8]/50 rounded-lg text-[#C8963E]">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-[#1A1A1A]/70">生日：<span className="font-bold text-[#1A1A1A]">{member.birthday}</span></span>
              </div>
              
              <div className="flex items-start gap-3 text-sm">
                <div className="p-1.5 bg-[#7BBF9E]/20 rounded-lg text-[#4A8C6F] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#1A1A1A]/70 block mb-1">去过的地方：</span>
                  <div className="flex flex-wrap gap-2">
                    {member.places.map(place => (
                      <span key={place} className="px-2 py-1 bg-white border border-[#7BBF9E]/30 rounded-md text-xs font-bold text-[#4A8C6F] shadow-sm">
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button className="w-full mt-4 py-4 rounded-xl border-2 border-dashed border-[#7BBF9E]/40 text-[#4A8C6F] font-bold flex items-center justify-center gap-2 hover:bg-[#7BBF9E]/10 transition-colors">
          <Plus className="w-5 h-5" />
          添加家庭成员
        </button>
      </div>
    </div>
  );
}