import { useState } from 'react';
import { Search } from 'lucide-react';
import ProductDetail from './ProductDetail';

const CITIES = ['北京', '西安'];

const PRODUCTS = {
  '北京': [
    { id: 1, name: '故宫御猫冰箱贴', desc: '小巧精致，把紫禁城带回家', price: '¥39', img: 'https://images.unsplash.com/photo-1599813876020-0082ea5743fb?q=80&w=400&auto=format&fit=crop' },
    { id: 2, name: '长城帆布袋', desc: '极简线条勾勒长城壮景', price: '¥59', img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=400&auto=format&fit=crop' },
    { id: 3, name: '京剧脸谱书签', desc: '传统文化，镂空工艺', price: '¥25', img: 'https://images.unsplash.com/photo-1580665355088-75051a24911f?q=80&w=400&auto=format&fit=crop' },
  ],
  '西安': [
    { id: 4, name: '兵马俑手办', desc: '手工打磨，重现大秦风采', price: '¥89', img: 'https://images.unsplash.com/photo-1563804812328-8686d420fec7?q=80&w=400&auto=format&fit=crop' },
    { id: 5, name: '大雁塔明信片', desc: '古都长安韵味，胶片质感', price: '¥35', img: 'https://images.unsplash.com/photo-1584680238861-1250325d7c86?q=80&w=400&auto=format&fit=crop' },
  ]
};

export default function Products() {
  const [activeCity, setActiveCity] = useState(CITIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
  }

  const currentProducts = PRODUCTS[activeCity as keyof typeof PRODUCTS] || [
    { id: 99, name: `${activeCity}限定帆布袋`, desc: '城市主题，简约百搭', price: '¥49', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop' },
    { id: 100, name: `${activeCity}纪念徽章`, desc: '金属材质，黑白烤漆', price: '¥29', img: 'https://images.unsplash.com/photo-1618306917637-293693e50cd8?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#FDFCF8] overflow-hidden pb-20 text-[#1A1A1A] relative z-0">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply opacity-60">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[40%] rounded-full bg-[#7BBF9E]/20 blur-[90px]"></div>
        <div className="absolute bottom-[10%] left-[-20%] w-[80%] h-[60%] rounded-full bg-[#F5E6C8]/30 blur-[100px]"></div>
      </div>

      <div className="p-4 border-b border-[#7BBF9E]/10 z-10 bg-white/60 backdrop-blur-md shadow-[0_4px_20px_rgba(74,140,111,0.04)] relative pt-16">
        <div className="flex items-center border border-white rounded-2xl px-4 py-2.5 bg-white/80 shadow-[0_4px_12px_rgba(74,140,111,0.05)] focus-within:shadow-[0_4px_16px_rgba(74,140,111,0.15)] transition-all">
          <Search className="w-5 h-5 text-[#4A8C6F] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="搜索文创产品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-[#1A1A1A] placeholder-[#1A1A1A]/40 font-medium"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        <div className="w-[100px] border-r border-[#7BBF9E]/10 flex flex-col overflow-y-auto bg-white/40 shrink-0 backdrop-blur-sm">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`py-6 relative text-center transition-all duration-300 ${
                activeCity === city
                  ? 'text-[#4A8C6F] font-extrabold bg-gradient-to-r from-transparent to-[#7BBF9E]/10'
                  : 'text-[#1A1A1A]/60 font-bold hover:bg-white/50 hover:text-[#1A1A1A]'
              }`}
            >
              {activeCity === city && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-gradient-to-b from-[#4A8C6F] to-[#7BBF9E] rounded-r-md shadow-[2px_0_8px_rgba(74,140,111,0.4)]"></div>
              )}
              {city}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#1A1A1A] to-[#4A8C6F] tracking-wide">
              {activeCity} 推荐文创
            </h2>
          </div>
          
          <div className="flex flex-col gap-5">
            {currentProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => setSelectedProduct(product)}
                className="flex rounded-2xl bg-white border border-white shadow-[0_8px_20px_rgba(74,140,111,0.06)] hover:shadow-[0_12px_28px_rgba(74,140,111,0.15)] transition-all duration-300 group cursor-pointer overflow-hidden transform hover:-translate-y-1"
              >
                <div className="w-[120px] h-[130px] shrink-0 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#F5E6C8]/20 mix-blend-multiply z-10"></div>
                  <img 
                    src={product.img} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 sepia-[.1]"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1 overflow-hidden relative">
                  <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-tl from-[#7BBF9E]/10 to-transparent rounded-full translate-x-1/3 translate-y-1/3"></div>
                  
                  <div className="relative z-10">
                    <h3 className="font-extrabold text-[15px] truncate text-[#1A1A1A] mb-1">{product.name}</h3>
                    <p className="text-[13px] text-[#1A1A1A]/60 line-clamp-2 leading-relaxed font-medium">
                      {product.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-3 relative z-10">
                    <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#C8963E] to-[#E6B964] drop-shadow-sm">{product.price}</span>
                    <button className="bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] text-white px-4 py-1.5 text-xs font-extrabold rounded-full hover:shadow-[0_4px_12px_rgba(74,140,111,0.4)] transition-all transform active:scale-95">
                      购买
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="h-24"></div>
        </div>
      </div>
    </div>
  );
}