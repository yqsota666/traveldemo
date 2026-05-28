import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import ProductDetail from './ProductDetail';
import { contentApi, resolveMediaUrl } from '../../api/content/travelContentClient';

type ProductItem = { id: number; name: string; desc: string; price: string; img: string };

const DEFAULT_CITIES = [
  { id: 1, name: '北京' },
  { id: 2, name: '西安' },
];

const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 1001,
    name: '宫苑纹样书签',
    desc: '取自古建窗棂与花草纹样，适合作为旅行纪念礼。',
    price: '¥39',
    img: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500',
  },
  {
    id: 1002,
    name: '城市印象明信片',
    desc: '把亲子旅途中值得记住的片段，留在纸面和邮戳里。',
    price: '¥29',
    img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500',
  },
];

export default function Products() {
  const [cities, setCities] = useState<{ id: number; name: string }[]>(DEFAULT_CITIES);
  const [activeCityId, setActiveCityId] = useState<number | null>(DEFAULT_CITIES[0].id);
  const [activeCityName, setActiveCityName] = useState(DEFAULT_CITIES[0].name);
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    contentApi.cities().then((res) => {
      const list = res.records.map((c) => ({ id: Number(c.id), name: String(c.name) }));
      if (list.length) {
        setCities(list);
        setActiveCityId(list[0].id);
        setActiveCityName(list[0].name);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeCityId) return;
    contentApi.products({ cityId: activeCityId, keyword: searchQuery || undefined, pageSize: 50 }).then((res) => {
      setProducts(res.records.map((p) => ({
        id: Number(p.id),
        name: String(p.title || '文创商品'),
        desc: String(p.summary || ''),
        price: p.price != null ? `¥${p.price}` : '¥0',
        img: resolveMediaUrl(String(p.coverImage || '')),
      })));
    }).catch(() => setProducts(DEFAULT_PRODUCTS));
  }, [activeCityId, searchQuery]);

  const filtered = useMemo(() => products, [products]);

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
  }

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
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => { setActiveCityId(city.id); setActiveCityName(city.name); }}
              className={`py-6 relative text-center transition-all duration-300 ${
                activeCityId === city.id
                  ? 'text-[#4A8C6F] font-extrabold bg-gradient-to-r from-transparent to-[#7BBF9E]/10'
                  : 'text-[#1A1A1A]/60 font-bold hover:bg-white/50 hover:text-[#1A1A1A]'
              }`}
            >
              {activeCityId === city.id && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-gradient-to-b from-[#4A8C6F] to-[#7BBF9E] rounded-r-md shadow-[2px_0_8px_rgba(74,140,111,0.4)]"></div>
              )}
              {city.name}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#1A1A1A] to-[#4A8C6F] tracking-wide">
              {activeCityName || '城市'} 推荐文创
            </h2>
          </div>
          
          <div className="flex flex-col gap-5">
            {filtered.length > 0 ? filtered.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="flex gap-4 p-3 rounded-2xl bg-white/80 border border-white shadow-[0_4px_16px_rgba(74,140,111,0.08)] hover:shadow-[0_8px_24px_rgba(74,140,111,0.15)] transition-all cursor-pointer group"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-[#7BBF9E]/10">
                  <img src={product.img || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 sepia-[.1]" />
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <h3 className="font-bold text-[#1A1A1A] text-base mb-1 group-hover:text-[#4A8C6F] transition-colors">{product.name}</h3>
                  <p className="text-xs text-[#1A1A1A]/60 line-clamp-2 mb-2">{product.desc}</p>
                  <span className="text-[#C8963E] font-extrabold text-sm">{product.price}</span>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl bg-white/80 border border-white p-6 text-center shadow-[0_4px_16px_rgba(74,140,111,0.08)]">
                <div className="text-[#1A1A1A] font-extrabold mb-2">暂无匹配商品</div>
                <div className="text-xs text-[#1A1A1A]/50">换个关键词试试，或切换城市看看。</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
