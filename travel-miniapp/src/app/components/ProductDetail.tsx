import { ArrowLeft, Share, Star, MessageCircle } from 'lucide-react';
import Taro from '@tarojs/taro';

interface ProductDetailProps {
  onBack: () => void;
  product: {
    id: number;
    name: string;
    desc: string;
    price: string;
    img: string;
  };
}

export default function ProductDetail({ onBack, product }: ProductDetailProps) {
  const showSoon = (title: string) => {
    Taro.showToast({ title: `${title}已记录，后续接入订单中心`, icon: 'none' });
  };

  return (
    <div className="h-screen flex flex-col bg-[#FDFCF8] text-[#1A1A1A] absolute inset-0 z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#7BBF9E]/30 bg-[#FDFCF8]/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-[#F5E6C8]/40 rounded-full text-[#4A8C6F] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-[#4A8C6F]">文创详情</h1>
        <button
          onClick={() => Taro.showShareMenu({ withShareTicket: true }).catch(() => Taro.showToast({ title: '请使用微信右上角分享', icon: 'none' }))}
          className="p-2 hover:bg-[#F5E6C8]/40 rounded-full text-[#4A8C6F] transition-colors"
        >
          <Share className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Hero Image Section */}
        <div className="relative h-80 border-b border-[#7BBF9E]/30 bg-[#F5E6C8]/20 flex items-center justify-center overflow-hidden">
          <img 
            src={product.img} 
            alt={product.name} 
            className="absolute inset-0 w-full h-full object-cover sepia-[.15]"
          />
        </div>

        {/* Title & Info Section */}
        <div className="p-5 border-b border-[#7BBF9E]/30 bg-white">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-extrabold text-[#1A1A1A]">{product.name}</h2>
          </div>
          <p className="text-sm text-[#1A1A1A]/80 leading-relaxed mb-4">
            {product.desc}
          </p>
          <div className="flex items-end gap-2">
            <span className="font-black text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#C8963E] to-[#E6B964] drop-shadow-sm">{product.price}</span>
            <span className="text-[#1A1A1A]/50 text-sm mb-1 line-through">¥{(parseInt(product.price.replace('¥', '')) * 1.5).toFixed(0)}</span>
          </div>
        </div>

        {/* Product Details Description */}
        <div className="p-5 border-b border-[#7BBF9E]/30 bg-[#FDFCF8]">
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#4A8C6F] rounded-full"></span>
            商品详情
          </h3>
          <p className="text-sm leading-relaxed text-[#1A1A1A]/90 text-justify mb-4">
            此款文创产品融合了传统国风元素与现代实用设计。选材考究，做工精良，每一处细节都彰显着匠心独运。无论是作为馈赠亲友的佳品，还是自我收藏的留念，皆是不二之选。
          </p>
          <div className="bg-[#F5E6C8]/30 p-4 rounded-xl border border-[#7BBF9E]/20 text-sm text-[#4A8C6F]">
            <ul className="space-y-2">
              <li className="flex justify-between"><span>发货地</span> <span>北京/西安/上海</span></li>
              <li className="flex justify-between"><span>快递说明</span> <span>顺丰包邮，48小时内发货</span></li>
              <li className="flex justify-between"><span>售后服务</span> <span>支持7天无理由退换</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FDFCF8] border-t border-[#7BBF9E]/30 max-w-[560px] mx-auto z-30 shadow-[0_-4px_16px_rgba(74,140,111,0.08)] pb-safe">
        <div className="flex h-16">
          <div className="flex flex-1 items-center justify-around border-r border-[#7BBF9E]/30">
            <button onClick={() => showSoon('收藏')} className="flex flex-col items-center justify-center flex-1 h-full hover:bg-[#F5E6C8]/30 text-[#4A8C6F] transition-colors group">
              <Star className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold">收藏</span>
            </button>
            <div className="w-px h-8 bg-[#7BBF9E]/30"></div>
            <button onClick={() => Taro.makePhoneCall({ phoneNumber: '4000000000' })} className="flex flex-col items-center justify-center flex-1 h-full hover:bg-[#F5E6C8]/30 text-[#4A8C6F] transition-colors group">
              <MessageCircle className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold">客服</span>
            </button>
          </div>
          <button onClick={() => showSoon('购买意向')} className="flex-[1.5] bg-gradient-to-r from-[#4A8C6F] to-[#7BBF9E] text-white font-bold text-lg hover:shadow-[0_4px_12px_rgba(74,140,111,0.4)] transition-all flex items-center justify-center gap-2">
            <span>立即购买</span>
          </button>
        </div>
      </div>
    </div>
  );
}
